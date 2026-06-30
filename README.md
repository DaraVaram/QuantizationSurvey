# Neural Network Quantization for Microcontrollers — Interactive Survey

An interactive **"Beyond-PDF"** companion to the survey:

> **Neural Network Quantization for Microcontrollers: A Comprehensive Survey of Methods, Platforms, and Applications**
> Hamza A. Abushahla, Dara Varam, Ariel Justine N. Panopio, and Mohamed I. AlHajri
> Department of Computer Science and Engineering, American University of Sharjah

🌐 **Live site:** https://daravaram.github.io/QuantizationSurvey/
📄 **Paper (arXiv):** https://arxiv.org/abs/2508.15008

This is a full, faithful, web-native reproduction of the survey — every section, table, figure,
and equation — redesigned for the web with interactive, sortable/filterable tables, a deployment
landscape explorer, an interactive method taxonomy, redrawn vector figures, and a searchable
297-entry bibliography wired to inline citations.

## Running locally

It is a static site with no build step. Either open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Citation

```bibtex
@misc{abushahla2025quantization,
  title         = {Neural Network Quantization for Microcontrollers: A Comprehensive Survey of Methods, Platforms, and Applications},
  author        = {Abushahla, Hamza A. and Varam, Dara and Panopio, Ariel Justine N. and AlHajri, Mohamed I.},
  year          = {2025},
  eprint        = {2508.15008},
  archivePrefix = {arXiv},
  primaryClass  = {cs.LG},
  url           = {https://arxiv.org/abs/2508.15008}
}
```
