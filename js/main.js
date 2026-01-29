// Toast Notification Function
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize main functionality
document.addEventListener('DOMContentLoaded', function () {
    // Ensure global toast exists on every page
    (function ensureToast() {
        if (!document.getElementById('toast')) {
            const toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
    })();

    // Ensure cart icon exists in navbar on every page
    (function ensureCartIcon() {
        if (!document.getElementById('cartIcon')) {
            const right = document.querySelector('.nav-right');
            if (right) {
                const cartIcon = document.createElement('div');
                cartIcon.className = 'cart-icon';
                cartIcon.id = 'cartIcon';
                cartIcon.innerHTML = '🛒 <span class="cart-count" id="cartCount">0</span>';
                right.appendChild(cartIcon);
            }
        } else if (!document.getElementById('cartCount')) {
            const cnt = document.createElement('span');
            cnt.className = 'cart-count';
            cnt.id = 'cartCount';
            document.getElementById('cartIcon').appendChild(cnt);
        }
    })();

    // Ensure cart modal exists on every page
    (function ensureCartModal() {
        if (!document.getElementById('cartModal')) {
            const modal = document.createElement('div');
            modal.className = 'cart-modal';
            modal.id = 'cartModal';
            modal.innerHTML = '\n        <div class="cart-content">\n            <div class="cart-header">\n                <h2>Shopping Cart</h2>\n                <button class="close-cart" id="closeCart">&times;</button>\n            </div>\n            <div class="cart-items" id="cartItems"></div>\n            <div class="cart-footer">\n                <div class="cart-total">\n                    <span>Total:</span>\n                    <span id="cartTotal">$0</span>\n                </div>\n                <button class="checkout-btn">Checkout</button>\n            </div>\n        </div>';
            document.body.appendChild(modal);
        }
    })();

    // Inject Font Awesome for icons (once per page)
    (function injectIcons() {
        if (!document.querySelector('link[data-icons="fa6"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
            link.crossOrigin = 'anonymous';
            link.referrerPolicy = 'no-referrer';
            link.setAttribute('data-icons', 'fa6');
            document.head.appendChild(link);
        }
    })();

    // Create global loader and curtain
    (function mountLoader() {
        if (!document.getElementById('pageCurtain')) {
            const curtain = document.createElement('div');
            curtain.id = 'pageCurtain';
            curtain.className = 'page-curtain';
            document.body.appendChild(curtain);
        }
        if (!document.getElementById('pageLoader')) {
            const loader = document.createElement('div');
            loader.id = 'pageLoader';
            loader.className = 'page-loader active';
            loader.innerHTML = '<div class="loader-content">\
                <div class="choco-spinner"></div>\
                <div class="loader-text">Melting sweetness...</div>\
            </div>';
            document.body.appendChild(loader);
            // Hide after initial paint
            // Hide immediately when DOM is ready for faster perception
            const hideLoader = () => {
                setTimeout(() => loader.classList.remove('active'), 50);
            };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', hideLoader);
            } else {
                hideLoader();
            }
        }
    })();

    // Native navigation optimization: removed enablePageTransitions to allow browser defaults
    // which are faster and smoother than the previous curtain effect. 


    // Scroll reveal animations
    (function scrollReveal() {
        const revealTargets = [
            '.hero-content', '.hero-image',
            '.feature-card', '.product-card',
            '.about-grid > *', '.values-grid > *', '.mission-section',
            '.contact-item', '.contact-form-container',
            '.auth-container',
            '.summary-card', '.promo-section', '.price-breakdown'
        ];

        const elements = document.querySelectorAll(revealTargets.join(','));
        elements.forEach((el, idx) => {
            el.classList.add('reveal');
            if (el.matches('.hero-image, .values-grid > *:nth-child(odd), .contact-item:nth-child(odd)')) {
                el.classList.add('fade-right');
            }
            if (el.matches('.hero-content, .values-grid > *:nth-child(even), .contact-item:nth-child(even)')) {
                el.classList.add('fade-left');
            }
            // Stagger small initial delay
            el.style.transitionDelay = (idx % 8) * 40 + 'ms';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        elements.forEach(el => observer.observe(el));
    })();
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }


    // Sticky Navbar
    // Sticky Navbar optimized with requestAnimationFrame
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const navbar = document.getElementById('navbar');
                if (navbar) {
                    if (lastScrollY > 50) {
                        navbar.style.transform = 'translateY(0)'; // Ensure it stays put
                        navbar.style.backgroundColor = 'rgba(255,255,255,0.95)'; // Higher opacity
                        navbar.style.boxShadow = '0 4px 20px rgba(93, 64, 55, 0.15)';
                    } else {
                        navbar.style.backgroundColor = 'rgba(255,255,255,0.85)';
                        navbar.style.boxShadow = '0 2px 10px rgba(93, 64, 55, 0.1)';
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Auth Tabs Functionality
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginContent = document.getElementById('loginContent');
    const signupContent = document.getElementById('signupContent');

    if (loginTab && signupTab) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginContent.classList.add('active');
            signupContent.classList.remove('active');
        });

        signupTab.addEventListener('click', () => {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupContent.classList.add('active');
            loginContent.classList.remove('active');
        });
    }

    // Add home link functionality
    // Simplified logo click for instant navigation
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function (e) {
            // Let the link behave natively for maximum performance
        });
    }
});
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.add-to-cart-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Prefer explicit data-* on the button, else infer from closest .product-card
            let id = this.getAttribute('data-id');
            let name = this.getAttribute('data-name');
            let price = parseFloat(this.getAttribute('data-price'));

            let imageSrc = this.getAttribute('data-image');
            let type = this.getAttribute('data-type');
            if (!id || !name || isNaN(price) || !imageSrc || !type) {
                const card = this.closest('.product-card');
                if (card) {
                    // id
                    if (!id) id = card.getAttribute('data-id') || '';
                    // name
                    if (!name) {
                        const titleEl = card.querySelector('h3, .title');
                        if (titleEl) name = titleEl.textContent.trim();
                    }
                    // fallback id from name
                    if (!id && name) {
                        id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    }
                    // price: try flavour-select data-price-<value>, then .price text, then data-base-price
                    if (isNaN(price)) {
                        const flavourSelect = card.querySelector('.flavour-select');
                        if (flavourSelect) {
                            const selected = flavourSelect.value;
                            const attr = `data-price-${selected}`;
                            const attrVal = flavourSelect.getAttribute(attr);
                            if (attrVal) price = parseFloat(attrVal);
                        }
                        if (isNaN(price)) {
                            const priceEl = card.querySelector('.price');
                            if (priceEl) {
                                const text = priceEl.textContent.replace(/[^0-9.]/g, '');
                                const n = parseFloat(text);
                                if (!isNaN(n)) price = n;
                            }
                        }
                        if (isNaN(price)) {
                            const base = card.getAttribute('data-base-price');
                            if (base) price = parseFloat(base);
                        }
                    }
                    // image
                    if (!imageSrc) {
                        const imgEl = card.querySelector('img, .product-image');
                        if (imgEl) {
                            imageSrc = imgEl.getAttribute('src');
                        }
                    }
                    // type (if available through data or tag text)
                    if (!type) {
                        type = card.getAttribute('data-type') || '';
                        if (!type) {
                            const tagEl = card.querySelector('.tag, .badge');
                            if (tagEl) type = tagEl.textContent.trim();
                        }
                    }
                }
            }

            if (typeof addToCart === 'function' && id && name && !isNaN(price)) {
                addToCart(id, name, price, imageSrc, type);
            } else {
                alert('Unable to add item to cart. Please try again.');
            }
        });
    });
});

// Redundant Firebase navbar logic removed. Consolidation into auth-check.js for better performance and reliability.