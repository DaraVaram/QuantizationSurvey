# Neural Network Quantization for Microcontrollers — TMLR Beyond PDF

Interactive **TMLR Beyond-PDF** edition of the survey:

> **Neural Network Quantization for Microcontrollers: A Comprehensive Survey of Methods, Platforms, and Applications**
> *Anonymous authors — paper under double-blind review.*

A web-native rendition of the manuscript in the
[TMLR Beyond PDF](https://tmlr-beyond-pdf.org) format (distill template):
every section, figure, table, equation and reference is present, with the
preliminaries expanded beyond the IEEE Access version by restoring material
from the earlier arXiv one. Figures are hand-authored inline SVG rather than
converted LaTeX artifacts, so they can carry interaction. Interactive features
(citation hover cards, sortable tables, a browsable taxonomy, a
deployment-landscape explorer, and per-figure hover detail) are progressive
enhancements — the static page and its printed form are complete without them.

## Running locally

Static site, no build step:

```bash
python -m http.server 8000
# visit http://localhost:8000
```

(Serving over HTTP is required for the bibliography to load; opening
`index.html` directly via `file://` will not render citations.)

## Submission package

TMLR Beyond PDF takes a zipped `submission_folder/` built by its Author Kit,
not a rendered page. `index.html` remains the source; the package is generated
from it:

```bash
python3 tools/build_submission.py                 # writes dist/submission_folder{,.zip}
python3 tools/build_submission.py --kit ../tmlr-beyond-pdf-author-kit
cd ../tmlr-beyond-pdf-author-kit && python compile_submission.py   # Docker; serves the page as TMLR will
```

The generator strips every HTML comment, drops the hand-written head, title
and byline that the kit's distill layout supplies, wraps display equations so
kramdown leaves them alone, and ships the figure scripts under
`assets/html/submission/`. `dist/` is gitignored. The archival PDF must be the
browser's own Print to PDF of the compiled page.

## Printing

`Ctrl+P` produces the manuscript exactly: navigation, interactive supplements,
and web chrome are excluded by the print stylesheet.
