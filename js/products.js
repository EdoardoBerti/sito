/**
 * Database Prodotti di Default per l'E-Commerce
 */

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Cuffie Wireless Noise Cancelling Pro",
    category: "tech",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.9,
    reviewsCount: 128,
    badge: "Sconto 25%",
    badgeType: "discount",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Cuffie over-ear con cancellazione attiva del rumore ibrida, driver da 40mm ad alta fedeltà e fino a 40 ore di autonomia con ricarica rapida Type-C.",
    features: [
      "Cancellazione attiva del rumore ANC",
      "Batteria fino a 40 ore di riproduzione",
      "Microfoni integrati con riduzione del vento",
      "Connessione Bluetooth 5.3 multi-punto"
    ],
    colors: ["#1e293b", "#f8fafc", "#475569"],
    stock: 14,
    isFeatured: true
  },
  {
    id: 2,
    name: "Smartwatch Fitness Tracker Ultra",
    category: "tech",
    price: 89.00,
    originalPrice: 119.00,
    rating: 4.8,
    reviewsCount: 95,
    badge: "Bestseller",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "Display AMOLED Always-On da 1.43\", monitoraggio continuo del battito cardiaco, SpO2, oltre 100 modalità sportive e resistenza all'acqua 5 ATM.",
    features: [
      "Display AMOLED ultra-luminoso da 1.43 pollici",
      "GPS integrato ad alta precisione",
      "Autonomia fino a 12 giorni",
      "Resistenza all'acqua fino a 50 metri (5 ATM)"
    ],
    colors: ["#0f172a", "#38bdf8", "#ec4899"],
    stock: 22,
    isFeatured: true
  },
  {
    id: 3,
    name: "Zaino Minimal Urban Impermeabile",
    category: "accessories",
    price: 59.90,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 64,
    badge: "Novità",
    badgeType: "new",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    description: "Zaino dal design essenziale ed elegante, realizzato in tessuto oxford idrorepellente e riciclato. Scomparto imbottito per laptop fino a 16 pollici.",
    features: [
      "Scomparto protetto per laptop da 15.6'' e 16''",
      "Tessuto 100% idrorepellente ecologico",
      "Schienale traspirante ergonomico",
      "Tasca nascosta antifurto sul retro"
    ],
    colors: ["#334155", "#0f172a", "#78716c"],
    stock: 18,
    isFeatured: false
  },
  {
    id: 4,
    name: "Sneakers Streetwear Eco-Leather",
    category: "fashion",
    price: 110.00,
    originalPrice: 135.00,
    rating: 4.9,
    reviewsCount: 210,
    badge: "In Evidenza",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    description: "Scarpe da ginnastica contemporanee realizzate con materiali sostenibili e suola ammortizzata in memory foam per il massimo comfort quotidiano.",
    features: [
      "Pelle vegana premium sostenibile",
      "Suola antiscivolo ad alta ammortizzazione",
      "Design unisex versatile e contemporaneo",
      "Soletta traspirante antibatterica"
    ],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: ["#ffffff", "#000000", "#d1d5db"],
    stock: 9,
    isFeatured: true
  },
  {
    id: 5,
    name: "Lampada da Tavolo Minimal Touch LED",
    category: "home",
    price: 44.50,
    originalPrice: 55.00,
    rating: 4.6,
    reviewsCount: 42,
    badge: "Design",
    badgeType: "new",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    description: "Lampada wireless ricaricabile in alluminio anodizzato. Regolazione touch continua della luminosità e 3 temperature di colore (calda, naturale, fredda).",
    features: [
      "Controllo touch con dimmer continuo",
      "3 modalità di luce (2700K - 6500K)",
      "Batteria al litio con ricarica USB-C",
      "Struttura in lega di alluminio spazzolato"
    ],
    colors: ["#d4af37", "#0f172a", "#e2e8f0"],
    stock: 30,
    isFeatured: false
  },
  {
    id: 6,
    name: "Occhiali da Sole Polarizzati PolarPro",
    category: "accessories",
    price: 75.00,
    originalPrice: 90.00,
    rating: 4.8,
    reviewsCount: 88,
    badge: "-17%",
    badgeType: "discount",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    description: "Montatura ultraleggera in bio-acetato con lenti polarizzate UV400 ad alta definizione che eliminano i riflessi e migliorano i contrasti visivi.",
    features: [
      "Protezione UV400 al 100%",
      "Lenti polarizzate multistrato antigraffio",
      "Montatura ultraleggera infrangibile",
      "Include custodia rigida e panno in microfibra"
    ],
    colors: ["#000000", "#78350f", "#3b82f6"],
    stock: 15,
    isFeatured: true
  },
  {
    id: 7,
    name: "Felpa Hoodie Oversize Organic Cotton",
    category: "fashion",
    price: 65.00,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 51,
    badge: "Eco-Friendly",
    badgeType: "new",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    description: "Felpa con cappuccio dal taglio rilassato moderno, realizzata al 100% in cotone biologico pesante garzato internamente per il massimo calore e morbidezza.",
    features: [
      "100% Cotone organico pettinato 400 GSM",
      "Tasca a marsupio frontale rinforzata",
      "Cappuccio foderato a doppio strato",
      "Vestibilità oversize moderna"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#e2e8f0", "#1e293b", "#065f46"],
    stock: 25,
    isFeatured: false
  },
  {
    id: 8,
    name: "Diffusore di Aromi ad Ultrasuoni Zen",
    category: "home",
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.8,
    reviewsCount: 112,
    badge: "Relax",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    description: "Umidificatore e diffusore di oli essenziali con rifinitura effetto legno naturale, timer programmabile e 7 luci ambientali soffuse a LED.",
    features: [
      "Serbatoio capiente da 500ml per 12 ore continue",
      "Tecnologia ultra-silenziosa < 20dB",
      "Auto-spegnimento di sicurezza a esaurimento acqua",
      "Telecomando wireless incluso"
    ],
    colors: ["#78350f", "#fef3c7"],
    stock: 19,
    isFeatured: true
  }
];

// Helper per ottenere i prodotti dal localStorage o dai default
function getProducts() {
  const saved = localStorage.getItem('store_products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Errore nel parsing dei prodotti salvati:", e);
    }
  }
  localStorage.setItem('store_products', JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

// Helper per ottenere un singolo prodotto per ID
function getProductById(id) {
  const products = getProducts();
  return products.find(p => p.id === parseInt(id, 10));
}

// Helper per salvare o aggiungere un nuovo prodotto
function addProduct(productData) {
  const products = getProducts();
  const newProduct = {
    id: Date.now(),
    name: productData.name,
    category: productData.category || 'tech',
    price: parseFloat(productData.price),
    originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
    rating: 5.0,
    reviewsCount: 1,
    badge: productData.badge || "Nuovo",
    badgeType: productData.badgeType || "new",
    image: productData.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
    description: productData.description || "Descrizione del prodotto.",
    features: productData.features || ["Garanzia ufficiale 2 anni", "Spedizione rapida"],
    stock: parseInt(productData.stock, 10) || 10,
    isFeatured: productData.isFeatured || false
  };
  products.unshift(newProduct);
  localStorage.setItem('store_products', JSON.stringify(products));
  return newProduct;
}

// Helper per resettare i prodotti ai valori predefiniti
function resetProductsToDefault() {
  localStorage.setItem('store_products', JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}
