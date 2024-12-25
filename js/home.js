/*******************************************************
 * HOME.JS
 * - Fetches products.json
 * - Displays 4 Featured Products and 4 New Arrivals
 *******************************************************/

document.addEventListener('DOMContentLoaded', () => {
  fetch('products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched products.json successfully for Home page.');

      // Display 4 Featured Products
      if (data.featured && Array.isArray(data.featured)) {
        const featuredCount = Math.min(4, data.featured.length);
        console.log(`Inserting ${featuredCount} featured products.`);
        const featuredProducts = data.featured.slice(0, 4);
        displayProducts(featuredProducts, 'featured-products');
      } else {
        console.warn('Featured products data is missing or invalid.');
      }

      // Display 4 New Arrivals
      if (data.newArrivals && Array.isArray(data.newArrivals)) {
        const newArrivalsCount = Math.min(4, data.newArrivals.length);
        console.log(`Inserting ${newArrivalsCount} new arrivals.`);
        const newArrivals = data.newArrivals.slice(0, 4);
        displayProducts(newArrivals, 'new-arrivals');
      } else {
        console.warn('New Arrivals data is missing or invalid.');
      }

      // Now that all products are rendered, bind the Add to Cart event
      setupAddToCartHandlers();
    })
    .catch(error => {
      console.error('Error fetching products.json for Home page:', error);
    });
});
