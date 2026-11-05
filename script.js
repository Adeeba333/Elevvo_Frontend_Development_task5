"use strict";
const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function applyTheme(theme) {
    root.setAttribute("data-bs-theme", theme);
    const dark = theme === "dark";
    themeIcon.className = dark ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    try { localStorage.setItem("theme", theme); } catch (e) {}
    }
applyTheme(root.getAttribute("data-bs-theme") || "light");
themeBtn.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark");
});

const navEl = document.getElementById("nav");
document.querySelectorAll("#nav .nav-link").forEach(link => {
    link.addEventListener("click", () => bootstrap.Collapse.getInstance(navEl)?.hide());
});

const AVAIL = {
    both:   { text: "Online + showroom", cls: "text-bg-success",   icon: "bi-shop" },
    online: { text: "Online only",       cls: "text-bg-secondary", icon: "bi-globe2" },
    pre:    { text: "Pre-order",         cls: "text-bg-warning",   icon: "bi-clock" }
};
const products = [
    { name: "Casio G-Shock DW5600",     cat: "Watches",    icon: "bi-smartwatch",  price: 12500,  from: false, avail: "both",   desc: "A durable digital watch designed for everyday use with a classic G-Shock look." },
    { name: "Apple Watch Series 10",    cat: "Watches",    icon: "bi-smartwatch",  price: 41500,  from: false, avail: "online", desc: "A smartwatch that helps users track fitness, monitor activity, and stay connected" },
    { name: "Sony WF-1000XM5",          cat: "Earbuds",    icon: "bi-earbuds",     price: 2200,   from: false, avail: "both",   desc: "Wireless earbuds offering high-quality audio and advanced noise cancellation." },
    { name: "Apple AirPods Pro 2",      cat: "Earbuds",    icon: "bi-earbuds",     price: 2199,   from: false, avail: "both",   desc: "Wireless earbuds featuring active noise cancellation, transparency mode, and immersive sound." },
    { name: "Apple iPhone 14 Pro max",  cat: "Phones",     icon: "bi-phone",       price: 32900,  from: false, avail: "both",   desc: "A premium smartphone designed for powerful performance, photography, and everyday communication.." },
    { name: "Samsung Galaxy S26 Ultra", cat: "Phones",     icon: "bi-phone",       price: 34900,  from: false, avail: "pre",    desc: "A flagship smartphone offering advanced features, high performance, and versatile photography." },
    { name: "Apple MacBook Air (M3)",   cat: "Laptops",    icon: "bi-laptop",      price: 138900, from: false, avail: "both",   desc: "A lightweight laptop designed for productivity, multitasking, and everyday computing." },
    { name: "ASUS ROG Zephyrus G14",    cat: "Laptops",    icon: "bi-laptop",      price: 195900, from: false, avail: "both",   desc: "A compact gaming laptop built for demanding games and high-performance tasks." },
    { name: "Apple iPad Pro",           cat: "Tablets",    icon: "bi-tablet",      price: 120900, from: false, avail: "both",   desc: "A powerful tablet suitable for creative work, productivity, entertainment, and multitasking." },
    { name: "Samsung Galaxy Tab S10+",  cat: "Tablets",    icon: "bi-tablet",      price: 115900, from: false, avail: "online", desc: "A versatile tablet designed for entertainment, productivity, and creative activities." },
    { name: "NZXT BLD",                 cat: "PC Builder", icon: "bi-pc-display",  price: 49900,  from: true,  avail: "both",   desc: "A prebuilt gaming PC designed to deliver reliable performance for gaming and everyday computing." },
    { name: "Gaming PC Build",          cat: "PC Builder", icon: "bi-pc-display",  price: 99900,  from: true,  avail: "both",   desc: "A custom-built desktop computer designed for gaming, multitasking, and demanding applications." }
];

const money = n => "৳" + n.toLocaleString("en-IN");
const productsEl = document.getElementById("products");
const filtersEl = document.getElementById("filters");
const categories = ["All", ...new Set(products.map(p => p.cat))];
let activeCat = "All";
let searchTerm = "";
const resultCount = document.getElementById("resultCount");

function renderFilters() {
    filtersEl.innerHTML = categories.map(c => `
        <button type="button" class="btn btn-outline-secondary btn-sm ${c === activeCat ? "active" : ""}"
                data-cat="${c}" aria-pressed="${c === activeCat}">${c}</button>`).join("");
}

function matches(p) {
    if (activeCat !== "All" && p.cat !== activeCat) return false;
    const text = (p.name + " " + p.cat + " " + p.desc).toLowerCase();
    return searchTerm.split(" ").filter(Boolean).every(word => text.includes(word));
}

function renderProducts() {
    const list = products.filter(matches);
    resultCount.textContent = searchTerm
        ? list.length + (list.length === 1 ? " result" : " results") + " for “" + searchTerm + "”"
        : "";
    if (list.length === 0) {
        productsEl.innerHTML = `
        <div class="col-12">
            <p class="text-body-secondary mb-0">No devices match your search. Try another word or
            <button type="button" class="btn btn-link p-0 align-baseline" id="emptyClear">clear the search</button>.</p>
        </div>`;
        document.getElementById("emptyClear").addEventListener("click", () => clearSearch(true));
        return;
    }
    productsEl.innerHTML = list.map(p => {
        const a = AVAIL[p.avail];
        return `
        <div class="col">
        <article class="card h-100 shadow-sm product-card">
            <div class="product-top"><i class="bi ${p.icon}"></i></div>
            <div class="card-body d-flex flex-column">
            <small class="text-body-secondary">${p.cat}</small>
            <h3 class="h5 mb-2">${p.name}</h3>
            <p class="text-body-secondary small">${p.desc}</p>
            <p class="mb-2 mt-auto"><span class="price-tag">${p.from ? "from " : ""}${money(p.price)}</span></p>
            <span class="badge ${a.cls} align-self-start mb-3"><i class="bi ${a.icon} me-1"></i>${a.text}</span>
            <a href="#stores" class="btn btn-outline-primary btn-sm">Check availability</a>
            </div>
        </article>
        </div>`;
    }).join("");
}

filtersEl.addEventListener("click", e => {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) return;
    activeCat = btn.dataset.cat;
    renderFilters();
    renderProducts();
});

document.querySelectorAll(".tile").forEach(tile => tile.addEventListener("click", () => {
    activeCat = tile.dataset.cat;
    clearSearch(false);
    renderFilters();
    renderProducts();
}));

renderFilters();
renderProducts();

const searchWrap = document.getElementById("floatSearch");
const searchToggle = document.getElementById("searchToggle");
const searchInput = document.getElementById("searchInput");
const searchClearBtn = document.getElementById("searchClear");
const shopEl = document.getElementById("shop");

function openSearch() {
    searchWrap.classList.add("open");
    searchToggle.setAttribute("aria-expanded", "true");
    searchInput.tabIndex = 0;
    searchInput.focus();
}
function closeSearch() {
    searchWrap.classList.remove("open");
    searchToggle.setAttribute("aria-expanded", "false");
    searchInput.tabIndex = -1;
}
function clearSearch(refocus) {
    searchInput.value = "";
    searchTerm = "";
    renderProducts();
    if (refocus) searchInput.focus();
}

searchToggle.addEventListener("click", () => {
    if (!searchWrap.classList.contains("open")) openSearch();
    else if (searchInput.value) searchInput.focus();
    else closeSearch();
});

searchInput.addEventListener("input", () => {
    const hadTerm = searchTerm !== "";
    searchTerm = searchInput.value.trim().toLowerCase();
    renderProducts();
    if (!hadTerm && searchTerm) shopEl.scrollIntoView({ behavior: "smooth" });
});

searchClearBtn.addEventListener("click", () => clearSearch(true));
document.getElementById("searchForm").addEventListener("submit", e => e.preventDefault());

searchWrap.addEventListener("keydown", e => {
    if (e.key === "Escape") { clearSearch(false); closeSearch(); searchToggle.focus(); }
});
searchWrap.addEventListener("focusout", e => {
    if (!searchWrap.contains(e.relatedTarget) && !searchInput.value) closeSearch();
});

const backTop = document.getElementById("backTop");

window.addEventListener("scroll", () => {
    backTop.classList.toggle("show", window.scrollY > 500);
}, { passive: true });

backTop.addEventListener("click", () => {
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    document.querySelector(".navbar-brand").focus({ preventScroll: true });
});

const periodBtns = document.querySelectorAll("#billing button");
const amounts = document.querySelectorAll(".amount");

periodBtns.forEach(btn => btn.addEventListener("click", () => {
    periodBtns.forEach(b => {
        const on = b === btn;
        b.classList.toggle("btn-primary", on);
        b.classList.toggle("btn-outline-primary", !on);
        b.setAttribute("aria-pressed", on);
    });
    amounts.forEach(el => { el.innerHTML = "<b>৳</b>" + el.dataset[btn.dataset.period]; });
}));

const form = document.getElementById("ctaForm");
const email = document.getElementById("email");
const msg = document.getElementById("formMsg");

form.addEventListener("submit", e => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    email.classList.toggle("is-invalid", !ok);
    msg.textContent = ok ? "Thanks! Your ৳10 voucher is on its way to your inbox." : "";
    if (ok) form.reset(); else email.focus();
});

document.getElementById("year").textContent = new Date().getFullYear();