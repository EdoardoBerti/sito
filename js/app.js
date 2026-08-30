/**
 * Logica Applicativa Principale, UI Render, Modali e Notifiche
 */

let activeCategory = 'all';
let currentSort = 'featured';
let maxPriceFilter = 250;
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
        showToast('Iscrizione confermata! Riceverai il 10% di sconto: WELCOME10', 'success');
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
        image: formData.get('image') || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
        description: formData.get('description'),
        stock: formData.get('stock') || 10
      });
      closeAddProductModal();
      addProductForm.reset();
      renderProducts();
      showToast(`Prodotto "${newProd.name}" aggiunto con successo!`, 'success');
    });
  }
}

// Filtra per categoria
function setCategory(category) {
  activeCategory = category;
  
  // Aggiorna stile bottoni categorie
  document.querySelectorAll('.category-btn').forEach(btn => {
    if (btn.dataset.category === category) {
      btn.className = 'category-btn px-4 py-2 rounded-full text-sm font-semibold bg-indigo-600 text-white shadow-sm transition-all whitespace-nowrap';
    } else {
      btn.className = 'category-btn px-4 py-2 rounded-full text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all whitespace-nowrap';
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
    countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'prodotto' : 'prodotti'} disponibili`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          <i class="fas fa-box-open"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-1">Nessun prodotto trovato</h3>
        <p class="text-sm text-slate-500 max-w-sm mx-auto mb-4">Non ci sono prodotti che corrispondono ai tuoi criteri di ricerca o filtri selezionati.</p>
        <button onclick="resetFilters()" class="px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-xl hover:bg-indigo-100 transition-colors">
          Reimposta Filtri
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => {
    const inWishlist = isInWishlist(product.id);
    const badgeColor = product.badgeType === 'discount' ? 'badge-discount' : 
                       product.badgeType === 'hot' ? 'badge-hot' : 'badge-new';

    return `
      <div class="product-card bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col group relative">
        <!-- Immagine & Badges -->
        <div class="product-image-container aspect-square bg-slate-100 relative">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" loading="lazy">
          
          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            ${product.badge ? `<span class="${badgeColor} text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">${product.badge}</span>` : ''}
          </div>

          <!-- Wishlist Button -->
          <button onclick="handleWishlistClick(${product.id}, this)" class="absolute top-3 right-3 w-9 h-9 rounded-full ${inWishlist ? 'bg-rose-50 text-rose-500' : 'bg-white/90 text-slate-600 hover:text-rose-500'} shadow-md flex items-center justify-center transition-all z-10 backdrop-blur-sm">
            <i class="${inWishlist ? 'fas' : 'far'} fa-heart text-sm"></i>
          </button>

          <!-- Quick View Overlay -->
          <div class="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
            <button onclick="openQuickView(${product.id})" class="px-4 py-2.5 bg-white text-slate-800 font-semibold text-xs rounded-xl shadow-lg hover:bg-slate-50 transition-transform transform hover:scale-105 flex items-center gap-2">
              <i class="fas fa-eye text-indigo-600"></i> Anteprima Rapida
            </button>
          </div>
        </div>

        <!-- Info Prodotto -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span class="uppercase tracking-wider font-semibold text-indigo-600">${product.category}</span>
              <div class="flex items-center gap-1">
                <i class="fas fa-star star-rating text-xs"></i>
                <span class="font-bold text-slate-700">${product.rating}</span>
                <span class="text-slate-400">(${product.reviewsCount})</span>
              </div>
            </div>

            <h3 class="font-bold text-slate-800 text-base leading-snug line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer" onclick="openQuickView(${product.id})">
              ${product.name}
            </h3>

            <p class="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
              ${product.description}
            </p>
          </div>

          <!-- Prezzo & Azioni -->
          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div class="flex items-baseline gap-2">
                <span class="text-lg font-extrabold text-slate-900">€${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="text-xs text-slate-400 line-through">€${product.originalPrice.toFixed(2)}</span>` : ''}
              </div>
              <span class="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <i class="fas fa-check-circle text-[10px]"></i> Disponibile (${product.stock})
              </span>
            </div>

            <button onclick="handleAddToCart(${product.id})" class="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md hover:shadow-indigo-200 transition-all transform active:scale-95" title="Aggiungi al carrello">
              <i class="fas fa-shopping-bag"></i>
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
  maxPriceFilter = 250;
  currentSort = 'featured';

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  const priceSlider = document.getElementById('price-slider');
  const priceLabel = document.getElementById('price-slider-value');
  if (priceSlider && priceLabel) {
    priceSlider.value = 250;
    priceLabel.textContent = '€250';
  }

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'featured';

  setCategory('all');
}

// Handlers diretti dalla card
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
    btn.className = btn.className.replace('bg-white/90 text-slate-600', 'bg-rose-50 text-rose-500');
    icon.className = 'fas fa-heart text-sm';
  } else {
    btn.className = btn.className.replace('bg-rose-50 text-rose-500', 'bg-white/90 text-slate-600 hover:text-rose-500');
    icon.className = 'far fa-heart text-sm';
  }
  renderWishlistUI();
}

// ======================= MODALE QUICK VIEW =======================
let quickViewSelectedProduct = null;
let quickViewQuantity = 1;
let quickViewSelectedColor = null;
let quickViewSelectedSize = null;

function openQuickView(productId) {
  const product = getProductById(productId);
  if (!product) return;

  quickViewSelectedProduct = product;
  quickViewQuantity = 1;
  quickViewSelectedColor = product.colors ? product.colors[0] : null;
  quickViewSelectedSize = product.sizes ? product.sizes[0] : null;

  const modal = document.getElementById('quick-view-modal');
  const content = document.getElementById('quick-view-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <!-- Immagine -->
      <div class="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square flex items-center justify-center relative">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
        ${product.badge ? `<span class="absolute top-4 left-4 badge-discount text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">${product.badge}</span>` : ''}
      </div>

      <!-- Dettagli -->
      <div class="flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span class="uppercase tracking-wider font-bold text-indigo-600">${product.category}</span>
            <div class="flex items-center gap-1">
              <i class="fas fa-star star-rating text-xs"></i>
              <span class="font-bold text-slate-700">${product.rating}</span>
              <span class="text-slate-400">(${product.reviewsCount} recensioni)</span>
            </div>
          </div>

          <h2 class="text-xl font-extrabold text-slate-900 mb-2">${product.name}</h2>
          
          <div class="flex items-baseline gap-3 mb-4">
            <span class="text-2xl font-black text-indigo-600">€${product.price.toFixed(2)}</span>
            ${product.originalPrice ? `<span class="text-sm text-slate-400 line-through">€${product.originalPrice.toFixed(2)}</span>` : ''}
          </div>

          <p class="text-xs text-slate-600 leading-relaxed mb-4">${product.description}</p>

          <!-- Caratteristiche -->
          ${product.features ? `
            <div class="mb-4">
              <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Caratteristiche Chiave:</h4>
              <ul class="text-xs text-slate-600 space-y-1.5">
                ${product.features.map(f => `<li class="flex items-center gap-2"><i class="fas fa-check text-emerald-500 text-[10px]"></i> ${f}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- Selezione Colore -->
          ${product.colors ? `
            <div class="mb-4">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Colore:</label>
              <div class="flex gap-2">
                ${product.colors.map((color, idx) => `
                  <button type="button" onclick="selectQuickColor('${color}', this)" class="quick-color-btn w-7 h-7 rounded-full border-2 ${idx === 0 ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent'} transition-all" style="background-color: ${color};" title="${color}"></button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Selezione Taglia -->
          ${product.sizes ? `
            <div class="mb-4">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Taglia:</label>
              <div class="flex flex-wrap gap-2">
                ${product.sizes.map((sz, idx) => `
                  <button type="button" onclick="selectQuickSize('${sz}', this)" class="quick-size-btn px-3 py-1 text-xs font-bold rounded-lg border ${idx === 0 ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'} transition-all">${sz}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Quantità e Aggiungi al Carrello -->
        <div class="pt-4 border-t border-slate-200">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
              <button onclick="changeQuickQty(-1)" class="w-9 h-9 text-slate-600 hover:bg-slate-200 font-bold transition-colors">-</button>
              <span id="quick-qty-val" class="w-10 text-center text-xs font-bold text-slate-800">1</span>
              <button onclick="changeQuickQty(1)" class="w-9 h-9 text-slate-600 hover:bg-slate-200 font-bold transition-colors">+</button>
            </div>
            <button onclick="confirmQuickAddToCart()" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
              <i class="fas fa-shopping-bag"></i> Aggiungi al Carrello
            </button>
          </div>
          <p class="text-[11px] text-slate-500 text-center"><i class="fas fa-shield-alt text-emerald-500 mr-1"></i> Spedizione rapida e reso gratuito entro 30 giorni</p>
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

function selectQuickColor(color, btn) {
  quickViewSelectedColor = color;
  document.querySelectorAll('.quick-color-btn').forEach(b => {
    b.className = 'quick-color-btn w-7 h-7 rounded-full border-2 border-transparent transition-all';
  });
  btn.className = 'quick-color-btn w-7 h-7 rounded-full border-2 border-indigo-600 ring-2 ring-indigo-200 transition-all';
}

function selectQuickSize(size, btn) {
  quickViewSelectedSize = size;
  document.querySelectorAll('.quick-size-btn').forEach(b => {
    b.className = 'quick-size-btn px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all';
  });
  btn.className = 'quick-size-btn px-3 py-1 text-xs font-bold rounded-lg border border-indigo-600 bg-indigo-50 text-indigo-700 transition-all';
}

function changeQuickQty(delta) {
  quickViewQuantity = Math.max(1, quickViewQuantity + delta);
  const qtyEl = document.getElementById('quick-qty-val');
  if (qtyEl) qtyEl.textContent = quickViewQuantity;
}

function confirmQuickAddToCart() {
  if (quickViewSelectedProduct) {
    const opts = {};
    if (quickViewSelectedColor) opts.color = quickViewSelectedColor;
    if (quickViewSelectedSize) opts.size = quickViewSelectedSize;
    addToCart(quickViewSelectedProduct, quickViewQuantity, opts);
    closeQuickView();
    openCartDrawer();
  }
}

// ======================= CARRELLO DRAWER UI =======================
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

  // Barra di progresso spedizione gratuita
  if (shippingProgressContainer) {
    if (calcs.subtotal === 0) {
      shippingProgressContainer.innerHTML = '';
    } else if (calcs.qualifiesForFreeShipping) {
      shippingProgressContainer.innerHTML = `
        <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-800 text-xs flex items-center gap-2">
          <i class="fas fa-truck text-emerald-600 text-sm"></i>
          <span>Ottimo! Hai ottenuto la <strong>Spedizione Gratuita</strong>! 🚚</span>
        </div>
      `;
    } else {
      const percentage = Math.min(100, Math.round((calcs.subtotal / calcs.freeShippingThreshold) * 100));
      shippingProgressContainer.innerHTML = `
        <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs space-y-2">
          <div class="flex justify-between text-indigo-900 font-medium">
            <span>Aggiungi ancora <strong>€${calcs.remainingForFreeShipping.toFixed(2)}</strong> per la spedizione gratis!</span>
            <span>${percentage}%</span>
          </div>
          <div class="w-full bg-indigo-200/60 rounded-full h-2 overflow-hidden">
            <div class="bg-indigo-600 h-2 rounded-full transition-all duration-300" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
    }
  }

  // Lista articoli
  if (cartState.length === 0) {
    itemsContainer.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
        <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4 text-slate-300">
          <i class="fas fa-shopping-basket"></i>
        </div>
        <h4 class="font-bold text-slate-700 text-base mb-1">Il tuo carrello è vuoto</h4>
        <p class="text-xs text-slate-500 mb-6 max-w-xs">Non hai ancora aggiunto nessun prodotto. Esplora il nostro catalogo!</p>
        <button onclick="closeCartDrawer()" class="px-5 py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow hover:bg-indigo-700 transition-colors">
          Inizia lo Shopping
        </button>
      </div>
    `;
    if (footerContainer) footerContainer.classList.add('hidden');
    return;
  }

  if (footerContainer) footerContainer.classList.remove('hidden');

  itemsContainer.innerHTML = cartState.map((item, index) => `
    <div class="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 relative group">
      <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-xl object-cover border border-slate-200">
      <div class="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div class="flex justify-between items-start gap-2">
            <h4 class="font-bold text-slate-800 text-xs truncate leading-snug">${item.name}</h4>
            <button onclick="removeFromCart(${index})" class="text-slate-400 hover:text-rose-500 transition-colors text-xs p-1" title="Rimuovi">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          ${item.options?.size ? `<span class="text-[10px] text-slate-500">Taglia: ${item.options.size}</span> ` : ''}
          ${item.options?.color ? `<span class="inline-block w-2.5 h-2.5 rounded-full border border-slate-300 align-middle ml-1" style="background-color: ${item.options.color}"></span>` : ''}
        </div>

        <div class="flex justify-between items-center mt-2">
          <div class="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
            <button onclick="updateCartItemQuantity(${index}, -1)" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors">-</button>
            <span class="w-8 text-center text-xs font-bold text-slate-800">${item.quantity}</span>
            <button onclick="updateCartItemQuantity(${index}, 1)" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors">+</button>
          </div>
          <span class="font-extrabold text-slate-900 text-xs">€${(item.price * item.quantity).toFixed(2)}</span>
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
    shippingEl.textContent = calcs.shippingFee === 0 ? 'Gratuita' : `€${calcs.shippingFee.toFixed(2)}`;
    shippingEl.className = `font-medium ${calcs.shippingFee === 0 ? 'text-emerald-600' : 'text-slate-800'}`;
  }

  if (totalEl) totalEl.textContent = `€${calcs.total.toFixed(2)}`;
}

// ======================= WISHLIST DRAWER UI =======================
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
      <div class="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
        <div class="w-16 h-16 bg-rose-50 text-rose-300 rounded-full flex items-center justify-center text-2xl mb-4">
          <i class="far fa-heart"></i>
        </div>
        <h4 class="font-bold text-slate-700 text-sm mb-1">Nessun preferito salvato</h4>
        <p class="text-xs text-slate-500">Clicca sul cuore sui tuoi prodotti preferiti per salvarli qui!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = favoriteProducts.map(item => `
    <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover border border-slate-200">
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-slate-800 text-xs truncate">${item.name}</h4>
        <p class="text-xs font-black text-indigo-600 mt-0.5">€${item.price.toFixed(2)}</p>
      </div>
      <div class="flex items-center gap-1.5">
        <button onclick="handleAddToCart(${item.id})" class="p-2 bg-indigo-600 text-white rounded-lg text-xs hover:bg-indigo-700 transition-colors" title="Aggiungi al carrello">
          <i class="fas fa-shopping-bag"></i>
        </button>
        <button onclick="toggleWishlist(${item.id})" class="p-2 text-slate-400 hover:text-rose-500 rounded-lg text-xs transition-colors" title="Rimuovi">
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
  
  let bgClass = 'bg-slate-900 text-white';
  let icon = 'fas fa-info-circle text-blue-400';

  if (type === 'success') {
    bgClass = 'bg-slate-900 text-white border-l-4 border-emerald-500';
    icon = 'fas fa-check-circle text-emerald-400';
  } else if (type === 'error') {
    bgClass = 'bg-slate-900 text-white border-l-4 border-rose-500';
    icon = 'fas fa-exclamation-circle text-rose-400';
  } else if (type === 'warning') {
    bgClass = 'bg-slate-900 text-white border-l-4 border-amber-500';
    icon = 'fas fa-exclamation-triangle text-amber-400';
  }

  toast.className = `toast ${bgClass} px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-medium max-w-sm animate-fade-in`;
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
