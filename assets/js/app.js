/* =========================================================================
   app.js — interactivity for the interactive quantization survey
   ========================================================================= */
(function(){
"use strict";
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const D = window.DATA, REFS = window.REFS, CM = window.CITEMAP, FIG = window.FIGURES;
const refByKey = {}; (REFS||[]).forEach(r=>refByKey[r.key]=r);
const esc = s => (s==null?'':String(s)).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ----------  Theme  ---------- */
const root = document.documentElement;
function setTheme(t){ root.setAttribute('data-theme',t); try{localStorage.setItem('qz-theme',t);}catch(e){}
  const ic=$('#themeIcon'); if(ic) ic.innerHTML = t==='dark'
    ? '<path d="M12 3v2M12 19v2M5 12H3M21 12h-2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="4" fill="currentColor"/>'
    : '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" fill="currentColor"/>';
}
(function initTheme(){ let t; try{t=localStorage.getItem('qz-theme');}catch(e){}
  if(!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'; setTheme(t); })();

/* ----------  Citations  ---------- */
function renderCite(keysAttr){
  const keys = keysAttr.split(',').map(s=>s.trim()).filter(Boolean);
  const items = keys.map(k=>({k, n: CM[k]})).filter(o=>o.n!=null).sort((a,b)=>a.n-b.n);
  if(!items.length) return '<span class="cite">[?]</span>';
  // collapse runs of >=3 consecutive numbers into ranges
  const toks=[]; let i=0;
  while(i<items.length){ let j=i; while(j+1<items.length && items[j+1].n===items[j].n+1) j++;
    if(j-i>=2){ toks.push({range:true, a:items[i], b:items[j]}); }
    else { for(let p=i;p<=j;p++) toks.push({range:false, a:items[p]}); }
    i=j+1;
  }
  const link=o=>`<a class="cite" data-num="${o.n}" data-key="${esc(o.k)}" href="#ref-${esc(o.k)}">${o.n}</a>`;
  const inner = toks.map(t=> t.range ? (link(t.a)+'&#8211;'+link(t.b)) : link(t.a)).join(', ');
  return '<span class="cite-grp">['+inner+']</span>';
}
function wireCites(scope){
  $$('cite[k], .cite-src',scope).forEach(el=>{
    const keys = el.getAttribute('k') || el.getAttribute('data-k') || '';
    const span = document.createElement('span'); span.innerHTML = renderCite(keys);
    el.replaceWith(span.firstChild);
  });
}
// hover popover
let pop;
function ensurePop(){ if(!pop){ pop=document.createElement('div'); pop.className='cite-pop'; document.body.appendChild(pop);} return pop; }
function showPop(a){
  const n=a.getAttribute('data-num'), key=a.getAttribute('data-key'); const r=refByKey[key]; if(!r) return;
  const p=ensurePop();
  p.innerHTML = `<span class="cp-num">[${n}]</span> ${r.html}` + (r.arxiv?` <a href="https://arxiv.org/abs/${r.arxiv}" target="_blank" rel="noopener">arXiv</a>`:'') + (r.doi?` <a href="https://doi.org/${r.doi}" target="_blank" rel="noopener">DOI</a>`:'');
  const rect=a.getBoundingClientRect(); p.classList.add('show');
  const pw=Math.min(340, innerWidth-24); p.style.maxWidth=pw+'px';
  let left=rect.left; if(left+pw>innerWidth-12) left=innerWidth-pw-12; if(left<12) left=12;
  let top=rect.bottom+8; p.style.left=left+'px';
  if(top+p.offsetHeight>innerHeight-12) top=rect.top-p.offsetHeight-8;
  p.style.top=top+'px';
}
function hidePop(){ if(pop) pop.classList.remove('show'); }
document.addEventListener('mouseover',e=>{ const a=e.target.closest('a.cite'); if(a) showPop(a); });
document.addEventListener('mouseout',e=>{ if(e.target.closest('a.cite')) hidePop(); });
document.addEventListener('click',e=>{ const a=e.target.closest('a.cite'); if(a){ e.preventDefault();
  const key=a.getAttribute('data-key'); const el=$('#ref-'+CSS.escape(key));
  if(el){ el.scrollIntoView({behavior:'smooth',block:'center'}); $$('.ref-item.flash').forEach(x=>x.classList.remove('flash'));
    el.classList.add('flash'); setTimeout(()=>el.classList.remove('flash'),2200); }
  hidePop(); } });

/* ----------  Figures  ---------- */
function injectFigures(){ $$('[data-fig]').forEach(el=>{ const f=FIG[el.getAttribute('data-fig')]; if(f) el.innerHTML=f; }); }

/* ----------  Survey scope table  ---------- */
function tick(v){ if(v==='yes') return '<span class="tick">&#10003;</span>'; if(v==='partial') return '<span class="tick partial">&#10003;</span>'; return ''; }
function hwMarks(arr){ if(!arr||!arr.length) return ''; const m={arm:'A',risc:'R',hybrid:'H'},c={arm:'a',risc:'r',hybrid:'h'};
  return '<span class="hwmark">'+arr.map(x=>`<b class="${c[x]}">${m[x]}</b>`).join('')+'</span>'; }
function buildScope(){
  const host=$('#tbl-scope'); if(!host) return; const d=D.surveyScope;
  let h='<div class="tscroll"><table class="data scope"><thead><tr>'+
    '<th>Survey</th><th class="sortable" data-k="year">Year <span class="arrow">&#9650;</span></th>'+
    d.columns.map(c=>`<th>${esc(c)}</th>`).join('')+'</tr></thead><tbody>';
  d.rows.forEach(r=>{
    h+=`<tr class="${r.ours?'ours':''}"><td>${r.ours?'<strong>Ours</strong>':esc(r.paper)} ${r.key?renderCite(r.key):''}</td>`+
       `<td class="num">${r.year}</td>`+
       `<td class="cell">${tick(r.primary)}</td><td class="cell">${tick(r.advanced)}</td><td class="cell">${tick(r.numeric)}</td>`+
       `<td class="cell">${hwMarks(r.hw)}</td><td class="cell">${tick(r.software)}</td><td class="cell">${tick(r.apps)}</td></tr>`;
  });
  h+='</tbody></table></div>'+
    '<div class="legend"><span><span class="tick">&#10003;</span> surveyed</span>'+
    '<span><span class="tick partial">&#10003;</span> partially surveyed</span>'+
    '<span><b class="hwmark"><b class="a">A</b></b> ARM</span><span><b class="hwmark"><b class="r">R</b></b> RISC</span>'+
    '<span><b class="hwmark"><b class="h">H</b></b> hybrid</span></div>';
  host.innerHTML=h; wireCites(host);
}

/* ----------  Generic sortable table  ---------- */
function attachSort(table){
  $$('th.sortable',table).forEach(th=>{
    th.addEventListener('click',()=>{
      const k=th.getAttribute('data-k'); const cur=th.getAttribute('data-dir');
      const dir = cur==='asc'?'desc':'asc';
      $$('th.sortable',table).forEach(o=>{o.removeAttribute('data-dir'); const a=o.querySelector('.arrow'); if(a)a.innerHTML='&#8645;';});
      th.setAttribute('data-dir',dir); th.querySelector('.arrow').innerHTML = dir==='asc'?'&#9650;':'&#9660;';
      const tb=table.tBodies[0]; const rows=Array.from(tb.rows);
      rows.sort((a,b)=>{ let x=a.dataset[k]||'', y=b.dataset[k]||'';
        const nx=parseFloat(x), ny=parseFloat(y);
        if(!isNaN(nx)&&!isNaN(ny)){ x=nx; y=ny; } else { x=x.toLowerCase(); y=y.toLowerCase(); }
        return (x<y?-1:x>y?1:0)*(dir==='asc'?1:-1); });
      rows.forEach(r=>tb.appendChild(r));
    });
  });
}

/* ----------  Hardware platforms table  ---------- */
const FAMCLASS={'ARM-based':'arm','RISC-V-based':'risc','NPU-integrated':'npu','ARM-Based':'arm','RISC-V-Based':'risc'};
function famTag(fam){ const c=FAMCLASS[fam]||'arm'; return `<span class="fam-tag fam-${c}">${esc(fam)}</span>`; }
function buildHardware(){
  const host=$('#tbl-hardware'); if(!host) return;
  host.innerHTML =
   `<div class="table-toolbar">
      <div class="chips" id="hw-chips">
        <span class="chip active" data-f="all">All platforms</span>
        <span class="chip arm" data-f="ARM-based"><span class="dot" style="background:var(--arm)"></span>ARM</span>
        <span class="chip risc" data-f="RISC-V-based"><span class="dot" style="background:var(--risc)"></span>RISC-V</span>
        <span class="chip npu" data-f="NPU-integrated"><span class="dot" style="background:var(--npu)"></span>NPU-integrated</span>
      </div>
      <div class="search"><svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m20 20-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><input id="hw-search" placeholder="Search platforms, CPUs, formats…"></div>
      <span class="tcount" id="hw-count"></span>
    </div>
    <div class="tscroll"><table class="data" id="hw-table"><thead><tr>
      <th class="sortable" data-k="family">Family <span class="arrow">&#8645;</span></th>
      <th class="sortable" data-k="platform">Platform <span class="arrow">&#8645;</span></th>
      <th>CPU(s)</th><th>Accelerator</th>
      <th class="sortable" data-k="clock">Clock <span class="arrow">&#8645;</span></th>
      <th>Flash</th><th>RAM</th><th>Supported formats</th>
    </tr></thead><tbody></tbody></table></div>`;
  const tbody=$('#hw-table tbody');
  function clockNum(s){ const m=String(s).match(/[\d.]+/); return m?parseFloat(m[0]):0; }
  function row(r){ return `<tr data-family="${esc(r.family)}" data-platform="${esc(r.platform)}" data-clock="${clockNum(r.clock)}" data-blob="${esc((r.platform+' '+r.cpu+' '+r.accel+' '+r.formats.join(' ')+' '+r.family).toLowerCase())}">
      <td>${famTag(r.family)}</td><td><strong>${esc(r.platform)}</strong></td><td>${esc(r.cpu)}</td><td>${esc(r.accel)}</td>
      <td class="num">${esc(r.clock)}</td><td class="num">${esc(r.flash)}</td><td>${esc(r.ram)}</td>
      <td>${r.formats.map(f=>`<span class="qbadge">${esc(f)}</span>`).join(' ')}</td></tr>`; }
  tbody.innerHTML = D.hardware.map(row).join('');
  attachSort($('#hw-table'));
  let fam='all', q='';
  function apply(){ let n=0; $$('#hw-table tbody tr').forEach(tr=>{
      const okF = fam==='all'||tr.dataset.family===fam;
      const okQ = !q||tr.dataset.blob.includes(q);
      const show=okF&&okQ; tr.style.display=show?'':'none'; if(show)n++; });
    $('#hw-count').textContent = n+' / '+D.hardware.length+' platforms'; }
  $('#hw-chips').addEventListener('click',e=>{ const c=e.target.closest('.chip'); if(!c)return;
    $$('#hw-chips .chip').forEach(x=>x.classList.remove('active')); c.classList.add('active'); fam=c.dataset.f; apply(); });
  $('#hw-search').addEventListener('input',e=>{ q=e.target.value.trim().toLowerCase(); apply(); });
  apply();
}

/* ----------  Deployment-stack cards  ---------- */
function buildStack(){
  const host=$('#tbl-stack'); if(!host) return;
  host.innerHTML = '<div class="stack-grid">'+ D.deploymentStack.map(s=>{
    const c=FAMCLASS[s.family]||'arm';
    return `<div class="stack-card ${c}"><div class="sc-head">${esc(s.family)}</div><div class="sc-body">
      <div class="sc-cell"><div class="lbl">Hardware execution path</div>${esc(s.hwPath)}</div>
      <div class="sc-cell"><div class="lbl">Software mapping path</div>${esc(s.swPath)}</div>
      <div class="sc-cell"><div class="lbl">Application-level implication</div>${esc(s.impl)}</div>
    </div></div>`; }).join('')+'</div>';
}

/* ----------  Application tables (per family, sortable + search)  ---------- */
function appTable(id, rows, famClass){
  const host=$('#'+id); if(!host) return;
  host.innerHTML =
   `<div class="table-toolbar">
      <div class="search"><svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="m20 20-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><input placeholder="Search this table…"></div>
      <span class="tcount"></span>
    </div>
    <div class="tscroll"><table class="data"><thead><tr>
      <th>Study</th>
      <th class="sortable" data-k="cat">Category <span class="arrow">&#8645;</span></th>
      <th>Quantization</th><th>Device(s)</th><th>Framework(s)</th><th>Performance</th>
      <th>Power / Energy</th>
      <th class="sortable" data-k="lat">Latency (ms) <span class="arrow">&#8645;</span></th>
      <th class="sortable" data-k="mem">Memory (KB) <span class="arrow">&#8645;</span></th>
    </tr></thead><tbody></tbody></table></div>`;
  const tbody=host.querySelector('tbody');
  tbody.innerHTML = rows.map(r=>{
    const ref=refByKey[r.key]; const study = ref?renderCite(r.key):esc(r.key);
    const blob=(r.cat+' '+r.quant+' '+r.devices+' '+r.fw+' '+r.perf).toLowerCase();
    return `<tr data-cat="${esc(r.cat)}" data-lat="${r.lat_n==null?'':r.lat_n}" data-mem="${r.mem_n==null?'':r.mem_n}" data-blob="${esc(blob)}">
      <td>${study}</td><td>${esc(r.cat)}</td><td><span class="qbadge">${esc(r.quant)}</span></td>
      <td>${esc(r.devices)}</td><td>${esc(r.fw)}</td><td>${esc(r.perf)}</td>
      <td class="num">${esc(r.power)}</td><td class="num">${esc(r.lat)}</td><td class="num">${esc(r.mem)}</td></tr>`;
  }).join('');
  wireCites(tbody); attachSort(host.querySelector('table'));
  const inp=host.querySelector('input'), cnt=host.querySelector('.tcount');
  function apply(){ const q=inp.value.trim().toLowerCase(); let n=0;
    $$('tbody tr',host).forEach(tr=>{ const s=!q||tr.dataset.blob.includes(q); tr.style.display=s?'':'none'; if(s)n++; });
    cnt.textContent=n+' / '+rows.length+' studies'; }
  inp.addEventListener('input',apply); apply();
}

/* ----------  Taxonomy explorer  ---------- */
function buildTaxonomy(){
  const host=$('#tax'); if(!host) return;
  function methods(ms){ return '<div class="methods">'+ms.map(m=>`<span class="method"><span class="mn">${esc(m.n)}</span> ${renderCite(m.k.join(','))}</span>`).join('')+'</div>'; }
  function sub(s){ let h=`<div class="tax-sub"><div class="st">${s.sec?`<span class="sx">§${s.sec}</span>`:''}${esc(s.name)}</div>`;
    if(s.methods) h+=methods(s.methods);
    if(s.children) h+=s.children.map(sub).join('');
    return h+'</div>'; }
  host.innerHTML = D.taxonomy.map((g,i)=>{
    let body=''; if(g.methods) body+=methods(g.methods); if(g.children) body+=g.children.map(sub).join('');
    return `<div class="tax-group ${i===0?'open':''}"><div class="tax-g-head"><span class="sx">§${g.sec}</span>${esc(g.name)}
      <svg class="caret" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="tax-g-body">${body}</div></div>`;
  }).join('');
  wireCites(host);
  $$('.tax-g-head',host).forEach(h=>h.addEventListener('click',()=>h.parentElement.classList.toggle('open')));
}

/* ----------  Deployment scatter visualization  ---------- */
function buildScatter(){
  const host=$('#scatter'); if(!host) return;
  const all=[];
  D.apps.arm.forEach(r=>all.push(Object.assign({fam:'arm'},r)));
  D.apps.riscv.forEach(r=>all.push(Object.assign({fam:'risc'},r)));
  D.apps.npu.forEach(r=>all.push(Object.assign({fam:'npu'},r)));
  const AX={ mem:{label:'Model size / memory (KB)',f:r=>r.mem_n,log:true},
            lat:{label:'Latency (ms)',f:r=>r.lat_n,log:true},
            perf:{label:'Task performance (%)',f:r=>r.perf_n,log:false} };
  const famColor={arm:'var(--arm)',risc:'var(--risc)',npu:'var(--npu)'};
  let xKey='mem', yKey='lat', filt='all';
  let tip;
  function ensureTip(){ if(!tip){tip=document.createElement('div');tip.className='viz-tip';document.body.appendChild(tip);} return tip; }
  function draw(){
    const W=760,H=440,m={l:64,r:24,t:18,b:54}, iw=W-m.l-m.r, ih=H-m.t-m.b;
    const ax=AX[xKey], ay=AX[yKey];
    const pts=all.filter(r=> (filt==='all'||r.fam===filt) && ax.f(r)!=null && ay.f(r)!=null && ax.f(r)>0 && ay.f(r)>0);
    function scale(spec, vals){ let mn=Math.min(...vals), mx=Math.max(...vals);
      if(spec.log){ mn=Math.log10(mn); mx=Math.log10(mx); } if(mn===mx){mn-=1;mx+=1;}
      const pad=(mx-mn)*0.08; mn-=pad; mx+=pad;
      return v=>{ let t=spec.log?Math.log10(v):v; return (t-mn)/(mx-mn); };
    }
    const sx=scale(ax,pts.map(ax.f)), sy=scale(ay,pts.map(ay.f));
    function px(v){ return m.l + sx(v)*iw; } function py(v){ return m.t + (1-sy(v))*ih; }
    let g=`<svg viewBox="0 0 ${W} ${H}" width="100%">`;
    // grid + ticks
    for(let i=0;i<=4;i++){ const gy=m.t+ih*i/4; g+=`<line class="viz-grid" x1="${m.l}" y1="${gy}" x2="${W-m.r}" y2="${gy}"/>`;
      const gx=m.l+iw*i/4; g+=`<line class="viz-grid" x1="${gx}" y1="${m.t}" x2="${gx}" y2="${m.t+ih}"/>`; }
    g+=`<line class="viz-axis" x1="${m.l}" y1="${m.t+ih}" x2="${W-m.r}" y2="${m.t+ih}"/>`;
    g+=`<line class="viz-axis" x1="${m.l}" y1="${m.t}" x2="${m.l}" y2="${m.t+ih}"/>`;
    // axis labels
    g+=`<text class="viz-axis-lbl" x="${m.l+iw/2}" y="${H-12}" text-anchor="middle">${ax.label}${ax.log?'  (log)':''}</text>`;
    g+=`<text class="viz-axis-lbl" transform="translate(16,${m.t+ih/2}) rotate(-90)" text-anchor="middle">${ay.label}${ay.log?'  (log)':''}</text>`;
    // points
    pts.forEach((r,i)=>{ const cx=px(ax.f(r)), cy=py(ay.f(r));
      g+=`<circle class="dot-pt" cx="${cx}" cy="${cy}" r="7" fill="${famColor[r.fam]}" fill-opacity="0.72" stroke="${famColor[r.fam]}" stroke-width="1.5" data-i="${i}"/>`; });
    g+='</svg>';
    host.innerHTML=g; host._pts=pts;
  }
  // controls
  $('#viz-x').addEventListener('change',e=>{xKey=e.target.value;draw();});
  $('#viz-y').addEventListener('change',e=>{yKey=e.target.value;draw();});
  $('#viz-chips').addEventListener('click',e=>{ const c=e.target.closest('.chip'); if(!c)return;
    $$('#viz-chips .chip').forEach(x=>x.classList.remove('active')); c.classList.add('active'); filt=c.dataset.f; draw(); });
  host.addEventListener('mousemove',e=>{ const c=e.target.closest('.dot-pt'); const t=ensureTip();
    if(c){ const r=host._pts[+c.getAttribute('data-i')]; const ref=refByKey[r.key];
      const fam={arm:'ARM',risc:'RISC-V',npu:'NPU'}[r.fam];
      t.innerHTML=`<b>${ref?esc(ref.authors.split(' ').slice(-1)[0]):esc(r.key)}</b> · ${esc(r.cat)} <span style="opacity:.7">(${fam})</span><br>${esc(r.devices)}<br>${esc(r.quant)} · ${esc(r.perf)}<br>Lat ${esc(r.lat)} ms · Mem ${esc(r.mem)} KB`;
      t.style.left=Math.min(e.clientX+14, innerWidth-260)+'px'; t.style.top=(e.clientY+14)+'px'; t.style.opacity='1';
    } else t.style.opacity='0'; });
  host.addEventListener('mouseleave',()=>{ if(tip)tip.style.opacity='0'; });
  host.addEventListener('click',e=>{ const c=e.target.closest('.dot-pt'); if(!c)return;
    const r=host._pts[+c.getAttribute('data-i')]; const el=$('#ref-'+CSS.escape(r.key));
    if(el){ el.scrollIntoView({behavior:'smooth',block:'center'}); el.classList.add('flash'); setTimeout(()=>el.classList.remove('flash'),2200);} });
  draw();
}

/* ----------  References  ---------- */
function buildRefs(){
  const host=$('#ref-list'); if(!host) return;
  host.innerHTML = REFS.map(r=>{
    const links=[]; if(r.arxiv) links.push(`<a href="https://arxiv.org/abs/${r.arxiv}" target="_blank" rel="noopener">arXiv</a>`);
    if(r.doi) links.push(`<a href="https://doi.org/${esc(r.doi)}" target="_blank" rel="noopener">DOI</a>`);
    else if(r.url) links.push(`<a href="${esc(r.url)}" target="_blank" rel="noopener">Link</a>`);
    return `<div class="ref-item" id="ref-${esc(r.key)}" data-blob="${esc((r.authors+' '+r.title+' '+r.year).toLowerCase())}">
      <div class="rnum">[${r.num}]</div><div class="rbody">${r.html}${links.length?`<div class="ref-links">${links.join('')}</div>`:''}</div></div>`;
  }).join('');
  const inp=$('#ref-search'), cnt=$('#ref-count');
  function apply(){ const q=(inp.value||'').trim().toLowerCase(); let n=0;
    $$('.ref-item',host).forEach(it=>{ const s=!q||it.dataset.blob.includes(q); it.style.display=s?'':'none'; if(s)n++; });
    if(cnt) cnt.textContent=n+' / '+REFS.length+' references'; }
  if(inp) inp.addEventListener('input',apply); apply();
}

/* ----------  BibTeX copy  ---------- */
function wireBibtex(){ $$('.bibtex .copy').forEach(btn=>btn.addEventListener('click',()=>{
  const code=btn.parentElement.querySelector('code')||btn.parentElement;
  const txt=btn.getAttribute('data-raw')||code.innerText.replace('Copy','').trim();
  navigator.clipboard.writeText(txt).then(()=>{ const o=btn.textContent; btn.textContent='Copied ✓'; setTimeout(()=>btn.textContent=o,1500); });
})); }

/* ----------  Scroll-spy, progress, nav  ---------- */
function wireScroll(){
  const prog=$('#progress');
  const links=$$('.toc nav a'); const map={};
  links.forEach(a=>{ const id=a.getAttribute('href').slice(1); map[id]=a; });
  const ids=Object.keys(map);
  function onScroll(){
    const st=scrollY, h=document.documentElement.scrollHeight-innerHeight;
    if(prog) prog.style.width=(h>0?(st/h*100):0)+'%';
    $('#toTop').classList.toggle('show', st>700);
    let cur=ids[0], best=-Infinity; const line=scrollY+ (innerHeight*0.28);
    ids.forEach(id=>{ const el=document.getElementById(id); if(!el)return; const top=el.getBoundingClientRect().top+scrollY;
      if(top<=line && top>best){ best=top; cur=id; } });
    links.forEach(a=>a.classList.remove('active'));
    if(map[cur]){ map[cur].classList.add('active');
      // also activate parent section link
    }
  }
  document.addEventListener('scroll',onScroll,{passive:true}); onScroll();
}
function wireNav(){
  const tgl=$('#menuToggle');
  if(tgl) tgl.addEventListener('click',()=>document.body.classList.toggle('nav-open'));
  $$('.toc nav a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('nav-open')));
  const scrim=$('.navscrim'); if(scrim) scrim.addEventListener('click',()=>document.body.classList.remove('nav-open'));
  $('#toTop').addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
  $('#themeToggle').addEventListener('click',()=>setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark'));
}

/* ----------  Command palette  ---------- */
function buildPalette(){
  const bg=$('#palette-bg'), pal=$('#palette'), inp=$('#palette-input'), res=$('#palette-res');
  if(!pal) return;
  const items=[];
  $$('section.chapter, h2.sec-title, h3[id]').forEach(()=>{});
  $$('.toc nav a').forEach(a=>items.push({type:'Section', num:a.querySelector('.num')?.textContent||'', title:a.textContent.replace(/^\s*[\dIVX.\-A-]+\s*/,'').trim(), id:a.getAttribute('href').slice(1)}));
  REFS.forEach(r=>items.push({type:'Ref', num:'['+r.num+']', title:r.title, desc:r.authors, id:'ref-'+r.key, ref:true}));
  let sel=0, shown=[];
  function render(q){ q=q.trim().toLowerCase();
    shown = !q ? items.filter(i=>i.type==='Section')
      : items.filter(i=>(i.title+' '+(i.desc||'')+' '+i.num).toLowerCase().includes(q)).slice(0,40);
    sel=0;
    res.innerHTML = shown.map((i,k)=>`<div class="pr ${k===0?'sel':''}" data-k="${k}">
      <span class="pn">${esc(i.num)}</span><span><span class="pt">${esc(i.title)}</span>${i.desc?` <span class="pd">— ${esc(i.desc)}</span>`:''}</span></div>`).join('')
      || '<div class="phint">No matches</div>';
  }
  function open(){ bg.classList.add('show'); pal.classList.add('show'); inp.value=''; render(''); inp.focus(); }
  function close(){ bg.classList.remove('show'); pal.classList.remove('show'); }
  function go(i){ if(!i)return; const el=document.getElementById(i.id); if(el){ close();
    el.scrollIntoView({behavior:'smooth',block:i.ref?'center':'start'});
    if(i.ref){ el.classList.add('flash'); setTimeout(()=>el.classList.remove('flash'),2200);} } }
  inp.addEventListener('input',()=>render(inp.value));
  inp.addEventListener('keydown',e=>{
    if(e.key==='ArrowDown'){e.preventDefault(); sel=Math.min(sel+1,shown.length-1);}
    else if(e.key==='ArrowUp'){e.preventDefault(); sel=Math.max(sel-1,0);}
    else if(e.key==='Enter'){e.preventDefault(); go(shown[sel]); return;}
    else return;
    $$('.pr',res).forEach((el,k)=>el.classList.toggle('sel',k===sel));
    const s=$('.pr.sel',res); if(s) s.scrollIntoView({block:'nearest'});
  });
  res.addEventListener('click',e=>{ const pr=e.target.closest('.pr'); if(pr) go(shown[+pr.dataset.k]); });
  bg.addEventListener('click',close);
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){ e.preventDefault(); pal.classList.contains('show')?close():open(); }
    else if(e.key==='Escape') close();
    else if(e.key==='/' && !/input|textarea/i.test(document.activeElement.tagName)){ e.preventDefault(); open(); }
  });
  $('#searchBtn').addEventListener('click',open);
}

/* ----------  KaTeX  ---------- */
function renderMath(){ if(window.renderMathInElement){ window.renderMathInElement(document.body,{
  delimiters:[{left:'$$',right:'$$',display:true},{left:'\\[',right:'\\]',display:true},{left:'$',right:'$',display:false},{left:'\\(',right:'\\)',display:false}],
  throwOnError:false }); } }

/* ----------  Boot  ---------- */
function boot(){
  injectFigures();
  wireCites(document);
  buildScope(); buildHardware(); buildStack();
  appTable('tbl-arm', D.apps.arm,'arm');
  appTable('tbl-riscv', D.apps.riscv,'risc');
  appTable('tbl-npu', D.apps.npu,'npu');
  buildTaxonomy(); buildScatter(); buildRefs();
  wireBibtex(); wireScroll(); wireNav(); buildPalette();
  renderMath();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
