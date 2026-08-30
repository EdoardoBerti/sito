/**
 * Gestione Carrello, Wishlist e Sconti (LocalStorage)
 */

const FREE_SHIPPING_THRESHOLD = 0.0; // Consegna digitale sempre gratuita
const STANDARD_SHIPPING_FEE = 0.0;

const COUPONS = {
  'CS2WELCOME': { type: 'percent', value: 10, label: 'Sconto Benvenuto CS2 10%' },
  'WELCOME10': { type: 'percent', value: 10, label: 'Sconto Benvenuto 10%' },
  'CS2FULL': { type: 'percent', value: 20, label: 'Promo Pacchetto Full 20%' },
  'PROMO15': { type: 'percent', value: 15, label: 'Promo Community 15%' }
};

// Inizializzazione State
let cartState = JSON.parse(localStorage.getItem('store_cart')) || [];
let wishlistState = JSON.parse(localStorage.getItem('store_wishlist')) || [];
let appliedCoupon = JSON.parse(localStorage.getItem('store_coupon')) || null;

// Salvataggio nel localStorage
function saveCart() {
  localStorage.setItem('store_cart', JSON.stringify(cartState));
  renderCartUI();
  updateCartBadge();
}

function saveWishlist() {
  localStorage.setItem('store_wishlist', JSON.stringify(wishlistState));
  renderWishlistUI();
  updateWishlistBadge();
}

function saveCoupon() {
  localStorage.setItem('store_coupon', JSON.stringify(appliedCoupon));
}

// Aggiungi al carrello
function addToCart(product, quantity = 1, options = {}) {
  const optionsKey = JSON.stringify(options);
  const existingItemIndex = cartState.findIndex(
    item => item.id === product.id && JSON.stringify(item.options || {}) === optionsKey
  );

  if (existingItemIndex > -1) {
    cartState[existingItemIndex].quantity += quantity;
  } else {
    cartState.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      options: options
    });
  }

  saveCart();
  showToast(`"${product.name}" aggiunto al carrello!`, 'success');
}

// Rimuovi dal carrello
function removeFromCart(index) {
  if (index >= 0 && index < cartState.length) {
    const removedName = cartState[index].name;
    cartState.splice(index, 1);
    saveCart();
    showToast(`"${removedName}" rimosso dal carrello`, 'info');
  }
}

// Aggiorna quantità
function updateCartItemQuantity(index, delta) {
  if (cartState[index]) {
    cartState[index].quantity += delta;
    if (cartState[index].quantity <= 0) {
      removeFromCart(index);
    } else {
      saveCart();
    }
  }
}

// Svuota carrello
function clearCart() {
  cartState = [];
  appliedCoupon = null;
  saveCoupon();
  saveCart();
}

// Calcoli Carrello
function getCartCalculations() {
  const subtotal = cartState.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discountAmount = 0;

  if (appliedCoupon && COUPONS[appliedCoupon.code]) {
    const coupon = COUPONS[appliedCoupon.code];
    if (coupon.type === 'percent') {
      discountAmount = (subtotal * coupon.value) / 100;
    }
  }

  const shippingFee = 0.0; // Consegna digitale istantanea sempre a 0€
  const total = Math.max(0, subtotal - discountAmount);

  return {
    subtotal,
    discountAmount,
    shippingFee,
    total,
    qualifiesForFreeShipping: true,
    remainingForFreeShipping: 0,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    totalItems: cartState.reduce((sum, item) => sum + item.quantity, 0)
  };
}

// Gestione Coupon
function applyDiscountCoupon(code) {
  const cleanCode = (code || '').trim().toUpperCase();
  if (COUPONS[cleanCode]) {
    appliedCoupon = {
      code: cleanCode,
      ...COUPONS[cleanCode]
    };
    saveCoupon();
    saveCart();
    showToast(`Codice "${cleanCode}" applicato: -${appliedCoupon.value}%!`, 'success');
    return { success: true, message: `Codice ${cleanCode} attivato!` };
  } else {
    showToast(`Codice "${cleanCode}" non valido`, 'error');
    return { success: false, message: 'Codice non valido' };
  }
}

function removeDiscountCoupon() {
  appliedCoupon = null;
  saveCoupon();
  saveCart();
  showToast('Codice sconto rimosso', 'info');
}

// Gestione Wishlist
function toggleWishlist(productId) {
  const id = parseInt(productId, 10);
  const index = wishlistState.indexOf(id);
  let isAdded = false;

  if (index > -1) {
    wishlistState.splice(index, 1);
    showToast('Rimosso dai preferiti', 'info');
  } else {
    wishlistState.push(id);
    showToast('Aggiunto ai preferiti!', 'success');
    isAdded = true;
  }

  saveWishlist();
  return isAdded;
}

function isInWishlist(productId) {
  return wishlistState.includes(parseInt(productId, 10));
}

// Update Badges
function updateCartBadge() {
  const badge = document.getElementById('cart-count-badge');
  if (!badge) return;

  const count = cartState.reduce((sum, item) => sum + item.quantity, 0);
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-count-badge');
  if (!badge) return;

  const count = wishlistState.length;
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}
