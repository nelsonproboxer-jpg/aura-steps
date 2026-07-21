/* ============================================================
   AURA STEPS — shared site logic (header, theme, cart, pages)
   ============================================================ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
/* ---------- Currency (prices are authored in USD) ---------- */
let FX = { USD: 1, GBP: (typeof FX_FALLBACK !== "undefined" ? FX_FALLBACK.GBP : 0.74) };
/* Hydrate the cached rate synchronously so the very first render already
   uses the real rate (avoids prices flashing/differing between pages). */
try {
  const _fx = JSON.parse(localStorage.getItem("aura-fx") || "null");
  if (_fx && _fx.gbp) FX.GBP = _fx.gbp;
} catch (e) { /* ignore */ }

function getCurrency() {
  const c = localStorage.getItem("aura-currency");
  return c && typeof CURRENCIES !== "undefined" && CURRENCIES[c] ? c : "USD";
}
function money(usd) {
  const code = getCurrency();
  const cfg = (typeof CURRENCIES !== "undefined" && CURRENCIES[code]) || { symbol: "$", locale: "en-US" };
  return cfg.symbol + Math.round(Number(usd) * (FX[code] || 1)).toLocaleString(cfg.locale);
}
/* Tag an element with its USD value so it can be re-formatted on switch */
function setPrice(el, usd) {
  if (!el) return;
  el.dataset.usd = usd;
  el.textContent = money(usd);
}
function refreshPrices() {
  $$("[data-usd]").forEach((el) => { el.textContent = money(parseFloat(el.dataset.usd)); });
}
async function loadFx() {
  try {
    const cached = JSON.parse(localStorage.getItem("aura-fx") || "null");
    if (cached && cached.gbp && Date.now() - cached.t < 12 * 3600 * 1000) { FX.GBP = cached.gbp; return; }
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!res.ok) return;
    const d = await res.json();
    if (d && d.rates && d.rates.GBP) {
      FX.GBP = d.rates.GBP;
      localStorage.setItem("aura-fx", JSON.stringify({ t: Date.now(), gbp: FX.GBP }));
      refreshPrices();
    }
  } catch (e) { /* keep the fallback rate */ }
}
const escapeHtml = (s) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const productById = (id) => PRODUCTS.find((p) => p.id === id);
const productImage = (p, eager = false) =>
  `<img src="${p.image}" alt="${p.name} — ${p.style}" ${eager ? "" : 'loading="lazy"'} />`;

/* ---------- Theme ---------- */

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("aura-theme", theme);
  const btn = $("#themeToggle");
  if (btn) btn.innerHTML = theme === "dark" ? ICONS.sun : ICONS.moon;
}

/* ---------- Icons (inline SVG) ---------- */

const ICONS = {
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="21" height="21"><path d="M6 7h12l1.2 13a1 1 0 0 1-1 1.1H5.8a1 1 0 0 1-1-1.1L6 7Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="19" height="19"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.2M12 19.8V22M2 12h2.2M19.8 12H22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M19.1 4.9l-1.6 1.6M6.5 17.5l-1.6 1.6"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="19" height="19"><path d="M20.4 14.2A8.5 8.5 0 0 1 9.8 3.6a8.5 8.5 0 1 0 10.6 10.6Z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22" height="22"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="16" height="16"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3ZM19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z"/></svg>',
  gem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="20" height="20"><path d="M6 3h12l4 6-10 12L2 9l4-6Z"/><path d="M2 9h20M9 3l3 6 3-6M12 21 9 9M12 21l3-12"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="20" height="20"><path d="M1 5h14v11H1zM15 9h4l4 4v3h-8z"/><circle cx="6" cy="18.5" r="1.8"/><circle cx="18" cy="18.5" r="1.8"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="20" height="20"><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5"/></svg>',
  ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="20" height="20"><path d="m2 15 13-13 7 7-13 13-7-7Z"/><path d="m6.5 10.5 2 2M10 7l2 2M13.5 3.5l2 2"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="17" height="17"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="26" height="26"><path d="m4.5 12.5 5 5 10-11"/></svg>',
};

/* ---------- Header & footer ---------- */

function renderChrome(active) {
  const header = $("#siteHeader");
  if (header) {
    header.innerHTML = `
    <div class="nav-inner">
      <a class="brand" href="index.html" aria-label="Aura Steps — home">
        <img class="brand-logo" src="images/logo.png" alt="Aura Steps" />
      </a>
      <nav class="nav-links" id="navLinks">
        ${[
          ["index.html", "Home"],
          ["shop.html", "Shop"],
          ["size-guide.html", "Size Guide"],
          ["about.html", "About"],
          ["contact.html", "Contact"],
        ].map(([href, label]) =>
          `<a href="${href}" class="${active === href ? "active" : ""}">${label}</a>`
        ).join("")}
      </nav>
      <div class="nav-actions">
        <button class="icon-btn currency-btn" id="currencyToggle" aria-label="Switch currency" title="Switch currency"></button>
        <button class="icon-btn" id="themeToggle" aria-label="Toggle dark mode"></button>
        <a class="icon-btn bag-btn" href="cart.html" aria-label="Shopping bag">
          ${ICONS.bag}<span class="cart-count" id="cartCount">0</span>
        </a>
        <button class="icon-btn menu-btn" id="menuBtn" aria-label="Menu">${ICONS.menu}</button>
      </div>
    </div>`;
    const curBtn = $("#currencyToggle");
    if (curBtn) {
      const paintCur = () => { curBtn.textContent = getCurrency(); };
      paintCur();
      curBtn.addEventListener("click", () => {
        localStorage.setItem("aura-currency", getCurrency() === "USD" ? "GBP" : "USD");
        paintCur();
        refreshPrices();
      });
    }
    const isDark = document.documentElement.classList.contains("dark");
    $("#themeToggle").innerHTML = isDark ? ICONS.sun : ICONS.moon;
    $("#themeToggle").addEventListener("click", () => {
      applyTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
    });
    $("#menuBtn").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
  }

  const footer = $("#siteFooter");
  if (footer) {
    footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <img class="brand-logo footer-logo" src="images/logo.png" alt="Aura Steps" />
        <small>Walk in your own aura.</small>
      </div>
      <div class="footer-col">
        <h5>Shop</h5>
        <a href="shop.html?cat=heels">Heels</a>
        <a href="shop.html?cat=flats">Flats</a>
        <a href="shop.html?cat=boots">Boots</a>
      </div>
      <div class="footer-col">
        <h5>Help</h5>
        <a href="size-guide.html">Size Guide</a>
        <a href="contact.html">Contact</a>
        <a href="about.html">Our Story</a>
      </div>
      <div class="footer-col">
        <h5>Contact</h5>
        <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>
        <a href="tel:${SUPPORT_PHONE.replace(/[^+\\d]/g, "")}">${SUPPORT_PHONE}</a>
        <span class="footer-addr">${SUPPORT_ADDRESS}</span>
      </div>
    </div>
    <p class="footer-note">© 2026 Aura Steps · Walk in your own aura.</p>`;
  }
}

/* ---------- Cart ---------- */

function getCart() {
  let cart = JSON.parse(localStorage.getItem("aura-cart") || "[]");
  // keep only items with an existing product and a valid US size
  return cart.filter((i) => productById(i.id) && SIZE_CHART.some((r) => r.us == i.size));
}
function saveCart(cart) {
  localStorage.setItem("aura-cart", JSON.stringify(cart));
  updateCartBadge();
}
function updateCartBadge() {
  const el = $("#cartCount");
  if (el) el.textContent = getCart().reduce((s, i) => s + i.qty, 0);
}
function addToCart(id, size, qty = 1) {
  const cart = getCart();
  const key = id + "-" + size;
  const existing = cart.find((i) => i.key === key);
  if (existing) existing.qty += qty;
  else cart.push({ key, id, size, qty });
  saveCart(cart);
}
function cartSubtotal(cart) {
  return cart.reduce((s, i) => s + productById(i.id).price * i.qty, 0);
}

/* ---------- Toast ---------- */

let toastTimer;
function toast(msg) {
  let t = $("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2600);
}

/* ---------- Reveal animations ---------- */

function initReveals() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => io.observe(el));
}

/* ---------- Product cards ---------- */

function productCardHTML(p) {
  return `
  <a class="product-card reveal" href="product.html?id=${p.id}">
    <div class="product-card-image">
      ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
      ${productImage(p)}
    </div>
    <div class="product-card-body">
      <p class="product-style">${p.style}</p>
      <h3>${p.name}</h3>
      <p class="product-price" data-usd="${p.price}">${money(p.price)}</p>
    </div>
  </a>`;
}

function sizeTableHTML(compact = false) {
  return `
  <table class="size-table ${compact ? "compact" : ""}">
    <thead><tr><th>US</th><th>EU</th><th>UK</th><th>Foot length (cm)</th></tr></thead>
    <tbody>${SIZE_CHART.map(
      (r) => `<tr><td>${r.us}</td><td>${r.eu}</td><td>${r.uk}</td><td>${r.cm}</td></tr>`
    ).join("")}</tbody>
  </table>`;
}

/* ---------- Page: home ---------- */

function initHome() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  $("#featuredGrid").innerHTML = featured.map(productCardHTML).join("");
  const arrivals = PRODUCTS.filter((p) => p.isNew).slice(0, 4);
  $("#arrivalsGrid").innerHTML = arrivals.map(productCardHTML).join("");
  $("#stylesCount").dataset.target = PRODUCTS.length;

  // animated counters
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      let frame = 0;
      const steps = 40;
      const timer = setInterval(() => {
        frame += 1;
        el.textContent = Math.round((target * frame) / steps).toLocaleString("en-US") + (el.dataset.suffix || "");
        if (frame >= steps) clearInterval(timer);
      }, 28);
    });
  }, { threshold: 0.5 });
  $$(".counter").forEach((el) => io.observe(el));
}

/* ---------- Page: shop ---------- */

function initShop() {
  const params = new URLSearchParams(location.search);
  let cat = params.get("cat") || "all";
  let query = "";
  let sort = "featured";

  const grid = $("#shopGrid");
  const count = $("#shopCount");

  function render() {
    let list = PRODUCTS.filter((p) => cat === "all" || p.category === cat);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        (p.name + " " + p.style + " " + p.category).toLowerCase().includes(q));
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else list = [...list].sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));

    grid.innerHTML = list.length
      ? list.map(productCardHTML).join("")
      : `<p class="empty-note">No pieces match “${query}”. Try another search.</p>`;
    count.textContent = `${list.length} ${list.length === 1 ? "piece" : "pieces"}`;
    $$(".reveal", grid).forEach((el) => el.classList.add("in"));
  }

  $$(".filter-chip").forEach((chip) => {
    if (chip.dataset.filter === cat) {
      $$(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
    }
    chip.addEventListener("click", () => {
      $$(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      cat = chip.dataset.filter;
      render();
    });
  });
  $("#shopSearch").addEventListener("input", (e) => { query = e.target.value.trim(); render(); });
  $("#shopSort").addEventListener("change", (e) => { sort = e.target.value; render(); });
  render();
}

/* ---------- Page: product ---------- */

function initProduct() {
  const id = new URLSearchParams(location.search).get("id");
  const p = productById(id) || PRODUCTS[0];
  document.title = `${p.name} — ${p.style} | Aura Steps`;

  $("#pdBreadcrumb").innerHTML =
    `<a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <a href="shop.html?cat=${p.category}">${p.category[0].toUpperCase() + p.category.slice(1)}</a> / <span>${p.name}</span>`;
  $("#pdImage").innerHTML = (p.badge ? `<span class="product-badge">${p.badge}</span>` : "") + productImage(p, true);
  $("#pdCategory").textContent = p.category;
  $("#pdName").textContent = p.name;
  $("#pdStyle").textContent = p.style;
  setPrice($("#pdPrice"), p.price);
  $("#pdDesc").textContent = p.description;
  $("#pdChartWrap").innerHTML = sizeTableHTML(true);

  let selectedSize = null;
  let qty = 1;
  const pills = $("#pdSizes");
  pills.innerHTML = "";
  SIZE_CHART.forEach((r) => {
    const b = document.createElement("button");
    b.className = "size-pill";
    b.textContent = r.us;
    b.addEventListener("click", () => {
      selectedSize = r.us;
      $("#pdSizeError").hidden = true;
      $$(".size-pill", pills).forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected");
    });
    pills.appendChild(b);
  });

  $("#pdChartToggle").addEventListener("click", () => {
    const wrap = $("#pdChartWrap");
    wrap.hidden = !wrap.hidden;
  });
  $("#qtyDec").addEventListener("click", () => { qty = Math.max(1, qty - 1); $("#qtyVal").textContent = qty; });
  $("#qtyInc").addEventListener("click", () => { qty += 1; $("#qtyVal").textContent = qty; });
  $("#pdAdd").addEventListener("click", () => {
    if (!selectedSize) { $("#pdSizeError").hidden = false; return; }
    addToCart(p.id, selectedSize, qty);
    toast(`${p.name} (US ${selectedSize}) added to your bag`);
  });

  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  $("#relatedGrid").innerHTML = related.map(productCardHTML).join("");
  $$("#relatedGrid .reveal").forEach((el) => el.classList.add("in"));
}

/* ---------- Page: cart ---------- */

function initCart() {
  function render() {
    const cart = getCart();
    const wrap = $("#cartList");
    if (!cart.length) {
      wrap.innerHTML = "";
      $("#cartEmpty").hidden = false;
      $("#cartSummary").hidden = true;
      return;
    }
    $("#cartEmpty").hidden = true;
    $("#cartSummary").hidden = false;
    wrap.innerHTML = "";
    cart.forEach((item) => {
      const p = productById(item.id);
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <a class="cart-item-thumb" href="product.html?id=${p.id}">${productImage(p)}</a>
        <div class="cart-item-info">
          <h4><a href="product.html?id=${p.id}">${p.name}</a></h4>
          <p class="cart-item-meta">${p.style} · US ${item.size}</p>
          <div class="cart-item-row">
            <div class="qty-control">
              <button data-act="dec" aria-label="Decrease">−</button>
              <span>${item.qty}</span>
              <button data-act="inc" aria-label="Increase">+</button>
            </div>
            <span class="cart-item-price" data-usd="${p.price * item.qty}">${money(p.price * item.qty)}</span>
          </div>
          <button class="cart-item-remove" data-act="remove">Remove</button>
        </div>`;
      el.querySelector('[data-act="inc"]').addEventListener("click", () => {
        item.qty += 1; saveCart(cart); render();
      });
      el.querySelector('[data-act="dec"]').addEventListener("click", () => {
        item.qty -= 1;
        const next = item.qty <= 0 ? cart.filter((i) => i.key !== item.key) : cart;
        saveCart(next); render();
      });
      el.querySelector('[data-act="remove"]').addEventListener("click", () => {
        saveCart(cart.filter((i) => i.key !== item.key)); render();
      });
      wrap.appendChild(el);
    });
    const sub = cartSubtotal(cart);
    const ship = sub >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
    setPrice($("#sumSubtotal"), sub);
    const shipEl = $("#sumShipping");
    if (ship === 0) { delete shipEl.dataset.usd; shipEl.textContent = "Complimentary"; }
    else setPrice(shipEl, ship);
    setPrice($("#sumTotal"), sub + ship);
  }
  render();
}

/* ---------- Page: checkout ---------- */

function initCheckout() {
  const cart = getCart();
  if (!cart.length) {
    $("#checkoutContent").hidden = true;
    $("#checkoutEmpty").hidden = false;
    return;
  }
  const sub = cartSubtotal(cart);
  const ship = sub >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
  $("#coItems").innerHTML = cart.map((i) => {
    const p = productById(i.id);
    return `<div class="summary-item"><span>${p.name} · US ${i.size} × ${i.qty}</span><span data-usd="${p.price * i.qty}">${money(p.price * i.qty)}</span></div>`;
  }).join("");
  setPrice($("#coSubtotal"), sub);
  const coShipEl = $("#coShipping");
  if (ship === 0) { delete coShipEl.dataset.usd; coShipEl.textContent = "Complimentary"; }
  else setPrice(coShipEl, ship);
  setPrice($("#coTotal"), sub + ship);
  const total = sub + ship;

  const showWallet = (coin) => {
    const w = WALLETS[coin];
    $("#walletAddr").textContent = w.address;
    $("#walletNetwork").textContent = w.network;
  };
  showWallet("BTC");
  $("#cryptoCoin").addEventListener("change", (e) => showWallet(e.target.value));

  // ---- Adaptive US / UK address form ----
  const countrySel = $("#coCountry");
  const stateSel = $("#coState");
  const zipInput = $("#coZip");
  const zipMsg = $("#zipMsg");

  function setZipMsg(text, kind) {
    if (!zipMsg) return;
    zipMsg.textContent = text || "";
    zipMsg.className = "field-msg" + (kind ? " " + kind : "");
    zipMsg.hidden = !text;
  }

  function buildStateOptions(cc) {
    const list = cc === "GB" ? (typeof UK_COUNTIES !== "undefined" ? UK_COUNTIES : []) : US_STATES;
    const placeholder = cc === "GB" ? "County (optional)" : "State";
    stateSel.innerHTML =
      `<option value="" ${cc === "GB" ? "" : "disabled"} selected>${placeholder}</option>` +
      list.map((s) => `<option value="${escapeHtml(s.c)}">${escapeHtml(s.n)}</option>`).join("");
    stateSel.required = cc !== "GB";
  }
  function applyCountry(cc) {
    buildStateOptions(cc);
    zipInput.placeholder = cc === "GB" ? "Postcode" : "ZIP code";
    zipInput.setAttribute("maxlength", cc === "GB" ? "8" : "5");
    setZipMsg("", "");
  }
  applyCountry(countrySel.value || "US");
  countrySel.addEventListener("change", () => {
    applyCountry(countrySel.value);
    $("#coCity").value = "";
    zipInput.value = "";
  });

  // Set the state/county dropdown (adds the value for UK if not already listed)
  function setStateValue(val) {
    if (!val) return;
    const norm = String(val).trim();
    let opt = [...stateSel.options].find(
      (o) => o.value.toLowerCase() === norm.toLowerCase() || o.textContent.toLowerCase() === norm.toLowerCase()
    );
    if (!opt && countrySel.value === "GB") {
      opt = document.createElement("option");
      opt.value = norm;
      opt.textContent = norm;
      stateSel.appendChild(opt);
    }
    if (opt) stateSel.value = opt.value;
  }

  // ZIP / postcode validation. US: real ZIP that matches the state
  // (Zippopotam). UK: valid postcode format.
  async function checkZip() {
    const cc = countrySel.value;
    const zip = (zipInput.value || "").trim();
    if (cc === "GB") {
      if (!/^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/.test(zip)) {
        setZipMsg("Enter a valid UK postcode (e.g. SW1A 1AA).", "error");
        return false;
      }
      setZipMsg("", "");
      return true;
    }
    const st = stateSel.value;
    if (!/^\d{5}$/.test(zip)) { setZipMsg("Enter a 5-digit US ZIP code.", "error"); return false; }
    if (!st) { setZipMsg("Please choose your state first.", "error"); return false; }
    try {
      const res = await fetch("https://api.zippopotam.us/us/" + zip);
      if (res.status === 404) { setZipMsg("That ZIP code doesn't exist — please check it.", "error"); return false; }
      if (!res.ok) throw new Error("lookup unavailable");
      const data = await res.json();
      const place = (data.places && data.places[0]) || {};
      const zipState = place["state abbreviation"];
      const city = place["place name"];
      if (zipState && zipState !== st) {
        const full = (US_STATES.find((s) => s.c === zipState) || {}).n || zipState;
        setZipMsg(`ZIP ${zip} is in ${full}, not the state you selected.`, "error");
        return false;
      }
      const cityInput = $("#coCity");
      if (cityInput && !cityInput.value.trim() && city) cityInput.value = city;
      setZipMsg(city ? `✓ ${city}, ${st}` : "", "ok");
      return true;
    } catch (err) {
      setZipMsg("", "");
      return true;
    }
  }
  zipInput.addEventListener("blur", checkZip);
  stateSel.addEventListener("change", () => { if (zipInput.value.trim()) checkZip(); });

  // Reusable Geoapify autocomplete (country-aware) for street + city fields.
  function attachAutocomplete(inputEl, boxEl, opts) {
    if (!inputEl || !boxEl || typeof GEOAPIFY_KEY === "undefined" || !GEOAPIFY_KEY) return;
    let debounce, results = [], activeIdx = -1;
    const close = () => { boxEl.hidden = true; boxEl.innerHTML = ""; results = []; activeIdx = -1; };
    const render = () => {
      boxEl.innerHTML = results
        .map((r, i) => `<li data-i="${i}" class="${i === activeIdx ? "active" : ""}">${escapeHtml(opts.label(r))}</li>`)
        .join("");
      boxEl.hidden = results.length === 0;
    };
    inputEl.addEventListener("input", () => {
      const q = inputEl.value.trim();
      clearTimeout(debounce);
      if (q.length < 3) { close(); return; }
      debounce = setTimeout(async () => {
        try {
          const cc = (countrySel.value || "US").toLowerCase();
          let url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(q)}&filter=countrycode:${cc}&format=json&limit=5&apiKey=${GEOAPIFY_KEY}`;
          if (opts.type) url += `&type=${opts.type}`;
          const res = await fetch(url);
          if (!res.ok) return;
          const data = await res.json();
          results = (data.results || []).filter((r) => (r.country_code || "").toLowerCase() === cc);
          activeIdx = -1;
          render();
        } catch (e) { /* ignore network hiccups */ }
      }, 300);
    });
    boxEl.addEventListener("mousedown", (e) => {
      const li = e.target.closest("li");
      if (!li) return;
      e.preventDefault();
      opts.onSelect(results[+li.dataset.i]);
      close();
    });
    inputEl.addEventListener("keydown", (e) => {
      if (boxEl.hidden || !results.length) return;
      if (e.key === "ArrowDown") { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, results.length - 1); render(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); render(); }
      else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); opts.onSelect(results[activeIdx]); close(); }
      else if (e.key === "Escape") { close(); }
    });
    inputEl.addEventListener("blur", () => setTimeout(close, 150));
  }

  attachAutocomplete($("#coStreet"), $("#streetSuggest"), {
    label: (r) => r.formatted || r.address_line1,
    onSelect: (r) => {
      if (!r) return;
      $("#coStreet").value = r.address_line1 || [r.housenumber, r.street].filter(Boolean).join(" ") || $("#coStreet").value;
      if (r.city) $("#coCity").value = r.city;
      setStateValue(countrySel.value === "GB" ? (r.county || r.state) : r.state_code);
      if (r.postcode) zipInput.value = r.postcode;
      checkZip();
    },
  });
  attachAutocomplete($("#coCity"), $("#citySuggest"), {
    type: "city",
    label: (r) => r.formatted || [r.city, r.state, r.postcode].filter(Boolean).join(", "),
    onSelect: (r) => {
      if (!r) return;
      if (r.city) $("#coCity").value = r.city;
      setStateValue(countrySel.value === "GB" ? (r.county || r.state) : r.state_code);
    },
  });

  // Payment-method tabs (Card via Flutterwave, or Crypto)
  let method = "card";
  $$(".pay-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".pay-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      method = tab.dataset.pay;
      $("#pay-card").hidden = method !== "card";
      $("#pay-crypto").hidden = method !== "crypto";
    });
  });

  const form = $("#checkoutForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const ok = await checkZip();
    if (!ok) { $("#coZip").focus(); return; }
    const shipping = {
      firstName: $("#coFirst").value.trim(),
      lastName: $("#coLast").value.trim(),
      email: $("#coEmail").value.trim(),
      address: $("#coStreet").value.trim(),
      address2: $("#coStreet2").value.trim(),
      city: $("#coCity").value.trim(),
      state: stateSel.value,
      postal: zipInput.value.trim(),
      country: countrySel.value === "GB" ? "United Kingdom" : "United States",
    };
    const ref = "AS-" + Math.floor(100000 + Math.random() * 900000);
    if (method === "card") {
      payWithCard({ ref, total, cart, shipping });
    } else {
      const coin = $("#cryptoCoin").value;
      finalizeOrder({ ref, total, cart, shipping, method: `Crypto — ${coin} (${WALLETS[coin].network})` });
    }
  });
}

function payWithCard({ ref, total, cart, shipping }) {
  if (typeof FlutterwaveCheckout === "undefined") {
    toast("Card payment couldn't load — please try crypto, or refresh the page.");
    return;
  }
  const cur = getCurrency();
  const amount = cur === "GBP" ? Math.round(total * (FX.GBP || 0.74)) : Math.round(total);
  FlutterwaveCheckout({
    public_key: FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: ref,
    amount: amount,
    currency: cur,
    payment_options: "card",
    customer: { email: shipping.email, name: `${shipping.firstName} ${shipping.lastName}` },
    customizations: {
      title: "Aura Steps",
      description: "Order " + ref,
      logo: location.origin + "/images/logo.png",
    },
    meta: {
      items: cart.map((i) => { const p = productById(i.id); return `${p.name} US ${i.size} x${i.qty}`; }).join(", "),
      ship_to: `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.postal}, ${shipping.country}`,
    },
    callback: function (data) {
      if (data && (data.status === "successful" || data.status === "completed")) {
        finalizeOrder({ ref, total, cart, shipping, method: `Card (Flutterwave · ${cur})` });
      }
    },
    onclose: function () { /* customer closed the window without paying */ },
  });
}

function finalizeOrder({ ref, total, cart, shipping, method }) {
  const orders = JSON.parse(localStorage.getItem("aura-orders") || "[]");
  orders.push({ ref, date: new Date().toISOString(), total, method, shipping, items: cart });
  localStorage.setItem("aura-orders", JSON.stringify(orders));
  sendOrderEmail({ ref, total, cart, shipping, method });
  saveCart([]);
  $("#orderRef").textContent = ref;
  const msg = $("#successMsg");
  if (msg) {
    msg.textContent = method.startsWith("Card")
      ? "Your payment went through — a receipt is on its way and we'll prepare your pair with care."
      : "Once we confirm your crypto payment on-chain, we'll email you and prepare your pair with care.";
  }
  $("#checkoutContent").hidden = true;
  $("#checkoutSuccess").hidden = false;
  window.scrollTo(0, 0);
}

function sendOrderEmail({ ref, total, cart, shipping, method }) {
  if (typeof ORDER_EMAIL === "undefined" || !ORDER_EMAIL) return;
  const items = cart.map((i) => {
    const p = productById(i.id);
    return `• ${p.name} — ${p.style} (US ${i.size}) ×${i.qty} — $${(p.price * i.qty).toLocaleString("en-US")}`;
  }).join("\n");
  const cur = getCurrency();
  const usdTotal = "$" + Math.round(total).toLocaleString("en-US");
  const payload = {
    _subject: `New Aura Steps order ${ref} — ${usdTotal}`,
    _template: "table",
    Order: ref,
    Total_USD: usdTotal,
    Customer_saw: cur === "USD" ? usdTotal : `${money(total)} (${cur})`,
    Paid_with: method,
    Items: items,
    Customer: `${shipping.firstName} ${shipping.lastName}`,
    Email: shipping.email,
    Ship_to: `${shipping.address}${shipping.address2 ? ", " + shipping.address2 : ""}, ${shipping.city}, ${shipping.state} ${shipping.postal}, ${shipping.country}`,
  };
  fetch("https://formsubmit.co/ajax/" + encodeURIComponent(ORDER_EMAIL), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

/* ---------- Page: contact ---------- */

function initContact() {
  const email = typeof SUPPORT_EMAIL !== "undefined" ? SUPPORT_EMAIL : ORDER_EMAIL;
  const em = $("#ciEmail");
  if (em) { em.textContent = email; em.href = "mailto:" + email; }
  const ph = $("#ciPhone");
  if (ph && typeof SUPPORT_PHONE !== "undefined") {
    ph.textContent = SUPPORT_PHONE;
    ph.href = "tel:" + SUPPORT_PHONE.replace(/[^+\d]/g, "");
  }
  const ad = $("#ciAddress");
  if (ad && typeof SUPPORT_ADDRESS !== "undefined") ad.textContent = SUPPORT_ADDRESS;

  const form = $("#contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const f = $$("input, textarea", form);
    fetch("https://formsubmit.co/ajax/" + encodeURIComponent(ORDER_EMAIL), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `Aura Steps enquiry — ${f[2].value}`,
        Name: f[0].value,
        Email: f[1].value,
        Subject: f[2].value,
        Message: f[3].value,
      }),
    }).catch(() => {});
    form.reset();
    toast("Message sent — we'll reply within one business day.");
  });
}

/* ---------- Page: size guide ---------- */

function initSizeGuide() {
  $("#guideTable").innerHTML = sizeTableHTML();
}

/* ---------- Boot ---------- */

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(localStorage.getItem("aura-theme") || "light");
  const page = document.body.dataset.page;
  renderChrome(page === "home" ? "index.html" : page + ".html");
  updateCartBadge();

  const inits = {
    home: initHome, shop: initShop, product: initProduct,
    cart: initCart, checkout: initCheckout, contact: initContact,
    "size-guide": initSizeGuide,
  };
  if (inits[page]) inits[page]();
  initReveals();

  // apply the saved currency to any prices, then refresh the FX rate
  refreshPrices();
  loadFx();

  // inject shared icons referenced by data-icon
  $$("[data-icon]").forEach((el) => { el.innerHTML = ICONS[el.dataset.icon] || ""; });
});
