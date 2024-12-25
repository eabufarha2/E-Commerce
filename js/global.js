/*******************************************************
 * GLOBAL.JS
 * - Loads header & footer partials
 * - Contains shared cart functionality
 ******************************************************/

/** Define the global discount rate (70% discount) */
const DISCOUNT_RATE = 0.7; // Represents a 70% discount

/*******************************************************
 * 1) Dynamically load header & footer (if using partials)
 ******************************************************/
document.addEventListener('DOMContentLoaded', () => {
  // Insert header partial
  fetch('partials/header.html')
    .then((res) => res.text())
    .then((data) => {
      document.getElementById('header-placeholder').innerHTML = data;
      setupMobileMenu(); // Initialize mobile menu after header loads
      console.log('Header loaded successfully.');
    })
    .catch(error => {
      console.error('Error loading header:', error);
    });

  // Insert footer partial
  fetch('partials/footer.html')
    .then((res) => res.text())
    .then((data) => {
      document.getElementById('footer-placeholder').innerHTML = data;
      console.log('Footer loaded successfully.');
    })
    .catch(error => {
      console.error('Error loading footer:', error);
    });

  // Initialize shared functionalities
  initializeCart();
});

/*******************************************************
 * 2) Example mobile nav toggles (if you have them)
 ******************************************************/
function setupMobileMenu() {
  const bar = document.getElementById('bar');
  const closeBtn = document.getElementById('close');
  const navbar = document.getElementById('navbar');

  if (bar) {
    bar.addEventListener('click', () => {
      navbar.classList.add('active');
      console.log('Navbar activated.');
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      navbar.classList.remove('active');
      console.log('Navbar deactivated.');
    });
  }
}

/*******************************************************
 * 3) CART FUNCTIONALITY (shared across pages)
 ******************************************************/
let cart = [];

/** Load cart from localStorage on page load */
function loadCartFromLocalStorage() {
  const saved = localStorage.getItem('cart');
  if (saved) {
    try {
      cart = JSON.parse(saved);
      console.log('Cart loaded from localStorage:', cart);
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      cart = [];
    }
  } else {
    console.log('No cart found in localStorage.');
  }
}

/** Save cart to localStorage whenever it changes */
function saveCartToLocalStorage() {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart saved to localStorage:', cart);
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

/** Show a small toast/notification when a product is added to cart. */
function showCartNotification(message) {
  const notif = document.getElementById('cart-notification');
  if (!notif) {
    console.warn('Cart notification element not found.');
    return;
  }

  notif.textContent = message;
  notif.classList.add('show');
  console.log('Cart notification shown:', message);

  // Hide after 2 seconds
  setTimeout(() => {
    notif.classList.remove('show');
    console.log('Cart notification hidden.');
  }, 2000);
}

/** Generates star icons for rating. */
function generateStarsHTML(rating) {
  let stars = '';
  for (let i = 0; i < rating; i++) {
    stars += '<i class="fa fa-star" aria-hidden="true"></i>';
  }
  return stars;
}

/** Generates HTML for a single product, including data-* attributes */
function generateProductHTML(product) {
  const discountedPrice = product.price * (1 - DISCOUNT_RATE);
  const formattedOriginalPrice = `₪‎${product.price.toFixed(2)}`;
  const formattedDiscountedPrice = `₪‎${discountedPrice.toFixed(2)}`;
  const discountPercentage = `${DISCOUNT_RATE * 100}% OFF`;

  return `
    <div class="pro"
         data-name="${product.name}"
         data-price="${discountedPrice}"
         data-img="${product.image}"
         data-brand="${product.brand}"
    >
      <img src="${product.image}" alt="${product.name}">
      <div class="discount-badge">${discountPercentage}</div>
      <div class="des">
        <span>${product.brand}</span>
        <h5>${product.name}</h5>
        <div class="star">
          ${generateStarsHTML(product.rating)}
        </div>
        <h4>
          <span class="original-price">${formattedOriginalPrice}</span>
          <span class="discounted-price">${formattedDiscountedPrice}</span>
        </h4>
      </div>
      <a href="#" class="cart"><i class="fa fa-shopping-cart" aria-hidden="true"></i></a>
    </div>
  `;
}

/** Setup Add to Cart handlers (to be called after products are loaded) */
function setupAddToCartHandlers() {
  const cartButtons = document.querySelectorAll('.cart');
  console.log(`Found ${cartButtons.length} .cart buttons.`);
  cartButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      // The parent product might be .pro or .single-pro-image
      let productDiv = e.target.closest('.pro');
      if (!productDiv) {
        // fallback if single-pro page
        productDiv = e.target.closest('.single-pro-image');
      }
      if (!productDiv) {
        console.warn('Product container not found.');
        return;
      }

      // Read data from attributes
      const name = productDiv.getAttribute('data-name');
      const price = parseFloat(productDiv.getAttribute('data-price') || '0');
      const img = productDiv.getAttribute('data-img');

      console.log(`Adding to cart: ${name}, Price: ${price}, Image: ${img}`);

      // Check if product is already in cart
      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.qty += 1;
        console.log(`Increased quantity for ${name}: ${existingItem.qty}`);
      } else {
        cart.push({
          name,
          price,
          img,
          qty: 1
        });
        console.log(`Added new item to cart: ${name}`);
      }

      // Show toast
      showCartNotification(`${name} added to cart!`);

      // Save cart & update display if on cart page
      saveCartToLocalStorage();
      updateCartDisplay();
    });
  });
}

/** Initialize Cart (called from initializeCart) */
function initializeCart() {
  loadCartFromLocalStorage();
  setupAddToCartHandlers();
}

/*******************************************************
 * 4) Helper Functions (to be used by page-specific JS)
 ******************************************************/

/**
 * Common function to display all products in a container.
 * @param {Array} products - Array of product objects.
 * @param {string} containerId - The ID of the container to inject products into.
 */
function displayProducts(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container with ID "${containerId}" not found.`);
    return;
  }

  // Build all product HTML first to minimize DOM reflows
  let productsHTML = '';
  products.forEach(product => {
    productsHTML += generateProductHTML(product);
  });

  container.innerHTML = productsHTML;

  // Re-bind Add to Cart handlers for newly added products
  setupAddToCartHandlers();
}

/**
 * Updates the cart display on cart.html.
 * This function is referenced in cart.js and should be globally accessible.
 */
function updateCartDisplay() {
  // Ensure cart.js is loaded after global.js
  if (typeof window.updateCartDisplay === 'function') {
    window.updateCartDisplay();
  } else {
    console.warn('updateCartDisplay function is not defined.');
  }
}
