/* =========================================================================
   figs.js — interactivity for the remade manuscript figures.
   The figures are complete, faithful static SVGs without this file;
   everything here is progressive enhancement.
   ========================================================================= */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- shared tooltip for [data-tip] ---------- */
  var tip = null;
  function ensureTip() {
    if (!tip) { tip = document.createElement("div"); tip.className = "viz-tip"; document.body.appendChild(tip); }
    return tip;
  }
  document.addEventListener("mousemove", function (e) {
    var el = e.target.closest ? e.target.closest("[data-tip]") : null;
    var t = ensureTip();
    if (el) {
      t.innerHTML = el.getAttribute("data-tip");
      t.style.left = Math.min(e.clientX + 14, window.innerWidth - 270) + "px";
      t.style.top = (e.clientY + 14) + "px";
      t.style.opacity = "1";
    } else {
      t.style.opacity = "0";
    }
  }, { passive: true });

  /* ---------- Figure 2: granularity hover ---------- */
  (function () {
    var svg = $("#figure-2 svg");
    if (!svg) return;
    var tips = {
      t: "Per-tensor: a single scale (s, z) is shared by every value in the tensor.",
      pc: function (r) { return "Per-channel: channel " + (r + 1) + " has its own scale s<sub>" + (r + 1) + "</sub>."; },
      pg: function (r) { return "Per-group: this block within channel " + (r + 1) + " has its own scale."; }
    };
    svg.addEventListener("mouseover", function (e) {
      var c = e.target;
      if (!c.classList || !c.classList.contains("f2c")) return;
      var cls = null;
      c.classList.forEach(function (k) { if (/^(t-all|pc-r\d|pg-g\d[LR])$/.test(k)) cls = k; });
      if (!cls) return;
      var cube = c.closest("g[id]");
      $$(".f2c", cube).forEach(function (el) {
        el.classList.toggle("f2-hi", el.classList.contains(cls));
        el.classList.toggle("f2-dim", !el.classList.contains(cls));
      });
      var t = ensureTip();
      var txt;
      if (cls === "t-all") txt = tips.t;
      else if (cls.indexOf("pc-r") === 0) txt = tips.pc(+cls.charAt(4));
      else txt = tips.pg(+cls.charAt(4));
      t.innerHTML = txt; t.style.opacity = "1";
    });
    svg.addEventListener("mouseout", function (e) {
      var c = e.target;
      if (!c.classList || !c.classList.contains("f2c")) return;
      $$(".f2c", svg).forEach(function (el) { el.classList.remove("f2-hi", "f2-dim"); });
    });
  })();

  /* ---------- Figure 4: traveling marker around the QAT loop ---------- */
  (function () {
    var svg = $("#figure-4 svg");
    if (!svg || reduced) return;
    var path = $("#f4-loop", svg), dot = $("#f4-dot", svg);
    if (!path || !dot) return;
    var L = path.getTotalLength();          // segment lengths: 617|1872|1362|1872|610
    var GREEN = "#00CC00", BLUE = "#3E8EF7";
    // cumulative breakpoints along the loop
    var B = { upLeft: 617, topMid: 617 + 917, topEnd: 2489, rightBlue: 3151, rightEnd: 3851, botMid: 4806, botEnd: 5723 };
    var phases = [
      { until: B.upLeft,    ids: ["f4-plus", "f4-W"],  color: GREEN },
      { until: B.topMid,    ids: ["f4-W", "f4-quant"], color: GREEN },
      { until: B.topEnd,    ids: ["f4-quant", "f4-Q"], color: GREEN },
      { until: B.rightBlue, ids: ["f4-Q"],             color: GREEN },
      { until: B.rightEnd,  ids: ["f4-Q", "f4-dQ"],    color: BLUE },
      { until: B.botMid,    ids: ["f4-dQ", "f4-ste"],  color: BLUE },
      { until: B.botEnd,    ids: ["f4-ste", "f4-dW"],  color: BLUE },
      { until: 1e9,         ids: ["f4-dW", "f4-plus"], color: BLUE }
    ];
    var DUR = 16000, running = false, start = null, raf = null;
    function frame(ts) {
      if (!running) return;
      if (start === null) start = ts;
      var d = (((ts - start) % DUR) / DUR) * L;
      var p = path.getPointAtLength(d);
      dot.setAttribute("cx", p.x); dot.setAttribute("cy", p.y);
      var ph = phases[0];
      for (var i = 0; i < phases.length; i++) { if (d < phases[i].until) { ph = phases[i]; break; } }
      dot.setAttribute("stroke", ph.color);
      $$(".f4-quad, .f4-mid", svg).forEach(function (g) {
        g.classList.toggle("f4-active", ph.ids.indexOf(g.id) !== -1);
      });
      raf = requestAnimationFrame(frame);
    }
    function play() { if (running) return; running = true; start = null; dot.style.display = ""; raf = requestAnimationFrame(frame); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); dot.style.display = "none";
      $$(".f4-quad, .f4-mid", svg).forEach(function (g) { g.classList.remove("f4-active"); }); }
    function checkVis() {
      var r = svg.getBoundingClientRect();
      var vis = r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
      vis ? play() : stop();
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (en) { en.isIntersecting ? play() : stop(); });
      }, { threshold: 0.2 }).observe(svg);
    }
    var scrollTick = false;
    document.addEventListener("scroll", function () {
      if (scrollTick) return;
      scrollTick = true;
      setTimeout(function () { scrollTick = false; checkVis(); }, 300);
    }, { passive: true });
    window.addEventListener("beforeprint", stop);
    window.addEventListener("afterprint", checkVis);
  })();

  /* ---------- Figure 6: clickable bit selector ---------- */
  (function () {
    var svg = $("#figure-6 svg");
    if (!svg) return;
    var ROW = { "2": ["#CFE2F3", "#6C8EBF"], "3": ["#F9CB9C", "#D79B00"], "b": ["#B9E0B0", "#82B366"] };
    var DEFAULT = { "1": "2", "2": "3", "n": "multi" };
    var state = { "1": "2", "2": "3", "n": "multi" };
    var cells = $$(".f6-cell", svg);
    function cellPos(col, row) {
      var g = cells.filter(function (c) { return c.getAttribute("data-col") === col && c.getAttribute("data-row") === row; })[0];
      return g ? { x: +g.getAttribute("data-x"), y: +g.getAttribute("data-y") } : null;
    }
    function render() {
      cells.forEach(function (g) {
        var col = g.getAttribute("data-col"), row = g.getAttribute("data-row");
        var rect = g.querySelector("rect");
        var active = state[col] === row || (col === "n" && state.n === "multi");
        if (active) {
          rect.setAttribute("fill", rect.getAttribute("data-fill"));
          rect.setAttribute("stroke", rect.getAttribute("data-border"));
          rect.setAttribute("stroke-width", "2.4");
          rect.removeAttribute("stroke-dasharray");
        } else {
          rect.setAttribute("fill", "#fff");
          rect.setAttribute("stroke", "#9a9a9a");
          rect.setAttribute("stroke-width", "1.6");
          rect.setAttribute("stroke-dasharray", "3 4");
        }
      });
      // selection arrows
      var arr = $("#f6-arrows", svg);
      var p1 = cellPos("1", state["1"]), p2 = cellPos("2", state["2"]);
      var h = '<path d="M224,436 L302,436 L302,' + (p1.y + 25) + " L324," + (p1.y + 25) +
              '" fill="none" stroke="#000" stroke-width="2" marker-end="url(#f6a)"/>';
      h += '<path d="M' + (p1.x + 104) + "," + (p1.y + 25) + " L457," + (p1.y + 25) + " L457," + (p2.y + 25) +
           " L" + (p2.x - 6) + "," + (p2.y + 25) + '" fill="none" stroke="#000" stroke-width="2" marker-end="url(#f6a)"/>';
      if (state.n !== "multi") {
        var pn = cellPos("n", state.n);
        h += '<path d="M' + (p2.x + 104) + "," + (p2.y + 25) + " L640," + (p2.y + 25) + " L640," + (pn.y + 25) +
             " L" + (pn.x - 6) + "," + (pn.y + 25) +
             '" fill="none" stroke="#555" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#f6a)"/>';
      }
      arr.innerHTML = h;
      // network node tint
      function tint(sel, key) {
        var c = key === "multi" ? ["#ffffff", "#000000"] : ROW[key];
        $$(sel, svg).forEach(function (n) { n.setAttribute("fill", c[0]); n.setAttribute("stroke", c[1]); });
      }
      tint(".f6-nodeL1", state["1"]);
      tint(".f6-nodeL2", state["2"]);
      tint(".f6-nodeLn", state.n);
    }
    svg.addEventListener("click", function (e) {
      var g = e.target.closest ? e.target.closest(".f6-cell") : null;
      if (g) {
        state[g.getAttribute("data-col")] = g.getAttribute("data-row");
        render();
        return;
      }
      if (e.target.id === "f6-reset") { state = { "1": DEFAULT["1"], "2": DEFAULT["2"], "n": DEFAULT.n }; render(); }
    });
    window.addEventListener("beforeprint", function () { state = { "1": DEFAULT["1"], "2": DEFAULT["2"], "n": DEFAULT.n }; render(); });
    render();
  })();

  /* ---------- Figure 8: step-through of the two PTQ pipelines ---------- */
  (function () {
    var fig = $("#figure-8");
    if (!fig) return;
    var seq = [
      { a: ["f8a-ptm", "f8a-cd"], b: ["f8b-ptm"] },
      { a: ["f8a-cal"], b: [], skip: true },
      { a: ["f8a-q"], b: ["f8b-q"] },
      { a: ["f8a-i8", "f8a-i4", "f8a-ib"], b: ["f8b-i8", "f8b-i4", "f8b-ib"] },
      { a: ["f8a-dep"], b: ["f8b-dep"] }
    ];
    var timer = null, played = false;
    function clear() {
      $$(".f8-on, .f8-skipnow", fig).forEach(function (el) { el.classList.remove("f8-on", "f8-skipnow"); });
      if (timer) { clearTimeout(timer); timer = null; }
    }
    function play() {
      clear();
      var i = 0;
      function step() {
        if (i >= seq.length) { timer = setTimeout(clear, 1800); return; }
        var st = seq[i];
        st.a.forEach(function (id) { var el = $("#" + id, fig); if (el) el.classList.add("f8-on"); });
        st.b.forEach(function (id) { var el = $("#" + id, fig); if (el) el.classList.add("f8-on"); });
        if (st.skip) {
          ["f8b-cd", "f8b-cal"].forEach(function (id) { var el = $("#" + id, fig); if (el) el.classList.add("f8-skipnow"); });
        }
        i++;
        timer = setTimeout(step, 1150);
      }
      step();
    }
    var btn = $("#f8-play");
    if (btn) btn.addEventListener("click", play);
    if (!reduced && "IntersectionObserver" in window) {
      new IntersectionObserver(function (es, obs) {
        es.forEach(function (en) { if (en.isIntersecting && !played) { played = true; play(); obs.disconnect(); } });
      }, { threshold: 0.35 }).observe(fig);
    }
    window.addEventListener("beforeprint", clear);
  })();

  /* ---------- Figure 5 taxonomy + generic chip navigation ---------- */
  (function () {
    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("d-cite")) return; // let citations be citations
      var chip = e.target.closest ? e.target.closest(".mchip[data-nav]") : null;
      if (!chip) return;
      var heading = document.getElementById(chip.getAttribute("data-nav"));
      if (!heading) return;
      var term = chip.getAttribute("data-term") || chip.textContent.trim();
      // find the first paragraph in this section mentioning the method
      var target = null, node = heading.nextElementSibling;
      while (node && !/^H[234]$/.test(node.tagName)) {
        if (node.tagName === "P" && node.textContent.indexOf(term.replace(/\)$/, "")) !== -1) { target = node; break; }
        node = node.nextElementSibling;
      }
      (target || heading).scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      if (target) {
        target.classList.remove("flash-fade");
        target.classList.add("flash-p");
        setTimeout(function () { target.classList.add("flash-fade"); target.classList.remove("flash-p"); }, 1600);
        setTimeout(function () { target.classList.remove("flash-fade"); }, 3400);
      }
    });
  })();
})();
