(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const root = document.documentElement;

  const navbar = document.getElementById("navbar");
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const yearEl = document.getElementById("year");
  const scrollbarBar = document.getElementById("scrollbarBar");
  const toast = document.getElementById("toast");

  const projectsGrid = document.getElementById("projectsGrid");
  const filters = Array.from(document.querySelectorAll(".filter"));
  const projectSearch = document.getElementById("projectSearch");

  const themeToggle = document.getElementById("themeToggle");
  const themeToggleMobile = document.getElementById("themeToggleMobile");

  const themeIconMoon = document.getElementById("themeIconMoon");
  const themeIconSun = document.getElementById("themeIconSun");
  const fabTheme = document.getElementById("fabTheme");
  const fabMoon = document.getElementById("fabMoon");
  const fabSun = document.getElementById("fabSun");

  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalTag = document.getElementById("modalTag");
  const modalDesc = document.getElementById("modalDesc");
  const modalViews = document.getElementById("modalViews");
  const modalCtr = document.getElementById("modalCtr");
  const modalOutcome = document.getElementById("modalOutcome");
  const modalBullets = document.getElementById("modalBullets");

  // TODO: Ganti link kamu di sini
  const LINKS = {
    instagram: "https://www.instagram.com/annisaesce/",
    tiktok: "https://www.tiktok.com/@annisaesce",
    youtube: "https://www.youtube.com/@AnnisaHanif",
    email: "mailto:annisahanif161@gmail.com",
    whatsapp: "https://wa.me/6289519561589?text=Halo%20saya%20mau%20collab%20untuk%20project%20konten."
  };

  // set links
  const linkIG = document.getElementById("linkIG");
  const linkTT = document.getElementById("linkTT");
  const linkYT = document.getElementById("linkYT");
  const linkEmail = document.getElementById("linkEmail");
  const whatsappBtn = document.getElementById("whatsappBtn");

  linkIG && (linkIG.href = LINKS.instagram);
  linkTT && (linkTT.href = LINKS.tiktok);
  linkYT && (linkYT.href = LINKS.youtube);
  linkEmail && (linkEmail.href = LINKS.email);
  whatsappBtn && (whatsappBtn.href = LINKS.whatsapp);

  const fabWhatsApp = document.getElementById("fabWhatsApp");
  const fabInstagram = document.getElementById("fabInstagram");
  const fabTikTok = document.getElementById("fabTikTok");

  fabWhatsApp && (fabWhatsApp.href = LINKS.whatsapp);
  fabInstagram && (fabInstagram.href = LINKS.instagram);
  fabTikTok && (fabTikTok.href = LINKS.tiktok);

  yearEl && (yearEl.textContent = String(new Date().getFullYear()));

  // CV download (validasi dummy)
  const cvBtn = document.getElementById("downloadCV");
  if (cvBtn) {
    cvBtn.addEventListener("click", (e) => {
      const href = cvBtn.getAttribute("href"); // contoh: "test.pdf"
      if (!href || href === "#" || href.includes("test.pdf")) {
        e.preventDefault();
        showToast("Taruh file CV kamu (mis. cv.pdf), lalu ubah link-nya.");
        return;
      }
      // biar kebuka tab baru kalau file bener
      cvBtn.setAttribute("target", "_blank");
      cvBtn.setAttribute("rel", "noopener");
    });
  }

  // THEME
  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function updateThemeIcons(theme) {
    const isLight = theme === "light";
    themeIconMoon && themeIconMoon.classList.toggle("hidden", isLight);
    themeIconSun && themeIconSun.classList.toggle("hidden", !isLight);
    fabMoon && fabMoon.classList.toggle("hidden", isLight);
    fabSun && fabSun.classList.toggle("hidden", !isLight);
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateThemeIcons(theme);
  }

  function initTheme() {
    const saved = localStorage.getItem("theme");
    setTheme(saved || systemTheme());
  }

  function toggleTheme() {
    const cur = root.getAttribute("data-theme") || "dark";
    setTheme(cur === "dark" ? "light" : "dark");
  }

  initTheme();
  themeToggle && themeToggle.addEventListener("click", toggleTheme);
  themeToggleMobile && themeToggleMobile.addEventListener("click", toggleTheme);
  fabTheme && fabTheme.addEventListener("click", toggleTheme);

  // Mobile menu
  const setMobileOpen = (open) => {
    if (!burger || !mobileMenu) return;
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    mobileMenu.classList.toggle("open", open);
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
  };

  burger && burger.addEventListener("click", () => setMobileOpen(!mobileMenu.classList.contains("open")));
  mobileMenu && mobileMenu.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.matches("[data-close]")) setMobileOpen(false);
  });

  // Navbar + progress bar
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    navbar && navbar.classList.toggle("scrolled", y > 8);

    const doc = document.documentElement;
    const scrollMax = (doc.scrollHeight - doc.clientHeight) || 1;
    const pct = Math.min(1, Math.max(0, y / scrollMax));
    scrollbarBar && (scrollbarBar.style.width = (pct * 100).toFixed(2) + "%");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (!prefersReducedMotion) {
    const rev = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          rev.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => rev.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }

  // =========================
  // THUMBNAIL (UNIK PER PROJECT)
  // =========================
  function hashStr(str) {
    // hash kecil biar warna beda-beda
    str = String(str || "");
    let h = 2166136261; // FNV-ish
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0);
  }

  function pick(arr, idx) {
    return arr[idx % arr.length];
  }

  function thumbPlaceholder(label, seed) {
    const safe = String(label || "Project").slice(0, 20).replace(/[<>&]/g, "");
    const h = hashStr(seed || label || safe);

    const g1 = ["#22d3ee", "#a78bfa", "#34d399", "#fb7185", "#60a5fa", "#fbbf24"];
    const g2 = ["#7c3aed", "#06b6d4", "#10b981", "#f43f5e", "#2563eb", "#f97316"];
    const c1 = pick(g1, h);
    const c2 = pick(g2, h >> 3);
    const dot = pick(["#fb7185", "#fbbf24", "#60a5fa", "#34d399", "#a78bfa"], h >> 6);

    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="${c1}" stop-opacity=".60"/>
            <stop offset="1" stop-color="${c2}" stop-opacity=".60"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="700" fill="#05060d"/>
        <rect width="1200" height="700" fill="url(#bg)" opacity=".35"/>
        <circle cx="980" cy="180" r="140" fill="${dot}" opacity=".18"/>
        <text x="60" y="360" fill="white" font-size="54" font-family="Arial" opacity=".92">${safe}</text>
      </svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  // Projects
  const PROJECTS = [
    {
      id: "p1", platform: "tiktok",
      title: "Seller Story — Hook Retention",
      desc: "Problem → proof → CTA (clean).",
      views: "1.2M", ctr: "4.6%", outcome: "Leads +23",
      bullets: ["Rewrite hook 2 detik.", "Pacing + SFX.", "CTA variations."],
      // kalau nanti punya gambar asli: ganti ke "assets/projects/p1.jpg"
      thumb: "assets/annisa.jfif" // kosong dulu → auto placeholder unik
    },
    {
      id: "p2", platform: "instagram",
      title: "UGC Ads — Premium Look",
      desc: "Trust-first, minimal overlay.",
      views: "640K", ctr: "3.8%", outcome: "DM ↑",
      bullets: ["Storyboard singkat.", "Grade soft.", "A/B ending."],
      thumb: "assets/annisa-2.jpg"
    },
    {
      id: "p3", platform: "youtube",
      title: "Shorts — 3 Part Series",
      desc: "Series buat repeat views.",
      views: "980K", ctr: "3.1%", outcome: "Subs +1.4K",
      bullets: ["Cliffhanger halus.", "Template edit.", "Pinned CTA."],
      thumb: ""
    },
    {
      id: "p4", platform: "tiktok",
      title: "Property Myth-Busting",
      desc: "Fast debunk + proof.",
      views: "410K", ctr: "4.2%", outcome: "Leads ↑",
      bullets: ["Pattern interrupt.", "1 data + 1 contoh.", "CTA keyword."],
      thumb: ""
    },
    {
      id: "p5", platform: "instagram",
      title: "Emotional VO — Save & Share",
      desc: "Cinematic VO, clean text.",
      views: "520K", ctr: "2.9%", outcome: "Saves ↑",
      bullets: ["Micro-confession.", "Beat sync.", "Caption CTA."],
      thumb: ""
    },
    {
      id: "p6", platform: "youtube",
      title: "Explain in 30s",
      desc: "Complex → simple.",
      views: "760K", ctr: "3.5%", outcome: "Watchtime ↑",
      bullets: ["Analogy cepat.", "Text sync.", "Teaser end."],
      thumb: ""
    },
    {
      id: "p7", platform: "instagram",
      title: "Explain in 30s",
      desc: "Complex → simple.",
      views: "760K", ctr: "3.5%", outcome: "Watchtime ↑",
      bullets: ["Analogy cepat.", "Text sync.", "Teaser end."],
      thumb: "assets/triptracker.jpeg"
    },
    {
      id: "p8", platform: "instagram",
      title: "Desain Logo 3D",
      desc: "Complex → simple.",
      views: "760K", ctr: "3.5%", outcome: "Watchtime ↑",
      bullets: ["Analogy cepat.", "Text sync.", "Teaser end."],
      thumb: "assets/p8.jpeg"
    },
    {
      id: "p9", platform: "lemon",
      title: "Gaya Hidup Sehat",
      desc: "Complex → simple.",
      views: "760K", ctr: "3.5%", outcome: "Watchtime ↑",
      bullets: ["Analogy cepat.", "Text sync.", "Teaser end."],
      thumb: "assets/lemon-1.png"
    },
  ].map(p => ({
    ...p,
    // kalau p.thumb kosong → auto placeholder unik per id
    thumb: p.thumb && String(p.thumb).trim() ? p.thumb : thumbPlaceholder(p.title, p.id)
  }));

  const platformLabel = (p) => (
    p === "tiktok" ? "TikTok" :
      p === "instagram" ? "Instagram" :
        p === "lemon" ? "Lemon" :
          p === "youtube" ? "YouTube" : "Platform"
  );

  let activeFilter = "all";
  let query = "";

  function renderProjects() {
    if (!projectsGrid) return;

    const q = query.trim().toLowerCase();
    const items = PROJECTS.filter(p => {
      const matchesFilter = (activeFilter === "all") || (p.platform === activeFilter);
      const matchesQuery = !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });

    projectsGrid.innerHTML = items.map(p => `
      <article class="project card3d reveal is-visible" data-tilt data-tilt-strength="12">
        <div class="project__thumb">
          <img src="${escapeAttr(p.thumb)}" alt="" loading="lazy" decoding="async">
        </div>

        <div class="project__top">
          <div class="tag ${p.platform}">${platformLabel(p.platform)}</div>
          <div class="tag">Script + Edit</div>
        </div>

        <h3 class="project__title">${escapeHtml(p.title)}</h3>
        <p class="project__desc">${escapeHtml(p.desc)}</p>

        <div class="project__meta">
          <span class="pmeta"><strong>${escapeHtml(p.views)}</strong> views</span>
          <span class="pmeta"><strong>${escapeHtml(p.ctr)}</strong> CTR</span>
          <span class="pmeta">${escapeHtml(p.outcome)}</span>
        </div>

        <div class="project__actions">
          <button class="btn btn--primary" data-open="${p.id}" data-tilt data-tilt-strength="10">
            Case Study
            <span class="btn__glow" aria-hidden="true"></span>
          </button>
          <a class="btn btn--ghost" href="#contact" data-tilt data-tilt-strength="10">Start</a>
        </div>
      </article>
    `).join("");

    projectsGrid.querySelectorAll("[data-open]").forEach(btn => {
      btn.addEventListener("click", () => openModal(btn.getAttribute("data-open")));
    });

    if (!prefersReducedMotion) initTiltWithin(projectsGrid);
  }

  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      filters.forEach(b => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      activeFilter = btn.dataset.filter || "all";
      renderProjects();
    });
  });

  projectSearch && projectSearch.addEventListener("input", (e) => {
    query = e.target.value || "";
    renderProjects();
  });

  renderProjects();

  // Modal
  const openModal = (id) => {
    const p = PROJECTS.find(x => x.id === id);
    if (!p || !modal) return;

    if (modalTag) {
      modalTag.textContent = platformLabel(p.platform);
      modalTag.className = "modal__tag tag " + p.platform;
    }

    modalTitle && (modalTitle.textContent = p.title);
    modalDesc && (modalDesc.textContent = p.desc);
    modalViews && (modalViews.textContent = p.views);
    modalCtr && (modalCtr.textContent = p.ctr);
    modalOutcome && (modalOutcome.textContent = p.outcome);

    if (modalBullets) {
      modalBullets.innerHTML = "";
      p.bullets.forEach(b => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="dot"></span> ${escapeHtml(b)}`;
        modalBullets.appendChild(li);
      });
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (!prefersReducedMotion) initTiltWithin(modal);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  modal && modal.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.matches("[data-close-modal]")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) closeModal();
  });

  // Contact form demo
  // const contactForm = document.getElementById("contactForm");
  // contactForm && contactForm.addEventListener("submit", (e) => {
  //   // e.preventDefault();
  //   const fd = new FormData(contactForm);
  //   const name = (fd.get("name") || "").toString().trim();
  //   showToast(`Makasih, ${name || "kak"}! Pesan udah terkirim.`);
  //   // contactForm.reset();
  // });

  // Contact form (Formspree)
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fd = new FormData(contactForm);
      const name = (fd.get("name") || "").toString().trim();

      // WAJIB: ganti dengan endpoint formspree kamu
      const FORMSPREE_URL = "https://formspree.io/f/xeeoyydw";

      try {
        const res = await fetch(FORMSPREE_URL, {
          method: "POST",
          body: fd,
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          showToast(`Makasih, ${name || "kak"}! Pesan kamu sudah terkirim ✅`);
          contactForm.reset();
        } else {
          const data = await res.json().catch(() => ({}));
          showToast(data?.error || "Gagal mengirim pesan. Coba lagi ya.");
        }
      } catch (err) {
        showToast("Koneksi bermasalah. Coba lagi ya.");
      }
    });
  }


  // Toast
  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  // 3D Tilt
  function initTiltWithin(rootEl = document) {
    const nodes = Array.from(rootEl.querySelectorAll("[data-tilt]"));
    nodes.forEach(el => {
      if (el.__tiltBound) return;
      el.__tiltBound = true;

      // Simpan transform awal (kalau ada) supaya efek tilt tidak "nimpah" positioning.
      // Ini penting untuk elemen yang memang butuh transform bawaan (mis. dulu modal pakai translate untuk center).
      const baseTransform = (el.dataset.tiltBaseTransform != null)
        ? el.dataset.tiltBaseTransform
        : (el.style.transform || "");
      el.dataset.tiltBaseTransform = baseTransform;

      const strength = clamp(parseFloat(el.dataset.tiltStrength || "12"), 4, 22);
      let raf = null;

      const onMove = (ev) => {
        const rect = el.getBoundingClientRect();
        const x = (ev.clientX - rect.left) / rect.width;
        const y = (ev.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * strength;
        const ry = (x - 0.5) * strength;

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const base = baseTransform ? (baseTransform + " ") : "";
          el.style.transform = base + `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(0)`;
          el.style.willChange = "transform";
        });
      };

      const onLeave = () => {
        if (raf) cancelAnimationFrame(raf);
        el.style.transform = baseTransform || "";
        el.style.willChange = "";
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      el.addEventListener("touchstart", onLeave, { passive: true });
    });
  }

  if (!prefersReducedMotion) initTiltWithin(document);

  // Parallax blobs
  const blobA = document.querySelector(".blob--a");
  const blobB = document.querySelector(".blob--b");
  const blobC = document.querySelector(".blob--c");

  if (!prefersReducedMotion && blobA && blobB && blobC) {
    let mx = 0, my = 0;
    let scheduled = false;

    function apply() {
      scheduled = false;
      const tx = mx, ty = my;
      blobA.style.transform = `translate3d(${(tx * 36).toFixed(2)}px, ${(ty * 28).toFixed(2)}px, 0)`;
      blobB.style.transform = `translate3d(${(-tx * 40).toFixed(2)}px, ${(ty * 22).toFixed(2)}px, 0)`;
      blobC.style.transform = `translate3d(${(tx * 28).toFixed(2)}px, ${(-ty * 30).toFixed(2)}px, 0)`;
    }

    window.addEventListener("mousemove", (e) => {
      mx = (e.clientX / window.innerWidth) - 0.5;
      my = (e.clientY / window.innerHeight) - 0.5;
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(apply);
      }
    }, { passive: true });
  }

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  function escapeAttr(str) {
    return String(str).replaceAll('"', "&quot;");
  }
})();


// =========================
// NAVBAR STICKY + ACTIVE LINK DINAMIS
// =========================

// NOTE: Bagian ini berada di luar IIFE, jadi perlu ambil ulang element DOM-nya.
const navbar = document.getElementById("navbar");
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");

// 1) Set tinggi navbar ke CSS variable biar body padding-top pas
function syncNavHeight() {
  if (!navbar) return;
  const h = navbar.getBoundingClientRect().height || 80;
  document.documentElement.style.setProperty("--nav-h", h + "px");
}
syncNavHeight();
window.addEventListener("resize", syncNavHeight);

// 2) Helper: set active class berdasarkan id section
const navLinks = Array.from(document.querySelectorAll(".nav__link[data-link]"));

function setActiveNav(id) {
  navLinks.forEach(a => {
    const isActive = a.dataset.link === id;
    a.classList.toggle("active", isActive);
    a.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

// 3) Active link dinamis via IntersectionObserver
const sectionIds = navLinks.map(a => a.dataset.link).filter(Boolean);
const sections = sectionIds
  .map(id => document.getElementById(id))
  .filter(Boolean);

if (sections.length) {
  const obs = new IntersectionObserver((entries) => {
    // cari entry yang paling "kelihatan"
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible && visible.target && visible.target.id) {
      setActiveNav(visible.target.id);
      // update hash halus (optional)
      // history.replaceState(null, "", "#" + visible.target.id);
    }
  }, {
    // aktif saat section masuk area tengah viewport
    root: null,
    threshold: [0.2, 0.35, 0.5, 0.65],
    rootMargin: "-35% 0px -55% 0px"
  });

  sections.forEach(sec => obs.observe(sec));

  // saat load pertama kali: kalau ada hash, langsung aktifkan
  const initial = (location.hash || "").replace("#", "");
  if (initial && sectionIds.includes(initial)) setActiveNav(initial);
  else setActiveNav(sectionIds[0] || "home");
}

// 4) Pastikan navbar tidak pernah “ngilang” karena CSS/JS lain
// (kalau ada class seperti hide/hidden dari kode lama)
function forceNavbarVisible() {
  if (!navbar) return;
  navbar.classList.remove("hide", "hidden", "nav--hidden", "is-hidden");
  // kalau ada transform yang geser ke atas
  if (navbar.style.transform && navbar.style.transform.includes("translate")) {
    navbar.style.transform = "";
  }
}
forceNavbarVisible();
window.addEventListener("scroll", forceNavbarVisible, { passive: true });

// 5) Optional: klik menu → close mobile menu + active update cepat
document.querySelectorAll('.nav__links a.nav__link, .nav__mobile a.nav__mLink').forEach(a => {
  a.addEventListener("click", () => {
    // tutup mobile menu (kalau kebuka)
    if (mobileMenu && mobileMenu.classList.contains("open")) {
      burger && burger.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
    }

    const hash = (a.getAttribute("href") || "").replace("#", "");
    if (hash) setActiveNav(hash);
  });
});

// Simple 3D tilt (safe)
document.querySelectorAll("[data-tilt]").forEach(card => {
  const strength = 12;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -strength;
    const rotateY = ((x / rect.width) - 0.5) * strength;

    card.style.transform = `
      perspective(800px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(0)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
  });
});

