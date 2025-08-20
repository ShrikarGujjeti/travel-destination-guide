// script.js

let cart = [];
let total = 0;

// Function to add items to cart
function addToCart(name, price) {
    cart.push({ name, price });
    total += price;

    updateCartDisplay();
}

// Update the cart section in HTML
function updateCartDisplay() {
    const cartList = document.getElementById("cart-list");
    const totalSpan = document.getElementById("total");

    cartList.innerHTML = ""; // Clear existing list
    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ₹${item.price}`;
        
        // Optional: Add remove button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.onclick = () => removeFromCart(index);
        removeBtn.style.marginLeft = "10px";
        li.appendChild(removeBtn);

        cartList.appendChild(li);
    });

    totalSpan.textContent = total;
}

// Remove item from cart
function removeFromCart(index) {
    total -= cart[index].price;
    cart.splice(index, 1);
    updateCartDisplay();
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert(`Total amount: ₹${total}. Proceeding to payment...`);

    // Razorpay Integration
    var options = {
        "key": "YOUR_RAZORPAY_KEY", // Replace with your Razorpay key
        "amount": total * 100, // Amount in paise
        "currency": "INR",
        "name": "AA Travels",
        "description": "Travel Package Payment",
        "handler": function (response){
            alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
            cart = [];
            total = 0;
            updateCartDisplay();
        },
        "prefill": {
            "name": "",
            "email": "",
            "contact": ""
        },
        "theme": {
            "color": "#fc0050"
        }
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
}
