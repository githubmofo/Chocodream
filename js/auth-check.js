(function () {
    const USER_CACHE_KEY = 'chocodream_user_cache';

    function getUserCache() {
        try {
            const cached = localStorage.getItem(USER_CACHE_KEY);
            if (!cached) return null;
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp > 86400000) return null;
            return data;
        } catch (e) { return null; }
    }

    function updateUI(userData) {
        if (!userData) {
            document.documentElement.classList.remove('has-user');
            const existingCard = document.querySelector('.user-profile-card');
            if (existingCard) existingCard.remove();
            const loginBtn = document.querySelector('.login-btn');
            if (loginBtn) loginBtn.style.display = 'inline-block';
            return;
        }

        // Save to cache
        try {
            localStorage.setItem(USER_CACHE_KEY, JSON.stringify({
                ...userData,
                timestamp: Date.now()
            }));
        } catch (e) { }

        document.documentElement.classList.add('has-user');
        const navRight = document.querySelector('.nav-right');
        if (!navRight) return;

        const existingCard = navRight.querySelector('.user-profile-card');
        if (existingCard) existingCard.remove();

        const loginBtn = navRight.querySelector('.login-btn');
        if (loginBtn) loginBtn.style.display = 'none';

        const parts = (userData.name || 'U').trim().split(/\s+/);
        const initials = parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : (userData.name || 'U').substring(0, 2).toUpperCase();

        const profileCard = document.createElement('div');
        profileCard.className = 'user-profile-card pre-rendered';
        profileCard.dataset.uid = userData.uid;
        profileCard.innerHTML = `
            <div class="user-avatar">${initials}</div>
            <div class="user-info">
                <span class="user-name">${userData.name}</span>
            </div>
            <div class="user-dropdown-container">
                <button class="dropdown-arrow" id="dropdownArrow" aria-label="Toggle menu">
                    <i class="fas fa-caret-down"></i>
                </button>
                <div class="dropdown-menu" id="dropdownMenu">
                    <button class="dropdown-item logout-btn" id="logoutBtn">Logout</button>
                </div>
            </div>
        `;

        const arrow = profileCard.querySelector('.dropdown-arrow');
        const avatar = profileCard.querySelector('.user-avatar');
        if (arrow) {
            arrow.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                profileCard.classList.toggle(window.innerWidth <= 768 ? 'mobile-dropdown-open' : 'dropdown-open');
            };
        }
        if (avatar && window.innerWidth <= 768) {
            avatar.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                profileCard.classList.toggle('mobile-dropdown-open');
            };
        }

        document.addEventListener('click', (e) => {
            if (!profileCard.contains(e.target)) {
                profileCard.classList.remove('dropdown-open', 'mobile-dropdown-open');
            }
        });

        const logoutBtn = profileCard.querySelector('#logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                localStorage.removeItem(USER_CACHE_KEY);
                if (typeof firebase !== 'undefined' && firebase.auth) {
                    firebase.auth().signOut().then(() => window.location.href = 'index.html');
                } else {
                    window.location.href = 'index.html';
                }
            });
        }

        const cartIcon = navRight.querySelector('.cart-icon');
        if (cartIcon) navRight.insertBefore(profileCard, cartIcon);
        else navRight.appendChild(profileCard);
    }

    function fastAuthRender() {
        const cached = getUserCache();
        if (cached) {
            updateUI(cached);
        } else {
            updateUI(null);
        }
    }

    // Run immediately for performance
    fastAuthRender();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fastAuthRender);
    }

    // Firebase Integration: Sync with actual auth state
    function initFirebaseSync() {
        if (typeof firebase === 'undefined' || !firebase.auth) {
            // Retry for a bit if firebase isn't loaded yet
            if (!window._fbRetry) window._fbRetry = 0;
            if (window._fbRetry < 20) {
                window._fbRetry++;
                setTimeout(initFirebaseSync, 200);
            }
            return;
        }

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // If we have a user but no name/cache, fetch from DB
                const cached = getUserCache();
                if (!cached || cached.uid !== user.uid) {
                    if (firebase.database) {
                        firebase.database().ref('users/' + user.uid).once('value').then((snap) => {
                            const profile = snap.val();
                            const name = (profile && profile.name) || user.displayName || user.email.split('@')[0];
                            updateUI({ uid: user.uid, name: name, email: user.email });
                        });
                    } else {
                        const name = user.displayName || user.email.split('@')[0];
                        updateUI({ uid: user.uid, name: name, email: user.email });
                    }
                } else {
                    // Cache is valid and matches Firebase user, just ensure UI is updated
                    updateUI(cached);
                }
            } else {
                // Not logged in to firebase - clear UI
                updateUI(null);
            }
        });
    }

    initFirebaseSync();

    window.addEventListener('storage', (e) => {
        if (e.key === USER_CACHE_KEY) updateUI(getUserCache());
    });

    document.addEventListener('userLoggedIn', fastAuthRender);
})();
