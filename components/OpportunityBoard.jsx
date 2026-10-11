"use client";

import { useEffect, useMemo, useState } from "react";
import { sampleOpportunity } from "./opportunityListings";
import { useSiteInteractions } from "./useSiteInteractions";
import styles from "@/app/opportunities/opportunities.module.css";

const opportunityTypes = [
  "All types",
  "Internship",
  "Full-time",
  "Part-time",
  "Fellowship",
  "Research",
  "Freelance",
];

const workModes = ["All modes", "Remote", "Hybrid", "On-site"];
const graduationYears = [2026, 2027, 2028, 2029, 2030];
const savedStorageKey = "recurse-opportunity-saves";
const draftStorageKey = "recurse-opportunity-drafts";

function formatDate(value) {
  if (!value) return "Rolling";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00+05:30`));
}

function isOpportunityOpen(opportunity) {
  if (opportunity.status === "closed") return false;
  if (!opportunity.deadline) return true;
  return new Date(`${opportunity.deadline}T23:59:59+05:30`) >= new Date();
}

function deadlineText(opportunity) {
  if (!opportunity.deadline) return "Rolling applications";

  const remaining = Math.ceil(
    (new Date(`${opportunity.deadline}T23:59:59+05:30`) - new Date()) /
      86400000,
  );

  if (remaining < 0) return "Applications closed";
  if (remaining === 0) return "Closes today";
  if (remaining === 1) return "1 day left";
  if (remaining <= 14) return `${remaining} days left`;
  return `Apply by ${formatDate(opportunity.deadline)}`;
}

function ListingCard({ opportunity, saved, onSave, onOpen }) {
  const open = isOpportunityOpen(opportunity);

  return (
    <article className={styles.listingCard}>
      <div className={styles.listingTopline}>
        <span className={styles.verifiedBadge}>
          <i aria-hidden="true">✓</i> Recurse checked
        </span>
        <span className={open ? styles.openStatus : styles.closedStatus}>
          {open ? "OPEN" : "CLOSED"}
        </span>
      </div>

      <div className={styles.listingIdentity}>
        <span className={styles.companyMark} aria-hidden="true">
          {opportunity.companyInitials || opportunity.company.slice(0, 2)}
        </span>
        <div>
          <p>{opportunity.company}</p>
          <h3>{opportunity.title}</h3>
        </div>
      </div>

      <div className={styles.listingMeta}>
        <span>{opportunity.type}</span>
        <span>{opportunity.mode}</span>
        <span>{opportunity.location || "India"}</span>
      </div>

      <p className={styles.listingSummary}>{opportunity.summary}</p>

      <div className={styles.tagRow} aria-label="Relevant skills">
        {opportunity.tags?.slice(0, 4).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <dl className={styles.listingFacts}>
        <div>
          <dt>Eligible batches</dt>
          <dd>{opportunity.graduationYears.join(" · ")}</dd>
        </div>
        <div>
          <dt>Compensation</dt>
          <dd>{opportunity.compensation || "Not disclosed"}</dd>
        </div>
      </dl>

      <div className={styles.deadlineRow}>
        <span>{deadlineText(opportunity)}</span>
        <span>Added {formatDate(opportunity.postedAt)}</span>
      </div>

      <div className={styles.cardActions}>
        <button type="button" onClick={() => onOpen(opportunity)}>
          View details <span aria-hidden="true">↗</span>
        </button>
        <button
          className={saved ? styles.savedButton : ""}
          type="button"
          aria-label={saved ? "Remove saved opportunity" : "Save opportunity"}
          aria-pressed={saved}
          onClick={() => onSave(opportunity.id)}
        >
          {saved ? "SAVED" : "SAVE"} <span aria-hidden="true">{saved ? "◆" : "◇"}</span>
        </button>
      </div>
    </article>
  );
}

export default function OpportunityBoard({ initialListings, reviewEmail }) {
  useSiteInteractions();

  const [query, setQuery] = useState("");
  const [type, setType] = useState("All types");
  const [mode, setMode] = useState("All modes");
  const [year, setYear] = useState("All batches");
  const [sort, setSort] = useState("newest");
  const [openOnly, setOpenOnly] = useState(true);
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState([]);
  const [pendingDrafts, setPendingDrafts] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");

    try {
      setSaved(JSON.parse(localStorage.getItem(savedStorageKey)) || []);
      setPendingDrafts(JSON.parse(localStorage.getItem(draftStorageKey)) || []);
    } catch {
      setSaved([]);
      setPendingDrafts([]);
    }
  }, []);

  useEffect(() => {
    const isModalOpen = Boolean(selectedListing || showSubmit);
    document.body.classList.toggle("menu-open", isModalOpen);

    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setSelectedListing(null);
      setShowSubmit(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedListing, showSubmit]);

  const filteredListings = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return initialListings
      .filter((opportunity) => {
        const haystack = [
          opportunity.title,
          opportunity.company,
          opportunity.location,
          opportunity.summary,
          ...(opportunity.tags || []),
        ]
          .join(" ")
          .toLowerCase();

        return (
          (!searchTerm || haystack.includes(searchTerm)) &&
          (type === "All types" || opportunity.type === type) &&
          (mode === "All modes" || opportunity.mode === mode) &&
          (year === "All batches" ||
            opportunity.graduationYears.includes(Number(year))) &&
          (!openOnly || isOpportunityOpen(opportunity)) &&
          (!savedOnly || saved.includes(opportunity.id))
        );
      })
      .sort((first, second) => {
        if (sort === "deadline") {
          if (!first.deadline) return 1;
          if (!second.deadline) return -1;
          return first.deadline.localeCompare(second.deadline);
        }
        if (sort === "company") return first.company.localeCompare(second.company);
        if (first.featured !== second.featured) return first.featured ? -1 : 1;
        return second.postedAt.localeCompare(first.postedAt);
      });
  }, [initialListings, mode, openOnly, query, saved, savedOnly, sort, type, year]);

  const activeCount = initialListings.filter(isOpportunityOpen).length;

  const flash = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const toggleSaved = (id) => {
    setSaved((current) => {
      const next = current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id];
      localStorage.setItem(savedStorageKey, JSON.stringify(next));
      return next;
    });
  };

  const clearFilters = () => {
    setQuery("");
    setType("All types");
    setMode("All modes");
    setYear("All batches");
    setOpenOnly(true);
    setSavedOnly(false);
  };

  const shareListing = async (opportunity) => {
    const shareData = {
      title: `${opportunity.title} at ${opportunity.company}`,
      text: `${opportunity.title} at ${opportunity.company} — shared through Recurse KMIT's Opportunity Board.`,
      url: opportunity.applyUrl,
    };

    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(opportunity.applyUrl);
        flash("Application link copied.");
      }
    } catch (error) {
      if (error?.name !== "AbortError") flash("Could not share this link.");
    }
  };

  const handleSubmission = async (event) => {
    event.preventDefault();
    setFormError("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const selectedYears = data.getAll("graduationYears");

    if (!selectedYears.length) {
      setFormError("Select at least one eligible graduation year.");
      return;
    }

    let applicationUrl;
    try {
      applicationUrl = new URL(data.get("applicationUrl"));
      if (!["http:", "https:"].includes(applicationUrl.protocol)) throw new Error();
    } catch {
      setFormError("Enter a complete, valid application link beginning with https://");
      return;
    }

    const submission = {
      id: `draft-${Date.now()}`,
      title: data.get("title").trim(),
      company: data.get("company").trim(),
      type: data.get("type"),
      mode: data.get("mode"),
      location: data.get("location").trim() || "Not specified",
      graduationYears: selectedYears,
      compensation: data.get("compensation").trim() || "Not disclosed",
      deadline: data.get("deadline") || "Rolling",
      tags: data.get("tags").trim() || "Not specified",
      summary: data.get("summary").trim(),
      applicationUrl: applicationUrl.toString(),
      submitterName: data.get("submitterName").trim(),
      submitterEmail: data.get("submitterEmail").trim(),
      submittedAt: new Date().toISOString(),
      status: "Pending Recurse review",
    };

    const nextDrafts = [submission, ...pendingDrafts].slice(0, 10);
    setPendingDrafts(nextDrafts);
    localStorage.setItem(draftStorageKey, JSON.stringify(nextDrafts));

    const endpoint = process.env.NEXT_PUBLIC_OPPORTUNITY_SUBMIT_URL;
    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });
        if (!response.ok) throw new Error("Submission endpoint rejected request");
        form.reset();
        setShowSubmit(false);
        flash("Submitted to Recurse for verification.");
        return;
      } catch {
        flash("Using email fallback for this submission.");
      }
    }

    const body = [
      "RECURSE OPPORTUNITY BOARD SUBMISSION",
      "",
      `Role: ${submission.title}`,
      `Organization: ${submission.company}`,
      `Type: ${submission.type}`,
      `Mode: ${submission.mode}`,
      `Location: ${submission.location}`,
      `Eligible graduation years: ${submission.graduationYears.join(", ")}`,
      `Compensation: ${submission.compensation}`,
      `Deadline: ${submission.deadline}`,
      `Skills/tags: ${submission.tags}`,
      `Application URL: ${submission.applicationUrl}`,
      "",
      "Description:",
      submission.summary,
      "",
      `Submitted by: ${submission.submitterName}`,
      `Contact: ${submission.submitterEmail}`,
      "",
      "I confirm that I checked the original source and believe this listing is genuine.",
    ].join("\n");

    const mailto = `mailto:${reviewEmail}?subject=${encodeURIComponent(
      `Opportunity submission: ${submission.company} — ${submission.title}`,
    )}&body=${encodeURIComponent(body)}`;

    form.reset();
    setShowSubmit(false);
    flash("Draft saved. Send the prepared email to complete submission.");
    window.location.href = mailto;
  };

  return (
    <div className={styles.page}>
      <a className="skip-link" href="#opportunity-board">Skip to opportunities</a>

      <header className="site-header" data-header>
        <a className="brand" href="/#top" aria-label="Recurse home">
          <span className="brand__mark" aria-hidden="true">R/</span>
          <span className="brand__name">RECURSE</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="/#about">About</a>
          <a href="/#events">Events</a>
          <a href="/opportunities" aria-current="page">Opportunities</a>
          <a href="/recursewrites">Writes</a>
          <a href="/#impact">Impact</a>
          <a href="/team">Team</a>
        </nav>

        <button
          className="header-cta"
          type="button"
          onClick={() => setShowSubmit(true)}
        >
          Post an opening <span>↗</span>
        </button>

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
          <a href="/team">06 / Team</a>
          <button type="button" onClick={() => setShowSubmit(true)}>
            07 / Post an opening
          </button>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.heroOrbit} aria-hidden="true">
            <i></i><i></i><i></i>
          </div>
          <div className={styles.heroEyebrow}>
            <span></span> RECURSE / CAREER SIGNAL NETWORK
          </div>
          <p className="terminal-kicker">&gt; opportunities --verified --kmit</p>
          <h1>
            YOUR NEXT MOVE<br />
            <span>STARTS HERE.</span>
          </h1>
          <div className={styles.heroBottom}>
            <p>
              Internships, fresher roles, research positions, and fellowships—
              checked by Recurse and organised for KMIT students.
            </p>
            <div className={styles.heroActions}>
              <a className="button button--solid" href="#opportunity-board">
                Browse openings <span>↓</span>
              </a>
              <button className="button button--ghost" type="button" onClick={() => setShowSubmit(true)}>
                Share an opportunity
              </button>
            </div>
          </div>
        </section>

        <section className={styles.signalStrip} aria-label="Opportunity board status">
          <article><span>LIVE</span><strong>{String(activeCount).padStart(2, "0")}</strong><p>Active openings</p></article>
          <article><span>FILTER</span><strong>05</strong><p>Graduation batches</p></article>
          <article><span>TRUST</span><strong>1×</strong><p>Human verified</p></article>
          <article><span>ACCESS</span><strong>24/7</strong><p>Student powered</p></article>
        </section>

        <section className={styles.board} id="opportunity-board">
          <div className="section-label reveal">
            <span>01</span>
            <p>Live opportunity feed</p>
          </div>

          <div className={styles.boardHeading}>
            <div className="reveal">
              <p className="terminal-kicker">&gt; board.query("next_move")</p>
              <h2>FIND THE SIGNAL.<br /><span>SKIP THE NOISE.</span></h2>
            </div>
            <p className="reveal">
              Search by role or skill, then narrow the board by opportunity type,
              work mode, deadline, and graduation year—the details that actually
              matter when deciding what to apply for next.
            </p>
          </div>

          <div className={`${styles.filters} reveal`}>
            <label className={styles.searchField}>
              <span>SEARCH</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Role, company, skill..."
              />
              <b aria-hidden="true">⌕</b>
            </label>

            <label>
              <span>TYPE</span>
              <select value={type} onChange={(event) => setType(event.target.value)}>
                {opportunityTypes.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>

            <label>
              <span>WORK MODE</span>
              <select value={mode} onChange={(event) => setMode(event.target.value)}>
                {workModes.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>

            <label>
              <span>GRADUATION</span>
              <select value={year} onChange={(event) => setYear(event.target.value)}>
                <option>All batches</option>
                {graduationYears.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>

          <div className={styles.resultControls}>
            <p aria-live="polite">
              <strong>{filteredListings.length}</strong> verified {filteredListings.length === 1 ? "opening" : "openings"}
            </p>
            <div>
              <label className={styles.checkControl}>
                <input type="checkbox" checked={openOnly} onChange={(event) => setOpenOnly(event.target.checked)} />
                <span>Open only</span>
              </label>
              <label className={styles.checkControl}>
                <input type="checkbox" checked={savedOnly} onChange={(event) => setSavedOnly(event.target.checked)} />
                <span>Saved</span>
              </label>
              <label className={styles.sortControl}>
                <span>SORT</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="newest">Newest first</option>
                  <option value="deadline">Deadline soon</option>
                  <option value="company">Company A–Z</option>
                </select>
              </label>
            </div>
          </div>

          {filteredListings.length ? (
            <div className={styles.listingGrid}>
              {filteredListings.map((opportunity) => (
                <ListingCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  saved={saved.includes(opportunity.id)}
                  onSave={toggleSaved}
                  onOpen={setSelectedListing}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div aria-hidden="true"><span>0</span><i></i><i></i></div>
              <p className="terminal-kicker">&gt; query returned 0 verified signals</p>
              <h3>{initialListings.length ? "NO MATCHES YET." : "THE BOARD IS WARMING UP."}</h3>
              <p>
                {initialListings.length
                  ? "Try clearing a filter or searching with a broader skill."
                  : "No verified openings are live right now. Know about one? Be the person who puts it on everyone else's radar."}
              </p>
              <div>
                {initialListings.length ? (
                  <button className="button button--dark" type="button" onClick={clearFilters}>Clear filters</button>
                ) : null}
                <button className="button button--solid" type="button" onClick={() => setShowSubmit(true)}>
                  Submit the first one <span>↗</span>
                </button>
              </div>
            </div>
          )}

          {pendingDrafts.length ? (
            <aside className={styles.pendingPanel}>
              <div>
                <p className="terminal-kicker">&gt; local.pending --mine</p>
                <h3>Your pending submissions</h3>
                <p>Saved only on this device until Recurse publishes them.</p>
              </div>
              <ul>
                {pendingDrafts.slice(0, 3).map((draft) => (
                  <li key={draft.id}>
                    <span>{draft.company}</span>
                    <strong>{draft.title}</strong>
                    <small>{draft.status}</small>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </section>

        <section className={styles.trustSection}>
          <div className={styles.trustCopy}>
            <div className="section-label section-label--light reveal">
              <span>02</span>
              <p>Designed for trust</p>
            </div>
            <p className="terminal-kicker reveal">&gt; verify.before(publish)</p>
            <h2 className="reveal">EVERY LINK<br /><span>EARNS ITS PLACE.</span></h2>
            <p className="reveal">
              Public submissions go through Recurse review before appearing on
              the board. We check the source, deadline, eligibility, and
              application URL. If something looks wrong, report it immediately.
            </p>
            <div className={`${styles.trustSteps} reveal`}>
              <article><span>01</span><h3>SUBMIT</h3><p>Share the original role and source.</p></article>
              <article><span>02</span><h3>VERIFY</h3><p>Recurse checks the listing details.</p></article>
              <article><span>03</span><h3>PUBLISH</h3><p>The signal reaches every student.</p></article>
            </div>
          </div>

          <article className={`${styles.sampleCard} reveal`} aria-label="Example of a verified listing">
            <div className={styles.sampleFlag}>LISTING ANATOMY / SAMPLE</div>
            <div className={styles.listingTopline}>
              <span className={styles.verifiedBadge}><i>✓</i> Recurse checked</span>
              <span className={styles.openStatus}>OPEN</span>
            </div>
            <div className={styles.listingIdentity}>
              <span className={styles.companyMark}>{sampleOpportunity.companyInitials}</span>
              <div><p>{sampleOpportunity.company}</p><h3>{sampleOpportunity.title}</h3></div>
            </div>
            <div className={styles.listingMeta}>
              <span>{sampleOpportunity.type}</span><span>{sampleOpportunity.mode}</span><span>{sampleOpportunity.location}</span>
            </div>
            <p className={styles.listingSummary}>{sampleOpportunity.summary}</p>
            <div className={styles.tagRow}>{sampleOpportunity.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <dl className={styles.listingFacts}>
              <div><dt>Eligible batches</dt><dd>{sampleOpportunity.graduationYears.join(" · ")}</dd></div>
              <div><dt>Deadline</dt><dd>{formatDate(sampleOpportunity.deadline)}</dd></div>
            </dl>
            <p className={styles.sampleNote}>Sample only—not an active opportunity.</p>
          </article>
        </section>

        <section className={styles.submitCta}>
          <p className="terminal-kicker reveal">&gt; network.effect += 1</p>
          <h2 className="reveal">FOUND AN OPENING?<br />PASS IT FORWARD.</h2>
          <p className="reveal">
            A link sitting in one group chat helps ten people. A verified listing
            on the board can help the entire college.
          </p>
          <button className="button button--dark reveal" type="button" onClick={() => setShowSubmit(true)}>
            Post an opportunity <span>↗</span>
          </button>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer__brand">
          <a className="brand brand--footer" href="/#top">
            <span className="brand__mark">R/</span><span className="brand__name">RECURSE</span>
          </a>
          <p>The technical club of Keshav Memorial Institute of Technology.<br />Built by the terminally curious.</p>
        </div>
        <div className="footer__links">
          <div>
            <span>NAVIGATE</span>
            <a href="/#about">About</a><a href="/#events">Events</a>
            <a href="/opportunities">Opportunities</a><a href="/recursewrites">Writes</a><a href="/team">Team</a>
          </div>
          <div>
            <span>CONNECT</span>
            <a href="https://www.instagram.com/recurse.official/" target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href="mailto:recurse@kmit.in">Email ↗</a>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© <span data-year suppressHydrationWarning></span> RECURSE / KMIT</p>
          <p>CODE. BUILD. BREAK. REPEAT.</p>
          <a href="#opportunity-board">BACK TO BOARD ↑</a>
        </div>
      </footer>

      {selectedListing ? (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedListing(null);
        }}>
          <section className={styles.detailModal} role="dialog" aria-modal="true" aria-labelledby="listing-detail-title">
            <button className={styles.modalClose} type="button" onClick={() => setSelectedListing(null)} aria-label="Close listing details">×</button>
            <div className={styles.detailHeader}>
              <span className={styles.companyMark}>{selectedListing.companyInitials || selectedListing.company.slice(0, 2)}</span>
              <div><p>{selectedListing.company}</p><h2 id="listing-detail-title">{selectedListing.title}</h2></div>
            </div>
            <div className={styles.listingMeta}>
              <span>{selectedListing.type}</span><span>{selectedListing.mode}</span><span>{selectedListing.location}</span>
            </div>
            <p className={styles.detailSummary}>{selectedListing.summary}</p>
            <dl className={styles.detailFacts}>
              <div><dt>Eligible graduation years</dt><dd>{selectedListing.graduationYears.join(", ")}</dd></div>
              <div><dt>Compensation</dt><dd>{selectedListing.compensation || "Not disclosed"}</dd></div>
              <div><dt>Application deadline</dt><dd>{formatDate(selectedListing.deadline)}</dd></div>
              <div><dt>Last verified</dt><dd>{formatDate(selectedListing.verifiedAt)}</dd></div>
            </dl>
            <div className={styles.detailActions}>
              <a className="button button--solid" href={selectedListing.applyUrl} target="_blank" rel="noopener noreferrer">Apply at source <span>↗</span></a>
              <button className="button button--dark" type="button" onClick={() => shareListing(selectedListing)}>Share</button>
              <a className={styles.reportLink} href={`mailto:${reviewEmail}?subject=${encodeURIComponent(`Report listing: ${selectedListing.company} — ${selectedListing.title}`)}`}>Report an issue</a>
            </div>
            <p className={styles.disclaimer}>Recurse curates links but does not represent the hiring organisation. Never pay money to apply for a role.</p>
          </section>
        </div>
      ) : null}

      {showSubmit ? (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowSubmit(false);
        }}>
          <section className={styles.submitModal} role="dialog" aria-modal="true" aria-labelledby="submit-title">
            <button className={styles.modalClose} type="button" onClick={() => setShowSubmit(false)} aria-label="Close submission form">×</button>
            <div className={styles.submitIntro}>
              <p className="terminal-kicker">&gt; submit.opportunity</p>
              <h2 id="submit-title">ADD TO THE<br /><span>SIGNAL.</span></h2>
              <p>Send the original source. Recurse verifies every submission before it goes public.</p>
            </div>

            <form className={styles.submitForm} onSubmit={handleSubmission}>
              <div className={styles.formGrid}>
                <label><span>ROLE TITLE *</span><input name="title" required maxLength="100" placeholder="Software Engineering Intern" /></label>
                <label><span>ORGANISATION *</span><input name="company" required maxLength="100" placeholder="Company or lab name" /></label>
                <label><span>OPPORTUNITY TYPE *</span><select name="type" required>{opportunityTypes.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>WORK MODE *</span><select name="mode" required>{workModes.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
                <label><span>LOCATION</span><input name="location" maxLength="100" placeholder="Hyderabad / India / Remote" /></label>
                <label><span>APPLICATION DEADLINE</span><input name="deadline" type="date" /></label>
                <label className={styles.fullField}><span>ORIGINAL APPLICATION URL *</span><input name="applicationUrl" type="url" inputMode="url" required placeholder="https://company.com/careers/..." /></label>
                <label><span>STIPEND / CTC</span><input name="compensation" maxLength="100" placeholder="₹25,000/month or not disclosed" /></label>
                <label><span>SKILLS / TAGS</span><input name="tags" maxLength="150" placeholder="React, Python, DSA" /></label>
              </div>

              <fieldset className={styles.yearFieldset}>
                <legend>ELIGIBLE GRADUATION YEARS *</legend>
                <div>{graduationYears.map((item) => <label key={item}><input type="checkbox" name="graduationYears" value={item} /><span>{item}</span></label>)}</div>
              </fieldset>

              <label className={styles.textareaField}><span>SHORT DESCRIPTION *</span><textarea name="summary" required minLength="40" maxLength="800" rows="5" placeholder="What will the candidate work on? What skills or requirements matter?" /></label>

              <div className={styles.formGrid}>
                <label><span>YOUR NAME *</span><input name="submitterName" required maxLength="80" autoComplete="name" /></label>
                <label><span>KMIT EMAIL / CONTACT *</span><input name="submitterEmail" type="email" required maxLength="120" autoComplete="email" placeholder="you@example.com" /></label>
              </div>

              <label className={styles.confirmField}>
                <input type="checkbox" required />
                <span>I checked the original source and believe this opportunity is genuine. I understand it will be reviewed before publishing.</span>
              </label>

              {formError ? <p className={styles.formError} role="alert">{formError}</p> : null}

              <div className={styles.formActions}>
                <button className="button button--solid" type="submit">Send for verification <span>↗</span></button>
                <p>Without a connected form endpoint, this opens a prepared email to Recurse. Your draft also stays on this device.</p>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      <div className={`${styles.toast} ${toast ? styles.toastVisible : ""}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
