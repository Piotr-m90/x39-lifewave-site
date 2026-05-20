/* global React, COPY, AppCtx, useApp */
const { useState: useStateP, useEffect: useEffectP, useRef: useRefP, useCallback: useCallbackP } = React;

/* ==================================================================
   Shared SVG defs (gradients reused across all scenes)
   ================================================================== */
function VizDefs() {
  return (
    <defs>
      <linearGradient id="sv-patch" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F4D9C2"/><stop offset="50%" stopColor="#E8C5A8"/><stop offset="100%" stopColor="#A8806A"/></linearGradient>
      <radialGradient id="sv-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff" stopOpacity="0.95"/><stop offset="55%" stopColor="#FFE8D5" stopOpacity="0.55"/><stop offset="100%" stopColor="#C9A38A" stopOpacity="0"/></radialGradient>
      <radialGradient id="sv-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#E8C5A8" stopOpacity="0.9"/><stop offset="100%" stopColor="#E8C5A8" stopOpacity="0"/></radialGradient>
      <linearGradient id="sv-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.7)"/><stop offset="100%" stopColor="rgba(168,128,106,0.35)"/></linearGradient>
      <linearGradient id="sv-cool" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#cfd8e3"/><stop offset="100%" stopColor="#8b97a8"/></linearGradient>
      <filter id="sv-soft"><feGaussianBlur stdDeviation="2"/></filter>
    </defs>
  );
}

/* Interactive zone — hover lights up (CSS), click fires a one-shot reaction.
   Pass `id` (unique within scene), `fired` set, `onFire` handler. */
function Zone({ id, fired, onFire, label, children, cx, cy }) {
  const isFired = fired.has(id);
  return (
    <g
      className={"x-iz" + (isFired ? " is-fired" : "")}
      onClick={(e) => { e.stopPropagation(); onFire(id); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onFire(id); } }}
      aria-label={label}
      style={cx != null ? { transformOrigin: cx + "px " + cy + "px" } : undefined}
    >
      {children}
    </g>
  );
}

/* ==================================================================
   16 literal + interactive scenes
   ================================================================== */
function SlideVisual({ type, active }) {
  const [fired, setFired] = useStateP(() => new Set());
  // reset interactions when slide leaves
  useEffectP(() => { if (!active) setFired(new Set()); }, [active]);
  const onFire = useCallbackP((id) => {
    setFired(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);
  const cls = "x-slide-viz x-viz--" + type + (active ? " is-active" : "");
  const P = { fired, onFire };

  const V = (children, label) => (
    <svg className={cls} viewBox="0 0 480 340" role="img" aria-label={label}>
      <VizDefs/>{children}
    </svg>
  );

  switch (type) {

    /* 1. HERO — patch with descending light beam. Click patch → emits pulse wave */
    case "hero": return V(<>
      <g className="sv-beam"><rect x="234" y="-10" width="12" height="150" rx="6" fill="url(#sv-core)"/></g>
      <Zone id="patch" {...P} label="Plaster X39" cx="240" cy="200">
        <g className="sv-float">
          <ellipse className="sv-shadow" cx="240" cy="280" rx="150" ry="18" fill="rgba(168,128,106,0.18)"/>
          <rect x="90" y="150" width="300" height="110" rx="55" fill="url(#sv-patch)" stroke="url(#sv-rim)" strokeWidth="2"/>
          <rect x="104" y="164" width="272" height="82" rx="41" fill="#F8EDE0" opacity="0.92"/>
          <ellipse cx="240" cy="205" rx="92" ry="44" fill="url(#sv-core)"/>
          {[-2,-1,0,1,2].map(i => <polygon key={i} className="sv-crys" style={{["--i"]:i+2}} points="0,-11 9,-6 9,6 0,11 -9,6 -9,-6" fill="rgba(255,255,255,0.78)" stroke="rgba(168,128,106,0.45)" transform={`translate(${240 + i*32},205)`}/>)}
          <text x="240" y="252" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="11" fontWeight="600" letterSpacing="3" fill="rgba(168,128,106,0.6)">X39</text>
        </g>
        <circle className="sv-ripple" cx="240" cy="205" r="60" fill="none" stroke="#E8C5A8" strokeWidth="2"/>
        <circle className="sv-ripple sv-ripple--2" cx="240" cy="205" r="60" fill="none" stroke="#C9A38A" strokeWidth="1.5"/>
      </Zone>
    </>, "Plaster X39 — kliknij, aby aktywować");

    /* 2. CHEMISTRY — molecule (cold) vs body-of-light. Hover/click each side */
    case "chemistry": return V(<>
      <Zone id="chem" {...P} label="Chemia" cx="130" cy="170">
        <g className="sv-cold">
          <circle cx="130" cy="120" r="24" fill="none" stroke="url(#sv-cool)" strokeWidth="3"/>
          <circle cx="130" cy="210" r="24" fill="none" stroke="url(#sv-cool)" strokeWidth="3"/>
          <circle cx="80" cy="165" r="16" fill="none" stroke="url(#sv-cool)" strokeWidth="3"/>
          <circle cx="180" cy="165" r="16" fill="none" stroke="url(#sv-cool)" strokeWidth="3"/>
          <line x1="130" y1="144" x2="130" y2="186" stroke="url(#sv-cool)" strokeWidth="3"/>
          <line x1="112" y1="135" x2="92" y2="153" stroke="url(#sv-cool)" strokeWidth="3"/>
          <line x1="148" y1="135" x2="168" y2="153" stroke="url(#sv-cool)" strokeWidth="3"/>
        </g>
        <text x="130" y="270" textAnchor="middle" fontFamily="Inter" fontSize="13" fill="#9A8E85">Chemia</text>
      </Zone>
      <text x="240" y="172" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="22" fill="#C9A38A">vs</text>
      <Zone id="light" {...P} label="Światło i energia" cx="350" cy="170">
        <g className="sv-warm">
          <circle className="sv-pulse-soft" cx="350" cy="165" r="56" fill="url(#sv-glow)"/>
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => <line key={a} className="sv-ray" style={{["--a"]:a}} x1="350" y1="165" x2={350 + 78*Math.cos(a*Math.PI/180)} y2={165 + 78*Math.sin(a*Math.PI/180)} stroke="#E8C5A8" strokeWidth="2"/>)}
          <circle cx="350" cy="165" r="26" fill="#E8C5A8"/>
        </g>
        <text x="350" y="270" textAnchor="middle" fontFamily="Inter" fontSize="13" fill="#A8806A">Światło</text>
      </Zone>
    </>, "Chemia vs światło — kliknij strony");

    /* 3. SCHMIDT — frequency waves decoded. Click → waves resonate */
    case "schmidt": return V(<>
      <Zone id="freq" {...P} label="Częstotliwość">
        <g className="sv-waves">
          <path d="M 40,170 Q 100,90 160,170 T 280,170 T 400,170 T 440,170" fill="none" stroke="#E8C5A8" strokeWidth="3"/>
          <path d="M 40,190 Q 100,120 160,190 T 280,190 T 400,190 T 440,190" fill="none" stroke="#C9A38A" strokeWidth="2" opacity="0.6"/>
          <path d="M 40,150 Q 100,70 160,150 T 280,150 T 400,150 T 440,150" fill="none" stroke="#C9A38A" strokeWidth="2" opacity="0.4"/>
        </g>
        <circle className="sv-pulse" cx="240" cy="170" r="12" fill="#E8C5A8"/>
        <text x="240" y="260" textAnchor="middle" fontFamily="Inter" fontSize="13" fill="rgba(232,197,168,0.7)">„bezprzewodowy sygnał"</text>
      </Zone>
    </>, "Częstotliwość — kliknij, by wzmocnić");

    /* 4. BATTERY — 3 literal steps: heat → mirror → signal back. Click each */
    case "battery": return V(<>
      {[
        {id:"heat", x:80, label:"Ciepło ciała", icon:(<><path d="M28 8 q-10 14 0 24 q10-10 0-24Z" fill="#E8C5A8"/><path d="M40 14 q-7 10 0 18 q7-8 0-18Z" fill="#C9A38A" opacity="0.7"/></>)},
        {id:"mirror", x:200, label:"Plaster-lustro", icon:(<><rect x="6" y="10" width="48" height="22" rx="11" fill="url(#sv-patch)"/>{[-1,0,1].map(i=><polygon key={i} points="0,-6 5,-3 5,3 0,6 -5,3 -5,-3" fill="rgba(255,255,255,0.8)" transform={`translate(${30+i*14},21)`}/>)}</>)},
        {id:"signal", x:320, label:"Sygnał wraca", icon:(<>{[0,1,2].map(i=><circle key={i} cx="30" cy="21" r={8+i*7} fill="none" stroke="#C9A38A" strokeWidth="2" opacity={0.8-i*0.22}/>)}<circle cx="30" cy="21" r="5" fill="#E8C5A8"/></>)},
      ].map((s,i)=>(
        <g key={s.id}>
          <Zone id={s.id} {...P} label={s.label} cx={s.x+30} cy={150}>
            <circle className="sv-tile" cx={s.x+30} cy="150" r="48" fill="#fff" stroke="#C9A38A" strokeWidth="1.5"/>
            <g transform={`translate(${s.x},129)`}>{s.icon}</g>
            <text x={s.x+30} y="232" textAnchor="middle" fontFamily="Inter" fontSize="12" fontWeight="500" fill="#A8806A">{i+1}. {s.label}</text>
          </Zone>
          {i<2 && <path className="sv-arrow" d={`M ${s.x+86},150 L ${s.x+116},150 M ${s.x+108},143 L ${s.x+116},150 L ${s.x+108},157`} stroke="#C9A38A" strokeWidth="2" fill="none"/>}
        </g>
      ))}
    </>, "Trzy kroki — kliknij każdy");

    /* 5. RADIO — crystal radio antenna ↔ patch. Click crystals to light */
    case "radio": return V(<>
      <g className="sv-waves">{[1,2,3,4].map(i => <path key={i} d={`M 110,170 Q 150,${170-i*26} 190,170`} fill="none" stroke="#C9A38A" strokeWidth="2" opacity={0.75-i*0.14} transform={`translate(${i*7},0)`}/>)}</g>
      <g opacity="0.55"><rect x="50" y="150" width="56" height="40" rx="4" fill="none" stroke="#9A8E85" strokeWidth="2"/><line x1="60" y1="158" x2="96" y2="158" stroke="#9A8E85"/><line x1="60" y1="168" x2="96" y2="168" stroke="#9A8E85"/><line x1="60" y1="178" x2="96" y2="178" stroke="#9A8E85"/></g>
      <Zone id="ant" {...P} label="Antena kwarcowa" cx="320" cy="170">
        <g className="sv-float">
          <rect x="250" y="135" width="150" height="80" rx="40" fill="url(#sv-patch)" stroke="url(#sv-rim)"/>
          {[-1,0,1].map(i => <polygon key={i} className="sv-crys" style={{["--i"]:i+1}} points="0,-13 11,-6.5 11,6.5 0,13 -11,6.5 -11,-6.5" fill="rgba(255,255,255,0.8)" stroke="#A8806A" transform={`translate(${325 + i*34},175)`}/>)}
        </g>
      </Zone>
    </>, "Krystaliczne radio — kliknij antenę");

    /* 6. PEPTIDE — copper molecule + DNA + 4200 counter. Click → gene reset */
    case "peptide": return <PeptideViz cls={cls} active={active} {...P}/>;

    /* 7. BENEFITS — 5 literal benefit icons, hover label, click to glow */
    case "benefits": {
      const items = [
        {id:"heal", t:"Gojenie", ic:<path d="M16 26 q-8-6-8-13 a5 5 0 0 1 9-3 a5 5 0 0 1 9 3 q0 7-8 13Z" fill="#C9A38A"/>},
        {id:"coll", t:"Kolagen", ic:<><circle cx="16" cy="16" r="6" fill="none" stroke="#C9A38A" strokeWidth="2.5"/><path d="M16 4v6M16 22v6M4 16h6M22 16h6" stroke="#C9A38A" strokeWidth="2.5"/></>},
        {id:"dna", t:"DNA", ic:<path d="M8 6 q16 10 0 20 M24 6 q-16 10 0 20 M10 11h12M10 21h12" stroke="#C9A38A" strokeWidth="2.5" fill="none"/>},
        {id:"brain", t:"Mózg", ic:<path d="M16 6 a8 8 0 0 0-8 8 a6 6 0 0 0 2 11 h12 a6 6 0 0 0 2-11 a8 8 0 0 0-8-8Z M16 6v19" fill="none" stroke="#C9A38A" strokeWidth="2.5"/>},
        {id:"gut", t:"Jelita", ic:<path d="M8 16 a8 8 0 0 1 16 0 a5 5 0 0 1-10 0 a3 3 0 0 1 6 0" fill="none" stroke="#C9A38A" strokeWidth="2.5"/>},
      ];
      return V(<>{items.map((b,i)=>(
        <Zone key={b.id} id={b.id} {...P} label={b.t} cx={56+i*92} cy={150}>
          <circle cx={56+i*92} cy="150" r="40" fill="rgba(232,197,168,0.16)" stroke="#C9A38A" strokeWidth="1.5"/>
          <g transform={`translate(${40+i*92},134)`}>{b.ic}</g>
          <text x={56+i*92} y="215" textAnchor="middle" fontFamily="Inter" fontSize="12" fontWeight="500" fill="#A8806A">{b.t}</text>
        </Zone>
      ))}</>, "5 korzyści — najedź i kliknij");
    }

    /* 8. STEMCELLS — central master cell → 3 tissues (heart/liver/nerve). Click cell */
    case "stemcells": {
      const tissues = [
        {id:"heart", a:-90, t:"Serce"},
        {id:"liver", a:30, t:"Wątroba"},
        {id:"nerve", a:150, t:"Nerwy"},
      ];
      return V(<>
        {tissues.map(ts => { const x = 240 + 115*Math.cos(ts.a*Math.PI/180); const y = 165 + 95*Math.sin(ts.a*Math.PI/180); return (
          <g key={ts.id}>
            <line className="sv-link" x1="240" y1="165" x2={x} y2={y} stroke="#C9A38A" strokeWidth="2" opacity="0.4" strokeDasharray="4 4"/>
            <Zone id={ts.id} {...P} label={ts.t} cx={x} cy={y}>
              <circle cx={x} cy={y} r="30" fill="rgba(232,197,168,0.14)" stroke="#A8806A" strokeWidth="2"/>
              <circle cx={x} cy={y} r="11" fill="#E8C5A8"/>
              <text x={x} y={y+48} textAnchor="middle" fontFamily="Inter" fontSize="12" fill="#A8806A">{ts.t}</text>
            </Zone>
          </g>
        );})}
        <Zone id="master" {...P} label="Komórka macierzysta" cx="240" cy="165">
          <circle className="sv-pulse-soft" cx="240" cy="165" r="46" fill="url(#sv-glow)"/>
          <circle cx="240" cy="165" r="30" fill="url(#sv-core)" stroke="#C9A38A" strokeWidth="2"/>
          <circle cx="240" cy="165" r="14" fill="#C9A38A"/>
        </Zone>
      </>, "Komórka macierzysta → tkanki — kliknij");
    }

    /* 9. AGECURVE — decay chart, clickable 30/60 points reveal % */
    case "agecurve": return V(<>
      <line x1="54" y1="270" x2="446" y2="270" stroke="#e0e0e0"/><line x1="54" y1="50" x2="54" y2="270" stroke="#e0e0e0"/>
      {[0,50,100].map(v=><g key={v}><line x1="54" y1={270-v*2.1} x2="446" y2={270-v*2.1} stroke="#f3efe9"/><text x="44" y={274-v*2.1} textAnchor="end" fontFamily="Inter" fontSize="10" fill="#9A8E85">{v}%</text></g>)}
      <path className="sv-draw" d="M 54,62 Q 170,68 210,165 T 340,250 T 446,260" fill="none" stroke="#C9A38A" strokeWidth="3" strokeLinecap="round"/>
      <Zone id="p30" {...P} label="Wiek 30: 50%" cx="210" cy="165">
        <circle cx="210" cy="165" r="9" fill="#C9A38A" stroke="#fff" strokeWidth="3"/>
        <g className="sv-tooltip"><rect x="180" y="120" width="92" height="30" rx="8" fill="#1d1d1f"/><text x="226" y="140" textAnchor="middle" fontFamily="Inter" fontSize="12" fill="#fff">30 lat → 50%</text></g>
      </Zone>
      <Zone id="p60" {...P} label="Wiek 60: 10-20%" cx="340" cy="250">
        <circle cx="340" cy="250" r="9" fill="#A8806A" stroke="#fff" strokeWidth="3"/>
        <g className="sv-tooltip"><rect x="306" y="205" width="100" height="30" rx="8" fill="#1d1d1f"/><text x="356" y="225" textAnchor="middle" fontFamily="Inter" fontSize="12" fill="#fff">60 lat → 10%</text></g>
      </Zone>
    </>, "Krzywa starzenia — kliknij punkty");

    /* 10. COMPARISON — syringe ($10k, cold) vs patch (X39). Click each */
    case "comparison": return V(<>
      <Zone id="inj" {...P} label="Iniekcje 10 000 USD" cx="130" cy="160">
        <g className="sv-cold">
          <rect x="96" y="90" width="16" height="120" rx="4" fill="none" stroke="url(#sv-cool)" strokeWidth="3"/>
          <line x1="104" y1="210" x2="104" y2="240" stroke="url(#sv-cool)" strokeWidth="3"/>
          <line x1="86" y1="100" x2="122" y2="100" stroke="url(#sv-cool)" strokeWidth="3"/>
          {[120,140,160,180].map(y=><line key={y} x1="100" y1={y} x2="108" y2={y} stroke="url(#sv-cool)" strokeWidth="2"/>)}
        </g>
        <text x="104" y="270" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="20" fontWeight="600" fill="#9A8E85">~$10 000</text>
      </Zone>
      <text x="240" y="165" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="24" fill="#C9A38A">vs</text>
      <Zone id="x39" {...P} label="Plaster X39" cx="350" cy="160">
        <g className="sv-float">
          <rect x="290" y="125" width="120" height="64" rx="32" fill="url(#sv-patch)" stroke="url(#sv-rim)"/>
          {[-1,0,1].map(i=><polygon key={i} className="sv-crys" style={{["--i"]:i+1}} points="0,-8 7,-4 7,4 0,8 -7,4 -7,-4" fill="rgba(255,255,255,0.8)" transform={`translate(${350+i*26},157)`}/>)}
        </g>
        <text x="350" y="270" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="20" fontWeight="600" fill="#A8806A">X39</text>
      </Zone>
    </>, "Iniekcje vs X39 — kliknij");

    /* 11. REVERSECLOCK — old cell → arrow → young cell. Click to transform */
    case "reverseclock": return V(<>
      <Zone id="old" {...P} label="Stara komórka" cx="120" cy="165">
        <path className="sv-cold" d="M 90,135 q 18,-22 38,-8 q 24,4 20,30 q 8,22 -16,30 q -18,18 -38,2 q -24,-6 -16,-30 q -10,-18 12,-24Z" fill="#c9cdd4" stroke="#8b97a8" strokeWidth="2"/>
        <text x="120" y="245" textAnchor="middle" fontFamily="Inter" fontSize="12" fill="#9A8E85">uszkodzona</text>
      </Zone>
      <path className="sv-arrow" d="M 185,165 L 290,165 M 280,156 L 290,165 L 280,174" stroke="#C9A38A" strokeWidth="3" fill="none"/>
      <Zone id="young" {...P} label="Młoda komórka" cx="360" cy="165">
        <circle className="sv-pulse-soft" cx="360" cy="165" r="44" fill="url(#sv-glow)"/>
        <circle cx="360" cy="165" r="34" fill="url(#sv-core)" stroke="#C9A38A" strokeWidth="2"/>
        <circle cx="360" cy="165" r="14" fill="#E8C5A8"/>
        <text x="360" y="245" textAnchor="middle" fontFamily="Inter" fontSize="12" fill="#A8806A">młoda</text>
      </Zone>
    </>, "Odwracanie zegara — kliknij komórki");

    /* 12. TIMELINE — 3 phases. Click reveals */
    case "timeline": {
      const ph = [{id:"d",t:"1-30 dni",s:"energia, sen"},{id:"m",t:"1-3 mies.",s:"skóra, kolagen"},{id:"y",t:"6 mies.",s:"serce −8 lat"}];
      return V(<>
        <line x1="90" y1="165" x2="390" y2="165" stroke="#C9A38A" strokeWidth="2" opacity="0.35"/>
        {ph.map((p,i)=>(
          <Zone key={p.id} id={p.id} {...P} label={p.t} cx={110+i*135} cy={165}>
            <circle cx={110+i*135} cy="165" r="38" fill="#fff" stroke="#C9A38A" strokeWidth="2"/>
            <text x={110+i*135} y="160" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="14" fontWeight="600" fill="#A8806A">{p.t.split(" ")[0]}</text>
            <text x={110+i*135} y="178" textAnchor="middle" fontFamily="Inter" fontSize="10" fill="#A8806A">{p.t.split(" ").slice(1).join(" ")}</text>
            <text className="sv-tip-text" x={110+i*135} y="232" textAnchor="middle" fontFamily="Inter" fontSize="12" fill="#9A8E85">{p.s}</text>
          </Zone>
        ))}
      </>, "Oś czasu — kliknij fazy");
    }

    /* 13. SCIENCE — 3 medallions. Click to shine */
    case "science": {
      const m=[{id:"pat",n:"100+",t:"patentów"},{id:"std",n:"80+",t:"badań"},{id:"saf",n:"0",t:"skutków"}];
      return V(<>{m.map((x,i)=>(
        <Zone key={x.id} id={x.id} {...P} label={x.t} cx={110+i*130} cy={155}>
          <circle cx={110+i*130} cy="155" r="50" fill="rgba(232,197,168,0.14)" stroke="#C9A38A" strokeWidth="2"/>
          <circle cx={110+i*130} cy="155" r="40" fill="none" stroke="rgba(168,128,106,0.3)" strokeWidth="1"/>
          <text x={110+i*130} y="150" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="26" fontWeight="600" fill="#A8806A">{x.n}</text>
          <text x={110+i*130} y="172" textAnchor="middle" fontFamily="Inter" fontSize="11" fill="#A8806A">{x.t}</text>
        </Zone>
      ))}</>, "Dowody — kliknij odznaki");
    }

    /* 14. HOWTO — body silhouette + application points. Click points → patch appears */
    case "howto": return V(<>
      <path d="M 240,60 a 22,22 0 1 1 0,1 Z" fill="none" stroke="#C9A38A" strokeWidth="2"/>
      <circle cx="240" cy="78" r="20" fill="none" stroke="#C9A38A" strokeWidth="2"/>
      <path d="M 240,100 q -50,8 -54,70 q -2,40 6,90 M 240,100 q 50,8 54,70 q 2,40 -6,90 M 240,100 v 130 M 200,290 h 80" fill="none" stroke="#C9A38A" strokeWidth="2" opacity="0.7"/>
      <Zone id="neck" {...P} label="Kark" cx="240" cy="108">
        <circle className="sv-point" cx="240" cy="108" r="11" fill="#E8C5A8" stroke="#fff" strokeWidth="2"/>
        <rect className="sv-revealpatch" x="222" y="100" width="36" height="16" rx="8" fill="url(#sv-patch)"/>
        <text x="270" y="112" fontFamily="Inter" fontSize="12" fill="#A8806A">kark</text>
      </Zone>
      <Zone id="navel" {...P} label="Pod pępkiem" cx="240" cy="185">
        <circle className="sv-point" cx="240" cy="185" r="11" fill="#E8C5A8" stroke="#fff" strokeWidth="2"/>
        <rect className="sv-revealpatch" x="222" y="177" width="36" height="16" rx="8" fill="url(#sv-patch)"/>
        <text x="270" y="189" fontFamily="Inter" fontSize="12" fill="#A8806A">pod pępkiem</text>
      </Zone>
    </>, "Miejsca aplikacji — kliknij punkty");

    /* 15. GUARANTEE — shield, click → checkmark draws + glow */
    case "guarantee": return V(<>
      <Zone id="shield" {...P} label="Gwarancja 90 dni" cx="240" cy="160">
        <circle className="sv-pulse-soft" cx="240" cy="155" r="68" fill="url(#sv-glow)"/>
        <g className="sv-float">
          <path d="M 240,80 L 168,108 v 56 q 0,62 72,80 q 72,-18 72,-80 v -56 Z" fill="url(#sv-patch)" stroke="url(#sv-rim)" strokeWidth="2"/>
          <path className="sv-check" d="M 212,158 l 18,18 34,-40" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <text x="240" y="285" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="28" fontWeight="600" fill="#A8806A">90 dni</text>
      </Zone>
    </>, "Gwarancja — kliknij tarczę");

    /* 16. CTA — radiant figure of light */
    case "cta": return V(<>
      <g className="sv-rays-slow">{[0,30,60,90,120,150,180,210,240,270,300,330].map(a => <line key={a} x1="240" y1="170" x2={240 + 120*Math.cos(a*Math.PI/180)} y2={170 + 120*Math.sin(a*Math.PI/180)} stroke="#E8C5A8" strokeWidth="2" opacity="0.45"/>)}</g>
      <circle className="sv-pulse-soft" cx="240" cy="170" r="74" fill="url(#sv-glow)"/>
      <Zone id="figure" {...P} label="Twój start" cx="240" cy="180">
        <circle cx="240" cy="120" r="26" fill="url(#sv-patch)"/>
        <path d="M 240,148 q 34,4 34,52 q 0,46 -34,64 q -34,-18 -34,-64 q 0,-48 34,-52Z" fill="url(#sv-patch)" stroke="url(#sv-rim)"/>
      </Zone>
    </>, "Twoja droga — kliknij");

    default: return V(<circle cx="240" cy="170" r="40" fill="#E8C5A8"/>, "X39");
  }
}

/* Peptide scene split out — has an interactive gene-reset counter */
function PeptideViz({ cls, active, fired, onFire }) {
  const [count, setCount] = useStateP(0);
  const reset = fired.has("reset");
  useEffectP(() => {
    if (!reset) { setCount(0); return; }
    const dur = 1600, start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * 4200));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reset]);
  return (
    <svg className={cls} viewBox="0 0 480 340" role="img" aria-label="Peptyd miedzi GHK-Cu — kliknij, by zresetować geny">
      <VizDefs/>
      {/* DNA helix (right) */}
      <g className={"sv-dna" + (reset ? " is-reset" : "")}>
        <path d="M 360,70 q 30,30 0,60 q -30,30 0,60 q 30,30 0,60" fill="none" stroke="#C9A38A" strokeWidth="2.5"/>
        <path d="M 410,70 q -30,30 0,60 q 30,30 0,60 q -30,30 0,60" fill="none" stroke="#C9A38A" strokeWidth="2.5"/>
        {[85,115,145,175,205,235].map((y,i)=><line key={i} x1={368+(i%2)*8} y1={y} x2={402-(i%2)*8} y2={y} stroke="#E8C5A8" strokeWidth="2"/>)}
      </g>
      {/* Copper peptide molecule (left, interactive) */}
      <Zone id="reset" fired={fired} onFire={onFire} label="Reset genów" cx="150" cy="150">
        <g className="sv-rotate-slow" style={{transformOrigin:"150px 150px"}}>
          {[0,1,2,3,4,5].map(i => <circle key={i} cx={150 + 56*Math.cos(i*Math.PI/3)} cy={150 + 56*Math.sin(i*Math.PI/3)} r="13" fill={i%2?"#E8C5A8":"#fff"} stroke="#A8806A" strokeWidth="1.5"/>)}
          <circle cx="150" cy="150" r="17" fill="#C9A38A"/>
          <text x="150" y="155" textAnchor="middle" fontFamily="Inter" fontSize="10" fontWeight="700" fill="#fff">Cu</text>
        </g>
      </Zone>
      {/* counter */}
      <text className="sv-count-num" x="240" y="290" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="40" fontWeight="600" fill="#A8806A">{count.toLocaleString("pl-PL")}</text>
      <text x="240" y="312" textAnchor="middle" fontFamily="Inter" fontSize="12" fill="#9A8E85">genów zresetowanych {reset ? "" : "— kliknij molekułę"}</text>
    </svg>
  );
}

/* ==================================================================
   SlideDeck — fullscreen multimedia presentation
   ================================================================== */
function SlideDeck() {
  const { t } = useApp();
  const slides = t.deck.slides;
  const total = slides.length;
  const [idx, setIdx] = useStateP(0);
  const [auto, setAuto] = useStateP(false);
  const touchX = useRefP(null);
  const autoRef = useRefP(null);

  const go = useCallbackP((n) => setIdx(() => Math.max(0, Math.min(total - 1, n))), [total]);
  const next = useCallbackP(() => setIdx((c) => (c >= total - 1 ? c : c + 1)), [total]);
  const prev = useCallbackP(() => setIdx((c) => (c <= 0 ? 0 : c - 1)), []);

  useEffectP(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, total]);

  useEffectP(() => {
    if (!auto) { if (autoRef.current) clearTimeout(autoRef.current); return; }
    if (idx >= total - 1) { setAuto(false); return; }
    autoRef.current = setTimeout(() => setIdx((c) => c + 1), 7500);
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [auto, idx, total]);

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    touchX.current = null;
  };

  const buyLink = (window.X39_CONFIG && window.X39_CONFIG.links.buy) || "index.html#buy";
  const teamLink = "zespol.html";

  return (
    <div className="x-deck" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="x-deck__progress"><div className="x-deck__progress-fill" style={{ width: ((idx + 1) / total * 100) + "%" }}/></div>
      <div className="x-deck__top">
        <a href="index.html" className="x-deck__brand"><span className="x-nav-global__dot" aria-hidden="true"></span> X39</a>
        <div className="x-deck__top-right">
          <DeckLang/>
          <span className="x-deck__counter">{t.deck.slideOf} {idx + 1} / {total}</span>
          <a href="index.html" className="x-deck__close" aria-label={t.deck.close}>✕</a>
        </div>
      </div>
      <div className="x-deck__stage">
        {slides.map((s, i) => (
          <div
            key={i}
            className={"x-deck__slide x-deck__slide--" + s.theme + (i === idx ? " is-active" : i < idx ? " is-past" : " is-future")}
            aria-hidden={i !== idx}
          >
            <div className="x-deck__slide-inner">
              <div className="x-deck__viz"><SlideVisual type={s.visual} active={i === idx}/></div>
              <div className="x-deck__copy">
                <span className="x-deck__kicker">{s.kicker}</span>
                <h2 className="x-deck__title">{s.title}</h2>
                <p className="x-deck__body">{s.body}</p>
                {i === total - 1 && (
                  <div className="x-deck__cta">
                    <a href={buyLink} target={buyLink.startsWith("http") ? "_blank" : "_self"} rel={buyLink.startsWith("http") ? "noopener" : undefined} className="x-btn x-btn--primary">{t.deck.ctaBuy}</a>
                    <a href={teamLink} className="x-btn x-btn--ghost">{t.deck.ctaTeam}</a>
                  </div>
                )}
                <span className="x-deck__hint">{i === total - 1 ? "" : "↔ klikaj elementy grafiki"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="x-deck__controls">
        <button className="x-deck__nav" onClick={prev} disabled={idx === 0} aria-label={t.deck.prev}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="x-deck__dots">
          {slides.map((_, i) => <button key={i} className={"x-deck__dot" + (i === idx ? " is-active" : "")} onClick={() => go(i)} aria-label={t.deck.slideOf + " " + (i+1)}/>)}
        </div>
        <button className="x-deck__nav" onClick={next} disabled={idx === total - 1} aria-label={t.deck.next}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <button className={"x-deck__auto" + (auto ? " is-on" : "")} onClick={() => setAuto(a => !a)} aria-label={t.deck.autoplay}>
          {auto ? <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
                : <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
        </button>
      </div>
    </div>
  );
}

function DeckLang() {
  const { locale, setLocale } = useApp();
  return (
    <div className="x-lang">
      {["pl","en","de"].map(c => (
        <button key={c} className={"x-lang__btn" + (locale === c ? " is-active" : "")} onClick={() => { setLocale(c); try { localStorage.setItem("x39_lang", c); } catch(e){} }}>{c.toUpperCase()}</button>
      ))}
    </div>
  );
}

Object.assign(window, { SlideDeck, SlideVisual, DeckLang });
