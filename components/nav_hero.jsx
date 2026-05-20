/* global React, COPY, AppCtx, useApp, useReveal */
const { useState: useStateNH, useEffect: useEffectNH, useRef: useRefNH, useMemo: useMemoNH } = React;

/* ------------------------------------------------------------------
   LangPicker — PL/EN/DE in global nav right cluster
   ------------------------------------------------------------------ */
function LangPicker() {
  const { locale, setLocale } = useApp();
  const langs = ["pl", "en", "de"];
  return (
    <div className="x-lang" role="tablist" aria-label="Language">
      {langs.map(code => (
        <button
          key={code}
          role="tab"
          aria-selected={locale === code}
          className={"x-lang__btn" + (locale === code ? " is-active" : "")}
          onClick={() => { setLocale(code); try { localStorage.setItem("x39_lang", code); } catch(e){} }}
        >{code.toUpperCase()}</button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Global Nav — 44px true-black, sticky, Apple chassis
   ------------------------------------------------------------------ */
function GlobalNav() {
  const { t } = useApp();
  const [open, setOpen] = useStateNH(false);
  // Context-aware: on team page, anchor links should go to index.html; on home, team link goes to zespol.html
  const onTeamPage = useMemoNH(() => {
    try { return location.pathname.endsWith("zespol.html"); } catch(e) { return false; }
  }, []);
  const homeAnchor = (anchor) => onTeamPage ? "index.html" + anchor : anchor;
  const homeRoot = onTeamPage ? "index.html" : "#top";
  const teamHref = onTeamPage ? "#team-top" : "zespol.html";

  const items = [
    { href: homeAnchor("#science"), k: "science" },
    { href: homeAnchor("#product"), k: "product" },
    { href: homeAnchor("#proof"), k: "proof" },
    { href: teamHref, k: "team" },
    { href: homeAnchor("#faq"), k: "faq" },
  ];
  return (
    <nav className={"x-nav-global" + (open ? " is-open" : "")} aria-label="Main">
      <div className="x-nav-global__inner">
        <a href={homeRoot} className="x-nav-global__logo" aria-label="X39 home" onClick={() => setOpen(false)}>
          <span className="x-nav-global__dot" aria-hidden="true"></span>
          X39
        </a>
        <ul className="x-nav-global__links">
          {items.map(it => <li key={it.k}><a href={it.href} onClick={() => setOpen(false)}>{t.nav[it.k]}</a></li>)}
        </ul>
        <div className="x-nav-global__right">
          <LangPicker/>
          <button
            className="x-nav-global__toggle"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d={open ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------
   Sub-Nav — 52px frosted parchment, sticky under global nav
   Left: brand context · Right: inline links + persistent primary CTA
   ------------------------------------------------------------------ */
function SubNav() {
  const { t } = useApp();
  const buyLink = (window.X39_CONFIG && window.X39_CONFIG.links.buy) || "#buy";
  const tidycal = (window.X39_CONFIG && window.X39_CONFIG.links.tidycal) || "#rozmowa";
  const onTeamPage = useMemoNH(() => {
    try { return location.pathname.endsWith("zespol.html"); } catch(e) { return false; }
  }, []);

  if (onTeamPage) {
    // On team page — sub-nav focused on team navigation + book CTA
    return (
      <div className="x-nav-sub" role="navigation" aria-label="Section">
        <div className="x-nav-sub__inner">
          <a href="#team-top" className="x-nav-sub__brand">X39 · Zespół</a>
          <div className="x-nav-sub__links">
            <a href="#standard">{t.team.standardTitle?.split(" ").slice(0, 2).join(" ") || "Pakiet"}</a>
            <a href="#extra">Mój zespół</a>
            <a href="#leaders">Liderzy</a>
            <a href={tidycal.startsWith("http") ? tidycal : "#rozmowa"}
               target={tidycal.startsWith("http") ? "_blank" : "_self"}
               rel={tidycal.startsWith("http") ? "noopener" : undefined}
               className="x-btn x-btn--utility">{t.team.cta}</a>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="x-nav-sub" role="navigation" aria-label="Section">
      <div className="x-nav-sub__inner">
        <a href="#top" className="x-nav-sub__brand">X39 LifeWave</a>
        <div className="x-nav-sub__links">
          <a href="#science">{t.nav.science}</a>
          <a href="#proof">{t.nav.proof}</a>
          <a href="#faq">{t.nav.faq}</a>
          <a href={buyLink.startsWith("http") ? buyLink : "#buy"}
             target={buyLink.startsWith("http") ? "_blank" : "_self"}
             rel={buyLink.startsWith("http") ? "noopener" : undefined}
             className="x-btn x-btn--utility">{t.nav.buy}</a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Hero — Apple-style: single full-bleed tile on parchment
   headline → tagline → 2 pill CTAs → trust strip → product render
   ------------------------------------------------------------------ */
function Hero() {
  const { t } = useApp();
  const buyLink = (window.X39_CONFIG && window.X39_CONFIG.links.buy) || "#buy";
  return (
    <section className="x-hero" id="top">
      <div className="x-hero__inner">
        <h1 className="x-hero-display">
          {t.hero.sceneC.k.replace(/\.$/, "")}<span style={{color: "var(--x-accent-ink)"}}>.</span>{" "}
          <span style={{fontWeight: 400, letterSpacing: "0.196px"}}>{t.hero.sceneC.v}</span>
        </h1>
        <p className="x-lead x-hero__tagline">{t.hero.sceneA.v} {t.hero.sceneB.v}</p>
        <div className="x-hero__ctas">
          <a href={buyLink.startsWith("http") ? buyLink : "#buy"}
             target={buyLink.startsWith("http") ? "_blank" : "_self"}
             rel={buyLink.startsWith("http") ? "noopener" : undefined}
             className="x-btn x-btn--primary">{t.hero.cta}</a>
          <a href="#team" className="x-btn x-btn--ghost">{t.hero.ghost}</a>
        </div>
        <ul className="x-hero__trust">
          {t.hero.trust.map((tt, i) => <li key={i}>{tt}</li>)}
        </ul>
        <div className="x-hero__visual">
          <HeroPatchSVG/>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Hero patch SVG — clean Apple-product-render aesthetic
   ------------------------------------------------------------------ */
function HeroPatchSVG() {
  return (
    <svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="X39 patch">
      <defs>
        <linearGradient id="patchSurface" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4D9C2"/>
          <stop offset="35%" stopColor="#E8C5A8"/>
          <stop offset="70%" stopColor="#C9A38A"/>
          <stop offset="100%" stopColor="#A8806A"/>
        </linearGradient>
        <radialGradient id="patchCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95"/>
          <stop offset="50%" stopColor="#FFE8D5" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#C9A38A" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="patchRim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)"/>
          <stop offset="100%" stopColor="rgba(168,128,106,0.3)"/>
        </linearGradient>
      </defs>
      {/* Outer rim */}
      <rect x="40" y="80" width="680" height="220" rx="110" fill="url(#patchSurface)"/>
      <rect x="40" y="80" width="680" height="220" rx="110" fill="none" stroke="url(#patchRim)" strokeWidth="1.5"/>
      {/* Inner pad */}
      <rect x="60" y="100" width="640" height="180" rx="90" fill="#F8EDE0" opacity="0.92"/>
      {/* Core glow */}
      <ellipse cx="380" cy="190" rx="160" ry="80" fill="url(#patchCore)"/>
      {/* Crystal hex grid — each pulses with staggered delay */}
      {[-3,-2,-1,0,1,2,3].map(i => (
        <g key={i} className="x-hero-crystal" transform={`translate(${380 + i * 38},190)`}>
          <polygon
            points="0,-12 10,-6 10,6 0,12 -10,6 -10,-6"
            fill="rgba(255,255,255,0.65)"
            stroke="rgba(168,128,106,0.4)"
            strokeWidth="0.8"
          />
          <polygon
            points="0,-6 5,-3 5,3 0,6 -5,3 -5,-3"
            fill="rgba(232,197,168,0.55)"
          />
        </g>
      ))}
      {/* Brand mark X39 */}
      <text x="380" y="350" textAnchor="middle"
            fontFamily="SF Pro Display, Inter, sans-serif"
            fontSize="13" fontWeight="600"
            letterSpacing="2.5"
            fill="rgba(168,128,106,0.55)">X39</text>
    </svg>
  );
}

/* ------------------------------------------------------------------
   TeamHero — used on zespol.html, focused recruitment headline
   ------------------------------------------------------------------ */
function TeamHero() {
  const { t } = useApp();
  const tidycal = (window.X39_CONFIG && window.X39_CONFIG.links.tidycal) || "#rozmowa";
  const h = t.teamHero || {
    eyebrow: "Biznes z polecania", title: "Dołącz do zespołu\nregeneracji.",
    sub: "Selekcja, nie obietnica.", cta: "Umów rozmowę", ghost: "Zobacz produkt"
  };
  return (
    <section className="x-hero x-hero--team" id="team-top">
      <div className="x-hero__inner">
        <div className="x-team-hero__breadcrumb">
          <a href="index.html" className="x-tlink">{t.nav.backHome}</a>
        </div>
        <span className="x-hero__eyebrow" style={{display: "inline-block", marginBottom: 16}}>{h.eyebrow}</span>
        <h1 className="x-hero-display">
          {h.title.split("\n").map((l, i) => <span key={i} style={{display: "block"}}>{l}</span>)}
        </h1>
        <p className="x-lead x-hero__tagline">{h.sub}</p>
        <div className="x-hero__ctas">
          <a href={tidycal.startsWith("http") ? tidycal : "#rozmowa"}
             target={tidycal.startsWith("http") ? "_blank" : "_self"}
             rel={tidycal.startsWith("http") ? "noopener" : undefined}
             className="x-btn x-btn--primary">{h.cta}</a>
          <a href="index.html" className="x-btn x-btn--ghost">{h.ghost}</a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { LangPicker, GlobalNav, SubNav, Hero, TeamHero });
