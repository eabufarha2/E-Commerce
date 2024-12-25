/*******************************************************
 * GLOBAL.JS
 * - Dynamically loads header & footer partials
 * - Contains shared cart functionality
 *******************************************************/

/** Global config */
const DISCOUNT_RATE = 0.7; // 70% discount
const SHIPPING_COST = 5;   // Flat shipping cost

/**
 * Applies the global discount to a given price
 * @param {number} price - original product price
 * @returns {number} discounted price
 */
function applyDiscount(price) {
  return price * (1 - DISCOUNT_RATE);
}

/*******************************************************
 * 1) MAIN LOAD SEQUENCE
 ******************************************************/
document.addEventListener('DOMContentLoaded', () => {
  // Load cart from localStorage so cart[] is ready
  loadCartFromLocalStorage();

  // Insert header partial FIRST
  fetch('partials/header.html')
    .then(res => res.text())
    .then(data => {
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = data;
        setupMobileMenu();
        console.log('Header loaded successfully.');

        // Now that #cartCount is in the DOM, we can update it:
        updateCartCount();
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
});

/*******************************************************
 * 2) MOBILE MENU SETUP
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
 * 3) CART ARRAY & STORAGE
 ******************************************************/
let cart = [];

/** Load cart from localStorage */
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

/** Save cart to localStorage */
function saveCartToLocalStorage() {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart saved to localStorage:', cart);
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

/*******************************************************
 * 4) CART NOTIFICATION / CART COUNT
 ******************************************************/
/** Show a small toast when product is added */
function showCartNotification(message) {
  const notif = document.getElementById('cart-notification');
  if (!notif) {
    console.warn('Cart notification element not found.');
    return;
  }
  notif.textContent = message;
  notif.classList.add('show');
  console.log('Cart notification shown:', message);

  setTimeout(() => {
    notif.classList.remove('show');
    console.log('Cart notification hidden.');
  }, 2000);
}

/** Update the cart count in the top header */
function updateCartCount() {
  let totalQty = 0;
  cart.forEach(item => {
    totalQty += item.qty;
  });
  const cartCountElem = document.getElementById('cartCount');
  if (cartCountElem) {
    cartCountElem.textContent = totalQty;
  }
}

/*******************************************************
 * 5) GENERATE PRODUCTS & DISPLAY
 ******************************************************/
/** Generate star icons for rating */
function generateStarsHTML(rating) {
  let stars = '';
  for (let i = 0; i < rating; i++) {
    stars += '<i class="fa fa-star" aria-hidden="true"></i>';
  }
  return stars;
}

/** 
 * Generate HTML for a single product 
 * data-id, data-name, data-price, data-img
 */
function generateProductHTML(product) {
  const discountedPrice = applyDiscount(product.price);
  const formattedOriginalPrice = `₪‎${product.price.toFixed(2)}`;
  const formattedDiscountedPrice = `₪‎${discountedPrice.toFixed(2)}`;
  const discountPercentage = `${(DISCOUNT_RATE * 100).toFixed(0)}% OFF`;

  // fallback if image is missing
  const fallbackImg = "https://via.placeholder.com/300?text=No+Image";

  return `
    <div class="pro"
         data-id="${product.id}"
         data-name="${product.name}"
         data-price="${discountedPrice}"
         data-img="${product.image}"
         data-brand="${product.brand}">
      
      <a href="product-detail.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}"
             onerror="this.onerror=null;this.src='${fallbackImg}';" />
      </a>
      <div class="discount-badge">${discountPercentage}</div>
      <div class="des">
        <span>${product.brand}</span>
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
        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
      </a>
    </div>
  `;
}

/**
 * Insert product HTML into a container
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

/*******************************************************
 * 6) BIND "ADD TO CART" EVENTS 
 ******************************************************/
function setupAddToCartHandlers() {
  const cartButtons = document.querySelectorAll('.cart');
  console.log(`Binding .cart handlers to ${cartButtons.length} buttons.`);

  cartButtons.forEach(btn => {
    // remove old listeners
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', e => {
      e.preventDefault();
      let productDiv = e.target.closest('.pro');
      if (!productDiv) {
        // fallback if single-pro page .single-pro-image
        productDiv = e.target.closest('.single-pro-image');
      }
      if (!productDiv) {
        console.warn('No product container found on Add to Cart click.');
        return;
      }

      const productId = productDiv.getAttribute('data-id');
      const name = productDiv.getAttribute('data-name');
      const price = parseFloat(productDiv.getAttribute('data-price')) || 0;
      const img = productDiv.getAttribute('data-img');

      // see if item is already in cart
      const existingItem = cart.find(item => item.id === productId);
      if (existingItem) {
        existingItem.qty++;
        console.log(`Increased quantity for ${existingItem.name} to ${existingItem.qty}`);
      } else {
        cart.push({ id: productId, name, price, img, qty: 1 });
        console.log(`Added new item to cart: ${name}`);
      }

      // store & update header
      saveCartToLocalStorage();
      updateCartCount();
      showCartNotification(`${name} added to cart!`);

      // if on cart page, refresh it
      if (typeof updateCartDisplay === 'function') {
        updateCartDisplay();
      }
    });
  });
}
