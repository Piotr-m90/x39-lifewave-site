/* global React, COPY, AppCtx, useApp, useReveal */
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

/* Helper — split title by \n into spans */
function Title({ tag = "h2", className = "x-display-lg", children }) {
  const Tag = tag;
  const parts = String(children).split("\n");
  return <Tag className={className}>{parts.map((l, i) => <span key={i}>{l}{i < parts.length - 1 && <br/>}</span>)}</Tag>;
}

/* ------------------------------------------------------------------
   1. BodyBatterySection — DARK tile · 3 step explanation
   "Your body is a battery."
   ------------------------------------------------------------------ */
function BodyBatterySection() {
  const { t } = useApp();
  const ref = useReveal();
  return (
    <section ref={ref} className="x-tile x-tile--dark" id="science">
      <div className="x-tile__inner x-reveal">
        <div className="x-tile__head">
          <Title tag="h2" className="x-display-lg">{t.body.title}</Title>
          <p className="x-lead">{t.body.subtitle}</p>
        </div>
        <div className="x-steps">
          {t.body.steps.map((s, i) => (
            <article key={i} className="x-step">
              <div className="x-step__num">{s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </article>
          ))}
        </div>
        <figure className="x-quote">
          <blockquote>{t.body.quote.p}</blockquote>
          <figcaption>— {t.body.quote.c}</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   2. PeptideSection — LIGHT (parchment) · 4200 genes counter
   ------------------------------------------------------------------ */
function PeptideSection() {
  const { t, locale } = useApp();
  const ref = useReveal();
  const [count, setCount] = useStateS(0);
  const target = parseInt(t.peptide.reset.replace(/[^0-9]/g, ""), 10) || 4200;
  const counterRef = useRefS(null);

  useEffectS(() => {
    if (!counterRef.current) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const dur = 1800;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(counterRef.current);
    return () => io.disconnect();
  }, [target]);

  const fmt = (n) => new Intl.NumberFormat(locale === "en" ? "en-US" : locale === "de" ? "de-DE" : "pl-PL").format(n);

  return (
    <section ref={ref} className="x-tile x-tile--parchment">
      <div className="x-tile__inner x-reveal">
        <div className="x-tile__head">
          <Title tag="h2" className="x-display-lg">{t.peptide.title}</Title>
          <p className="x-lead">{t.peptide.subtitle}</p>
        </div>
        <div className="x-peptide">
          <div ref={counterRef}>
            <div className="x-peptide__counter">{fmt(count)}</div>
            <p className="x-peptide__counter-label">{t.peptide.resetLabel}</p>
            <p className="x-peptide__source">{t.peptide.source}</p>
          </div>
          <ul className="x-benefits">
            {t.peptide.benefits.map((b, i) => (
              <li key={i} className="x-benefit">
                <div className="x-benefit__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {i === 0 && <path d="M12 21s-7-4.5-7-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-7 11-7 11z"/>}
                    {i === 1 && <><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 10v6m11-11h-6M7 12H1"/></>}
                    {i === 2 && <path d="M12 2L4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-5z"/>}
                    {i === 3 && <><path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v15A2.5 2.5 0 0 0 9.5 22h5a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 14.5 2z"/><circle cx="12" cy="12" r="2"/></>}
                    {i === 4 && <><path d="M4 12c0-4 4-8 8-8s8 4 8 8-4 8-8 8-8-4-8-8z"/><path d="M8 12h8M12 8v8"/></>}
                  </svg>
                </div>
                <div>
                  <div className="x-benefit__title">{b.t}</div>
                  <div className="x-benefit__desc">{b.d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   3. AgeSection — LIGHT tile · animated decay curve
   ------------------------------------------------------------------ */
function AgeSection() {
  const { t } = useApp();
  const ref = useReveal();
  const svgRef = useRefS(null);
  const [drawn, setDrawn] = useStateS(false);

  useEffectS(() => {
    if (!svgRef.current) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { setDrawn(true); io.disconnect(); } });
    }, { threshold: 0.3 });
    io.observe(svgRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="x-tile x-tile--light">
      <div className="x-tile__inner x-reveal">
        <div className="x-tile__head">
          <Title tag="h2" className="x-display-lg">{t.age.title}</Title>
          <p className="x-lead">{t.age.subtitle}</p>
        </div>
        <div ref={svgRef} className="x-age-chart">
          <svg viewBox="0 0 800 380" className={drawn ? "is-drawn" : ""} role="img" aria-label="Stem cell decay curve">
            <defs>
              <linearGradient id="ageCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E8C5A8"/>
                <stop offset="100%" stopColor="#A8806A"/>
              </linearGradient>
              <linearGradient id="ageFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C9A38A" stopOpacity="0.18"/>
                <stop offset="100%" stopColor="#C9A38A" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <g stroke="#e0e0e0" strokeWidth="1">
              <line x1="60" y1="330" x2="760" y2="330"/>
              <line x1="60" y1="50" x2="60" y2="330"/>
            </g>
            {[0, 25, 50, 75, 100].map((v, i) => (
              <g key={i}>
                <line x1="60" y1={330 - v * 2.6} x2="760" y2={330 - v * 2.6} stroke="#f5f5f7"/>
                <text x="48" y={334 - v * 2.6} textAnchor="end" fontSize="11" fontFamily="SF Pro Text, Inter, sans-serif" fill="#7a7a7a">{v}%</text>
              </g>
            ))}
            {[0, 20, 30, 40, 50, 60, 80].map((a, i) => (
              <text key={i} x={60 + (a / 80) * 700} y="352" textAnchor="middle"
                    fontSize="11" fontFamily="SF Pro Text, Inter, sans-serif" fill="#7a7a7a">{a}</text>
            ))}
            <path
              className="x-age-curve"
              d="M 60,50 Q 220,55 290,190 T 510,300 T 760,318"
              fill="none"
              stroke="url(#ageCurveGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              className="x-age-fill"
              d="M 60,50 Q 220,55 290,190 T 510,300 T 760,318 L 760,330 L 60,330 Z"
              fill="url(#ageFillGrad)"
            />
            <g className="x-age-point" transform={`translate(${60 + (30 / 80) * 700},${330 - 50 * 2.6})`}>
              <circle r="6" fill="#C9A38A" stroke="white" strokeWidth="3"/>
              <text x="14" y="-12" fontFamily="SF Pro Display, Inter, sans-serif" fontSize="13" fontWeight="600" letterSpacing="-0.01em" fill="#1d1d1f">
                {t.age.points[0].age}: {t.age.points[0].drop}
              </text>
            </g>
            <g className="x-age-point" transform={`translate(${60 + (60 / 80) * 700},${330 - 15 * 2.6})`}>
              <circle r="6" fill="#A8806A" stroke="white" strokeWidth="3"/>
              <text x="14" y="-12" fontFamily="SF Pro Display, Inter, sans-serif" fontSize="13" fontWeight="600" letterSpacing="-0.01em" fill="#1d1d1f">
                {t.age.points[1].age}: {t.age.points[1].drop}
              </text>
            </g>
          </svg>
        </div>
        <div className="x-age-points">
          {t.age.points.map((p, i) => (
            <div key={i} className="x-age-point-card">
              <div className="x-age-point-card__age">{p.age}</div>
              <div className="x-age-point-card__drop">{p.drop}</div>
              <p>{p.label}</p>
            </div>
          ))}
        </div>
        <p className="x-age-x39-line">{t.age.x39Line}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   4. CompareSection — DARK tile · two columns
   ------------------------------------------------------------------ */
function CompareSection() {
  const { t } = useApp();
  const ref = useReveal();
  return (
    <section ref={ref} className="x-tile x-tile--dark-2">
      <div className="x-tile__inner x-reveal">
        <div className="x-tile__head">
          <Title tag="h2" className="x-display-lg">{t.compare.title}</Title>
          <p className="x-lead">{t.compare.subtitle}</p>
        </div>
        <div className="x-compare">
          {t.compare.cols.map((c, i) => (
            <div key={i} className={"x-compare__col" + (c.highlight ? " is-x39" : "")}>
              <div className="x-compare__tag">{c.tag}</div>
              <h3 className="x-compare__title">{c.title}</h3>
              <ul className="x-compare__list">
                {c.items.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   5. AuthoritySection — LIGHT tile · Dr VerHulst YT
   ------------------------------------------------------------------ */
function AuthoritySection() {
  const { t } = useApp();
  const ref = useReveal();
  const [loaded, setLoaded] = useStateS(false);
  const ytId = t.authority.ytId;
  return (
    <section ref={ref} className="x-tile x-tile--light" id="proof">
      <div className="x-tile__inner x-reveal">
        <div className="x-tile__head">
          <Title tag="h2" className="x-display-lg">{t.authority.title}</Title>
          <p className="x-lead">{t.authority.subtitle}</p>
        </div>
        <div
          className="x-video"
          onClick={() => setLoaded(true)}
          role="button"
          tabIndex={0}
          aria-label={t.authority.ytTitle}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setLoaded(true); }}
        >
          {!loaded ? (
            <>
              <img
                src={`https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`}
                alt={t.authority.ytTitle}
                className="x-video__thumb"
                loading="lazy"
              />
              <span className="x-video__play" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </span>
            </>
          ) : (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&cc_load_policy=1`}
              title={t.authority.ytTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: 0 }}
            />
          )}
        </div>
        <p className="x-video__caption">{t.authority.ytCaption}</p>
        <div className="x-auth-bullets">
          {t.authority.bullets.map((b, i) => (
            <div key={i} className="x-auth-card">
              <h4>{b.t}</h4>
              <p>{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   6. TimelineSection — PARCHMENT tile · 3 time markers
   ------------------------------------------------------------------ */
function TimelineSection() {
  const { t } = useApp();
  const ref = useReveal();
  return (
    <section ref={ref} className="x-tile x-tile--parchment">
      <div className="x-tile__inner x-reveal">
        <div className="x-tile__head">
          <Title tag="h2" className="x-display-lg">{t.timeline.title}</Title>
          <p className="x-lead">{t.timeline.subtitle}</p>
        </div>
        <div className="x-timeline">
          {t.timeline.items.map((it, i) => (
            <div key={i} className="x-timeline__item">
              <div className="x-timeline__time">{it.time}</div>
              <h4>{it.title}</h4>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   7. HowSection — LIGHT · 4 steps how to use
   ------------------------------------------------------------------ */
function HowSection() {
  const { t } = useApp();
  const ref = useReveal();
  return (
    <section ref={ref} className="x-tile x-tile--light" id="product">
      <div className="x-tile__inner x-reveal">
        <div className="x-tile__head">
          <Title tag="h2" className="x-display-lg">{t.how.title}</Title>
          <p className="x-lead">{t.how.subtitle}</p>
        </div>
        <div className="x-steps-4">
          {t.how.steps.map((s, i) => (
            <article key={i} className="x-step">
              <div className="x-step__num">{s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   8. ScienceSection — DARK-3 · 3 number cards
   ------------------------------------------------------------------ */
function ScienceSection() {
  const { t } = useApp();
  const ref = useReveal();
  return (
    <section ref={ref} className="x-tile x-tile--dark-3">
      <div className="x-tile__inner x-reveal">
        <div className="x-tile__head">
          <Title tag="h2" className="x-display-lg">{t.science.title}</Title>
        </div>
        <div className="x-science">
          {t.science.cards.map((c, i) => (
            <div key={i} className="x-science__card">
              <div className="x-science__num">{c.n}</div>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   9. GuaranteeSection — PARCHMENT · big CTA buy LifeWave
   ------------------------------------------------------------------ */
function GuaranteeSection() {
  const { t } = useApp();
  const ref = useReveal();
  const buyLink = (window.X39_CONFIG && window.X39_CONFIG.links.buy) || "#contact";
  return (
    <section ref={ref} className="x-tile x-tile--parchment" id="buy">
      <div className="x-tile__inner x-reveal">
        <div className="x-guarantee">
          <div className="x-guarantee__shield" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              <path d="M9.5 12.5l2 2 4-4" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <Title tag="h2" className="x-display-lg">{t.guarantee.title}</Title>
          <p className="x-lead">{t.guarantee.subtitle}</p>
          <div className="x-tile__ctas">
            <a
              href={buyLink}
              target={buyLink.startsWith("http") ? "_blank" : "_self"}
              rel={buyLink.startsWith("http") ? "noopener" : undefined}
              className="x-btn x-btn--primary"
            >{t.guarantee.cta}</a>
          </div>
          <p className="x-guarantee__sub">{t.guarantee.sub}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   10. TeamSection — DARK · 4 reasons + leaders grid + TidyCal CTA
   ------------------------------------------------------------------ */
function TeamSection() {
  const { t } = useApp();
  const ref = useReveal();
  const tidycal = (window.X39_CONFIG && window.X39_CONFIG.links.tidycal) || "#contact";
  return (
    <section ref={ref} className="x-tile x-tile--dark" id="team">
      <div className="x-tile__inner x-reveal">
        <div className="x-tile__head">
          <Title tag="h2" className="x-display-lg">{t.team.title}</Title>
          <p className="x-lead">{t.team.subtitle}</p>
        </div>
        <div className="x-team-reasons">
          {t.team.reasons.map((r, i) => (
            <div key={i} className="x-team-card">
              <div className="x-team-card__num">{String(i + 1).padStart(2, "0")}</div>
              <h3>{r.t}</h3>
              <p>{r.d}</p>
            </div>
          ))}
        </div>
        <div className="x-team-leaders">
          <div className="x-team-leaders__title">{t.team.leaders.title}</div>
          <div className="x-team-leaders__sub">{t.team.leaders.sub}</div>
          <div className="x-leaders">
            {t.team.leaders.items.map((l, i) => (
              <div key={i} className={"x-leader" + (i === t.team.leaders.items.length - 1 ? " is-you" : "")}>
                <span className="x-leader__rank">{l.rank}</span>
                <span className="x-leader__name">{l.name}</span>
                <span className="x-leader__note">{l.note}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="x-tile__ctas">
          <a
            href={tidycal}
            target={tidycal.startsWith("http") ? "_blank" : "_self"}
            rel={tidycal.startsWith("http") ? "noopener" : undefined}
            className="x-btn x-btn--primary"
          >{t.team.cta}</a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   11. FaqSection — LIGHT · 8 accordion
   ------------------------------------------------------------------ */
function FaqSection() {
  const { t } = useApp();
  const ref = useReveal();
  return (
    <section ref={ref} className="x-tile x-tile--light" id="faq">
      <div className="x-tile__inner x-reveal">
        <div className="x-tile__head">
          <Title tag="h2" className="x-display-lg">{t.faq.title}</Title>
        </div>
        <div className="x-faq">
          {t.faq.items.map((it, i) => (
            <details key={i} className="x-faq__item">
              <summary>{it.q}</summary>
              <p>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   12. ContactSection — PARCHMENT · final CTA
   ------------------------------------------------------------------ */
function ContactSection() {
  const { t } = useApp();
  const ref = useReveal();
  const tidycal = (window.X39_CONFIG && window.X39_CONFIG.links.tidycal) || "mailto:muszynski.online@gmail.com";
  return (
    <section ref={ref} className="x-tile x-tile--parchment" id="contact">
      <div className="x-tile__inner x-reveal">
        <div className="x-tile__head">
          <Title tag="h2" className="x-display-lg">{t.contact.title}</Title>
          <p className="x-lead">{t.contact.subtitle}</p>
        </div>
        <div className="x-tile__ctas">
          <a href={tidycal} target={tidycal.startsWith("http") ? "_blank" : "_self"} rel={tidycal.startsWith("http") ? "noopener" : undefined} className="x-btn x-btn--primary">{t.contact.cta1}</a>
          <a href="mailto:muszynski.online@gmail.com" className="x-btn x-btn--ghost">{t.contact.cta2}</a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   13. Footer — parchment, dense link columns
   ------------------------------------------------------------------ */
function Footer() {
  const { t } = useApp();
  return (
    <footer className="x-footer">
      <div className="x-footer__inner">
        <div className="x-footer__brand-row">{t.footer.brand}</div>
        <p className="x-footer__tagline">{t.footer.tagline}</p>
        <div className="x-footer__grid">
          {t.footer.cols.map((col, i) => (
            <div key={i} className="x-footer__col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map(([label, href], j) => (
                  <li key={j}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="x-footer__disclaimer">
          <p>{t.footer.disclaimerMed}</p>
          <p>{t.footer.disclaimerMlm}</p>
        </div>
        <div className="x-footer__bottom">
          <div>{t.footer.legal}</div>
          <div><a href="https://muszynski.online" target="_blank" rel="noopener">muszynski.online</a></div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  BodyBatterySection, PeptideSection, AgeSection, CompareSection,
  AuthoritySection, TimelineSection, HowSection, ScienceSection,
  GuaranteeSection, TeamSection, FaqSection, ContactSection, Footer
});
