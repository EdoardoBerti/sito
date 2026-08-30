/**
 * Logica Applicativa CS2 Store, UI Render, Modali e Notifiche
 */

let activeCategory = 'all';
let currentSort = 'featured';
let maxPriceFilter = 100;
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  renderProducts();
  renderCartUI();
  renderWishlistUI();
  updateCartBadge();
  updateWishlistBadge();
  setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
  // Ricerca live
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  // Filtro Prezzo Slider
  const priceSlider = document.getElementById('price-slider');
  const priceLabel = document.getElementById('price-slider-value');
  if (priceSlider && priceLabel) {
    priceSlider.addEventListener('input', (e) => {
      maxPriceFilter = parseFloat(e.target.value);
      priceLabel.textContent = `€${maxPriceFilter}`;
      renderProducts();
    });
  }

  // Ordinamento
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  // Form Coupon Carrello
  const couponForm = document.getElementById('coupon-form');
  if (couponForm) {
    couponForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('coupon-input');
      if (input && input.value) {
        applyDiscountCoupon(input.value);
        input.value = '';
      }
    });
  }

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      if (emailInput && emailInput.value) {
        showToast('Iscrizione confermata! Codice promozionale 10%: CS2WELCOME', 'success');
        emailInput.value = '';
      }
    });
  }

  // Form Aggiunta Prodotto Personalizzato
  const addProductForm = document.getElementById('add-product-form');
  if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(addProductForm);
      const newProd = addProduct({
        name: formData.get('name'),
        category: formData.get('category'),
        price: formData.get('price'),
        originalPrice: formData.get('originalPrice') || null,
        badge: formData.get('badge') || 'Nuovo',
        badgeType: formData.get('badgeType') || 'new',
        image: formData.get('image') || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        description: formData.get('description'),
        stock: formData.get('stock') || 99
      });
      closeAddProductModal();
      addProductForm.reset();
      renderProducts();
      showToast(`Pacchetto "${newProd.name}" aggiunto al catalogo!`, 'success');
    });
  }
}

// Filtra per categoria
function setCategory(category) {
  activeCategory = category;
  
  document.querySelectorAll('.category-btn').forEach(btn => {
    if (btn.dataset.category === category) {
      btn.className = 'category-btn px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500 transition-all whitespace-nowrap';
    } else {
      btn.className = 'category-btn px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all whitespace-nowrap';
    }
  });

  renderProducts();
}

// Render Prodotti nella griglia
function renderProducts() {
  const container = document.getElementById('products-grid');
  const countEl = document.getElementById('products-count');
  if (!container) return;

  const products = getProducts();

  let filtered = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) || 
                          p.description.toLowerCase().includes(searchQuery) ||
                          p.category.toLowerCase().includes(searchQuery);
    const matchesPrice = p.price <= maxPriceFilter;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Ordinamento
  if (currentSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (currentSort === 'featured') {
    filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  if (countEl) {
    countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'pacchetto disponibile' : 'pacchetti CS2 disponibili'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-16 h-16 bg-slate-900 text-slate-500 rounded-2xl border border-slate-800 flex items-center justify-center mx-auto mb-4 text-2xl">
          <i class="fas fa-crosshairs"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-200 mb-1">Nessun pacchetto trovato</h3>
        <p class="text-xs text-slate-500 max-w-sm mx-auto mb-4">Prova a modificare i filtri di ricerca o ad alzare il limite di prezzo.</p>
        <button onclick="resetFilters()" class="px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold rounded-xl hover:bg-indigo-600/30 transition-colors">
          Reimposta Filtri
        </button>
      </div>
    `;
    return;
  }

  const categoryLabels = {
    bundles: 'Pacchetto Completo',
    visuals: 'Visuals & Skin Changer',
    combat: 'Aimbot & Combat',
    vip: 'VIP & Lifetime'
  };

  container.innerHTML = filtered.map(product => {
    const inWishlist = isInWishlist(product.id);
    const badgeColor = product.badgeType === 'discount' ? 'badge-discount' : 
                       product.badgeType === 'hot' ? 'badge-hot' : 'badge-new';

    return `
      <div class="product-card rounded-2xl overflow-hidden flex flex-col group relative">
        <!-- Immagine & Badges -->
        <div class="product-image-container aspect-square relative">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" loading="lazy">
          
          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            ${product.badge ? `<span class="${badgeColor} text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">${product.badge}</span>` : ''}
          </div>

          <!-- Wishlist Button -->
          <button onclick="handleWishlistClick(${product.id}, this)" class="absolute top-3 right-3 w-9 h-9 rounded-xl ${inWishlist ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-slate-950/70 text-slate-400 hover:text-rose-400 border-white/10'} border shadow-md flex items-center justify-center transition-all z-10 backdrop-blur-md">
            <i class="${inWishlist ? 'fas' : 'far'} fa-heart text-xs"></i>
          </button>

          <!-- Quick View Overlay -->
          <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 backdrop-blur-xs">
            <button onclick="openQuickView(${product.id})" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2 border border-indigo-400/30">
              <i class="fas fa-eye text-cyan-300"></i> Dettagli & Features
            </button>
          </div>
        </div>

        <!-- Info Prodotto -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span class="uppercase tracking-wider font-mono text-[11px] font-bold text-cyan-400">${categoryLabels[product.category] || product.category}</span>
              <div class="flex items-center gap-1">
                <i class="fas fa-star star-rating text-xs"></i>
                <span class="font-bold text-slate-200">${product.rating}</span>
                <span class="text-slate-500 text-[11px]">(${product.reviewsCount})</span>
              </div>
            </div>

            <h3 class="font-bold text-slate-100 text-sm leading-snug line-clamp-2 hover:text-indigo-400 transition-colors cursor-pointer" onclick="openQuickView(${product.id})">
              ${product.name}
            </h3>

            <p class="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
              ${product.description}
            </p>
          </div>

          <!-- Prezzo & Azioni -->
          <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div class="flex items-baseline gap-2">
                <span class="text-lg font-black text-white font-mono">€${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="text-xs text-slate-500 line-through font-mono">€${product.originalPrice.toFixed(2)}</span>` : ''}
              </div>
              <span class="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                <i class="fas fa-bolt text-[9px]"></i> Consegna Istantanea
              </span>
            </div>

            <button onclick="handleAddToCart(${product.id})" class="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95 border border-indigo-400/40" title="Aggiungi al carrello">
              <i class="fas fa-cart-plus text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Reset filtri
function resetFilters() {
  activeCategory = 'all';
  searchQuery = '';
  maxPriceFilter = 100;
  currentSort = 'featured';

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  const priceSlider = document.getElementById('price-slider');
  const priceLabel = document.getElementById('price-slider-value');
  if (priceSlider && priceLabel) {
    priceSlider.value = 100;
    priceLabel.textContent = '€100';
  }

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'featured';

  setCategory('all');
}

function handleAddToCart(productId) {
  const product = getProductById(productId);
  if (product) {
    addToCart(product, 1);
  }
}

function handleWishlistClick(productId, btn) {
  const added = toggleWishlist(productId);
  const icon = btn.querySelector('i');
  if (added) {
    btn.className = 'absolute top-3 right-3 w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-md flex items-center justify-center transition-all z-10 backdrop-blur-md';
    icon.className = 'fas fa-heart text-xs';
  } else {
    btn.className = 'absolute top-3 right-3 w-9 h-9 rounded-xl bg-slate-950/70 text-slate-400 hover:text-rose-400 border border-white/10 shadow-md flex items-center justify-center transition-all z-10 backdrop-blur-md';
    icon.className = 'far fa-heart text-xs';
  }
  renderWishlistUI();
}

// ======================= MODALE QUICK VIEW (DARK) =======================
let quickViewSelectedProduct = null;
let quickViewQuantity = 1;

function openQuickView(productId) {
  const product = getProductById(productId);
  if (!product) return;

  quickViewSelectedProduct = product;
  quickViewQuantity = 1;

  const modal = document.getElementById('quick-view-modal');
  const content = document.getElementById('quick-view-content');
  if (!modal || !content) return;

  const categoryLabels = {
    bundles: 'Pacchetto Completo',
    visuals: 'Visuals & Skin Changer',
    combat: 'Aimbot & Combat',
    vip: 'VIP & Lifetime'
  };

  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <!-- Immagine -->
      <div class="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square flex items-center justify-center relative">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
        ${product.badge ? `<span class="absolute top-4 left-4 badge-hot text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">${product.badge}</span>` : ''}
      </div>

      <!-- Dettagli -->
      <div class="flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span class="uppercase tracking-wider font-mono font-bold text-cyan-400">${categoryLabels[product.category] || product.category}</span>
            <div class="flex items-center gap-1">
              <i class="fas fa-star star-rating text-xs"></i>
              <span class="font-bold text-slate-200">${product.rating}</span>
              <span class="text-slate-500">(${product.reviewsCount} recensioni)</span>
            </div>
          </div>

          <h2 class="text-xl font-black text-white mb-2 leading-snug">${product.name}</h2>
          
          <div class="flex items-baseline gap-3 mb-4">
            <span class="text-2xl font-black text-indigo-400 font-mono">€${product.price.toFixed(2)}</span>
            ${product.originalPrice ? `<span class="text-xs text-slate-500 line-through font-mono">€${product.originalPrice.toFixed(2)}</span>` : ''}
          </div>

          <p class="text-xs text-slate-300 leading-relaxed mb-4">${product.description}</p>

          <!-- Specifiche Tecniche & Features -->
          ${product.features ? `
            <div class="mb-4 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <h4 class="text-[11px] font-bold text-cyan-400 uppercase font-mono tracking-wider mb-2">Features Incluse nel Pacchetto:</h4>
              <ul class="text-xs text-slate-300 space-y-1.5">
                ${product.features.map(f => `<li class="flex items-center gap-2"><i class="fas fa-check-circle text-emerald-400 text-[11px]"></i> ${f}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- Quantità e Aggiungi -->
        <div class="pt-4 border-t border-slate-800">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex items-center border border-slate-700 rounded-xl bg-slate-950 overflow-hidden">
              <button onclick="changeQuickQty(-1)" class="w-9 h-9 text-slate-400 hover:bg-slate-800 font-bold transition-colors">-</button>
              <span id="quick-qty-val" class="w-10 text-center text-xs font-bold text-white font-mono">1</span>
              <button onclick="changeQuickQty(1)" class="w-9 h-9 text-slate-400 hover:bg-slate-800 font-bold transition-colors">+</button>
            </div>
            <button onclick="confirmQuickAddToCart()" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 border border-indigo-400/40">
              <i class="fas fa-cart-plus"></i> Aggiungi al Carrello
            </button>
          </div>
          <p class="text-[11px] text-emerald-400 text-center flex items-center justify-center gap-1.5">
            <i class="fas fa-shield-halved text-cyan-400"></i> Consegna Istantanea & Aggiornamenti Gratuiti Inclusi
          </p>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeQuickView() {
  const modal = document.getElementById('quick-view-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function changeQuickQty(delta) {
  quickViewQuantity = Math.max(1, quickViewQuantity + delta);
  const qtyEl = document.getElementById('quick-qty-val');
  if (qtyEl) qtyEl.textContent = quickViewQuantity;
}

function confirmQuickAddToCart() {
  if (quickViewSelectedProduct) {
    addToCart(quickViewSelectedProduct, quickViewQuantity);
    closeQuickView();
    openCartDrawer();
  }
}

// ======================= CARRELLO DRAWER UI (DARK) =======================
function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    backdrop.classList.remove('hidden');
    drawer.classList.remove('translate-x-full');
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    drawer.classList.add('translate-x-full');
    setTimeout(() => backdrop.classList.add('hidden'), 250);
  }
}

function renderCartUI() {
  const itemsContainer = document.getElementById('cart-items-container');
  const footerContainer = document.getElementById('cart-footer');
  const shippingProgressContainer = document.getElementById('cart-shipping-progress');
  if (!itemsContainer) return;

  const calcs = getCartCalculations();

  if (shippingProgressContainer) {
    shippingProgressContainer.innerHTML = `
      <div class="bg-indigo-950/60 border border-indigo-500/40 rounded-xl p-3 text-cyan-300 text-xs flex items-center gap-2">
        <i class="fas fa-bolt text-amber-400 text-sm"></i>
        <span>Consegna Digitale <strong>Istantanea</strong> 24/7 tramite email & pannello! ⚡</span>
      </div>
    `;
  }

  // Lista articoli
  if (cartState.length === 0) {
    itemsContainer.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
        <div class="w-20 h-20 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-3xl mb-4 text-slate-600">
          <i class="fas fa-shopping-basket"></i>
        </div>
        <h4 class="font-bold text-slate-200 text-base mb-1">Carrello CS2 Vuoto</h4>
        <p class="text-xs text-slate-500 mb-6 max-w-xs">Non hai ancora aggiunto nessun pacchetto CS2.</p>
        <button onclick="closeCartDrawer()" class="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow hover:bg-indigo-500 transition-colors">
          Esplora Pacchetti CS2
        </button>
      </div>
    `;
    if (footerContainer) footerContainer.classList.add('hidden');
    return;
  }

  if (footerContainer) footerContainer.classList.remove('hidden');

  itemsContainer.innerHTML = cartState.map((item, index) => `
    <div class="flex gap-3 p-3 bg-slate-900/90 rounded-2xl border border-slate-800 relative group">
      <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-xl object-cover border border-slate-800 bg-slate-950">
      <div class="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div class="flex justify-between items-start gap-2">
            <h4 class="font-bold text-slate-100 text-xs truncate leading-snug">${item.name}</h4>
            <button onclick="removeFromCart(${index})" class="text-slate-500 hover:text-rose-400 transition-colors text-xs p-1" title="Rimuovi">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <div class="flex justify-between items-center mt-2">
          <div class="flex items-center border border-slate-700 rounded-lg bg-slate-950 overflow-hidden">
            <button onclick="updateCartItemQuantity(${index}, -1)" class="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-800 text-xs font-bold transition-colors">-</button>
            <span class="w-8 text-center text-xs font-mono font-bold text-white">${item.quantity}</span>
            <button onclick="updateCartItemQuantity(${index}, 1)" class="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-800 text-xs font-bold transition-colors">+</button>
          </div>
          <span class="font-extrabold text-cyan-300 text-xs font-mono">€${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Totali footer carrello
  const subtotalEl = document.getElementById('cart-subtotal');
  const discountRow = document.getElementById('cart-discount-row');
  const discountAmountEl = document.getElementById('cart-discount-amount');
  const shippingEl = document.getElementById('cart-shipping');
  const totalEl = document.getElementById('cart-total');

  if (subtotalEl) subtotalEl.textContent = `€${calcs.subtotal.toFixed(2)}`;
  
  if (discountRow && discountAmountEl) {
    if (calcs.discountAmount > 0) {
      discountRow.classList.remove('hidden');
      discountAmountEl.textContent = `-€${calcs.discountAmount.toFixed(2)}`;
    } else {
      discountRow.classList.add('hidden');
    }
  }

  if (shippingEl) {
    shippingEl.textContent = 'Istantanea (0.00€)';
    shippingEl.className = 'font-mono font-semibold text-emerald-400';
  }

  if (totalEl) totalEl.textContent = `€${calcs.total.toFixed(2)}`;
}

// ======================= WISHLIST DRAWER UI (DARK) =======================
function openWishlistDrawer() {
  const drawer = document.getElementById('wishlist-drawer');
  const backdrop = document.getElementById('wishlist-backdrop');
  if (drawer && backdrop) {
    backdrop.classList.remove('hidden');
    drawer.classList.remove('translate-x-full');
  }
}

function closeWishlistDrawer() {
  const drawer = document.getElementById('wishlist-drawer');
  const backdrop = document.getElementById('wishlist-backdrop');
  if (drawer && backdrop) {
    drawer.classList.add('translate-x-full');
    setTimeout(() => backdrop.classList.add('hidden'), 250);
  }
}

function renderWishlistUI() {
  const container = document.getElementById('wishlist-items-container');
  if (!container) return;

  const products = getProducts();
  const favoriteProducts = products.filter(p => isInWishlist(p.id));

  if (favoriteProducts.length === 0) {
    container.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
        <div class="w-16 h-16 bg-slate-900 border border-slate-800 text-rose-400 rounded-2xl flex items-center justify-center text-2xl mb-4">
          <i class="far fa-heart"></i>
        </div>
        <h4 class="font-bold text-slate-200 text-sm mb-1">Nessun pacchetto salvato</h4>
        <p class="text-xs text-slate-500">Salva i pacchetti CS2 che ti interessano con un click sull'icona cuore!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = favoriteProducts.map(item => `
    <div class="flex items-center gap-3 p-3 bg-slate-900 rounded-2xl border border-slate-800">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover border border-slate-800 bg-slate-950">
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-slate-200 text-xs truncate">${item.name}</h4>
        <p class="text-xs font-mono font-bold text-indigo-400 mt-0.5">€${item.price.toFixed(2)}</p>
      </div>
      <div class="flex items-center gap-1.5">
        <button onclick="handleAddToCart(${item.id})" class="p-2 bg-indigo-600 text-white rounded-xl text-xs hover:bg-indigo-500 transition-colors" title="Aggiungi al carrello">
          <i class="fas fa-cart-plus"></i>
        </button>
        <button onclick="toggleWishlist(${item.id})" class="p-2 text-slate-500 hover:text-rose-400 rounded-xl text-xs transition-colors" title="Rimuovi">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// ======================= MODALE AGGIUNTA PRODOTTO =======================
function openAddProductModal() {
  const modal = document.getElementById('add-product-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeAddProductModal() {
  const modal = document.getElementById('add-product-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// ======================= FAQ ACCORDION =======================
function toggleFaq(button) {
  const content = button.nextElementSibling;
  const icon = button.querySelector('.faq-icon');
  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    icon.classList.add('rotate-180');
  } else {
    content.classList.add('hidden');
    icon.classList.remove('rotate-180');
  }
}

// ======================= TOAST NOTIFICATIONS =======================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  
  let bgClass = 'bg-slate-900 border border-slate-700 text-white';
  let icon = 'fas fa-info-circle text-cyan-400';

  if (type === 'success') {
    bgClass = 'bg-slate-900 border border-emerald-500/50 text-white shadow-lg shadow-emerald-950/50';
    icon = 'fas fa-check-circle text-emerald-400';
  } else if (type === 'error') {
    bgClass = 'bg-slate-900 border border-rose-500/50 text-white shadow-lg shadow-rose-950/50';
    icon = 'fas fa-exclamation-circle text-rose-400';
  } else if (type === 'warning') {
    bgClass = 'bg-slate-900 border border-amber-500/50 text-white shadow-lg shadow-amber-950/50';
    icon = 'fas fa-exclamation-triangle text-amber-400';
  }

  toast.className = `toast ${bgClass} px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-medium max-w-sm animate-fade-in backdrop-blur-md`;
  toast.innerHTML = `
    <i class="${icon} text-base"></i>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
