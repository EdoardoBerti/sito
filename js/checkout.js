/**
 * Gestione Checkout e Conferma Ordine Digitale CS2 (Dark Theme)
 */

let currentCheckoutStep = 1;
let checkoutFormData = {
  customer: {},
  payment: { method: 'card' }
};

function openCheckoutModal() {
  if (cartState.length === 0) {
    showToast('Il tuo carrello è vuoto!', 'warning');
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
      discordTag: formData.get('discordTag') || '',
      steamId: formData.get('steamId') || ''
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
        <div class="bg-slate-950 p-4 rounded-xl text-xs border border-slate-800 space-y-1.5">
          <div class="flex justify-between items-center mb-1">
            <span class="font-bold text-slate-200">${cust.firstName} ${cust.lastName}</span>
            <button type="button" onclick="goToCheckoutStep(1)" class="text-xs text-cyan-400 hover:underline">Modifica</button>
          </div>
          <p class="text-slate-300"><i class="fas fa-envelope text-cyan-400 mr-2"></i>Email per licenza: <strong class="text-white font-mono">${cust.email}</strong></p>
          ${cust.discordTag ? `<p class="text-slate-400"><i class="fab fa-discord text-indigo-400 mr-2"></i>Discord: <span class="font-mono text-slate-200">${cust.discordTag}</span></p>` : ''}
          <p class="text-emerald-400 text-[11px]"><i class="fas fa-bolt text-emerald-400 mr-1.5"></i> Consegna istantanea della License Key & Loader</p>
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
      } else if (checkoutFormData.payment.method === 'crypto') {
        payText = `<i class="fab fa-bitcoin text-amber-400 mr-2"></i> Criptovalute (USDT / BTC / LTC)`;
      } else {
        payText = `<i class="fab fa-apple text-slate-300 mr-2"></i> Apple Pay / Google Pay`;
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
        <span>Consegna Digitale</span>
        <span class="font-mono text-emerald-400 font-bold">Istantanea (0.00€)</span>
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
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Generazione License Key sicura...';
  }

  setTimeout(() => {
    const calcs = getCartCalculations();
    const orderNumber = 'CS2-' + Math.floor(100000 + Math.random() * 900000);
    const licenseKey = 'CS2-' + Array.from({length: 4}, () => Math.random().toString(36).substring(2, 6).toUpperCase()).join('-');
    const orderDate = new Date().toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const orderData = {
      orderNumber,
      licenseKey,
      date: orderDate,
      items: [...cartState],
      customer: { ...checkoutFormData.customer },
      payment: { ...checkoutFormData.payment },
      calculations: calcs
    };

    const orders = JSON.parse(localStorage.getItem('cs2_orders')) || [];
    orders.unshift(orderData);
    localStorage.setItem('cs2_orders', JSON.stringify(orders));

    clearCart();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-lock mr-2"></i> Completa Ordine e Attiva Licenza';
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
          <span class="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">Numero Ordine</span>
          <p class="text-base font-mono font-black text-white">${order.orderNumber}</p>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-slate-500">Data e Ora</span>
          <p class="text-xs text-slate-400">${order.date}</p>
        </div>
      </div>

      <!-- License Key Box -->
      <div class="bg-indigo-950/50 border border-indigo-500/40 rounded-xl p-3.5 mb-4">
        <div class="flex justify-between items-center mb-1">
          <span class="text-[11px] font-bold text-cyan-300 font-mono uppercase"><i class="fas fa-key text-amber-400 mr-1.5"></i> La tua Chiave di Licenza:</span>
          <button onclick="navigator.clipboard.writeText('${order.licenseKey}'); showToast('Chiave copiata negli appunti!', 'success');" class="text-[11px] text-indigo-300 hover:text-white bg-indigo-600/30 px-2 py-0.5 rounded border border-indigo-400/30">
            <i class="fas fa-copy mr-1"></i> Copia
          </button>
        </div>
        <p class="font-mono text-sm font-black text-amber-300 tracking-wider">${order.licenseKey}</p>
        <p class="text-[10px] text-slate-400 mt-1">Inviata anche all'indirizzo: <strong class="text-slate-200">${order.customer.email}</strong></p>
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
        <span>Totale Pagato</span>
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
