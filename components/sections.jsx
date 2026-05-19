/* global React, COPY, AppCtx, useApp, useReveal */
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

/* ------------------------------------------------------------------
   1. BodyBatterySection — 3 step explanation (Twoje ciało jest baterią)
   ------------------------------------------------------------------ */
function BodyBatterySection() {
  const { t } = useApp();
  const ref = useReveal();
  return (
    <section ref={ref} className="x-section" id="science">
      <div className="x-container x-reveal">
        <div className="x-section__head x-section__head--center">
          <span className="x-eyebrow">{t.body.eyebrow}</span>
          <h2 className="x-section__title">{t.body.title.split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</h2>
          <p className="x-section__sub">{t.body.subtitle}</p>
        </div>
        <div className="x-steps">
          {t.body.steps.map((s, i) => (
            <React.Fragment key={i}>
              <article className="x-step">
                <div className="x-step__num">{s.n}</div>
                <h3 className="x-step__title">{s.t}</h3>
                <p className="x-step__desc">{s.d}</p>
              </article>
              {i < t.body.steps.length - 1 && <div className="x-steps__arrow" aria-hidden="true">→</div>}
            </React.Fragment>
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
   2. PeptideSection — GHK-Cu + 4200 genes counter + 5 benefits
   ------------------------------------------------------------------ */
function PeptideSection() {
  const { t } = useApp();
  const ref = useReveal();
  const [count, setCount] = useStateS(0);
  const target = parseInt(t.peptide.reset.replace(/[^0-9]/g, ""), 10) || 4200;
  const counterRef = useRefS(null);

  useEffectS(() => {
    if (!counterRef.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          // animate from 0 to target
          const dur = 1800;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
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

  // Format count tak żeby z PL/EN/DE separators
  const fmt = (n) => {
    const { locale } = useApp();
    return new Intl.NumberFormat(locale === "en" ? "en-US" : locale === "de" ? "de-DE" : "pl-PL").format(n);
  };

  return (
    <section ref={ref} className="x-section x-section--soft">
      <div className="x-container x-reveal">
        <div className="x-grid-2 x-grid-2--align-start">
          <div className="x-peptide__copy">
            <span className="x-eyebrow">{t.peptide.eyebrow}</span>
            <h2 className="x-section__title">{t.peptide.title.split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</h2>
            <p className="x-section__sub">{t.peptide.subtitle}</p>
            <div ref={counterRef} className="x-peptide__counter">
              <span className="x-peptide__num">{fmt(count)}</span>
              <span className="x-peptide__label">{t.peptide.resetLabel}</span>
            </div>
            <p className="x-source">{t.peptide.source}</p>
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
                  <h3 className="x-benefit__title">{b.t}</h3>
                  <p className="x-benefit__desc">{b.d}</p>
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
   3. AgeSection — animated decay curve (30→50%, 60→10-20%)
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
    <section ref={ref} className="x-section">
      <div className="x-container x-reveal">
        <div className="x-section__head x-section__head--center">
          <span className="x-eyebrow">{t.age.eyebrow}</span>
          <h2 className="x-section__title">{t.age.title.split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</h2>
          <p className="x-section__sub">{t.age.subtitle}</p>
        </div>
        <div ref={svgRef} className="x-age-chart">
          <svg viewBox="0 0 800 400" className={drawn ? "is-drawn" : ""}>
            <defs>
              <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E8C5A8"/>
                <stop offset="50%" stopColor="#C9A38A"/>
                <stop offset="100%" stopColor="#A8806A"/>
              </linearGradient>
              <linearGradient id="fillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C9A38A" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#C9A38A" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* axes */}
            <g className="x-age-axes" stroke="#E0DDD8" strokeWidth="1">
              <line x1="80" y1="350" x2="760" y2="350"/>
              <line x1="80" y1="50" x2="80" y2="350"/>
            </g>
            {/* horizontal gridlines */}
            {[0, 25, 50, 75, 100].map((v, i) => (
              <g key={i}>
                <line x1="80" y1={350 - v * 3} x2="760" y2={350 - v * 3} stroke="#F0EDE8" strokeWidth="1"/>
                <text x="65" y={355 - v * 3} textAnchor="end" fontSize="11" fill="#9A9A9A">{v}%</text>
              </g>
            ))}
            {/* x-labels */}
            {[0, 20, 30, 40, 50, 60, 80].map((a, i) => (
              <text key={i} x={80 + (a / 80) * 680} y="372" textAnchor="middle" fontSize="11" fill="#9A9A9A">{a}</text>
            ))}
            {/* decay curve (path: starts top-left, S-curve down) */}
            <path
              className="x-age-curve"
              d="M 80,50 Q 230,55 305,200 T 530,320 T 760,335"
              fill="none"
              stroke="url(#curveGrad)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              className="x-age-fill"
              d="M 80,50 Q 230,55 305,200 T 530,320 T 760,335 L 760,350 L 80,350 Z"
              fill="url(#fillGrad)"
            />
            {/* points 30 / 60 */}
            <g className="x-age-point" transform={`translate(${80 + (30 / 80) * 680},${350 - 50 * 3})`}>
              <circle r="8" fill="#C9A38A" stroke="white" strokeWidth="3"/>
              <text x="14" y="-12" fontSize="13" fontWeight="600" fill="#1A1A1A">{t.age.points[0].age}: {t.age.points[0].drop}</text>
            </g>
            <g className="x-age-point" transform={`translate(${80 + (60 / 80) * 680},${350 - 15 * 3})`}>
              <circle r="8" fill="#A8806A" stroke="white" strokeWidth="3"/>
              <text x="14" y="-12" fontSize="13" fontWeight="600" fill="#1A1A1A">{t.age.points[1].age}: {t.age.points[1].drop}</text>
            </g>
          </svg>
        </div>
        <div className="x-age-points">
          {t.age.points.map((p, i) => (
            <div key={i} className="x-age-pt-card">
              <div className="x-age-pt-card__age">{p.age}</div>
              <div className="x-age-pt-card__drop">{p.drop}</div>
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
   4. CompareSection — X39 vs iniekcje
   ------------------------------------------------------------------ */
function CompareSection() {
  const { t } = useApp();
  const ref = useReveal();
  return (
    <section ref={ref} className="x-section x-section--dark">
      <div className="x-container x-reveal">
        <div className="x-section__head x-section__head--center">
          <span className="x-eyebrow">{t.compare.eyebrow}</span>
          <h2 className="x-section__title x-section__title--light">{t.compare.title.split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</h2>
          <p className="x-section__sub x-section__sub--light">{t.compare.subtitle}</p>
        </div>
        <div className="x-compare">
          {t.compare.cols.map((c, i) => (
            <div key={i} className={"x-compare__col" + (c.highlight ? " is-highlight" : "")}>
              <span className="x-compare__tag">{c.tag}</span>
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
   5. AuthoritySection — Dr VerHulst YT embed + 3 bullets
   ------------------------------------------------------------------ */
function AuthoritySection() {
  const { t } = useApp();
  const ref = useReveal();
  const [loaded, setLoaded] = useStateS(false);
  const ytId = t.authority.ytId;

  return (
    <section ref={ref} className="x-section" id="proof">
      <div className="x-container x-reveal">
        <div className="x-section__head x-section__head--center">
          <span className="x-eyebrow">{t.authority.eyebrow}</span>
          <h2 className="x-section__title">{t.authority.title.split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</h2>
          <p className="x-section__sub">{t.authority.subtitle}</p>
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
        <div className="x-grid-3 x-auth-bullets">
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
   6. TimelineSection — 1-30d / 1-3mc / 6mc
   ------------------------------------------------------------------ */
function TimelineSection() {
  const { t } = useApp();
  const ref = useReveal();
  return (
    <section ref={ref} className="x-section x-section--soft">
      <div className="x-container x-reveal">
        <div className="x-section__head x-section__head--center">
          <span className="x-eyebrow">{t.timeline.eyebrow}</span>
          <h2 className="x-section__title">{t.timeline.title.split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</h2>
          <p className="x-section__sub">{t.timeline.subtitle}</p>
        </div>
        <div className="x-timeline">
          {t.timeline.items.map((it, i) => (
            <div key={i} className="x-timeline__item">
              <div className="x-timeline__dot">
                <span>{it.time.split(" ")[0]}</span>
                <small>{it.time.split(" ").slice(1).join(" ")}</small>
              </div>
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
   7. HowSection — 4 steps (Apply / Wear / Remove / Repeat)
   ------------------------------------------------------------------ */
function HowSection() {
  const { t } = useApp();
  const ref = useReveal();
  return (
    <section ref={ref} className="x-section" id="product">
      <div className="x-container x-reveal">
        <div className="x-section__head x-section__head--center">
          <span className="x-eyebrow">{t.how.eyebrow}</span>
          <h2 className="x-section__title">{t.how.title.split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</h2>
          <p className="x-section__sub">{t.how.subtitle}</p>
        </div>
        <div className="x-how">
          {t.how.steps.map((s, i) => (
            <article key={i} className="x-how__step">
              <div className="x-how__num">{s.n}</div>
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
   8. ScienceSection — 3 cards (Patents/Studies/Side effects)
   ------------------------------------------------------------------ */
function ScienceSection() {
  const { t } = useApp();
  const ref = useReveal();
  return (
    <section ref={ref} className="x-section x-section--soft">
      <div className="x-container x-reveal">
        <div className="x-section__head x-section__head--center">
          <span className="x-eyebrow">{t.science.eyebrow}</span>
          <h2 className="x-section__title">{t.science.title.split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</h2>
        </div>
        <div className="x-grid-3 x-science">
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
   9. GuaranteeSection — 90-day shield + main CTA "Kup w LifeWave"
   ------------------------------------------------------------------ */
function GuaranteeSection() {
  const { t } = useApp();
  const ref = useReveal();
  const buyLink = (window.X39_CONFIG && window.X39_CONFIG.links.buy) || "#contact";
  return (
    <section ref={ref} className="x-section x-cta-section" id="buy">
      <div className="x-container x-reveal x-cta-section__inner">
        <div className="x-guarantee">
          <div className="x-guarantee__shield" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              <path d="M9.5 12.5l2 2 4-4" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="x-eyebrow">{t.guarantee.eyebrow}</span>
          <h2 className="x-section__title">{t.guarantee.title.split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</h2>
          <p className="x-section__sub">{t.guarantee.subtitle}</p>
          <div className="x-cta-actions">
            <a
              href={buyLink}
              target={buyLink.startsWith("http") ? "_blank" : "_self"}
              rel={buyLink.startsWith("http") ? "noopener" : undefined}
              className="x-btn x-btn--primary x-btn--lg"
            >{t.guarantee.cta}</a>
          </div>
          <p className="x-cta-sub">{t.guarantee.sub}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   10. TeamSection — 4 reasons + top leaders grid + TidyCal CTA
   ------------------------------------------------------------------ */
function TeamSection() {
  const { t } = useApp();
  const ref = useReveal();
  const tidycal = (window.X39_CONFIG && window.X39_CONFIG.links.tidycal) || "#contact";
  return (
    <section ref={ref} className="x-section x-section--dark" id="team">
      <div className="x-container x-reveal">
        <div className="x-section__head x-section__head--center">
          <span className="x-eyebrow">{t.team.eyebrow}</span>
          <h2 className="x-section__title x-section__title--light">{t.team.title.split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</h2>
          <p className="x-section__sub x-section__sub--light">{t.team.subtitle}</p>
        </div>
        <div className="x-grid-2 x-team-reasons">
          {t.team.reasons.map((r, i) => (
            <div key={i} className="x-team-card">
              <div className="x-team-card__num">{String(i + 1).padStart(2, "0")}</div>
              <h3>{r.t}</h3>
              <p>{r.d}</p>
            </div>
          ))}
        </div>
        <div className="x-team-leaders">
          <h3 className="x-team-leaders__title">{t.team.leaders.title}</h3>
          <p className="x-team-leaders__sub">{t.team.leaders.sub}</p>
          <div className="x-leaders-grid">
            {t.team.leaders.items.map((l, i) => (
              <div key={i} className={"x-leader" + (i === t.team.leaders.items.length - 1 ? " is-you" : "")}>
                <span className="x-leader__rank">{l.rank}</span>
                <span className="x-leader__name">{l.name}</span>
                <span className="x-leader__note">{l.note}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="x-cta-actions x-cta-actions--center">
          <a
            href={tidycal}
            target={tidycal.startsWith("http") ? "_blank" : "_self"}
            rel={tidycal.startsWith("http") ? "noopener" : undefined}
            className="x-btn x-btn--primary x-btn--lg"
          >{t.team.cta}</a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   11. FaqSection — 8 details accordions
   ------------------------------------------------------------------ */
function FaqSection() {
  const { t } = useApp();
  const ref = useReveal();
  return (
    <section ref={ref} className="x-section" id="faq">
      <div className="x-container x-reveal">
        <div className="x-section__head x-section__head--center">
          <span className="x-eyebrow">{t.faq.eyebrow}</span>
          <h2 className="x-section__title">{t.faq.title.split("\n").map((l,i) => <span key={i}>{l}<br/></span>)}</h2>
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
   12. ContactSection — final CTA + 2 buttons (TidyCal + form)
   ------------------------------------------------------------------ */
function ContactSection() {
  const { t } = useApp();
  const ref = useReveal();
  const tidycal = (window.X39_CONFIG && window.X39_CONFIG.links.tidycal) || "mailto:muszynski.online@gmail.com";
  return (
    <section ref={ref} className="x-section x-cta-section" id="contact">
      <div className="x-container x-reveal x-cta-section__inner">
        <span className="x-eyebrow">{t.contact.eyebrow}</span>
        <h2 className="x-section__title">{t.contact.title}</h2>
        <p className="x-section__sub">{t.contact.subtitle}</p>
        <div className="x-cta-actions x-cta-actions--center">
          <a href={tidycal} target={tidycal.startsWith("http") ? "_blank" : "_self"} className="x-btn x-btn--primary x-btn--lg">{t.contact.cta1}</a>
          <a href="mailto:muszynski.online@gmail.com" className="x-btn x-btn--ghost x-btn--lg">{t.contact.cta2}</a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   13. Footer
   ------------------------------------------------------------------ */
function Footer() {
  const { t } = useApp();
  return (
    <footer className="x-footer">
      <div className="x-container">
        <div className="x-footer__grid">
          <div className="x-footer__brand-col">
            <div className="x-footer__brand">{t.footer.brand}</div>
            <p className="x-footer__tagline">{t.footer.tagline}</p>
          </div>
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
          <p><strong>·</strong> {t.footer.disclaimerMed}</p>
          <p><strong>·</strong> {t.footer.disclaimerMlm}</p>
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
