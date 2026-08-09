# Neural Network Quantization for Microcontrollers — TMLR Beyond PDF

Interactive **TMLR Beyond-PDF** edition of the survey:

> **Neural Network Quantization for Microcontrollers: A Comprehensive Survey of Methods, Platforms, and Applications**
> *Anonymous authors — paper under double-blind review.*

This is a word-exact, web-native rendition of the manuscript in the
[TMLR Beyond PDF](https://tmlr-beyond-pdf.org) format (distill template):
every section, figure, table, equation, and all 297 references are reproduced
exactly. Figures are the original LaTeX-compiled artifacts converted to vector
SVG. Interactive features (citation hover cards, sortable tables, a browsable
taxonomy, a deployment-landscape explorer) are progressive enhancements —
the static page and its printed form are complete without them.

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
