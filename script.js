(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Sticky header ---------------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile nav ---------------- */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  const navClose = document.getElementById("mobileNavClose");
  const navBackdrop = document.getElementById("mobileNavBackdrop");
  let scrollLockY = 0;

  const setNav = (open) => {
    mobileNav.classList.toggle("open", open);
    mobileNav.setAttribute("aria-hidden", String(!open));
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");

    if (open) {
      navBackdrop.hidden = false;
      // forzar reflow para que la transición de opacidad se aplique
      void navBackdrop.offsetWidth;
      navBackdrop.classList.add("open");
    } else {
      navBackdrop.classList.remove("open");
      setTimeout(() => { if (!mobileNav.classList.contains("open")) navBackdrop.hidden = true; }, 400);
    }

    // position:fixed evita que iOS Safari pierda la posición al bloquear el scroll
    if (open) {
      scrollLockY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollLockY}px`;
      document.body.style.width = "100%";
      navClose.focus();
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollLockY);
    }
  };

  navToggle.addEventListener("click", () => setNav(!mobileNav.classList.contains("open")));
  navClose.addEventListener("click", () => { setNav(false); navToggle.focus(); });
  navBackdrop.addEventListener("click", () => setNav(false));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav.classList.contains("open")) {
      setNav(false);
      navToggle.focus();
    }
  });

  mobileNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => setNav(false))
  );

  // Al volver a escritorio el drawer debe cerrarse y liberar el scroll
  window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => {
    if (e.matches && mobileNav.classList.contains("open")) setNav(false);
  });

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in-view"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (reducedMotion) {
      el.textContent = target;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countIO.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------------- Smooth anchor scroll (offset for fixed header) ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      // el header encoge al hacer scroll; compensar según su alto real
      const offset = Math.min(header.offsetHeight + 16, 96);
      // el drawer libera el scroll de forma asíncrona: esperar al siguiente frame
      requestAnimationFrame(() => {
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
      });
    });
  });

  /* ---------------- Hero network canvas ---------------- */
  const canvas = document.getElementById("network-canvas");
  // El enlazado es O(n²); en móvil no compensa para una capa decorativa al 35% de opacidad
  const isSmallScreen = window.matchMedia("(max-width: 640px)").matches;
  if (canvas && isSmallScreen) canvas.style.display = "none";

  if (canvas && !reducedMotion && !isSmallScreen) {
    const ctx = canvas.getContext("2d");
    let nodes, rafId = null, visible = true;
    // menos nodos en tablet: el coste crece con el cuadrado
    const NODE_COUNT = window.innerWidth < 1024 ? 28 : 46;
    const LINK_DIST = 150;
    // limitar el DPR evita rellenar 3x píxeles en pantallas retina
    const dpr = Math.min(devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initNodes = () => {
      const rect = canvas.getBoundingClientRect();
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > rect.width) n.vx *= -1;
        if (n.y < 0 || n.y > rect.height) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(79, 168, 224, ${0.22 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(140, 199, 236, 0.85)";
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    };

    const start = () => { if (rafId === null) rafId = requestAnimationFrame(draw); };
    const stop = () => { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } };

    resize();
    initNodes();
    start();

    // No gastar frames mientras el héroe está fuera de pantalla o la pestaña oculta
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => { visible = entry.isIntersecting; visible ? start() : stop(); },
        { threshold: 0 }
      ).observe(canvas);
    }
    document.addEventListener("visibilitychange", () => {
      document.hidden || !visible ? stop() : start();
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // el cambio de alto por la barra de URL móvil no debe reiniciar la animación
        resize();
        initNodes();
      }, 150);
    });
  }
})();
