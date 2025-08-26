/* =========================================================
   Loja Tech – App de treino para QA (login + produtos + carrinho)
   Persistência simples com localStorage
   ========================================================= */

// ---------- CONFIGURAÇÕES / DADOS FAKES ----------
const AUTH = { username: "standard_user", password: "secret_sauce" }; // credenciais válidas
const CATALOG = [
  { id: 1, name: "Teclado Mecânico RGB", price: 299.90 },
  { id: 2, name: "Mouse Gamer 16000 DPI", price: 199.90 },
  { id: 3, name: "Headset Surround 7.1", price: 399.90 },
  { id: 4, name: "Monitor 27\" 144Hz", price: 1599.90 }
];

// ---------- UTILITÁRIOS ----------
const $ = (sel, scope=document) => scope.querySelector(sel);
const $$ = (sel, scope=document) => Array.from(scope.querySelectorAll(sel));

function formatBRL(n) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ---------- AUTH ----------
function isLoggedIn() {
  return localStorage.getItem("auth") === "true";
}
function login(username, password) {
  if (username === AUTH.username && password === AUTH.password) {
    localStorage.setItem("auth", "true");
    return true;
  }
  return false;
}
function logout() {
  localStorage.removeItem("auth");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}
function requireAuth() {
  if (!isLoggedIn()) window.location.href = "index.html";
}

// ---------- CARRINHO ----------
function getCart() {
  const raw = localStorage.getItem("cart");
  return raw ? JSON.parse(raw) : []; // [{id, qty}]
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function addToCart(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart(cart);
  updateCartBadge();
}
function removeFromCart(id) {
  let cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  updateCartBadge();
}
function setQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, qty);
  saveCart(cart);
  updateCartBadge();
}
function cartCount() {
  return getCart().reduce((acc, i) => acc + i.qty, 0);
}
function cartTotal() {
  return getCart().reduce((acc, i) => {
    const prod = CATALOG.find(p => p.id === i.id);
    return acc + (prod.price * i.qty);
  }, 0);
}
function updateCartBadge() {
  const badge = $("#cart-count");
  if (badge) badge.textContent = cartCount();
}

// ---------- PÁGINA: LOGIN ----------
function initLoginPage() {
  // Se já estiver logado, vai direto para produtos
  if (isLoggedIn()) {
    window.location.href = "products.html";
    return;
  }

  const form = $("#login-form");
  const inputUser = $("#username");
  const inputPass = $("#password");
  const error = $("#error-msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = login(inputUser.value.trim(), inputPass.value.trim());
    if (ok) {
      window.location.href = "products.html";
    } else {
      // Mostra erro com texto fixo (para assert em testes)
      error.textContent = "Credenciais inválidas. Verifique usuário e senha.";
      error.style.display = "block";
    }
  });
}

// ---------- PÁGINA: PRODUTOS ----------
function initProductsPage() {
  requireAuth();
  updateCartBadge();

  $("#logout-button")?.addEventListener("click", logout);
  $("#go-to-cart")?.addEventListener("click", () => {
    window.location.href = "cart.html";
  });

  const grid = $("#products-grid");
  // Render simples dos cards (com data-product-id para facilitar o Selenium)
  CATALOG.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-testid", "product-card");
    card.innerHTML = `
      <h3>${p.name}</h3>
      <div class="price">${formatBRL(p.price)}</div>
      <button class="btn" data-product-id="${p.id}" id="add-${p.id}">Adicionar ao carrinho</button>
    `;
    grid.appendChild(card);
  });

  // Eventos dos botões "Adicionar"
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-product-id]");
    if (!btn) return;
    const id = Number(btn.getAttribute("data-product-id"));
    addToCart(id);
  });
}

// ---------- PÁGINA: CARRINHO ----------
function initCartPage() {
  requireAuth();
  updateCartBadge();
  $("#logout-button")?.addEventListener("click", logout);

  const list = $("#cart-items");
  const totalEl = $("#cart-total-value");
  const emptyEl = $("#cart-empty");

  // Monta a lista do carrinho
  const cart = getCart();
  if (cart.length === 0) {
    emptyEl.style.display = "block";
    list.innerHTML = "";
    totalEl.textContent = formatBRL(0);
    return;
  } else {
    emptyEl.style.display = "none";
  }

  list.innerHTML = "";
  cart.forEach(i => {
    const p = CATALOG.find(x => x.id === i.id);
    const row = document.createElement("div");
    row.className = "cart-item";
    row.setAttribute("data-id", String(i.id));
    row.innerHTML = `
      <h4>${p.name}</h4>
      <div class="muted">${formatBRL(p.price)}</div>
      <input class="qty" type="number" min="1" value="${i.qty}" aria-label="Quantidade" />
      <button class="btn btn-remove">Remover</button>
    `;
    list.appendChild(row);
  });

  // Total inicial
  totalEl.textContent = formatBRL(cartTotal());

  // Delegação de eventos (alterar quantidade e remover)
  list.addEventListener("input", (e) => {
    const input = e.target.closest("input.qty");
    if (!input) return;
    const row = input.closest(".cart-item");
    const id = Number(row.getAttribute("data-id"));
    setQty(id, Number(input.value));
    totalEl.textContent = formatBRL(cartTotal());
  });

  list.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-remove");
    if (!btn) return;
    const row = btn.closest(".cart-item");
    const id = Number(row.getAttribute("data-id"));
    removeFromCart(id);
    row.remove();
    // Atualiza total e vazio
    const hasItems = $$(".cart-item").length > 0;
    totalEl.textContent = formatBRL(cartTotal());
    if (!hasItems) {
      emptyEl.style.display = "block";
    }
  });
}

// ---------- BOOT POR PÁGINA ----------
document.addEventListener("DOMContentLoaded", () => {
  // Checa qual página estou via data-page no <body>
  const page = document.body.getAttribute("data-page");
  if (page === "login") initLoginPage();
  if (page === "products") initProductsPage();
  if (page === "cart") initCartPage();
});
