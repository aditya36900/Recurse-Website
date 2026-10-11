"use client";

import Image from "next/image";
import { useSiteInteractions } from "./useSiteInteractions";
import { articles } from "./articleData";

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RecurseWrites() {
  useSiteInteractions();

  return (
    <div className="writes-page" id="top">
      <a className="skip-link" href="#writes-content">Skip to content</a>

      <header className="site-header" data-header>
        <a className="brand" href="/#top" aria-label="Recurse home">
          <span className="brand__logo brand__logo--dark" aria-hidden="true">
            <Image
              src="/recurse-logo-white.png"
              alt=""
              width={464}
              height={135}
              priority
            />
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="/#about">About</a>
          <a href="/#events">Events</a>
          <a href="/opportunities">Opportunities</a>
          <a href="/recursewrites" aria-current="page">Writes</a>
          <a href="/#gallery">Gallery</a>
          <a href="/team">Team</a>
        </nav>

        <a className="header-cta" href="/#join">Join the loop <span>↗</span></a>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded="false"
          data-menu-toggle
        >
          <span></span><span></span>
        </button>

        <nav className="mobile-nav" aria-label="Mobile navigation" data-mobile-nav>
          <a href="/#about">01 / About</a>
          <a href="/#events">02 / Events</a>
          <a href="/opportunities">03 / Opportunities</a>
          <a href="/recursewrites" aria-current="page">04 / Writes</a>
          <a href="/#gallery">05 / Gallery</a>
          <a href="/team">06 / Team</a>
          <a href="/#join">07 / Join</a>
        </nav>
      </header>

      <main id="writes-content">
        <section className="writes-hero">
          <div className="writes-hero__grid" aria-hidden="true"></div>
          <div className="writes-hero__glow" aria-hidden="true"></div>

          <div className="writes-hero__eyebrow">
            <span className="status-dot"></span>
            RECURSE WRITES / WEEKLY ARTICLES
          </div>

          <div className="writes-hero__content reveal">
            <p className="terminal-kicker">&gt; recurse.writes --list</p>
            <h1>
              RECURSE
              <span>WRITES</span>
            </h1>
            <p className="writes-hero__sub">
              Curious about tech? Discover stories, ideas &amp; insights
              from the Recurse community — a new article every week.
            </p>
            <div className="writes-hero__meta-row">
              <span className="writes-edition-badge">
                {articles.length} EDITIONS
              </span>
              <span className="writes-platform-tags">
                <i>MEDIUM</i>
                <i>SUBSTACK</i>
              </span>
            </div>
          </div>
        </section>

        <section className="writes-list-section">
          <div className="section-label reveal">
            <span>01</span>
            <p>All articles</p>
          </div>

          <div className="writes-list">
            {articles.map((article, index) => (
              <article
                className="writes-card reveal"
                key={`edition-${article.week}`}
              >
                <div className="writes-card__thumb">
                  <Image
                    src={article.thumbnail}
                    alt={`Thumbnail for ${article.title}`}
                    fill
                    sizes="(max-width: 680px) 100vw, 380px"
                  />
                </div>

                <div className="writes-card__body">
                  <div className="writes-card__top">
                    <span className="writes-card__edition">
                      EDITION {String(article.week).padStart(2, "0")}
                    </span>
                    <span className="writes-card__week">
                      WEEK #{article.week}
                    </span>
                  </div>

                  <h3 className="writes-card__title">{article.title}</h3>
                  <p className="writes-card__desc">{article.description}</p>

                  <div className="writes-card__footer">
                    <span className="writes-card__date">
                      {formatDate(article.date)} · {article.author}
                    </span>
                    <div className="writes-card__actions">
                      <a
                        className="writes-btn writes-btn--medium"
                        href={article.mediumUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                        </svg>
                        Read on Medium <span>↗</span>
                      </a>
                      <a
                        className="writes-btn writes-btn--substack"
                        href={article.substackUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                        </svg>
                        Read on Substack <span>↗</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="writes-card__index" aria-hidden="true">
                  {String(article.week).padStart(3, "0")}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="writes-cta">
          <div className="writes-cta__rings" aria-hidden="true">
            <i></i><i></i><i></i>
          </div>
          <p className="terminal-kicker reveal">&gt; writes.subscribe()</p>
          <h2 className="reveal">NEVER MISS<br />AN EDITION.</h2>
          <p className="writes-cta__copy reveal">
            Follow us on Medium and Substack for weekly articles on tech,
            open source, and everything in between.
          </p>
          <div className="writes-cta__actions reveal">
            <a
              className="button button--solid"
              href="https://medium.com/@recursekmit"
              target="_blank"
              rel="noreferrer"
            >
              Follow on Medium <span>↗</span>
            </a>
            <a
              className="button button--ghost"
              href="https://recursekmit.substack.com"
              target="_blank"
              rel="noreferrer"
            >
              Subscribe on Substack <span>↗</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer__brand">
          <a className="brand brand--footer" href="/#top">
            <span className="brand__logo brand__logo--dark" aria-hidden="true">
              <Image
                src="/recurse-logo-white.png"
                alt=""
                width={464}
                height={135}
              />
            </span>
          </a>
          <p>The technical club of Keshav Memorial Institute of Technology.<br />Built by the terminally curious.</p>
        </div>
        <div className="footer__links">
          <div>
            <span>NAVIGATE</span>
            <a href="/#about">About</a>
            <a href="/#events">Events</a>
            <a href="/opportunities">Opportunities</a>
            <a href="/recursewrites">Writes</a>
            <a href="/#gallery">Gallery</a>
            <a href="/team">Team</a>
          </div>
          <div>
            <span>CONNECT</span>
            <a
              href="https://www.instagram.com/recurse.official/"
              target="_blank"
              rel="noreferrer"
            >Instagram ↗</a>
            <a href="mailto:recurse@kmit.in">Email ↗</a>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© <span data-year suppressHydrationWarning></span> RECURSE / KMIT</p>
          <p>CODE. BUILD. BREAK. REPEAT.</p>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </div>
  );
}
