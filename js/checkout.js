// Checkout flow: collects user details, saves order to Firebase Realtime DB, clears cart

// Make saveOrder available globally for checkout.html inline script
window.saveOrderToFirebase = saveOrder;

function getCart() {
  try { return JSON.parse(localStorage.getItem('chocodream_cart') || '{}'); } catch { return {}; }
}

function getCartItemsArray() {
  const cart = getCart();
  return Object.values(cart || {}).map(it => ({ id: it.id, name: it.name, price: it.price, quantity: it.quantity || 1, image: it.image, type: it.type }));
}

function computeTotal(items) {
  return items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
}

function createModal() {
  let modal = document.getElementById('orderModal');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.id = 'orderModal';
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-card" style="grid-template-columns:1fr; max-width:620px;">
      <button class="close" id="orderModalClose">×</button>
      <div class="modal-body">
        <h3 style="margin:0 0 8px;">Checkout Details</h3>
        <p style="margin:0 0 12px; color:#6b4a2b;">Please confirm your info to complete the order.</p>
        <form id="orderForm" class="order-form" style="display:grid; gap:10px;">
          <input type="text" id="orderName" placeholder="Full Name" required>
          <input type="email" id="orderEmail" placeholder="Email" required>
          <input type="tel" id="orderPhone" placeholder="Mobile Number" required>
          <textarea id="orderAddress" placeholder="Shipping Address" rows="3" required></textarea>
          <button type="submit" class="btn-cart" id="confirmOrderBtn">Place Order</button>
        </form>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.getElementById('orderModalClose').addEventListener('click', closeModal);
  return modal;
}

function closeModal() {
  const m = document.getElementById('orderModal');
  if (m) m.classList.remove('active');
}

function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show'); setTimeout(()=> t.classList.remove('show'), 1800);
}

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

async function handleCheckoutClick() {
  const items = getCartItemsArray();
  if (!items.length) { toast('Your cart is empty'); return; }
  
  // Check if user is logged in
  if (!isUserLoggedIn()) {
    alert('Please Sign in before Checking out your order');
    window.location.href = 'login.html';
    return;
  }
  
  const modal = createModal();
  const user = typeof firebase !== 'undefined' && firebase.auth ? firebase.auth().currentUser : null;
  if (user) {
    const emailEl = modal.querySelector('#orderEmail');
    if (emailEl) emailEl.value = user.email || '';
    const nameEl = modal.querySelector('#orderName');
    if (nameEl) nameEl.value = user.displayName || '';
  }
  modal.classList.add('active');
  const form = modal.querySelector('#orderForm');
  form.onsubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is still logged in before submitting
    if (!isUserLoggedIn()) {
      alert('Please Sign in before Checking out your order');
      closeModal();
      window.location.href = 'login.html';
      return;
    }
    
    const name = modal.querySelector('#orderName').value.trim();
    const email = modal.querySelector('#orderEmail').value.trim();
    const phone = modal.querySelector('#orderPhone').value.trim();
    const address = modal.querySelector('#orderAddress').value.trim();
    const total = computeTotal(items);
    const orderId = 'OD' + Date.now();
    try {
      await saveOrder({ orderId, name, email, phone, address, total, items });
      localStorage.removeItem('chocodream_cart');
      const cartCountEl = document.getElementById('cartCount'); if (cartCountEl) cartCountEl.textContent = '0';
      toast('Order placed successfully');
      closeModal();
    } catch (err) {
      console.error(err);
      toast('Failed to save order');
    }
  };
}

export function attachCheckoutHandler() {
  document.querySelectorAll('.checkout-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      handleCheckoutClick();
    });
  });
}

// Auto-attach when module is loaded
attachCheckoutHandler();

document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout page loaded');
    
    let cart = JSON.parse(localStorage.getItem('chocodream_cart')) || {};
    let savedForLater = JSON.parse(localStorage.getItem('chocodream_saved_later')) || {};
    let orderData = {};
    let appliedPromo = null;

    console.log('Cart:', cart);
    console.log('Cart items count:', Object.keys(cart).length);

    const promoCodes = {
        SWEET10: { type: 'percentage', value: 10, minOrder: 0 },
        CHOCO20: { type: 'percentage', value: 20, minOrder: 500 },
        FIRST50: { type: 'fixed', value: 50, minOrder: 200 },
        BULK25: { type: 'percentage', value: 25, minOrder: 1000 }
    };

    const sweetMessages = [
        "Your chocolates are being prepared with extra love and care! 🍫💕",
        "Each chocolate is handcrafted just for you! ✨",
        "Sweet dreams are made of chocolate, and yours are on the way! 🌟",
        "Happiness is a box of chocolates coming your way! 😊"
    ];

    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.className = `toast show ${type}`;
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        return /^[0-9]{10}$/.test(phone);
    }

    function validatePincode(pincode) {
        return /^[0-9]{6}$/.test(pincode);
    }

    function validateCardNumber(cardNumber) {
        return /^[0-9\s]{13,19}$/.test(cardNumber.replace(/\s/g, ''));
    }

    function validateExpiryDate(expiry) {
        return /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiry);
    }

    function validateCVV(cvv) {
        return /^[0-9]{3,4}$/.test(cvv);
    }

    function validateUPI(upiId) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(upiId);
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = '#d32f2f';
        }
    }

    function clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    function calculateTotals() {
        let subtotal = 0;
        for (let id in cart) {
            subtotal += cart[id].price * cart[id].quantity;
        }
        let shipping = subtotal > 999 ? 0 : 50;
        let discount = 0;
        if (appliedPromo) {
            const promo = promoCodes[appliedPromo];
            if (subtotal >= promo.minOrder) {
                if (promo.type === 'percentage') {
                    discount = (subtotal * promo.value) / 100;
                } else {
                    discount = promo.value;
                }
            }
        }
        let afterDiscount = subtotal - discount;
        let gst = (afterDiscount * 18) / 100;
        let total = afterDiscount + shipping + gst;
        return { subtotal, discount, shipping, gst, total };
    }

    function updatePriceDisplay() {
        const totals = calculateTotals();

        document.getElementById('subtotal').textContent = `$${totals.subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`;
        document.getElementById('gst').textContent = `$${totals.gst.toFixed(2)}`;
        document.getElementById('finalTotal').textContent = `$${totals.total.toFixed(2)}`;
        document.getElementById('btnAmount').textContent = `$${totals.total.toFixed(2)}`;

        const discountRow = document.getElementById('discountRow');
        const discountAmount = document.getElementById('discountAmount');
        if (totals.discount > 0) {
            discountAmount.textContent = `-$${totals.discount.toFixed(2)}`;
            discountRow.style.display = 'flex';
        } else {
            discountRow.style.display = 'none';
        }
    }

    function displayCheckoutItems() {
        console.log('displayCheckoutItems called');
        const checkoutItems = document.getElementById('checkoutItems');
        
        if (!checkoutItems) {
            console.error('checkoutItems element not found!');
            return;
        }

        if (Object.keys(cart).length === 0) {
            checkoutItems.innerHTML = '<div class="empty-cart">Your cart is empty! <a href="products.html">Shop now</a></div>';
            updatePriceDisplay();
            return;
        }

        let html = '';
        for (let id in cart) {
            const item = cart[id];
            html += `
                <div class="cart-item" data-id="${id}">
                    <div class="item-details">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">${item.price}</span>
                        <span class="item-qty">Qty: ${item.quantity}</span>
                        <div class="item-actions">
                            <button type="button" class="remove-btn">Remove</button>
                            <button type="button" class="save-btn">Save for Later</button>
                        </div>
                    </div>
                </div>
            `;
        }

        checkoutItems.innerHTML = html;
        console.log('Items displayed');
        addCartActionListeners();
        updatePriceDisplay();
    }

    function displaySavedForLaterItems() {
        const savedItems = document.getElementById('savedForLaterItems');
        if (!savedItems) return;

        if (Object.keys(savedForLater).length === 0) {
            savedItems.innerHTML = '<div class="empty-cart">No saved items yet.</div>';
            return;
        }

        let html = '';
        for (let id in savedForLater) {
            const item = savedForLater[id];
            html += `
                <div class="cart-item" data-id="${id}">
                    <div class="item-details">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">$${item.price}</span>
                        <span class="item-qty">Qty: ${item.quantity}</span>
                        <div class="item-actions">
                            <button type="button" class="remove-btn">Remove</button>
                            <button type="button" class="move-cart-btn">Move to Cart</button>
                        </div>
                    </div>
                </div>
            `;
        }

        savedItems.innerHTML = html;
        addSavedItemActionListeners();
    }

    function addCartActionListeners() {
        document.querySelectorAll('.cart-item .remove-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = this.closest('.cart-item').dataset.id;
                delete cart[itemId];
                localStorage.setItem('chocodream_cart', JSON.stringify(cart));
                displayCheckoutItems();
                showToast('Item removed from cart');
            });
        });

        document.querySelectorAll('.cart-item .save-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = this.closest('.cart-item').dataset.id;
                savedForLater[itemId] = cart[itemId];
                delete cart[itemId];
                localStorage.setItem('chocodream_cart', JSON.stringify(cart));
                localStorage.setItem('chocodream_saved_later', JSON.stringify(savedForLater));
                displayCheckoutItems();
                displaySavedForLaterItems();
                showToast('Item saved for later');
            });
        });
    }

    function addSavedItemActionListeners() {
        document.querySelectorAll('#savedForLaterItems .remove-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = this.closest('.cart-item').dataset.id;
                delete savedForLater[itemId];
                localStorage.setItem('chocodream_saved_later', JSON.stringify(savedForLater));
                displaySavedForLaterItems();
                showToast('Item removed');
            });
        });

        document.querySelectorAll('#savedForLaterItems .move-cart-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const itemId = this.closest('.cart-item').dataset.id;
                cart[itemId] = savedForLater[itemId];
                delete savedForLater[itemId];
                localStorage.setItem('chocodream_cart', JSON.stringify(cart));
                localStorage.setItem('chocodream_saved_later', JSON.stringify(savedForLater));
                displayCheckoutItems();
                displaySavedForLaterItems();
                showToast('Item moved to cart');
            });
        });
    }

    function applyPromoCode() {
        const promoInput = document.getElementById('promoCode');
        const promoMessage = document.getElementById('promoMessage');
        const code = promoInput.value.toUpperCase().trim();

        if (!code) {
            promoMessage.innerHTML = '<span class="error">Please enter a promo code</span>';
            return;
        }

        if (!promoCodes[code]) {
            promoMessage.innerHTML = '<span class="error">Invalid promo code</span>';
            return;
        }

        const promo = promoCodes[code];
        const subtotal = calculateTotals().subtotal;

        if (subtotal < promo.minOrder) {
            promoMessage.innerHTML = `<span class="error">Minimum order of $${promo.minOrder} required</span>`;
            return;
        }

        appliedPromo = code;
        let discountText = promo.type === 'percentage' ? `${promo.value}% discount` : `$${promo.value} discount`;
        promoMessage.innerHTML = `<span class="success">✓ ${discountText} applied!</span>`;
        updatePriceDisplay();
        showToast('Promo code applied successfully!');
    }

    // Payment method toggle
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', () => {
            document.getElementById('upiDetails').style.display = 'none';
            document.getElementById('bankDetails').style.display = 'none';
            document.getElementById('cardDetails').style.display = 'none';

            if (option.value === 'upi' && option.checked) {
                document.getElementById('upiDetails').style.display = 'block';
            } else if (option.value === 'bank' && option.checked) {
                document.getElementById('bankDetails').style.display = 'block';
            } else if (option.value === 'card' && option.checked) {
                document.getElementById('cardDetails').style.display = 'block';
            }
        });
    });

    // Offer tag clicks
    document.querySelectorAll('.offer-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.getElementById('promoCode').value = tag.getAttribute('data-code');
            applyPromoCode();
        });
    });

    // Apply promo button
    document.getElementById('applyPromo').addEventListener('click', applyPromoCode);

    // Auto-format card number
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            e.target.value = value.match(/.{1,4}/g)?.join(' ') || value;
        });
    }

    // Auto-format expiry
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // Form submission
    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.terms = document.getElementById('terms').checked;

        // Basic validation
        let isValid = true;

        if (!data.firstName.trim()) {
            showError('firstNameError', 'First name is required');
            isValid = false;
        }

        if (!validateEmail(data.email)) {
            showError('emailError', 'Please enter a valid email');
            isValid = false;
        }

        if (!validatePhone(data.phone)) {
            showError('phoneError', 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        if (!validatePincode(data.pincode)) {
            showError('pincodeError', 'Please enter a valid 6-digit pincode');
            isValid = false;
        }

        if (!data.terms) {
            showError('termsError', 'Please accept the terms and conditions');
            isValid = false;
        }

        // Payment method validation
        if (data.payment === 'upi' && !validateUPI(data.upiId)) {
            showError('upiIdError', 'Please enter a valid UPI ID');
            isValid = false;
        }

        if (data.payment === 'bank' && !data.bankName) {
            showError('bankNameError', 'Please select a bank');
            isValid = false;
        }

        if (data.payment === 'card') {
            if (!validateCardNumber(data.cardNumber)) {
                showError('cardNumberError', 'Please enter a valid card number');
                isValid = false;
            }
            if (!validateExpiryDate(data.expiryDate)) {
                showError('expiryDateError', 'Please enter valid expiry date (MM/YY)');
                isValid = false;
            }
            if (!validateCVV(data.cvv)) {
                showError('cvvError', 'Please enter a valid CVV');
                isValid = false;
            }
        }

        if (!isValid) {
            showToast('Please fix the errors in the form', 'error');
            return;
        }

        // Process order
        const totals = calculateTotals();
        const orderNumber = 'CD' + Date.now();
        const orderId = 'ORD' + Date.now();
        
        orderData = {
            orderId: orderId,
            orderNumber: orderNumber,
            orderDate: new Date().toLocaleDateString('en-IN'),
            items: cart,
            customer: data,
            totals: totals,
            appliedPromo: appliedPromo,
            paymentMethod: data.payment
        };

        // Save to Firebase
        try {
            const btn = document.getElementById('placeOrderBtn');
            btn.disabled = true;
            btn.innerHTML = '<span class="loading">Processing...</span>';

            // Prepare order data for Firebase
            const firebaseOrderData = {
                orderId: orderId,
                orderNumber: orderNumber,
                items: cart,
                customer: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    city: data.city,
                    pincode: data.pincode,
                    state: data.state || '',
                    country: data.country || 'India'
                },
                paymentMethod: data.payment,
                totals: totals,
                appliedPromo: appliedPromo
            };

            // Save to Firebase
            await saveOrder(firebaseOrderData);

            // Also save to localStorage for backward compatibility
            localStorage.setItem('chocodream_latest_order', JSON.stringify(orderData));
            localStorage.removeItem('chocodream_cart');

            // Redirect to success page
            setTimeout(() => {
                window.location.href = 'order-success.html?order=' + orderId;
            }, 1000);
        } catch (error) {
            console.error('Error saving order to Firebase:', error);
            showToast('Failed to save order. Please try again.', 'error');
            const btn = document.getElementById('placeOrderBtn');
            btn.disabled = false;
            btn.innerHTML = 'Place Order';
        }

    });

    // Update cart count
    function updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            let totalItems = 0;
            for (let id in cart) {
                totalItems += cart[id].quantity;
            }
            cartCount.textContent = totalItems;
        }
    }

    // Enrich cart with images from products.json if missing, then initialize UI
    (async function enrichAndInit(){
        try {
            const needsImage = Object.values(cart).some(it => !it.image && !it.imgSrc);
            if (needsImage) {
                const res = await fetch('data/products.json');
                if (res.ok) {
                    const catalog = await res.json();
                    const byId = new Map();
                    const byName = new Map();
                    catalog.forEach(p => { byId.set(String(p.id), p); byName.set((p.name||'').toLowerCase(), p); });
                    for (const key in cart) {
                        if (!cart.hasOwnProperty(key)) continue;
                        const it = cart[key];
                        if (it && !it.image && !it.imgSrc) {
                            const p = byId.get(String(it.id)) || byName.get((it.name||'').toLowerCase());
                            if (p && p.image) {
                                cart[key].image = p.image;
                            }
                        }
                    }
                    localStorage.setItem('chocodream_cart', JSON.stringify(cart));
                }
            }
        } catch (e) { /* ignore */ }

        displayCheckoutItems();
        displaySavedForLaterItems();
        updateCartCount();
        console.log('Checkout initialized successfully');
    })();
});
