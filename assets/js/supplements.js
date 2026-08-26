/* =========================================================================
   supplements.js — table interactivity + deployment-landscape explorer.
   The static page is complete and word-exact without this file.
   ========================================================================= */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* =======================================================================
     TABLE TOOLKIT — search, filter chips, sorting (rowspan-aware), reset
     ======================================================================= */
  function cellText(td) {
    return td ? td.textContent.replace(/\s+/g, " ").trim() : "";
  }
  // Unit-aware sort key: memory (KB/MB/GB), clock (MHz/GHz), energy (mJ/J),
  // power (mW/W) and latency (ms/s) are normalised to a common unit so that
  // e.g. "1 MB" sorts above "384 KB" and "1.5 GHz" above "800 MHz".
  var UNITS = {
    kb: 1, mb: 1024, gb: 1048576,
    khz: 0.001, mhz: 1, ghz: 1000,
    uw: 1e-3, mw: 1, w: 1000,
    uj: 1e-3, mj: 1, j: 1000,
    us: 1e-3, ms: 1, s: 1000
  };
  var SUP = {"⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5",
             "⁶":"6","⁷":"7","⁸":"8","⁹":"9","⁻":"-"};
  function cellVal(td) {
    var raw = cellText(td);
    if (!raw) return "";
    raw = raw.replace(/[⁰¹²³⁴-⁹⁻]/g, function (c) { return SUP[c]; });
    // scientific notation, e.g. "2x10-8 mJ" -> 2e-8
    var sci = raw.match(/(-?\d+(?:\.\d+)?)\s*[×x*]\s*10\s*([−–-]?)\s*(\d+)/);
    if (sci) return parseFloat(sci[1]) * Math.pow(10, parseInt(sci[3], 10) * (sci[2] ? -1 : 1));
    // strip leading comparators and take the first numeric token with its unit
    var m = raw.match(/(-?\d+(?:\.\d+)?)\s*(KB|MB|GB|kHz|MHz|GHz|mW|uW|W|mJ|uJ|J|ms|us|s)?/i);
    if (!m) return raw.toLowerCase();
    var n = parseFloat(m[1]);
    if (isNaN(n)) return raw.toLowerCase();
    var u = (m[2] || "").toLowerCase();
    if (u && UNITS[u] != null) n *= UNITS[u];
    return n;
  }

  function enhanceTable(tid, opts) {
    var wrap = $("#" + tid);
    if (!wrap) return;
    var table = wrap.querySelector("table");
    var tbody = table.tBodies[0];
    var originalHTML = tbody.innerHTML;
    var flattened = !table.querySelector("td[rowspan]");
    var state = { q: "", chip: "all", sorted: false };

    // ---- toolbar (only if this table actually has controls) ----
    if (!opts.chips && opts.noSearch && !(opts.sortable || []).length) return;
    var bar = document.createElement("div");
    bar.className = "tbl-toolbar";
    // Real buttons, so every control is reachable by keyboard and announces
    // its own pressed state instead of being a clickable <span>.
    var chipsHtml = "";
    if (opts.chips) {
      chipsHtml = '<button type="button" class="chip active" data-c="all" aria-pressed="true">All</button>' +
        opts.chips.map(function (c) {
          return '<button type="button" class="chip" data-c="' + c.key + '" aria-pressed="false">' + c.label + "</button>";
        }).join("");
    }
    var searchHtml = opts.noSearch ? "" :
      '<input type="search" placeholder="Search this table&#8230;" aria-label="Search table">';
    bar.innerHTML = chipsHtml + searchHtml +
      '<button type="button" class="treset" title="Restore original order and filters">&#8635; reset</button>' +
      '<span class="tcount" role="status" aria-live="polite"></span>';
    wrap.insertBefore(bar, wrap.firstChild);
    var input = bar.querySelector("input"), count = bar.querySelector(".tcount");

    // ---- flatten rowspan groups (needed before any sort/filter) ----
    function flatten() {
      if (flattened) return;
      var current = "";
      $$("tr", tbody).forEach(function (tr) {
        var first = tr.cells[0];
        if (first && first.hasAttribute("rowspan")) {
          current = cellText(first);
          first.removeAttribute("rowspan");
        } else {
          var td = document.createElement("td");
          td.className = "fam";
          td.textContent = current;
          tr.insertBefore(td, tr.firstChild);
        }
        tr.classList.remove("rule");
      });
      flattened = true;
    }

    // ---- filtering ----
    function apply() {
      var rows = $$("tr", tbody), shown = 0;
      rows.forEach(function (tr) {
        var okChip = true;
        if (opts.chips && state.chip !== "all") {
          okChip = opts.match(tr, state.chip);
        }
        var okQ = true;
        if (state.q) {
          okQ = tr.textContent.toLowerCase().indexOf(state.q) !== -1;
        }
        var show = okChip && okQ;
        tr.style.display = show ? "" : "none";
        if (show) shown++;
      });
      count.textContent = shown + " / " + rows.length + " rows";
    }

    bar.addEventListener("click", function (e) {
      var chip = e.target.closest ? e.target.closest(".chip") : null;
      if (chip) {
        if (!flattened) { flatten(); }
        $$(".chip", bar).forEach(function (c) { c.classList.remove("active"); c.setAttribute("aria-pressed", "false"); });
        chip.classList.add("active");
        chip.setAttribute("aria-pressed", "true");
        state.chip = chip.getAttribute("data-c");
        apply();
        return;
      }
      if (e.target.closest && e.target.closest(".treset")) {
        tbody.innerHTML = originalHTML;
        flattened = !table.querySelector("td[rowspan]");
        state = { q: "", chip: "all", sorted: false };
        if (input) input.value = "";
        $$(".chip", bar).forEach(function (c) {
          var on = c.getAttribute("data-c") === "all";
          c.classList.toggle("active", on);
          c.setAttribute("aria-pressed", on ? "true" : "false");
        });
        $$("th.sortable", table).forEach(function (th) {
          var i = th.querySelector(".sort-ind"); if (i) i.innerHTML = " ⇅";
          th.setAttribute("aria-sort", "none");
        });
        apply();
      }
    });
    if (input) {
      input.addEventListener("input", function () {
        if (!flattened) flatten();
        state.q = input.value.trim().toLowerCase();
        apply();
      });
    }

    // ---- sorting: numeric columns only ----
    // Qualitative columns (names, devices, frameworks, coverage marks) are left
    // alone -- ordering them alphabetically told the reader nothing useful.
    var sortCols = opts.sortable || [];
    var ths = $$("thead th", table);
    sortCols.forEach(function (ci) {
      var th = ths[ci];
      if (!th) return;
      th.classList.add("sortable");
      th.setAttribute("aria-sort", "none");
      // The header's own text becomes a button, so the sort is operable by
      // keyboard and the column announces its current sort direction.
      var ind = document.createElement("span");
      ind.className = "sort-ind";
      ind.innerHTML = " ⇅";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "th-sort";
      btn.title = "Sort by this column";
      while (th.firstChild) btn.appendChild(th.firstChild);
      btn.appendChild(ind);
      th.appendChild(btn);
      var dir = 0;
      btn.addEventListener("click", function () {
        if (!flattened) flatten();
        dir = dir === 1 ? -1 : 1;
        ths.forEach(function (o) {
          if (o !== th) {
            var i2 = o.querySelector(".sort-ind"); if (i2) i2.innerHTML = " ⇅";
            if (o.hasAttribute("aria-sort")) o.setAttribute("aria-sort", "none");
          }
        });
        ind.innerHTML = dir === 1 ? " ▲" : " ▼";
        th.setAttribute("aria-sort", dir === 1 ? "ascending" : "descending");
        var rows = $$("tr", tbody);
        rows.sort(function (a, b) {
          var x = cellVal(a.cells[ci]), y = cellVal(b.cells[ci]);
          var xn = typeof x === "number", yn = typeof y === "number";
          if (xn && yn) return (x - y) * dir;
          if (xn) return -1;                 // rows with a value sort above "--"
          if (yn) return 1;
          return 0;
        });
        rows.forEach(function (r) { r.classList.remove("rule"); tbody.appendChild(r); });
      });
    });
    apply();
  }

  /* =======================================================================
     Table 2 — how many of the surveyed deployments use each platform.
     A study counts for a platform only when its Device(s) cell names that
     platform; accelerator names are deliberately not mapped onto boards, and
     the count is scoped to the studies selected for Tables 4-6 rather than to
     the literature at large. Runs before enhanceTable so the hints survive a
     table reset.
     ======================================================================= */
  (function () {
    var D = window.DATA;
    if (!D || !D.apps) return;
    var rows = [].concat(D.apps.arm, D.apps.riscv, D.apps.npu);
    var NAMES = ["Arduino Nano 33 BLE Sense", "SparkFun Edge", "Sony Spresense", "OpenMV Cam H7",
                 "ESP32-C3", "ESP32-C6", "ESP32-P4", "MSPM0G5187", "MAX78002",
                 "GAP8", "GAP9", "HX6538-WE2", "STM32N6"];
    var everyKey = {};
    rows.forEach(function (r) { everyKey[r.key] = 1; });
    var total = Object.keys(everyKey).length;
    $$("#table-2 td.t2-plat").forEach(function (td) {
      var name = cellText(td);
      if (NAMES.indexOf(name) === -1) return;
      var seen = {}, cats = [];
      rows.forEach(function (r) {
        if ((r.devices || "").indexOf(name) === -1 || seen[r.key]) return;
        seen[r.key] = 1;
        if (cats.indexOf(r.cat) === -1) cats.push(r.cat);
      });
      var n = Object.keys(seen).length;
      td.setAttribute("data-tip", "<b>" + name + "</b><br>" + (n
        ? n + (n === 1 ? " study" : " studies") + " of the " + total + " surveyed in Tables 4&#8211;6 " +
          (n === 1 ? "reports" : "report") + " a deployment on this platform.<br>" + cats.join(" &#183; ")
        : "None of the " + total + " studies surveyed in Tables 4&#8211;6 reports a deployment on this platform."));
    });
  })();

  /* =======================================================================
     Keyboard reachability for cells inside the tables. These attributes are
     written before enhanceTable snapshots the table body, so a reset restores
     them along with the rows; the behaviour itself is delegated in figs.js.
     ======================================================================= */
  (function () {
    $$("#table-2 td.t2-plat").forEach(function (td) {
      td.setAttribute("tabindex", "0");
      td.setAttribute("role", "button");
      var d = document.createElement("div");
      d.innerHTML = td.getAttribute("data-tip") || "";
      td.setAttribute("aria-label", d.textContent.replace(/\s+/g, " ").trim());
    });
    $$(".ptable-wrap d-cite").forEach(function (c) {
      var keys = (c.getAttribute("key") || "").split(",").map(function (k) { return k.trim(); }).filter(Boolean);
      if (!keys.length) return;
      c.setAttribute("tabindex", "0");
      c.setAttribute("role", "button");
      c.setAttribute("aria-label", "Reference for " + keys.join(", "));
    });
  })();

  // Table 1 — scope matrix: filter by surveyed dimension (✓ present in column)
  enhanceTable("table-1", {
    chips: [
      { key: "2", label: "Primary" }, { key: "3", label: "Advanced" }, { key: "4", label: "Numeric" },
      { key: "5", label: "Hardware" }, { key: "6", label: "Software" }, { key: "7", label: "Applications" }
    ],
    match: function (tr, key) {
      var td = tr.cells[+key];
      return td && td.querySelector("span") !== null;
    },
    sortable: [1]                      // Year
  });
  // Table 2 — platforms: family filter (rowspan flattening on demand)
  enhanceTable("table-2", {
    chips: [
      { key: "ARM-based", label: "ARM" }, { key: "RISC-V-based", label: "RISC-V" },
      { key: "NPU-Integrated", label: "NPU" }
    ],
    match: function (tr, key) { return cellText(tr.cells[0]) === key; },
    sortable: [4, 5, 6]                // Clock, Flash, RAM
  });
  // Tables 4 and 6 — deployments: quantization-path filter
  ["table-4", "table-6"].forEach(function (tid) {
    enhanceTable(tid, {
      chips: [{ key: "PTQ", label: "PTQ" }, { key: "QAT", label: "QAT" }],
      match: function (tr, key) { return cellText(tr.cells[2]).indexOf(key) !== -1; },
      sortable: [5, 6, 7, 8]           // Performance, Power/Energy, Latency, Memory
    });
  });
  // Table 5 — all three rows are INT8 PTQ: search and sorting only, no chips
  enhanceTable("table-5", { sortable: [5, 6, 7, 8] });
  // Table 3 — three descriptive rows: sorting/reset only, no search
  // Table 3 — three descriptive prose rows: nothing numeric, so no controls at all
  enhanceTable("table-3", { noSearch: true });

  /* =======================================================================
     Deployment landscape scatter (Tables 4–6)
     ======================================================================= */
  var D = window.DATA;
  var host = $("#scatter");
  if (D && host) {
    var all = [];
    D.apps.arm.forEach(function (r) { all.push(Object.assign({ fam: "arm" }, r)); });
    D.apps.riscv.forEach(function (r) { all.push(Object.assign({ fam: "risc" }, r)); });
    D.apps.npu.forEach(function (r) { all.push(Object.assign({ fam: "npu" }, r)); });

    /* ---------------------------------------------------------------
       Every plotted number is parsed from the string shown in Tables
       4-6, so the chart cannot drift from the tables. One rule, applied
       everywhere: the marker sits at the midpoint of the full reported
       span and the whisker covers that span end to end. Uncertainties
       (a +/- term) are not treated as separate values, and "<" or "~"
       bounds are read as the number they qualify.
       --------------------------------------------------------------- */
    var UNC = /±\s*\d+(?:\.\d+)?/g;          // "88.64 +/- 1.56" -> drop the 1.56
    var DASH = "[\\u2013\\u2014-]";
    function numbersIn(text) {
      if (!text) return [];
      var out = [];
      String(text).replace(UNC, " ").replace(/[~<>≈]/g, " ")
        .replace(/\d+(?:\.\d+)?/g, function (m) { out.push(parseFloat(m)); return m; });
      return out.filter(function (v) { return isFinite(v); });
    }
    function span(values) {
      if (!values.length) return null;
      var lo = Math.min.apply(null, values), hi = Math.max.apply(null, values);
      return { lo: lo, hi: hi, mid: (lo + hi) / 2 };
    }

    // Task metrics are not interchangeable, so performance is only ever
    // plotted one metric at a time (see the metric selector below).
    var METRICS = [
      { key: "acc",  label: "Accuracy",    re: /acc/i },
      { key: "f1",   label: "F1-score",    re: /f1/i },
      { key: "map",  label: "mAP",         re: /map/i },
      { key: "auc",  label: "AUC",         re: /auc/i },
      { key: "sens", label: "Sensitivity", re: /sens/i },
      { key: "prec", label: "Precision",   re: /prec/i }
    ];
    function perfByMetric(text) {
      var byKey = {};
      String(text || "").split(",").forEach(function (seg) {
        var clean = seg.replace(UNC, " ");
        var vals = [];
        clean.replace(new RegExp("(\\d+(?:\\.\\d+)?)\\s*" + DASH + "\\s*(\\d+(?:\\.\\d+)?)\\s*%", "g"),
          function (m, a, b) { vals.push(parseFloat(a), parseFloat(b)); return m; });
        if (!vals.length) {
          clean.replace(/(\d+(?:\.\d+)?)\s*%/g, function (m, a) { vals.push(parseFloat(a)); return m; });
        }
        if (!vals.length) return;                 // e.g. "40 laps collision-free"
        METRICS.forEach(function (m) {
          if (!m.re.test(clean)) return;
          byKey[m.key] = (byKey[m.key] || []).concat(vals);
        });
      });
      return byKey;
    }
    all.forEach(function (r) {
      r._mem = span(numbersIn(r.mem));
      r._lat = span(numbersIn(r.lat));
      r._perf = {};
      var byKey = perfByMetric(r.perf);
      Object.keys(byKey).forEach(function (k) { r._perf[k] = span(byKey[k]); });
    });

    var metricKey = (function () {                // default to the most common metric
      var best = null, n = -1;
      METRICS.forEach(function (m) {
        var c = all.filter(function (r) { return r._perf[m.key]; }).length;
        if (c > n) { n = c; best = m.key; }
      });
      return best;
    })();
    function metricLabel() {
      var m = METRICS.filter(function (x) { return x.key === metricKey; })[0];
      return m ? m.label : "performance";
    }

    var AX = {
      mem:  { label: "Model size / memory (KB)", log: true,  at: function (r) { return r._mem; } },
      lat:  { label: "Latency (ms)",             log: true,  at: function (r) { return r._lat; } },
      perf: { label: "Task performance (%)",     log: false, at: function (r) { return r._perf[metricKey]; } }
    };
    var famColor = { arm: "#1F77B4", risc: "#FF7F0E", npu: "#9467BD" };
    var famName = { arm: "ARM", risc: "RISC-V", npu: "NPU-integrated" };
    var xKey = "mem", yKey = "lat", filt = "all", tip = null;

    var ensureTip = function () {
      if (!tip) { tip = document.createElement("div"); tip.className = "viz-tip"; document.body.appendChild(tip); }
      return tip;
    };
    var draw = function () {
      var W = 720, H = 400, m = { l: 60, r: 18, t: 14, b: 48 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
      var ax = AX[xKey], ay = AX[yKey];
      var pts = all.filter(function (r) {
        var a = ax.at(r), b = ay.at(r);
        return (filt === "all" || r.fam === filt) && a && b && a.mid > 0 && b.mid > 0;
      });
      var note = $("#viz-metric-note");
      if (note) {
        var perfOn = xKey === "perf" || yKey === "perf";
        note.style.display = perfOn ? "" : "none";
        note.innerHTML = perfOn
          ? "Performance is restricted to <b>" + metricLabel() + "</b>: accuracy, F1, mAP and AUC do not share " +
            "one interpretation, so only the " + pts.length + " deployments reporting " + metricLabel() +
            " are plotted here."
          : "";
      }
      var mw = $("#viz-metric-wrap");
      if (mw) mw.style.display = (xKey === "perf" || yKey === "perf") ? "" : "none";
      if (!pts.length) {
        host.innerHTML = '<p style="font-size:0.72rem;color:#8a94a0;padding:1.2rem 0">' +
          "No deployment in Tables 4&#8211;6 reports both of the selected variables.</p>";
        host._pts = [];
        return;
      }
      var mk = function (spec, vals) {
        var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals);
        if (spec.log) { mn = Math.log10(mn); mx = Math.log10(mx); }
        if (mn === mx) { mn -= 1; mx += 1; }
        var pad = (mx - mn) * 0.08; mn -= pad; mx += pad;
        return function (v) { var t = spec.log ? Math.log10(v) : v; return (t - mn) / (mx - mn); };
      };
      var xv = [], yv = [];
      pts.forEach(function (r) {
        var a = ax.at(r), b = ay.at(r);
        xv.push(a.mid); if (a.lo > 0) xv.push(a.lo); if (a.hi > 0) xv.push(a.hi);
        yv.push(b.mid); if (b.lo > 0) yv.push(b.lo); if (b.hi > 0) yv.push(b.hi);
      });
      var sx = mk(ax, xv), sy = mk(ay, yv);
      var px = function (v) { return m.l + sx(v) * iw; };
      var py = function (v) { return m.t + (1 - sy(v)) * ih; };
      var g = '<svg viewBox="0 0 ' + W + " " + H + '" width="100%" style="font-family:Roboto,sans-serif"' +
              ' role="img" aria-label="Deployment landscape: ' + ay.label + ' against ' + ax.label + '">';
      for (var i = 0; i <= 4; i++) {
        var gy = m.t + ih * i / 4, gx = m.l + iw * i / 4;
        g += '<line x1="' + m.l + '" y1="' + gy + '" x2="' + (W - m.r) + '" y2="' + gy + '" stroke="#e3e7ec" stroke-dasharray="3 4"/>';
        g += '<line x1="' + gx + '" y1="' + m.t + '" x2="' + gx + '" y2="' + (m.t + ih) + '" stroke="#e3e7ec" stroke-dasharray="3 4"/>';
      }
      g += '<line x1="' + m.l + '" y1="' + (m.t + ih) + '" x2="' + (W - m.r) + '" y2="' + (m.t + ih) + '" stroke="#9aa4b0"/>';
      g += '<line x1="' + m.l + '" y1="' + m.t + '" x2="' + m.l + '" y2="' + (m.t + ih) + '" stroke="#9aa4b0"/>';
      g += '<text x="' + (m.l + iw / 2) + '" y="' + (H - 10) + '" text-anchor="middle" fill="#667" font-size="11">' +
           ax.label + (ax.log ? "  (log)" : "") + "</text>";
      g += '<text transform="translate(14,' + (m.t + ih / 2) + ') rotate(-90)" text-anchor="middle" fill="#667" font-size="11">' +
           ay.label + (ay.log ? "  (log)" : "") + "</text>";
      // whiskers first, so the markers sit on top of them
      pts.forEach(function (r) {
        var a = ax.at(r), b = ay.at(r), c = famColor[r.fam];
        var cx = px(a.mid), cy = py(b.mid);
        if (a.hi > a.lo) {
          g += '<line x1="' + px(a.lo) + '" y1="' + cy + '" x2="' + px(a.hi) + '" y2="' + cy +
               '" stroke="' + c + '" stroke-width="1.3" stroke-opacity="0.45"/>';
        }
        if (b.hi > b.lo) {
          g += '<line x1="' + cx + '" y1="' + py(b.lo) + '" x2="' + cx + '" y2="' + py(b.hi) +
               '" stroke="' + c + '" stroke-width="1.3" stroke-opacity="0.45"/>';
        }
      });
      pts.forEach(function (r, i2) {
        var a = ax.at(r), b = ay.at(r);
        g += '<circle cx="' + px(a.mid) + '" cy="' + py(b.mid) + '" r="6.5" fill="' + famColor[r.fam] +
             '" fill-opacity="0.7" stroke="' + famColor[r.fam] + '" stroke-width="1.4" style="cursor:pointer"' +
             ' data-i="' + i2 + '" tabindex="-1" role="button" aria-label="' +
             r.cat + ", " + famName[r.fam] + ", " + r.devices.replace(/"/g, "") + '"/>';
      });
      g += "</svg>";
      host.innerHTML = g;
      host._pts = pts;
      var live = $("#viz-count");
      if (live) live.textContent = pts.length + " of " + all.length + " deployments plotted";
    };
    var xs = $("#viz-x"), ys = $("#viz-y"), ms = $("#viz-metric");
    // Plotting a variable against itself only ever draws the diagonal, so
    // choosing the other axis's variable swaps the two rather than allowing it.
    var setAxes = function (nx, ny) {
      xKey = nx; yKey = ny;
      if (xs) xs.value = xKey;
      if (ys) ys.value = yKey;
      draw();
    };
    if (xs) xs.addEventListener("change", function (e) {
      var v = e.target.value;
      setAxes(v, v === yKey ? xKey : yKey);
    });
    if (ys) ys.addEventListener("change", function (e) {
      var v = e.target.value;
      setAxes(v === xKey ? yKey : xKey, v);
    });
    if (ms) {
      METRICS.forEach(function (mt) {
        var n = all.filter(function (r) { return r._perf[mt.key]; }).length;
        if (!n) return;
        var o = document.createElement("option");
        o.value = mt.key; o.textContent = mt.label + " (" + n + ")";
        if (mt.key === metricKey) o.selected = true;
        ms.appendChild(o);
      });
      ms.addEventListener("change", function (e) { metricKey = e.target.value; draw(); });
    }
    $$("#scatter-supp .chip").forEach(function (c) {
      c.addEventListener("click", function () {
        $$("#scatter-supp .chip").forEach(function (o) { o.classList.remove("active"); o.setAttribute("aria-pressed", "false"); });
        c.classList.add("active"); c.setAttribute("aria-pressed", "true");
        filt = c.getAttribute("data-f"); draw();
      });
    });
    var tipFor = function (r) {
      var a = AX[xKey].at(r), b = AX[yKey].at(r);
      var rangeNote = ((a && a.hi > a.lo) || (b && b.hi > b.lo))
        ? '<br><span style="opacity:.7">Whiskers span the full reported range; the marker is its midpoint.</span>' : "";
      return "<b>" + r.cat + "</b> (" + famName[r.fam] + ")<br>" + r.devices + "<br>" + r.quant + " · " + r.perf +
        "<br>Lat " + r.lat + " ms · Mem " + r.mem + " KB" + rangeNote +
        '<br><span style="opacity:.7">Click to open this study in the reference list.</span>';
    };
    var showAt = function (r, x, y) {
      var t = ensureTip();
      t.innerHTML = tipFor(r);
      t.style.left = Math.min(x + 12, window.innerWidth - 260) + "px";
      t.style.top = (y + 12) + "px";
      t.style.opacity = "1";
    };
    host.addEventListener("mousemove", function (e) {
      var c = e.target.closest ? e.target.closest("circle[data-i]") : null;
      var t = ensureTip();
      if (c) showAt(host._pts[+c.getAttribute("data-i")], e.clientX, e.clientY);
      else t.style.opacity = "0";
    });
    host.addEventListener("mouseleave", function () { if (tip) tip.style.opacity = "0"; });
    // each point stands for one study, so it leads to that study's reference
    host.addEventListener("click", function (e) {
      var c = e.target.closest ? e.target.closest("circle[data-i]") : null;
      if (!c) return;
      var r = host._pts[+c.getAttribute("data-i")];
      if (r && window.QSRefs) window.QSRefs.jump(r.key);
    });

    /* Keyboard: the plot is one stop in the tab order and the arrow keys walk
       the points, rather than putting every marker in the tab sequence. */
    var cursor = -1;
    var focusPoint = function (i) {
      var pts = host._pts || [];
      if (!pts.length) return;
      cursor = (i + pts.length) % pts.length;
      var c = host.querySelector('circle[data-i="' + cursor + '"]');
      if (!c) return;
      $$("circle[data-i]", host).forEach(function (o) { o.setAttribute("stroke-width", "1.4"); o.setAttribute("r", "6.5"); });
      c.setAttribute("stroke-width", "3"); c.setAttribute("r", "8");
      var b = c.getBoundingClientRect();
      showAt(pts[cursor], b.left + b.width / 2, b.top + b.height / 2);
    };
    host.setAttribute("tabindex", "0");
    host.setAttribute("role", "application");
    host.setAttribute("aria-label", "Deployment landscape scatter plot. Use the arrow keys to move between studies and Enter to open a reference.");
    host.addEventListener("keydown", function (e) {
      var k = e.key;
      if (k === "ArrowRight" || k === "ArrowDown") { focusPoint(cursor + 1); e.preventDefault(); }
      else if (k === "ArrowLeft" || k === "ArrowUp") { focusPoint(cursor - 1); e.preventDefault(); }
      else if ((k === "Enter" || k === " ") && cursor >= 0) {
        var r = (host._pts || [])[cursor];
        if (r && window.QSRefs) window.QSRefs.jump(r.key);
        e.preventDefault();
      } else if (k === "Escape") { if (tip) tip.style.opacity = "0"; }
    });
    host.addEventListener("blur", function () { if (tip) tip.style.opacity = "0"; });
    draw();
  }

  /* ---------- back to top ---------- */
  var toTop = $("#toTop");
  if (toTop) {
    document.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.scrollY > 900);
    }, { passive: true });
    toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }
})();
