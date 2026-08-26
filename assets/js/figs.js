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
    // keyed on the text, not the element: Figure 2 reuses one cube group and
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
  document.addEventListener("mousemove", function (e) {
    showTip(tipTarget(e), e.clientX, e.clientY);
  }, { passive: true });
  // tap equivalent, so a hover-only hint is still reachable on a touch screen
  document.addEventListener("click", function (e) {
    var el = tipTarget(e);
    if (el) { tipTxt = null; showTip(el, e.clientX, e.clientY); }
  });

  /* ---------- Figure 2: granularity hints ----------
     Per-tensor, per-channel and per-group behave identically: the hovered cube
     receives [data-tip], so the shared tooltip above shows and positions the
     hint the same way for every granularity, on hover and on tap. */
  (function () {
    var svg = $("#figure-2 svg");
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
  })();

  /* ---------- Figure 4: traveling marker + forward/backward isolation ---------- */
  (function () {
    var svg = $("#figure-4 svg");
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
      if (locked && !(e.target.closest && e.target.closest("#figure-4"))) { locked = null; isolate(null); }
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

  /* ---------- Figure 6: clickable bit selector ---------- */
  (function () {
    var svg = $("#figure-6 svg");
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

  /* ---------- Figure 8: continuously looping step-through (gif-style) ---------- */
  (function () {
    var fig = $("#figure-8");
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
    fetch("assets/bibliography/references.bib").then(function (r) { return r.text(); }).then(function (bib) {
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
          st.sheet.insertRule("ol{list-style:none;counter-reset:refnum;padding-left:2.6em}", 0);
          st.sheet.insertRule("ol>li{counter-increment:refnum;position:relative}", 0);
          st.sheet.insertRule("ol>li::before{content:\"[\" counter(refnum) \"]\";position:absolute;left:-2.6em;color:#2698BA;font-weight:700}", 0);
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
