/* global React, COPY, AppCtx, useApp */
const { useState: useStateP, useEffect: useEffectP, useRef: useRefP, useCallback: useCallbackP } = React;

/* ==================================================================
   SlideVisual — animated SVG per slide type (16 visuals)
   ================================================================== */
function SlideVisual({ type, active }) {
  const cls = "x-slide-viz" + (active ? " is-active" : "");
  switch (type) {
    case "hero": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="Plaster X39">
        <defs>
          <linearGradient id="sv-patch" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F4D9C2"/><stop offset="50%" stopColor="#E8C5A8"/><stop offset="100%" stopColor="#A8806A"/></linearGradient>
          <radialGradient id="sv-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff" stopOpacity="0.95"/><stop offset="60%" stopColor="#FFE8D5" stopOpacity="0.5"/><stop offset="100%" stopColor="#C9A38A" stopOpacity="0"/></radialGradient>
        </defs>
        <g className="sv-beam"><rect x="232" y="0" width="6" height="160" fill="url(#sv-core)" opacity="0.7"/></g>
        <g className="sv-float">
          <rect x="90" y="120" width="300" height="110" rx="55" fill="url(#sv-patch)" stroke="rgba(168,128,106,0.4)"/>
          <rect x="104" y="134" width="272" height="82" rx="41" fill="#F8EDE0" opacity="0.9"/>
          <ellipse cx="240" cy="175" rx="90" ry="44" fill="url(#sv-core)"/>
          {[-2,-1,0,1,2].map(i => <polygon key={i} points="0,-10 9,-5 9,5 0,10 -9,5 -9,-5" fill="rgba(255,255,255,0.7)" stroke="rgba(168,128,106,0.4)" transform={`translate(${240 + i*30},175)`}/>)}
        </g>
      </svg>
    );
    case "chemistry": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="Chemia vs światło">
        <g className="sv-fade-l" opacity="0.5"><circle cx="120" cy="120" r="22" fill="none" stroke="#9A8E85" strokeWidth="2"/><circle cx="120" cy="200" r="22" fill="none" stroke="#9A8E85" strokeWidth="2"/><line x1="120" y1="142" x2="120" y2="178" stroke="#9A8E85" strokeWidth="2"/><circle cx="80" cy="160" r="14" fill="none" stroke="#9A8E85" strokeWidth="2"/><line x1="106" y1="135" x2="92" y2="150" stroke="#9A8E85" strokeWidth="2"/></g>
        <g className="sv-rays"><circle cx="340" cy="160" r="50" fill="url(#sv-core)" opacity="0.6"/>{[0,45,90,135,180,225,270,315].map(a => <line key={a} x1="340" y1="160" x2={340 + 80*Math.cos(a*Math.PI/180)} y2={160 + 80*Math.sin(a*Math.PI/180)} stroke="#E8C5A8" strokeWidth="2" opacity="0.6"/>)}<circle cx="340" cy="160" r="28" fill="#E8C5A8"/></g>
      </svg>
    );
    case "schmidt": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="Częstotliwość">
        <g className="sv-wave"><path d="M 40,160 Q 100,80 160,160 T 280,160 T 400,160" fill="none" stroke="#E8C5A8" strokeWidth="3"/><path d="M 40,180 Q 100,120 160,180 T 280,180 T 400,180" fill="none" stroke="#C9A38A" strokeWidth="2" opacity="0.6"/><path d="M 40,140 Q 100,60 160,140 T 280,140 T 400,140" fill="none" stroke="#C9A38A" strokeWidth="2" opacity="0.4"/></g>
        <circle className="sv-pulse" cx="240" cy="160" r="10" fill="#E8C5A8"/>
      </svg>
    );
    case "battery": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="3 kroki">
        {[0,1,2].map(i => (
          <g key={i} className="sv-step" style={{["--d"]: i*0.25 + "s"}} transform={`translate(${70 + i*150},120)`}>
            <circle cx="40" cy="40" r="38" fill="none" stroke="#C9A38A" strokeWidth="2"/>
            <text x="40" y="52" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="32" fontWeight="600" fill="#A8806A">{i+1}</text>
            {i<2 && <path d="M 88,40 L 112,40 M 104,32 L 112,40 L 104,48" stroke="#C9A38A" strokeWidth="2" fill="none"/>}
          </g>
        ))}
      </svg>
    );
    case "radio": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="Krystaliczne radio">
        <g className="sv-wave">{[1,2,3].map(i => <path key={i} d={`M 120,160 Q 160,${160-i*30} 200,160`} fill="none" stroke="#C9A38A" strokeWidth="2" opacity={0.7 - i*0.15} transform={`translate(${i*8},0)`}/>)}</g>
        <g className="sv-float"><rect x="240" y="120" width="140" height="80" rx="40" fill="url(#sv-patch)" stroke="rgba(168,128,106,0.4)"/>{[-1,0,1].map(i => <polygon key={i} points="0,-12 10,-6 10,6 0,12 -10,6 -10,-6" fill="rgba(255,255,255,0.75)" stroke="#A8806A" transform={`translate(${310 + i*32},160)`}/>)}</g>
      </svg>
    );
    case "peptide": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="GHK-Cu 4200 genów">
        <g className="sv-rotate" style={{transformOrigin:"160px 160px"}}>{[0,1,2,3,4,5].map(i => <circle key={i} cx={160 + 60*Math.cos(i*Math.PI/3)} cy={160 + 60*Math.sin(i*Math.PI/3)} r="14" fill={i%2?"#E8C5A8":"#fff"} stroke="#A8806A" strokeWidth="1.5"/>)}<circle cx="160" cy="160" r="18" fill="#C9A38A"/></g>
        <text className="sv-count" x="350" y="150" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="56" fontWeight="600" fill="#A8806A">4200</text>
        <text x="350" y="180" textAnchor="middle" fontFamily="Inter" fontSize="13" fill="#9A8E85">genów</text>
      </svg>
    );
    case "benefits": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="5 korzyści">
        {[0,1,2,3,4].map(i => (
          <g key={i} className="sv-step" style={{["--d"]: i*0.12 + "s"}} transform={`translate(${50 + i*82},130)`}>
            <circle cx="30" cy="30" r="28" fill="rgba(232,197,168,0.18)" stroke="#C9A38A" strokeWidth="1.5"/>
            <circle cx="30" cy="30" r="8" fill="#C9A38A"/>
          </g>
        ))}
      </svg>
    );
    case "stemcells": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="Komórki macierzyste">
        <circle className="sv-pulse" cx="240" cy="160" r="40" fill="url(#sv-core)"/>
        <circle cx="240" cy="160" r="22" fill="#E8C5A8"/>
        {[0,1,2].map(i => { const a = i*120 - 90; const x = 240 + 110*Math.cos(a*Math.PI/180); const y = 160 + 90*Math.sin(a*Math.PI/180); return (
          <g key={i} className="sv-step" style={{["--d"]: i*0.2 + "s"}}><line x1="240" y1="160" x2={x} y2={y} stroke="#C9A38A" strokeWidth="2" opacity="0.5"/><circle cx={x} cy={y} r="26" fill="none" stroke="#A8806A" strokeWidth="2"/><circle cx={x} cy={y} r="10" fill="#E8C5A8"/></g>
        );})}
      </svg>
    );
    case "agecurve": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="Krzywa starzenia">
        <line x1="50" y1="260" x2="440" y2="260" stroke="#e0e0e0"/><line x1="50" y1="50" x2="50" y2="260" stroke="#e0e0e0"/>
        <path className="sv-draw" d="M 50,60 Q 160,66 200,160 T 330,240 T 440,250" fill="none" stroke="#C9A38A" strokeWidth="3" strokeLinecap="round"/>
        <g className="sv-step" style={{["--d"]:"1.2s"}}><circle cx="200" cy="160" r="7" fill="#C9A38A" stroke="#fff" strokeWidth="3"/><text x="212" y="150" fontFamily="SF Pro Display,Inter" fontSize="14" fontWeight="600" fill="#1d1d1f">30: 50%</text></g>
        <g className="sv-step" style={{["--d"]:"1.7s"}}><circle cx="330" cy="240" r="7" fill="#A8806A" stroke="#fff" strokeWidth="3"/><text x="300" y="228" fontFamily="SF Pro Display,Inter" fontSize="14" fontWeight="600" fill="#1d1d1f">60: 10%</text></g>
      </svg>
    );
    case "comparison": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="Porównanie">
        <g className="sv-fade-l" opacity="0.45"><line x1="110" y1="90" x2="110" y2="220" stroke="#9A8E85" strokeWidth="6" strokeLinecap="round"/><circle cx="110" cy="80" r="14" fill="none" stroke="#9A8E85" strokeWidth="4"/><text x="110" y="250" textAnchor="middle" fontFamily="Inter" fontSize="22" fill="#9A8E85">$10k</text></g>
        <g className="sv-float"><rect x="280" y="130" width="120" height="64" rx="32" fill="url(#sv-patch)"/><text x="340" y="250" textAnchor="middle" fontFamily="Inter" fontSize="22" fontWeight="600" fill="#A8806A">X39</text></g>
        <text x="240" y="165" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="26" fill="#C9A38A">vs</text>
      </svg>
    );
    case "reverseclock": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="Odwracanie zegara">
        <g className="sv-fade-l" opacity="0.5"><path d="M 110,130 q 20,-20 40,0 q 20,20 0,40 q -20,20 -40,0 q -20,-20 0,-40 Z" fill="none" stroke="#9A8E85" strokeWidth="2"/></g>
        <path className="sv-draw" d="M 180,160 L 290,160 M 280,150 L 290,160 L 280,170" stroke="#C9A38A" strokeWidth="3" fill="none"/>
        <circle className="sv-pulse" cx="350" cy="160" r="34" fill="url(#sv-core)"/><circle cx="350" cy="160" r="20" fill="#E8C5A8" stroke="#fff" strokeWidth="2"/>
      </svg>
    );
    case "timeline": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="Timeline">
        <line x1="80" y1="160" x2="400" y2="160" stroke="#C9A38A" strokeWidth="2" opacity="0.4"/>
        {["1-30d","1-3m","6m"].map((lbl,i) => (
          <g key={i} className="sv-step" style={{["--d"]: i*0.3 + "s"}} transform={`translate(${100 + i*140},160)`}>
            <circle r="34" fill="#fff" stroke="#C9A38A" strokeWidth="2"/><text y="6" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="16" fontWeight="600" fill="#A8806A">{lbl}</text>
          </g>
        ))}
      </svg>
    );
    case "science": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="Dowody naukowe">
        {[["100+",90],["80+",240],["0",390]].map(([n,x],i) => (
          <g key={i} className="sv-step" style={{["--d"]: i*0.2 + "s"}} transform={`translate(${x},160)`}>
            <circle r="46" fill="rgba(232,197,168,0.14)" stroke="#C9A38A" strokeWidth="2"/><text y="10" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="28" fontWeight="600" fill="#A8806A">{n}</text>
          </g>
        ))}
      </svg>
    );
    case "howto": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="Jak stosować">
        {[1,2,3,4].map((n,i) => (
          <g key={i} className="sv-step" style={{["--d"]: i*0.15 + "s"}} transform={`translate(${60 + i*100},130)`}>
            <rect x="0" y="0" width="60" height="60" rx="16" fill="rgba(232,197,168,0.14)" stroke="#C9A38A" strokeWidth="1.5"/><text x="30" y="40" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="26" fontWeight="600" fill="#A8806A">{n}</text>
          </g>
        ))}
      </svg>
    );
    case "guarantee": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="Gwarancja 90 dni">
        <g className="sv-float"><path d="M 240,90 L 180,116 v 50 q 0,55 60,72 q 60,-17 60,-72 v -50 Z" fill="url(#sv-patch)" stroke="rgba(168,128,106,0.4)"/><path d="M 218,160 l 16,16 30,-34" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></g>
        <text x="240" y="270" textAnchor="middle" fontFamily="SF Pro Display,Inter" fontSize="30" fontWeight="600" fill="#A8806A">90 dni</text>
      </svg>
    );
    case "cta": return (
      <svg className={cls} viewBox="0 0 480 320" role="img" aria-label="Twój start">
        <g className="sv-rays"><circle cx="240" cy="170" r="60" fill="url(#sv-core)" opacity="0.7"/>{[0,30,60,90,120,150,180,210,240,270,300,330].map(a => <line key={a} x1="240" y1="170" x2={240 + 100*Math.cos(a*Math.PI/180)} y2={170 + 100*Math.sin(a*Math.PI/180)} stroke="#E8C5A8" strokeWidth="2" opacity="0.5"/>)}</g>
        <path className="sv-float" d="M 240,110 q 28,0 28,40 q 0,50 -28,70 q -28,-20 -28,-70 q 0,-40 28,-40 Z" fill="#E8C5A8" stroke="#A8806A"/>
      </svg>
    );
    default: return <svg className={cls} viewBox="0 0 480 320"><circle cx="240" cy="160" r="40" fill="#E8C5A8"/></svg>;
  }
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

  const go = useCallbackP((n) => setIdx((cur) => Math.max(0, Math.min(total - 1, n))), [total]);
  const next = useCallbackP(() => setIdx((c) => (c >= total - 1 ? c : c + 1)), [total]);
  const prev = useCallbackP(() => setIdx((c) => (c <= 0 ? 0 : c - 1)), []);

  // Keyboard
  useEffectP(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, total]);

  // Autoplay
  useEffectP(() => {
    if (!auto) { if (autoRef.current) clearTimeout(autoRef.current); return; }
    if (idx >= total - 1) { setAuto(false); return; }
    autoRef.current = setTimeout(() => setIdx((c) => c + 1), 6500);
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
      {/* progress bar */}
      <div className="x-deck__progress"><div className="x-deck__progress-fill" style={{ width: ((idx + 1) / total * 100) + "%" }}/></div>

      {/* top bar */}
      <div className="x-deck__top">
        <a href="index.html" className="x-deck__brand"><span className="x-nav-global__dot" aria-hidden="true"></span> X39</a>
        <div className="x-deck__top-right">
          <DeckLang/>
          <span className="x-deck__counter">{t.deck.slideOf} {idx + 1} / {total}</span>
          <a href="index.html" className="x-deck__close" aria-label={t.deck.close}>✕</a>
        </div>
      </div>

      {/* slides */}
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* controls */}
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
