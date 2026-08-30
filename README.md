# NEXA SHOP - E-Commerce Interattivo

Un sito e-commerce moderno, elegante e interattivo realizzato da zero con HTML5, Tailwind CSS e JavaScript ES6+.

## ✨ Funzionalità

- 🛍️ **Catalogo Prodotti Dinamico**: Ricerca live in tempo reale, filtri per categoria, slider prezzo e ordinamento.
- 🔍 **Quick View**: Anteprima rapida con selezione taglia, colore e dettagli.
- 🛒 **Carrello & Wishlist (Slide-over)**: Drawer laterale animato con calcolo automatico totali, sconti coupon (`WELCOME10`, `OFFERTA20`, `FREESHIP`) e barra spedizione gratuita.
- 💳 **Procedura di Checkout**: Flusso d'acquisto a passaggi con validazione e simulazione pagamento (Carta, PayPal, Apple Pay, Contrassegno).
- 🧾 **Conferma Ordine**: Riepilogo ordine con codice generato e opzione stampa ricevuta.
- ➕ **Pannello Admin Prodotti**: Possibilità di aggiungere nuovi prodotti direttamente dall'interfaccia.
- 💾 **Salvataggio Dati**: Persistenza automatica nel browser tramite `localStorage`.

## 🚀 Come Eseguire il Progetto

Non sono richieste dipendenze o server Node.js. È sufficiente:

1. Clonare o scaricare il repository.
2. Aprire il file `index.html` con qualsiasi browser o utilizzare l'estensione **Live Server** in Visual Studio Code.

## 📁 Struttura

```
sito/
├── index.html            # Pagina principale dell'e-commerce
├── README.md             # Documentazione del progetto
├── css/
│   └── style.css         # Stili custom e animazioni
└── js/
    ├── products.js       # Catalogo prodotti e persistenza
    ├── cart.js           # Gestione carrello, wishlist e coupon
    ├── checkout.js       # Flusso checkout e ordini
    └── app.js            # Inizializzazione, filtri e UI
```
