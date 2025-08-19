window.cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
    const p = Number(price) || 0;
    cart.push({ name, price: p });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    // update UI if cart elements exist on current page
    if (document.getElementById("cart-items")) displayCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function displayCart() {
    const cartItems = document.getElementById("cart-items");
    const totalElem = document.getElementById("total");
    // guard in case this script runs on pages without cart markup
    if (!cartItems || !totalElem) return;
    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `<li class="cart-list-empty">Your cart is empty.</li>`;
        totalElem.innerText = "Total: ₹0";
        return;
    }

    cart.forEach((item, index) => {
        total += Number(item.price) || 0;
        const li = document.createElement("li");
        li.className = "cart-list-item";
        li.innerHTML = `
            <span>${item.name} - ₹${item.price}</span>
            <button onclick="removeFromCart(${index})" class="delete-btn">Remove</button>
        `;
        cartItems.appendChild(li);
    });

    totalElem.innerText = "Total: ₹" + total;
}

function updateCartCount() {
    const countElem = document.getElementById("cart-count");
    if (countElem) countElem.innerText = cart.length;
}

// Always initialize display after DOM is ready
document.addEventListener('DOMContentLoaded', displayCart);