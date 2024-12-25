// js/sproduct.js

document.addEventListener('DOMContentLoaded', () => {
  console.log("Single product page script loaded.");

  const MainImg = document.getElementById("MainImg");
  const smallImgs = document.getElementsByClassName("small-img");
  const productContainer = document.querySelector('.single-pro-image.pro');
  const priceElement = document.getElementById("product-price");

  if (!MainImg || smallImgs.length === 0 || !productContainer || !priceElement) {
    console.warn('Main image, small images, product container, or price element not found.');
    return;
  }

  // Apply Discount to the Product Price
  const originalPrice = parseFloat(productContainer.getAttribute('data-price')) || 0;
  const discountedPrice = originalPrice * (1 - DISCOUNT_RATE);
  const formattedOriginalPrice = `₹${originalPrice.toFixed(2)}`;
  const formattedDiscountedPrice = `₹${discountedPrice.toFixed(2)}`;

  priceElement.innerHTML = `
    <span class="original-price">${formattedOriginalPrice}</span>
    <span class="discounted-price">${formattedDiscountedPrice}</span>
  `;

  // Update data-price to discounted price for cart calculations
  productContainer.setAttribute('data-price', discountedPrice);

  // Image Swapping Functionality
  for (let i = 0; i < smallImgs.length; i++) {
    smallImgs[i].addEventListener('click', function () {
      MainImg.src = this.src;
      console.log(`Main image updated to: ${this.src}`);
    });
  }
});
