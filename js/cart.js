// Make sure cart is available globally
var cart = {};

// Initialize cart from localStorage (use unified key used by checkout page)
function initCart() {
    try {
        const savedCart = localStorage.getItem('chocodream_cart');
        cart = savedCart ? JSON.parse(savedCart) : {};
    } catch (e) {
        cart = {};
        console.error('Error loading cart:', e);
    }
}

// Add to cart function - MUST BE GLOBAL
function addToCart(id, name, price, image, type) {
    // Initialize cart if not already done
    if (typeof cart === 'undefined') {
        initCart();
    }
    
    if (cart[id]) {
        cart[id].quantity++;
    } else {
        cart[id] = {
            name: name,
            price: price,
            quantity: 1,
            // Optional metadata for richer checkout UI
            image: image || cart[id]?.image || undefined,
            type: type || cart[id]?.type || undefined
        };
    }

    // Save to localStorage (use unified key for checkout page)
    try {
        localStorage.setItem('chocodream_cart', JSON.stringify(cart));
        updateCartCount();
        if (typeof showToast === 'function') showToast(name + ' added to cart!');
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;
    
    let totalItems = 0;
    for (let id in cart) {
        if (cart.hasOwnProperty(id)) {
            totalItems += cart[id].quantity;
        }
    }
    cartCount.textContent = totalItems;
}

// Display cart items
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    let total = 0;

    if (Object.keys(cart).length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--light-brown); padding: 2rem;">Your cart is empty</p>';
        if (cartTotal) cartTotal.textContent = '₹0';
        return;
    }

    for (let id in cart) {
        if (cart.hasOwnProperty(id)) {
            const item = cart[id];
            total += item.price * item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            const dataId = String(id);
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${Number(item.price).toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="qty-btn" type="button" data-action="dec" data-id="${dataId}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" type="button" data-action="inc" data-id="${dataId}">+</button>
                    </div>
                    <button class="remove-btn" type="button" data-action="remove" data-id="${dataId}">Remove</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        }
    }

    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Increase quantity
function increaseQuantity(id) {
    if (cart[id]) {
        cart[id].quantity++;
        localStorage.setItem('chocodream_cart', JSON.stringify(cart));
        updateCartCount();
        displayCart();
    }
}

// Decrease quantity
function decreaseQuantity(id) {
    if (cart[id] && cart[id].quantity > 1) {
        cart[id].quantity--;
        localStorage.setItem('chocodream_cart', JSON.stringify(cart));
        updateCartCount();
        displayCart();
    }
}

// Remove from cart
function removeFromCart(id) {
    if (cart[id]) {
        delete cart[id];
        localStorage.setItem('chocodream_cart', JSON.stringify(cart));
        updateCartCount();
        displayCart();
        showToast('Item removed from cart');
    }
}

// Initialize cart modal
function initCartModal() {
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');

    if (cartIcon && cartModal && closeCart) {
        cartIcon.addEventListener('click', (e) => {
            // Ensure consistent behavior: open modal everywhere
            if (e && typeof e.preventDefault === 'function') e.preventDefault();
            if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
            cartModal.classList.add('active');
            displayCart();
        });

        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });

        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });

        // Delegate clicks inside modal for qty +/- and remove
        cartModal.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const action = btn.getAttribute('data-action');
            const id = btn.getAttribute('data-id');
            if (!action) return;
            if (action === 'inc') {
                increaseQuantity(id);
            } else if (action === 'dec') {
                decreaseQuantity(id);
            } else if (action === 'remove') {
                removeFromCart(id);
            }
        });

        // Checkout button inside cart modal: redirect to checkout page
        const checkoutBtn = cartModal.querySelector('.checkout-btn') || document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                // if cart empty, show a message, else save current cart and go to checkout
                if (!cart || Object.keys(cart).length === 0) {
                    if (typeof showToast === 'function') {
                        showToast('Your cart is empty! Add items before checkout');
                    } else {
                        alert('Your cart is empty!');
                    }
                    return;
                }

                // Check if user is logged in
                function isUserLoggedIn() {
                    // Check Firebase auth if available
                    if (typeof firebase !== 'undefined' && firebase.auth) {
                        const user = firebase.auth().currentUser;
                        if (user) return true;
                    }
                    // Check cache
                    try {
                        const cached = localStorage.getItem('chocodream_user_cache');
                        if (cached) {
                            const data = JSON.parse(cached);
                            // Cache is valid for 24 hours
                            if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                                return true;
                            }
                        }
                    } catch (e) {
                        // Ignore cache errors
                    }
                    return false;
                }

                if (!isUserLoggedIn()) {
                    alert('Please Sign in before Checking out your order');
                    // Redirect to login page
                    window.location.href = 'login.html';
                    return;
                }

                try {
                    localStorage.setItem('chocodream_cart', JSON.stringify(cart));
                } catch (e) {
                    console.error('Error saving cart before checkout:', e);
                }
                window.location.href = 'checkout.html';
            });
        }
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    updateCartCount();
    initCartModal();
    
    // Make sure functions are available globally
    // Only set global addToCart if not already provided by the page (products.html provides its own)
    if (typeof window.addToCart === 'undefined') {
        window.addToCart = addToCart;
    }
    window.increaseQuantity = increaseQuantity;
    window.decreaseQuantity = decreaseQuantity;
    window.removeFromCart = removeFromCart;
});
