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

    function fastAuthRender() {
        const cached = getUserCache();
        if (!cached) {
            document.documentElement.classList.remove('has-user');
            return;
        }

        // Apply class for CSS flicker prevention
        document.documentElement.classList.add('has-user');

        const navRight = document.querySelector('.nav-right');
        if (!navRight || navRight.querySelector('.user-profile-card')) return;

        const loginBtn = navRight.querySelector('.login-btn');
        if (loginBtn) loginBtn.style.display = 'none';

        const parts = (cached.name || 'U').trim().split(/\s+/);
        const initials = parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : (cached.name || 'U').substring(0, 2).toUpperCase();

        const profileCard = document.createElement('div');
        profileCard.className = 'user-profile-card pre-rendered';
        profileCard.dataset.uid = cached.uid;
        profileCard.style.opacity = '0';
        profileCard.style.animation = 'fadeIn 0.2s forwards';
        profileCard.innerHTML = `
            <div class="user-avatar">${initials}</div>
            <div class="user-info">
                <span class="user-name">${cached.name}</span>
            </div>
            <div class="user-dropdown-container">
                <button class="dropdown-arrow" id="dropdownArrow">></button>
                <div class="dropdown-menu" id="dropdownMenu">
                    <button class="dropdown-item logout-btn" id="logoutBtn">Logout</button>
                </div>
            </div>
        `;


        // Interaction logic for both desktop and mobile
        const arrow = profileCard.querySelector('.dropdown-arrow');
        const avatar = profileCard.querySelector('.user-avatar');

        // Desktop: arrow click toggles dropdown
        if (arrow) {
            arrow.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                profileCard.classList.toggle('dropdown-open');
            };
        }

        // Mobile: avatar click toggles mobile dropdown
        if (avatar) {
            avatar.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Check if mobile (screen width <= 768px)
                if (window.innerWidth <= 768) {
                    profileCard.classList.toggle('mobile-dropdown-open');
                }
            };
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileCard.contains(e.target)) {
                profileCard.classList.remove('dropdown-open');
                profileCard.classList.remove('mobile-dropdown-open');
            }
        });

        // Add logout functionality
        const logoutBtn = profileCard.querySelector('#logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                // Clear cache first
                localStorage.removeItem(USER_CACHE_KEY);
                // Try Firebase logout if available
                if (typeof firebase !== 'undefined' && firebase.auth) {
                    firebase.auth().signOut().then(function () {
                        window.location.href = 'index.html';
                    }).catch(function (err) {
                        console.error('Logout error', err);
                        window.location.href = 'index.html';
                    });
                } else {
                    // Fallback: just redirect
                    window.location.href = 'index.html';
                }
            });
        }

        const cartIcon = navRight.querySelector('.cart-icon');
        if (cartIcon) navRight.insertBefore(profileCard, cartIcon);
        else navRight.appendChild(profileCard);
    }

    // Run as fast as possible
    fastAuthRender();
    // Fallback if script executes before nav is ready (though it shouldn't if placed after)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fastAuthRender);
    }
})();
