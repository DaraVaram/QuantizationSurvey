#!/usr/bin/env python3
"""Generate the TMLR Beyond PDF submission package from index.html.

index.html stays the source of truth and the local preview. This script
reshapes it into the layout the Author Kit expects:

    submission_folder/
    ├── submission.md                      front matter + the <d-article> body
    └── assets
        ├── bibliography/submission.bib    references.bib, renamed
        └── html/submission/*.js           data.js, supplements.js, figs.js

and zips it as submission_folder.zip. The kit's compile_submission.py then
copies these into its Jekyll site, where the distill layout supplies the
head, title, byline, bibliography element and citation list that index.html
carries by hand.

Usage:  python3 tools/build_submission.py [--out DIR] [--kit KIT_DIR]

  --out   where submission_folder/ and submission_folder.zip are written
          (default: dist/, which is gitignored so a stale package never
          lingers in the repo)
  --kit   an unpacked tmlr-beyond-pdf-author-kit; the generated folder
          replaces its submission_folder/ so `python compile_submission.py`
          (Docker) builds and serves the page exactly as TMLR will.

The archival PDF must come from the browser's own Print to PDF on the
compiled page, per the kit's instructions, so it is not produced here.
"""
import argparse
import html
import json
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, "index.html")
BIB = os.path.join(ROOT, "assets", "bibliography", "references.bib")
SCRIPTS = ["data.js", "supplements.js", "figs.js"]      # load order matters


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def front_matter_json(src):
    m = re.search(r"<d-front-matter>\s*<script[^>]*>(.*?)</script>", src, re.S)
    if not m:
        sys.exit("no <d-front-matter> block in index.html")
    return json.loads(m.group(1))


def title_teaser(src):
    """The one-paragraph description index.html shows under the title. The kit
    places `description` in the same spot, and the body carries the full
    abstract as its own section, so the full abstract would appear twice."""
    m = re.search(r"<d-title>.*?<p>(.*?)</p>", src, re.S)
    if not m:
        sys.exit("<d-title> description not found")
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m.group(1))).strip())


def page_styles(src):
    """The paper-specific <style> block from <head>."""
    m = re.search(r'<!-- Paper-specific styles -->\s*<style type="text/css">(.*?)</style>', src, re.S)
    if not m:
        sys.exit("paper-specific <style> block not found")
    return m.group(1).strip("\n")


def article_body(src):
    a = src.find("<d-article>")
    b = src.find("</d-article>", a)
    if a < 0 or b < 0:
        sys.exit("<d-article> not found")
    return src[a + len("<d-article>"):b]


def strip_comments(body):
    return re.sub(r"<!--.*?-->", "", body, flags=re.S)


def dedent(body):
    """index.html indents the article under <d-article>. kramdown reads four
    leading spaces as a code block, so every line loses its indentation; no
    element in the body is whitespace-sensitive."""
    return re.sub(r"^[ \t]+", "", body, flags=re.M)


def strip_cache_busters(text):
    return re.sub(r"\?v=[0-9A-Za-z-]+", "", text)


def wrap_equations(body):
    """Display equations sit at top level as bare text. kramdown would treat
    them as Markdown and eat the backslashes, so each one becomes a raw HTML
    block that kramdown passes through untouched."""
    pat = re.compile(r"^(\\begin\{(equation|align)\*?\}.*?^\\end\{\2\*?\})", re.S | re.M)
    return pat.sub(lambda m: '<div class="eqn">\n' + m.group(1) + "\n</div>", body)


def yaml_quote(s):
    return json.dumps(s, ensure_ascii=False)


def build(out_dir):
    src = read(INDEX)
    fm = front_matter_json(src)
    title = fm["title"]
    description = title_teaser(src)

    body = article_body(src)
    body = strip_comments(body)
    body = dedent(body)
    body = strip_cache_busters(body)
    body = wrap_equations(body)
    body = body.strip("\n")

    # Scripts the figures and tables need, served from the kit's html folder.
    script_tags = "\n".join(
        "<script src=\"{{ '/assets/html/submission/%s' | relative_url }}\"></script>" % name
        for name in SCRIPTS
    )

    styles = page_styles(src)
    styles_block = "\n".join("  " + line if line.strip() else "" for line in styles.split("\n"))

    md = "\n".join([
        "---",
        "layout: distill",
        "title: " + yaml_quote(title),
        "description: " + yaml_quote(description),
        "htmlwidgets: true",
        "",
        "# Anonymous for review; the kit fills the byline from this.",
        "authors:",
        "  - name: Anonymous",
        "    affiliations:",
        "      name: Anonymous",
        "",
        "# Must stay submission.bib.",
        "bibliography: submission.bib",
        "",
        "# Paper-specific styles; the layout places these in <head>.",
        "_styles: |",
        styles_block,
        "---",
        "",
        body,
        "",
        script_tags,
        "",
    ])

    sub = os.path.join(out_dir, "submission_folder")
    if os.path.exists(sub):
        shutil.rmtree(sub)
    os.makedirs(os.path.join(sub, "assets", "bibliography"))
    os.makedirs(os.path.join(sub, "assets", "html", "submission"))
    os.makedirs(os.path.join(sub, "assets", "img", "submission"))
    os.makedirs(os.path.join(sub, "assets", "gif", "submission"))

    with open(os.path.join(sub, "submission.md"), "w", encoding="utf-8") as f:
        f.write(md)
    shutil.copyfile(BIB, os.path.join(sub, "assets", "bibliography", "submission.bib"))
    for name in SCRIPTS:
        js = strip_cache_busters(read(os.path.join(ROOT, "assets", "js", name)))
        with open(os.path.join(sub, "assets", "html", "submission", name), "w", encoding="utf-8") as f:
            f.write(js)
    # The kit skips empty folders when copying but expects them to exist.
    for d in ("img", "gif"):
        open(os.path.join(sub, "assets", d, "submission", ".gitkeep"), "w").close()

    zip_path = os.path.join(out_dir, "submission_folder.zip")
    if os.path.exists(zip_path):
        os.remove(zip_path)
    subprocess.run(["zip", "-qr", "-X", zip_path, "submission_folder", "-x", "*.DS_Store"], cwd=out_dir, check=True)

    n_comments = len(re.findall(r"<!--", article_body(src)))
    print("submission.md: %d chars, %d equations wrapped, %d comments stripped"
          % (len(md), len(re.findall(r'<div class="eqn">', md)), n_comments))
    print("wrote", zip_path, "(%d KB)" % (os.path.getsize(zip_path) // 1024))
    return sub


def install_into_kit(sub, kit_dir):
    target = os.path.join(kit_dir, "submission_folder")
    if not os.path.exists(os.path.join(kit_dir, "compile_submission.py")):
        sys.exit("%s does not look like the author kit (no compile_submission.py)" % kit_dir)
    if os.path.exists(target):
        shutil.rmtree(target)
    shutil.copytree(sub, target)
    print("installed into", target)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(ROOT, "dist"), help="where to write submission_folder/ and the zip")
    ap.add_argument("--kit", help="unpacked author kit to install the folder into")
    args = ap.parse_args()
    os.makedirs(os.path.abspath(args.out), exist_ok=True)
    folder = build(os.path.abspath(args.out))
    if args.kit:
        install_into_kit(folder, os.path.abspath(args.kit))
