/*******************************************************
 * CART.JS
 * - Displays cart items
 * - Handles quantity adjustments and item removal
 ******************************************************/

/*******************************************************
 * 1) Update cart display on Cart page
 ******************************************************/
document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
});

/**
 * Updates the cart display on cart.html if the user is on that page.
 * Looks for #cartItems and related elements.
 */
function updateCartDisplay() {
  const cartSection = document.getElementById('cartItems');
  if (!cartSection) {
    console.log('Not on cart page. Skipping cart display update.');
    return; // not on cart page
  }

  const cartHeader = cartSection.querySelector('.cart-header');
  if (!cartHeader) {
    console.warn('Cart header element not found.');
    return;
  }

  // Clear existing cart items except the header
  const existingTable = cartSection.querySelector('table');
  if (existingTable) {
    existingTable.remove();
  }

  // If cart is empty
  if (cart.length === 0) {
    cartHeader.innerHTML = '<h2>Your Cart is empty</h2>';
    document.getElementById('subtotal').textContent = '₹0.00';
    document.getElementById('total').textContent = '₹5.00'; // Assuming shipping is ₹5.00
    console.log('Cart is empty. Displayed empty message.');
    return;
  }

  cartHeader.innerHTML = '<h2>Your Cart Items</h2>';
  console.log('Displaying cart items.');

  // Build table
  let html = `
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Name</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
  `;

  let subtotal = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.qty * item.price;
    subtotal += itemTotal;
    html += `
      <tr>
        <td><img src="${item.img}" width="50" alt="${item.name}" /></td>
        <td>${item.name}</td>
        <td>₹${item.price.toFixed(2)}</td>
        <td>
          <button class="qtyBtn" data-index="${index}" data-action="minus">-</button>
          ${item.qty}
          <button class="qtyBtn" data-index="${index}" data-action="plus">+</button>
        </td>
        <td>
          <button class="removeBtn" data-index="${index}">X</button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;

  // Insert into cartItems section
  cartSection.innerHTML += html;

  // Update Subtotal & Total
  document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
  const total = subtotal + 5; // shipping cost
  document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
  console.log(`Subtotal: ₹${subtotal.toFixed(2)}, Total: ₹${total.toFixed(2)}`);

  // Bind remove button events
  const removeBtns = document.querySelectorAll('.removeBtn');
  console.log(`Binding ${removeBtns.length} remove buttons.`);
  removeBtns.forEach(btn => {
    btn.addEventListener('click', removeItem);
  });

  // Bind plus/minus quantity buttons
  const qtyBtns = document.querySelectorAll('.qtyBtn');
  console.log(`Binding ${qtyBtns.length} quantity buttons.`);
  qtyBtns.forEach(btn => {
    btn.addEventListener('click', updateItemQty);
  });
}

/** Removes an item from cart by index, then updates display. */
function removeItem(e) {
  const index = parseInt(e.target.getAttribute('data-index'));
  if (isNaN(index) || index < 0 || index >= cart.length) {
    console.warn('Invalid index for removal:', index);
    return;
  }
  const removedItem = cart.splice(index, 1)[0];
  console.log(`Removed item from cart: ${removedItem.name}`);
  saveCartToLocalStorage();
  updateCartDisplay();
}

/** Adjusts item qty by index, then updates display. */
function updateItemQty(e) {
  const index = parseInt(e.target.getAttribute('data-index'));
  const action = e.target.getAttribute('data-action');

  if (isNaN(index) || index < 0 || index >= cart.length) {
    console.warn('Invalid index for quantity update:', index);
    return;
  }

  if (action === 'minus') {
    cart[index].qty--;
    if (cart[index].qty <= 0) {
      console.log(`Quantity for ${cart[index].name} reduced to 0. Removing from cart.`);
      cart.splice(index, 1);
    } else {
      console.log(`Decreased quantity for ${cart[index].name} to ${cart[index].qty}`);
    }
  } else if (action === 'plus') {
    cart[index].qty++;
    console.log(`Increased quantity for ${cart[index].name} to ${cart[index].qty}`);
  } else {
    console.warn('Unknown action for quantity update:', action);
    return;
  }

  saveCartToLocalStorage();
  updateCartDisplay();
}
