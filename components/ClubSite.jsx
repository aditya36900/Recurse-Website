"use client";

import Image from "next/image";
import { useSiteInteractions } from "./useSiteInteractions";
import { timelineEvents } from "./timelineEvents";

export default function ClubSite() {
  useSiteInteractions();

  return (
    <>
    <a className="skip-link" href="#main-content">Skip to content</a>

    <div className="boot-screen" aria-hidden="true">
      <div className="boot-screen__inner">
        <div className="boot-screen__logo">
          <Image
            src="/recurse-logo-white.png"
            alt=""
            width={464}
            height={135}
            priority
          />
        </div>
        <p>RECURSE BOOTLOADER // 2026</p>
        <div className="boot-line"><span>Loading curiosity</span><b>[OK]</b></div>
        <div className="boot-line"><span>Mounting ideas</span><b>[OK]</b></div>
        <div className="boot-line"><span>Starting community</span><b>[OK]</b></div>
        <div className="boot-progress"><span></span></div>
      </div>
    </div>

    <header className="site-header" data-header>
      <a className="brand" href="#top" aria-label="Recurse home">
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
        <a href="#about">About</a>
        <a href="#events">Events</a>
        <a href="/opportunities">Opportunities</a>
        <a href="/recursewrites">Writes</a>
        <a href="#gallery">Gallery</a>
        <a href="/team">Team</a>
      </nav>

      <a className="header-cta" href="#join">Join the loop <span>↗</span></a>

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
        <a href="#about">01 / About</a>
        <a href="#events">02 / Events</a>
        <a href="/opportunities">03 / Opportunities</a>
        <a href="/recursewrites">04 / Writes</a>
        <a href="#gallery">05 / Gallery</a>
        <a href="/team">06 / Team</a>
        <a href="#join">07 / Join</a>
      </nav>
    </header>

    <main id="main-content">
      <section className="hero" id="top">
        <canvas className="hero-network" data-network aria-hidden="true"></canvas>
        <div className="hero-grid" aria-hidden="true"></div>

        <div className="hero__eyebrow">
          <span className="status-dot"></span>
          KMIT TECHNICAL CLUB / SYSTEM ONLINE
        </div>

        <div className="hero__content">
          <p className="hero__prompt">recurse@kmit:~$ run the_future</p>
          <h1>
            TOO CURIOUS
            <span>TO STOP.</span>
          </h1>
          <div className="hero__bottom">
            <p>
              We code, build, compete, experiment, and turn curiosity into
              things that exist beyond the classroom.
            </p>
            <div className="hero__actions">
              <a className="button button--solid" href="#events">
                Explore the chaos <span>↓</span>
              </a>
              <a className="button button--ghost" href="#about">What is Recurse?</a>
            </div>
          </div>
        </div>

        <div className="hero__meta">
          <div>
            <span>FOCUS</span>
            <b>CS + ECE</b>
          </div>
          <div>
            <span>MODE</span>
            <b>BUILD / BREAK / REPEAT</b>
          </div>
          <div>
            <span>SCROLL</span>
            <b className="scroll-glyph">↓</b>
          </div>
        </div>

        <div className="hero-ticker" aria-label="Club focus areas">
          <div className="hero-ticker__track">
            <span>CODE</span><i>+</i><span>CREATE</span><i>+</i><span>COMPETE</span
            ><i>+</i><span>CONNECT</span><i>+</i><span>CODE</span><i>+</i
            ><span>CREATE</span><i>+</i><span>COMPETE</span><i>+</i
            ><span>CONNECT</span><i>+</i>
          </div>
        </div>
      </section>

      <section className="section manifesto" id="about">
        <div className="section-label reveal">
          <span>01</span>
          <p>Why we exist</p>
        </div>

        <div className="manifesto__statement reveal">
          <p className="terminal-kicker">&gt; recurse.mission</p>
          <h2>
            THE CURRICULUM IS<br />
            <span>ONLY THE START.</span>
          </h2>
        </div>

        <div className="manifesto__grid">
          <div className="manifesto__copy reveal">
            <p className="lead">
              At Keshav Memorial Institute of Technology (KMIT), Recurse gives
              students the room, resources, and people to pursue computer
              science and electronics outside the limits of a classroom.
            </p>
            <p>
              It is a place to get technically dangerous—in the best way.
              Learn from peers. Ship ambitious ideas. Compete at a higher
              level. Find the people who care about the same obscure problem
              you do.
            </p>
          </div>

          <div className="manifesto__stats reveal" aria-label="Club overview">
            <article>
              <strong data-count="7">00</strong><sup>+</sup>
              <p>Event formats</p>
            </article>
            <article>
              <strong data-count="3">00</strong>
              <p>Core disciplines</p>
            </article>
            <article>
              <strong data-count="2">00</strong>
              <p>Flagship editions</p>
            </article>
            <article>
              <strong data-count="376">000</strong>
              <p>Teams at Codenovate 2.0</p>
            </article>
          </div>
        </div>

        <div className="discipline-track reveal">
          <div className="discipline">
            <span>01A</span>
            <h3>COMPUTE</h3>
            <p>Programming · AI/ML · Web · Security · Competitive coding</p>
          </div>
          <div className="merge-node" aria-hidden="true">
            <span></span><b>MERGE</b><span></span>
          </div>
          <div className="discipline">
            <span>01B</span>
            <h3>ENGINEER</h3>
            <p>Electronics · IoT · Circuits · Embedded systems · Hardware</p>
          </div>
        </div>
      </section>

      <section className="flagship">
        <div className="flagship__visual reveal">
          <Image
            className="flagship__photo"
            src="/images/Codenovate/toast_0126_re-.jpg"
            alt="Codenovate participants gathered on stage"
            fill
            sizes="(max-width: 980px) 100vw, 67vw"
            priority
          />
          <div className="flagship__noise"></div>
          <div className="flagship__rings" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
          <div className="flagship__code" aria-hidden="true">
            <p>01 &nbsp; DEFINE PROBLEM</p>
            <p>02 &nbsp; FIND YOUR PEOPLE</p>
            <p>03 &nbsp; BUILD THE IMPOSSIBLE</p>
            <p>04 &nbsp; SHIP BEFORE DAWN</p>
          </div>
          <p className="flagship__stamp">NATIONAL<br />FLAGSHIP<br />HACKATHON</p>
          <h2>CODE<span>NOVATE</span></h2>
        </div>

        <div className="flagship__info reveal">
          <div>
            <p className="terminal-kicker">&gt; featured_event.exe</p>
            <span className="live-tag"><i></i> FLAGSHIP</span>
          </div>
          <h3>ONE PROBLEM.<br />A THOUSAND WAYS IN.</h3>
          <p>
            Codenovate is Recurse's national 24-hour hackathon—open to B.Tech
            students across India, built around collaborative teams, eight
            problem statements, and real execution under pressure.
          </p>
          <div className="flagship__metrics" aria-label="Codenovate 2.0 statistics">
            <article><strong>376</strong><span>Teams registered</span></article>
            <article><strong>61</strong><span>Finalist teams</span></article>
            <article><strong>239</strong><span>On-site builders</span></article>
            <article><strong>58K+</strong><span>Unstop impressions</span></article>
          </div>
          <p className="flagship__proof">
            Codenovate 2.0 · November 2025 · ₹75,000 total podium prize pool
          </p>
          <a className="text-link" href="#join">
            Track the next edition <span>↗</span>
          </a>
        </div>
      </section>

      <section className="section events" id="events">
        <div className="section-label reveal">
          <span>02</span>
          <p>What we run</p>
        </div>

        <div className="section-heading reveal">
          <div>
            <p className="terminal-kicker">&gt; events --all</p>
            <h2>NOT YOUR STANDARD<br />CLUB CALENDAR.</h2>
          </div>
          <p>
            From national hackathons to campus-scale games, every format is
            designed to make people think, move, build, and remember.
          </p>
        </div>

        <div className="event-filters reveal" role="group" aria-label="Filter events">
          <button className="is-active" type="button" data-filter="all">ALL_07</button>
          <button type="button" data-filter="flagship">FLAGSHIP</button>
          <button type="button" data-filter="community">COMMUNITY</button>
          <button type="button" data-filter="play">PLAY</button>
        </div>

        <div className="event-grid" data-event-grid>
          <article className="event-card event-card--large reveal" data-category="flagship">
            <div className="event-card__top">
              <span>001 / FLAGSHIP</span><span>↗</span>
            </div>
            <div className="event-card__art event-card__art--code">
              <Image
                className="event-card__photo"
                src="/images/Codenovate/DSC01890.jpg"
                alt="Codenovate participants collaborating around a laptop"
                fill
                sizes="(max-width: 980px) 100vw, 66vw"
              />
              <span className="event-card__photo-label">24H / BUILD FLOOR</span>
            </div>
            <div className="event-card__body">
              <p>National Hackathon</p>
              <h3>CODENOVATE</h3>
              <span>A national 24-hour build sprint where ideas meet execution.</span>
              <ul className="event-card__facts">
                <li>15 Nov 2025 · 8 problem statements</li>
                <li>376 teams · 61 finalist teams</li>
              </ul>
            </div>
          </article>

          <article className="event-card reveal" data-category="play">
            <div className="event-card__top">
              <span>002 / SAANJH '26</span><span>↗</span>
            </div>
            <div className="event-card__art event-card__art--kbc">
              <Image
                className="event-card__photo"
                src="/images/KBC+SS/DSC02256.jpg"
                alt="KBC contestants seated in front of the projected quiz screen"
                fill
                sizes="(max-width: 680px) 100vw, 50vw"
              />
              <span className="event-card__photo-label">HOT SEAT / LIVE</span>
            </div>
            <div className="event-card__body">
              <p>Code Quiz</p>
              <h3>KBC</h3>
              <span>A hot-seat code quiz with nostalgia, lifelines, and a do-or-die finale.</span>
              <ul className="event-card__facts">
                <li>17 Apr 2026 · Saanjh '26</li>
                <li>50+ teams · 11 prize rounds</li>
              </ul>
            </div>
          </article>

          <article className="event-card reveal" data-category="play">
            <div className="event-card__top">
              <span>003 / SAANJH '26</span><span>↗</span>
            </div>
            <div className="event-card__art event-card__art--runner">
              <Image
                className="event-card__photo"
                src="/images/KBC+SS/DSC02090.jpg"
                alt="Students playing the Subway Surfers challenge"
                fill
                sizes="(max-width: 680px) 100vw, 50vw"
              />
              <span className="event-card__photo-label">IRL / ENDLESS RUN</span>
            </div>
            <div className="event-card__body">
              <p>IRL Challenge</p>
              <h3>SUBWAY SURFERS</h3>
              <span>A fast reflex-and-scoring challenge that escaped the screen.</span>
              <ul className="event-card__facts">
                <li>17 Apr 2026 · Saanjh '26</li>
                <li>Hosted by Tarang + Varsha</li>
              </ul>
            </div>
          </article>

          <article className="event-card reveal" data-category="play">
            <div className="event-card__top">
              <span>004 / QUEST</span><span>↗</span>
            </div>
            <div className="event-card__art event-card__art--coin">
              <div className="coin">$</div>
              <div className="radar" aria-hidden="true"></div>
            </div>
            <div className="event-card__body">
              <p>Strategy Event</p>
              <h3>COINQUEST</h3>
              <span>A points-driven strategy concept built around side quests and smart moves.</span>
              <ul className="event-card__facts">
                <li>2026 planning cycle</li>
                <li>Concept owner · Hamsika</li>
              </ul>
            </div>
          </article>

          <article className="event-card reveal" data-category="play">
            <div className="event-card__top">
              <span>005 / FUN × TECH</span><span>↗</span>
            </div>
            <div className="event-card__art event-card__art--engine">
              <div className="gear" aria-hidden="true">✣</div>
              <span>ENGINEER'D</span>
            </div>
            <div className="event-card__body">
              <p>Tech Playground</p>
              <h3>ENGINEER'D</h3>
              <span>Engineering instincts, chaotic challenges.</span>
              <ul className="event-card__facts">
                <li>Fun × tech event format</li>
              </ul>
            </div>
          </article>

          <article className="event-card event-card--wide reveal" data-category="community">
            <div className="event-card__top">
              <span>006 / WORKSHOP SERIES</span><span>↗</span>
            </div>
            <div className="event-card__art event-card__art--reboot">
              <Image
                className="event-card__photo"
                src="/images/reboot/DSC00318.jpg"
                alt="Students working hands-on during the ReBoot workshop"
                fill
                sizes="(max-width: 980px) 100vw, 66vw"
              />
              <span className="event-card__photo-label">LLMS / RAG / HANDS-ON</span>
            </div>
            <div className="event-card__body">
              <p>Hands-on Workshops</p>
              <h3>REBOOT</h3>
              <span>From Hallucinations to Precision: a full day of LLMs, RAG, and hands-on work.</span>
              <ul className="event-card__facts">
                <li>4 Apr 2026 · 120 participants</li>
                <li>Led by Jai + Charan</li>
              </ul>
            </div>
          </article>

          <article className="event-card event-card--tablet-wide reveal" data-category="community">
            <div className="event-card__top">
              <span>007 / ALWAYS ON</span><span>↗</span>
            </div>
            <div className="event-card__art event-card__art--cig">
              <Image
                className="event-card__photo"
                src="/images/CIGs.jpeg"
                alt="Common Interest Groups meeting"
                fill
                sizes="(max-width: 980px) 100vw, 66vw"
              />
              <span className="event-card__photo-label">CIG</span>
            </div>
            <div className="event-card__body">
              <p>Peer Community</p>
              <h3>COMMON INTEREST GROUPS</h3>
              <span>Three active, peer-led groups for learning and building together.</span>
              <ul className="event-card__facts">
                <li>Web Dev · AI · DSA/CP · CyberSec · DevOps</li>
                <li>65 registered members at launch</li>
              </ul>
            </div>
          </article>

        </div>

        <section
          className="event-timeline"
          aria-labelledby="event-timeline-title"
          data-timeline
        >
          <div className="section-label reveal">
            <span>03</span>
            <p>Chronological log</p>
          </div>

          <div className="section-heading event-timeline__heading reveal">
            <div>
              <p className="terminal-kicker">&gt; EVENTS --LOG --CHRONOLOGICAL</p>
              <h2 id="event-timeline-title">EVERY COMMIT<br />SINCE WE STARTED.</h2>
            </div>
            <p>
              The club calendar as a progress trail: workshops, games,
              communities, and the flagship nights that moved the loop forward.
            </p>
          </div>

          <ol className="timeline-list" aria-label="Recurse event timeline">
            {timelineEvents.map((event, index) => (
              <li
                className="timeline-item reveal"
                data-timeline-item
                key={`${event.date}-${event.title}`}
              >
                <div className="timeline-item__node" aria-hidden="true"></div>
                <article className="timeline-card" tabIndex={0}>
                  <div className="timeline-card__top">
                    <time dateTime={event.date}>{event.label}</time>
                    <span className="timeline-tag">
                      <i aria-hidden="true"></i>
                      {event.category}
                    </span>
                  </div>
                  {event.image ? (
                    <div className="timeline-card__media">
                      <Image
                        src={event.image}
                        alt={event.imageAlt}
                        fill
                        sizes="(max-width: 980px) 90vw, 40vw"
                      />
                    </div>
                  ) : null}
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="timeline-card__bottom">
                    <span>{String(index + 1).padStart(3, "0")} / LOG</span>
                    {event.stat ? <b>{event.stat}</b> : <span aria-hidden="true">---</span>}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </section>
      </section>

      <section className="impact" id="impact">
        <div className="impact__header reveal">
          <div className="section-label section-label--light">
            <span>04</span>
            <p>The output</p>
          </div>
          <h2>WE DON'T COUNT<br />ATTENDANCE.<br /><span>WE COUNT IMPACT.</span></h2>
        </div>

        <div className="impact__content">
          <div className="impact__copy reveal">
            <p className="terminal-kicker">&gt; impact.log</p>
            <p>
              The real metric is what happens after an event: a first project
              shipped, a teammate found, a competition entered, a skill that
              finally clicks.
            </p>
            <a className="text-link text-link--dark" href="#gallery">
              See the evidence <span>↓</span>
            </a>
          </div>

          <div className="impact__log reveal">
            <article>
              <span>01</span>
              <div>
                <h3>EXPOSURE</h3>
                <p>120 students got hands-on with LLMs and RAG in a single day at ReBoot I.</p>
              </div>
              <b>→</b>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>EXPERIENCE</h3>
                <p>376 teams registered to turn ideas into working prototypes at Codenovate 2.0.</p>
              </div>
              <b>→</b>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>COMMUNITY</h3>
                <p>65 members joined three Common Interest Groups at the introductory meet.</p>
              </div>
              <b>→</b>
            </article>
            <article>
              <span>04</span>
              <div>
                <h3>MOMENTUM</h3>
                <p>Two flagship hackathon editions—and a community that keeps building after the event.</p>
              </div>
              <b>↗</b>
            </article>
          </div>
        </div>
      </section>

      <section className="section cig-section">
        <div className="section-label reveal">
          <span>05</span>
          <p>Find your people</p>
        </div>

        <div className="section-heading section-heading--cig reveal">
          <div>
            <p className="terminal-kicker">&gt; groups.connect()</p>
            <h2>OBSESS OVER<br />SOMETHING TOGETHER.</h2>
          </div>
          <p>
            Common Interest Groups are smaller circles for people exploring
            similar topics. Learn together, share resources, and turn
            half-formed ideas into actual work.
          </p>
        </div>

        <div className="cig-list reveal">
          <article>
            <span>GROUP_01</span>
            <h3>WEB DEVELOPMENT</h3>
            <p>Git, GitHub, deployment, and hackathon-ready builds · Mon/Tue</p>
            <i>↗</i>
          </article>
          <article>
            <span>GROUP_02</span>
            <h3>AI CIG</h3>
            <p>ML to deep learning, regression, classification, and neural networks.</p>
            <i>↗</i>
          </article>
          <article>
            <span>GROUP_03</span>
            <h3>DSA / COMPETITIVE PROGRAMMING</h3>
            <p>Arrays to advanced patterns, with Easy → Medium → Hard progression · Sat</p>
            <i>↗</i>
          </article>
          <article>
            <span>GROUP_04</span>
            <h3>CYBERSECURITY</h3>
            <p>Network security, cryptography, and ethical hacking fundamentals.</p>
            <i>↗</i>
          </article>
          <article>
            <span>GROUP_05</span>
            <h3>DEVOPS</h3>
            <p>CI/CD pipelines, containerization, and infrastructure as code.</p>
            <i>↗</i>
          </article>
        </div>
        <p className="cig-proof reveal">
          <span>65 MEMBERS</span> registered across the five active groups
          at the September 2025 introductory meet.
        </p>
      </section>

      <section className="gallery" id="gallery">
        <div className="gallery__heading reveal">
          <div className="section-label section-label--overlay">
            <span>06</span>
            <p>Proof we were here</p>
          </div>
          <h2>THE BUILD.<br />THE BUZZ.<br /><span>THE PEOPLE.</span></h2>
          <p>A wall of builds, crowds, portraits, and the moments between events.</p>
        </div>

        <div className="gallery-grid">
          <figure className="gallery-item gallery-item--feature reveal">
            <div className="gallery-photo">
              <Image
                src="/images/Codenovate/@varun.pixels-127.jpg"
                alt="A Codenovate team collaborating around a laptop"
                fill
                sizes="(max-width: 680px) 100vw, (max-width: 980px) 100vw, 66vw"
              />
              <b>01</b>
            </div>
            <figcaption>Codenovate 2.0 / Ideas becoming working builds</figcaption>
          </figure>
          <figure className="gallery-item gallery-item--portrait reveal">
            <div className="gallery-photo">
              <Image
                src="/images/random/_VBC9271.jpg"
                alt="Three students together during the Navraas celebration"
                fill
                sizes="(max-width: 680px) 100vw, 33vw"
                style={{ objectPosition: "center 28%" }}
              />
              <b>02</b>
            </div>
            <figcaption>Navraas / Dressed for the celebration</figcaption>
          </figure>
          <figure className="gallery-item reveal">
            <div className="gallery-photo">
              <Image
                src="/images/KBC+SS/DSC02789.jpg"
                alt="The KBC and Subway Surfers event team posing together"
                fill
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <b>03</b>
            </div>
            <figcaption>KBC × Subway Surfers / Saanjh '26 crew</figcaption>
          </figure>
          <figure className="gallery-item reveal">
            <div className="gallery-photo">
              <Image
                src="/images/reboot/DSC00318.jpg"
                alt="Students working together during the ReBoot workshop"
                fill
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <b>04</b>
            </div>
            <figcaption>ReBoot I / Learning by doing</figcaption>
          </figure>
          <figure className="gallery-item reveal">
            <div className="gallery-photo">
              <Image
                src="/images/icebreaking.jpg"
                alt="Recurse members seated together on the campus steps"
                fill
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <b>05</b>
            </div>
            <figcaption>Ice Breaking / The community gets together</figcaption>
          </figure>
          <figure className="gallery-item gallery-item--wide reveal">
            <div className="gallery-photo">
              <Image
                src="/images/navras/WhatsApp Image 2026-06-22 at 11.35.23 PM.jpeg"
                alt="Recurse members gathered together during Navraas"
                fill
                sizes="(max-width: 680px) 100vw, (max-width: 980px) 100vw, 66vw"
              />
              <b>06</b>
            </div>
            <figcaption>Navraas / Mystery Raas and the festival crew</figcaption>
          </figure>
          <figure className="gallery-item gallery-item--portrait reveal">
            <div className="gallery-photo">
              <Image
                src="/images/Codenovate/@charan.captures-122.jpg"
                alt="The Codenovate bonfire burning after the build"
                fill
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <b>07</b>
            </div>
            <figcaption>Codenovate 2.0 / The bonfire after the build</figcaption>
          </figure>
          <figure className="gallery-item reveal">
            <div className="gallery-photo">
              <Image
                src="/images/promptquest.jpg"
                alt="Prompt Quest participants working through a challenge"
                fill
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <b>08</b>
            </div>
            <figcaption>Prompt Quest / Precision under pressure</figcaption>
          </figure>
          <figure className="gallery-item reveal">
            <div className="gallery-photo">
              <Image
                src="/images/random/DSC00453.jpg"
                alt="A packed room of students working on their laptops"
                fill
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <b>09</b>
            </div>
            <figcaption>In the room / Focus mode on</figcaption>
          </figure>
          <figure className="gallery-item reveal">
            <div className="gallery-photo">
              <Image
                src="/images/farewell.jpg"
                alt="Recurse members together at the club farewell"
                fill
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <b>10</b>
            </div>
            <figcaption>Farewell / One more frame before the next loop</figcaption>
          </figure>
          <figure className="gallery-item gallery-item--portrait reveal">
            <div className="gallery-photo">
              <Image
                src="/images/random/_VBC9266.jpg"
                alt="Two students dressed for the Navraas celebration"
                fill
                sizes="(max-width: 680px) 100vw, 33vw"
                style={{ objectPosition: "center 24%" }}
              />
              <b>11</b>
            </div>
            <figcaption>Navraas / Festival night portraits</figcaption>
          </figure>
          <figure className="gallery-item gallery-item--wide reveal">
            <div className="gallery-photo">
              <Image
                src="/images/Codenovate/toast_0126-261.jpg"
                alt="The KMIT campus during Codenovate at night"
                fill
                sizes="(max-width: 680px) 100vw, (max-width: 980px) 100vw, 66vw"
              />
              <b>12</b>
            </div>
            <figcaption>Codenovate 2.0 / The campus after dark</figcaption>
          </figure>
          <figure className="gallery-item reveal">
            <div className="gallery-photo">
              <Image
                src="/images/KBC+SS/DSC01802.jpg"
                alt="A contestant seated in the KBC hot seat"
                fill
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <b>13</b>
            </div>
            <figcaption>KBC / Thinking through the next answer</figcaption>
          </figure>
          <figure className="gallery-item reveal">
            <div className="gallery-photo">
              <Image
                src="/images/reboot/DSC01265.jpg"
                alt="A speaker explaining retrieval-augmented generation at ReBoot"
                fill
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <b>14</b>
            </div>
            <figcaption>ReBoot I / RAG gets smarter</figcaption>
          </figure>
          <figure className="gallery-item reveal">
            <div className="gallery-photo">
              <Image
                src="/images/Codenovate/DSC03560.jpg"
                alt="The Codenovate organizing team seated on campus steps"
                fill
                sizes="(max-width: 680px) 100vw, 33vw"
              />
              <b>15</b>
            </div>
            <figcaption>Codenovate 2.0 / The team behind the build</figcaption>
          </figure>
        </div>
      </section>

      <section className="join" id="join">
        <div className="join__rings" aria-hidden="true">
          <i></i><i></i><i></i>
        </div>
        <p className="terminal-kicker reveal">&gt; next_member --you</p>
        <h2 className="reveal">DON'T JUST<br />WATCH THE LOOP.</h2>
        <p className="join__accent reveal">ENTER IT<span className="blink">_</span></p>
        <p className="join__copy reveal">
          Bring the curiosity. We’ll bring the people, the problems, and a
          reason to build something bigger. Recruitment updates go live on
          @recurse.official.
        </p>
        <div className="join__actions reveal">
          <a className="button button--dark" href="/recruitment/results">
            Final results <span>↗</span>
          </a>
          <a
            className="button button--line"
            href="https://www.instagram.com/recurse.official/"
            target="_blank"
            rel="noreferrer"
          >
            Follow @recurse.official <span>↗</span>
          </a>
          <a className="button button--line" href="mailto:recurse@kmit.in">
            Talk to the team
          </a>
          <a className="button button--line" href="/team">
            Meet the team
          </a>
        </div>
      </section>

      <section className="terminal-section" aria-label="Interactive Recurse terminal">
        <div className="terminal-window reveal">
          <div className="terminal-window__bar">
            <div><i></i><i></i><i></i></div>
            <p>visitor@recurse: ~</p>
            <span>⌁</span>
          </div>
          <div className="terminal-window__body" data-terminal-output>
            <p className="terminal-response">RECURSE CLI v1.0. Type <b>help</b> to explore.</p>
          </div>
          <form className="terminal-form" data-terminal-form>
            <label htmlFor="terminal-input">visitor@recurse:~$</label>
            <input
              id="terminal-input"
              name="command"
              type="text"
              autoComplete="off"
              spellCheck="false"
              aria-label="Terminal command"
              suppressHydrationWarning
            />
            <span className="terminal-caret" aria-hidden="true"></span>
          </form>
        </div>
      </section>
    </main>

    <footer className="site-footer">
      <div className="footer__brand">
        <a className="brand brand--footer" href="#top">
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
          <a href="#about">About</a>
          <a href="#events">Events</a>
          <a href="/opportunities">Opportunities</a>
          <a href="/recursewrites">Writes</a>
          <a href="#gallery">Gallery</a>
          <a href="/team">Team</a>
        </div>
        <div>
          <span>CONNECT</span>
          <a
            href="https://www.instagram.com/recurse.official/"
            target="_blank"
            rel="noreferrer"
            >Instagram ↗</a
          >
          <a href="mailto:recurse@kmit.in">Email ↗</a>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© <span data-year></span> RECURSE / KMIT</p>
        <p>CODE. BUILD. BREAK. REPEAT.</p>
        <a href="#top">BACK TO TOP ↑</a>
      </div>
    </footer>

    </>
  );
}
