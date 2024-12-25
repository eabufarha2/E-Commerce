/*******************************************************
 * GLOBAL.JS
 * - Loads header & footer partials
 * - Contains shared cart functionality
 *******************************************************/

/** Global configuration variables */
const DISCOUNT_RATE = 0.7; // 70% discount
const SHIPPING_COST = 5;   // Flat shipping cost

/**
 * Applies the global discount to a given price
 * @param {number} price - original product price
 * @returns {number} - discounted price
 */
function applyDiscount(price) {
  return price * (1 - DISCOUNT_RATE);
}

document.addEventListener('DOMContentLoaded', () => {
  // Only load cart from localStorage; don't bind .cart here
  initializeCart();
});

/**
 * Initialize the cart array from localStorage
 */
function initializeCart() {
  loadCartFromLocalStorage();
}

/*******************************************************
 * 1) Dynamically load header & footer
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

// Insert header partial
fetch('partials/header.html')
  .then(res => res.text())
  .then(data => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      headerPlaceholder.innerHTML = data;
      setupMobileMenu();
      console.log('Header loaded successfully.');
    }
  })
  .catch(error => {
    console.error('Error loading header:', error);
  });

// Insert footer partial
fetch('partials/footer.html')
  .then(res => res.text())
  .then(data => {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = data;
      console.log('Footer loaded successfully.');
    }
  })
  .catch(error => {
    console.error('Error loading footer:', error);
  });

/*******************************************************
 * 2) CART FUNCTIONALITY (shared across pages)
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

/**
 * Generates HTML for a single product, including data-* attributes.
 * Adds links to the product detail page via ?id=PRODUCT_ID.
 * Also sets a fallback for broken/missing images.
 */
function generateProductHTML(product) {
  const discountedPrice = applyDiscount(product.price);
  const formattedOriginalPrice = `₹${product.price.toFixed(2)}`;
  const formattedDiscountedPrice = `₹${discountedPrice.toFixed(2)}`;
  const discountPercentage = `${(DISCOUNT_RATE * 100).toFixed(0)}% OFF`;

  // If image is missing or fails, fallback to placeholder.com
  const fallbackImg = "https://via.placeholder.com/300?text=No+Image";

  return `
    <div class="pro"
         data-id="${product.id}"
         data-name="${product.name}"
         data-price="${discountedPrice}"
         data-img="${product.image}"
         data-brand="${product.brand}">
      
      <!-- Clickable product image linking to detail page -->
      <a href="product-detail.html?id=${product.id}">
        <img src="${product.image}" 
             alt="${product.name}" 
             class="product-image"
             onerror="this.onerror=null;this.src='${fallbackImg}';" />
      </a>
      
      <div class="discount-badge">${discountPercentage}</div>
      <div class="des">
        <span>${product.brand}</span>
        <!-- Product Name clickable too -->
        <h5>
          <a href="product-detail.html?id=${product.id}">${product.name}</a>
        </h5>
        <div class="star">
          ${generateStarsHTML(product.rating)}
        </div>
        <h4>
          <span class="original-price">${formattedOriginalPrice}</span>
          <span class="discounted-price">${formattedDiscountedPrice}</span>
        </h4>
      </div>
      <a href="#" class="cart">
        <!-- Unified cart icon -->
        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
      </a>
    </div>
  `;
}

/**
 * Inserts product HTML into a container, but does NOT bind events automatically.
 * @param {Array} products - Array of product objects
 * @param {string} containerId - The ID of the container to inject products into
 */
function displayProducts(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container with ID "${containerId}" not found.`);
    return;
  }

  let productsHTML = '';
  products.forEach(product => {
    productsHTML += generateProductHTML(product);
  });
  container.innerHTML = productsHTML;
}

/**
 * Binds a single click event to each .cart button in the DOM,
 * ensuring no double-binding occurs.
 */
function setupAddToCartHandlers() {
  const cartButtons = document.querySelectorAll('.cart');
  console.log(`Binding .cart handlers to ${cartButtons.length} buttons.`);

  cartButtons.forEach(btn => {
    // Remove any existing listener by cloning the node
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let productDiv = e.target.closest('.pro');
      if (!productDiv) {
        // fallback if single-pro page
        productDiv = e.target.closest('.single-pro-image');
      }
      if (!productDiv) {
        console.warn('No product container found on Add to Cart click.');
        return;
      }

      // Read data from attributes
      const name = productDiv.getAttribute('data-name');
      const price = parseFloat(productDiv.getAttribute('data-price')) || 0;
      const img = productDiv.getAttribute('data-img');

      console.log(`Adding to cart: ${name}, Price: ${price}`);

      // Check if product is already in cart
      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.qty += 1;
        console.log(`Increased quantity for ${name}: ${existingItem.qty}`);
      } else {
        cart.push({ name, price, img, qty: 1 });
        console.log(`Added new item to cart: ${name}`);
      }

      showCartNotification(`${name} added to cart!`);
      saveCartToLocalStorage();

      // If we're on cart page, update it
      if (typeof updateCartDisplay === 'function') {
        updateCartDisplay();
      }
    });
  });
}
