const storageKey = "indiaborn-admin-token";
const state = {
  token: localStorage.getItem(storageKey),
  products: [],
  orders: [],
};

const els = {
  authPanel: document.getElementById("authPanel"),
  dashboard: document.getElementById("adminDashboard"),
  loginForm: document.getElementById("loginForm"),
  productForm: document.getElementById("productForm"),
  productMessage: document.getElementById("productMessage"),
  productTable: document.getElementById("productTable"),
  orderTable: document.getElementById("orderTable"),
  stats: document.getElementById("adminStats"),
  logout: document.getElementById("logoutBtn"),
  authMessage: document.getElementById("authMessage"),
};

function init() {
  if (!els.loginForm || !els.productForm || !els.logout) {
    console.error("Required elements not found. Check admin.html structure.");
    return;
  }

  els.loginForm.addEventListener("submit", login);
  els.productForm.addEventListener("submit", saveProduct);
  els.logout.addEventListener("click", logout);

  const uploadBtn = document.getElementById("uploadBtn");
  if (uploadBtn) {
    uploadBtn.addEventListener("click", uploadImage);
  }

  if (state.token) {
    showDashboard();
  }
}

async function login(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  els.authMessage.textContent = "Signing in...";

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    els.authMessage.textContent = "Invalid credentials.";
    return;
  }

  const result = await response.json();
  state.token = result.token;
  localStorage.setItem(storageKey, state.token);
  event.target.reset();
  if (els.logout) els.logout.style.display = "block";
  showDashboard();
}

function logout() {
  state.token = null;
  localStorage.removeItem(storageKey);
  if (els.dashboard) els.dashboard.classList.add("hidden");
  if (els.authPanel) els.authPanel.classList.remove("hidden");
  if (els.logout) els.logout.style.display = "none";
}

async function showDashboard() {
  if (!els.authPanel || !els.dashboard) {
    console.error("Dashboard elements not found");
    return;
  }
  els.authPanel.classList.add("hidden");
  els.dashboard.classList.remove("hidden");
  try {
    await Promise.all([loadStats(), loadProducts(), loadOrders()]);
  } catch (error) {
    console.error("Error loading dashboard:", error);
    els.productMessage.textContent = `Error: ${error.message}`;
  }
}

async function loadStats() {
  const overview = await authFetch("/api/admin/overview");
  els.stats.innerHTML = `
    <div><small>Orders</small><h3>${overview.totalOrders}</h3></div>
    <div><small>Revenue</small><h3>₹${overview.revenue.toFixed(2)}</h3></div>
    <div><small>Products</small><h3>${overview.products}</h3></div>
    <div><small>Low stock</small><h3>${overview.lowInventory}</h3></div>
  `;
}

async function loadProducts() {
  state.products = await authFetch("/api/products");
  renderProducts();
}

async function loadOrders() {
  state.orders = await authFetch("/api/orders");
  renderOrders();
}

function renderProducts() {
  els.productTable.innerHTML =
    state.products.length === 0
      ? "<p>No products yet.</p>"
      : `
    <table>
      <thead>
        <tr><th>Name</th><th>Price</th><th>Stock</th><th></th></tr>
      </thead>
      <tbody>
        ${state.products
          .map(
            (p) => `
          <tr>
            <td>${p.name}</td>
            <td>₹${(p.salePrice ?? p.price).toFixed(2)}</td>
            <td>${p.inventoryCount}</td>
            <td>
              <button data-edit="${p.id}">Edit</button>
              <button data-delete="${
                p.id
              }" class="button button--ghost">Delete</button>
            </td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>`;

  els.productTable.querySelectorAll("button[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => editProduct(btn.dataset.edit));
  });

  els.productTable.querySelectorAll("button[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => deleteProduct(btn.dataset.delete));
  });
}

function renderOrders() {
  els.orderTable.innerHTML =
    state.orders.length === 0
      ? "<p>No orders.</p>"
      : `
    <table>
      <thead>
        <tr><th>Reference</th><th>Status</th><th>Total</th><th>Updated</th></tr>
      </thead>
      <tbody>
        ${state.orders
          .map(
            (o) => `
          <tr>
            <td>${o.referenceCode}</td>
            <td>${o.status}</td>
            <td>₹${o.total.toFixed(2)}</td>
            <td>${new Date(o.updatedAt).toLocaleString()}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>`;
}

async function uploadImage() {
  const fileInput = document.getElementById("imageUpload");
  const file = fileInput?.files[0];
  if (!file) {
    alert("Please select an image file.");
    return;
  }

  if (!state.token) {
    alert("Please log in first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    els.productMessage.textContent = "Uploading image...";

    // Note: Don't set Content-Type header - browser will set it with boundary for FormData
    const response = await fetch("/api/upload/image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = "Upload failed";
      try {
        const errorText = await response.text();
        errorMessage = errorText || `HTTP ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (!result.url) {
      throw new Error("Server did not return image URL");
    }

    document.getElementById("imageUrl").value = result.url;
    const urlInput = document.querySelector("input[name='imageUrl']");
    if (urlInput) {
      urlInput.value = result.url;
    }

    const preview = document.getElementById("imagePreview");
    if (preview) {
      preview.innerHTML = `<img src="${result.url}" alt="Preview" style="max-width: 200px; margin-top: 1rem; border-radius: 8px;" />`;
    }
    els.productMessage.textContent = "Image uploaded successfully!";
    els.productMessage.style.color = "green";

    // Clear the file input
    fileInput.value = "";
  } catch (error) {
    console.error("Upload error:", error);
    els.productMessage.textContent = `Upload error: ${error.message}`;
    els.productMessage.style.color = "red";
  }
}

function editProduct(id) {
  const product = state.products.find((p) => p.id === id);
  if (!product) return;
  els.productForm.id.value = product.id;
  els.productForm.name.value = product.name;
  els.productForm.description.value = product.description;
  els.productForm.price.value = product.price;
  els.productForm.salePrice.value = product.salePrice ?? "";
  els.productForm.inventory.value = product.inventoryCount;
  els.productForm.category.value = product.category;
  const imageUrl = product.images?.[0]?.url ?? "";
  document.getElementById("imageUrl").value = imageUrl;
  document.querySelector("input[name='imageUrl']").value = imageUrl;
  if (imageUrl) {
    const preview = document.getElementById("imagePreview");
    preview.innerHTML = `<img src="${imageUrl}" alt="Preview" style="max-width: 200px; margin-top: 1rem;" />`;
  }
  els.productForm.isBestSeller.checked = product.isBestSeller;
  els.productForm.isNewArrival.checked = product.isNewArrival;
  els.productForm.isOnSale.checked = product.isOnSale;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  await authFetch(`/api/products/${id}`, { method: "DELETE" });
  els.productMessage.textContent = "Product deleted.";
  await loadProducts();
}

async function saveProduct(event) {
  event.preventDefault();
  const form = event.target;
  const imageUrl =
    document.getElementById("imageUrl").value || form.imageUrl?.value || "";
  const data = {
    name: form.name.value,
    description: form.description.value,
    price: Number(form.price.value),
    salePrice: form.salePrice.value ? Number(form.salePrice.value) : null,
    inventoryCount: Number(form.inventory.value),
    category: form.category.value || "Jewelry",
    isBestSeller: form.isBestSeller.checked,
    isNewArrival: form.isNewArrival.checked,
    isOnSale: form.isOnSale.checked,
    images: imageUrl
      ? [{ url: imageUrl, altText: form.name.value, isPrimary: true }]
      : [],
  };

  const id = form.id.value;
  const method = id ? "PUT" : "POST";
  const url = id ? `/api/products/${id}` : "/api/products";

  try {
    await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    els.productMessage.textContent = "Product saved successfully!";
    form.reset();
    document.getElementById("imagePreview").innerHTML = "";
    await loadProducts();
  } catch (error) {
    els.productMessage.textContent = `Error: ${error.message}`;
  }
}

async function authFetch(url, options = {}) {
  if (!state.token) {
    throw new Error("Not authenticated");
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${state.token}`,
  };

  // Only set Content-Type for JSON bodies, let browser set it for FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    logout();
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}`);
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
