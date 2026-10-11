"use client";

import Image from "next/image";
import { useSiteInteractions } from "./useSiteInteractions";

const clubHeads = [
  {
    name: "Golla Bharath",
    role: "Club Head",
    focus: "Recurse Leadership · 2025–26",
    image: "/images/Bharath.jpeg",
    imageAlt: "Golla Bharath speaking at a Recurse event",
    imagePosition: "center 28%",
  },
  {
    name: "Kondour Prakarsha",
    role: "Club Head",
    focus: "Recurse Leadership · 2025–26",
    image: "/images/Prakarsha.jpeg",
    imageAlt: "Kondour Prakarsha speaking at a Recurse event",
    imagePosition: "center 22%",
  },
];

const coreMembers = [
  { name: "Thatikonda Rahul", role: "Content Creator" },
  { name: "Jinal Thakkar", role: "Content Creator" },
  { name: "Manapadi Naga Sharanya", role: "Content Creator" },
  { name: "Tarang Harsola", role: "Documentation" },
  { name: "mir zaynul aabideen ali khan", role: "Domain Expert" },
  { name: "Shoaib Sadiq Salehmohamed", role: "Domain Expert" },
  { name: "K Varshith Reddy", role: "Domain Expert" },
  { name: "Shishir Gella", role: "Event Coordinator" },
  { name: "Rishith chintala", role: "Event Coordinator" },
  { name: "J VARSHA", role: "Event Coordinator" },
];

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TeamSite() {
  useSiteInteractions();

  return (
    <div className="team-page">
      <a className="skip-link" href="#team-content">Skip to content</a>

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
          <a href="/recursewrites">Writes</a>
          <a href="/#impact">Impact</a>
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
          <a href="/recursewrites">04 / Writes</a>
          <a href="/#impact">05 / Impact</a>
          <a href="/#gallery">06 / Gallery</a>
          <a href="/team">07 / Team</a>
        </nav>
      </header>

      <main id="team-content">
        <section className="team-hero">
          <Image
            className="team-hero__photo"
            src="/images/icebreaking.jpg"
            alt=""
            fill
            sizes="100vw"
            priority
          />
          <div className="hero-grid" aria-hidden="true"></div>
          <div className="team-hero__eyebrow">
            <span className="status-dot"></span>
            RECURSE / PEOPLE DIRECTORY / 2025–26
          </div>
          <p className="terminal-kicker">&gt; team --current</p>
          <h1>PEOPLE BEHIND<br /><span>THE LOOP.</span></h1>
          <div className="team-hero__copy">
            <p>
              The people who turn ideas into events, workshops into momentum,
              and a technical club into a community.
            </p>
            <a className="text-link" href="#club-heads">
              Meet the team <span>↓</span>
            </a>
          </div>
        </section>

        <section className="team-heads" id="club-heads">
          <div className="section-label reveal">
            <span>01</span>
            <p>Current leadership</p>
          </div>
          <div className="team-section-heading reveal">
            <div>
              <p className="terminal-kicker">&gt; leadership.current</p>
              <h2>CLUB<br />HEADS.</h2>
            </div>
            <p>
              Leading the club, shaping its direction, and keeping the Recurse
              community moving forward.
            </p>
          </div>

          <div className="team-lead-grid">
            {clubHeads.map((member, index) => (
              <article className="team-lead-card reveal" key={member.name}>
                <div className="team-avatar team-avatar--lead">
                  <Image
                    src={member.image}
                    alt={member.imageAlt}
                    fill
                    sizes="(max-width: 680px) 100vw, 50vw"
                    style={{ objectPosition: member.imagePosition }}
                  />
                  <b>{String(index + 1).padStart(2, "0")}</b>
                </div>
                <div className="team-card__meta">
                  <p>{member.role}</p>
                  <h3>{member.name}</h3>
                  <span>{member.focus}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="core-team">
          <div className="section-label reveal">
            <span>02</span>
            <p>Core contributors</p>
          </div>
          <div className="team-section-heading reveal">
            <div>
              <p className="terminal-kicker">&gt; team.core --all</p>
              <h2>CORE<br />MEMBERS.</h2>
            </div>
            <p>
              The team driving community, content, documentation, technical
              direction, and event execution.
            </p>
          </div>

          <div className="core-grid">
            {coreMembers.map((member, index) => (
              <article className="core-card reveal" key={member.name}>
                <div className="team-avatar">
                  <span>{initials(member.name)}</span>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                </div>
                <div className="team-card__meta">
                  <p>{member.role}</p>
                  <h3>{member.name}</h3>
                  <span>Recurse Core Team · 2025–26</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="team-cta">
          <Image
            className="team-cta__photo"
            src="/images/farewell.jpg"
            alt=""
            fill
            sizes="100vw"
          />
          <p className="terminal-kicker reveal">&gt; collaborate --with recurse</p>
          <h2 className="reveal">BUILD WITH<br />THE TEAM.</h2>
          <div className="team-cta__actions reveal">
            <a className="button button--dark" href="/#join">Join Recurse <span>↗</span></a>
            <a className="button button--line" href="mailto:recurse@kmit.in">Contact us</a>
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
            <a href="/#impact">Impact</a>
            <a href="/team">Team</a>
          </div>
          <div>
            <span>CONNECT</span>
            <a
              href="https://www.instagram.com/recurse.official/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram ↗
            </a>
            <a href="mailto:recurse@kmit.in">Email ↗</a>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© <span data-year suppressHydrationWarning></span> RECURSE / KMIT</p>
          <p>CODE. BUILD. BREAK. REPEAT.</p>
          <a href="/#top">BACK HOME ↑</a>
        </div>
      </footer>
    </div>
  );
}
