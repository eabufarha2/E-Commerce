// js/product-detail.js

document.addEventListener('DOMContentLoaded', () => {
  // 1) Parse the 'id' param from the URL
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  
  if (!productId) {
    console.error('No product ID in the URL.');
    return;
  }

  // 2) Fetch the entire product list
  fetch('products.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load products.json');
      return res.json();
    })
    .then(data => {
      // Combine featured, newArrivals, and products
      const allProducts = [
        ...(data.featured || []),
        ...(data.newArrivals || []),
        ...(data.products || [])
      ];

      // 3) Find the product by ID
      const product = allProducts.find(p => p.id === productId);
      if (!product) {
        console.error('Product not found with id:', productId);
        const detailSection = document.getElementById('product-detail');
        if (detailSection) {
          detailSection.innerHTML = '<h2>Product not found!</h2>';
        }
        return;
      }
      
      // 4) Display product details
      displayProductDetail(product);
    })
    .catch(err => {
      console.error('Error fetching product:', err);
    });
});

/**
 * Injects the product details into the DOM
 */
function displayProductDetail(product) {
  const productImgDiv = document.getElementById('product-image');
  const productInfoDiv = document.getElementById('product-info');

  // Use the discount function
  const discountedPrice = applyDiscount(product.price);
  const formattedOriginalPrice = `₹${product.price.toFixed(2)}`;
  const formattedDiscountedPrice = `₹${discountedPrice.toFixed(2)}`;

  // Fallback image
  const fallbackImg = "https://via.placeholder.com/400?text=No+Image";

  // Show product image(s)
  productImgDiv.innerHTML = `
    <img src="${product.image}" 
         alt="${product.name}" 
         class="main-image"
         onerror="this.onerror=null;this.src='${fallbackImg}';" />
  `;

  // Show info (brand, name, rating, price, description)
  productInfoDiv.innerHTML = `
    <h2>${product.name}</h2>
    <h3>Brand: ${product.brand}</h3>
    <div class="star">
      ${generateStarsHTML(product.rating)}
    </div>
    <p class="price">
      <span class="original-price">${formattedOriginalPrice}</span>
      <span class="discounted-price">${formattedDiscountedPrice}</span>
    </p>
    <p class="description">
      <strong>Description:</strong> 
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      (Replace with real product description as needed.)
    </p>

    <!-- A single Add to Cart button for this product -->
    <button class="normal cart"
      data-name="${product.name}"
      data-price="${discountedPrice}"
      data-img="${product.image}">
      <i class="fa fa-shopping-cart"></i> Add to Cart
    </button>
  `;

  // Bind the "Add to Cart" event
  setupAddToCartHandlers();
}