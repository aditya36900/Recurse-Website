"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { isValidRoll, normalizeRoll } from "@/lib/ghost";
import s from "./GhostProcess.module.css";

const storageKey = "recurse-ghost-process";
const instagram = "https://www.instagram.com/recurse.official/";

const steps = ["Identify", "Trace", "Environment", "Decode", "Restore"];
const objectives = [
  "Identify yourself to open a diagnostic session.",
  "Something is hiding in the system. Find what it left behind.",
  "The trace points outside the terminal. Find a way into the user environment.",
  "An archive was touched. Recover what was taken and decode it.",
  "You have the key. Restore the system.",
  "System restored. Send your completion code to Recurse.",
];
const quickCommands = ["help", "status", "ps", "clear"];
const knownCommands = ["help", "status", "ps", "cat", "clear", "whoami", "decode", "restore"];

const boot = [
  "Help will always be given at Recurse for those who ask it.",
  "",
  "An unknown process has been detected.",
  "Its origin is unclear.",
  "Investigate the terminal. Find what it left behind.",
];

const folders = {
  home: ["README.txt", "activity.log"],
  Documents: ["system-note.txt"],
  System: ["integrity.log"],
  Downloads: ["image-cache.log"],
  Archives: ["recovery_payload.txt"],
};

function fileContents(name, payload) {
  return {
    "README.txt": "RECURSE OS // USER ENVIRONMENT\nPersonal workspace restored.",
    "activity.log": "No recent user activity.",
    "system-note.txt": "A recovery archive was accessed by an unknown process.\nCheck Archives.",
    "integrity.log": "Integrity monitor offline.",
    "image-cache.log": "Cache clean.",
    "recovery_payload.txt": payload,
  }[name];
}

function decodeKey(payload) {
  try {
    return atob(payload).replace(/^RESTORE:\s*/, "");
  } catch {
    return "";
  }
}

// Returns either plain output text or { action } for commands that change the screen.
function run(value, { roll, payload }) {
  const [name = "", ...rest] = value.trim().split(/\s+/);
  const arg = rest.join(" ");
  const command = name.toLowerCase();

  if (command === "help")
    return "AVAILABLE DIAGNOSTIC COMMANDS\n\nhelp       Display this guide\nstatus     Inspect system health\nps         Inspect running processes\ncat        Read a file\nclear      Clear terminal output\n\nSome system functions remain undocumented.\nFollow the evidence to discover them.";
  if (command === "status")
    return "SYSTEM STATUS: DEGRADED\nINTEGRITY: UNKNOWN\nACTIVE PROCESSES: 4\nUNIDENTIFIED PROCESS: DETECTED";
  if (command === "whoami") return `${roll}\nROLE: INVESTIGATOR\nCLEARANCE: GUEST`;
  if (command === "ps")
    return "PID     PROCESS     STATUS\n101     systemd     RUNNING\n204     web-core    RUNNING\n318     asset-sync  DEGRADED\n1337    ghostd      UNKNOWN  ◀\n\nTRACE DETECTED: /var/log/.ghost_trace";
  if (command === "cat" && arg === "/var/log/.ghost_trace")
    return { action: "trace", text: "GHOST TRACE // LOG 001\n\nSomething is happening inside the user environment.\nTerminal diagnostics cannot reach it.\n\nSYSTEM NOTE: The user environment may need to be opened separately." };
  if (command === "cat") return arg ? `cat: ${arg}: No such file or directory` : "usage: cat <file>";
  if (command === "open" && ["os", "user", "environment", "user environment"].includes(arg.toLowerCase()))
    return { action: "os" };
  if (value.trim() === payload)
    return "ENCRYPTED ARCHIVE DETECTED\nThis payload cannot be read directly.\nUse decode followed by the payload to decrypt it.";
  if (command === "decode") return arg === payload ? { action: "decode" } : "DECODE FAILED\nPAYLOAD NOT RECOGNISED";
  if (command === "restore") return arg ? { action: "restore", key: arg } : "usage: restore <key>";
  return `command not found: ${name || value}. Type 'help' for diagnostic commands.`;
}

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function save(data) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch {}
}

async function post(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, data };
}

export default function GhostProcess() {
  const [view, setView] = useState("alert");
  const [stage, setStage] = useState(0);
  const [roll, setRoll] = useState("");
  const [rollInput, setRollInput] = useState("");
  const [payload, setPayload] = useState("");
  const [code, setCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [input, setInput] = useState("");
  const [log, setLog] = useState([]);
  const [commands, setCommands] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [folder, setFolder] = useState("home");
  const [file, setFile] = useState(null);
  const [found, setFound] = useState(false);
  const [modal, setModal] = useState(false);
  const [copied, setCopied] = useState("");
  const [clock, setClock] = useState("");
  const output = useRef(null);
  const field = useRef(null);
  const stick = useRef(true);

  const key = decodeKey(payload);
  const advance = (n) => setStage((current) => Math.max(current, n));

  useEffect(() => {
    const saved = loadSaved();
    if (saved.roll) setRollInput(saved.roll);
  }, []);

  useEffect(() => {
    if (output.current && stick.current) output.current.scrollTop = output.current.scrollHeight;
  }, [log]);

  useEffect(() => {
    if (view === "terminal" && !modal) field.current?.focus({ preventScroll: true });
  }, [view, modal]);

  useEffect(() => {
    if (view !== "restoring") return;
    const timer = setTimeout(() => setView("success"), 2200);
    return () => clearTimeout(timer);
  }, [view]);

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }));
    tick();
    const timer = setInterval(tick, 15000);
    return () => clearInterval(timer);
  }, []);

  const identify = async (event) => {
    event.preventDefault();
    const value = normalizeRoll(rollInput);
    if (!isValidRoll(value)) {
      setAuthError("Enter a valid KMIT roll number, e.g. 24BD1A0501.");
      return;
    }
    setAuthBusy(true);
    setAuthError("");
    try {
      const saved = loadSaved();
      let next = saved.roll === value && saved.payload ? saved.payload : "";
      if (!next) {
        const { ok, data } = await post("/api/ghost/start", { roll: value });
        if (!ok || !data.payload) throw new Error(data.error || "Could not open a session. Try again.");
        next = data.payload;
      }
      save({ roll: value, payload: next });
      setRoll(value);
      setPayload(next);
      advance(1);
      setView("terminal");
    } catch (error) {
      setAuthError(
        error instanceof TypeError ? "Recurse servers are unreachable. Check your connection." : error.message,
      );
    } finally {
      setAuthBusy(false);
    }
  };

  const restore = async (attempt, id) => {
    setBusy(true);
    let result;
    try {
      const { ok, data } = await post("/api/ghost/restore", { roll, key: attempt });
      result = ok && data.code ? { code: data.code } : { text: `RECOVERY FAILED\n${data.error || "INVALID RESTORATION KEY"}` };
    } catch {
      result = { text: "RECOVERY FAILED\nCONNECTION TO RECURSE LOST. TRY AGAIN." };
    }
    setBusy(false);
    if (result.code) {
      setLog((entries) => entries.map((e) => (e.id === id ? { ...e, r: "RECOVERY KEY ACCEPTED\nINITIALIZING RESTORATION..." } : e)));
      setCode(result.code);
      save({ roll, payload, code: result.code });
      advance(5);
      setView("restoring");
    } else {
      setLog((entries) => entries.map((e) => (e.id === id ? { ...e, r: result.text, warn: true } : e)));
    }
  };

  const execute = (raw) => {
    const value = raw.trim();
    if (!value || busy) return;
    setInput("");
    setHistoryIndex(-1);
    setCommands((list) => [...list, value]);
    stick.current = true;
    if (value.toLowerCase() === "clear") {
      setLog([]);
      return;
    }

    const id = Date.now() + Math.random();
    const result = run(value, { roll, payload });
    if (typeof result === "string") {
      setLog((entries) => [...entries, { id, v: value, r: result, warn: /UNKNOWN|FAILED|not found/.test(result) }]);
      return;
    }
    if (result.action === "trace") {
      advance(2);
      setLog((entries) => [...entries, { id, v: value, r: result.text }]);
    } else if (result.action === "os") {
      advance(3);
      setLog((entries) => [...entries, { id, v: value, r: "USER ENVIRONMENT ACCESS GRANTED" }]);
      setView("os");
    } else if (result.action === "decode") {
      advance(4);
      setLog((entries) => [...entries, { id, v: "decode [payload]", r: "DECRYPTING ARCHIVE..." }]);
      setModal(true);
    } else if (result.action === "restore") {
      setLog((entries) => [...entries, { id, v: value, r: "VERIFYING RESTORATION KEY..." }]);
      restore(result.key, id);
    }
  };

  const change = (value) => {
    if (found && value.trimEnd() === "decode" && /\s$/.test(value)) setInput(`decode ${payload}`);
    else setInput(value);
  };

  const onKeyDown = (event) => {
    if (event.key === "Tab" && input && !input.includes(" ")) {
      const match = knownCommands.find((c) => c.startsWith(input.toLowerCase()));
      if (match) {
        event.preventDefault();
        setInput(`${match} `);
      }
      return;
    }
    if (!["ArrowUp", "ArrowDown"].includes(event.key) || !commands.length) return;
    event.preventDefault();
    const next =
      event.key === "ArrowUp" ? Math.min(historyIndex + 1, commands.length - 1) : Math.max(historyIndex - 1, -1);
    setHistoryIndex(next);
    setInput(next < 0 ? "" : commands[commands.length - 1 - next]);
  };

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
    } catch {
      setCopied("select");
    }
    setTimeout(() => setCopied(""), 2200);
  };

  const prompt = `${roll.toLowerCase() || "guest"}@recurse:~$`;
  const restored = view === "success" || view === "restoring";

  return (
    <main className={`${s.page} ${restored ? s.isRestored : ""}`}>
      <div className={s.grid} aria-hidden="true" />
      <div className={s.scan} aria-hidden="true" />

      <header className={s.bar}>
        <a className={s.brand} href="/" aria-label="Back to Recurse home">
          <Image src="/recurse-logo-white.png" alt="" width={464} height={135} priority />
        </a>
        <p className={s.barTitle}>GHOST PROCESS <span>// 01</span></p>
        <p className={s.session}>
          <i className={restored ? s.dotOk : s.dotAlert} />
          {roll ? `SESSION: ${roll}` : "SESSION: UNAUTHENTICATED"}
        </p>
      </header>

      {view !== "alert" && (
        <ol className={s.steps} aria-label="Investigation progress">
          {steps.map((label, i) => (
            <li
              key={label}
              className={stage > i ? s.stepDone : stage === i ? s.stepActive : ""}
              aria-current={stage === i ? "step" : undefined}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {label}
            </li>
          ))}
        </ol>
      )}

      {view === "alert" && (
        <section className={s.alert}>
          <div className={s.alertCopy}>
            <p className={s.eyebrow}>
              <i className={s.dotAlert} /> SYS.ALERT // UNEXPECTED BEHAVIOUR
            </p>
            <p className={s.kicker}>recurse@kmit:~$ ps --unknown</p>
            <h1>
              Breach
              <span>detected.</span>
            </h1>
            <p className={s.lede}>
              An unidentified process is running inside Recurse. Its origin is unclear and it is
              taking things that are not its own. Trace it, decode what it left behind, and restore
              the system.
            </p>
            <dl className={s.meta}>
              <div><dt>PROCESS</dt><dd>ghostd / PID 1337</dd></div>
              <div><dt>THREAT</dt><dd className={s.alertText}>UNKNOWN</dd></div>
              <div><dt>INTEGRITY</dt><dd><b className={s.meter}><em /></b> 16%</dd></div>
            </dl>
          </div>

          <form className={s.card} onSubmit={identify} noValidate>
            <p className={s.cardLabel}><span>01</span> Identify yourself</p>
            <h2>Every investigator gets their own key.</h2>
            <p className={s.cardNote}>
              Enter your roll number to open a diagnostic session. The ghost leaves a different trail
              for everyone, so keys can&apos;t be shared.
            </p>
            <label htmlFor="roll">ROLL NUMBER</label>
            <input
              id="roll"
              value={rollInput}
              onChange={(e) => {
                setRollInput(e.target.value.toUpperCase());
                setAuthError("");
              }}
              placeholder="24BD1A0501"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck="false"
              maxLength={14}
              aria-invalid={Boolean(authError)}
              aria-describedby="roll-error"
            />
            <p id="roll-error" className={s.error} role="alert">{authError}</p>
            <button className={s.solid} disabled={authBusy}>
              {authBusy ? "OPENING SESSION..." : "BEGIN INVESTIGATION"} <span>→</span>
            </button>
          </form>
        </section>
      )}

      {view === "terminal" && (
        <section className={s.workspace}>
          <div className={s.window}>
            <div className={s.chrome}>
              <span className={s.lights} aria-hidden="true"><i /><i /><i /></span>
              <b>recurse — diagnostic — pid 1337</b>
              <span className={s.degraded}>SYS.01 / DEGRADED</span>
            </div>
            <div
              className={s.output}
              ref={output}
              onClick={() => window.getSelection()?.isCollapsed && field.current?.focus({ preventScroll: true })}
              onScroll={(e) => {
                const n = e.currentTarget;
                stick.current = n.scrollHeight - n.scrollTop - n.clientHeight < 24;
              }}
              aria-live="polite"
            >
              {boot.map((line, i) => (
                <p key={i} className={i === 0 ? s.green : s.dim} style={{ "--i": i }}>{line || " "}</p>
              ))}
              {log.map((entry) => (
                <div key={entry.id} className={s.entry}>
                  <p className={s.command}><span>{prompt}</span> {entry.v}</p>
                  <p className={entry.warn ? s.warning : undefined}>{entry.r}</p>
                </div>
              ))}
            </div>
            <div className={s.chips} aria-label="Quick commands">
              {quickCommands.map((c) => (
                <button key={c} type="button" onClick={() => execute(c)}>{c}</button>
              ))}
            </div>
            <form
              className={s.prompt}
              onSubmit={(e) => {
                e.preventDefault();
                execute(input);
              }}
            >
              <label htmlFor="cmd">{prompt}</label>
              <input
                id="cmd"
                ref={field}
                value={input}
                onChange={(e) => change(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Terminal command"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck="false"
                disabled={busy}
              />
              <button disabled={busy}>{busy ? "..." : "RUN ↵"}</button>
            </form>
          </div>

          <aside className={s.caseFile}>
            <p className={s.cardLabel}><span>//</span> Case file</p>
            <dl>
              <div><dt>INVESTIGATOR</dt><dd>{roll}</dd></div>
              <div><dt>TARGET</dt><dd>ghostd / PID 1337</dd></div>
              <div><dt>STATUS</dt><dd className={s.alertText}>AT LARGE</dd></div>
            </dl>
            <div className={s.objective}>
              <span>CURRENT OBJECTIVE</span>
              <p>{objectives[stage]}</p>
            </div>
            <p className={s.tip}>↑ ↓ history · Tab completes · type <code>help</code> to begin</p>
          </aside>

          {modal && (
            <div className={s.modal} role="dialog" aria-modal="true" aria-labelledby="decoded">
              <section>
                <p className={s.cardLabel}><span>✓</span> Decode successful</p>
                <h2 id="decoded">RESTORE:<br /><b>{key}</b></h2>
                <small>This key was generated for {roll} alone. Use it in the terminal.</small>
                <button
                  className={s.solid}
                  onClick={() => {
                    navigator.clipboard?.writeText(key).catch(() => {});
                    setModal(false);
                    setInput(`restore ${key}`);
                  }}
                >
                  COPY KEY &amp; CONTINUE <span>→</span>
                </button>
              </section>
            </div>
          )}
        </section>
      )}

      {view === "os" && (
        <section className={s.osWrap}>
          <div className={`${s.window} ${s.os}`}>
            <div className={s.chrome}>
              <button className={s.back} onClick={() => setView("terminal")}>← TERMINAL</button>
              <b>RECURSE OS // USER ENVIRONMENT</b>
              <span>{clock}</span>
            </div>
            <div className={s.osBody}>
              <nav className={s.folders} aria-label="Folders">
                {Object.keys(folders).map((name) => (
                  <button
                    key={name}
                    className={folder === name ? s.active : undefined}
                    onClick={() => {
                      setFolder(name);
                      setFile(null);
                    }}
                  >
                    <span aria-hidden="true">▣</span> {name}
                  </button>
                ))}
              </nav>
              <div className={s.files}>
                <p className={s.path}>/users/{roll.toLowerCase()}/{folder === "home" ? "" : folder}{file ? `/${file}` : ""}</p>
                {file ? (
                  <article className={s.viewer}>
                    <button className={s.back} onClick={() => setFile(null)}>← BACK</button>
                    <h2>{file}</h2>
                    <pre>{fileContents(file, payload)}</pre>
                    {file === "recovery_payload.txt" && (
                      <div className={s.viewerActions}>
                        <button className={s.outline} onClick={() => copy(payload, "payload")}>
                          {copied === "payload" ? "PAYLOAD COPIED" : "COPY ENCRYPTED PAYLOAD"}
                        </button>
                        <button
                          className={s.solid}
                          onClick={() => {
                            setFound(true);
                            setView("terminal");
                            setInput("decode ");
                          }}
                        >
                          RETURN TO TERMINAL <span>→</span>
                        </button>
                      </div>
                    )}
                  </article>
                ) : (
                  <div className={s.fileGrid}>
                    {folders[folder].map((name) => (
                      <button key={name} className={s.file} onClick={() => setFile(name)}>
                        <span aria-hidden="true">{name.endsWith(".log") ? "≣" : "▤"}</span>
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {view === "restoring" && (
        <section className={s.restoring}>
          <p className={s.cardLabel}><span>✓</span> Access granted</p>
          <h1>Restoring<span>system.</span></h1>
          <b className={s.loader}><em /></b>
          <ul>
            <li>TERMINATING GHOST PROCESS</li>
            <li>REPAIRING SYSTEM INTEGRITY</li>
            <li>LOGGING INVESTIGATOR {roll}</li>
          </ul>
        </section>
      )}

      {view === "success" && (
        <section className={s.success}>
          <p className={s.eyebrow}><i className={s.dotOk} /> GHOST PROCESS TERMINATED</p>
          <h1>System<span>restored.</span></h1>
          <p className={s.lede}>
            Recurse is back online, and your solve has been logged. Copy your completion code and
            send it to us on Instagram.
          </p>
          <div className={s.codeCard}>
            <dl>
              <div><dt>INVESTIGATOR</dt><dd>{roll}</dd></div>
              <div><dt>INTEGRITY</dt><dd>100%</dd></div>
            </dl>
            <span>COMPLETION CODE</span>
            <code>{code}</code>
            <div className={s.viewerActions}>
              <button className={s.solid} onClick={() => copy(code, "code")}>
                {copied === "code" ? "CODE COPIED" : copied === "select" ? "SELECT THE CODE ABOVE" : "COPY CODE"} <span>⧉</span>
              </button>
              <a className={s.outline} href={instagram} target="_blank" rel="noreferrer">
                MESSAGE RECURSE <span>↗</span>
              </a>
            </div>
          </div>
          <a className={s.home} href="/">← Back to recurse</a>
        </section>
      )}

      <div className={s.ticker} aria-hidden="true">
        <div>
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>
              {restored ? "SYSTEM ONLINE + INTEGRITY RESTORED + GHOST TERMINATED + " : "TRACE IT + DECODE IT + RESTORE IT + HELP IS GIVEN TO THOSE WHO ASK + "}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
