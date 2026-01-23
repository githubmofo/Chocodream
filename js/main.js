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
                cartIcon.innerHTML = 'ðŸ›’ <span class="cart-count" id="cartCount">0</span>';
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

// If Firebase is available, listen for auth state changes and update navbar username
(function attachFirebaseNavbar() {
    const USER_CACHE_KEY = 'chocodream_user_cache';

    function getInitials(name) {
        if (!name) return 'U';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    function createProfileCard(name, email) {
        const initials = getInitials(name);
        const profileCard = document.createElement('div');
        profileCard.className = 'user-profile-card';
        profileCard.innerHTML = `
            <div class="user-avatar">${initials}</div>
            <div class="user-info">
                <span class="user-name">${name}</span>
            </div>
            <div class="user-dropdown-container">
                <button class="dropdown-arrow" id="dropdownArrow">></button>
                <div class="dropdown-menu" id="dropdownMenu">
                    <button class="dropdown-item logout-btn" id="logoutBtn">Logout</button>
                </div>
            </div>
        `;

        // Add dropdown toggle functionality
        const dropdownArrow = profileCard.querySelector('#dropdownArrow');
        const dropdownMenu = profileCard.querySelector('#dropdownMenu');

        if (dropdownArrow && dropdownMenu) {
            dropdownArrow.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                profileCard.classList.toggle('dropdown-open');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function (e) {
                if (!profileCard.contains(e.target)) {
                    profileCard.classList.remove('dropdown-open');
                }
            });
        }

        // Add logout functionality
        const logoutBtn = profileCard.querySelector('#logoutBtn');
        if (logoutBtn && typeof firebase !== 'undefined' && firebase.auth) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                // Clear cache first
                localStorage.removeItem(USER_CACHE_KEY);
                firebase.auth().signOut().then(function () {
                    showToast('Logged out successfully');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 500);
                }).catch(function (err) {
                    console.error('Logout error', err);
                    showToast('Logout failed');
                });
            });
        }

        return profileCard;
    }

    function saveUserCache(userName, userEmail, uid) {
        try {
            localStorage.setItem(USER_CACHE_KEY, JSON.stringify({
                name: userName,
                email: userEmail,
                uid: uid,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Failed to save user cache:', e);
        }
    }

    function getUserCache() {
        try {
            const cached = localStorage.getItem(USER_CACHE_KEY);
            if (!cached) return null;
            const data = JSON.parse(cached);
            // Cache is valid for 24 hours
            if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem(USER_CACHE_KEY);
                return null;
            }
            return data;
        } catch (e) {
            return null;
        }
    }

    function clearUserCache() {
        try {
            localStorage.removeItem(USER_CACHE_KEY);
        } catch (e) {
            console.warn('Failed to clear user cache:', e);
        }
    }

    function updateNavbar(user, useCache) {
        const navRight = document.querySelector('.nav-right');
        if (!navRight) {
            console.warn('nav-right element not found');
            return;
        }

        const loginBtn = document.querySelector('.login-btn');
        const existingProfile = document.querySelector('.user-profile-card');

        if (user) {
            // Remove login button if it exists
            if (loginBtn) {
                loginBtn.remove();
            }

            // If pre-rendered card exists with matching UID, we'll continue and hydrate it
            // with live data and full listeners from createProfileCard
            const isPreRendered = existingProfile && existingProfile.classList.contains('pre-rendered');

            // Fetch user profile to get name
            if (firebase.database) {
                firebase.database().ref('users/' + user.uid).once('value').then(function (snapshot) {
                    const profile = snapshot.val();
                    const userName = (profile && profile.name) || user.displayName || (user.email ? user.email.split('@')[0] : '') || 'User';
                    const userEmail = user.email || '';

                    // Save to cache
                    saveUserCache(userName, userEmail, user.uid);

                    // Remove existing if different UID or if we need to hydrate
                    if (existingProfile) {
                        existingProfile.remove();
                    }


                    const profileCard = createProfileCard(userName, userEmail);
                    profileCard.dataset.uid = user.uid;
                    // Insert before cart icon
                    const cartIcon = navRight.querySelector('.cart-icon');
                    if (cartIcon) {
                        navRight.insertBefore(profileCard, cartIcon);
                    } else {
                        navRight.appendChild(profileCard);
                    }
                }).catch(function (err) {
                    console.warn('Error fetching user profile:', err);
                    // Fallback
                    const userName = user.displayName || (user.email ? user.email.split('@')[0] : '') || 'User';
                    const userEmail = user.email || '';
                    saveUserCache(userName, userEmail, user.uid);

                    if (existingProfile) {
                        existingProfile.remove();
                    }

                    const profileCard = createProfileCard(userName, userEmail);
                    profileCard.dataset.uid = user.uid;
                    const cartIcon = navRight.querySelector('.cart-icon');
                    if (cartIcon) {
                        navRight.insertBefore(profileCard, cartIcon);
                    } else {
                        navRight.appendChild(profileCard);
                    }
                });

            } else {
                // Fallback if database not available
                const userName = user.displayName || (user.email ? user.email.split('@')[0] : '') || 'User';
                const userEmail = user.email || '';
                saveUserCache(userName, userEmail, user.uid);

                if (existingProfile) {
                    existingProfile.remove();
                }

                const profileCard = createProfileCard(userName, userEmail);
                profileCard.dataset.uid = user.uid;
                const cartIcon = navRight.querySelector('.cart-icon');
                if (cartIcon) {
                    navRight.insertBefore(profileCard, cartIcon);
                } else {
                    navRight.appendChild(profileCard);
                }
            }

        } else {
            // Clear cache when no user
            clearUserCache();

            // Remove profile card if exists
            if (existingProfile) {
                existingProfile.remove();
            }

            // Add login button if it doesn't exist
            if (!loginBtn) {
                const loginLink = document.createElement('a');
                loginLink.href = 'login.html';
                loginLink.className = 'login-btn';
                loginLink.textContent = 'Login/Signup';
                const cartIcon = navRight.querySelector('.cart-icon');
                if (cartIcon) {
                    navRight.insertBefore(loginLink, cartIcon);
                } else {
                    navRight.appendChild(loginLink);
                }
            }
        }
    }

    // Show cached profile card immediately on page load
    function showCachedProfile() {
        const cached = getUserCache();
        if (cached) {
            const navRight = document.querySelector('.nav-right');
            if (navRight && !document.querySelector('.user-profile-card')) {
                const profileCard = createProfileCard(cached.name, cached.email);
                profileCard.dataset.uid = cached.uid;
                const cartIcon = navRight.querySelector('.cart-icon');
                const loginBtn = navRight.querySelector('.login-btn');
                if (loginBtn) {
                    loginBtn.remove();
                }
                if (cartIcon) {
                    navRight.insertBefore(profileCard, cartIcon);
                } else {
                    navRight.appendChild(profileCard);
                }
            }
        }
    }

    // Wait for Firebase to be available
    let retryCount = 0;
    const maxRetries = 50; // Try for up to 5 seconds (50 * 100ms)

    function initFirebaseNavbar() {
        if (typeof firebase === 'undefined' || !firebase.auth) {
            retryCount++;
            if (retryCount < maxRetries) {
                // Try again after a short delay if Firebase isn't loaded yet
                setTimeout(initFirebaseNavbar, 100);
            } else {
                console.warn('Firebase not available after multiple retries. Using cached profile if available.');
                // Still show cached profile even if Firebase fails
                showCachedProfile();
            }
            return;
        }

        // Firebase is available, set up auth state listener
        try {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    updateNavbar(user, false);
                } else {
                    // Clear cache and show login button
                    clearUserCache();
                    updateNavbar(null, false);
                }
            });
        } catch (err) {
            console.error('Error setting up auth state listener:', err);
            // Fallback to cached profile
            showCachedProfile();
        }
    }

    // Show cached profile and initialize Firebase
    function initImmediate() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                initFirebaseNavbar();
            });
        } else {
            initFirebaseNavbar();
        }
    }

    // Start initialization
    initImmediate();
})();