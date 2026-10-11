"use client";

import { useEffect } from "react";

const terminalCommands = {
  help:
    "Commands: about, events, opportunities, writes, codenovate, cigs, impact, team, join, results, instagram, clear",
  about:
    "Recurse is KMIT's technical club for CS + ECE builders who want to go beyond the classroom.",
  events:
    "Codenovate / KBC / Real Life Subway Surfers / CoinQuest / Reboot / CIG / Engineer'd",
  opportunities:
    "Browse verified internships, fresher roles, fellowships, and research opportunities at /opportunities.",
  writes:
    "Explore weekly articles written by Recurse members on tech, dev, and culture at /recursewrites.",
  codenovate:
    "Codenovate 2.0: 376 registered teams, 61 finalist teams, 239 on-site builders, and 24 hours to ship.",
  cigs:
    "Three active groups: Web Development, AI & Machine Learning, and DSA / Competitive Programming.",
  impact:
    "120 ReBoot participants / 376 Codenovate teams / 65 CIG members / 280+ DBS viewers.",
  team:
    "Club Head: Jai Atul Parmar. Co-Club Head: Morsu Greeshma. Visit /team for the core team.",
  join:
    "Final recruitment results are live at /recruitment/results. Follow @recurse.official for future updates.",
  results:
    "Final selected list: /recruitment/results. Search by roll number in all caps.",
  instagram: "https://www.instagram.com/recurse.official/",
};

export function useSiteInteractions() {
  useEffect(() => {
    const cleanups = [];
    const bootScreen = document.querySelector(".boot-screen");
    const header = document.querySelector("[data-header]");
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const mobileNav = document.querySelector("[data-mobile-nav]");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const skipBoot = new URLSearchParams(window.location.search).has("skipboot");

    if (skipBoot) {
      bootScreen?.classList.add("is-skipped");
    } else if (reducedMotion) {
      bootScreen?.classList.add("is-hidden");
    } else {
      const bootTimer = window.setTimeout(
        () => bootScreen?.classList.add("is-hidden"),
        1250,
      );
      cleanups.push(() => window.clearTimeout(bootTimer));
    }

    const updateHeader = () => {
      header?.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", updateHeader));

    const toggleMenu = () => {
      const isOpen = menuToggle?.getAttribute("aria-expanded") === "true";
      menuToggle?.setAttribute("aria-expanded", String(!isOpen));
      mobileNav?.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    };

    menuToggle?.addEventListener("click", toggleMenu);
    cleanups.push(() => menuToggle?.removeEventListener("click", toggleMenu));

    const mobileLinks = mobileNav?.querySelectorAll("a, button") ?? [];
    const closeMenu = () => {
      menuToggle?.setAttribute("aria-expanded", "false");
      mobileNav?.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    };

    mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));
    cleanups.push(() =>
      mobileLinks.forEach((link) =>
        link.removeEventListener("click", closeMenu),
      ),
    );

    const revealItems = document.querySelectorAll(".reveal");
    let revealObserver;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
      );

      revealItems.forEach((item) => revealObserver.observe(item));
      cleanups.push(() => revealObserver.disconnect());
    }

    const counters = document.querySelectorAll("[data-count]");
    const counterFrames = new Set();

    const runCounter = (element) => {
      const target = Number(element.dataset.count);
      const duration = 850;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.round(target * eased)).padStart(
          2,
          "0",
        );

        if (progress < 1) {
          const frame = requestAnimationFrame(tick);
          counterFrames.add(frame);
        }
      };

      const frame = requestAnimationFrame(tick);
      counterFrames.add(frame);
    };

    if ("IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            runCounter(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.7 },
      );

      counters.forEach((counter) => counterObserver.observe(counter));
      cleanups.push(() => counterObserver.disconnect());
    } else {
      counters.forEach((counter) => runCounter(counter));
    }

    cleanups.push(() =>
      counterFrames.forEach((frame) => cancelAnimationFrame(frame)),
    );

    const filterButtons = document.querySelectorAll("[data-filter]");
    const eventCards = document.querySelectorAll("[data-category]");
    const filterHandlers = new Map();

    filterButtons.forEach((button) => {
      const handler = () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");

        eventCards.forEach((card) => {
          const shouldShow =
            filter === "all" || card.dataset.category === filter;
          card.classList.toggle("is-hidden", !shouldShow);
        });
      };

      filterHandlers.set(button, handler);
      button.addEventListener("click", handler);
    });

    cleanups.push(() =>
      filterHandlers.forEach((handler, button) =>
        button.removeEventListener("click", handler),
      ),
    );

    const timelineItems = document.querySelectorAll("[data-timeline-item]");
    let timelineObserver;

    if (timelineItems.length) {
      if (reducedMotion || !("IntersectionObserver" in window)) {
        timelineItems.forEach((item) => item.classList.add("is-active"));
      } else {
        timelineObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-active");
            });
          },
          { threshold: 0.48, rootMargin: "0px 0px -18% 0px" },
        );

        timelineItems.forEach((item) => timelineObserver.observe(item));
        cleanups.push(() => timelineObserver.disconnect());
      }
    }

    const canvas = document.querySelector("[data-network]");
    const context = canvas?.getContext("2d");

    if (canvas && context && !reducedMotion) {
      let points = [];
      let frameId;
      let pointer = { x: -1000, y: -1000 };
      let isAnimating = true;

      const resizeCanvas = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        const pointCount = Math.min(
          65,
          Math.max(28, Math.floor(rect.width / 22)),
        );
        points = Array.from({ length: pointCount }, () => ({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
        }));
      };

      const drawNetwork = () => {
        if (!isAnimating) return;
        const rect = canvas.getBoundingClientRect();
        context.clearRect(0, 0, rect.width, rect.height);

        points.forEach((point) => {
          point.x += point.vx;
          point.y += point.vy;

          if (point.x < 0 || point.x > rect.width) point.vx *= -1;
          if (point.y < 0 || point.y > rect.height) point.vy *= -1;

          const pointerDistance = Math.hypot(
            point.x - pointer.x,
            point.y - pointer.y,
          );
          if (pointerDistance < 150) {
            point.x += (point.x - pointer.x) * 0.002;
            point.y += (point.y - pointer.y) * 0.002;
          }
        });

        for (let index = 0; index < points.length; index += 1) {
          for (
            let comparison = index + 1;
            comparison < points.length;
            comparison += 1
          ) {
            const distance = Math.hypot(
              points[index].x - points[comparison].x,
              points[index].y - points[comparison].y,
            );

            if (distance < 130) {
              context.beginPath();
              context.moveTo(points[index].x, points[index].y);
              context.lineTo(points[comparison].x, points[comparison].y);
              context.strokeStyle = `rgba(168, 255, 53, ${
                0.08 * (1 - distance / 130)
              })`;
              context.stroke();
            }
          }
        }

        points.forEach((point) => {
          context.beginPath();
          context.arc(point.x, point.y, 1.25, 0, Math.PI * 2);
          context.fillStyle = "rgba(168, 255, 53, 0.36)";
          context.fill();
        });

        frameId = requestAnimationFrame(drawNetwork);
      };

      const handlePointerMove = (event) => {
        const rect = canvas.getBoundingClientRect();
        pointer = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      };

      const handlePointerLeave = () => {
        pointer = { x: -1000, y: -1000 };
      };

      const handleVisibility = () => {
        if (document.hidden) {
          isAnimating = false;
          cancelAnimationFrame(frameId);
        } else {
          isAnimating = true;
          drawNetwork();
        }
      };

      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerleave", handlePointerLeave);
      window.addEventListener("resize", resizeCanvas);
      document.addEventListener("visibilitychange", handleVisibility);

      resizeCanvas();
      drawNetwork();

      cleanups.push(() => {
        isAnimating = false;
        cancelAnimationFrame(frameId);
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.removeEventListener("pointerleave", handlePointerLeave);
        window.removeEventListener("resize", resizeCanvas);
        document.removeEventListener("visibilitychange", handleVisibility);
      });
    }

    const terminalForm = document.querySelector("[data-terminal-form]");
    const terminalInput = terminalForm?.querySelector("input");
    const terminalOutput = document.querySelector("[data-terminal-output]");

    const handleTerminalSubmit = (event) => {
      event.preventDefault();
      const command = terminalInput?.value.trim().toLowerCase();
      if (!command || !terminalInput || !terminalOutput) return;

      const commandLine = document.createElement("p");
      commandLine.className = "terminal-command";
      commandLine.textContent = `visitor@recurse:~$ ${command}`;
      terminalOutput.appendChild(commandLine);

      if (command === "clear") {
        terminalOutput.innerHTML = "";
      } else {
        const response = document.createElement("p");
        response.className = terminalCommands[command]
          ? "terminal-response terminal-response--green"
          : "terminal-error";
        response.textContent =
          terminalCommands[command] ||
          `command not found: ${command}. Type "help" for available commands.`;
        terminalOutput.appendChild(response);
      }

      terminalInput.value = "";
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    terminalForm?.addEventListener("submit", handleTerminalSubmit);
    cleanups.push(() =>
      terminalForm?.removeEventListener("submit", handleTerminalSubmit),
    );

    const year = document.querySelector("[data-year]");
    if (year) year.textContent = String(new Date().getFullYear());

    return () => {
      closeMenu();
      cleanups.reverse().forEach((cleanup) => cleanup());
    };
  }, []);
}
