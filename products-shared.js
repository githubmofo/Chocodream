// Shared Products Logic: data load, filters, sorting, UI, cart

const Shared = (() => {
  const state = {
    all: [],
    filtered: [],
    category: '',
    query: '',
    types: new Set(),
    origins: new Set(),
    priceMin: 0,
    priceMax: 0,
    sort: 'relevance'
  };

  function $(sel) { return document.querySelector(sel); }
  function $all(sel) { return Array.from(document.querySelectorAll(sel)); }

  async function loadData() {
    const res = await fetch('data/products.json');
    const data = await res.json();
    state.all = data;
    if (!state.category) state.category = (document.body.getAttribute('data-category') || '').trim();
    computeFacets();
    applyFilters();
  }

  function computeFacets() {
    const list = scopeByCategory();
    const origins = new Set();
    const types = new Set();
    let minP = Number.POSITIVE_INFINITY, maxP = 0;
    list.forEach(p => {
      if (p.origin) origins.add(p.origin);
      if (p.type) types.add(p.type);
      if (typeof p.price === 'number') { minP = Math.min(minP, p.price); maxP = Math.max(maxP, p.price); }
    });
    state.origins = origins; state.types = types;
    state.priceMin = isFinite(minP) ? minP : 0; state.priceMax = isFinite(maxP) ? maxP : 0;
    populateFilters();
  }

  function populateFilters() {
    const originSel = $('#filter-origin');
    const typeWrap = $('#filter-types');
    const minR = $('#filter-price-min');
    const maxR = $('#filter-price-max');
    if (originSel) originSel.innerHTML = '<option value="">All Origins</option>' + Array.from(state.origins).sort().map(o=>`<option value="${o}">${o}</option>`).join('');
    if (typeWrap) typeWrap.innerHTML = Array.from(state.types).sort().map(t=>`<label class="chip"><input type="checkbox" value="${t}"><span>${t}</span></label>`).join('');
    if (minR && maxR) {
      minR.min = 0; minR.max = state.priceMax; minR.value = 0;
      maxR.min = 0; maxR.max = state.priceMax; maxR.value = state.priceMax;
      updatePriceGradient();
    }
  }

  function updatePriceGradient() {
    const minR = $('#filter-price-min');
    const maxR = $('#filter-price-max');
    if (!minR || !maxR) return;
    const min = Number(minR.value), max = Number(maxR.value);
    const full = Number(maxR.max) || 1;
    const a = (min / full) * 100; const b = (max / full) * 100;
    const grad = `linear-gradient(90deg, #eadbc7 ${a}%, var(--gold-400) ${a}%, var(--gold-400) ${b}%, #eadbc7 ${b}%)`;
    minR.style.background = grad; maxR.style.background = grad;
  }

  function scopeByCategory() {
    if (!state.category) return state.all.slice();
    return state.all.filter(p => (p.category || '') === state.category);
  }

  function getSelectedTypes() {
    return $all('#filter-types input[type="checkbox"]:checked').map(c => c.value);
  }

  function applyFilters() {
    let list = scopeByCategory();
    const q = ($('#filter-search')?.value || '').toLowerCase().trim();
    const origin = $('#filter-origin')?.value || '';
    const types = new Set(getSelectedTypes());
    const min = Number($('#filter-price-min')?.value || '0');
    const max = Number($('#filter-price-max')?.value || '0');

    if (q) list = list.filter(p => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
    if (origin) list = list.filter(p => p.origin === origin);
    if (types.size) list = list.filter(p => types.has(p.type));
    if (max > 0) list = list.filter(p => p.price >= min && p.price <= max);

    const sort = $('#sort-select')?.value || 'relevance';
    switch (sort) {
      case 'price-low': list.sort((a,b)=>a.price-b.price); break;
      case 'price-high': list.sort((a,b)=>b.price-a.price); break;
      case 'rating': list.sort((a,b)=> (b.rating||0) - (a.rating||0)); break;
      case 'popularity': list.sort((a,b)=> (b.reviews||0) - (a.reviews||0)); break;
      case 'newest': list.sort((a,b)=> (b.id||0) - (a.id||0)); break;
      default: break;
    }
    state.filtered = list;
    renderProducts(list);
  }

  function renderProducts(list) {
    const grid = $('#productGrid'); const loader = $('#loader');
    if (!grid) return;
    grid.classList.add('fade-scale-exit');
    if (loader) { loader.innerHTML = ''; for (let i=0;i<6;i++){ const sk=document.createElement('div'); sk.className='sk-card'; loader.appendChild(sk);} loader.style.display='grid'; grid.style.display='none'; }
    setTimeout(()=>{
      grid.innerHTML = '';
      list.forEach((p, idx) => grid.appendChild(buildCard(p, idx)));
      if (loader){ loader.style.display='none'; grid.style.display='grid'; }
      requestAnimationFrame(()=>{ grid.classList.remove('fade-scale-exit'); });
      updateCount(list.length, scopeByCategory().length);
      bindCardInteractions();
    }, 280);
  }

  function buildCard(p, idx) {
    const el = document.createElement('div');
    el.className = 'card fade-scale-enter stagger';
    el.style.animationDelay = (idx*60)+'ms';
    const stars = '★★★★★';
    el.innerHTML = `
      <div class="media" data-zoom>
        <img src="${p.image}" alt="${p.name}">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
      </div>
      <div class="body">
        <div class="title">${p.name}</div>
        <div class="desc">${p.description || ''}</div>
        <div class="meta"><span class="stars">${stars}</span> <span>(${p.reviews||0} reviews)</span> • <span>${p.origin} 🇫🇷</span></div>
        <div class="price">₹${p.price}</div>
        <div class="actions">
          <div class="qty"><button class="qty-dec">–</button><input type="text" value="1" readonly><button class="qty-inc">+</button></div>
          <select class="flavor">${(p.flavors||['Classic']).map(f=>`<option>${f}</option>`).join('')}</select>
          <button class="btn-cart" data-id="${p.id}">Add to Cart</button>
          <button class="btn-fav" data-id="${p.id}" aria-label="Add to favorites">♡</button>
        </div>
      </div>`;
    return el;
  }

  function updateCount(visible, total) {
    const el = $('#countText');
    if (el) el.textContent = `Showing ${visible} of ${total} chocolates`;
  }

  function flyToCart(imgEl) {
    const cartIcon = $('#cartIcon');
    if (!cartIcon || !imgEl) return;
    const clone = imgEl.cloneNode(true);
    const rect = imgEl.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    Object.assign(clone.style, { position:'fixed', left:rect.left+'px', top:rect.top+'px', width:rect.width+'px', height:rect.height+'px', borderRadius:'12px', zIndex:'9999', transition:'transform .6s cubic-bezier(.22,.61,.36,1), opacity .6s ease' });
    document.body.appendChild(clone);
    const dx = cartRect.left + cartRect.width/2 - (rect.left + rect.width/2);
    const dy = cartRect.top + cartRect.height/2 - (rect.top + rect.height/2);
    requestAnimationFrame(()=>{ clone.style.transform = `translate(${dx}px,${dy}px) scale(.2)`; clone.style.opacity = '0.4'; });
    setTimeout(()=> clone.remove(), 650);
  }

  function toast(msg) {
    let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); setTimeout(()=> t.classList.remove('show'), 1600);
  }

  function addToCart(product, qty) {
    const cart = JSON.parse(localStorage.getItem('chocodream_cart') || '{}');
    const id = product.id.toString();
    if (!cart[id]) cart[id] = { id: product.id, name: product.name, type: product.type, price: product.price, quantity: qty, image: product.image };
    else cart[id].quantity += qty;
    localStorage.setItem('chocodream_cart', JSON.stringify(cart));
    updateCartCount();
    toast('Added to cart!');
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('chocodream_cart') || '{}');
    let count = 0; Object.values(cart).forEach(it => count += (it.quantity || 0));
    const cartCountEl = $('#cartCount'); if (cartCountEl) cartCountEl.textContent = count;
  }

  function bindCardInteractions() {
    $all('.card').forEach(card => {
      const img = card.querySelector('.media img');
      const dec = card.querySelector('.qty-dec');
      const inc = card.querySelector('.qty-inc');
      const qty = card.querySelector('.qty input');
      const btn = card.querySelector('.btn-cart');
      const fav = card.querySelector('.btn-fav');
      if (dec) dec.addEventListener('click', ()=> { const v = Math.max(1, (parseInt(qty.value,10)||1)-1); qty.value = v; });
      if (inc) inc.addEventListener('click', ()=> { const v = Math.min(99, (parseInt(qty.value,10)||1)+1); qty.value = v; });
      if (btn) btn.addEventListener('click', ()=>{
        const id = parseInt(btn.getAttribute('data-id'),10);
        const p = state.filtered.find(x=>x.id===id) || state.all.find(x=>x.id===id);
        const q = parseInt(qty?.value||'1',10) || 1;
        if (!p) return;

        // Detect a flavor select in the card and try to determine a flavor-specific price.
        // Support both class names used across pages: 'flavour-select' and 'flavor'.
        const selectEl = card.querySelector('.flavour-select, .flavor');
        let productToAdd = Object.assign({}, p);
        if (selectEl) {
          const selectedVal = selectEl.value;
          let flavorPrice;
          // Prefer explicit data-price-<value> attributes on the select
          try {
            const attr = selectEl.getAttribute(`data-price-${selectedVal}`);
            if (attr) flavorPrice = parseFloat(attr);
          } catch (e) { /* ignore */ }

          // Fallback: try to parse price from the selected option's text (e.g. "Name - $44.99")
          if (typeof flavorPrice === 'undefined' || isNaN(flavorPrice)) {
            const opt = selectEl.options[selectEl.selectedIndex];
            if (opt && opt.text) {
              const m = opt.text.match(/([₹$])\s*([\d,]+(?:\.\d+)?)/);
              if (m) flavorPrice = parseFloat(m[2].replace(/,/g,''));
            }
          }

          if (typeof flavorPrice !== 'undefined' && !isNaN(flavorPrice)) {
            productToAdd = Object.assign({}, p, { price: flavorPrice });
            // include flavor label in the product name for cart clarity
            const optText = selectEl.options[selectEl.selectedIndex]?.text || selectedVal;
            productToAdd.name = p.name + ' — ' + optText;
          }
        }

        addToCart(productToAdd, q);
        img && flyToCart(img);
      });
      if (fav) fav.addEventListener('click', ()=>{
        fav.classList.toggle('active');
        const id = parseInt(fav.getAttribute('data-id'),10);
        const set = new Set(JSON.parse(localStorage.getItem('choco_favs')||'[]'));
        if (fav.classList.contains('active')) set.add(id); else set.delete(id);
        localStorage.setItem('choco_favs', JSON.stringify(Array.from(set)));
      });
      if (img) img.addEventListener('click', ()=> openLightbox(img.src, img.alt));
    });
  }

  function openLightbox(src, alt) {
    let m = $('#lightbox'); if (!m) { m = document.createElement('div'); m.id='lightbox'; m.className='modal active'; m.innerHTML = `<div class="modal-card" style="grid-template-columns:1fr;"><button class="close" id="lbClose">×</button><img id="lbImg" alt=""></div>`; document.body.appendChild(m); }
    $('#lbImg').src = src; $('#lbImg').alt = alt || '';
    m.classList.add('active');
    $('#lbClose').onclick = () => m.classList.remove('active');
    m.addEventListener('click', (e)=>{ if(e.target===m) m.classList.remove('active'); });
  }

  function hookControls() {
    const inputs = ['#filter-search','#filter-origin','#sort-select','#filter-price-min','#filter-price-max'];
    inputs.forEach(sel => { const el=$(sel); if (el) el.addEventListener('input', ()=> { if(sel.includes('price')) updatePriceGradient(); applyFilters(); }); });
    const typesWrap = $('#filter-types'); if (typesWrap) typesWrap.addEventListener('change', applyFilters);
    const clear = $('#btn-clear'); if (clear) clear.addEventListener('click', ()=>{ resetFilters(); applyFilters(); });
  }

  function resetFilters() {
    const s = $('#filter-search'); if (s) s.value='';
    const o = $('#filter-origin'); if (o) o.value='';
    $all('#filter-types input[type="checkbox"]').forEach(c=>{ c.checked=false; });
    const minR = $('#filter-price-min'); const maxR = $('#filter-price-max');
    if (minR && maxR) { minR.value = 0; maxR.value = maxR.max; updatePriceGradient(); }
  }

  function initCategory(categoryName) {
    state.category = categoryName;
    document.body.classList.add('page-enter');
    requestAnimationFrame(()=> document.body.classList.add('page-enter-active'));
    loadData().then(()=> { hookControls(); updateCartCount(); });
  }

  return { initCategory };
})();


