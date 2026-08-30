/**
 * Gestione Checkout e Conferma Ordine (Dark Theme)
 */

let currentCheckoutStep = 1;
let checkoutFormData = {
  customer: {},
  payment: { method: 'card' }
};

function openCheckoutModal() {
  if (cartState.length === 0) {
    showToast('Il tuo carrello hardware è vuoto!', 'warning');
    return;
  }
  
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

function goToCheckoutStep(step) {
  if (step === 2) {
    const form = document.getElementById('shipping-form');
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
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

function renderCheckoutStep() {
  for (let i = 1; i <= 3; i++) {
    const stepIndicator = document.getElementById(`step-indicator-${i}`);
    const stepContent = document.getElementById(`checkout-step-${i}`);

    if (!stepIndicator || !stepContent) continue;

    if (i < currentCheckoutStep) {
      stepIndicator.className = 'w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md';
      stepIndicator.innerHTML = '<i class="fas fa-check"></i>';
      stepContent.classList.add('hidden');
    } else if (i === currentCheckoutStep) {
      stepIndicator.className = 'w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-indigo-600/40 ring-4 ring-indigo-500/20';
      stepIndicator.textContent = i;
      stepContent.classList.remove('hidden');
    } else {
      stepIndicator.className = 'w-8 h-8 rounded-full bg-slate-800 text-slate-500 border border-slate-700 flex items-center justify-center font-bold text-xs';
      stepIndicator.textContent = i;
      stepContent.classList.add('hidden');
    }
  }

  if (currentCheckoutStep === 3) {
    const cust = checkoutFormData.customer;
    const reviewInfo = document.getElementById('review-shipping-info');
    if (reviewInfo) {
      reviewInfo.innerHTML = `
        <div class="bg-slate-950 p-4 rounded-xl text-xs border border-slate-800 space-y-1">
          <div class="flex justify-between items-center mb-1">
            <span class="font-bold text-slate-200">${cust.firstName} ${cust.lastName}</span>
            <button type="button" onclick="goToCheckoutStep(1)" class="text-xs text-cyan-400 hover:underline">Modifica</button>
          </div>
          <p class="text-slate-400"><i class="fas fa-map-marker-alt text-slate-500 mr-2"></i>${cust.address}, ${cust.zip} ${cust.city} (${cust.country})</p>
          <p class="text-slate-400"><i class="fas fa-envelope text-slate-500 mr-2"></i>${cust.email}</p>
          <p class="text-slate-400"><i class="fas fa-phone text-slate-500 mr-2"></i>${cust.phone}</p>
        </div>
      `;
    }

    const payInfo = document.getElementById('review-payment-info');
    if (payInfo) {
      let payText = '';
      if (checkoutFormData.payment.method === 'card') {
        payText = `<i class="fas fa-credit-card text-indigo-400 mr-2"></i> Carta di Credito (•••• ${checkoutFormData.payment.cardNumber || '4242'})`;
      } else if (checkoutFormData.payment.method === 'paypal') {
        payText = `<i class="fab fa-paypal text-blue-400 mr-2"></i> Account PayPal`;
      } else if (checkoutFormData.payment.method === 'applepay') {
        payText = `<i class="fab fa-apple text-slate-300 mr-2"></i> Apple Pay / Google Pay`;
      } else {
        payText = `<i class="fas fa-truck-loading text-emerald-400 mr-2"></i> Contrassegno (Pagamento alla Consegna)`;
      }
      payInfo.innerHTML = `
        <div class="bg-slate-950 p-4 rounded-xl text-xs border border-slate-800 flex justify-between items-center">
          <span class="font-medium text-slate-200 flex items-center">${payText}</span>
          <button type="button" onclick="goToCheckoutStep(2)" class="text-xs text-cyan-400 hover:underline">Modifica</button>
        </div>
      `;
    }
  }
}

function renderCheckoutSummary() {
  const container = document.getElementById('checkout-items-list');
  const totalsContainer = document.getElementById('checkout-totals');
  if (!container || !totalsContainer) return;

  const calcs = getCartCalculations();

  container.innerHTML = cartState.map(item => `
    <div class="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0">
      <img src="${item.image}" alt="${item.name}" class="w-11 h-11 rounded-lg object-cover border border-slate-800 bg-slate-950">
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-slate-200 truncate">${item.name}</p>
        <p class="text-[11px] text-slate-500 font-mono">Qtà: ${item.quantity} × €${item.price.toFixed(2)}</p>
      </div>
      <span class="text-xs font-mono font-bold text-white">€${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');

  totalsContainer.innerHTML = `
    <div class="space-y-2 text-xs pt-3 border-t border-slate-800">
      <div class="flex justify-between text-slate-400">
        <span>Subtotale</span>
        <span class="font-mono text-slate-200">€${calcs.subtotal.toFixed(2)}</span>
      </div>
      ${calcs.discountAmount > 0 ? `
        <div class="flex justify-between text-emerald-400 font-medium">
          <span>Sconto (${appliedCoupon?.label || 'Promozione'})</span>
          <span class="font-mono">-€${calcs.discountAmount.toFixed(2)}</span>
        </div>
      ` : ''}
      <div class="flex justify-between text-slate-400">
        <span>Spedizione</span>
        <span class="font-mono ${calcs.shippingFee === 0 ? 'text-emerald-400' : 'text-slate-200'}">
          ${calcs.shippingFee === 0 ? 'Gratuita' : `€${calcs.shippingFee.toFixed(2)}`}
        </span>
      </div>
      <div class="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
        <span>Totale da Pagare</span>
        <span class="text-cyan-400 font-mono text-base">€${calcs.total.toFixed(2)}</span>
      </div>
    </div>
  `;
}

function processCheckoutOrder() {
  const submitBtn = document.getElementById('place-order-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Elaborazione transazione sicura...';
  }

  setTimeout(() => {
    const calcs = getCartCalculations();
    const orderNumber = 'NEXA-' + Math.floor(100000 + Math.random() * 900000);
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

    const orders = JSON.parse(localStorage.getItem('store_orders')) || [];
    orders.unshift(orderData);
    localStorage.setItem('store_orders', JSON.stringify(orders));

    clearCart();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-lock mr-2"></i> Completa Ordine e Paga';
    }

    closeCheckoutModal();
    openOrderSuccessModal(orderData);
  }, 1200);
}

function openOrderSuccessModal(order) {
  const modal = document.getElementById('order-success-modal');
  const details = document.getElementById('order-success-details');
  if (!modal || !details) return;

  details.innerHTML = `
    <div class="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-6 text-left">
      <div class="flex flex-wrap justify-between items-center gap-2 mb-3 pb-3 border-b border-slate-800">
        <div>
          <span class="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">Numero Ordine Hardware</span>
          <p class="text-base font-mono font-black text-white">${order.orderNumber}</p>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-slate-500">Data</span>
          <p class="text-xs text-slate-400">${order.date}</p>
        </div>
      </div>

      <div class="text-xs text-slate-400 space-y-1 mb-4">
        <p><strong class="text-slate-200">Destinatario:</strong> ${order.customer.firstName} ${order.customer.lastName} - ${order.customer.address}, ${order.customer.city}</p>
        <p><strong class="text-slate-200">Email di tracciamento:</strong> ${order.customer.email}</p>
      </div>

      <div class="space-y-2 border-t border-slate-800 pt-3">
        ${order.items.map(item => `
          <div class="flex justify-between text-xs text-slate-300">
            <span class="truncate pr-2">${item.quantity}x ${item.name}</span>
            <span class="font-mono text-white">€${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
      </div>

      <div class="flex justify-between items-center text-sm font-bold text-white pt-3 mt-3 border-t border-slate-800">
        <span>Totale Transazione</span>
        <span class="text-base font-mono text-cyan-400">€${order.calculations.total.toFixed(2)}</span>
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
