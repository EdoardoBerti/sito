/**
 * Gestione Checkout e Conferma Ordine
 */

let currentCheckoutStep = 1;
let checkoutFormData = {
  customer: {},
  payment: { method: 'card' }
};

// Apri modale Checkout
function openCheckoutModal() {
  if (cartState.length === 0) {
    showToast('Il tuo carrello è vuoto!', 'warning');
    return;
  }
  
  // Chiudi drawer carrello se aperto
  closeCartDrawer();
  
  currentCheckoutStep = 1;
  renderCheckoutStep();
  renderCheckoutSummary();
  
  const modal = document.getElementById('checkout-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// Navigazione step checkout
function goToCheckoutStep(step) {
  if (step === 2) {
    const form = document.getElementById('shipping-form');
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    // Salva dati spedizione
    const formData = new FormData(form);
    checkoutFormData.customer = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      zip: formData.get('zip'),
      country: formData.get('country') || 'Italia'
    };
  }

  if (step === 3) {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'card';
    checkoutFormData.payment.method = paymentMethod;

    if (paymentMethod === 'card') {
      const cardForm = document.getElementById('card-payment-form');
      if (cardForm && !cardForm.checkValidity()) {
        cardForm.reportValidity();
        return;
      }
      checkoutFormData.payment.cardNumber = document.getElementById('cardNumber')?.value.replace(/\s+/g, '').slice(-4) || '4242';
    }
  }

  currentCheckoutStep = step;
  renderCheckoutStep();
  renderCheckoutSummary();
}

// Render dello step attivo
function renderCheckoutStep() {
  // Aggiorna indicatori step nella UI
  for (let i = 1; i <= 3; i++) {
    const stepIndicator = document.getElementById(`step-indicator-${i}`);
    const stepLabel = document.getElementById(`step-label-${i}`);
    const stepContent = document.getElementById(`checkout-step-${i}`);

    if (!stepIndicator || !stepContent) continue;

    if (i < currentCheckoutStep) {
      stepIndicator.className = 'w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm';
      stepIndicator.innerHTML = '<i class="fas fa-check"></i>';
      stepContent.classList.add('hidden');
    } else if (i === currentCheckoutStep) {
      stepIndicator.className = 'w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-indigo-100';
      stepIndicator.textContent = i;
      stepContent.classList.remove('hidden');
    } else {
      stepIndicator.className = 'w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm';
      stepIndicator.textContent = i;
      stepContent.classList.add('hidden');
    }
  }

  // Se siamo allo step 3 (Riepilogo finale), compiliamo i dettagli cliente
  if (currentCheckoutStep === 3) {
    const cust = checkoutFormData.customer;
    const reviewInfo = document.getElementById('review-shipping-info');
    if (reviewInfo) {
      reviewInfo.innerHTML = `
        <div class="bg-slate-50 p-4 rounded-xl text-sm border border-slate-200 space-y-1">
          <div class="flex justify-between items-center mb-1">
            <span class="font-bold text-slate-800">${cust.firstName} ${cust.lastName}</span>
            <button type="button" onclick="goToCheckoutStep(1)" class="text-xs text-indigo-600 hover:underline">Modifica</button>
          </div>
          <p class="text-slate-600"><i class="fas fa-map-marker-alt text-slate-400 mr-2"></i>${cust.address}, ${cust.zip} ${cust.city} (${cust.country})</p>
          <p class="text-slate-600"><i class="fas fa-envelope text-slate-400 mr-2"></i>${cust.email}</p>
          <p class="text-slate-600"><i class="fas fa-phone text-slate-400 mr-2"></i>${cust.phone}</p>
        </div>
      `;
    }

    const payInfo = document.getElementById('review-payment-info');
    if (payInfo) {
      let payText = '';
      if (checkoutFormData.payment.method === 'card') {
        payText = `<i class="fas fa-credit-card text-indigo-600 mr-2"></i> Carta di Credito (termina in •••• ${checkoutFormData.payment.cardNumber || '4242'})`;
      } else if (checkoutFormData.payment.method === 'paypal') {
        payText = `<i class="fab fa-paypal text-blue-600 mr-2"></i> Account PayPal`;
      } else if (checkoutFormData.payment.method === 'applepay') {
        payText = `<i class="fab fa-apple text-slate-800 mr-2"></i> Apple Pay / Google Pay`;
      } else {
        payText = `<i class="fas fa-money-bill-wave text-emerald-600 mr-2"></i> Pagamento alla Consegna (Contrassegno)`;
      }
      payInfo.innerHTML = `
        <div class="bg-slate-50 p-4 rounded-xl text-sm border border-slate-200 flex justify-between items-center">
          <span class="font-medium text-slate-800 flex items-center">${payText}</span>
          <button type="button" onclick="goToCheckoutStep(2)" class="text-xs text-indigo-600 hover:underline">Modifica</button>
        </div>
      `;
    }
  }
}

// Render del riepilogo laterale nel checkout
function renderCheckoutSummary() {
  const container = document.getElementById('checkout-items-list');
  const totalsContainer = document.getElementById('checkout-totals');
  if (!container || !totalsContainer) return;

  const calcs = getCartCalculations();

  container.innerHTML = cartState.map(item => `
    <div class="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
      <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-lg object-cover border border-slate-200">
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-slate-800 truncate">${item.name}</p>
        <p class="text-xs text-slate-500">Qtà: ${item.quantity} × €${item.price.toFixed(2)}</p>
      </div>
      <span class="text-xs font-bold text-slate-900">€${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');

  totalsContainer.innerHTML = `
    <div class="space-y-2 text-sm pt-3 border-t border-slate-200">
      <div class="flex justify-between text-slate-600">
        <span>Subtotale</span>
        <span class="font-medium text-slate-800">€${calcs.subtotal.toFixed(2)}</span>
      </div>
      ${calcs.discountAmount > 0 ? `
        <div class="flex justify-between text-emerald-600 font-medium">
          <span>Sconto (${appliedCoupon?.label || 'Promozione'})</span>
          <span>-€${calcs.discountAmount.toFixed(2)}</span>
        </div>
      ` : ''}
      <div class="flex justify-between text-slate-600">
        <span>Spedizione</span>
        <span class="font-medium ${calcs.shippingFee === 0 ? 'text-emerald-600' : 'text-slate-800'}">
          ${calcs.shippingFee === 0 ? 'Gratuita' : `€${calcs.shippingFee.toFixed(2)}`}
        </span>
      </div>
      <div class="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
        <span>Totale da Pagare</span>
        <span class="text-indigo-600">€${calcs.total.toFixed(2)}</span>
      </div>
    </div>
  `;
}

// Elaborazione Ordine
function processCheckoutOrder() {
  const submitBtn = document.getElementById('place-order-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Elaborazione pagamento in corso...';
  }

  setTimeout(() => {
    const calcs = getCartCalculations();
    const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const orderData = {
      orderNumber,
      date: orderDate,
      items: [...cartState],
      customer: { ...checkoutFormData.customer },
      payment: { ...checkoutFormData.payment },
      calculations: calcs
    };

    // Salva ordine nello storico locale
    const orders = JSON.parse(localStorage.getItem('store_orders')) || [];
    orders.unshift(orderData);
    localStorage.setItem('store_orders', JSON.stringify(orders));

    // Reset carrello
    clearCart();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-lock mr-2"></i> Completa Ordine e Paga';
    }

    closeCheckoutModal();
    openOrderSuccessModal(orderData);
  }, 1200);
}

// Modale di Conferma Ordine
function openOrderSuccessModal(order) {
  const modal = document.getElementById('order-success-modal');
  const details = document.getElementById('order-success-details');
  if (!modal || !details) return;

  details.innerHTML = `
    <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-6 text-left">
      <div class="flex flex-wrap justify-between items-center gap-2 mb-3 pb-3 border-b border-indigo-100">
        <div>
          <span class="text-xs text-indigo-500 font-semibold uppercase tracking-wider">Numero Ordine</span>
          <p class="text-lg font-extrabold text-indigo-900">${order.orderNumber}</p>
        </div>
        <div class="text-right">
          <span class="text-xs text-slate-500">Data</span>
          <p class="text-xs font-semibold text-slate-700">${order.date}</p>
        </div>
      </div>

      <div class="text-xs text-slate-600 space-y-1 mb-4">
        <p><strong class="text-slate-800">Spedito a:</strong> ${order.customer.firstName} ${order.customer.lastName} - ${order.customer.address}, ${order.customer.city}</p>
        <p><strong class="text-slate-800">Email di conferma:</strong> ${order.customer.email}</p>
      </div>

      <div class="space-y-2 border-t border-indigo-100 pt-3">
        ${order.items.map(item => `
          <div class="flex justify-between text-xs text-slate-700">
            <span>${item.quantity}x ${item.name}</span>
            <span class="font-semibold">€${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
      </div>

      <div class="flex justify-between items-center text-sm font-bold text-slate-900 pt-3 mt-3 border-t border-indigo-200">
        <span>Totale Pagato</span>
        <span class="text-base text-indigo-600">€${order.calculations.total.toFixed(2)}</span>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeOrderSuccessModal() {
  const modal = document.getElementById('order-success-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}
