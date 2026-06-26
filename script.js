// ===== GLOBAL VARIABLES =====
let products = [
    {
        id: 1,
        name: "Pastel Highlighters Set",
        price: 850,
        desc: "Premium color shades, durable material",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop"
    },
    {
        id: 2,
        name: "Cute Cat Sticky Notes",
        price: 850,
        desc: "Creative designs, perfect for notes",
        image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop"
    },
    {
        id: 3,
        name: "Minimalist Journal",
        price: 850,
        desc: "Perfect for writing, clean design",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop"
    },
    {
        id: 4,
        name: "Glitter Pens",
        price: 550,
        desc: "Smooth and colorful writing pens",
        image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=300&fit=crop"
    },
    {
        id: 5,
        name: "Rainbow Gel Pens",
        price: 850,
        desc: "Perfect for notes and planning",
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop"
    },
    {
        id: 6,
        name: "Professional Sketch Pencils Set",
        price: 850,
        desc: "Perfect for drawing and sketching",
        image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=300&fit=crop"
    }
];

let cart = [];
let currentProductIndex = null;
let isAdminLoggedIn = false;

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });

    // Show selected page
    document.getElementById(pageId).classList.remove('hidden');

    // Update navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Find and activate the corresponding nav link
    const navLinks = document.querySelectorAll('.nav-link');
    for (let link of navLinks) {
        if (link.textContent.toLowerCase().includes(pageId.toLowerCase()) ||
            (pageId === 'home' && link.textContent === 'Home')) {
            link.classList.add('active');
            break;
        }
    }

    // Load content for specific pages
    if (pageId === 'home') {
        loadFeaturedProducts();
    } else if (pageId === 'products') {
        loadAllProducts();
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// ===== PRODUCT FUNCTIONS =====
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) return;

    featuredContainer.innerHTML = '';
    const featured = products.slice(0, 3);

    featured.forEach(product => {
        featuredContainer.innerHTML += createProductCard(product);
    });
}

function loadAllProducts() {
    const allContainer = document.getElementById('allProducts');
    if (!allContainer) return;

    allContainer.innerHTML = '';

    products.forEach(product => {
        allContainer.innerHTML += createProductCard(product);
    });
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">${product.price} PKR</div>
                <p class="product-desc">${product.desc}</p>
                <div class="product-actions">
                    <button class="btn view-btn" onclick="viewProduct(${product.id})">View Details</button>
                    <button class="btn cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`Product: ${product.name}\nPrice: ${product.price} PKR\nDescription: ${product.desc}`);
    }
}

// ===== CART FUNCTIONS =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartDisplay();
    showNotification(`${product.name} added to cart!`);
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center p-20">
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '0 PKR';
    } else {
        let total = 0;
        cartItems.innerHTML = '';

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartItems.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price} PKR each</p>
                    </div>
                    <div class="cart-item-controls">
                        <button onclick="updateCartItem(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartItem(${item.id}, 1)">+</button>
                        <button onclick="removeFromCart(${item.id})" style="background-color:#d9664a; color:white; border-radius:4px; padding:4px 8px;">✕</button>
                    </div>
                    <div class="cart-item-total">${itemTotal} PKR</div>
                </div>
            `;
        });

        cartTotal.textContent = `${total} PKR`;
    }
}

function updateCartItem(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    updateCartDisplay();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

// ===== ADMIN FUNCTIONS =====
function loginAdmin() {
    const password = document.getElementById('adminPassword').value;

    if (password === 'admin123') {
        isAdminLoggedIn = true;
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');
        loadAdminProducts();
        showNotification('Admin login successful!');
    } else {
        alert('Incorrect password! Try "admin123" for demo.');
    }
}

function loadAdminProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach((product, index) => {
        productList.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>${product.price} PKR</td>
                <td>${product.desc}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editProduct(${index})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteProduct(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function addProduct() {
    const name = document.getElementById('addName').value.trim();
    const price = document.getElementById('addPrice').value.trim();
    const desc = document.getElementById('addDesc').value.trim();

    if (!name || !price) {
        alert('Please enter product name and price');
        return;
    }

    const newProduct = {
        id: products.length + 1,
        name,
        price: parseInt(price),
        desc,
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop"
    };

    products.push(newProduct);

    // Clear form
    document.getElementById('addName').value = '';
    document.getElementById('addPrice').value = '';
    document.getElementById('addDesc').value = '';

    loadAdminProducts();
    showNotification('Product added successfully!');
}

function editProduct(index) {
    const product = products[index];
    currentProductIndex = index;

    document.getElementById('updateName').value = product.name;
    document.getElementById('updatePrice').value = product.price;
    document.getElementById('updateDesc').value = product.desc;

    document.getElementById('updateCard').classList.remove('hidden');
    document.getElementById('updateCard').scrollIntoView({ behavior: 'smooth' });
}

function updateProduct() {
    if (currentProductIndex === null) return;

    const name = document.getElementById('updateName').value.trim();
    const price = document.getElementById('updatePrice').value.trim();
    const desc = document.getElementById('updateDesc').value.trim();

    if (!name || !price) {
        alert('Please enter product name and price');
        return;
    }

    products[currentProductIndex] = {
        ...products[currentProductIndex],
        name,
        price: parseInt(price),
        desc
    };

    cancelUpdate();
    loadAdminProducts();
    showNotification('Product updated successfully!');
}

function cancelUpdate() {
    currentProductIndex = null;
    document.getElementById('updateCard').classList.add('hidden');
    document.getElementById('updateName').value = '';
    document.getElementById('updatePrice').value = '';
    document.getElementById('updateDesc').value = '';
}

function deleteProduct(index) {
    if (confirm('Are you sure you want to delete this product?')) {
        products.splice(index, 1);
        loadAdminProducts();
        showNotification('Product deleted successfully!');
    }
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function () {
    // Initialize
    loadFeaturedProducts();
    updateCartDisplay();

    // Menu toggle for mobile
    document.getElementById('menuToggle').addEventListener('click', function () {
        document.getElementById('navMenu').classList.toggle('active');
    });

    // Cart toggle
    document.getElementById('cartToggle').addEventListener('click', function (e) {
        e.preventDefault();
        toggleCart();
    });

    document.getElementById('closeCart').addEventListener('click', toggleCart);
    document.getElementById('cartOverlay').addEventListener('click', toggleCart);

    // Contact form submission
    document.getElementById('contactForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        alert(`Thank you, ${name}! Your message has been sent.\nWe'll get back to you at ${email} soon.`);

        this.reset();
    });

    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', function () {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Thank you for your order!\nTotal: ${total} PKR\nYour order has been placed successfully.`);

        cart = [];
        updateCartDisplay();
        toggleCart();
    });

    // Show home page by default
    showPage('home');
});

// ===== INITIALIZATION =====
window.onload = function () {
    showPage('home');
};
