#!/usr/bin/env python3
"""Bring the website's figures and tables in step with the revised paper.

The paper's LaTeX source is the only source of truth. This reads the
manuscript (main.tex), the compiled numbering (response.aux), the PRISMA
counts (prisma_counts.tex) and the year counts (fig_years.tex) from the paper
repository, and rewrites every block of index.html that sits between a pair
of markers

    <!-- paper:NAME -->  ...  <!-- /paper:NAME -->

with freshly generated HTML. Tables are converted cell by cell from the
LaTeX, captions are copied from the paper, and figure and table numbers come
from the .aux file, so the page cannot drift from the PDF.

    python3 tools/paper_sync.py ../QuantizationSurveyResponse
"""
import html
import json
import re
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]


# ---------------------------------------------------------------- LaTeX text

def strip_comments(tex):
    out = []
    for line in tex.split("\n"):
        m = re.search(r"(?<!\\)%", line)
        out.append(line[:m.start()] if m else line)
    return "\n".join(out)


def group(s, i):
    """s[i] == '{': return (content, index after the closing brace)."""
    assert s[i] == "{", s[i:i + 30]
    depth, j = 0, i
    while j < len(s):
        c = s[j]
        if c == "\\":
            j += 2
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return s[i + 1:j], j + 1
        j += 1
    raise ValueError("unbalanced braces: " + s[i:i + 60])


def unwrap(s, cmd, fn=lambda x: x, nargs=1):
    """Replace every \\cmd{a}{b}... (nargs groups) by fn(a, b, ...)."""
    pat = re.compile(r"\\" + cmd + r"(?![A-Za-z])\s*")
    while True:
        m = pat.search(s)
        if not m:
            return s
        j, args = m.end(), []
        for _ in range(nargs):
            while j < len(s) and s[j] in " \n":
                j += 1
            a, j = group(s, j)
            args.append(a)
        s = s[:m.start()] + fn(*args) + s[j:]


class Paper:
    def __init__(self, root):
        self.root = Path(root)
        self.raw = (self.root / "main.tex").read_text()
        self.tex = strip_comments(self.raw)
        aux = (self.root / "response.aux").read_text()
        self.num = dict(re.findall(r"\\newlabel\{([^}]+)\}\{\{([^}]*)\}", aux))
        pv = (self.root / "protocol_values.tex").read_text()
        self.macros = dict(re.findall(r"\\def\\(\w+)\{([^}]*)\}", pv))
        pc = (self.root / "prisma_counts.tex").read_text()
        self.counts = {k: int(v) for k, v in re.findall(r"prisma@(\w+)\\endcsname\{(\d+)\}", pc)}
        self.lists = dict(re.findall(r"prisma@(\w+_rows)\\endcsname\{(.*)\}", pc))

    # -- inline LaTeX to HTML
    def inline(self, s):
        s = s.strip()
        s = s.replace("\\protect", "")
        s = unwrap(s, "webcaptionlink", lambda lab, text: text, nargs=2)
        for c in ("rev", "dararev", "arielrev", "mbox", "taxitem", "normalfont"):
            s = unwrap(s, c)
        s = re.sub(r"\\(searchdate|querycap)\{\}", lambda m: self.macros[m.group(1)], s)
        s = re.sub(r"\\(searchdate|querycap)(?![A-Za-z])", lambda m: self.macros[m.group(1)], s)
        # textual citations, as the paper prints them in the study column
        s = re.sub(r"\\citeauthor\{([^}]+)\}\s*(?:\\\\)?\s*\\citeyearpar\{\1\}",
                   lambda m: '<d-cite key="%s" data-cite="textual"></d-cite>' % m.group(1), s)
        s = unwrap(s, "citet", lambda k: '<d-cite key="%s" data-cite="textual"></d-cite>' % k.replace(" ", ""))
        s = unwrap(s, "citep", lambda k: '<d-cite key="%s"></d-cite>' % k.replace(" ", ""))
        s = unwrap(s, "cite", lambda k: '<d-cite key="%s"></d-cite>' % k.replace(" ", ""))
        s = unwrap(s, "tabtop", lambda x: x.replace("\\\\", "<br>"))
        s = unwrap(s, "tabstack", lambda x: x.replace("\\\\", "<br>"))
        s = unwrap(s, "textbf", lambda x: "<b>%s</b>" % x)
        s = unwrap(s, "textit", lambda x: "<i>%s</i>" % x)
        s = unwrap(s, "emph", lambda x: "<i>%s</i>" % x)
        s = unwrap(s, "textsc", lambda x: x)
        s = re.sub(r"(Table|Fig\.|Section|Sections)~?\\ref\{([^}]+)\}",
                   lambda m: self.ref(m.group(1), m.group(2)), s)
        s = unwrap(s, "ref", lambda k: self.num.get(k, "?"))
        s = re.sub(r"\$([^$]*)\$", lambda m: self.math(m.group(1)), s)
        s = s.replace("\\newline", "<br>").replace("\\\\", "<br>")
        s = s.replace("---", "\u2014").replace("--", "\u2013").replace("~", "\u00a0")
        s = s.replace("\\%", "%").replace("\\&", "&amp;").replace("\\_", "_").replace("\\#", "#")
        s = s.replace("\\,", "\u2009").replace("\\ ", " ").replace("``", "\u201c").replace("''", "\u201d")
        s = re.sub(r"\\u\{a\}", "\u0103", s)
        s = re.sub(r"\\textcommabelow\{s\}", "\u0219", s)
        s = re.sub(r"\\\^\{?e\}?", "\u00ea", s)
        s = re.sub(r"\\(?:centering|raggedright|small|footnotesize|hfill|noindent)(?![A-Za-z])", "", s)
        if re.search(r"\\[A-Za-z]", re.sub(r"\\\(.*?\\\)", "", s)):
            raise ValueError("unconverted LaTeX: " + s[:200])
        parts = re.split(r"(\\\(.*?\\\))", s)
        s = "".join(x if x.startswith("\\(") else x.replace("{", "").replace("}", "") for x in parts)
        return re.sub(r"\s+", " ", s).strip()

    def math(self, m):
        t = m.strip()
        # letters are variables: leave them to MathJax, as the site's own captions do
        if re.search(r"[A-Za-z]", re.sub(r"\\(Delta|times|pm|approx|dagger|ddagger|leq|geq|sim|cdot)\b", "", t)) \
                and not re.fullmatch(r"\\Delta\s*W", t):
            return "\\(" + m + "\\)"
        rep = {r"\Delta": "\u0394", r"\times": "\u00d7", r"\pm": "\u00b1", r"\approx": "\u2248",
               r"\leq": "\u2264", r"\geq": "\u2265", r"\alpha": "\u03b1", r"\beta": "\u03b2",
               r"\dagger": "\u2020", r"\ddagger": "\u2021", r"\mu": "\u03bc", r"\sim": "~", r"\cdot": "\u00b7"}
        for k, v in rep.items():
            t = t.replace(k, v)
        t = re.sub(r"\^\{?([^}]*)\}?", r"<sup>\1</sup>", t)
        t = re.sub(r"_\{?([^}]*)\}?", r"<sub>\1</sub>", t)
        t = t.replace("-", "\u2212").replace("{", "").replace("}", "")
        if "\\" in t:
            return "\\(" + m + "\\)"
        return t.replace(" ", "")

    def ref(self, word, key):
        n = self.num.get(key, "?")
        kind = "table" if key.startswith("tab:") else "figure" if key.startswith("fig:") else None
        # Fig. 1 and the two taxonomy trees are left to the paper, so they are not links here
        if word in ("Section", "Sections") or key in ("fig:1", "fig:10", "fig:15"):
            return "%s\u00a0%s" % (word, n)
        return '<a href="#%s-%s">%s\u00a0%s</a>' % (kind, n, word, n)

    # -- tables
    def table_source(self, label):
        """(caption, body) of the live table whose \\label is `label`."""
        i = self.tex.index("\\label{%s}" % label)
        c = self.tex.rindex("\\caption", 0, i)
        cap, _ = group(self.tex, self.tex.index("{", c))
        start = min(self.tex.find(k, c) for k in ("\\begin{tabular", "\\begin{longtable")
                    if self.tex.find(k, c) != -1)
        if "\\begin{longtable" in self.tex[c - 4000:i] and self.tex.rfind("\\begin{longtable", 0, i) > c - 4000:
            start = self.tex.rfind("\\begin{longtable", 0, i)
        env = re.match(r"\\begin\{(\w+)\}", self.tex[start:]).group(1)
        end = self.tex.index("\\end{%s}" % env, start)
        body = self.tex[start:end]
        # skip the column spec
        j = start + len("\\begin{%s}" % env)
        k = j - start
        if env == "tabularx":
            _, k2 = group(self.tex, j)
            j = k2
        _, j = group(self.tex, j)
        body = self.tex[j:end]
        return cap, env, body

    def rows(self, body, env):
        if env == "longtable":
            body = re.sub(r"\\caption\{.*?\\\\", "", body, count=1, flags=re.S)
            a = body.index("\\endfirsthead")
            b = max(body.rfind(x) for x in ("\\endhead", "\\endfoot", "\\endlastfoot"))
            body = body[:a] + body[b:].split("\n", 1)[1]
        body = re.sub(r"\\(endhead|endfoot|endlastfoot|endfirsthead)", "", body)
        out, depth, cur, i = [], 0, "", 0
        while i < len(body):
            c = body[i]
            if c == "\\" and body[i:i + 2] == "\\\\" and depth == 0:
                out.append(cur)
                cur, i = "", i + 2
                if body[i:i + 1] == "*":
                    i += 1
                continue
            if c == "\\":
                cur += body[i:i + 2]
                i += 2
                continue
            depth += c == "{"
            depth -= c == "}"
            cur += c
            i += 1
        out.append(cur)
        rows = []
        for r in out:
            rule = "rule" if re.search(r"\\midrule", r) else "thin" if re.search(r"\\cmidrule", r) else False
            r = re.sub(r"\\(toprule|midrule|bottomrule|rowgap|hline)(?![A-Za-z])", "", r)
            r = re.sub(r"\\cmidrule(\[[^]]*\])?(\([^)]*\))?\{[^}]*\}", "", r)
            r = re.sub(r"\\addlinespace(\[[^]]*\])?", "", r)
            r = re.sub(r"\\noalign\{[^}]*\}", "", r)
            if r.strip():
                rows.append((rule, r))
            elif rule:
                rows.append((rule, None))
        return rows

    def cells(self, row):
        out, depth, cur, i = [], 0, "", 0
        while i < len(row):
            c = row[i]
            if c == "\\":
                cur += row[i:i + 2]
                i += 2
                continue
            if c == "&" and depth == 0:
                out.append(cur)
                cur = ""
            else:
                depth += c == "{"
                depth -= c == "}"
                cur += c
            i += 1
        out.append(cur)
        return out

    def table_html(self, label, opts=None):
        opts = opts or {}
        cap, env, body = self.table_source(label)
        rows = [r for r in self.rows(body, env)]
        n = self.num[label]
        head, data, rule_next = None, [], False
        for rule, r in rows:
            if r is None:
                rule_next = rule
                continue
            cells = self.cells(r)
            if head is None:
                head = cells
                rule_next = False
                continue
            m = re.match(r"\s*\\multicolumn\{(\d+)\}\{[^}]*\}\{(.*)\}\s*$", r, re.S)
            if m and len(cells) == 1:
                data.append(("group", self.inline(m.group(2)), int(m.group(1))))
            else:
                data.append(("row", [self.cell(c, opts) for c in cells], (rule or rule_next) if data else False))
            rule_next = False
        cls = opts.get("cls", "ptable")
        attrs = " data-sortable" if opts.get("sortable") else ""
        th = lambda c: re.sub(r"</?b>", "", self.inline(c))
        heads = [th(c) for c in head]
        groups = any(it[0] == "group" for it in data)
        # a family heading row becomes a first "family" column with rowspan,
        # the convention of the site's other grouped tables
        body_rows, fam, run = [], None, []
        if groups:
            heads = [opts.get("famhead", "Family")] + heads
            for it in data:
                if it[0] == "group":
                    fam = re.sub(r"</?b>", "", it[1])
                    run = []
                    body_rows.append([fam, run])
                else:
                    run.append(it[1])
        elif opts.get("famcol"):
            for it in data:
                cells = it[1]
                if cells[0].strip():
                    run = []
                    body_rows.append([re.sub(r"</?b>", "", cells[0]), run])
                run.append(cells[1:])
        h = ['<div class="ptable-wrap l-page" id="table-%s">' % n,
             '<table class="%s"%s>' % (cls, attrs),
             "<caption><b>Table %s:</b> %s</caption>" % (n, self.inline(cap)),
             "<thead><tr>" + "".join("<th>%s</th>" % c for c in heads) + "</tr></thead>",
             "<tbody>"]
        if body_rows:
            for gi, (name, rows_) in enumerate(body_rows):
                for ri, cells in enumerate(rows_):
                    tr = '<tr class="rule">' if (ri == 0 and gi > 0) else "<tr>"
                    first = ('<td class="fam" rowspan="%d">%s</td>' % (len(rows_), name)) if ri == 0 else ""
                    h.append(tr + first + "".join("<td>%s</td>" % c for c in cells) + "</tr>")
        else:
            for it in data:
                _, cells, rule = it
                h.append(('<tr class="%s">' % rule if rule else "<tr>")
                         + "".join("<td>%s</td>" % c for c in cells) + "</tr>")
        h += ["</tbody>", "</table>", "</div>"]
        return "\n".join(h)

    def cell(self, c, opts):
        if "\\crit" in c:
            items = []
            unwrap(c, "crit", lambda x: items.append(self.inline(x)) or "")
            return '<ul class="cell-list">' + "".join("<li>%s</li>" % x for x in items) + "</ul>"
        v = self.inline(c)
        return "\u2013" if v in ("\u2013", "-") else v

    def caption(self, label):
        """Caption of a figure, from its \\caption before \\label."""
        i = self.tex.index("\\label{%s}" % label)
        c = self.tex.rindex("\\caption", 0, i)
        j = self.tex.index("{", c)
        cap, _ = group(self.tex, j)
        return self.inline(re.sub(r"\\prismastatus", "", cap))


# ---------------------------------------------------------------- figures

STREAMS = [("M", "Methods", "#7EA6E0"), ("F", "Formats", "#97D077"),
           ("P", "Platforms and tools", "#FFB570"), ("D", "Deployments", "#EA6B66")]
ID_, IDL = "#E1D5E7", "#9673A6"
SC, SCL = "#D4EEF0", "#3E9AA3"
EX, EXL = "#F5F5F5", "#999999"
IN_, INL = "#F4EBDD", "#8E7C5F"
esc = lambda t: html.escape(t, quote=True)


def prisma_svg(p):
    """Fig. 10, drawn from the same counts as the paper's figure. Every box
    explains itself on hover, and each stream row in the identified and
    included boxes lights up the same stream in both."""
    c = p.counts
    f = lambda k: "{:,}".format(c[k])

    def rows(key):
        return re.findall(r"(.*?) \(\$n\$~=~([\d,]+)\)\\\\", p.lists[key])
    sec = {"M": p.num["sec:advanced"], "F": p.num["sec:alt-formats"],
           "P": p.num["sec:deployment-stack"], "D": p.num["sec:applications"]}
    o = ['<svg viewBox="0 0 1000 905" role="img" aria-label="PRISMA flow diagram (interactive)">',
         '<defs><marker id="pr-a" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">'
         '<path d="M0,0 L7,3 L0,6 Z" fill="#777"/></marker></defs>']
    A = o.append

    def box(x, y, w, h, fill, stroke, title, sub, tip, items=(), sw=1.4, cls="pr-box"):
        A('<g class="%s" data-tip="%s" tabindex="0" role="note">' % (cls, esc(tip)))
        A('<rect x="%d" y="%d" width="%d" height="%d" rx="5" fill="%s" stroke="%s" stroke-width="%s"/>'
          % (x, y, w, h, fill, stroke, sw))
        ty = y + 24
        if items:
            A('<text x="%d" y="%d" font-size="15" text-anchor="middle" font-weight="600">%s</text>' % (x + w / 2, ty, title))
            if sub:
                ty += 20
                A('<text x="%d" y="%d" font-size="15" text-anchor="middle">%s</text>' % (x + w / 2, ty, sub))
        else:
            ty = y + h / 2 - 3
            A('<text x="%d" y="%d" font-size="15" text-anchor="middle">%s</text>' % (x + w / 2, ty, title))
            A('<text x="%d" y="%d" font-size="15" text-anchor="middle" font-weight="600">%s</text>' % (x + w / 2, ty + 20, sub))
        A("</g>")
        for i, it in enumerate(items):
            yy = ty + 22 + i * 20
            if len(it) == 3:                      # stream row: swatch, label, stream key
                label, n, s = it
                col = dict((k, cc) for k, _, cc in STREAMS)[s]
                A('<g class="pr-strm" data-s="%s" tabindex="0" role="button" data-tip="%s">' % (s, esc(stream_tip(p, s))))
                A('<rect x="%d" y="%d" width="%d" height="18" rx="3" fill="transparent" class="pr-strm-bg"/>' % (x + 8, yy - 14, w - 16))
                A('<rect x="%d" y="%d" width="12" height="12" fill="%s" stroke="#555" stroke-width=".6"/>' % (x + 16, yy - 11, col))
                A('<text x="%d" y="%d" font-size="13.5">%s (n = %s)</text>' % (x + 36, yy, label, n))
                A("</g>")
            else:
                A('<text x="%d" y="%d" font-size="13.5">%s (n = %s)</text>' % (x + 16, yy, it[0], it[1]))

    def arrow(d):
        A('<path d="%s" fill="none" stroke="#777" stroke-width="1.5" marker-end="url(#pr-a)"/>' % d)

    db = [("Scopus", f("db_scopus")), ("IEEE Xplore", f("db_ieee")), ("ACM Digital Library", f("db_acm")),
          ("arXiv", f("db_arxiv")), ("Google Scholar", f("db_scholar"))]
    MX, MW, SX, SW = 230, 400, 672, 318      # main column, side column
    cx = MX + MW // 2
    box(55, 15, 410, 175, ID_, IDL, "Records identified through database searches", "(n = %s)" % f("db"),
        "<b>Database searches.</b> Five databases, queried in three steps with the keywords of Table %s and the "
        "names they turned up. For each query, the first %s results in the database's own ranking were kept."
        % (p.num["tab:keywords"], p.macros["querycap"]), db)
    box(505, 15, 410, 175, ID_, IDL, "Records identified through other methods", "(n = %s)" % f("other"),
        "<b>Other methods.</b> Works cited by the earlier surveys of Table %s and by included studies, vendor "
        "documentation for the devices and toolchains, and direct title searches." % p.num["tab:1"],
        rows("other_rows"))
    A('<path d="M260,190 V212 H710 V190" fill="none" stroke="#777" stroke-width="1.5"/>')
    A('<path d="M485,212 V224 H%d" fill="none" stroke="#777" stroke-width="1.5"/>' % cx)
    arrow("M%d,224 V236" % cx)
    box(MX, 238, MW, 128, ID_, IDL, "Records identified in total (n = %s)" % f("identified"), None,
        "<b>Identified.</b> Each record counts once, under the stream whose search found it.",
        [(n, f("id_" + s), s) for s, n, _ in STREAMS])
    box(SX, 272, SW, 60, EX, EXL, "Duplicates removed", "(n = %s)" % f("duplicates"),
        "<b>Duplicates</b> were removed by title, matching by hand the versions of a work published under "
        "different titles. The peer-reviewed version of a preprint is the one kept.")
    arrow("M%d,302 H%d" % (MX + MW, SX - 2))
    arrow("M%d,366 V400" % cx)
    box(MX, 402, MW, 60, SC, SCL, "Records screened", "(n = %s)" % f("all_screened"),
        "<b>Screened</b> on title and abstract against the eligibility criteria of Table %s." % p.num["tab:eligibility"])
    box(SX, 402, SW, 60, EX, EXL, "Excluded at title and abstract", "(n = %s)" % f("ta_excluded"),
        "<b>Excluded at title and abstract</b> as clearly outside the criteria of Table %s." % p.num["tab:eligibility"])
    arrow("M%d,432 H%d" % (MX + MW, SX - 2))
    arrow("M%d,462 V496" % cx)
    box(MX, 498, MW, 60, SC, SCL, "Reports sought for retrieval", "(n = %s)" % f("fulltext"),
        "<b>Sought for retrieval.</b> The full texts of the records that passed screening, together with the "
        "records found by other methods.")
    box(SX, 498, SW, 60, EX, EXL, "Reports not retrieved", "(n = %s)" % f("all_not_retrieved"),
        "<b>Not retrieved.</b> No full text could be obtained, so these were not assessed.")
    arrow("M%d,528 H%d" % (MX + MW, SX - 2))
    reasons = rows("reason_rows")
    eh = 44 + 20 * len(reasons)
    arrow("M%d,558 V640" % cx)
    box(MX, 642, MW, 60, SC, SCL, "Reports assessed for eligibility", "(n = %s)" % f("all_assessed"),
        "<b>Assessed</b> on the full text against every criterion of Table %s." % p.num["tab:eligibility"])
    ey = 672 - eh // 2
    box(SX, ey, SW, eh, EX, EXL, "Reports excluded (n = %s)" % f("assessed_excluded"), None,
        "<b>Excluded at full text</b>, by the first criterion each report failed.", reasons)
    arrow("M%d,672 H%d" % (MX + MW, SX - 2))
    arrow("M%d,702 V752" % cx)
    box(MX, 754, MW, 128, IN_, INL, "Studies included in the review (n = %s)" % f("included"), None,
        "<b>Included.</b> Every included study is cited in the section of its stream.",
        [("Section %s, %s" % (sec[s], n.lower()), f("inc_" + s), s) for s, n, _ in STREAMS], sw=2.2)
    for y1, y2, name, col in ((15, 366, "Identification", IDL), (402, 702, "Screening", SCL), (754, 882, "Inclusion", INL)):
        A('<rect x="8" y="%d" width="32" height="%d" rx="4" fill="%s"/>' % (y1, y2 - y1, col))
        A('<text x="24" y="%d" font-size="14" fill="#fff" font-weight="600" text-anchor="middle" '
          'transform="rotate(-90 24 %d)">%s</text>' % ((y1 + y2) // 2 + 5, (y1 + y2) // 2, name))
    A("</svg>")
    return "\n".join(o)


def stream_tip(p, s):
    c = p.counts
    name = dict((k, n) for k, n, _ in STREAMS)[s]
    sec = {"M": "sec:advanced", "F": "sec:alt-formats", "P": "sec:deployment-stack", "D": "sec:applications"}[s]
    share = 100.0 * c["inc_" + s] / c["id_" + s]
    return ("<b>%s</b> (Section %s)<br>%s records identified, %s studies included (%.1f%%)."
            % (name, p.num[sec], "{:,}".format(c["id_" + s]), "{:,}".format(c["inc_" + s]), share))


def years_data(p):
    tex = (p.root / "fig_years.tex").read_text()
    ticks = re.findall(r"\\draw \(-0\.5,([\d.]+)\) -- \(-0\.3,[\d.]+\) node\[[^]]*\] \{(\d+)\}", tex)
    y_top, n_top = max((float(y), int(n)) for y, n in ticks)
    scale = n_top / y_top
    data = {}
    xyear = {float(x): int(y) for x, y in re.findall(r"at \(([\d.]+),0\) \{(\d{4})\}", tex)}
    for s, x1, y1, x2, y2 in re.findall(r"\\fill\[str([MFPD])[^]]*\] \(([\d.]+),([\d.]+)\) rectangle \(([\d.]+),([\d.]+)\)", tex):
        year = xyear.get(round((float(x1) + float(x2)) / 2, 3))
        if year is None:            # legend swatch
            continue
        data.setdefault(year, {})[s] = round((float(y2) - float(y1)) * scale)
    return data


def years_svg(p):
    """Fig. 11: included studies per year, stacked by stream. Hover a segment
    for its count; click a legend entry to show one stream on its own."""
    data = years_data(p)
    years = sorted(data)
    tot = {y: sum(data[y].values()) for y in years}
    top = max(tot.values())
    step = 10 if top <= 80 else 20
    ymax = (top // step + 1) * step
    W, H, L, B, T = 1000, 470, 70, 400, 30
    bw = (W - L - 30) / len(years)
    sy = (B - T) / ymax
    o = ['<svg viewBox="0 0 %d %d" role="img" aria-label="Included studies by year and stream (interactive)">' % (W, H)]
    A = o.append
    for v in range(0, ymax + 1, step):
        y = B - v * sy
        A('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="#e3e3e3" stroke-width="1"/>' % (L, y, W - 20, y))
        A('<text x="%d" y="%.1f" font-size="13" text-anchor="end" fill="#555">%d</text>' % (L - 8, y + 4, v))
    A('<text x="18" y="%d" font-size="13.5" fill="#333" transform="rotate(-90 18 %d)" text-anchor="middle">Included studies</text>' % ((T + B) // 2, (T + B) // 2))
    for i, yr in enumerate(years):
        x = L + i * bw + bw * 0.18
        w = bw * 0.64
        base = B
        A('<g class="yr-col" data-year="%d">' % yr)
        for s, name, col in STREAMS:
            n = data[yr].get(s, 0)
            if not n:
                continue
            h = n * sy
            base -= h
            tip = "<b>%d, %s</b><br>%d of the %d studies included from %d." % (yr, name, n, tot[yr], yr)
            A('<rect class="yr-seg" data-s="%s" data-n="%d" x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" '
              'stroke="#fff" stroke-width="1" data-tip="%s" tabindex="0"/>' % (s, n, x, base, w, h, col, esc(tip)))
        A('<text class="yr-tot" x="%.1f" y="%.1f" font-size="12.5" text-anchor="middle" fill="#333">%d</text>' % (x + w / 2, base - 6, tot[yr]))
        A('<text x="%.1f" y="%d" font-size="13" text-anchor="middle" fill="#333">%d</text>' % (x + w / 2, B + 20, yr))
        A("</g>")
    A('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#333" stroke-width="1.2"/>' % (L, B, W - 20, B))
    lx = L + 10
    for s, name, col in STREAMS:
        A('<g class="yr-leg" data-s="%s" tabindex="0" role="button" aria-pressed="false" '
          'data-tip="Show only %s; click again for all streams.">' % (s, name.lower()))
        A('<rect x="%d" y="%d" width="14" height="14" fill="%s" stroke="#555" stroke-width=".6"/>' % (lx, H - 28, col))
        A('<text x="%d" y="%d" font-size="13.5">%s</text>' % (lx + 20, H - 16, name))
        A("</g>")
        lx += 20 + int(7.4 * len(name)) + 34
    A("</svg>")
    return "\n".join(o)


def taxonomy(p):
    """Section label -> [(subgroup or None, [method names])] from the Fig. 13 tree."""
    i = p.tex.rindex("\\begin{forest}", 0, p.tex.index("Advanced Quantization Techniques, calign"))
    tree = p.tex[i:p.tex.index("\\end{forest}", i)]
    out = {}
    for part in re.split(r"\[\\?(?=(?:\\rev\{)?\\ref\{sec:)", tree)[2:]:
        lab = re.search(r"\\ref\{(sec:[\w-]+)\}", part).group(1)
        subs = []
        for m in re.finditer(r"\[\s*((?:\\rev\{)?[A-Z][\w -]+\}?)\s*\n\s*\[\{(.*?)\}\]\s*\n", part, re.S):
            name = re.sub(r"\\rev\{|\}", "", m.group(1)).strip()
            subs.append((name, items(p, m.group(2))))
        if not subs:
            m = re.search(r"\[\{(.*)\}\]", part, re.S)
            subs.append((None, items(p, m.group(1))))
        out[lab] = subs
    return out


def items(p, s):
    names = []
    for raw in re.findall(r"\\taxitem\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}", s):
        raw = re.sub(r"\\citep\{[^}]*\}", "", raw)
        raw = re.sub(r"\\citeyearpar\{[^}]*\}", "", raw)
        raw = raw.replace("\\ ", " ")
        names.append(p.inline(raw).strip())
    return names


def levers_svg(p):
    """Fig. 12, the paper's own SVG, with each lever, panel and band carrying
    the methods that Fig. 13 lists for it and a pointer to its comparison table."""
    svg = (p.root / "docs/figures/levers.svg").read_text()
    svg = re.sub(r"<!--.*?-->", "", svg, flags=re.S)
    svg = re.sub(r'<svg [^>]*>', '<svg viewBox="0 0 1332 758" role="img" aria-label="The three levers of advanced '
                 'quantization methods (interactive)" font-family="Helvetica, Arial, sans-serif" fill="#000">', svg, count=1)
    tax = taxonomy(p)
    N = lambda k: p.num[k]

    def lst(lab, only=None):
        rows = []
        for sub, names in tax[lab]:
            if only and sub != only:
                continue
            rows.append(("<i>%s:</i> " % sub if sub and not only else "") + ", ".join(names))
        return "<br>".join(rows)
    T = lambda t: "Table\u00a0" + N(t)
    tips = {
        "dial-bits": "<b>Lever 1, bits.</b> How many bits each layer receives.<br><b>%s</b> %s<br><b>%s</b> %s<br><b>%s</b> %s<br>Compared in %s, %s and %s."
        % (N("sec:extreme-low-bit"), lst("sec:extreme-low-bit"), N("sec:mixed-precision"), lst("sec:mixed-precision"),
           N("sec:hw-aware"), lst("sec:hw-aware"), T("tab:family-binary"), T("tab:family-allocation"), T("tab:family-hardware")),
        "dial-data": "<b>Lever 2, data.</b> The shape of the weights and activations on a fixed grid.<br>%s<br>Compared in %s."
        % (lst("sec:redistribution"), T("tab:family-redistribution")),
        "dial-quantizer": "<b>Lever 3, quantizer.</b> The step size, clipping range and rounding of the mapping itself.<br>%s<br>Compared in %s."
        % (lst("sec:quantizer-opt"), T("tab:family-quantizer")),
        "setting-no-data": "<b>%s Data-agnostic quantization.</b> The three levers without the original data.<br>%s<br>Compared in %s."
        % (N("sec:data-agnostic"), lst("sec:data-agnostic"), T("tab:family-datafree")),
        "setting-quantized-training": "<b>%s Integer and quantized training.</b> The levers applied to the backward pass too.<br>%s<br>Compared in %s."
        % (N("sec:int-training"), lst("sec:int-training"), T("tab:family-training")),
    }
    subs = [s for s, _ in tax["sec:redistribution"]]
    for i, sub in enumerate(subs, 1):
        tips["redistribution-5.4.%d" % i] = "<b>%s.%d %s.</b> %s" % (N("sec:redistribution"), i, sub, lst("sec:redistribution", sub))
    qsubs = [s for s, _ in tax["sec:quantizer-opt"]]
    tips["quantizer-reconstruction"] = "<b>%s.1 %s.</b> %s" % (N("sec:quantizer-opt"), qsubs[0], lst("sec:quantizer-opt", qsubs[0]))
    tips["quantizer-learned"] = "<b>%s.2 %s.</b> %s" % (N("sec:quantizer-opt"), qsubs[1], lst("sec:quantizer-opt", qsubs[1]))
    tips["quantizer-baseline"] = "<b>Baseline.</b> Round to nearest, with the step size and clipping range fixed by calibration."
    tips["input-model"] = "<b>Input.</b> The trained FP32 model."
    tips["input-data"] = "<b>Data.</b> Calibration or training data, which every lever may use."
    tips["output-model"] = "<b>Output.</b> An integer model at INT8, at lower bit-widths, or in mixed precision."
    for gid, t in tips.items():
        svg, n = re.subn(r'<g id="%s">' % re.escape(gid),
                         '<g id="%s" class="lv-part" data-tip="%s" tabindex="0" role="note">' % (gid, esc(t)), svg)
        assert n == 1, gid
    return svg.strip()


def subcaptions(p, label):
    """Subfloat captions of a figure, in order: [(letter, caption)]."""
    out = []
    for key, n in p.num.items():
        if re.match(re.escape(label) + r"[a-z]$", key) or (key.startswith("fig:") and re.match(r"\d+[a-z]$", n) and n[:-1] == p.num[label]):
            i = p.tex.find("\\label{%s}" % key)
            if i == -1:
                continue
            j = p.tex.rindex("\\subfloat[", 0, i) + len("\\subfloat[")
            depth, k = 1, j
            while depth:
                depth += {"[": 1, "]": -1}.get(p.tex[k], 0)
                k += 1
            cap = re.sub(r"\\label\{[^}]*\}", "", p.tex[j:k - 1])
            out.append((n[-1], p.inline(cap)))
    return sorted(set(out))


FIG_WRAP = {
    "fig:prisma": ("820px", prisma_svg, "Hover a box for what happened at that stage; hover a stream in the identified or included box to see how many of its records were included."),
    "fig:years": ("860px", years_svg, "Hover a bar segment for its count; click a stream in the legend to show it on its own."),
    "fig:levers": ("100%", levers_svg, "Hover a lever, panel or band for the methods that Figure 13 groups there and the table that compares them."),
}
TABLE_OPTS = {"tab:family-across": {"famcol": 1}, "tab:2": {"famhead": "MCU Family"}}


def deployments(p):
    """DATA.apps, parsed from the deployment tables (the platform hints read it)."""
    fam = {"tab:3": "arm", "tab:4": "riscv", "tab:5": "npu"}
    out = {}
    for lab, key in fam.items():
        rows = []
        for m in re.finditer(r"<tr[^>]*>(.*?)</tr>", p.table_html(lab).split("<tbody>")[1], re.S):
            cells = re.findall(r"<td[^>]*>(.*?)</td>", m.group(1), re.S)
            txt = lambda c: re.sub(r"\s+", " ", re.sub(r"<br>", ", ", re.sub(r"<(?!br)[^>]+>", "", c))).strip(" ,")
            k = re.search(r'key="([^"]+)"', cells[0]).group(1)
            word = lambda c: re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", c)).strip()   # a wrapped phrase
            rows.append({"key": k, "cat": word(cells[1]), "quant": txt(cells[2]), "devices": txt(cells[3]),
                         "fw": txt(cells[4]), "perf": txt(cells[5]), "mem": txt(cells[6]), "lat": txt(cells[7]),
                         "power": txt(cells[8]), "energy": txt(cells[9]), "measured": txt(cells[10])})
        out[key] = rows
    return out


def hardware(p):
    """DATA.hardware, parsed from the platform table (the deployment map reads the widths)."""
    rows = []
    for m in re.finditer(r"<tr[^>]*>(.*?)</tr>", p.table_html("tab:2", TABLE_OPTS["tab:2"]).split("<tbody>")[1], re.S):
        cells = re.findall(r"<td[^>]*>(.*?)</td>", m.group(1), re.S)
        if 'class="fam"' in m.group(1):
            fam = re.sub(r"<[^>]+>", "", cells[0])
            cells = cells[1:]
        txt = lambda c: re.sub(r"\s+", " ", re.sub(r"<br>", " ", re.sub(r"<(?!br)[^>]+>", "", c))).strip()
        rows.append({"family": fam, "platform": txt(cells[0]), "cpu": txt(cells[1]), "accel": txt(cells[2]),
                     "clock": txt(cells[3]), "flash": txt(cells[4]), "ram": txt(cells[5]),
                     "formats": [f.strip() for f in txt(cells[6]).split(",") if f.strip()]})
    return rows


def build(p):
    blocks = {}
    for lab, (width, fn, hint) in FIG_WRAP.items():
        n = p.num[lab]
        blocks[lab] = ('<figure class="pfig" id="figure-%s">\n  <div style="max-width: %s; margin: 0 auto;">%s</div>\n'
                       '  <div class="fig-hint">%s</div>\n  <figcaption><b>Figure %s:</b> %s</figcaption>\n</figure>'
                       % (n, width, fn(p), hint, n, p.caption(lab)))
    # Tables 2-5 (search keywords, eligibility, reporting conventions, family trade-offs)
    # and Table 14 (error models) are reading aids that stay in the paper only.
    for lab in ["tab:family-binary", "tab:family-allocation", "tab:family-hardware", "tab:family-redistribution",
                "tab:family-quantizer", "tab:family-datafree", "tab:family-training", "tab:family-across",
                "tab:2", "tab:3", "tab:4", "tab:5"]:
        t = p.table_html(lab, TABLE_OPTS.get(lab))
        if lab == "tab:2":
            t = re.sub(r'(<td class="fam"[^>]*>[^<]*</td>|<tr[^>]*>)<td>', r'\1<td class="t2-plat">', t)
        blocks[lab] = t
    return blocks


def main(argv):
    p = Paper(argv[1] if len(argv) > 1 else SITE.parent / "QuantizationSurveyResponse")
    page = SITE / "index.html"
    s = page.read_text()
    for lab, b in build(p).items():
        pat = re.compile(r"(<!-- paper:%s -->).*?(<!-- /paper:%s -->)" % (re.escape(lab), re.escape(lab)), re.S)
        s, n = pat.subn(lambda m: m.group(1) + "\n" + b + "\n" + m.group(2), s)
        if n != 1:
            raise SystemExit("marker for %s found %d times" % (lab, n))
    # every figure caption and subcaption, from the paper
    bynum = {n: k for k, n in p.num.items() if k.startswith("fig:") and re.fullmatch(r"\d+", n)}
    def fig(m):
        n, body = m.group(1), m.group(0)
        lab = bynum[n]
        body = re.sub(r"<figcaption>.*?</figcaption>",
                      lambda _: "<figcaption><b>Figure %s:</b> %s</figcaption>" % (n, p.caption(lab)), body, flags=re.S)
        subs = iter(subcaptions(p, lab))
        body = re.sub(r'(<div class="subcap">).*?(</div>)',
                      lambda mm: mm.group(1) + "(%s) %s" % next(subs) + mm.group(2), body, flags=re.S)
        return body
    s = re.sub(r'<figure class="pfig[^"]*" id="figure-(\d+)">.*?</figure>', fig, s, flags=re.S)
    page.write_text(s)
    # deployment rows for the platform hints
    d = SITE / "assets/js/data.js"
    js = d.read_text()
    apps = deployments(p)
    body = "apps: {\n" + ",\n".join(
        "  %s: [\n%s\n  ]" % (k, ",\n".join("    " + json.dumps(r, ensure_ascii=False) for r in v))
        for k, v in apps.items()) + "\n},"
    js, n = re.subn(r"apps: \{\n.*?\n\},", lambda _: body, js, count=1, flags=re.S)
    if n != 1:
        raise SystemExit("apps block not found in data.js")
    hw = "hardware: [\n" + ",\n".join("  " + json.dumps(r, ensure_ascii=False) for r in hardware(p)) + "\n],"
    js, n = re.subn(r"hardware: \[\n.*?\n\],", lambda _: hw, js, count=1, flags=re.S)
    if n != 1:
        raise SystemExit("hardware block not found in data.js")
    d.write_text(js)
    print("synced %d blocks, %d figures" % (len(build(p)), len(bynum)))


if __name__ == "__main__":
    main(sys.argv)
