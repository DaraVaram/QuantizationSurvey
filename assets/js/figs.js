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

  /* ---------- shared tooltip for [data-tip] ----------
     One mechanism for every hint on the page. An element carries [data-tip] —
     written into the markup, or set by a figure's own handler — and this block
     positions and shows it, for pointer hover and for tap alike. */
  var tip = null, tipTxt = null, tipH = 0;
  function ensureTip() {
    if (!tip) { tip = document.createElement("div"); tip.className = "viz-tip"; document.body.appendChild(tip); }
    return tip;
  }
  function showTip(el, x, y) {
    var t = ensureTip();
    if (!el) { tipTxt = null; t.style.opacity = "0"; return; }
    // keyed on the text, not the element: Figure 6 reuses one cube group and
    // rewrites its [data-tip] per region, so caching the element goes stale
    var txt = el.getAttribute("data-tip");
    if (txt !== tipTxt) {                    // only re-render and re-measure when the hint changes
      t.innerHTML = txt;
      t.style.opacity = "1";
      tipH = t.offsetHeight;
      tipTxt = txt;
    }
    t.style.left = Math.min(x + 14, window.innerWidth - 270) + "px";
    t.style.top = (y + 14 + tipH > window.innerHeight - 8 ? Math.max(8, y - tipH - 12) : y + 14) + "px";
  }
  function tipTarget(e) { return e.target && e.target.closest ? e.target.closest("[data-tip]") : null; }
  function showTipOn(el) {                   // centre the hint on the element itself
    var b = el.getBoundingClientRect();
    tipTxt = null;
    showTip(el, b.left + b.width / 2, b.top + b.height / 2);
  }
  function hideTip() { showTip(null); }
  // Anything that explains itself on hover must do the same on keyboard focus.
  // Delegated, so it keeps working after a table reset rebuilds its rows.
  document.addEventListener("focusin", function (e) {
    var el = e.target && e.target.closest ? e.target.closest("[data-tip]") : null;
    if (el) showTipOn(el);
  });
  document.addEventListener("focusout", function (e) {
    if (e.target && e.target.closest && e.target.closest("[data-tip]")) hideTip();
  });
  function focusable(el, label, role) {
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", role || "button");
    if (label) el.setAttribute("aria-label", label);
  }
  function plain(html) {
    var d = document.createElement("div");
    d.innerHTML = html || "";
    return d.textContent.replace(/\s+/g, " ").trim();
  }
  document.addEventListener("mousemove", function (e) {
    showTip(tipTarget(e), e.clientX, e.clientY);
  }, { passive: true });
  // tap equivalent, so a hover-only hint is still reachable on a touch screen
  document.addEventListener("click", function (e) {
    var el = tipTarget(e);
    if (el) { tipTxt = null; showTip(el, e.clientX, e.clientY); }
  });


  /* ---------- Figure 9: sweep the loss landscape ----------
     The static figure already makes the point: after PTQ the converged weight
     sits in a narrow minimum and rounding to the integer grid costs a lot of
     loss, while after QAT it sits in a flat one and rounding costs almost
     nothing. Sweeping a probe across either panel lets the reader check that
     for any w, not just the one the figure happens to draw. */
  (function () {
    var panels = $$("#figure-9 .fl-panel");
    if (!panels.length) return;
    // the same landscape the figure is drawn from: an exact parabolic basin,
    // joined C1 to a cubic-Hermite left structure with slope 0 at the extrema
    var A = 0.172, WC = 1.5, LC = 0.26, WS = 2.05, SS = 0.55, JW = 0.95;
    var KX = [-1.25, -0.55, 0.25, JW],
        KY = [1.00, 0.16, 0.69, A * Math.pow(JW - WC, 2) + LC],
        KM = [-2.40, 0.0, 0.0, 2 * A * (JW - WC)];
    function loss(w) {
      if (w >= JW) { var d = w - WS; return A * Math.pow(w - WC, 2) + LC + (d > 0 ? SS * d * d * d : 0); }
      if (w <= KX[0]) return KY[0] + KM[0] * (w - KX[0]);
      var i = 0; while (KX[i + 1] < w) i++;
      var h = KX[i + 1] - KX[i], u = (w - KX[i]) / h, u2 = u * u, u3 = u2 * u;
      return (2*u3 - 3*u2 + 1) * KY[i] + (u3 - 2*u2 + u) * h * KM[i]
           + (-2*u3 + 3*u2) * KY[i + 1] + (u3 - u2) * h * KM[i + 1];
    }
    panels.forEach(function (p) {
      var d = p.dataset, probe = $(".fl-probe", p), stat = $(".fl-static", p), hit = $(".fl-hit", p);
      if (!probe || !hit) return;
      var ox = 0, X0 = +d.x0, PW = +d.pw, Y0 = +d.y0, PH = +d.ph;
      var WMIN = +d.wmin, WMAX = +d.wmax, LMIN = +d.lmin, LMAX = +d.lmax;
      var WLO = d.wlo !== undefined ? +d.wlo : WMIN, WHI = d.whi !== undefined ? +d.whi : WMAX;
      var px = function (w) { return ox + X0 + (w - WMIN) / (WMAX - WMIN) * PW; };
      var py = function (v) { return Y0 + (LMAX - v) / (LMAX - LMIN) * PH; };
      var pv = $(".fl-pv", p), pd = $(".fl-pd", p), po = $(".fl-po", p),
          pq = $(".fl-pq", p), read = $(".fl-read", p);
      var svg = p.ownerSVGElement, pt = svg.createSVGPoint();
      function move(e) {
        pt.x = e.clientX; pt.y = e.clientY;
        var loc = pt.matrixTransform(svg.getScreenCTM().inverse());
        var w = WMIN + (loc.x - ox - X0) / PW * (WMAX - WMIN);
        // stay where the nearest integer level is one the panel actually draws,
        // otherwise the rounded marker lands off the plot
        w = Math.max(WLO, Math.min(WHI, w));
        var wq = Math.round(w), dl = loss(wq) - loss(w);
        pv.setAttribute("x1", px(w)); pv.setAttribute("x2", px(w));
        po.setAttribute("cx", px(w)); po.setAttribute("cy", py(loss(w)));
        pq.setAttribute("cx", px(wq)); pq.setAttribute("cy", py(loss(wq)));
        pd.setAttribute("x1", px(wq)); pd.setAttribute("y1", py(loss(w)));
        pd.setAttribute("x2", px(wq)); pd.setAttribute("y2", py(loss(wq)));
        read.textContent = "w = " + w.toFixed(2) + "  \u2192  w_q = " + wq +
                           "   \u0394loss = " + (dl >= 0 ? "+" : "") + dl.toFixed(3);
        p.classList.add("fl-live");
      }
      function leave() { p.classList.remove("fl-live"); }
      hit.addEventListener("pointermove", move);
      hit.addEventListener("pointerdown", move);
      hit.addEventListener("pointerleave", leave);
      if (stat) stat.setAttribute("aria-hidden", "false");
    });
  })();


  /* ---------- Figure 12: the bit controller picks a policy per input ----------
     Adaptive allocation means the bit-widths are not fixed offline: a controller
     reads the input and chooses a precision for each layer. Activating one of the
     four inputs shows the policy that input would get, which is the whole point
     of content-aware allocation and is hard to convey in a static drawing. */
  (function () {
    var fig = $("#figure-12");
    if (!fig) return;
    var ins = $$(".f12-in", fig), cells = $$(".f12-cell", fig), read = $(".f12-read", fig);
    if (!ins.length || !cells.length) return;
    var LAYERS = ["1", "2", "n"], NAME = { "2": "2-bit", "3": "3-bit", "b": "b-bit" };
    function clear() {
      fig.classList.remove("f12-live");
      cells.forEach(function (c) { c.classList.remove("f12-on"); });
      ins.forEach(function (i) { i.classList.remove("f12-sel"); });
      if (read) read.textContent = "";
    }
    function pick(el) {
      var pol = (el.getAttribute("data-policy") || "").split(",");
      if (pol.length !== LAYERS.length) return;
      clear();
      fig.classList.add("f12-live");
      el.classList.add("f12-sel");
      cells.forEach(function (c) {
        var li = LAYERS.indexOf(c.getAttribute("data-layer"));
        if (li >= 0 && c.getAttribute("data-bit") === pol[li]) c.classList.add("f12-on");
      });
      if (read) read.textContent = "input “" + el.getAttribute("data-digit") + "” → " +
        pol.map(function (b, i) { return "layer " + LAYERS[i] + ": " + NAME[b]; }).join(",  ");
    }
    ins.forEach(function (el) {
      el.addEventListener("pointerenter", function () { pick(el); });
      el.addEventListener("click", function () { pick(el); });
      el.addEventListener("focus", function () { pick(el); });
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(el); } });
    });
    fig.addEventListener("pointerleave", clear);
  })();

  /* ---------- Figure 6: granularity hints ----------
     Per-tensor, per-channel and per-group behave identically: the hovered cube
     receives [data-tip], so the shared tooltip above shows and positions the
     hint the same way for every granularity, on hover and on tap. */
  (function () {
    var svg = $("#figure-6 svg");
    if (!svg) return;
    var TIP = {
      t: function () { return "Per-tensor: a single scale (s, z) is shared by every value in the tensor."; },
      pc: function (r) { return "Per-channel: channel " + (r + 1) + " has its own scale s<sub>" + (r + 1) + "</sub>."; },
      pg: function (r) { return "Per-group: this block within channel " + (r + 1) + " has its own scale."; }
    };
    function regionOf(el) {
      if (!el || !el.classList || !el.classList.contains("f2c")) return null;
      var cls = null;
      el.classList.forEach(function (k) { if (/^(t-all|pc-r\d|pg[lr]-g\d[LR])$/.test(k)) cls = k; });
      return cls;
    }
    function textFor(cls) {
      if (cls === "t-all") return TIP.t();
      if (cls.indexOf("pc-r") === 0) return TIP.pc(+cls.charAt(4));
      return TIP.pg(+cls.charAt(5));
    }
    function clear() {
      $$(".f2c", svg).forEach(function (el) { el.classList.remove("f2-hi", "f2-dim"); });
      $$("g[id]", svg).forEach(function (g) { g.removeAttribute("data-tip"); });
    }
    function enter(target) {
      var cls = regionOf(target);
      if (!cls) return;
      var cube = target.closest("g[id]");
      if (!cube) return;
      clear();
      cube.setAttribute("data-tip", textFor(cls));
      $$(".f2c", cube).forEach(function (el) {
        el.classList.toggle("f2-hi", el.classList.contains(cls));
        el.classList.toggle("f2-dim", !el.classList.contains(cls));
      });
    }
    svg.addEventListener("mouseover", function (e) { enter(e.target); });
    svg.addEventListener("mouseout", function (e) { if (regionOf(e.target)) clear(); });
    svg.addEventListener("click", function (e) { enter(e.target); });

    /* Keyboard: each cube is one tab stop and the arrow keys step through its
       regions, rather than putting a hundred individual cells in the tab order. */
    var NAME = { "f2-tensor": "Per-tensor quantization", "f2-channel": "Per-channel quantization",
                 "f2-group": "Per-group quantization" };
    $$("g[id]", svg).forEach(function (cube) {
      var regions = [];
      $$(".f2c", cube).forEach(function (el) {
        var c = regionOf(el);
        if (c && regions.indexOf(c) === -1) regions.push(c);
      });
      if (!regions.length) return;
      var at = 0;
      function show() {
        var cls = regions[at];
        clear();
        cube.setAttribute("data-tip", textFor(cls));
        $$(".f2c", cube).forEach(function (el) {
          el.classList.toggle("f2-hi", el.classList.contains(cls));
          el.classList.toggle("f2-dim", !el.classList.contains(cls));
        });
        showTipOn(cube);
      }
      cube.setAttribute("tabindex", "0");
      cube.setAttribute("role", "button");
      cube.setAttribute("aria-label", (NAME[cube.id] || "Quantization granularity") +
        (regions.length > 1 ? ", " + regions.length + " regions; use the arrow keys" : ""));
      cube.addEventListener("focus", function () { at = 0; show(); });
      cube.addEventListener("blur", function () { clear(); hideTip(); });
      cube.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") { at = (at + 1) % regions.length; show(); e.preventDefault(); }
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { at = (at - 1 + regions.length) % regions.length; show(); e.preventDefault(); }
        else if (e.key === "Enter" || e.key === " ") { show(); e.preventDefault(); }
        else if (e.key === "Escape") { clear(); hideTip(); }
      });
    });
  })();

  /* ---------- Figure 8: traveling marker + forward/backward isolation ---------- */
  (function () {
    var svg = $("#figure-8 svg");
    if (!svg) return;
    var path = $("#f4-loop", svg), dot = $("#f4-dot", svg);
    var L = path ? path.getTotalLength() : 0;   // segment lengths: 677|1972|1477|1972|665
    var GREEN = "#00CC00", BLUE = "#3E8EF7";
    // cumulative breakpoints along the loop
    var B = { upLeft: 677, topMid: 1709, topEnd: 2649, rightBlue: 3358, rightEnd: 4126, botMid: 5066, botEnd: 6098 };
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
    var isolated = null, locked = null;
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
    function play() {
      if (running || reduced || isolated || !path || !dot) return;
      running = true; start = null; dot.style.display = ""; raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false; if (raf) cancelAnimationFrame(raf);
      if (dot) dot.style.display = "none";
      $$(".f4-quad, .f4-mid", svg).forEach(function (g) { g.classList.remove("f4-active"); });
    }
    function checkVis() {
      var r = svg.getBoundingClientRect();
      var vis = r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
      vis ? play() : stop();
    }

    /* Pointing at the upper half emphasises the forward pass and fades the
       backward pass; the lower half does the reverse. Both passes meet at the
       "+" junction on y=820, so the band around it isolates nothing. Tapping
       locks a half, which is how this works on a touch screen. */
    var VB_H = 1640, UPPER = 780, LOWER = 862;
    function sideAt(clientY) {
      var r = svg.getBoundingClientRect();
      if (!r.height) return null;
      var y = (clientY - r.top) / r.height * VB_H;
      return y < UPPER ? "fwd" : (y > LOWER ? "bwd" : null);
    }
    function isolate(side) {
      side = side || null;
      if (side === isolated) return;
      isolated = side;
      svg.classList.toggle("f4-iso-fwd", isolated === "fwd");
      svg.classList.toggle("f4-iso-bwd", isolated === "bwd");
      if (isolated) stop(); else checkVis();     // the loop resumes once nothing is isolated
    }
    svg.addEventListener("mousemove", function (e) { if (!locked) isolate(sideAt(e.clientY)); }, { passive: true });
    svg.addEventListener("mouseleave", function () { locked = null; isolate(null); });
    svg.addEventListener("click", function (e) {
      var s = sideAt(e.clientY);
      locked = (locked && locked === s) ? null : s;   // tap the same half again to release
      isolate(locked);
    });
    document.addEventListener("click", function (e) {
      if (locked && !(e.target.closest && e.target.closest("#figure-8"))) { locked = null; isolate(null); }
    });

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
    window.addEventListener("beforeprint", function () { locked = null; isolate(null); stop(); });
    window.addEventListener("afterprint", checkVis);
  })();

  /* ---------- Figure 11: clickable bit selector ---------- */
  (function () {
    var svg = $("#figure-11 svg");
    if (!svg) return;
    var ROW = { "2": ["#CFE2F3", "#6C8EBF"], "3": ["#F9CB9C", "#D79B00"], "b": ["#B9E0B0", "#82B366"] };
    var DEFAULT = { "1": "2", "2": "3", "n": "b" };
    var state = { "1": "2", "2": "3", "n": "b" };
    var cells = $$(".f6-cell", svg);
    function cellPos(col, row) {
      var g = cells.filter(function (c) { return c.getAttribute("data-col") === col && c.getAttribute("data-row") === row; })[0];
      return g ? { x: +g.getAttribute("data-x"), y: +g.getAttribute("data-y") } : null;
    }
    /* Layer 2 -> Layer n routing. Continuation ellipses sit at x=676 on every
       row, so the connector must never approach a cell edge-on from the left,
       and the layer captions sit below y=800, so it must never dip past the
       grid either. Every route therefore leaves Layer 2 through its right
       edge, drops into the empty corridor at x=624, runs along a clear band
       between two rows, and enters Layer n vertically through its nearest free
       edge. No combination crosses a cell, an ellipsis or a caption. */
    var CORRIDOR = 624, ENTRY = 724;
    var LANE = { "2": 604, "3": 690, "b": 690 };   // clear horizontal bands between the rows
    var EDGE = { "2": 594, "3": 669, "b": 734 };   // stop just outside the target's edge
    function render() {
      cells.forEach(function (g) {
        var col = g.getAttribute("data-col"), row = g.getAttribute("data-row");
        var rect = g.querySelector("rect");
        var active = state[col] === row;
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
      var laneY = LANE[state.n], edgeY = EDGE[state.n];
      h += '<path d="M' + (p2.x + 104) + "," + (p2.y + 25) +
           " L" + CORRIDOR + "," + (p2.y + 25) +
           " L" + CORRIDOR + "," + laneY +
           " L" + ENTRY + "," + laneY +
           " L" + ENTRY + "," + edgeY +
           '" fill="none" stroke="#555" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#f6a)"/>';
      arr.innerHTML = h;
      // network node tint
      function tint(sel, key) {
        var c = ROW[key] || ["#ffffff", "#000000"];
        $$(sel, svg).forEach(function (n) { n.setAttribute("fill", c[0]); n.setAttribute("stroke", c[1]); });
      }
      tint(".f6-nodeL1", state["1"]);
      tint(".f6-nodeL2", state["2"]);
      tint(".f6-nodeLn", state.n);
    }
    function select(col, row) { state[col] = row; render(); }
    svg.addEventListener("click", function (e) {
      var g = e.target.closest ? e.target.closest(".f6-cell") : null;
      if (g) { select(g.getAttribute("data-col"), g.getAttribute("data-row")); return; }
      if (e.target.id === "f6-reset") { state = { "1": DEFAULT["1"], "2": DEFAULT["2"], "n": DEFAULT.n }; render(); }
    });

    /* Keyboard: each layer column is a radio group. One tab stop per column
       lands on its current bit-width; the arrow keys move the selection. */
    var LABEL = { "1": "Layer 1", "2": "Layer 2", "n": "Layer n" };
    var ROWNAME = { "2": "2-bit", "3": "3-bit", "b": "b-bit" };
    var columns = {};
    cells.forEach(function (c) { (columns[c.getAttribute("data-col")] = columns[c.getAttribute("data-col")] || []).push(c); });
    Object.keys(columns).forEach(function (col) {
      var group = columns[col];
      var wrap = document.createElementNS("http://www.w3.org/2000/svg", "g");
      wrap.setAttribute("role", "radiogroup");
      wrap.setAttribute("aria-label", LABEL[col] + " bit-width");
      group[0].parentNode.insertBefore(wrap, group[0]);
      group.forEach(function (c) {
        wrap.appendChild(c);
        c.setAttribute("role", "radio");
        c.setAttribute("aria-label", LABEL[col] + ", " + ROWNAME[c.getAttribute("data-row")]);
        c.addEventListener("keydown", function (e) {
          var i = group.indexOf(c), k = e.key, j = null;
          if (k === "ArrowDown" || k === "ArrowRight") j = (i + 1) % group.length;
          else if (k === "ArrowUp" || k === "ArrowLeft") j = (i - 1 + group.length) % group.length;
          else if (k === "Enter" || k === " ") { select(col, c.getAttribute("data-row")); e.preventDefault(); return; }
          if (j === null) return;
          e.preventDefault();
          select(col, group[j].getAttribute("data-row"));
          group[j].focus();
        });
      });
    });
    function syncA11y() {
      cells.forEach(function (c) {
        var on = state[c.getAttribute("data-col")] === c.getAttribute("data-row");
        c.setAttribute("aria-checked", on ? "true" : "false");
        c.setAttribute("tabindex", on ? "0" : "-1");     // roving tab stop per column
      });
    }
    var reset = $("#f6-reset", svg);
    if (reset) {
      reset.setAttribute("tabindex", "0");
      reset.setAttribute("role", "button");
      reset.setAttribute("aria-label", "Reset the bit-width selection");
      reset.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          state = { "1": DEFAULT["1"], "2": DEFAULT["2"], "n": DEFAULT.n }; render(); e.preventDefault();
        }
      });
    }
    var baseRender = render;
    render = function () { baseRender(); syncA11y(); };
    window.addEventListener("beforeprint", function () { state = { "1": DEFAULT["1"], "2": DEFAULT["2"], "n": DEFAULT.n }; render(); });
    render();
  })();

  /* ---------- Figure 14: continuously looping step-through (gif-style) ---------- */
  (function () {
    var fig = $("#figure-14");
    if (!fig || reduced) return;
    var seq = [
      { a: ["f8a-ptm", "f8a-cd"], b: ["f8b-ptm"] },
      { a: ["f8a-cal"], b: [], skip: true },
      { a: ["f8a-q"], b: ["f8b-q"] },
      { a: ["f8a-i8", "f8a-i4", "f8a-ib"], b: ["f8b-i8", "f8b-i4", "f8b-ib"] },
      { a: ["f8a-dep"], b: ["f8b-dep"] },
      { a: [], b: [], pause: true }          // brief full-lit hold, then restart
    ];
    var timer = null, running = false, i = 0;
    function clear() {
      $$(".f8-on, .f8-skipnow", fig).forEach(function (el) { el.classList.remove("f8-on", "f8-skipnow"); });
    }
    function step() {
      if (!running) return;
      if (i >= seq.length) { i = 0; clear(); timer = setTimeout(step, 700); return; }
      var st = seq[i];
      st.a.forEach(function (id) { var el = $("#" + id, fig); if (el) el.classList.add("f8-on"); });
      st.b.forEach(function (id) { var el = $("#" + id, fig); if (el) el.classList.add("f8-on"); });
      if (st.skip) {
        ["f8b-cd", "f8b-cal"].forEach(function (id) { var el = $("#" + id, fig); if (el) el.classList.add("f8-skipnow"); });
      }
      i++;
      timer = setTimeout(step, st.pause ? 1600 : 1150);
    }
    function start() { if (running) return; running = true; i = 0; clear(); step(); }
    function stop() { running = false; if (timer) { clearTimeout(timer); timer = null; } clear(); }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (en) { en.isIntersecting ? start() : stop(); });
      }, { threshold: 0.3 }).observe(fig);
    } else start();
    window.addEventListener("beforeprint", stop);
  })();

  /* ---------- References: numbered entries + clickable citations ---------- */
  (function () {
    // key -> number, by first appearance in document order (manuscript order)
    var nums = {}, n = 0;
    $$("d-cite").forEach(function (c) {
      (c.getAttribute("key") || "").split(",").forEach(function (k) {
        k = k.trim();
        if (k && !(k in nums)) nums[k] = ++n;
      });
    });
    var byNum = [];
    Object.keys(nums).forEach(function (k) { byNum[nums[k]] = k; });

    // urls/dois from the bibliography file (for outbound links on entries)
    var links = {};
    fetch("assets/bibliography/references.bib?v=20260909e").then(function (r) { return r.text(); }).then(function (bib) {
      bib.split(/@(?=\w+\s*\{)/).forEach(function (chunk) {
        var km = chunk.match(/^\w+\s*\{\s*([^,\s]+)\s*,/);
        if (!km) return;
        var um = chunk.match(/\burl\s*=\s*\{([^}]+)\}/i);
        var dm = chunk.match(/\bdoi\s*=\s*\{([^}]+)\}/i);
        var em = chunk.match(/\beprint\s*=\s*\{([^}]+)\}/i);
        var u = null;
        if (dm) u = "https://doi.org/" + dm[1].trim();
        else if (um) u = um[1].trim();
        else if (em) u = "https://arxiv.org/abs/" + em[1].trim();
        if (u) links[km[1].trim()] = u;
      });
      enhanceSoon();
    }).catch(enhanceSoon);

    function enhance() {
      var cl = document.querySelector("d-citation-list");
      if (!cl) return false;
      var sr = cl.shadowRoot || cl;
      var lis = sr.querySelectorAll("li");
      if (!lis.length) return false;
      try {
        var st = sr.querySelector("style");
        if (st && st.sheet) {
          // Reference markers are left to distill's default decimal list, matching
          // the official TMLR Beyond PDF template. (We used to override them with
          // blue bracketed [n] counters here.)
          st.sheet.insertRule("li.ref-flash{background:#fff3c4 !important}", 0);
          st.sheet.insertRule("a.ref-out{color:#2698BA;text-decoration:none;margin-left:5px;font-size:0.85em}", 0);
        }
      } catch (e) { }
      lis.forEach(function (li, i) {
        if (li.dataset.refDone) return;
        li.dataset.refDone = "1";
        var key = byNum[i + 1];
        if (key && links[key]) {
          var a = document.createElement("a");
          a.className = "ref-out";
          a.href = links[key];
          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = "[link ↗]";
          li.appendChild(a);
        }
      });
      return true;
    }
    var tries = 0, timer = null;
    function enhanceSoon() {
      if (timer) return;
      timer = setInterval(function () {
        if (enhance() || ++tries > 60) { clearInterval(timer); timer = null; }
      }, 500);
    }
    enhanceSoon();

    function entryLi(key) {
      var num = nums[key];
      if (!num) return null;
      var cl = document.querySelector("d-citation-list");
      if (!cl) return null;
      return (cl.shadowRoot || cl).querySelectorAll("li")[num - 1] || null;
    }
    function jump(key) {
      var li = entryLi(key);
      if (!li) return false;
      li.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      li.classList.add("ref-flash");
      setTimeout(function () { li.classList.remove("ref-flash"); }, 2200);
      return true;
    }
    // Rendered text of a reference entry, for hover cards elsewhere on the page.
    // The outbound "[link]" is stripped so the card stays self-contained.
    function entryHTML(key) {
      var li = entryLi(key);
      if (!li) return null;
      var c = li.cloneNode(true);
      $$(".ref-out", c).forEach(function (a) { a.parentNode.removeChild(a); });
      return c.innerHTML;
    }
    window.QSRefs = { number: function (k) { return nums[k] || null; }, jump: jump, entryHTML: entryHTML };

    // clicking an inline citation jumps to its entry in the reference list
    document.addEventListener("click", function (e) {
      var c = e.target.closest ? e.target.closest("d-cite") : null;
      if (!c) return;
      jump((c.getAttribute("key") || "").split(",")[0].trim());
    });
  })();

  /* ---------- Tables: reference cards on the study citations ----------
     Citations inside a table use the same <d-cite> element as the prose, but
     distill lays its hover box out inside the table wrapper, which is a
     horizontal scroll container and therefore clips it. Suppress that box and
     draw the same reference entry in a fixed-position card instead, so the
     first column of Tables 4-6 behaves like a citation anywhere else. */
  (function () {
    var wraps = $$(".ptable-wrap");
    if (!wraps.length) return;
    var card = null, cardFor = null;
    function ensureCard() {
      if (!card) { card = document.createElement("div"); card.className = "cite-card"; document.body.appendChild(card); }
      return card;
    }
    function hide() { cardFor = null; if (card) card.style.opacity = "0"; }
    function suppressNative(c) {
      if (c.__qsPlain || !c.shadowRoot) return;
      var st = document.createElement("style");
      st.textContent = "d-hover-box{display:none !important}";
      c.shadowRoot.appendChild(st);
      c.__qsPlain = true;
    }
    function show(c, x, y) {
      var el = ensureCard();
      if (c !== cardFor) {
        var html = (c.getAttribute("key") || "").split(",").map(function (k) {
          k = k.trim();
          var body = k && window.QSRefs && window.QSRefs.entryHTML(k);
          if (!body) return "";
          return '<div class="cc-entry"><span class="cc-num">[' + window.QSRefs.number(k) + "]</span>" + body + "</div>";
        }).join("");
        if (!html) { hide(); return; }
        el.innerHTML = html;
        el.style.opacity = "1";
        cardFor = c;
      }
      var w = el.offsetWidth, h = el.offsetHeight;
      el.style.left = Math.max(8, Math.min(x + 14, window.innerWidth - w - 12)) + "px";
      el.style.top = (y + 16 + h > window.innerHeight - 8 ? Math.max(8, y - h - 14) : y + 16) + "px";
    }
    wraps.forEach(function (w) {
      w.addEventListener("mousemove", function (e) {
        var c = e.target.closest ? e.target.closest("d-cite") : null;
        if (!c) { hide(); return; }
        suppressNative(c);
        show(c, e.clientX, e.clientY);
      }, { passive: true });
      w.addEventListener("mouseleave", hide);
      // focus parity: the card must also appear for a keyboard reader
      w.addEventListener("focusin", function (e) {
        var c = e.target.closest ? e.target.closest("d-cite") : null;
        if (!c) return;
        suppressNative(c);
        cardFor = null;
        var b = c.getBoundingClientRect();
        show(c, b.left + b.width / 2, b.bottom - b.height / 2);
      });
      w.addEventListener("focusout", hide);
    });

    // A study row is about one paper, so clicking anywhere in it opens that
    // reference — without hijacking text selection or the citation itself.
    ["table-4", "table-5", "table-6"].forEach(function (id) {
      var w = $("#" + id);
      if (!w) return;
      w.classList.add("t-studies");
      w.addEventListener("click", function (e) {
        if (e.target.closest && e.target.closest("d-cite")) return;
        var sel = window.getSelection();
        if (sel && !sel.isCollapsed) return;
        var tr = e.target.closest ? e.target.closest("tbody tr") : null;
        if (!tr) return;
        var c = tr.querySelector("d-cite");
        if (c && window.QSRefs) window.QSRefs.jump((c.getAttribute("key") || "").split(",")[0].trim());
      });
    });
  })();

  /* ---------- Keyboard and focus parity for the remaining controls ----------
     Figure 16's stages, Figure 10's method chips, Table 3's platforms and the
     citations inside the tables all explained themselves on hover only. Each
     now takes focus and reveals the same thing there. */
  (function () {
    // Figure 16: every pipeline stage, including the inspection icon
    $$("#figure-16 .f9-node").forEach(function (n) {
      focusable(n, plain(n.getAttribute("data-tip")), "button");
    });
    // Taxonomy (Figures 10 and 15) and supplement method chips navigate into the prose. They contain
    // <d-cite> children, so they stay spans with button semantics rather than
    // nesting one interactive element inside another.
    $$(".mchip[data-nav]").forEach(function (chip) {
      chip.setAttribute("tabindex", "0");
      chip.setAttribute("role", "button");
      chip.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        if (e.target.closest && e.target.closest("d-cite")) return;
        e.preventDefault();
        chip.click();
      });
    });
    // Citations inside tables: Enter/Space opens the reference. Delegated,
    // because a table reset rebuilds every row from its original markup.
    // (The focusable attributes are written in supplements.js before that
    // markup is captured, so they survive the rebuild.)
    $$(".ptable-wrap").forEach(function (w) {
      w.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        var c = e.target.closest ? e.target.closest("d-cite") : null;
        if (!c) return;
        e.preventDefault();
        var k = (c.getAttribute("key") || "").split(",")[0].trim();
        if (k && window.QSRefs) window.QSRefs.jump(k);
      });
    });
  })();

  /* ---------- Taxonomy figures + generic chip navigation ---------- */
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

  /* ---------- Figure 17: the deployment stack ----------
     A practitioner's map, read top-down from the application to the
     hardware. Selecting an entry shows the concrete routes that carry it,
     drawn one colour per route from DATA.guide. Exactly three things can
     happen to a chip while a route is shown, and they look different:
     it is a step on the drawn line, it is a branch the reader can take
     instead (clicking it re-traces through it, keeping the question), or
     it is a setting the route fixes rather than a choice. Everything else
     dims. Hovering a challenge pin still brackets the layers it bridges. */
  (function () {
    var fig = $("#figure-17.stack-fig");
    if (!fig) return;
    var D = window.DATA || {}, G = D.guide || { families: {}, paths: {}, applications: {}, notes: {} };
    var grid = $(".stk-grid", fig), layersEl = $(".stk-layers", fig), overlay = $(".stk-overlay", fig), panel = $(".stk-panel", fig);
    var input = $(".stk-search", fig), suggest = $("#stk-suggest"), clearBtn = $(".stk-clear", fig);
    var layers = $$(".stk-layer", fig), chips = $$(".mchip[data-k]", fig), pins = $$(".stk-pin", fig);
    var byKey = {}, LABEL = {};
    chips.forEach(function (c) {
      var k = c.getAttribute("data-k");
      byKey[k] = c; LABEL[k] = c.textContent.replace(/\s+/g, " ").trim();
    });
    var NS = "http://www.w3.org/2000/svg";
    var PATHS = G.paths, PIDS = Object.keys(PATHS);
    function famName(f) { return (G.families[f] || {}).name || f; }

    /* ---- which routes touch a given chip ---- */
    function pathTouches(pid, k) {
      var P = PATHS[pid];
      if (P.line.indexOf(k) !== -1) return "line";
      var opt = P.options || {};
      for (var step in opt) if (opt[step].indexOf(k) !== -1) return "branch";
      return (P.implies || []).indexOf(k) !== -1 ? "implied" : null;
    }
    function byRank(a, b) { return (PATHS[a].rank || 99) - (PATHS[b].rank || 99); }
    function pathsFor(k, kinds) {
      return PIDS.filter(function (pid) { return kinds.indexOf(pathTouches(pid, k)) !== -1; }).sort(byRank);
    }
    // substitute a branch into the step it replaces, pulling coupled choices with it
    var COUPLES = G.couples || {};
    function withCouples(refs) {
      var out = refs.slice();
      refs.forEach(function (k) { (COUPLES[k] || []).forEach(function (c) { if (out.indexOf(c) === -1) out.push(c); }); });
      return out;
    }
    function materialise(pid, refs) {
      var P = PATHS[pid], line = P.line.slice(), opt = P.options || {}, all = withCouples(refs);
      all.forEach(function (k) {
        for (var step in opt) {
          if (opt[step].indexOf(k) !== -1) { var i = line.indexOf(step); if (i !== -1) line[i] = k; return; }
        }
      });
      // a width the current platform cannot carry moves the route to one that can
      var ok = allowedHw(pid, all);
      if (ok.length) {
        for (var i = 0; i < line.length; i++) {
          var c = byKey[line[i]];
          if (c && c.closest(".stk-layer").getAttribute("data-layer") === "hw" && ok.indexOf(line[i]) === -1) line[i] = ok[0];
        }
      }
      return line;
    }
    function accepts(pid, refs) {
      if (!refs.every(function (k) { var t = pathTouches(pid, k); return t === "line" || t === "branch"; })) return false;
      return allowedHw(pid, withCouples(refs)).length > 0;      // no platform carries it, so the route is out
    }

    /* ---- Table 3, to say which platforms carry a width ---- */
    var FMTKEY = { INT1: "n:INT1", INT2: "n:INT2", INT4: "n:INT4", INT8: "n:INT8", INT16: "n:INT16" };
    var DEVMAP = [
      [/STM32N6/i, "h:n6"], [/STM32|Nucleo/i, "h:stm32"], [/Arduino|nRF52840/i, "h:nano33"], [/Spresense/i, "h:spresense"],
      [/OpenMV|H7 Plus/i, "h:openmv"], [/SparkFun/i, "h:sparkfun"], [/Apollo/i, "h:apollo"], [/Cortex-M4F/i, "h:cm4f"],
      [/ESP32-C3/i, "h:c3"], [/ESP32-C6/i, "h:c6"], [/ESP32-P4/i, "h:p4"], [/PULP/i, "h:pulp"],
      [/MAX78000/i, "h:max000"], [/MAX78002/i, "h:max002"], [/GAP8/i, "h:gap8"], [/GAP9/i, "h:gap9"],
      [/Ethos|HX6538/i, "h:ethos"], [/MCXN/i, "h:mcxn"], [/MSPM0/i, "h:mspm0"]
    ];
    function devKey(s) { for (var i = 0; i < DEVMAP.length; i++) if (DEVMAP[i][0].test(s)) return DEVMAP[i][1]; return null; }
    var HW = (D.hardware || []).map(function (h) {
      var fk = [];
      (h.formats || []).forEach(function (f) { if (/INT2.INT8/.test(f)) fk.push("n:INT2", "n:INT4", "n:INT8"); else if (FMTKEY[f]) fk.push(FMTKEY[f]); });
      return { platform: h.platform, chip: devKey(h.platform), formats: h.formats || [], fkeys: fk };
    });
    function platformsFor(fkeys) { return HW.filter(function (h) { return h.chip && fkeys.some(function (k) { return h.fkeys.indexOf(k) !== -1; }); }); }
    var WIDTHS = { "n:INT1": 1, "n:INT2": 1, "n:INT4": 1, "n:INT8": 1, "n:INT16": 1 };
    var PW = {};                                        // every platform's supported widths
    HW.forEach(function (h) { if (h.chip) PW[h.chip] = h.fkeys.slice(); });
    Object.keys(G.platformWidths || {}).forEach(function (k) { if (!PW[k]) PW[k] = G.platformWidths[k].slice(); });
    function carries(hwKey, w) { return !PW[hwKey] || PW[hwKey].indexOf(w) !== -1; }
    function hwChoices(pid) {
      var P = PATHS[pid], step = null;
      P.line.forEach(function (k) { if (byKey[k] && byKey[k].closest(".stk-layer").getAttribute("data-layer") === "hw") step = k; });
      return step ? [step].concat((P.options || {})[step] || []) : [];
    }
    function allowedHw(pid, refs) {
      var ws = refs.filter(function (k) { return WIDTHS[k]; });
      return hwChoices(pid).filter(function (h) { return ws.every(function (w) { return carries(h, w); }); });
    }
    function widthNote(fkeys, lead) {
      var hs = platformsFor(fkeys);
      if (!hs.length) return null;
      return lead + " " + hs.map(function (h) { return h.platform + " (" + h.formats.join(", ") + ")"; }).join("; ") + ".";
    }

    /* ---- free text ---- */
    var ALIAS = {
      "arm": "fam:arm", "arm-based": "fam:arm", "cortex": "fam:arm", "cortex-m": "fam:arm",
      "risc-v": "fam:riscv", "riscv": "fam:riscv", "risc-v-based": "fam:riscv",
      "npu": "fam:npu", "npu-integrated": "fam:npu", "accelerator": "fam:npu",
      "kws": "cat:Keyword Spotting", "keyword": "cat:Keyword Spotting", "har": "cat:HAR", "activity": "cat:HAR",
      "drone": "cat:Drones", "health": "cat:Healthcare", "medical": "cat:Healthcare", "industrial": "cat:Industrial",
      "environment": "cat:Environment", "environmental": "cat:Environment", "vision": "cat:Image Classification", "classification": "cat:Image Classification",
      "detection": "cat:Object Detection", "anomaly": "cat:Anomaly Detection", "network": "cat:Networking", "robot": "cat:Robotics", "vqa": "cat:VQA",
      "mpq": "s:mixed", "mixed": "s:mixed", "mixed-precision": "s:mixed", "mixed precision": "s:mixed",
      "sub-8-bit": "s:extreme", "sub8": "s:extreme", "sub-8": "s:extreme", "low-bit": "s:extreme", "binary": "n:INT1", "ternary": "n:INT1", "bnn": "n:INT1",
      "int8": "n:INT8", "uint8": "n:INT8", "int16": "n:INT16", "int4": "n:INT4", "int2": "n:INT2", "fp16": "n:FP16", "bf16": "n:BF16", "fp8": "n:FP8",
      "msfp": "n:MSFP", "block floating-point": "n:MSFP", "posit": "n:posit", "takum": "n:takum", "fixed-point": "n:fxp",
      "qat": "q:QAT", "ptq": "q:PTQ", "post-training": "q:PTQ", "quantization-aware": "q:QAT",
      "tflm": "f:tflm", "tflite": "f:tflite", "litert": "f:tflite", "tensorflow lite": "f:tflite", "tensorflow": "f:tf", "pytorch": "f:pytorch",
      "edge impulse": "f:ei", "edgeimpulse": "f:ei", "cmsis": "f:cmsis", "cmsis-nn": "f:cmsis", "onnx": "f:onnx", "cube.ai": "f:cubeai", "stm32cube": "f:cubeai",
      "nntool": "f:gapflow", "autotiler": "f:gapflow", "gapflow": "f:gapflow", "ai8x": "f:ai8xs", "esp-nn": "f:espnn",
      "stm32": "h:stm32", "nucleo": "h:stm32", "arduino": "h:nano33", "nano 33": "h:nano33", "nrf52840": "h:nano33", "spresense": "h:spresense",
      "openmv": "h:openmv", "apollo": "h:apollo", "esp32-c3": "h:c3", "esp32-c6": "h:c6", "esp32-p4": "h:p4", "pulp": "h:pulp",
      "max78000": "h:max000", "max78002": "h:max002", "gap8": "h:gap8", "gap9": "h:gap9", "ethos": "h:ethos", "ethos-u55": "h:ethos",
      "stm32n6": "h:n6", "mcxn94": "h:mcxn", "nxp": "h:mcxn", "mspm0": "h:mspm0"
    };
    Object.keys(LABEL).forEach(function (k) { ALIAS[LABEL[k].toLowerCase()] = k; });
    var GROUP = { "esp32": ["h:c3", "h:c6", "h:p4"], "gap": ["h:gap8", "h:gap9"], "max78": ["h:max000", "h:max002"] };

    /* ---- a query: a subject, the routes that carry it, and any branches taken ---- */
    function makeQuery(subject, label, pids, refs, note, base) {
      return { subject: subject, label: label, pids: pids || [], refs: refs || [], base: base || [], note: note || null, pick: 0 };
    }
    function allRefs(q) { return (q.base || []).concat(q.refs); }
    function queryFor(k) {
      var t = k.split(":")[0], val = k.slice(t.length + 1), note = G.notes[k] || null;
      if (t === "cat") {
        var A = G.applications[val] || { paths: [], note: "" };
        return makeQuery(k, LABEL[k], A.paths.slice(), [], A.note, (A.via || []).slice());
      }
      if (t === "fam") return makeQuery(k, famName(val), PIDS.filter(function (p) { return PATHS[p].fam === val; }).sort(byRank), [], null);
      var onLine = pathsFor(k, ["line"]), asBranch = pathsFor(k, ["branch"]), implied = pathsFor(k, ["implied"]);
      if (onLine.length || asBranch.length) return makeQuery(k, LABEL[k], onLine.concat(asBranch).sort(byRank), [k], note);
      if (implied.length) return makeQuery(k, LABEL[k], implied, [], note || "This is fixed by the routes below rather than chosen separately.");
      // nothing carries it
      var q = makeQuery(k, LABEL[k], [], [], note);
      q.dead = true;
      if (t === "n") q.width = k;
      return q;
    }
    function queryForText(s) {
      var t = s.trim().toLowerCase().replace(/\s+/g, " ");
      if (!t) return null;
      if (ALIAS[t]) return queryFor(ALIAS[t]);
      if (GROUP[t]) {
        var pids = []; GROUP[t].forEach(function (k) { pathsFor(k, ["line", "branch"]).forEach(function (p) { if (pids.indexOf(p) === -1) pids.push(p); }); });
        return makeQuery(null, s.trim(), pids.sort(byRank), [], null);
      }
      var hit = Object.keys(ALIAS).filter(function (a) { return a.length >= 3 && (a.indexOf(t) !== -1 || t.indexOf(a) !== -1); })
                      .sort(function (a, b) { return Math.abs(a.length - t.length) - Math.abs(b.length - t.length); })[0];
      if (hit) return queryFor(ALIAS[hit]);
      var q = makeQuery(null, s.trim(), [], [], "Nothing in the stack matches this. Try an application, a method, a format, a tool, or a platform.");
      q.dead = true;
      return q;
    }
    // the routes still viable once the branches taken are applied
    /* Only the branches the reader has taken decide which routes survive. The steps the
       recommendation itself fixes are applied wherever a route can take them and ignored
       where it cannot, so naming a board for one route never hides the others. */
    function viable(q) { return q.pids.filter(function (p) { return accepts(p, q.refs); }); }
    /* A route carrying a caveat, such as hardware that is no longer sold, keeps its place in
       the list but never becomes the drawn recommendation while an available one exists. */
    function defaultPick(vp) { for (var i = 0; i < vp.length; i++) if (!PATHS[vp[i]].caveat) return i; return 0; }
    function pickedId(q) { var vp = viable(q); return vp[q.pickSet ? q.pick : defaultPick(vp)] || vp[0]; }

    /* ---- geometry ---- */
    function rel(el) {
      var g = grid.getBoundingClientRect(), b = el.getBoundingClientRect();
      return { x: b.left - g.left, y: b.top - g.top, w: b.width, h: b.height, cx: b.left - g.left + b.width / 2, cy: b.top - g.top + b.height / 2 };
    }
    function mk(tag, attrs) { var e = document.createElementNS(NS, tag); Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); }); return e; }
    function pinByLabel(t) { for (var i = 0; i < pins.length; i++) if (pins[i].textContent.trim() === t) return pins[i]; return null; }
    function clearPaths() { $$(".stk-path, .stk-path-halo, .stk-path-broken, .stk-arrow", overlay).forEach(function (e) { e.parentNode.removeChild(e); }); }
    function pathD(keys, dx) {
      var pts = [], prevX = null;
      layers.forEach(function (L) {
        var bands = {};
        keys.map(function (k) { return byKey[k]; }).filter(function (c) { return c && c.closest(".stk-layer") === L; }).forEach(function (c) {
          var r = rel(c); r.cx += dx; var band = Math.round(r.cy / 8); (bands[band] = bands[band] || []).push(r);
        });
        Object.keys(bands).sort(function (a, b) { return a - b; }).forEach(function (band) {
          var ps = bands[band].sort(function (a, b) { return a.cx - b.cx; });
          if (prevX !== null && Math.abs(prevX - ps[ps.length - 1].cx) < Math.abs(prevX - ps[0].cx)) ps.reverse();
          ps.forEach(function (p) { pts.push(p); }); prevX = ps[ps.length - 1].cx;
        });
      });
      if (pts.length < 2) return null;
      var d = "M" + pts[0].cx + "," + pts[0].cy, arrows = [];
      for (var i = 1; i < pts.length; i++) {
        var a = pts[i - 1], b = pts[i];
        if (Math.abs(b.cy - a.cy) < 4) d += " L" + b.cx + "," + b.cy;
        else {
          var my = (a.cy + b.cy) / 2;
          d += " C" + a.cx + "," + my + " " + b.cx + "," + my + " " + b.cx + "," + b.cy;
          if (b.cy - a.cy > 40) arrows.push({ x: (a.cx + b.cx) / 2, y: my, ang: Math.atan2(0.75 * (b.cy - a.cy), 1.5 * (b.cx - a.cx)) * 180 / Math.PI });
        }
      }
      return { d: d, arrows: arrows };
    }

    /* ---- rendering ---- */
    var Q = null;
    function draw() {
      clearPaths();
      if (!Q) return;
      var vp = viable(Q), n = vp.length;
      var order = vp.slice(); // the picked route is drawn last, on top
      var pickId = pickedId(Q);
      order.sort(function (a, b) { return (a === pickId ? 1 : 0) - (b === pickId ? 1 : 0); });
      order.forEach(function (pid) {
        var P = PATHS[pid], main = pid === pickId, i = vp.indexOf(pid);
        var startKey = Q.subject && /^cat:/.test(Q.subject) ? [Q.subject] : [];
        var R = pathD(startKey.concat(materialise(pid, allRefs(Q))), (i - (n - 1) / 2) * 9);
        if (!R) return;
        if (main) overlay.appendChild(mk("path", { d: R.d, "class": "stk-path-halo" }));
        overlay.appendChild(mk("path", { d: R.d, "class": "stk-path" + (main ? " stk-main" : ""), stroke: P.color, "data-p": pid }));
        if (main) R.arrows.forEach(function (ar) {
          overlay.appendChild(mk("path", { d: "M-6,-4.5 L1.5,0 L-6,4.5 Z", "class": "stk-arrow", fill: P.color, "data-p": pid, transform: "translate(" + ar.x + "," + ar.y + ") rotate(" + ar.ang + ")" }));
        });
      });
      if (Q.dead && Q.subject && byKey[Q.subject]) {
        var pin = pinByLabel(/^n:/.test(Q.subject) ? "8.4" : "8.3"), src = byKey[Q.subject];
        if (pin) {
          var p2 = rel(pin), s = rel(src), my2 = (s.cy + p2.cy) / 2;
          overlay.appendChild(mk("path", { d: "M" + s.cx + "," + s.cy + " C" + s.cx + "," + my2 + " " + p2.cx + "," + my2 + " " + p2.cx + "," + (p2.y - 2), "class": "stk-path-broken" }));
        }
      }
    }
    function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
    function paint() {
      chips.forEach(function (c) { c.classList.remove("stk-line", "stk-branch", "stk-implied"); c.style.removeProperty("--pc"); });
      $$(".stk-rowlabel", fig).forEach(function (l) { l.classList.remove("stk-on"); });
      if (!Q) return;
      var vp = viable(Q), pickId = pickedId(Q), pick = PATHS[pickId];
      var lineSet = {}, branchSet = {}, impliedSet = {};
      // solid: only the route actually drawn. Everything else a click could reach is a branch,
      // so no chip can look like a step of a route the reader is not on.
      if (pick) {
        materialise(pickId, allRefs(Q)).forEach(function (k) { lineSet[k] = pick.color; });
        (pick.implies || []).forEach(function (k) { impliedSet[k] = 1; });
      }
      vp.forEach(function (pid) {
        var P = PATHS[pid], line = materialise(pid, allRefs(Q)), opt = P.options || {};
        var ok = allowedHw(pid, withCouples(allRefs(Q)));
        function offer(k) {
          if (branchSet[k]) return;
          var c = byKey[k];
          if (c && c.closest(".stk-layer").getAttribute("data-layer") === "hw" && ok.indexOf(k) === -1) return;
          branchSet[k] = P.color;
        }
        line.forEach(offer); P.line.forEach(offer);
        Object.keys(opt).forEach(function (step) { opt[step].forEach(offer); });
      });
      if (Q.subject && /^cat:/.test(Q.subject)) lineSet[Q.subject] = PATHS[pickId] ? PATHS[pickId].color : "#1f2430";
      if (Q.dead && Q.subject) lineSet[Q.subject] = "#C0392B";
      Object.keys(lineSet).forEach(function (k) { var c = byKey[k]; if (c) { c.classList.add("stk-line"); c.style.setProperty("--pc", lineSet[k]); } });
      Object.keys(branchSet).forEach(function (k) { var c = byKey[k]; if (c && !lineSet[k]) { c.classList.add("stk-branch"); c.style.setProperty("--pc", branchSet[k]); } });
      Object.keys(impliedSet).forEach(function (k) { var c = byKey[k]; if (c && !lineSet[k] && !branchSet[k]) c.classList.add("stk-implied"); });
      chips.forEach(function (c) {
        if (!c.classList.contains("stk-line") && !c.classList.contains("stk-branch") && !c.classList.contains("stk-implied")) return;
        var lbl = c.closest(".stk-row") && $(".stk-rowlabel", c.closest(".stk-row")); if (lbl) lbl.classList.add("stk-on");
      });
      pins.forEach(function (p) { p.classList.remove("stk-pin-on", "stk-pulse"); });
      var pinLbl = Q.dead && Q.subject ? (/^n:/.test(Q.subject) ? "8.4" : null) : null;
      if (Q.subject === "s:extreme" || Q.subject === "n:INT1" || Q.subject === "n:INT2" || Q.subject === "n:INT4") pinLbl = "8.3";
      if (Q.subject === "s:inttrain") pinLbl = "8.6";
      if (pinLbl) { var pn = pinByLabel(pinLbl); if (pn) { pn.classList.add("stk-pin-on"); if (Q.dead && !reduced) pn.classList.add("stk-pulse"); } }
    }
    function renderPanel() {
      if (!Q) { panel.innerHTML = ""; return; }
      var vp = viable(Q), pickId = pickedId(Q);
      var h = '<div class="stk-ph"><span class="stk-crumbs"><b>' + esc(Q.label) + "</b>";
      Q.refs.forEach(function (k) {
        if (k === Q.subject) return;
        h += '<span class="stk-crumb" data-drop="' + k + '" title="Drop this branch">' + esc(LABEL[k] || k) + " &#215;</span>";
      });
      h += "</span>";
      h += '<span class="stk-count">' + (vp.length ? vp.length + (vp.length === 1 ? " route" : " routes") + ", best first" : "no route in this stack") + "</span></div>";
      h += '<div class="stk-pbody">';
      if (Q.note) h += '<div class="stk-guide">' + Q.note + "</div>";
      if (vp.length) {
        h += '<ol class="stk-routes">' + vp.map(function (pid) {
          var P = PATHS[pid], line = materialise(pid, allRefs(Q)), main = pid === pickId;
          var steps = line.map(function (k) { return '<span class="stk-step-chip">' + esc(LABEL[k] || k) + "</span>"; }).join('<span class="stk-arr">&#8594;</span>');
          return '<li class="stk-route' + (main ? " stk-route-main" : "") + '" data-p="' + pid + '" tabindex="0" style="--pc:' + P.color + '">' +
            '<span class="stk-rhead"><i class="stk-dot"></i><b>' + esc(P.name) + "</b>" +
            '<span class="stk-fam">' + esc(famName(P.fam)) + "</span>" +
            (main ? '<span class="stk-badge">recommended</span>' : "") +
            (P.caveat ? '<span class="stk-caveat">' + esc(P.caveat) + "</span>" : "") + "</span>" +
            '<span class="stk-steps">' + steps + "</span>" +
            '<span class="stk-rstory">' + P.story + "</span></li>";
        }).join("") + "</ol>";
      }
      if (Q.reject) {
        var rk = Q.reject, imp = Q.rejectKind === "implied";
        h += '<div class="stk-reject' + (imp ? " stk-fixed" : "") + '"><b>' + esc(LABEL[rk] || rk) + "</b> " +
             (imp ? "is fixed by the recommended route rather than chosen." : "is not on any route for " + esc(Q.label) + ".") + " " +
             (G.notes[rk] || (imp ? "" : "None of the routes above offers it as a branch.")) +
             ' <span class="stk-crumb" data-drop="__reject">dismiss &#215;</span></div>';
      }
      if (Q.width) { var wn = widthNote([Q.width], "Platforms whose supported formats include this width:"); if (wn) h += '<div class="stk-note">' + wn + "</div>"; }
      if (Q.subject === "s:mixed" || Q.subject === "n:mixed" || Q.subject === "s:extreme") {
        var wn2 = widthNote(["n:INT4", "n:INT2", "n:INT1"], "Platforms whose supported formats go below 8 bits:");
        if (wn2) h += '<div class="stk-note">' + wn2 + "</div>";
      }
      h += '<div class="stk-legendnote"><span class="stk-key stk-line"></span> on the route &#183; <span class="stk-key stk-branch"></span> a branch you can take, click it &#183; <span class="stk-key stk-implied"></span> fixed by the route, not a choice</div>';
      h += "</div>";
      panel.innerHTML = h;
      $$(".stk-route", panel).forEach(function (li) {
        function pick() { Q.pick = viable(Q).indexOf(li.getAttribute("data-p")); Q.pickSet = true; render(); }
        li.addEventListener("click", pick);
        li.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      });
      $$(".stk-crumb", panel).forEach(function (el) {
        el.addEventListener("click", function () {
          var d = el.getAttribute("data-drop");
          if (d === "__reject") { Q.reject = null; Q.rejectKind = null; render(); return; }
          Q.refs = Q.refs.filter(function (k) { return k !== d; });
          Q.pick = 0; render();
        });
      });
    }
    function render() { paint(); renderPanel(); draw(); }
    function setQuery(q, fromText) {
      Q = q;
      fig.classList.toggle("stk-tracing", !!q);
      clearBtn.hidden = !q;
      $$(".stk-quick", fig).forEach(function (b) {
        var v = b.getAttribute("data-q").toLowerCase();
        b.classList.toggle("stk-active", !!q && (v === (q.label || "").toLowerCase()));
      });
      if (!q) { chips.forEach(function (c) { c.classList.remove("stk-line", "stk-branch", "stk-implied"); }); panel.innerHTML = ""; clearPaths(); if (!fromText) input.value = ""; return; }
      if (!fromText) input.value = q.label;
      render();
    }
    /* Clicking a chip never restarts the question. It takes that branch when the
       routes on screen offer it, drops it when it is already taken, and says so
       when they do not. Only Clear starts over. The exception is a question that
       has no route at all, where there is nothing to branch from. */
    function chipClicked(k) {
      if (!Q || !viable(Q).length) { setQuery(queryFor(k)); return; }
      Q.reject = null; Q.rejectKind = null;
      if (Q.refs.indexOf(k) !== -1 && k !== Q.subject) { Q.refs = Q.refs.filter(function (x) { return x !== k; }); Q.pick = 0; render(); return; }
      var vp = viable(Q);
      if (vp.some(function (pid) { var t = pathTouches(pid, k); return t === "branch" || t === "line"; })) {
        var refs = Q.refs.concat([k]);
        var base = Q.base.slice();
        vp.forEach(function (pid) {                       // a choice replaces whatever competed for its step
          var opt = PATHS[pid].options || {};
          for (var step in opt) if (opt[step].indexOf(k) !== -1) {   // k is an alternative to `step`
            refs = refs.filter(function (x) { return x === k || (opt[step].indexOf(x) === -1 && x !== step); });
            base = base.filter(function (x) { return opt[step].indexOf(x) === -1 && x !== step; });
          }
          if (opt[k]) {                                              // k is the step itself, so undo its alternatives
            refs = refs.filter(function (x) { return x === k || opt[k].indexOf(x) === -1; });
            base = base.filter(function (x) { return opt[k].indexOf(x) === -1; });
          }
        });
        Q = { subject: Q.subject, label: Q.label, pids: Q.pids, refs: refs, base: base, note: Q.note, pick: 0, pickSet: false };
        if (viable(Q).length) { render(); return; }
      }
      var pick = pickedId(Q);
      Q.reject = k;                                        // an option, but not one these routes reach
      Q.rejectKind = pick && (PATHS[pick].implies || []).indexOf(k) !== -1 ? "implied" : "absent";
      render();
    }

    /* ---- wiring ---- */
    fig.addEventListener("click", function (e) {
      var chip = e.target.closest ? e.target.closest(".mchip[data-k]") : null;
      if (chip && fig.contains(chip)) { e.preventDefault(); chipClicked(chip.getAttribute("data-k")); return; }
      var q = e.target.closest ? e.target.closest("[data-q]") : null;
      if (q && fig.contains(q)) {
        var v = q.getAttribute("data-q");
        if (q.classList.contains("stk-active")) { setQuery(null); return; }
        setQuery(/^fam:/.test(v) ? queryFor(v) : queryForText(v)); return;
      }
    });
    fig.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var el = e.target.closest ? e.target.closest(".mchip[data-k], .stk-rowlabel[data-q]") : null;
      if (el) { e.preventDefault(); el.click(); }
    });
    chips.forEach(function (c) { c.setAttribute("tabindex", "0"); c.setAttribute("role", "button"); });
    clearBtn.addEventListener("click", function () { setQuery(null); });
    function runText() { var v = input.value.trim(); if (!v) { setQuery(null, true); return; } setQuery(queryForText(v), true); }
    input.addEventListener("change", runText);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); runText(); } if (e.key === "Escape") { input.value = ""; setQuery(null); } });
    input.addEventListener("search", runText);
    var seen = {};
    function addOpt(v) { if (!v || seen[v.toLowerCase()]) return; seen[v.toLowerCase()] = 1; var o = document.createElement("option"); o.value = v; suggest.appendChild(o); }
    Object.keys(G.families).forEach(function (f) { addOpt(famName(f)); });
    chips.forEach(function (c) { addOpt(LABEL[c.getAttribute("data-k")]); });
    ["Mixed precision", "Sub-8-bit", "ESP32", "GAP", "MAX78"].forEach(addOpt);

    // hovering (or focusing) a pin lights the layers it bridges and brackets them
    function bridge(pin) {
      var set = pin ? pin.getAttribute("data-bridge").split(" ") : null;
      layers.forEach(function (L) {
        var on = !!set && set.indexOf(L.getAttribute("data-layer")) !== -1;
        L.classList.toggle("stk-bridge", on); L.classList.toggle("stk-dim", !!set && !on);
      });
      $$(".stk-bracket", overlay).forEach(function (e) { e.parentNode.removeChild(e); });
      if (!set) return;
      var rs = layers.filter(function (L) { return set.indexOf(L.getAttribute("data-layer")) !== -1; }).map(rel);
      var top = Math.min.apply(null, rs.map(function (p) { return p.y; })), bot = Math.max.apply(null, rs.map(function (p) { return p.y + p.h; }));
      var lr = rel(layersEl), x = lr.x + lr.w + 6;
      overlay.appendChild(mk("path", { d: "M" + (x - 5) + "," + top + " L" + x + "," + top + " L" + x + "," + bot + " L" + (x - 5) + "," + bot, "class": "stk-bracket" }));
    }
    pins.forEach(function (p) {
      p.addEventListener("mouseenter", function () { bridge(p); }); p.addEventListener("focus", function () { bridge(p); });
      p.addEventListener("mouseleave", function () { bridge(null); }); p.addEventListener("blur", function () { bridge(null); });
    });
    if (window.ResizeObserver) new ResizeObserver(function () { draw(); }).observe(grid);
    else window.addEventListener("resize", draw);
    window.QSStack = {
      guide: G, paths: PATHS,
      apply: function (s) { setQuery(queryForText(s)); },
      applyKey: function (k) { setQuery(queryFor(k)); },
      clickKey: function (k) { chipClicked(k); },
      state: function () { return Q && { label: Q.label, refs: Q.refs, viable: viable(Q), pick: Q.pick, dead: !!Q.dead }; }
    };
  })();
})();
