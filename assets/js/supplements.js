/* =========================================================================
   supplements.js — progressive interactivity for the TMLR Beyond-PDF page.
   The static page is complete and word-exact without this file.
   ========================================================================= */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- sortable paper tables (non-destructive) ---------- */
  function cellVal(td) {
    var t = td.textContent.trim();
    var m = t.match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : t.toLowerCase();
  }
  $$("table.ptable[data-sortable]").forEach(function (tbl) {
    // skip tables with rowspans (family-grouped) — sorting would break groups
    if (tbl.querySelector("td[rowspan]")) return;
    var ths = $$("thead th", tbl);
    ths.forEach(function (th, ci) {
      th.classList.add("sortable");
      var ind = document.createElement("span");
      ind.className = "sort-ind"; ind.innerHTML = " &#8645;";
      th.appendChild(ind);
      var dir = 0;
      th.addEventListener("click", function () {
        dir = dir === 1 ? -1 : 1;
        ths.forEach(function (o) { if (o !== th) { var i2 = o.querySelector(".sort-ind"); if (i2) i2.innerHTML = " &#8645;"; } });
        ind.innerHTML = dir === 1 ? " &#9650;" : " &#9660;";
        var tb = tbl.tBodies[0];
        var rows = $$("tr", tb);
        rows.sort(function (a, b) {
          var x = cellVal(a.cells[ci]), y = cellVal(b.cells[ci]);
          if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
          x = String(x); y = String(y);
          return x < y ? -dir : x > y ? dir : 0;
        });
        rows.forEach(function (r) { r.classList.remove("rule"); tb.appendChild(r); });
      });
    });
  });

  /* ---------- deployment landscape scatter ---------- */
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

    function ensureTip() {
      if (!tip) { tip = document.createElement("div"); tip.className = "viz-tip"; document.body.appendChild(tip); }
      return tip;
    }
    function draw() {
      var W = 720, H = 400, m = { l: 60, r: 18, t: 14, b: 48 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
      var ax = AX[xKey], ay = AX[yKey];
      var pts = all.filter(function (r) {
        return (filt === "all" || r.fam === filt) && ax.f(r) != null && ay.f(r) != null && ax.f(r) > 0 && ay.f(r) > 0;
      });
      function mk(spec, vals) {
        var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals);
        if (spec.log) { mn = Math.log10(mn); mx = Math.log10(mx); }
        if (mn === mx) { mn -= 1; mx += 1; }
        var pad = (mx - mn) * 0.08; mn -= pad; mx += pad;
        return function (v) { var t = spec.log ? Math.log10(v) : v; return (t - mn) / (mx - mn); };
      }
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
    }
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
      var c = e.target.closest("circle[data-i]");
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
