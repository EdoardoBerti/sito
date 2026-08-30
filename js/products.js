/**
 * Catalogo Pacchetti & Tools CS2 (Counter-Strike 2)
 */

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "CS2 ESP + Skin Changer",
    category: "visuals",
    price: 10.00,
    originalPrice: 15.00,
    rating: 4.9,
    reviewsCount: 184,
    badge: "Bestseller",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    description: "Pacchetto visual completo con Box/Glow ESP per individuare i nemici attraverso i muri e Skin Changer totale per sfoggiare qualsiasi coltello, guanto o skin StatTrak in gioco.",
    features: [
      "Wallhack Box 2D/3D, Skeleton & Glow Chams personalizzabile",
      "Skin Changer completo: tutti i coltelli (Karambit, Butterfly), guanti & agenti",
      "Visualizzazione HP, armatura, armi impugnate e distanza nemici",
      "100% Stream-Proof (invisibile in streaming OBS e condivisione schermo Discord)",
      "Bypass VACnet con iniezione automatica sicura"
    ],
    colors: ["#6366f1", "#06b6d4", "#ec4899"],
    stock: 99,
    isFeatured: true
  },
  {
    id: 2,
    name: "CS2 FULL Suite (Aimbot + ESP + Skin Changer + Triggerbot)",
    category: "bundles",
    price: 25.00,
    originalPrice: 35.00,
    rating: 5.0,
    reviewsCount: 312,
    badge: "Pacchetto Completo",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
    description: "La suite definitiva all-in-one per CS2. Include Legit & Rage Aimbot ad alta precisione, Full ESP, Skin Changer con tutti gli sticker/pattern e Triggerbot con RCS avanzato.",
    features: [
      "Legit & Rage Aimbot con FOV personalizzabile, smoothing naturale e selezione hitbox",
      "Full Visual ESP Suite (Glow, Skeleton, Box, Snaplines, Health & Bomb Timer)",
      "Inventory & Skin Changer illimitato (tutti i coltelli, guanti, skin, seed e sticker)",
      "Magnetic Triggerbot istantaneo & Recoil Control System (RCS) a compensazione totale",
      "Salvataggio configurazioni su Cloud e aggiornamenti 1-click"
    ],
    colors: ["#f59e0b", "#ef4444", "#8b5cf6"],
    stock: 99,
    isFeatured: true
  },
  {
    id: 3,
    name: "CS2 Skin Changer Standalone",
    category: "visuals",
    price: 5.00,
    originalPrice: 8.00,
    rating: 4.8,
    reviewsCount: 95,
    badge: "Super Prezzo",
    badgeType: "discount",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    description: "Sblocca istantaneamente qualsiasi skin, coltello, guanto, musica o agente su Counter-Strike 2. Include generazione StatTrak, Pattern Seed personalizzabili e applicazione di 4 o 5 sticker su qualsiasi arma.",
    features: [
      "Tutti i coltelli sbloccati (Karambit Doppler, Butterfly Fade, M9 Lore, ecc.)",
      "Guanti sportivi e specialistici con float personalizzato (da 0.0001 a 1.00)",
      "Applicazione libera di qualsiasi sticker anche olografico o dorato",
      "Modifica modelli agenti CT & T in-game",
      "Zero impatto su FPS e stabilità di gioco"
    ],
    colors: ["#10b981", "#3b82f6"],
    stock: 99,
    isFeatured: false
  },
  {
    id: 4,
    name: "CS2 Legit Aim + Triggerbot",
    category: "combat",
    price: 15.00,
    originalPrice: 20.00,
    rating: 4.9,
    reviewsCount: 142,
    badge: "Legit Pro",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    description: "Modulo di combattimento ultra-legit progettato per Premier e Matchmaking competitivo. Movimenti del mirino umanizzati invisibili anche agli spettatori e Triggerbot magnetico a risposta millimetrica.",
    features: [
      "Smoothing del mirino personalizzabile con curve di movimento umane",
      "Targeting selettivo (Testa, Collo, Torace) con ritardo di reazione regolabile",
      "Triggerbot magnetico ultra-reattivo (attivazione automatica al passaggio del mirino)",
      "Standalone RCS (Recoil Control System) per spray perfetto di AK-47, M4A1-S, ecc.",
      "Configurazioni specifiche per singola arma salvabili in preset"
    ],
    colors: ["#ef4444", "#f97316"],
    stock: 99,
    isFeatured: true
  }
];

const STORAGE_KEY = 'store_cs2_products_v5';

// Helper per ottenere i prodotti dal localStorage o dai default
function getProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error("Errore nel parsing dei prodotti CS2:", e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
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
    category: productData.category || 'bundles',
    price: parseFloat(productData.price),
    originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
    rating: 5.0,
    reviewsCount: 1,
    badge: productData.badge || "Nuovo Pacchetto",
    badgeType: productData.badgeType || "new",
    image: productData.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    description: productData.description || "Pacchetto CS2 ad alte prestazioni.",
    features: productData.features || ["Consegna digitale istantanea", "100% Undetected & Auto-Update", "Guida all'installazione inclusa"],
    stock: parseInt(productData.stock, 10) || 99,
    isFeatured: productData.isFeatured || false
  };
  products.unshift(newProduct);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return newProduct;
}

// Helper per resettare i prodotti ai valori predefiniti
function resetProductsToDefault() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}
