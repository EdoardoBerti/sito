/**
 * Gestione Carrello, Wishlist e Sconti (LocalStorage)
 */

const FREE_SHIPPING_THRESHOLD = 60.0;
const STANDARD_SHIPPING_FEE = 4.99;

const COUPONS = {
  'WELCOME10': { type: 'percent', value: 10, label: 'Sconto Benvenuto 10%' },
  'OFFERTA20': { type: 'percent', value: 20, label: 'Super Offerta 20%' },
  'FREESHIP': { type: 'shipping', value: 0, label: 'Spedizione Gratuita' }
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
  let isFreeShippingCoupon = false;

  if (appliedCoupon && COUPONS[appliedCoupon.code]) {
    const coupon = COUPONS[appliedCoupon.code];
    if (coupon.type === 'percent') {
      discountAmount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === 'shipping') {
      isFreeShippingCoupon = true;
    }
  }

  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || isFreeShippingCoupon || subtotal === 0;
  const shippingFee = qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  return {
    subtotal,
    discountAmount,
    shippingFee,
    total,
    qualifiesForFreeShipping,
    remainingForFreeShipping,
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
    showToast(`Codice "${cleanCode}" applicato con successo!`, 'success');
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
  const product = getProductById(id);

  if (index > -1) {
    wishlistState.splice(index, 1);
    saveWishlist();
    if (product) showToast(`"${product.name}" rimosso dai preferiti`, 'info');
    return false;
  } else {
    wishlistState.push(id);
    saveWishlist();
    if (product) showToast(`"${product.name}" aggiunto ai preferiti! ❤️`, 'success');
    return true;
  }
}

function isInWishlist(productId) {
  return wishlistState.includes(parseInt(productId, 10));
}

// Badge counters UI update
function updateCartBadge() {
  const badge = document.getElementById('cart-count-badge');
  if (!badge) return;
  const totalItems = cartState.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalItems;
  badge.classList.toggle('hidden', totalItems === 0);
  badge.classList.add('badge-bump');
  setTimeout(() => badge.classList.remove('badge-bump'), 300);
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-count-badge');
  if (!badge) return;
  const total = wishlistState.length;
  badge.textContent = total;
  badge.classList.toggle('hidden', total === 0);
}
