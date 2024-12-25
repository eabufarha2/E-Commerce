/*******************************************************
 * SHOP.JS
 * - Fetches products.json
 * - Displays all products in the Shop section
 ******************************************************/

/*******************************************************
 * 1) Fetch products.json and display all products
 ******************************************************/
document.addEventListener('DOMContentLoaded', () => {
  fetch('products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched products.json successfully for Shop page.');

      // Display All Products in Shop Section
      if (data.products && Array.isArray(data.products)) {
        const shopProductsCount = data.products.length;
        console.log(`Inserting all ${shopProductsCount} shop products.`);
        displayProducts(data.products, 'shop-products');
      } else {
        console.warn('Products data is missing or invalid.');
      }
    })
    .catch(error => {
      console.error('Error fetching products.json for Shop page:', error);
    });
});

