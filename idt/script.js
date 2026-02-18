/**
 * CAFE OCTANE - High-Performance Coffee Script
 * Simplified for minimalist UI
 */

const translations = {
    en: {
        hero_title: "FUEL YOUR FLOW",
        search_placeholder: "Search the lab...",
        cat_all: "ALL", cat_drinks: "DRINKS", cat_food: "FOOD",
        cart_title: "ORDER", notes_placeholder: "Special requests...",
        bill_subtotal: "Subtotal", bill_tax: "Tax (5%)", bill_total: "TOTAL",
        btn_checkout: "CONFIRM",
        milk_dairy: "Dairy", milk_oat: "Oat", milk_almond: "Almond",
        spice_mild: "Mild", spice_med: "Med", spice_hot: "Hot",
        add: "ADD", bestseller: "SIGNATURE", added: "Fuel Added", open: "OPEN", closed: "CLOSED"
    }
    // Hindi and Kannada translations can be added back here if needed
};

const menuData = [
    { id: 1, cat: 'coffee', diet: 'veg', name: 'Nitro Cold Brew', price: 249, desc: 'Ultra-smooth velvet coffee infused with nitrogen.', img: '1517701604599-bb29b565090c', bestseller: true },
    { id: 2, cat: 'coffee', diet: 'veg', name: 'Charcoal Latte', price: 289, desc: 'Detox charcoal blend with vanilla.', img: '1534353473418-4cfa6c56fd38' },
    { id: 4, cat: 'food', diet: 'veg', name: 'Truffle Avocado Toast', price: 450, desc: 'Sourdough toast with rare truffle oil.', img: '1525351484163-7529414344d8', bestseller: true },
    { id: 6, cat: 'food', diet: 'nonveg', name: 'Loaded Keema Brioche', price: 420, desc: 'Hand-pulled lamb on butter brioche.', img: '1475090169767-40ed8d18f67d' }
];

let cart = [];
let currentLang = 'en';
let currentCategory = 'all';
let selectedOptions = {};

window.addEventListener('DOMContentLoaded', () => {
    // Basic initialization
    const saved = localStorage.getItem('nb-cart');
    if (saved) { cart = JSON.parse(saved); updateCartUI(); }
    
    updateShopStatus();
    renderMenu('all');

    // Simple search listener
    document.getElementById('search').addEventListener('input', (e) => {
        renderMenu(currentCategory, e.target.value);
    });
});

function updateShopStatus() {
    const hour = new Date().getHours();
    const statusEl = document.getElementById('shop-status');
    const lang = translations[currentLang];
    
    if (hour >= 8 && hour < 22) {
        statusEl.className = 'status-badge status-open';
        statusEl.innerText = lang.open;
        statusEl.style.color = "#4caf50";
    } else {
        statusEl.className = 'status-badge status-closed';
        statusEl.innerText = lang.closed;
        statusEl.style.color = "#ef5350";
    }
}

function renderMenu(category, query = "") {
    const container = document.getElementById('menu-container');
    const lang = translations[currentLang];
    currentCategory = category;

    const filtered = menuData.filter(i => 
        (category === 'all' || i.cat === category) && 
        i.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 50px; color: #666;">No fuel found.</div>`;
        return;
    }

    container.innerHTML = filtered.map(item => `
        <div class="menu-card">
            <div class="card-head" style="display:flex; justify-content:space-between; align-items:start;">
                <div>
                    <h3 style="margin:0; font-size:1.1rem; letter-spacing:1px;">${item.name.toUpperCase()}</h3>
                    <p style="font-size:0.8rem; color:#888; margin: 8px 0;">${item.desc}</p>
                </div>
                ${item.bestseller ? `<i class="fas fa-star" style="color:var(--accent); font-size:0.8rem;"></i>` : ''}
            </div>
            
            <div class="custom-selector" style="display:flex; gap:10px; margin: 15px 0;">
                ${item.cat === 'food' ? 
                    ['Mild', 'Med', 'Hot'].map(opt => `<small onclick="setOpt(${item.id},'${opt}',this)" style="cursor:pointer; opacity: ${opt === 'Med' ? 1 : 0.5}">${opt}</small>`).join('') :
                    ['Dairy', 'Oat', 'Almond'].map(opt => `<small onclick="setOpt(${item.id},'${opt}',this)" style="cursor:pointer; opacity: ${opt === 'Dairy' ? 1 : 0.5}">${opt}</small>`).join('')
                }
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                <span style="font-weight:700;">₹${item.price}</span>
                <button class="add-btn" onclick="addToCart(${item.id})">${lang.add}</button>
            </div>
        </div>
    `).join('');
}

function setOpt(itemId, val, el) {
    selectedOptions[itemId] = val;
    el.parentElement.querySelectorAll('small').forEach(s => s.style.opacity = "0.5");
    el.style.opacity = "1";
}

function addToCart(id) {
    const item = menuData.find(p => p.id === id);
    const choice = selectedOptions[id] || (item.cat === 'food' ? 'Med' : 'Dairy');
    const existing = cart.find(i => i.id === id && i.choice === choice);
    
    if (existing) existing.qty += 1;
    else cart.push({ ...item, qty: 1, choice: choice });
    
    updateCartUI();
}

function updateCartUI() {
    localStorage.setItem('nb-cart', JSON.stringify(cart));
    const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;
    
    document.getElementById('count').innerText = cart.reduce((sum, i) => sum + i.qty, 0);
    document.getElementById('total-price').innerText = `₹${total}`;
    
    document.getElementById('cart-items').innerHTML = cart.map(item => `
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:0.9rem;">
            <span>${item.name} <small style="color:#666;">(${item.choice})</small> x ${item.qty}</span>
            <span>₹${item.price * item.qty}</span>
        </div>`).join('');
}

function toggleCart() { 
    document.getElementById('cart-panel').classList.toggle('active'); 
}

function checkout() {
    const items = cart.map(i => `• ${i.name} (${i.choice}) x${i.qty}`).join('%0A');
    const total = document.getElementById('total-price').innerText;
    window.open(`https://wa.me/919876543210?text=*CAFE OCTANE ORDER*%0A%0A${items}%0A%0A*Total:* ${total}`);
}