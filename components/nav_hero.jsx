/* global React, COPY, AppCtx, useApp, useReveal */
const { useState: useStateNH, useEffect: useEffectNH, useRef: useRefNH, useMemo: useMemoNH } = React;

/* ------------------------------------------------------------------
   LangPicker — 3 jezyki, accessible, persists locale w localStorage
   ------------------------------------------------------------------ */
function LangPicker() {
  const { locale, setLocale } = useApp();
  const langs = [
    { code: "pl", label: "PL" },
    { code: "en", label: "EN" },
    { code: "de", label: "DE" },
  ];
  return (
    <div className="x-lang" role="tablist" aria-label="Language">
      {langs.map(l => (
        <button
          key={l.code}
          role="tab"
          aria-selected={locale === l.code}
          className={"x-lang__btn" + (locale === l.code ? " is-active" : "")}
          onClick={() => { setLocale(l.code); try { localStorage.setItem("x39_lang", l.code); } catch(e){} }}
        >{l.label}</button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Nav — sticky, light/dark adaptive po scroll
   ------------------------------------------------------------------ */
function Nav() {
  const { t } = useApp();
  const [scrolled, setScrolled] = useStateNH(false);
  const [open, setOpen] = useStateNH(false);

  useEffectNH(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { href: "#science", k: "science" },
    { href: "#product", k: "product" },
    { href: "#proof", k: "proof" },
    { href: "#team", k: "team" },
    { href: "#faq", k: "faq" },
  ];

  return (
    <nav className={"x-nav" + (scrolled ? " is-scrolled" : "") + (open ? " is-open" : "")} role="navigation">
      <div className="x-nav__inner">
        <a href="#top" className="x-nav__logo" aria-label="X39 — start">
          <span className="x-nav__dot" aria-hidden="true"></span>
          <span className="x-nav__brand">X39 <span className="x-nav__sub">· regeneracja</span></span>
        </a>
        <ul className="x-nav__links">
          {items.map(it => (
            <li key={it.k}><a href={it.href} onClick={() => setOpen(false)}>{t.nav[it.k]}</a></li>
          ))}
        </ul>
        <div className="x-nav__cta">
          <LangPicker/>
          <a href="#buy" className="x-btn x-btn--primary x-btn--sm">{t.nav.buy}</a>
          <button
            className="x-nav__toggle"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d={open ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------
   Hero — 3-scene scrollowany prezentacja
   Sceny: A = Światło, B = Plaster jak antena, C = Regeneracja
   Mechanika: progress 0→1 wraz ze scrollem przez hero,
              dla każdej sceny crossfade in/out + parallax patch
   ------------------------------------------------------------------ */
function Hero() {
  const { t, locale } = useApp();
  const wrapRef = useRefNH(null);
  const [progress, setProgress] = useStateNH(0); // 0..1 przez całą wysokość hero
  const reducedMotion = useMemoNH(() => {
    try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch(e) { return false; }
  }, []);

  useEffectNH(() => {
    if (reducedMotion) { setProgress(0.5); return; }
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // hero ma 240vh (3 scene × ~80vh). Wyliczamy progress 0..1
      const total = el.offsetHeight - vh;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  // 3 sceny — opacity przejścia
  // scena 0: 0.00-0.40 (peak 0.15)
  // scena 1: 0.30-0.70 (peak 0.50)
  // scena 2: 0.60-1.00 (peak 0.85)
  const opacityFor = (peak, width = 0.30) => {
    const d = Math.abs(progress - peak);
    return Math.max(0, 1 - d / width);
  };
  const scenes = [
    { peak: 0.15, key: "sceneA" },
    { peak: 0.50, key: "sceneB" },
    { peak: 0.85, key: "sceneC" },
  ];

  return (
    <section ref={wrapRef} className="x-hero" id="top">
      <div className="x-hero__sticky">
        {/* Background — holograficzny shimmer reagujący na progress */}
        <div className="x-hero__bg" aria-hidden="true">
          <div className="x-hero__shimmer" style={{
            transform: `translate(${-20 + progress * 40}%, ${-10 + progress * 20}%) rotate(${progress * 30}deg)`,
            opacity: 0.6 + progress * 0.4,
          }}/>
          <div className="x-hero__rays" style={{ opacity: 0.4 + progress * 0.6 }}/>
        </div>

        {/* Patch wizualnie — floating */}
        <div className="x-hero__patch-wrap" aria-hidden="true">
          <div className="x-hero__patch" style={{
            transform: `translateY(${-progress * 40}px) scale(${0.92 + progress * 0.12}) rotate(${(progress - 0.5) * 12}deg)`,
          }}>
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="patchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F4D9C2"/>
                  <stop offset="50%" stopColor="#E8C5A8"/>
                  <stop offset="100%" stopColor="#A8806A"/>
                </linearGradient>
                <radialGradient id="patchCore" cx="50%" cy="50%" r="40%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1"/>
                  <stop offset="60%" stopColor="#FFE8D5" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#C9A38A" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <rect x="20" y="40" width="360" height="120" rx="60" fill="url(#patchGrad)" stroke="#A8806A" strokeWidth="2"/>
              <rect x="30" y="50" width="340" height="100" rx="50" fill="#F8EDE0" stroke="rgba(255,255,255,0.6)"/>
              <ellipse cx="200" cy="100" rx="80" ry="40" fill="url(#patchCore)"/>
              {/* hex crystals */}
              {[0,1,2,3,4].map(i => (
                <polygon
                  key={i}
                  points="0,-8 7,-4 7,4 0,8 -7,4 -7,-4"
                  fill="rgba(255,255,255,0.7)"
                  stroke="#A8806A"
                  strokeWidth="0.8"
                  transform={`translate(${150 + i * 25}, 100)`}
                />
              ))}
            </svg>
            {/* Light beam from above */}
            <div className="x-hero__beam" style={{ opacity: opacityFor(0.15, 0.35) * 0.8 }}/>
          </div>
        </div>

        {/* 3 sceny tekstu — crossfade */}
        <div className="x-hero__copy-stack">
          {scenes.map((s, idx) => {
            const op = opacityFor(s.peak);
            const ty = (progress - s.peak) * 60;
            return (
              <div
                key={idx}
                className={"x-hero__copy" + (op > 0.6 ? " is-active" : "")}
                style={{
                  opacity: op,
                  transform: `translateY(${ty}px)`,
                  pointerEvents: op > 0.5 ? "auto" : "none",
                }}
              >
                <div className="x-hero__eyebrow">{t.hero.eyebrow}</div>
                <h1 className="x-hero__title">
                  <span className="x-hero__k">{t.hero[s.key].k}</span>
                  <span className="x-hero__v">{t.hero[s.key].v}</span>
                </h1>
                {idx === 2 && (
                  <>
                    <div className="x-hero__actions">
                      <a href="#buy" className="x-btn x-btn--primary x-btn--lg">{t.hero.cta}</a>
                      <a href="#team" className="x-btn x-btn--ghost x-btn--lg">{t.hero.ghost}</a>
                    </div>
                    <ul className="x-hero__trust">
                      {t.hero.trust.map((tt, i) => <li key={i}>{tt}</li>)}
                    </ul>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Scroll indicator (znika na końcu) */}
        <div className="x-hero__scroll" style={{ opacity: 1 - progress * 1.5 }}>
          <span>{t.hero.scroll}</span>
          <span className="x-hero__scroll-line" aria-hidden="true"></span>
        </div>

        {/* Progress dots — 3 sceny */}
        <div className="x-hero__dots" aria-hidden="true">
          {scenes.map((s, i) => (
            <span key={i} className={"x-hero__dot" + (opacityFor(s.peak) > 0.6 ? " is-active" : "")}/>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { LangPicker, Nav, Hero });
