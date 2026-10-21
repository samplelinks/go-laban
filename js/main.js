/* ==========================================================================
   GO LABAN · Shared script
   ========================================================================== */
(function () {
  "use strict";
  const CFG = window.GOLABAN || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Testimonials (5-star Google reviews) ---------- */
  const REVIEWS = [
    { n: "Dr. P. Niranjana", g: true, t: "The store may be cute and compact in size, but it delivers a memorable experience packed with flavour and originality. A superb range of flavours and combinations — every variety has its own distinct character.", m: "Food 5/5 · Service 5/5 · Atmosphere 5/5" },
    { n: "Iddly Italy", g: true, t: "Nice joint to satisfy your dessert cravings. We tried De Paris & Fazia cake… both were out of the world. Lip-smacking & yummy. I would definitely recommend this place!", m: "Dine in · Dinner" },
    { n: "Suruthi Pradee", t: "Amazing atmosphere… and the taste was so yummy 🤤😋 Good services, proper responses.", m: "Takeaway · Dinner" },
    { n: "Shibi Dhanapaul", t: "Best service and food I have experienced.", m: "Dine in" },
    { n: "Yamuna Poona", t: "Great mouth feel. Enjoyed the Arabian desserts.", m: "Delivery" },
    { n: "Kevin Dass", t: "The taste is very fantabulous and the service is also well and good 😊 Kid-friendly — yes, very fantabulous!", m: "Dine in · Dinner" },
    { n: "Rajesh Kannan", t: "Food is tasty. I am a regular customer at the KK Nagar shop. Customer service is good.", m: "Takeaway · Lunch" },
    { n: "Banu Sankari", t: "We had the same in the UAE — must try!", m: "Dine in" },
    { n: "Bhavesh Rajpurohit", t: "Amazing taste. Better experience.", m: "Google review" },
    { n: "Nagarajan Mithra", t: "Nice — they have the UAE foods.", m: "Google review" },
    { n: "Mathan Kumar", t: "Good shop. And the taste is good.", m: "Takeaway · Dinner" },
    { n: "Anish Kumar", t: "Very nice 🙂", m: "Google review" },
    { n: "Ruban", t: "Nice food.", m: "Google review" },
    { n: "Ameera Rosni", t: "Super!", m: "Food 5/5 · Service 5/5 · Atmosphere 5/5" },
    { n: "Geetha Priya", t: "Nice.", m: "Dine in" }
  ];
  const AV = ["#0b4e94", "#5bc236", "#1463c4", "#d9a066", "#7a4bd1", "#e0567a", "#0f8c8c", "#4a2a17"];
  const G_ICON = '<svg class="gl" viewBox="0 0 48 48" aria-label="Google"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const card = (r, i) => `<article class="rv"><div class="top"><span class="av" style="background:${AV[i % AV.length]}">${esc(r.n.replace(/^Dr\.?\s*P?\.?\s*/, "").charAt(0))}</span><span class="nm">${esc(r.n)}<small>${r.g ? "Local Guide · " : ""}Google review</small></span>${G_ICON}</div><div class="stars" aria-label="5 out of 5 stars">★★★★★</div><p>“${esc(r.t)}”</p><span class="meta">${esc(r.m)}</span></article>`;

  $$("[data-testimonials]").forEach(sec => {
    const feat = REVIEWS[0];
    const rest = REVIEWS.slice(1);
    const half = Math.ceil(rest.length / 2);
    const row = list => list.map((r, i) => card(r, i + (list === rest ? 0 : half))).join("");
    const a = rest.slice(0, half), b = rest.slice(half);
    sec.innerHTML = `
      <div class="wrap">
        <div class="sec-head on-light">
          <div class="reveal">
            <span class="kicker">Straight from Google</span>
            <h2 class="h-lg">Five stars, <em>no filter</em></h2>
            <p class="lead" style="margin-top:14px">Every review below is a genuine 5-star rating left by our guests on Google.</p>
          </div>
          <a class="rating-card reveal" style="--d:.1s" href="${CFG.GOOGLE_REVIEWS}" target="_blank" rel="noopener">
            ${G_ICON.replace('class="gl"', 'class="g"')}
            <div><b>4.2</b> <span class="stars">★★★★☆</span><small>49 Google reviews · tap to read all</small></div>
          </a>
        </div>
        <div class="feature-quote reveal zoom">
          <div class="big5"><div><b>5★</b><span>Local Guide</span></div></div>
          <div>
            <div class="stars5" style="color:#f6b500;letter-spacing:3px">★★★★★</div>
            <blockquote>“${esc(feat.t)}”</blockquote>
            <div class="who"><b>${esc(feat.n)}</b> · Local Guide · ${esc(feat.m)}</div>
          </div>
        </div>
      </div>
      <div class="rv-rows reveal">
        <div class="rv-row"><div class="rv-track">${row(a)}${row(a)}</div></div>
        <div class="rv-row r2"><div class="rv-track">${row(b)}${row(b)}</div></div>
      </div>
      <div class="reviews-cta"><a class="btn btn-blue" href="${CFG.GOOGLE_REVIEWS}" target="_blank" rel="noopener">Read all reviews on Google
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg></a></div>`;
    $$(".rv-row:nth-child(2) .rv-track article", sec).forEach((el, i) => {
      el.querySelector(".av").style.background = AV[(i + 3) % AV.length];
    });
  });

  /* ---------- Contact details from config ---------- */
  $$("[data-email]").forEach(a => { a.href = "mailto:" + CFG.EMAIL; if (!a.children.length) a.textContent = CFG.EMAIL; });
  $$("[data-phone]").forEach(a => { a.href = "tel:+" + CFG.PHONE_RAW; if (!a.children.length) a.textContent = CFG.PHONE; });
  $$("[data-wa]").forEach(a => {
    const msg = a.getAttribute("data-wa") || "Hi Go Laban! I'd like to place an order.";
    a.href = "https://wa.me/" + CFG.PHONE_RAW + "?text=" + encodeURIComponent(msg);
    a.target = "_blank"; a.rel = "noopener";
  });
  $$("[data-insta]").forEach(a => { a.href = CFG.INSTAGRAM; a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- Header + mobile nav ---------- */
  const header = $(".site-header");
  const bar = $(".progress");
  const onScroll = () => {
    const y = window.scrollY;
    header && header.classList.toggle("scrolled", y > 30);
    if (bar) {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    }
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const burger = $(".burger");
  burger && burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", open);
  });
  $$(".mobile-nav a").forEach(a => a.addEventListener("click", () => document.body.classList.remove("menu-open")));
  addEventListener("keydown", e => { if (e.key === "Escape") document.body.classList.remove("menu-open"); });

  const page = document.body.dataset.page;
  $$(`[data-nav="${page}"]`).forEach(a => { a.classList.add("active"); a.setAttribute("aria-current", "page"); });

  /* ---------- Marquees: duplicate content for seamless loop ---------- */
  $$(".marquee-track").forEach(t => { t.innerHTML += t.innerHTML; });

  /* ---------- Reveal on scroll ---------- */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: "0px 0px -40px 0px" }) : null;
  const watchReveal = () => $$(".reveal:not(.in)").forEach(el => io ? io.observe(el) : el.classList.add("in"));
  watchReveal();
  $$("[data-stagger]").forEach(g => $$(":scope > *", g).forEach((c, i) => { c.classList.add("reveal"); c.style.setProperty("--d", (i * 0.08) + "s"); io ? io.observe(c) : c.classList.add("in"); }));

  /* ---------- Counters ---------- */
  const cio = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || "";
    cio.unobserve(el);
    if (reduce) { el.textContent = to.toFixed(dec) + suf; return; }
    const t0 = performance.now(), dur = 1600;
    const tick = t => { const p = Math.min(1, (t - t0) / dur), v = to * (1 - Math.pow(1 - p, 4)); el.textContent = v.toFixed(dec) + suf; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .5 }) : null;
  $$("[data-count]").forEach(el => cio ? cio.observe(el) : (el.textContent = el.dataset.count));

  /* ---------- Word rotator ---------- */
  $$(".rotator").forEach(r => {
    const items = $$("span", r); let i = 0;
    items[0] && items[0].classList.add("on");
    if (reduce || items.length < 2) return;
    setInterval(() => { items[i].classList.remove("on"); i = (i + 1) % items.length; items[i].classList.add("on"); }, 2200);
  });

  /* ---------- Fine-pointer effects: tilt, magnetic, glow ---------- */
  if (fine && !reduce) {
    $$("[data-tilt]").forEach(el => {
      el.addEventListener("mousemove", e => {
        const b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
        el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
    $$("[data-magnetic]").forEach(el => {
      el.addEventListener("mousemove", e => {
        const b = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * .25}px,${(e.clientY - b.top - b.height / 2) * .35}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
    const glow = $(".cursor-glow");
    if (glow) {
      let gx = 0, gy = 0, tx = 0, ty = 0;
      addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; document.body.classList.add("has-glow"); }, { passive: true });
      const loop = () => { gx += (tx - gx) * .12; gy += (ty - gy) * .12; glow.style.transform = `translate(${gx}px,${gy}px)`; requestAnimationFrame(loop); };
      loop();
    }
  }

  /* ---------- Parallax ---------- */
  const px = $$("[data-speed]");
  if (px.length && !reduce) {
    const run = () => {
      px.forEach(el => {
        const b = el.getBoundingClientRect(), mid = b.top + b.height / 2 - innerHeight / 2;
        el.style.translate = `0 ${(-mid * parseFloat(el.dataset.speed)).toFixed(1)}px`;
      });
    };
    addEventListener("scroll", () => requestAnimationFrame(run), { passive: true }); run();
  }

  /* ---------- Optional photos (Trichy) + image fallbacks ---------- */
  $$("img[data-optional]").forEach(img => {
    const drop = () => { const t = img.closest(".tile") || img; const g = t.parentElement; t.remove(); if (g && !g.querySelector("img")) g.classList.add("none"); };
    if (img.complete && img.naturalWidth === 0) drop(); else img.addEventListener("error", drop);
  });
  $$("img[data-fallback]").forEach(img => {
    const use = () => { if (img.dataset.used) return; img.dataset.used = 1; img.src = img.dataset.fallback; if (img.dataset.fallbackPos) img.style.objectPosition = img.dataset.fallbackPos; };
    if (img.complete && img.naturalWidth === 0) use(); else img.addEventListener("error", use);
  });

  /* ---------- Lightbox ---------- */
  const zoomables = $$("[data-zoom]");
  if (zoomables.length) {
    const lb = document.createElement("div");
    lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true");
    lb.innerHTML = '<button class="x" aria-label="Close">×</button><button class="prev" aria-label="Previous">‹</button><img alt=""><button class="next" aria-label="Next">›</button><span class="count"></span>';
    document.body.appendChild(lb);
    const img = $("img", lb), count = $(".count", lb);
    let set = [], idx = 0;
    const show = () => { const el = set[idx]; img.src = el.dataset.zoom; img.alt = el.dataset.alt || ""; count.textContent = set.length > 1 ? `${idx + 1} / ${set.length}` : ""; $(".prev", lb).style.display = $(".next", lb).style.display = set.length > 1 ? "" : "none"; };
    const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; };
    zoomables.forEach(el => el.addEventListener("click", () => {
      const g = el.closest("[data-gallery]"); set = g ? $$("[data-zoom]", g) : [el]; idx = set.indexOf(el);
      show(); lb.classList.add("open"); document.body.style.overflow = "hidden"; $(".x", lb).focus();
    }));
    $(".x", lb).onclick = close;
    $(".prev", lb).onclick = e => { e.stopPropagation(); idx = (idx - 1 + set.length) % set.length; show(); };
    $(".next", lb).onclick = e => { e.stopPropagation(); idx = (idx + 1) % set.length; show(); };
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    addEventListener("keydown", e => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") $(".next", lb).click();
      if (e.key === "ArrowLeft") $(".prev", lb).click();
    });
  }

  /* ---------- Menu: category tabs ---------- */
  const tabs = $$(".tabs [data-cat]");
  tabs.forEach(t => t.addEventListener("click", () => {
    tabs.forEach(x => x.setAttribute("aria-selected", x === t));
    const c = t.dataset.cat;
    $$(".menu-cat").forEach(s => { s.hidden = !(c === "all" || s.dataset.cat === c); });
    $$(".menu-cat:not([hidden]) .reveal").forEach(el => el.classList.add("in"));
  }));

  /* ---------- Menu: build-your-bowl ---------- */
  const builder = $("[data-builder]");
  if (builder) {
    const img = $(".bowl img", builder), priceEl = $(".pricebubble b", builder), bubble = $(".pricebubble", builder);
    const nameEl = $(".builder-out .name", builder), order = $("[data-order]", builder);
    let base = $("[data-base][aria-pressed=true]", builder), flav = $("[data-flav][aria-pressed=true]", builder);
    const update = () => {
      const price = base.dataset.price;
      priceEl.textContent = "₹" + price;
      bubble.classList.remove("bump"); void bubble.offsetWidth; bubble.classList.add("bump");
      setTimeout(() => bubble.classList.remove("bump"), 400);
      nameEl.innerHTML = `<em>${esc(base.dataset.base)}</em> · ${esc(flav.dataset.flav)}`;
      const msg = `Hi Go Laban! I'd like to order: ${base.dataset.base} – ${flav.dataset.flav} (₹${price}).`;
      order.href = "https://wa.me/" + CFG.PHONE_RAW + "?text=" + encodeURIComponent(msg);
      $$(".flav-price").forEach(p => p.textContent = "₹" + price);
    };
    const swapImg = src => {
      if (img.getAttribute("src") === src) return;
      img.classList.add("swap");
      setTimeout(() => { img.src = src; img.onload = () => img.classList.remove("swap"); setTimeout(() => img.classList.remove("swap"), 300); }, 220);
    };
    $$("[data-base]", builder).forEach(b => b.addEventListener("click", () => {
      $$("[data-base]", builder).forEach(x => x.setAttribute("aria-pressed", x === b)); base = b; update();
    }));
    $$("[data-flav]", builder).forEach(b => b.addEventListener("click", () => {
      $$("[data-flav]", builder).forEach(x => x.setAttribute("aria-pressed", x === b)); flav = b; swapImg(b.dataset.img); update();
    }));
    update();
  }

  /* ---------- Contact: map switcher ---------- */
  const map = $("[data-map-frame]");
  $$("[data-map]").forEach(b => b.addEventListener("click", () => {
    $$("[data-map]").forEach(x => x.setAttribute("aria-pressed", x === b));
    map.src = "https://www.google.com/maps?q=" + encodeURIComponent(b.dataset.map) + "&output=embed";
  }));

  /* ---------- Forms → Google Apps Script ---------- */
  const phoneOk = v => /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(v.trim());
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  $$("form[data-form]").forEach(form => {
    const status = $(".form-status", form);
    const btn = $("button[type=submit]", form);
    const setErr = (f, m) => { const w = f.closest(".field"); if (!w) return; w.classList.toggle("err", !!m); const s = $(".msg", w); if (s) s.textContent = m || ""; };
    $$("input,select,textarea", form).forEach(f => f.addEventListener("input", () => setErr(f, "")));

    form.addEventListener("submit", async e => {
      e.preventDefault();
      status.className = "form-status"; status.textContent = "";
      let bad = null;
      $$("[required]", form).forEach(f => {
        let m = "";
        if (!f.value.trim()) m = "Please fill this in";
        else if (f.type === "tel" && !phoneOk(f.value)) m = "Enter a valid 10-digit mobile number";
        else if (f.type === "email" && !emailOk(f.value)) m = "Enter a valid email address";
        setErr(f, m); if (m && !bad) bad = f;
      });
      const em = $("input[type=email]:not([required])", form);
      if (em && em.value.trim() && !emailOk(em.value)) { setErr(em, "Enter a valid email address"); bad = bad || em; }
      if (bad) { bad.focus(); return; }
      if ($(".hp input", form) && $(".hp input", form).value) return; // bot

      const fd = new FormData(form);
      fd.delete("website");
      fd.append("formType", form.dataset.form);
      fd.append("page", location.pathname.split("/").pop() || "home.html");
      fd.append("submittedAt", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));

      if (!CFG.FORM_ENDPOINT) {
        status.className = "form-status bad";
        status.innerHTML = `The form isn't connected yet. Please email us at <a href="mailto:${CFG.EMAIL}" style="text-decoration:underline">${CFG.EMAIL}</a> or call <a href="tel:+${CFG.PHONE_RAW}" style="text-decoration:underline">${CFG.PHONE}</a>.`;
        return;
      }
      btn.disabled = true; btn.classList.add("loading");
      try {
        await fetch(CFG.FORM_ENDPOINT, { method: "POST", mode: "no-cors", body: new URLSearchParams(fd) });
        const ok = $(".form-success", form.parentElement);
        if (ok) { form.style.display = "none"; ok.classList.add("show"); ok.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); }
        else { status.className = "form-status ok"; status.textContent = "Thank you! We'll get back to you shortly."; }
        form.reset();
      } catch (err) {
        status.className = "form-status bad";
        status.innerHTML = `Couldn't send right now. Please try again, or email <a href="mailto:${CFG.EMAIL}" style="text-decoration:underline">${CFG.EMAIL}</a>.`;
      } finally {
        btn.disabled = false; btn.classList.remove("loading");
      }
    });
  });
  $$("[data-form-again]").forEach(b => b.addEventListener("click", () => {
    const wrap = b.closest(".form-card"); $(".form-success", wrap).classList.remove("show"); $("form", wrap).style.display = "";
  }));

  // Pre-select enquiry type from URL (?type=franchise)
  const q = new URLSearchParams(location.search).get("type");
  const sel = $("select[name=enquiryType]");
  if (q && sel) { const o = $$("option", sel).find(o => o.value.toLowerCase().startsWith(q.toLowerCase())); if (o) sel.value = o.value; }

  watchReveal();
})();
