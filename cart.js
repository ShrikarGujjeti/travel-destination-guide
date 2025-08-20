window.cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(window.cart));
}

function updateCartCount() {
    const countElem = document.getElementById("cart-count");
    if (!countElem) return;
    const totalQty = window.cart.reduce((s, it) => s + (it.qty || 1), 0);
    countElem.innerText = totalQty;
}

function addToCart(name, price) {
    const p = Number(price) || 0;
    // merge by name
    const existing = window.cart.find(i => i.name === name);
    if (existing) {
        existing.qty = (existing.qty || 1) + 1;
    } else {
        window.cart.push({ name, price: p, qty: 1 });
    }
    saveCart();
    updateCartCount();
    if (document.getElementById("cart-items") || document.getElementById("cart-list")) displayCart();
}

function removeFromCart(index) {
    if (index < 0 || index >= window.cart.length) return;
    window.cart.splice(index, 1);
    saveCart();
    displayCart();
    updateCartCount();
}

function changeQuantity(index, delta) {
    const item = window.cart[index];
    if (!item) return;
    item.qty = Math.max(1, (item.qty || 1) + delta);
    saveCart();
    displayCart();
    updateCartCount();
}

function formatRupee(v) {
    try { return "₹" + Number(v).toLocaleString(); } catch (e) { return "₹" + v; }
}

function displayCart() {
    // support both cart page markup variants
    const listElem = document.getElementById("cart-items") || document.getElementById("cart-list");
    const totalElem = document.getElementById("total") || document.getElementById("total-amount");
    if (!listElem || !totalElem) return;

    listElem.innerHTML = "";
    if (!Array.isArray(window.cart) || window.cart.length === 0) {
        const li = document.createElement("li");
        li.className = "cart-empty";
        li.textContent = "Your cart is empty.";
        listElem.appendChild(li);
        totalElem.textContent = "Total: ₹0";
        return;
    }

    let subtotal = 0;
    window.cart.forEach((item, idx) => {
        const qty = item.qty || 1;
        const itemTotal = (Number(item.price) || 0) * qty;
        subtotal += itemTotal;

        const li = document.createElement("li");
        li.className = "cart-item";

        li.innerHTML = `
            <div class="ci-left">
                <div class="ci-name">${escapeHtml(item.name)}</div>
                <div class="ci-unit">Unit: ${formatRupee(item.price)}</div>
            </div>
            <div class="ci-qty">
                <button class="qty-btn" data-action="dec" aria-label="Decrease quantity" title="Decrease">−</button>
                <span class="qty-value">${qty}</span>
                <button class="qty-btn" data-action="inc" aria-label="Increase quantity" title="Increase">+</button>
            </div>
            <div class="ci-right">
                <div class="ci-total">${formatRupee(itemTotal)}</div>
                <button class="remove-btn" data-index="${idx}" aria-label="Remove item">Remove</button>
            </div>
        `;

        // event delegation attach handlers individually to avoid reliance on global onclick
        const decBtn = li.querySelector('button[data-action="dec"]');
        const incBtn = li.querySelector('button[data-action="inc"]');
        const removeBtn = li.querySelector('.remove-btn');

        decBtn.addEventListener('click', () => changeQuantity(idx, -1));
        incBtn.addEventListener('click', () => changeQuantity(idx, +1));
        removeBtn.addEventListener('click', () => removeFromCart(idx));

        listElem.appendChild(li);
    });

    totalElem.textContent = "Total: " + formatRupee(subtotal);
}

// small helper to avoid XSS when inserting names
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// initialize on DOM ready safely
document.addEventListener('DOMContentLoaded', function () {
    try { displayCart(); } catch (e) { /* ignore if cart DOM is absent */ }
    try { updateCartCount(); } catch (e) { /* ignore */ }
});