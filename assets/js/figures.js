/* =========================================================================
   figures.js — All paper figures recreated as crisp, theme-aware SVG.
   Injected into [data-fig] placeholders by app.js.
   ========================================================================= */
window.FIGURES = {

/* ---- Fig. structural overview of the survey (fig:taxonomy) ---- */
structural: `
<svg viewBox="0 0 760 470" role="img" aria-label="Structural overview of the survey">
  <defs><marker id="sov-ah" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L7,3 L0,6 Z" class="fx-fillm"/></marker></defs>
  <g text-anchor="middle">
    <!-- Preliminaries -->
    <rect class="fx-brand" x="230" y="14" width="300" height="50" rx="11"/>
    <text class="fx-tb" x="380" y="36">Preliminaries</text>
    <text class="fx-tm" x="380" y="54">Numerical formats · quantization fundamentals · §II</text>

    <!-- three technique boxes -->
    <rect class="fx-box2" x="40"  y="110" width="210" height="74" rx="11"/>
    <text class="fx-tb" x="145" y="140">Primary Quantization</text>
    <text class="fx-t"  x="145" y="160" style="font-size:14px">PTQ &amp; QAT</text>
    <text class="fx-tm" x="145" y="177">§II-B</text>

    <rect class="fx-box2" x="275" y="110" width="210" height="74" rx="11"/>
    <text class="fx-tb" x="380" y="140">Advanced Quantization</text>
    <text class="fx-t"  x="380" y="160" style="font-size:14px">six method families</text>
    <text class="fx-tm" x="380" y="177">§III</text>

    <rect class="fx-box2" x="510" y="110" width="210" height="74" rx="11"/>
    <text class="fx-tb" x="615" y="136">Alternative Numerical</text>
    <text class="fx-tb" x="615" y="154">Representations</text>
    <text class="fx-tm" x="615" y="177">§IV</text>

    <!-- hardware & software -->
    <rect class="fx-arm" x="230" y="232" width="300" height="50" rx="11"/>
    <text class="fx-tb" x="380" y="254">Hardware Landscape &amp; Software Frameworks</text>
    <text class="fx-tm" x="380" y="272">ARM · RISC-V · NPU-integrated · §V</text>

    <!-- applications -->
    <rect class="fx-npu" x="230" y="318" width="300" height="50" rx="11"/>
    <text class="fx-tb" x="380" y="340">Applications</text>
    <text class="fx-tm" x="380" y="358">Real-world MCU deployments · §VI</text>

    <!-- challenges -->
    <rect class="fx-risc" x="230" y="404" width="300" height="50" rx="11"/>
    <text class="fx-tb" x="380" y="426">Challenges &amp; Future Directions</text>
    <text class="fx-tm" x="380" y="444">§VII</text>
  </g>
  <!-- rails -->
  <path class="fx-flow" d="M380,64 L380,88 M145,88 L615,88" />
  <path class="fx-flow" marker-end="url(#sov-ah)" d="M145,88 L145,108"/>
  <path class="fx-flow" marker-end="url(#sov-ah)" d="M380,88 L380,108"/>
  <path class="fx-flow" marker-end="url(#sov-ah)" d="M615,88 L615,108"/>
  <path class="fx-flow" d="M145,184 L145,206 M615,184 L615,206 M380,184 L380,206 M145,206 L615,206"/>
  <path class="fx-flow" marker-end="url(#sov-ah)" d="M380,206 L380,230"/>
  <path class="fx-flow" marker-end="url(#sov-ah)" d="M380,282 L380,316"/>
  <path class="fx-flow" marker-end="url(#sov-ah)" d="M380,368 L380,402"/>
</svg>`,

/* ---- Fig. PTQ vs QAT (fig:4) ---- */
ptqQat: `
<svg viewBox="0 0 760 430" role="img" aria-label="PTQ versus QAT pipelines">
  <defs><marker id="pq-ah" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto">
    <path d="M0,0 L7,3 L0,6 Z" class="fx-fillm"/></marker></defs>
  <text class="fx-tb" x="190" y="22" text-anchor="middle" style="font-size:17px">Quantization-Aware Training</text>
  <text class="fx-tb" x="570" y="22" text-anchor="middle" style="font-size:17px">Post-Training Quantization</text>
  <g text-anchor="middle">
    <!-- QAT column -->
    <rect class="fx-brand" x="40" y="42" width="140" height="56" rx="10"/>
    <text class="fx-t" x="110" y="66">Initial / Pre-</text><text class="fx-t" x="110" y="84">trained Model</text>
    <rect class="fx-npu" x="200" y="42" width="140" height="56" rx="10"/>
    <text class="fx-t" x="270" y="74">Full Dataset</text>

    <rect class="fx-green" x="40" y="142" width="300" height="86" rx="10"/>
    <text class="fx-tb" x="190" y="180">Training / Finetuning</text>
    <text class="fx-tb" x="190" y="200">with Quantization</text>

    <rect class="fx-rose" x="40" y="272" width="300" height="56" rx="10"/>
    <text class="fx-tb" x="190" y="304">QAT Quantized Model</text>

    <!-- PTQ column -->
    <rect class="fx-brand" x="420" y="42" width="140" height="56" rx="10"/>
    <text class="fx-t" x="490" y="66">Pre-trained</text><text class="fx-t" x="490" y="84">Model</text>
    <rect class="fx-amber" x="580" y="42" width="140" height="56" rx="10"/>
    <text class="fx-t" x="650" y="66">Calibration</text><text class="fx-t" x="650" y="84">Dataset</text>

    <rect class="fx-green" x="420" y="142" width="300" height="46" rx="10"/>
    <text class="fx-tb" x="570" y="170">Calibration</text>
    <rect class="fx-green" x="420" y="212" width="300" height="46" rx="10"/>
    <text class="fx-tb" x="570" y="240">Quantization</text>

    <rect class="fx-rose" x="420" y="282" width="300" height="56" rx="10"/>
    <text class="fx-tb" x="570" y="314">PTQ Quantized Model</text>
  </g>
  <g class="fx-flow" fill="none">
    <path marker-end="url(#pq-ah)" d="M110,98 L110,140"/>
    <path marker-end="url(#pq-ah)" d="M270,98 L270,140"/>
    <path marker-end="url(#pq-ah)" d="M190,228 L190,270"/>
    <path marker-end="url(#pq-ah)" d="M490,98 L490,140"/>
    <path marker-end="url(#pq-ah)" d="M650,98 L650,140"/>
    <path marker-end="url(#pq-ah)" d="M570,188 L570,210"/>
    <path marker-end="url(#pq-ah)" d="M570,258 L570,280"/>
  </g>
</svg>`,

/* ---- Fig. QAT workflow with STE (fig:QAT-demo) ---- */
qatLoop: `
<svg viewBox="0 0 760 480" role="img" aria-label="QAT workflow with straight-through estimator">
  <defs>
    <marker id="ql-g" markerWidth="11" markerHeight="11" refX="7" refY="3.4" orient="auto"><path d="M0,0 L8,3.4 L0,6.8 Z" fill="#2ea36b"/></marker>
    <marker id="ql-b" markerWidth="11" markerHeight="11" refX="7" refY="3.4" orient="auto"><path d="M0,0 L8,3.4 L0,6.8 Z" class="fx-fillb"/></marker>
  </defs>
  <!-- forward/backward rails -->
  <path class="fx-flow-g" marker-end="url(#ql-g)" d="M150,60 L610,60 L610,150"/>
  <path class="fx-flow-b" marker-end="url(#ql-b)" d="M610,330 L610,420 L150,420 L150,300"/>
  <text x="380" y="48" text-anchor="middle" fill="#2ea36b" font-weight="700" font-size="15">① Forward pass</text>
  <text x="380" y="446" text-anchor="middle" class="fx-fillb" font-weight="700" font-size="15">③→④ Backward pass (STE)</text>

  <g text-anchor="middle">
    <!-- TL full precision weights -->
    <rect class="fx-amber" x="60" y="80" width="200" height="100" rx="10"/>
    <text class="fx-tb" x="160" y="108">Full-precision</text><text class="fx-tb" x="160" y="126">weights</text>
    <text class="fx-tm" x="160" y="158" style="font-style:italic">W &#8201;(FP32)</text>

    <!-- TR quantized weights -->
    <rect class="fx-brand" x="500" y="80" width="200" height="100" rx="10"/>
    <text class="fx-tb" x="600" y="108">Quantized</text><text class="fx-tb" x="600" y="126">weights</text>
    <text class="fx-tm" x="600" y="158" style="font-style:italic">Q &#8201;(INT)</text>

    <!-- center top: quantizer -->
    <text class="fx-ts" x="380" y="98" font-weight="650">Quantizer</text>
    <g transform="translate(330,108)">
      <path class="fx-flow" d="M0,40 L0,0 M0,40 L100,40" stroke-width="1.2"/>
      <path stroke="var(--brand)" stroke-width="2" fill="none" d="M6,34 H26 V26 H44 V18 H62 V10 H80 V4"/>
      <path stroke="var(--brand)" stroke-width="2" fill="none" d="M6,34 V40"/>
    </g>

    <!-- BR gradients wrt quantized -->
    <rect class="fx-amber" x="500" y="300" width="200" height="100" rx="10"/>
    <text class="fx-tb" x="600" y="328">Gradients</text><text class="fx-t" x="600" y="346" style="font-size:13px">(w.r.t. quantized W)</text>
    <text class="fx-tm" x="600" y="378" style="font-style:italic">&#8706;L/&#8706;Q &#8201;(FP32)</text>

    <!-- BL gradients wrt FP32 -->
    <rect class="fx-amber" x="60" y="300" width="200" height="100" rx="10"/>
    <text class="fx-tb" x="160" y="328">Gradients</text><text class="fx-t" x="160" y="346" style="font-size:13px">(w.r.t. FP32 W)</text>
    <text class="fx-tm" x="160" y="378" style="font-style:italic">&#8706;L/&#8706;W &#8201;(FP32)</text>

    <!-- center bottom: STE identity -->
    <text class="fx-ts" x="380" y="318" font-weight="650">STE</text>
    <g transform="translate(330,326)">
      <path class="fx-flow" d="M0,60 L0,8 M0,60 L100,60" stroke-width="1.2"/>
      <path stroke="var(--brand)" stroke-width="2" fill="none" d="M8,58 L92,14"/>
    </g>

    <!-- update node -->
    <circle class="fx-green" cx="40" cy="240" r="20"/>
    <text class="fx-tb" x="40" y="247" style="font-size:20px">+</text>
    <text class="fx-tm" x="40" y="285" style="font-size:11px">update</text>
  </g>
  <!-- internal arrows -->
  <path class="fx-flow-g" marker-end="url(#ql-g)" d="M260,130 L325,130"/>
  <path class="fx-flow-g" marker-end="url(#ql-g)" d="M435,130 L498,130"/>
  <path class="fx-flow-b" marker-end="url(#ql-b)" d="M500,350 L435,350"/>
  <path class="fx-flow-b" marker-end="url(#ql-b)" d="M325,350 L262,350"/>
  <path class="fx-flow-b" marker-end="url(#ql-b)" d="M150,300 L150,266"/>
  <path class="fx-flow-g" marker-end="url(#ql-g)" d="M60,235 L60,180 L62,180" />
  <text class="fx-fillg" x="150" y="44" text-anchor="middle" font-weight="700" font-size="14">①</text>
  <text class="fx-fillg" x="624" y="120" font-weight="700" font-size="14">②</text>
  <text class="fx-fillb" x="624" y="360" font-weight="700" font-size="14">③</text>
  <text class="fx-fillb" x="150" y="440" text-anchor="middle" font-weight="700" font-size="14">④</text>
</svg>`,

/* ---- Fig. quantization granularity (fig:granularity) ---- */
granularity: `
<svg viewBox="0 0 760 300" role="img" aria-label="Quantization granularity">
  <defs><marker id="gr-ah" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" class="fx-fillm"/></marker></defs>
  <path class="fx-dash" marker-end="url(#gr-ah)" d="M250,30 L720,30"/>
  <text class="fx-ts" x="470" y="22" text-anchor="middle" font-weight="650">More granularity &#10230;</text>

  <!-- Layer l -->
  <rect class="fx-npu" x="24" y="120" width="92" height="60" rx="12"/>
  <text class="fx-tb" x="70" y="155" text-anchor="middle">Layer &#8467;</text>
  <text class="fx-tm" x="70" y="210" text-anchor="middle">input x</text>
  <path class="fx-flow" marker-end="url(#gr-ah)" d="M70,118 L70,70"/>
  <path class="fx-flow" marker-end="url(#gr-ah)" d="M70,200 L70,182"/>

  ${(function(){ // generate three weight grids
    function grid(ox, colors){
      let s=''; const n=4, c=22;
      for(let r=0;r<n;r++)for(let q=0;q<n;q++){
        const fill = colors[r];
        s+=`<rect x="${ox+q*c}" y="${60+r*c}" width="${c}" height="${c}" fill="${fill}" stroke="var(--surface)" stroke-width="1.5"/>`;
      }
      s+=`<rect x="${ox}" y="60" width="${c*n}" height="${c*n}" fill="none" stroke="var(--border-2)" stroke-width="1.5"/>`;
      return s;
    }
    const pt='color-mix(in srgb, var(--brand) 30%, var(--surface))';
    const tensor=[pt,pt,pt,pt];
    const chan=['var(--arm)','color-mix(in srgb,var(--risc) 70%,white)','color-mix(in srgb,var(--npu) 70%,white)','color-mix(in srgb,#2ea36b 70%,white)'];
    let out = grid(170, tensor);
    out += `<text class="fx-tb" x="214" y="172" text-anchor="middle">Per-Tensor</text><text class="fx-tm" x="214" y="190" text-anchor="middle">1 scale (s, z)</text>`;
    out += grid(360, chan);
    out += `<text class="fx-tb" x="404" y="172" text-anchor="middle">Per-Channel</text><text class="fx-tm" x="404" y="190" text-anchor="middle">1 scale / channel</text>`;
    // per group: split each channel into 2 groups
    (function(){ const ox=560,c=22,n=4;
      const g=['var(--arm)','color-mix(in srgb,var(--arm) 55%,white)','color-mix(in srgb,var(--risc) 75%,white)','color-mix(in srgb,var(--risc) 45%,white)'];
      let s='';
      for(let r=0;r<n;r++)for(let q=0;q<n;q++){
        const grp = (q<2)?0:1; const fill=(r%2===0)? (grp?'color-mix(in srgb,var(--npu) 70%,white)':'var(--npu)') : (grp?'color-mix(in srgb,#2ea36b 55%,white)':'color-mix(in srgb,#2ea36b 85%,white)');
        s+=`<rect x="${ox+q*c}" y="${60+r*c}" width="${c}" height="${c}" fill="${fill}" stroke="var(--surface)" stroke-width="1.5"/>`;
      }
      s+=`<rect x="${ox}" y="60" width="${c*n}" height="${c*n}" fill="none" stroke="var(--border-2)" stroke-width="1.5"/>`;
      s+=`<line x1="${ox+c*2}" y1="60" x2="${ox+c*2}" y2="${60+c*n}" stroke="var(--text)" stroke-width="1.6"/>`;
      out+=s;
    })();
    out += `<text class="fx-tb" x="604" y="172" text-anchor="middle">Per-Group</text><text class="fx-tm" x="604" y="190" text-anchor="middle">1 scale / block</text>`;
    return out;
  })()}
</svg>`,

/* ---- Fig. mixed precision general structure (fig:mixed-precision-general) ---- */
mixedPrecision: `
<svg viewBox="0 0 760 360" role="img" aria-label="General structure of mixed-precision frameworks">
  <defs><marker id="mp-ah" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" class="fx-fillm"/></marker></defs>
  <g text-anchor="middle">
    <rect class="fx-box" x="20" y="150" width="80" height="44" rx="9"/><text class="fx-t" x="60" y="177">Input</text>
    <rect class="fx-arm" x="120" y="40" width="44" height="280" rx="9"/>
    <text class="fx-tb" x="142" y="180" transform="rotate(-90 142 180)">Preprocessed data</text>
    <rect class="fx-arm" x="600" y="40" width="44" height="280" rx="9"/>
    <text class="fx-tb" x="622" y="180" transform="rotate(-90 622 180)">Processed data</text>
    <rect class="fx-box" x="664" y="150" width="80" height="44" rx="9"/><text class="fx-t" x="704" y="177">Output</text>

    <!-- network (top) -->
    <text class="fx-ts" x="380" y="36" font-weight="650">Network</text>
    ${(function(){ const L=[210,330,470], ys=[60,92,124,156]; let s='';
      // nodes
      const cols=[['var(--brand)',4],['var(--risc)',4],['var(--muted)',4]];
      L.forEach((x,ci)=>{ ys.forEach(y=>{ s+=`<circle cx="${x}" cy="${y}" r="8" fill="${ci===2?'var(--surface)':'color-mix(in srgb,'+cols[ci][0]+' 40%, var(--surface))'}" stroke="${cols[ci][0]}" stroke-width="1.5"/>`; }); });
      // edges L0->L1
      ys.forEach(a=>ys.forEach(b=>{ s+=`<line x1="218" y1="${a}" x2="322" y2="${b}" stroke="var(--border-2)" stroke-width="0.6"/>`; }));
      s+=`<text class="fx-tm" x="400" y="112" font-style="italic">&#183;&#183;&#183;</text>`;
      return s;
    })()}
    <line x1="186" y1="108" x2="206" y2="108" class="fx-flow"/>
    <line x1="474" y1="108" x2="598" y2="108" class="fx-flow" marker-end="url(#mp-ah)"/>

    <line x1="164" y1="180" x2="380" y2="180" stroke="var(--border-2)"/>
    <!-- bit selector (bottom) -->
    <text class="fx-ts" x="380" y="206" font-weight="650">Bit selector</text>
    ${(function(){ const cols=[230,350,470]; const rows=[['2-bit',0],['3-bit',1],['b-bit',3]];
      // selection per layer: L1 picks 2-bit, L2 picks 3-bit, Ln picks b-bit
      const sel=[0,1,2];
      let s='';
      cols.forEach((x,ci)=>{
        rows.forEach((r,ri)=>{
          const y=224+ri*38;
          const chosen = sel[ci]===ri;
          const cls = chosen ? (ri===0?'fx-brand':ri===1?'fx-amber':'fx-green') : 'fx-box';
          const dash = chosen? '' : 'stroke-dasharray="3 3"';
          s+=`<rect class="${cls}" ${dash} x="${x}" y="${y}" width="76" height="30" rx="7"/>`;
          s+=`<text class="${chosen?'fx-tb':'fx-tm'}" x="${x+38}" y="${y+20}">${r[0]}</text>`;
          if(ri<rows.length-1) s+=`<text class="fx-tm" x="${x+38}" y="${y+34}" style="font-size:9px">&#8942;</text>`;
        });
        s+=`<text class="fx-tm" x="${x+38}" y="350">Layer ${ci===2?'n':ci+1}</text>`;
      });
      // arrows showing the selected path
      s+=`<path class="fx-flow" marker-end="url(#mp-ah)" d="M306,239 L348,277"/>`;
      s+=`<path class="fx-flow" marker-end="url(#mp-ah)" d="M426,277 L468,315"/>`;
      return s;
    })()}
    <line x1="142" y1="240" x2="230" y2="240" class="fx-flow" marker-end="url(#mp-ah)"/>
  </g>
</svg>`,

/* ---- Fig. weight uniformization (fig:Uniformization) ---- */
uniformization: `
<svg viewBox="0 0 760 250" role="img" aria-label="Weight uniformization">
  <defs><marker id="un-ah" markerWidth="10" markerHeight="10" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" class="fx-fillm"/></marker></defs>
  <!-- panel A : gaussian -->
  ${(function(){ const ox=40, base=180, w=14; let s=''; const heights=[6,10,9,14,20,26,38,54,74,96,118,130,118,96,74,54,38,26,20,14,9,10,6];
    heights.forEach((h,i)=>{ s+=`<rect class="fx-hist" x="${ox+i*w}" y="${base-h}" width="${w-2}" height="${h}"/>`; });
    s+=`<line x1="${ox-4}" y1="${base}" x2="${ox+heights.length*w+4}" y2="${base}" stroke="var(--text)" stroke-width="1.5"/>`;
    s+=`<text class="fx-tm" x="${ox+10}" y="${base-118}" font-style="italic">w_max</text>`;
    s+=`<text class="fx-tm" x="${ox+heights.length*w-46}" y="${base-118}" font-style="italic">w_min</text>`;
    s+=`<text class="fx-ts" x="${ox+heights.length*w/2}" y="220" text-anchor="middle" font-weight="600">(a) Original — Gaussian-like</text>`;
    return s;
  })()}
  <!-- arrow -->
  <path class="fx-flow" marker-end="url(#un-ah)" d="M386,110 L430,110"/>
  <text class="fx-tm" x="408" y="100" text-anchor="middle" style="font-size:11px">uniformize</text>
  <!-- panel B : uniform -->
  ${(function(){ const ox=450, base=180, w=12; let s=''; const n=24;
    for(let i=0;i<n;i++){ const h=104 + (i%2?2:-2); s+=`<rect class="fx-hist2" x="${ox+i*w}" y="${base-h}" width="${w-2}" height="${h}"/>`; }
    s+=`<line x1="${ox-4}" y1="${base}" x2="${ox+n*w+4}" y2="${base}" stroke="var(--text)" stroke-width="1.5"/>`;
    s+=`<text class="fx-tm" x="${ox}" y="${base-110}" >&#8722;128</text>`;
    s+=`<text class="fx-tm" x="${ox+n*w-26}" y="${base-110}">127</text>`;
    s+=`<text class="fx-ts" x="${ox+n*w/2}" y="220" text-anchor="middle" font-weight="600">(b) After uniformization — INT8</text>`;
    return s;
  })()}
</svg>`,

/* ---- Fig. calibrated vs data-free PTQ (fig:Data-Free) ---- */
dataFree: `
<svg viewBox="0 0 760 430" role="img" aria-label="Calibrated PTQ versus data-free PTQ">
  <defs><marker id="df-ah" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" class="fx-fillm"/></marker></defs>
  <text class="fx-tb" x="190" y="22" text-anchor="middle" style="font-size:16px">(a) Calibrated PTQ</text>
  <text class="fx-tb" x="570" y="22" text-anchor="middle" style="font-size:16px">(b) Data-Free PTQ</text>
  <g text-anchor="middle">
    <!-- left -->
    <rect class="fx-amber" x="40" y="40" width="140" height="54" rx="10"/><text class="fx-tb" x="110" y="63">Pre-Trained</text><text class="fx-t" x="110" y="81" style="font-size:13px">Model</text>
    <rect class="fx-npu" x="200" y="40" width="140" height="54" rx="10"/><text class="fx-tb" x="270" y="63">Calibration</text><text class="fx-t" x="270" y="81" style="font-size:13px">Data</text>
    <rect class="fx-npu" x="40" y="128" width="300" height="42" rx="10"/><text class="fx-tb" x="190" y="154">Calibration</text>
    <rect class="fx-green" x="40" y="196" width="300" height="48" rx="10"/><text class="fx-tb" x="190" y="225">Quantization</text>
    <rect class="fx-arm" x="40" y="276" width="58" height="40" rx="8"/><text class="fx-t" x="69" y="301" style="font-size:13px">INT-8</text>
    <rect class="fx-arm" x="112" y="276" width="58" height="40" rx="8"/><text class="fx-t" x="141" y="301" style="font-size:13px">INT-4</text>
    <text class="fx-tm" x="218" y="301">&#183;&#183;&#183;</text>
    <rect class="fx-arm" x="282" y="276" width="58" height="40" rx="8"/><text class="fx-t" x="311" y="301" style="font-size:13px">INT-b</text>
    <rect class="fx-box3" x="40" y="350" width="300" height="46" rx="10"/><text class="fx-tb" x="190" y="378">Deployable PTQ Model</text>

    <!-- right -->
    <rect class="fx-amber" x="420" y="40" width="140" height="54" rx="10"/><text class="fx-tb" x="490" y="63">Pre-Trained</text><text class="fx-t" x="490" y="81" style="font-size:13px">Model</text>
    <rect class="fx-box" x="580" y="40" width="140" height="54" rx="10" stroke-dasharray="5 4"/><text class="fx-tm" x="650" y="63">Calibration</text><text class="fx-tm" x="650" y="81" style="font-size:13px">Data</text>
    <rect class="fx-box" x="420" y="128" width="300" height="42" rx="10" stroke-dasharray="5 4"/><text class="fx-tm" x="570" y="154">Calibration</text>
    <rect class="fx-green" x="420" y="190" width="300" height="60" rx="10"/>
    <text class="fx-tb" x="478" y="224">Quantization</text>
    <rect class="fx-brand" x="540" y="200" width="80" height="40" rx="7"/><text class="fx-t" x="580" y="218" style="font-size:11px">Network</text><text class="fx-t" x="580" y="232" style="font-size:11px">Statistics</text>
    <rect class="fx-green" x="628" y="200" width="84" height="40" rx="7"/><text class="fx-t" x="670" y="218" style="font-size:11px">Error / Bias</text><text class="fx-t" x="670" y="232" style="font-size:11px">Correction</text>
    <rect class="fx-arm" x="420" y="276" width="58" height="40" rx="8"/><text class="fx-t" x="449" y="301" style="font-size:13px">INT-8</text>
    <rect class="fx-arm" x="492" y="276" width="58" height="40" rx="8"/><text class="fx-t" x="521" y="301" style="font-size:13px">INT-4</text>
    <text class="fx-tm" x="598" y="301">&#183;&#183;&#183;</text>
    <rect class="fx-arm" x="662" y="276" width="58" height="40" rx="8"/><text class="fx-t" x="691" y="301" style="font-size:13px">INT-b</text>
    <rect class="fx-box3" x="420" y="350" width="300" height="46" rx="10"/><text class="fx-tb" x="570" y="378">Deployable PTQ Model</text>
  </g>
  <g class="fx-flow" fill="none">
    <path marker-end="url(#df-ah)" d="M110,94 L110,116 L190,116 L190,126"/>
    <path marker-end="url(#df-ah)" d="M270,94 L270,116 L190,116" stroke-dasharray="0"/>
    <path marker-end="url(#df-ah)" d="M190,170 L190,194"/>
    <path marker-end="url(#df-ah)" d="M190,244 L190,274"/>
    <path d="M69,316 L69,334 L311,334 L311,316" marker-start="url(#df-ah)"/>
    <path marker-end="url(#df-ah)" d="M190,334 L190,348"/>
    <path marker-end="url(#df-ah)" d="M490,94 L490,180 L490,188"/>
    <path marker-end="url(#df-ah)" d="M490,250 L490,274"/>
    <path d="M449,316 L449,334 L691,334 L691,316" marker-start="url(#df-ah)"/>
    <path marker-end="url(#df-ah)" d="M570,334 L570,348"/>
  </g>
</svg>`,

/* ---- Fig. deployment cycle (fig:deployment_cycle) ---- */
deploymentCycle: `
<svg viewBox="0 0 900 250" role="img" aria-label="Quantized model deployment pipeline">
  <defs><marker id="dc-ah" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" class="fx-fillm"/></marker></defs>
  <g text-anchor="middle">
    <text class="fx-tb" x="56" y="160">Training</text>
    <circle class="fx-box2" cx="56" cy="118" r="22"/><text x="56" y="125" text-anchor="middle" font-size="18">&#9881;</text>

    <rect class="fx-brand" x="150" y="92" width="190" height="56" rx="11"/><text class="fx-tb" x="245" y="125">Model Optimization</text>
    <rect class="fx-green" x="150" y="22" width="92" height="40" rx="9"/><text class="fx-t" x="196" y="46" style="font-size:13px">Design</text>
    <rect class="fx-green" x="252" y="22" width="92" height="40" rx="9"/><text class="fx-t" x="298" y="46" style="font-size:13px">Compression</text>

    <!-- quantized model cylinder -->
    <g>
      <rect class="fx-amber" x="400" y="98" width="92" height="44"/>
      <ellipse class="fx-amber" cx="446" cy="98" rx="46" ry="11"/>
      <ellipse class="fx-amber" cx="446" cy="142" rx="46" ry="11"/>
      <text class="fx-tb" x="446" y="118" style="font-size:12px">Quantized</text>
      <text class="fx-tb" x="446" y="134" style="font-size:12px">Model</text>
    </g>

    <rect class="fx-brand" x="552" y="92" width="196" height="56" rx="11"/><text class="fx-tb" x="650" y="125">System Optimization</text>
    <rect class="fx-green" x="552" y="22" width="92" height="40" rx="9"/><text class="fx-t" x="598" y="40" style="font-size:11px">Software</text><text class="fx-t" x="598" y="54" style="font-size:11px">Optimization</text>
    <rect class="fx-green" x="656" y="22" width="92" height="40" rx="9"/><text class="fx-t" x="702" y="40" style="font-size:11px">Hardware</text><text class="fx-t" x="702" y="54" style="font-size:11px">Optimization</text>

    <rect class="fx-box2" x="820" y="96" width="48" height="48" rx="10"/><text x="844" y="128" text-anchor="middle" font-size="20">&#128230;</text>
    <text class="fx-tb" x="844" y="166">Deployment</text>
  </g>
  <g class="fx-flow" fill="none">
    <path marker-end="url(#dc-ah)" d="M80,118 L148,118"/>
    <path marker-end="url(#dc-ah)" d="M340,118 L398,118"/>
    <path marker-end="url(#dc-ah)" d="M492,118 L550,118"/>
    <path marker-end="url(#dc-ah)" d="M748,118 L818,118"/>
    <path d="M245,92 L245,72 M196,62 L196,72 L298,72 L298,62" marker-end="url(#dc-ah)"/>
    <path marker-end="url(#dc-ah)" d="M245,72 L245,72"/>
    <path d="M446,98 L446,80 L245,80 L245,72" />
    <path d="M650,92 L650,72 M598,62 L598,72 L702,72 L702,62" marker-end="url(#dc-ah)"/>
  </g>
</svg>`

};
