const priceRanges = {
  all: null,
  "under-299": { min: 0, max: 299 },
  "300-599": { min: 300, max: 599 },
  "600-999": { min: 600, max: 999 },
  "1000-1999": { min: 1000, max: 1999 },
  "2000-plus": { min: 2000, max: Infinity },
};

const state = {
  products: [],
  cart: [],
  stripe: null,
  cardElement: null,
  publishableKey: "",
  filters: {
    search: "",
    priceRange: "all",
  },
};

const selectors = {
  productGrid: document.getElementById("productGrid"),
  cartCount: document.getElementById("cartCount"),
  cartItems: document.getElementById("cartItems"),
  cartSubtotal: document.getElementById("cartSubtotal"),
  cartTaxes: document.getElementById("cartTaxes"),
  cartTotal: document.getElementById("cartTotal"),
  cartPanel: document.getElementById("cartPanel"),
  cartToggle: document.getElementById("cartToggle"),
  checkoutMessage: document.getElementById("checkoutMessage"),
  historyResults: document.getElementById("historyResults"),
  searchInput: document.getElementById("searchInput"),
  searchForm: document.getElementById("searchForm"),
  priceFilters: document.getElementById("priceFilters"),
};

async function init() {
  await Promise.all([loadStripe(), loadProducts()]);
  restoreCart();
  bindEvents();
  renderCart();
}

async function loadStripe() {
  try {
    const res = await fetch("/api/config/stripe");
    const data = await res.json();
    state.publishableKey = data.publishableKey;
    if (data.publishableKey) {
      state.stripe = Stripe(data.publishableKey);
      const elements = state.stripe.elements();
      state.cardElement = elements.create("card", { hidePostalCode: true });
      state.cardElement.mount("#card-element");
    } else {
      document.querySelector(".card-element").innerHTML =
        "<p class='feedback'>Stripe key missing. Ask admin to configure payments.</p>";
    }
  } catch (error) {
    console.error(error);
  }
}

async function loadProducts() {
  const response = await fetch("/api/products");
  state.products = await response.json();
  renderProducts();
}

function getFilteredProducts() {
  const search = state.filters.search.trim().toLowerCase();
  const range = priceRanges[state.filters.priceRange];

  return state.products.filter((product) => {
    const haystack = `${product.name} ${product.description}`.toLowerCase();
    const matchesSearch = !search || haystack.includes(search);
    const effectivePrice = Number(product.salePrice ?? product.price);
    const matchesRange =
      !range ||
      (effectivePrice >= range.min &&
        (Number.isFinite(range.max) ? effectivePrice <= range.max : true));

    return matchesSearch && matchesRange;
  });
}

function renderProducts() {
  const filtered = getFilteredProducts();
  if (filtered.length === 0) {
    selectors.productGrid.innerHTML =
      "<p>No pieces found. Try another keyword or range.</p>";
    return;
  }

  selectors.productGrid.innerHTML = filtered
    .map((product) => {
      const original = Number(product.price);
      const current = Number(product.salePrice ?? product.price);
      const hasDiscount =
        product.salePrice !== null &&
        product.salePrice !== undefined &&
        current < original;
      const discountPercent = hasDiscount
        ? Math.round((1 - current / original) * 100)
        : null;
      const imageUrl =
        product.images?.find((i) => i.isPrimary)?.url ||
        product.images?.[0]?.url ||
        "/assets/brand-logo.jpeg";

      return `
      <article class="product product--amazon">
        <div class="product__image-wrapper">
          ${
            product.isOnSale
              ? '<span class="product__deal-badge">Deal</span>'
              : ""
          }
          ${
            product.isBestSeller
              ? '<span class="product__best-seller">Best Seller</span>'
              : ""
          }
          ${
            product.isNewArrival
              ? '<span class="product__new-badge">New</span>'
              : ""
          }
          <img src="${imageUrl}" alt="${product.name}" class="product__image">
          <button class="product__add-btn" data-product="${
            product.id
          }" aria-label="Add to cart">
            <span>+</span>
          </button>
        </div>
        <div class="product__body">
          <h3 class="product__title">${product.name}</h3>
          <div class="product__rating">
            <span class="stars">★★★★★</span>
            <span class="rating-count">(${
              Math.floor(Math.random() * 500) + 10
            })</span>
          </div>
          <div class="product__pricing">
            <span class="price-current">${formatCurrency(current)}</span>
            ${
              hasDiscount
                ? `<span class="price-strike">${formatCurrency(
                    original
                  )}</span>`
                : ""
            }
            ${
              hasDiscount
                ? `<span class="price-discount">-${discountPercent}%</span>`
                : ""
            }
          </div>
          ${hasDiscount ? '<p class="deal-label">Limited time deal</p>' : ""}
          ${
            product.isNewArrival && !hasDiscount
              ? '<p class="deal-label deal-label--soft">New arrival</p>'
              : ""
          }
          <p class="product__description">${product.description.substring(
            0,
            80
          )}...</p>
          <p class="product__shipping">FREE delivery</p>
        </div>
      </article>`;
    })
    .join("");

  selectors.productGrid
    .querySelectorAll("button[data-product]")
    .forEach((btn) => {
      btn.addEventListener("click", () => addToCart(btn.dataset.product));
    });
}

function renderPricing(product) {
  const original = Number(product.price);
  const current = Number(product.salePrice ?? product.price);
  const hasDiscount =
    product.salePrice !== null &&
    product.salePrice !== undefined &&
    current < original;
  const discountPercent = hasDiscount
    ? Math.round((1 - current / original) * 100)
    : null;

  return `
    <div class="product__pricing">
      <span class="price-current">${formatCurrency(current)}</span>
      ${
        hasDiscount
          ? `<span class="price-strike">${formatCurrency(
              original
            )}</span><span class="price-discount">-${discountPercent}%</span>`
          : ""
      }
    </div>
    ${
      product.isOnSale
        ? '<p class="deal-label">Limited time deal</p>'
        : product.isNewArrival
        ? '<p class="deal-label deal-label--soft">New arrival</p>'
        : ""
    }
  `;
}

function addToCart(productId) {
  const product = state.products.find((p) => p.id === productId);
  if (!product) return;
  const existing = state.cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      productId,
      name: product.name,
      price: product.salePrice ?? product.price,
      quantity: 1,
      image: product.images?.[0]?.url,
    });
  }
  persistCart();
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.productId !== productId);
  persistCart();
  renderCart();
}

function persistCart() {
  localStorage.setItem("indiaborn-cart", JSON.stringify(state.cart));
}

function restoreCart() {
  state.cart = JSON.parse(localStorage.getItem("indiaborn-cart") || "[]");
}

function renderCart() {
  selectors.cartCount.textContent = state.cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const subtotal = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxes = subtotal * 0.05;
  selectors.cartSubtotal.textContent = formatCurrency(subtotal);
  selectors.cartTaxes.textContent = formatCurrency(taxes);
  selectors.cartTotal.textContent = formatCurrency(subtotal + taxes);

  selectors.cartItems.innerHTML =
    state.cart.length === 0
      ? "<p>Your bag is empty.</p>"
      : state.cart
          .map(
            (item) => `
      <div class="cart__item">
        <div>
          <strong>${item.name}</strong>
          <p>${item.quantity} x ${formatCurrency(item.price)}</p>
        </div>
        <button class="button button--ghost" data-remove="${
          item.productId
        }">Remove</button>
      </div>`
          )
          .join("");

  selectors.cartItems.querySelectorAll("button[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.remove));
  });
}

function bindEvents() {
  document.getElementById("shopNow")?.addEventListener("click", () => {
    document
      .getElementById("collections")
      .scrollIntoView({ behavior: "smooth" });
  });

  selectors.cartToggle?.addEventListener("click", () => {
    selectors.cartPanel.classList.toggle("hidden");
  });

  selectors.searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.filters.search = selectors.searchInput?.value ?? "";
    renderProducts();
  });

  selectors.searchInput?.addEventListener("input", (event) => {
    state.filters.search = event.target.value ?? "";
    renderProducts();
  });

  selectors.priceFilters?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-range]");
    if (!button) return;
    state.filters.priceRange = button.dataset.range;
    selectors.priceFilters
      .querySelectorAll("button")
      .forEach((chip) => chip.classList.remove("chip--active"));
    button.classList.add("chip--active");
    renderProducts();
  });

  document
    .getElementById("checkoutForm")
    ?.addEventListener("submit", submitOrder);
  document
    .getElementById("historyForm")
    ?.addEventListener("submit", loadOrderHistory);
}

async function submitOrder(event) {
  event.preventDefault();
  if (state.cart.length === 0) {
    feedback("Add at least one product to your bag.");
    return;
  }
  if (!state.stripe) {
    feedback("Payments are offline. Please try later.");
    return;
  }

  const formData = new FormData(event.target);
  const payload = {
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    phoneNumber: formData.get("phone"),
    whatsAppNumber: formData.get("whatsapp") ?? "",
    messengerId: formData.get("messenger") ?? "",
    shipping: {
      fullName: formData.get("fullName"),
      addressLine1: formData.get("address1"),
      addressLine2: formData.get("address2") ?? "",
      city: formData.get("city"),
      state: formData.get("state"),
      postalCode: formData.get("zip"),
      country: formData.get("country"),
      phoneNumber: formData.get("phone"),
    },
    items: state.cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    shippingFee: 0,
    taxes:
      state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0) *
      0.05,
  };

  feedback("Creating order...");
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Unable to create order");
    const summary = await response.json();

    const payment = await state.stripe.confirmCardPayment(
      summary.clientSecret,
      {
        payment_method: {
          card: state.cardElement,
          billing_details: {
            name: payload.fullName,
            email: payload.email,
            phone: payload.phoneNumber,
          },
        },
      }
    );

    if (payment.error) {
      feedback(payment.error.message ?? "Payment failed.");
      return;
    }

    await fetch("/api/orders/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: summary.order.id,
        paymentIntentId: payment.paymentIntent.id,
      }),
    });

    feedback(
      "Order confirmed! Check your WhatsApp, Messenger, phone, and email for updates."
    );
    state.cart = [];
    persistCart();
    renderCart();
    event.target.reset();
  } catch (error) {
    console.error(error);
    feedback("Something went wrong. Please try again.");
  }
}

async function loadOrderHistory(event) {
  event.preventDefault();
  const email = new FormData(event.target).get("email");
  const res = await fetch(
    `/api/orders/history?email=${encodeURIComponent(email)}`
  );
  const orders = await res.json();
  selectors.historyResults.innerHTML =
    orders.length === 0
      ? "<p>No orders found.</p>"
      : orders
          .map(
            (order) => `
        <div class="order-card">
          <strong>${order.referenceCode}</strong> &middot; ${new Date(
              order.createdAt
            ).toLocaleDateString()}
          <p>Status: ${order.status}</p>
          <p>Total: ${formatCurrency(order.total)}</p>
          <a href="${order.invoiceUrl}" target="_blank">Invoice</a>
        </div>`
          )
          .join("");
}

function formatCurrency(value, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function feedback(message) {
  selectors.checkoutMessage.textContent = message;
}

init();
