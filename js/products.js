/**
 * Catalogo Prodotti Elettronica, Hardware & Setup PC
 */

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Tastiera Meccanica Custom RGB Wireless 75%",
    category: "peripherals",
    price: 139.99,
    originalPrice: 169.99,
    rating: 4.9,
    reviewsCount: 148,
    badge: "-18%",
    badgeType: "discount",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    description: "Tastiera meccanica hot-swappable con switch lineari pre-lubrificati, gasket mount, connettività Tri-Mode (2.4GHz / Bluetooth 5.2 / Cavo Type-C) e keycaps PBT double-shot.",
    features: [
      "Switch meccanici Hot-Swap lubrificati in fabbrica",
      "Struttura Gasket Mount con schiuma fonoassorbente",
      "Tri-Mode: Wireless 2.4Ghz, BT 5.2 e USB-C cablato",
      "Illuminazione RGB personalizzabile per singolo tasto"
    ],
    colors: ["#1e293b", "#0f172a", "#f8fafc"],
    stock: 16,
    isFeatured: true
  },
  {
    id: 2,
    name: "Mouse Gaming Wireless Ultraleggero 49g",
    category: "peripherals",
    price: 89.90,
    originalPrice: 109.90,
    rating: 4.8,
    reviewsCount: 92,
    badge: "Bestseller",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    description: "Sensore ottico PAW3395 da 26.000 DPI reali, polling rate fino a 4000Hz, switch ottici Huano Blue Shell Pink Dot e scocca forata ultraleggera da soli 49 grammi.",
    features: [
      "Sensore ottico PixArt PAW3395 (26.000 DPI)",
      "Peso piuma da soli 49 grammi bilanciati",
      "Polling rate 4K supportato con dongle ultra-fast",
      "Pattini in 100% PTFE vergine per massima scorrevolezza"
    ],
    colors: ["#000000", "#ffffff", "#4f46e5"],
    stock: 24,
    isFeatured: true
  },
  {
    id: 3,
    name: "Scheda Grafica RTX 4070 Super 12GB OC",
    category: "hardware",
    price: 649.00,
    originalPrice: 699.00,
    rating: 5.0,
    reviewsCount: 76,
    badge: "Hardware Top",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
    description: "GPU NVIDIA Ada Lovelace con 12GB di memoria GDDR6X, DLSS 3.5 con Frame Generation, tripla ventola assiale a cuscinetti a sfera e backplate in metallo rinforzato.",
    features: [
      "12GB memoria GDDR6X ad altissima velocità",
      "Supporto DLSS 3.5 & Full Ray Tracing avanzato",
      "Sistema di raffreddamento a tripla ventola silenziosa",
      "Uscite video: 3x DisplayPort 1.4a, 1x HDMI 2.1a"
    ],
    colors: ["#18181b", "#3f3f46"],
    stock: 7,
    isFeatured: true
  },
  {
    id: 4,
    name: "Monitor Gaming 27\" OLED QHD 240Hz 0.03ms",
    category: "monitors",
    price: 799.00,
    originalPrice: 899.00,
    rating: 4.9,
    reviewsCount: 54,
    badge: "OLED Pro",
    badgeType: "discount",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    description: "Pannello QD-OLED con risoluzione 2560x1440, refresh rate fluido da 240Hz, tempo di risposta fulmineo di 0.03ms, neri perfetti e compatibilità G-Sync / FreeSync Premium Pro.",
    features: [
      "Pannello OLED con contrasto infinito e neri assoluti",
      "Refresh rate 240Hz con tempo di risposta 0.03ms GtG",
      "Copertura colore DCI-P3 99% & HDR True Black 400",
      "Supporto ergonomico regolabile in altezza e pivot"
    ],
    colors: ["#09090b"],
    stock: 5,
    isFeatured: true
  },
  {
    id: 5,
    name: "SSD NVMe M.2 2TB PCIe 4.0 (7400 MB/s)",
    category: "hardware",
    price: 154.50,
    originalPrice: 179.00,
    rating: 4.9,
    reviewsCount: 110,
    badge: "Alta Velocità",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
    description: "Unità a stato solido M.2 NVMe Gen4 con velocità di lettura sequenziale fino a 7400 MB/s e scrittura fino a 6800 MB/s. Include dissipatore termico passivo in grafene.",
    features: [
      "Velocità sequenziale: Lettura 7400 MB/s, Scrittura 6800 MB/s",
      "Controller a 8 canali con DRAM Cache LPDDR4 integrata",
      "Compatibile con PC Gaming Desktop, Laptop e PS5",
      "Durabilità garantita fino a 1400 TBW"
    ],
    colors: ["#18181b"],
    stock: 28,
    isFeatured: false
  },
  {
    id: 6,
    name: "Cuffie Gaming Studio Wireless con Microfono Broadcast",
    category: "peripherals",
    price: 169.00,
    originalPrice: 199.00,
    rating: 4.8,
    reviewsCount: 83,
    badge: "-15%",
    badgeType: "discount",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    description: "Driver magnetici planari da 50mm per una fedeltà audio spaziale cristallina, microfono a capsula condensatore da 9.7mm retrattile e autonomia fino a 50 ore.",
    features: [
      "Audio Spaziale 7.1 Surround & Driver Hi-Res 50mm",
      "Microfono cardioide rimovibile con cancellazione rumore AI",
      "Padiglioni in memory foam traspirante ad alto isolamento",
      "Connettività 2.4GHz lossless a latenza zero (<15ms)"
    ],
    colors: ["#111827", "#1e1b4b"],
    stock: 12,
    isFeatured: false
  },
  {
    id: 7,
    name: "Dissipatore a Liquido AIO 360mm con Display LCD",
    category: "hardware",
    price: 219.00,
    originalPrice: 249.00,
    rating: 4.9,
    reviewsCount: 47,
    badge: "Top Raffreddamento",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80",
    description: "Raffreddamento a liquido all-in-one con radiatore da 360mm, 3 ventole ARGB silenziose ad alta pressione statica e display IPS LCD da 2.4\" per monitorare temperature e GIF personalizzate.",
    features: [
      "Display IPS LCD 2.4 pollici personalizzabile con software",
      "Pompa ceramica ad alte prestazioni di 7ª generazione",
      "3 ventole PWM ARGB da 120mm con connettori magnetici daisy-chain",
      "Compatibilità universale con socket Intel LGA1700/1851 e AMD AM5"
    ],
    colors: ["#0f172a", "#f8fafc"],
    stock: 9,
    isFeatured: false
  },
  {
    id: 8,
    name: "Screenbar Lampada per Monitor LED RGB Asimmetrica",
    category: "setup",
    price: 49.90,
    originalPrice: 65.00,
    rating: 4.7,
    reviewsCount: 68,
    badge: "Setup Must-Have",
    badgeType: "new",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    description: "Barra luminosa per monitor con illuminazione asimmetrica antiriflesso sul display, luce ambientale RGB posteriore sincronizzabile e controllo wireless touch rotativo.",
    features: [
      "Ottica asimmetrica che non riflette luce sullo schermo",
      "Regolazione continua temperatura colore (2700K - 6500K)",
      "Aura RGB posteriore per ridurre l'affaticamento visivo",
      "Manopola wireless di precisione per controllo istantaneo"
    ],
    colors: ["#18181b", "#71717a"],
    stock: 20,
    isFeatured: true
  }
];

// Helper per ottenere i prodotti dal localStorage o dai default
function getProducts() {
  const saved = localStorage.getItem('store_tech_products_v2');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Errore nel parsing dei prodotti:", e);
    }
  }
  localStorage.setItem('store_tech_products_v2', JSON.stringify(DEFAULT_PRODUCTS));
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
    category: productData.category || 'peripherals',
    price: parseFloat(productData.price),
    originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
    rating: 5.0,
    reviewsCount: 1,
    badge: productData.badge || "Nuovo Arrivo",
    badgeType: productData.badgeType || "new",
    image: productData.image || "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    description: productData.description || "Componente hardware ad alte prestazioni.",
    features: productData.features || ["Garanzia ufficiale 2 anni", "Spedizione rapida in 24/48h"],
    stock: parseInt(productData.stock, 10) || 10,
    isFeatured: productData.isFeatured || false
  };
  products.unshift(newProduct);
  localStorage.setItem('store_tech_products_v2', JSON.stringify(products));
  return newProduct;
}

// Helper per resettare i prodotti ai valori predefiniti
function resetProductsToDefault() {
  localStorage.setItem('store_tech_products_v2', JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}
