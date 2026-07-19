/* ============================================================
   AURA STEPS — shared site logic (header, theme, cart, pages)
   ============================================================ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const money = (n) => CURRENCY + n.toLocaleString("en-US");
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
      <a class="brand" href="index.html">
        <span class="brand-mark">A</span>
        <span class="brand-name">Aura&nbsp;Steps</span>
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
        <button class="icon-btn" id="themeToggle" aria-label="Toggle dark mode"></button>
        <a class="icon-btn bag-btn" href="cart.html" aria-label="Shopping bag">
          ${ICONS.bag}<span class="cart-count" id="cartCount">0</span>
        </a>
        <button class="icon-btn menu-btn" id="menuBtn" aria-label="Menu">${ICONS.menu}</button>
      </div>
    </div>`;
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
        <span class="brand-mark">A</span>
        <p>Aura Steps</p>
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
        <h5>Payments</h5>
        <a href="checkout.html">Crypto · BTC / ETH / USDT</a>
        <a href="checkout.html">Card · coming soon</a>
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
      <p class="product-price">${money(p.price)}</p>
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
  $("#pdPrice").textContent = money(p.price);
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
            <span class="cart-item-price">${money(p.price * item.qty)}</span>
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
    $("#sumSubtotal").textContent = money(sub);
    $("#sumShipping").textContent = ship === 0 ? "Complimentary" : money(ship);
    $("#sumTotal").textContent = money(sub + ship);
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
    return `<div class="summary-item"><span>${p.name} · US ${i.size} × ${i.qty}</span><span>${money(p.price * i.qty)}</span></div>`;
  }).join("");
  $("#coSubtotal").textContent = money(sub);
  $("#coShipping").textContent = ship === 0 ? "Complimentary" : money(ship);
  $("#coTotal").textContent = money(sub + ship);
  const showWallet = (coin) => {
    const w = WALLETS[coin];
    $("#walletAddr").textContent = w.address;
    $("#walletNetwork").textContent = w.network;
  };
  showWallet("BTC");
  $("#cryptoCoin").addEventListener("change", (e) => showWallet(e.target.value));

  $("#checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const ref = "AS-" + Math.floor(100000 + Math.random() * 900000);
    const orders = JSON.parse(localStorage.getItem("aura-orders") || "[]");
    orders.push({ ref, date: new Date().toISOString(), total: sub + ship, items: cart });
    localStorage.setItem("aura-orders", JSON.stringify(orders));
    saveCart([]);
    $("#orderRef").textContent = ref;
    $("#checkoutContent").hidden = true;
    $("#checkoutSuccess").hidden = false;
    window.scrollTo(0, 0);
  });
}

/* ---------- Page: contact ---------- */

function initContact() {
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    toast("Message sent — we'll reply within one business day. (Demo)");
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

  // inject shared icons referenced by data-icon
  $$("[data-icon]").forEach((el) => { el.innerHTML = ICONS[el.dataset.icon] || ""; });
});
