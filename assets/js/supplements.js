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
  function cellVal(td) {
    var raw = cellText(td);
    if (!raw) return "";
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

    // ---- toolbar ----
    var bar = document.createElement("div");
    bar.className = "tbl-toolbar";
    var chipsHtml = "";
    if (opts.chips) {
      chipsHtml = '<span class="chip active" data-c="all">All</span>' +
        opts.chips.map(function (c) { return '<span class="chip" data-c="' + c.key + '">' + c.label + "</span>"; }).join("");
    }
    var searchHtml = opts.noSearch ? "" :
      '<input type="search" placeholder="Search this table&#8230;" aria-label="Search table">';
    bar.innerHTML = chipsHtml + searchHtml +
      '<span class="treset" title="Restore original order and filters">&#8635; reset</span>' +
      '<span class="tcount"></span>';
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
        $$(".chip", bar).forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        state.chip = chip.getAttribute("data-c");
        apply();
        return;
      }
      if (e.target.classList.contains("treset")) {
        tbody.innerHTML = originalHTML;
        flattened = !table.querySelector("td[rowspan]");
        state = { q: "", chip: "all", sorted: false };
        if (input) input.value = "";
        $$(".chip", bar).forEach(function (c) { c.classList.toggle("active", c.getAttribute("data-c") === "all"); });
        $$("th.sortable", table).forEach(function (th) {
          var i = th.querySelector(".sort-ind"); if (i) i.innerHTML = " ⇅";
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

    // ---- sorting ----
    var ths = $$("thead th", table);
    ths.forEach(function (th, ci) {
      th.classList.add("sortable");
      th.title = "Click to sort by this column";
      var ind = document.createElement("span");
      ind.className = "sort-ind";
      ind.innerHTML = " ⇅";
      th.appendChild(ind);
      var dir = 0;
      th.addEventListener("click", function () {
        if (!flattened) flatten();
        dir = dir === 1 ? -1 : 1;
        ths.forEach(function (o) {
          if (o !== th) { var i2 = o.querySelector(".sort-ind"); if (i2) i2.innerHTML = " ⇅"; }
        });
        ind.innerHTML = dir === 1 ? " ▲" : " ▼";
        var rows = $$("tr", tbody);
        rows.sort(function (a, b) {
          var x = cellVal(a.cells[ci]), y = cellVal(b.cells[ci]);
          if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
          x = String(x); y = String(y);
          return x < y ? -dir : x > y ? dir : 0;
        });
        rows.forEach(function (r) { r.classList.remove("rule"); tbody.appendChild(r); });
      });
    });
    apply();
  }

  // Table 1 — scope matrix: filter by surveyed dimension (✓ present in column)
  enhanceTable("table-1", {
    chips: [
      { key: "2", label: "Primary" }, { key: "3", label: "Advanced" }, { key: "4", label: "Numeric" },
      { key: "5", label: "Hardware" }, { key: "6", label: "Software" }, { key: "7", label: "Applications" }
    ],
    match: function (tr, key) {
      var td = tr.cells[+key];
      return td && td.querySelector("span") !== null;
    }
  });
  // Table 2 — platforms: family filter (rowspan flattening on demand)
  enhanceTable("table-2", {
    chips: [
      { key: "ARM-based", label: "ARM" }, { key: "RISC-V-based", label: "RISC-V" },
      { key: "NPU-Integrated", label: "NPU" }
    ],
    match: function (tr, key) { return cellText(tr.cells[0]) === key; }
  });
  // Tables 4 and 6 — deployments: quantization-path filter
  ["table-4", "table-6"].forEach(function (tid) {
    enhanceTable(tid, {
      chips: [{ key: "PTQ", label: "PTQ" }, { key: "QAT", label: "QAT" }],
      match: function (tr, key) { return cellText(tr.cells[2]).indexOf(key) !== -1; }
    });
  });
  // Table 5 — all three rows are INT8 PTQ: search and sorting only, no chips
  enhanceTable("table-5", {});
  // Table 3 — three descriptive rows: sorting/reset only, no search
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
    var AX = {
      mem: { label: "Model size / memory (KB)", f: function (r) { return r.mem_n; }, log: true },
      lat: { label: "Latency (ms)", f: function (r) { return r.lat_n; }, log: true },
      perf: { label: "Task performance (%)", f: function (r) { return r.perf_n; }, log: false }
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
        return (filt === "all" || r.fam === filt) && ax.f(r) != null && ay.f(r) != null && ax.f(r) > 0 && ay.f(r) > 0;
      });
      var mk = function (spec, vals) {
        var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals);
        if (spec.log) { mn = Math.log10(mn); mx = Math.log10(mx); }
        if (mn === mx) { mn -= 1; mx += 1; }
        var pad = (mx - mn) * 0.08; mn -= pad; mx += pad;
        return function (v) { var t = spec.log ? Math.log10(v) : v; return (t - mn) / (mx - mn); };
      };
      var sx = mk(ax, pts.map(ax.f)), sy = mk(ay, pts.map(ay.f));
      var g = '<svg viewBox="0 0 ' + W + " " + H + '" width="100%" style="font-family:Roboto,sans-serif">';
      for (var i = 0; i <= 4; i++) {
        var gy = m.t + ih * i / 4, gx = m.l + iw * i / 4;
        g += '<line x1="' + m.l + '" y1="' + gy + '" x2="' + (W - m.r) + '" y2="' + gy + '" stroke="#e3e7ec" stroke-dasharray="3 4"/>';
        g += '<line x1="' + gx + '" y1="' + m.t + '" x2="' + gx + '" y2="' + (m.t + ih) + '" stroke="#e3e7ec" stroke-dasharray="3 4"/>';
      }
      g += '<line x1="' + m.l + '" y1="' + (m.t + ih) + '" x2="' + (W - m.r) + '" y2="' + (m.t + ih) + '" stroke="#9aa4b0"/>';
      g += '<line x1="' + m.l + '" y1="' + m.t + '" x2="' + m.l + '" y2="' + (m.t + ih) + '" stroke="#9aa4b0"/>';
      g += '<text x="' + (m.l + iw / 2) + '" y="' + (H - 10) + '" text-anchor="middle" fill="#667" font-size="11">' + ax.label + (ax.log ? "  (log)" : "") + "</text>";
      g += '<text transform="translate(14,' + (m.t + ih / 2) + ') rotate(-90)" text-anchor="middle" fill="#667" font-size="11">' + ay.label + (ay.log ? "  (log)" : "") + "</text>";
      pts.forEach(function (r, i2) {
        var cx = m.l + sx(ax.f(r)) * iw, cy = m.t + (1 - sy(ay.f(r))) * ih;
        g += '<circle cx="' + cx + '" cy="' + cy + '" r="6.5" fill="' + famColor[r.fam] + '" fill-opacity="0.7" stroke="' + famColor[r.fam] + '" stroke-width="1.4" style="cursor:pointer" data-i="' + i2 + '"/>';
      });
      g += "</svg>";
      host.innerHTML = g;
      host._pts = pts;
    };
    var xs = $("#viz-x"), ys = $("#viz-y");
    if (xs) xs.addEventListener("change", function (e) { xKey = e.target.value; draw(); });
    if (ys) ys.addEventListener("change", function (e) { yKey = e.target.value; draw(); });
    $$("#scatter-supp .chip").forEach(function (c) {
      c.addEventListener("click", function () {
        $$("#scatter-supp .chip").forEach(function (o) { o.classList.remove("active"); });
        c.classList.add("active"); filt = c.getAttribute("data-f"); draw();
      });
    });
    host.addEventListener("mousemove", function (e) {
      var c = e.target.closest ? e.target.closest("circle[data-i]") : null;
      var t = ensureTip();
      if (c) {
        var r = host._pts[+c.getAttribute("data-i")];
        t.innerHTML = "<b>" + r.cat + "</b> (" + famName[r.fam] + ")<br>" + r.devices + "<br>" + r.quant + " · " + r.perf +
          "<br>Lat " + r.lat + " ms · Mem " + r.mem + " KB";
        t.style.left = Math.min(e.clientX + 12, window.innerWidth - 260) + "px";
        t.style.top = (e.clientY + 12) + "px";
        t.style.opacity = "1";
      } else t.style.opacity = "0";
    });
    host.addEventListener("mouseleave", function () { if (tip) tip.style.opacity = "0"; });
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
