// Advanced Products UI: Tabs, Filters, Animations, Cart Feedback
// Data
const PRODUCTS = [
    { id: 1, name: "Lindt Excellence 70% Cocoa", origin: "Switzerland", type: "Dark", price: 349, bestseller: true, image: "https://upload.wikimedia.org/wikipedia/commons/2/26/Lindt_Excellence_70%25_cacao.jpg" },
    { id: 2, name: "Toblerone Milk Chocolate", origin: "Switzerland", type: "Milk", price: 299, bestseller: true, image: "https://upload.wikimedia.org/wikipedia/commons/2/26/Toblerone_336g_2019.jpg" },
    { id: 3, name: "Côte d'Or Milk Bar", origin: "Belgium", type: "Milk", price: 399, bestseller: false, image: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Cote_d%27Or_milk_chocolate_bar.jpg" },
    { id: 4, name: "Godiva Dark Chocolate Bar 72%", origin: "Belgium", type: "Dark", price: 799, bestseller: false, image: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Godiva_72_percent_cacao_chocolate_bar.jpg" },
    { id: 5, name: "Valrhona Guanaja 70%", origin: "France", type: "Dark", price: 1099, bestseller: true, image: "https://upload.wikimedia.org/wikipedia/commons/3/33/Valrhona_Guanaja_bar.jpg" },
    { id: 6, name: "Michel Cluizel Noir 67%", origin: "France", type: "Dark", price: 999, bestseller: false, image: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Michel_Cluizel_chocolate_bar.jpg" },
    { id: 7, name: "Amedei Toscano Black 70", origin: "Italy", type: "Dark", price: 1299, bestseller: true, image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Amedei_Toscano_Black_70_chocolate.jpg" },
    { id: 8, name: "Venchi Gianduja Bar", origin: "Italy", type: "Gianduja", price: 899, bestseller: false, image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Venchi_Gianduja_bar.jpg" },
    { id: 9, name: "Cadbury Dairy Milk", origin: "UK", type: "Milk", price: 120, bestseller: true, image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Cadbury_Dairy_Milk_Chocolate_Bar.jpg" },
    { id: 10, name: "Green & Black's Organic 70%", origin: "UK", type: "Dark", price: 399, bestseller: false, image: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Green_%26_Black%27s_Organic_Dark_Chocolate.jpg" },
    { id: 11, name: "Ghirardelli Intense Dark 72%", origin: "USA", type: "Dark", price: 499, bestseller: true, image: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Ghirardelli_Intense_Dark_72.jpg" },
    { id: 12, name: "Hershey's Special Dark", origin: "USA", type: "Dark", price: 149, bestseller: false, image: "https://upload.wikimedia.org/wikipedia/commons/1/14/Hershey_Special_Dark_bar.jpg" },
    { id: 13, name: "Meiji Milk Chocolate", origin: "Japan", type: "Milk", price: 249, bestseller: true, image: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Meiji_milk_chocolate.jpg" },
    { id: 14, name: "Royce' Nama Chocolate", origin: "Japan", type: "Truffle", price: 1499, bestseller: false, image: "https://upload.wikimedia.org/wikipedia/commons/0/03/Royce_Nama_Chocolate.jpg" },
    { id: 15, name: "Amul Dark Chocolate 55%", origin: "India", type: "Dark", price: 120, bestseller: true, image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Amul_Dark_Chocolate.jpg" },
    { id: 16, name: "Mason & Co 70% Single Origin", origin: "India", type: "Single Origin", price: 399, bestseller: false, image: "https://upload.wikimedia.org/wikipedia/commons/1/12/Mason_and_Co_70_percent.jpg" },
    { id: 17, name: "Pacari Organic 70%", origin: "Ecuador", type: "Single Origin", price: 899, bestseller: true, image: "https://upload.wikimedia.org/wikipedia/commons/4/49/Pacari_Chocolate_bar.jpg" },
    { id: 18, name: "Franceschi Fine Cacao 70%", origin: "Venezuela", type: "Single Origin", price: 1099, bestseller: false, image: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Franceschi_chocolate.jpg" },
    { id: 19, name: "Valrhona Manjari 64% (Madagascar)", origin: "Madagascar", type: "Single Origin", price: 1099, bestseller: false, image: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Valrhona_Manjari_bar.jpg" },
    { id: 20, name: "Golden Tree Kingsbite", origin: "Ghana", type: "Milk", price: 399, bestseller: false, image: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Golden_Tree_Kingsbite.jpg" },
    { id: 21, name: "Chocolate Mayordomo (Table Chocolate)", origin: "Mexico", type: "Spiced", price: 349, bestseller: false, image: "https://upload.wikimedia.org/wikipedia/commons/2/20/Chocolate_Mayordomo.jpg" },
    { id: 22, name: "Kopenhagen Dark Bar", origin: "Brazil", type: "Dark", price: 799, bestseller: false, image: "https://upload.wikimedia.org/wikipedia/commons/3/31/Kopenhagen_chocolate.jpg" },
    { id: 23, name: "Amatller Dark 70%", origin: "Spain", type: "Dark", price: 649, bestseller: false, image: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Chocolate_Amatller_bar.jpg" },
    { id: 24, name: "Luker Chocolate 70%", origin: "Colombia", type: "Dark", price: 699, bestseller: false, image: "https://upload.wikimedia.org/wikipedia/commons/8/88/Luker_Chocolate_bar.jpg" }
];

const CATEGORY_LABELS = [
    "Most Luxurious",
    "Famous Globally",
    "Normal",
    "Rare & Limited",
    "Others"
];

// Category mapping logic
function categorize(product) {
    const premiumSet = new Set(["Valrhona Guanaja 70%", "Amedei Toscano Black 70", "Royce' Nama Chocolate", "Valrhona Manjari 64% (Madagascar)", "Franceschi Fine Cacao 70%", "Pacari Organic 70%"]);
    const famousSet = new Set(["Lindt Excellence 70% Cocoa", "Toblerone Milk Chocolate", "Cadbury Dairy Milk", "Ghirardelli Intense Dark 72%", "Hershey's Special Dark", "Meiji Milk Chocolate"]);
    const rareSet = new Set(["Royce' Nama Chocolate", "Franceschi Fine Cacao 70%", "Valrhona Manjari 64% (Madagascar)"]);

    if (premiumSet.has(product.name)) return "Most Luxurious";
    if (rareSet.has(product.name)) return "Rare & Limited";
    if (famousSet.has(product.name)) return "Famous Globally";
    if (product.price <= 450) return "Normal";
    return "Others";
}

// State
let state = {
    view: 'landing', // 'landing' | 'category'
    activeCategory: CATEGORY_LABELS[0],
    query: '',
    origin: '',
    type: '',
    priceMax: 0,
    sort: 'relevance'
};

// Utils: cart wrapper
function addToCart(product) {
    // Call the global addToCart from cart.js
    if (typeof window.addToCart === 'function') {
        window.addToCart(product.id, product.name, product.price, product.image, product.type);
    }

    // UI Feedback
    const btn = document.querySelector('.btn-cart[data-id="' + product.id + '"]');
    const imgSpan = document.querySelector('.lux-card img[alt="' + CSS.escape(product.name) + '"]');
    if (btn) {
        btn.style.boxShadow = '0 0 0 6px rgba(10,123,52,.18)';
        setTimeout(() => { btn.style.boxShadow = ''; }, 320);
    }
    if (imgSpan) flyToCart(imgSpan);
}

// Ensure updateCartCount is available if needed locally
if (typeof updateCartCount === 'undefined') {
    window.updateCartCount = () => { if (typeof window.updateCartCount === 'function') window.updateCartCount(); };
}


// Fly-to-cart animation
function flyToCart(imgEl) {
    const cartIcon = document.getElementById('cartIcon');
    if (!cartIcon || !imgEl) return;
    const clone = imgEl.cloneNode(true);
    const rect = imgEl.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    clone.style.position = 'fixed';
    clone.style.left = rect.left + 'px';
    clone.style.top = rect.top + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.borderRadius = '12px';
    clone.style.zIndex = '9999';
    clone.style.transition = 'transform .6s cubic-bezier(.22,.61,.36,1), opacity .6s ease';
    document.body.appendChild(clone);
    const dx = cartRect.left + cartRect.width / 2 - (rect.left + rect.width / 2);
    const dy = cartRect.top + cartRect.height / 2 - (rect.top + rect.height / 2);
    requestAnimationFrame(() => {
        clone.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(.2)';
        clone.style.opacity = '0.4';
    });
    setTimeout(() => { clone.remove(); }, 650);
}

// Rendering
function buildCategoryLanding() {
    const grid = document.getElementById('categoryGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const visuals = {
        'Most Luxurious': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1600&auto=format&fit=crop',
        'Famous Globally': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476e?q=80&w=1600&auto=format&fit=crop',
        'Normal': 'https://images.unsplash.com/photo-1615486364130-5b1d4cbbfdb1?q=80&w=1600&auto=format&fit=crop',
        'Rare & Limited': 'https://images.unsplash.com/photo-1526080652682-1d7bc7c843fd?q=80&w=1600&auto=format&fit=crop',
        'Others': 'https://images.unsplash.com/photo-1514517220031-66ee34d77f59?q=80&w=1600&auto=format&fit=crop'
    };
    CATEGORY_LABELS.forEach(label => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="cat-media">
                <img src="${visuals[label] || visuals['Others']}" alt="${label}">
            </div>
            <div class="cat-label">${label}<span>Explore →</span></div>
        `;
        card.addEventListener('click', () => {
            navigateToCategory(label);
        });
        grid.appendChild(card);
    });
}

function showView(viewName) {
    const landing = document.getElementById('categoriesView');
    const catView = document.getElementById('categoryView');
    if (!landing || !catView) return;
    if (viewName === 'landing') {
        landing.classList.remove('view-hidden');
        catView.classList.add('view-hidden');
        state.view = 'landing';
    } else {
        landing.classList.add('view-hidden');
        catView.classList.remove('view-hidden');
        state.view = 'category';
    }
}

function navigateToCategory(label) {
    state.activeCategory = label;
    updateSectionHeader();
    showView('category');
    showLoader(true);
    setTimeout(() => { renderProducts(); showLoader(false); }, 300);
    // update hash for deep-linking
    location.hash = '#cat=' + encodeURIComponent(label);
}

function buildTabs() {
    const tabs = document.getElementById('categoryTabs');
    tabs.innerHTML = '';
    CATEGORY_LABELS.forEach(label => {
        const b = document.createElement('button');
        b.className = 'tab-button' + (label === state.activeCategory ? ' active' : '');
        b.textContent = label;
        b.addEventListener('click', () => switchCategory(label));
        tabs.appendChild(b);
    });
}

function switchCategory(label) {
    if (label === state.activeCategory) return;
    state.activeCategory = label;
    updateSectionHeader();
    showLoader(true);
    // small delay to showcase skeleton
    setTimeout(() => {
        renderProducts();
        showLoader(false);
    }, 300);
}

function updateSectionHeader() {
    const eyebrow = document.getElementById('sectionEyebrow');
    const title = document.getElementById('sectionTitle');
    const subtitle = document.getElementById('sectionSubtitle');
    eyebrow.textContent = state.activeCategory;
    title.textContent = state.activeCategory + ' Chocolates';
    const descMap = {
        'Most Luxurious': 'Discover rare single-origin bars and indulgent limited editions.',
        'Famous Globally': 'Loved around the world. Timeless favorites and icons.',
        'Normal': 'Everyday treats with great taste and value.',
        'Rare & Limited': 'Micro-lots and limited runs for collectors and connoisseurs.',
        'Others': 'Unique styles, flavors, and regional specialties.'
    };
    subtitle.textContent = descMap[state.activeCategory] || '';
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === state.activeCategory);
    });
}

function collectFilters() {
    const origins = new Set();
    const types = new Set();
    PRODUCTS.forEach(p => { origins.add(p.origin); types.add(p.type); });
    const originSel = document.getElementById('originFilter');
    const typeSel = document.getElementById('typeFilter');
    originSel.innerHTML = '<option value="">All Origins</option>' + Array.from(origins).sort().map(o => `<option value="${o}">${o}</option>`).join('');
    typeSel.innerHTML = '<option value="">All Types</option>' + Array.from(types).sort().map(t => `<option value="${t}">${t}</option>`).join('');
}

function filterAndSort(list) {
    let out = list.slice();
    if (state.query) {
        const q = state.query.toLowerCase();
        out = out.filter(p => p.name.toLowerCase().includes(q) || (p.origin || '').toLowerCase().includes(q) || (p.type || '').toLowerCase().includes(q));
    }
    if (state.origin) out = out.filter(p => p.origin === state.origin);
    if (state.type) out = out.filter(p => p.type === state.type);
    if (state.priceMax && state.priceMax > 0) out = out.filter(p => p.price <= state.priceMax);

    switch (state.sort) {
        case 'price-low': out.sort((a, b) => a.price - b.price); break;
        case 'price-high': out.sort((a, b) => b.price - a.price); break;
        case 'name': out.sort((a, b) => a.name.localeCompare(b.name)); break;
        case 'popularity': out.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0)); break;
        default: break;
    }
    return out;
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.classList.add('fade-scale-exit');

    // compute data
    const scoped = PRODUCTS.filter(p => categorize(p) === state.activeCategory);
    const list = filterAndSort(scoped);

    // Use DocumentFragment for efficient DOM injection
    const fragment = document.createDocumentFragment();
    list.forEach((p, idx) => {
        const card = document.createElement('div');
        card.className = 'lux-card fade-scale-enter';
        card.style.animationDelay = (idx * 40) + 'ms'; // Reduced delay for snappier feel
        card.classList.add('stagger');
        card.innerHTML = `
            <div class="thumb" data-tilt>
                <img src="${p.image}" alt="${p.name}" loading="lazy"/>
                ${p.bestseller ? '<span class="badge">Bestseller</span>' : ''}
            </div>
            <div class="content">
                <div class="title">${p.name}</div>
                <div class="meta"><span>${p.origin}</span> • <span>${p.type}</span></div>
                <div class="price">₹${p.price}</div>
                <div class="actions">
                    <button class="btn-cart" data-id="${p.id}">Add to Cart</button>
                    <button class="btn-quick" data-id="${p.id}">Quick View</button>
                </div>
            </div>
        `;
        fragment.appendChild(card);
    });

    // swap content once
    grid.innerHTML = '';
    grid.appendChild(fragment);

    // enter transition
    window.requestAnimationFrame(() => {
        grid.classList.remove('fade-scale-exit');
        grid.querySelectorAll('.fade-scale-enter').forEach(el => {
            el.classList.add('fade-scale-enter-active');
            setTimeout(() => {
                el.classList.remove('fade-scale-enter', 'fade-scale-enter-active');
            }, 300);
        });
    });

    // bind interactions
    bindCartButtons();
    bindQuickView();
    bindTilt();
    updateCount(list.length);
}

function updateCount(n) {
    const el = document.getElementById('productCount');
    if (el) el.textContent = n;
}

function bindCartButtons() {
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'), 10);
            const prod = PRODUCTS.find(p => p.id === id);
            if (!prod) return;

            // If the product card includes a flavor selector, prefer its selected price
            const card = btn.closest('.lux-card, .card, .product-card');
            let productToAdd = Object.assign({}, prod);
            if (card) {
                const selectEl = card.querySelector('.flavour-select, .flavor');
                if (selectEl) {
                    const selected = selectEl.value;
                    let flavorPrice;
                    const attr = selectEl.getAttribute(`data-price-${selected}`);
                    if (attr) flavorPrice = parseFloat(attr);
                    if ((typeof flavorPrice === 'undefined' || isNaN(flavorPrice)) && selectEl.options && selectEl.selectedIndex >= 0) {
                        const opt = selectEl.options[selectEl.selectedIndex];
                        const m = opt && opt.text && opt.text.match(/([₹$])\s*([\d,]+(?:\.\d+)?)/);
                        if (m) flavorPrice = parseFloat(m[2].replace(/,/g, ''));
                    }
                    if (typeof flavorPrice !== 'undefined' && !isNaN(flavorPrice)) {
                        productToAdd.price = flavorPrice;
                        const optText = selectEl.options[selectEl.selectedIndex]?.text || selected;
                        productToAdd.name = prod.name + ' — ' + optText;
                    }
                }
            }

            addToCart(productToAdd);
        });
    });
}

function bindQuickView() {
    document.querySelectorAll('.btn-quick').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'), 10);
            const p = PRODUCTS.find(x => x.id === id);
            if (!p) return;
            openModal(p);
        });
    });
}

function bindTilt() {
    const thumbs = document.querySelectorAll('[data-tilt]');
    thumbs.forEach(container => {
        const maxTilt = 8;
        let ticking = false;

        function move(e) {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = container.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    const tiltX = (0.5 - y) * maxTilt;
                    const tiltY = (x - 0.5) * maxTilt;
                    container.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
                    ticking = false;
                });
                ticking = true;
            }
        }
        function reset() {
            window.requestAnimationFrame(() => {
                container.style.transform = 'rotateX(0) rotateY(0)';
                ticking = false;
            });
        }
        container.addEventListener('mousemove', move, { passive: true });
        container.addEventListener('mouseleave', reset, { passive: true });
    });
}

// Modal
function ensureModal() {
    if (document.getElementById('productModal')) return;
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'productModal';
    modal.innerHTML = `
        <div class="modal-card">
            <button class="close" id="modalClose">×</button>
            <div class="modal-media"><img id="modalImg" alt=""></div>
            <div class="modal-body">
                <div class="eyebrow" id="modalOrigin"></div>
                <h3 id="modalTitle"></h3>
                <p id="modalDesc">Finest selection with notes of fruit, nuts, and floral honey.</p>
                <div><strong id="modalType"></strong></div>
                <div class="price" id="modalPrice"></div>
                <div class="actions">
                    <button class="btn-cart" id="modalAdd">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.getElementById('modalClose').addEventListener('click', closeModal);
}

function openModal(p) {
    ensureModal();
    const modal = document.getElementById('productModal');
    document.getElementById('modalImg').src = p.image;
    document.getElementById('modalImg').alt = p.name;
    document.getElementById('modalOrigin').textContent = p.origin;
    document.getElementById('modalTitle').textContent = p.name;
    document.getElementById('modalType').textContent = p.type;
    document.getElementById('modalPrice').textContent = '₹' + p.price;
    const addBtn = document.getElementById('modalAdd');
    addBtn.onclick = () => addToCart(p);
    modal.classList.add('active');
}
function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.classList.remove('active');
}

// Loader
function showLoader(show) {
    const loader = document.getElementById('loader');
    const grid = document.getElementById('productGrid');
    if (!loader || !grid) return;
    if (show) {
        loader.style.display = 'grid';
        loader.innerHTML = '';
        for (let i = 0; i < 8; i++) { const sk = document.createElement('div'); sk.className = 'sk-card'; loader.appendChild(sk); }
        grid.style.display = 'none';
    } else {
        loader.style.display = 'none';
        grid.style.display = 'grid';
    }
}

// Events
document.addEventListener('DOMContentLoaded', () => {
    // init landing
    buildCategoryLanding();
    buildTabs();
    collectFilters();
    hookFilters();
    updateSectionHeader();
    // hash routing
    const match = location.hash.match(/#cat=([^&]+)/);
    if (match) {
        const label = decodeURIComponent(match[1]);
        if (CATEGORY_LABELS.includes(label)) {
            navigateToCategory(label);
        } else {
            showView('landing');
        }
    } else {
        showView('landing');
    }
    updateCartCount();
    const backBtn = document.getElementById('backToCategories');
    if (backBtn) backBtn.addEventListener('click', () => {
        showView('landing');
        history.replaceState(null, '', location.pathname);
    });
});

function hookFilters() {
    const searchBox = document.getElementById('searchBox');
    const originSel = document.getElementById('originFilter');
    const typeSel = document.getElementById('typeFilter');
    const priceMax = document.getElementById('priceMax');
    const apply = document.getElementById('applyFilters');
    const sortSel = document.getElementById('sortSelect');

    if (searchBox) searchBox.addEventListener('input', () => { state.query = searchBox.value.trim(); renderProducts(); });
    if (originSel) originSel.addEventListener('change', () => { state.origin = originSel.value; renderProducts(); });
    if (typeSel) typeSel.addEventListener('change', () => { state.type = typeSel.value; renderProducts(); });
    if (priceMax) priceMax.addEventListener('input', () => { /* no-op live */ });
    if (apply) apply.addEventListener('click', () => { state.priceMax = parseFloat(priceMax.value || '0'); renderProducts(); });
    if (sortSel) sortSel.addEventListener('change', () => { state.sort = sortSel.value; renderProducts(); });
}
