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

## Printing

`Ctrl+P` produces the manuscript exactly: navigation, interactive supplements,
and web chrome are excluded by the print stylesheet.
