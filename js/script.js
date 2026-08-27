/* ==========================================================
   YOWDRINK — script.js
   Fetches data/videos.json + data/content.json and renders
   the page. Falls back to inline data if fetch fails
   (e.g. opened directly via file:// without a local server).
   ========================================================== */
(() => {
  "use strict";

  /* ---------- fallback data (used if JSON fetch fails) ---------- */
  const FALLBACK_VIDEOS = [
    { id: "Sn2P-y0BuDE", title: "Racikan Signature YowDrink", category: "Behind The Cup", description: "Proses racik minuman kekinian dari dapur YowDrink." }
  ];
  const FALLBACK_CONTENT = {
    stats: [{ target: 100, suffix: "+", label: "Cup Terjual" }],
    menuCategories: [],
    builder: { bases: [{ id: "thai", label: "Thai Tea", color: "#C9642A", price: 15000 }], toppings: [{ id: "boba", label: "Boba Pearl", price: 3000 }] },
    features: [],
    gallery: [],
    testimonials: [],
    outlets: [],
    contact: { whatsapp: "#", email: "", social: {} }
  };

  const FEATURE_ICONS = {
    leaf:  `<svg viewBox="0 0 24 24" fill="none"><path d="M20 4C10 4 3 11 4 20c9 1 16-6 16-16z" fill="var(--maroon-deep)"/></svg>`,
    bolt:  `<svg viewBox="0 0 24 24" fill="none"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="var(--maroon-deep)"/></svg>`,
    coin:  `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="var(--maroon-deep)" stroke-width="1.8"/><path d="M12 7v10M9 9.5c0-1.5 1.3-2.5 3-2.5s3 1 3 2.3c0 3-6 1.7-6 4.7 0 1.3 1.3 2.3 3 2.3s3-1 3-2.5" stroke="var(--maroon-deep)" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.4-9.5-8.8C.7 7.8 2.6 4 6.3 4c2 0 3.4 1 4.7 2.7C12.3 5 13.7 4 15.7 4c3.7 0 5.6 3.8 3.8 7.2C19 15.6 12 20 12 20z" fill="var(--maroon-deep)"/></svg>`
  };

  const SOCIAL_ICONS = {
    instagram: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="var(--maroon)" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="var(--maroon)" stroke-width="1.6"/><circle cx="17.2" cy="6.8" r="1.1" fill="var(--maroon)"/></svg>`,
    tiktok: `<svg viewBox="0 0 24 24" fill="none"><path d="M14 3v10.5a2.7 2.7 0 1 1-2-2.6" stroke="var(--maroon)" stroke-width="1.6" stroke-linecap="round"/><path d="M14 3c.3 2 2 3.5 4 3.7" stroke="var(--maroon)" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="4" stroke="var(--maroon)" stroke-width="1.6"/><path d="M10 9l6 3-6 3V9z" fill="var(--maroon)"/></svg>`
  };

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");

  async function loadJSON(path, fallback) {
    try {
      const res = await fetch(path, { cache: "no-cache" });
      if (!res.ok) throw new Error("bad response");
      return await res.json();
    } catch (err) {
      console.warn(`Gagal memuat ${path}, memakai data cadangan.`, err);
      return fallback;
    }
  }

  /* ============================================================
     NAVBAR
     ============================================================ */
  function initNav() {
    const nav = $("#nav");
    const burger = $("#burger");
    const links = $("#navLinks");

    window.addEventListener("scroll", () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);
    }, { passive: true });

    burger.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });

    $$("a", links).forEach(a => a.addEventListener("click", () => {
      links.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }));
  }

  function initBackToTop() {
    const btn = $("#backToTop");
    window.addEventListener("scroll", () => {
      btn.classList.toggle("is-visible", window.scrollY > 480);
    }, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function initReveal() {
    const items = $$("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      items.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(el => io.observe(el));
  }

  /* ============================================================
     STATS
     ============================================================ */
  function renderStats(stats) {
    const grid = $("#statsGrid");
    grid.innerHTML = stats.map(s => `
      <div class="stat" data-target="${s.target}" data-suffix="${s.suffix || ""}">
        <div class="stat__num">0${s.suffix || ""}</div>
        <div class="stat__label">${s.label}</div>
      </div>
    `).join("");

    const els = $$(".stat", grid);
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => animateCount(el));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    els.forEach(el => io.observe(el));
  }

  function animateCount(el) {
    const target = parseFloat(el.dataset.target) || 0;
    const suffix = el.dataset.suffix || "";
    const isFloat = !Number.isInteger(target);
    const numEl = $(".stat__num", el);
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * target;
      numEl.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ============================================================
     MENU
     ============================================================ */
  function renderMenu(categories) {
    const wrap = $("#menuCategories");
    wrap.innerHTML = categories.map(cat => `
      <div data-reveal>
        <div class="menu__cat-head">
          <h3>${cat.name}</h3>
          <span class="menu__cat-code">${cat.code}</span>
        </div>
        <div class="menu__items">
          ${cat.items.map(item => `
            <div class="menu-item">
              <div class="menu-item__img"><img src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.src='https://picsum.photos/seed/${item.code}/200/200'"></div>
              <div class="menu-item__body">
                <div class="menu-item__top">
                  <span class="menu-item__code">${item.code}</span>
                  ${item.tag ? `<span class="menu-item__tag">${item.tag}</span>` : ""}
                </div>
                <h4>${item.name}</h4>
                <span class="menu-item__price">Rp${item.price}</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");
    initReveal();
  }

  /* ============================================================
     FEATURES
     ============================================================ */
  function renderFeatures(features) {
    const grid = $("#featuresGrid");
    grid.innerHTML = features.map(f => `
      <div class="feature-card" data-reveal>
        <div class="feature-card__icon">${FEATURE_ICONS[f.icon] || FEATURE_ICONS.leaf}</div>
        <h3>${f.title}</h3>
        <p>${f.desc}</p>
      </div>
    `).join("");
    initReveal();
  }

  /* ============================================================
     PHOTO GALLERY + LIGHTBOX
     ============================================================ */
  function renderGallery(gallery) {
    const grid = $("#galleryGrid");
    grid.innerHTML = gallery.map((g, i) => `
      <div class="gallery__item" data-caption="${g.caption}" data-index="${i}">
        <img src="${g.img}" alt="${g.caption}" loading="lazy" onerror="this.src='https://picsum.photos/seed/gallery${i}/500/500'">
      </div>
    `).join("");

    const lightbox = $("#lightbox");
    const lightboxImg = $("#lightboxImg");
    const lightboxCaption = $("#lightboxCaption");

    $$(".gallery__item", grid).forEach((item, i) => {
      item.addEventListener("click", () => {
        lightboxImg.src = gallery[i].img;
        lightboxImg.alt = gallery[i].caption;
        lightboxCaption.textContent = gallery[i].caption;
        openOverlay(lightbox);
      });
    });

    $("#lightboxClose").addEventListener("click", () => closeOverlay(lightbox));
    $("#lightboxBackdrop").addEventListener("click", () => closeOverlay(lightbox));
  }

  /* ============================================================
     TESTIMONIALS
     ============================================================ */
  function renderTestimonials(testimonials) {
    const grid = $("#testiGrid");
    grid.innerHTML = testimonials.map(t => `
      <div class="testi-card" data-reveal>
        <p class="testi-card__quote">“${t.quote}”</p>
        <div class="testi-card__who">
          <strong>${t.name}</strong>
          <span>${t.role}</span>
        </div>
      </div>
    `).join("");
    initReveal();
  }

  /* ============================================================
     FOOTER
     ============================================================ */
  function renderFooter(contact, outlets) {
    $("#year").textContent = new Date().getFullYear();

    const outletCol = $("#footerOutlets");
    outletCol.innerHTML = `<h3>Outlet</h3>` + outlets.map(o => `
      <div class="footer__outlet">
        <strong>${o.name}</strong>
        <span>${o.address}</span>
      </div>
    `).join("");

    const contactCol = $("#footerContact");
    contactCol.innerHTML = `
      <h3>Kontak</h3>
      <a href="${contact.whatsapp}" target="_blank" rel="noopener noreferrer">Order via WhatsApp</a>
      <a href="mailto:${contact.email || ""}">${contact.email || ""}</a>
    `;

    const social = $("#footerSocial");
    social.innerHTML = Object.entries(contact.social || {}).map(([key, url]) => `
      <a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${key}">
        ${SOCIAL_ICONS[key] || ""}
      </a>
    `).join("");
  }

  /* ============================================================
     DRINK BUILDER — "Racik Sendiri"
     ============================================================ */
  function initBuilder(builderData) {
    const bases = builderData.bases || [];
    const toppings = builderData.toppings || [];
    if (!bases.length || !toppings.length) return;

    const baseWrap = $("#baseOptions");
    const toppingWrap = $("#toppingOptions");
    const sugarRange = $("#sugarRange");
    const iceRange = $("#iceRange");
    const sugarVal = $("#sugarVal");
    const iceVal = $("#iceVal");
    const cupFill = $("#cupFill");
    const cupToppings = $("#cupToppings");

    const ICE_LABELS = ["Sedikit", "Normal", "Banyak"];
    const ICE_LEVELS = [0.85, 0.65, 0.45]; // fraction of cup height filled with liquid (rest = ice space)

    let state = {
      base: bases[0],
      topping: toppings[0],
      sugar: 50,
      ice: 1
    };

    baseWrap.innerHTML = bases.map(b => `<button class="pill" data-id="${b.id}">${b.label}</button>`).join("");
    toppingWrap.innerHTML = toppings.map(t => `<button class="pill" data-id="${t.id}">${t.label}</button>`).join("");

    function setActive(wrap, id) {
      $$(".pill", wrap).forEach(p => p.classList.toggle("is-active", p.dataset.id === id));
    }

    function drawToppings() {
      cupToppings.innerHTML = "";
      if (state.topping.id === "boba" || state.topping.id === "jelly") {
        const color = state.topping.id === "boba" ? "#2A1414" : "#4C6B3E";
        const positions = [[62,225],[78,232],[96,236],[114,232],[130,225],[70,215],[122,215]];
        positions.forEach(([cx, cy]) => {
          const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          c.setAttribute("cx", cx); c.setAttribute("cy", cy); c.setAttribute("r", 6);
          c.setAttribute("fill", color);
          cupToppings.appendChild(c);
        });
      } else if (state.topping.id === "cheese" || state.topping.id === "oat") {
        const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        r.setAttribute("x", 40); r.setAttribute("y", 108); r.setAttribute("width", 120); r.setAttribute("height", 18);
        r.setAttribute("fill", "#FBF3E7"); r.setAttribute("opacity", "0.9");
        cupToppings.appendChild(r);
      }
    }

    function update() {
      cupFill.setAttribute("fill", state.base.color);
      const fillFrac = ICE_LEVELS[state.ice];
      const totalHeight = 200; // from y=40 to y=240 roughly
      const fillHeight = totalHeight * fillFrac;
      const fillY = 240 - fillHeight;
      cupFill.setAttribute("y", fillY);
      cupFill.setAttribute("height", fillHeight);
      drawToppings();

      sugarVal.textContent = state.sugar + "%";
      iceVal.textContent = ICE_LABELS[state.ice];

      const total = state.base.price + state.topping.price;
      $("#rBase").textContent = state.base.label;
      $("#rTopping").textContent = state.topping.label;
      $("#rSugarIce").textContent = `${state.sugar}% / ${ICE_LABELS[state.ice]}`;
      $("#rTotal").textContent = rupiah(total);
    }

    baseWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".pill");
      if (!btn) return;
      state.base = bases.find(b => b.id === btn.dataset.id);
      setActive(baseWrap, state.base.id);
      update();
    });
    toppingWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".pill");
      if (!btn) return;
      state.topping = toppings.find(t => t.id === btn.dataset.id);
      setActive(toppingWrap, state.topping.id);
      update();
    });
    sugarRange.addEventListener("input", () => {
      state.sugar = parseInt(sugarRange.value, 10);
      update();
    });
    iceRange.addEventListener("input", () => {
      state.ice = parseInt(iceRange.value, 10);
      update();
    });

    setActive(baseWrap, state.base.id);
    setActive(toppingWrap, state.topping.id);
    update();
  }

  /* ============================================================
     VIDEO CAROUSEL
     ============================================================ */
  function initCarousel(videos) {
    const track = $("#videoTrack");
    const dotsWrap = $("#videoDots");
    const prevBtn = $("#prevBtn");
    const nextBtn = $("#nextBtn");
    const modal = $("#videoModal");
    const modalFrame = $("#modalFrame");

    track.innerHTML = videos.map(v => `
      <li class="video-card">
        <div class="video-card__thumb" data-id="${v.id}" role="button" tabindex="0" aria-label="Putar video: ${v.title}">
          <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="${v.title}" loading="lazy">
          <span class="video-card__play">
            <svg viewBox="0 0 24 24" fill="var(--maroon-deep)"><path d="M8 5v14l11-7z"/></svg>
          </span>
        </div>
        <div class="video-card__body">
          <span class="video-card__cat">${v.category}</span>
          <h3>${v.title}</h3>
          <p>${v.description}</p>
        </div>
      </li>
    `).join("");

    function openVideo(id) {
      modalFrame.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" title="Video player" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
      openOverlay(modal);
    }
    $$(".video-card__thumb", track).forEach(thumb => {
      thumb.addEventListener("click", () => openVideo(thumb.dataset.id));
      thumb.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") openVideo(thumb.dataset.id);
      });
    });
    $("#modalClose").addEventListener("click", () => closeVideoModal());
    $("#modalBackdrop").addEventListener("click", () => closeVideoModal());
    function closeVideoModal() {
      closeOverlay(modal);
      modalFrame.innerHTML = "";
    }

    /* ---- slide logic ---- */
    let perView = getPerView();
    let index = 0;

    function getPerView() {
      const w = window.innerWidth;
      if (w <= 820) return 1;
      if (w <= 1024) return 2;
      return 3;
    }

    function maxIndex() {
      return Math.max(0, videos.length - perView);
    }

    function renderDots() {
      const count = maxIndex() + 1;
      dotsWrap.innerHTML = Array.from({ length: count }, (_, i) =>
        `<button data-i="${i}" aria-label="Ke slide ${i + 1}"></button>`
      ).join("");
      $$("button", dotsWrap).forEach(btn => {
        btn.addEventListener("click", () => goTo(parseInt(btn.dataset.i, 10)));
      });
      updateDots();
    }

    function updateDots() {
      $$("button", dotsWrap).forEach((btn, i) => btn.classList.toggle("is-active", i === index));
    }

    function goTo(i) {
      index = Math.max(0, Math.min(i, maxIndex()));
      const card = track.children[0];
      const cardWidth = card ? card.getBoundingClientRect().width : 0;
      const gap = 24;
      track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
      updateDots();
    }

    prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn.addEventListener("click", () => goTo(index + 1));

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        perView = getPerView();
        renderDots();
        goTo(Math.min(index, maxIndex()));
      }, 150);
    });

    let touchStartX = 0;
    track.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (diff > 50) goTo(index - 1);
      else if (diff < -50) goTo(index + 1);
    }, { passive: true });

    renderDots();
    goTo(0);
  }

  /* ============================================================
     OVERLAY HELPERS
     ============================================================ */
  function openOverlay(el) {
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeOverlay(el) {
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function initEscClose() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const modal = $("#videoModal");
      const lightbox = $("#lightbox");
      if (modal.classList.contains("is-open")) {
        closeOverlay(modal);
        $("#modalFrame").innerHTML = "";
      }
      if (lightbox.classList.contains("is-open")) closeOverlay(lightbox);
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  async function init() {
    initNav();
    initBackToTop();
    initEscClose();
    initReveal();

    const [videos, content] = await Promise.all([
      loadJSON("data/videos.json", FALLBACK_VIDEOS),
      loadJSON("data/content.json", FALLBACK_CONTENT)
    ]);

    renderStats(content.stats || []);
    renderMenu(content.menuCategories || []);
    initBuilder(content.builder || {});
    renderFeatures(content.features || []);
    renderGallery(content.gallery || []);
    renderTestimonials(content.testimonials || []);
    renderFooter(content.contact || {}, content.outlets || []);
    initCarousel(videos);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
