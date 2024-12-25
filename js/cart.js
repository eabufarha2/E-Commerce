/*******************************************************
 * CART.JS
 * - Displays cart items
 * - Handles quantity adjustments and item removal
 ******************************************************/

document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
});

/**
 * Updates the cart display on cart.html if the user is on that page.
 */
function updateCartDisplay() {
  const cartSection = document.getElementById('cartItems');
  if (!cartSection) {
    console.log('Not on cart page. Skipping cart display update.');
    return;
  }

  const cartHeader = cartSection.querySelector('.cart-header');
  if (!cartHeader) {
    console.warn('Cart header element not found.');
    return;
  }

  // Clear existing cart table (except the header)
  const existingTable = cartSection.querySelector('table');
  if (existingTable) {
    existingTable.remove();
  }

  // If cart is empty
  if (cart.length === 0) {
    cartHeader.innerHTML = '<h2>Your Cart is empty</h2>';
    document.getElementById('subtotal').textContent = '₹0.00';
    document.getElementById('total').textContent = `₹${SHIPPING_COST.toFixed(2)}`;
    return;
  }

  cartHeader.innerHTML = '<h2>Your Cart Items</h2>';
  console.log('Displaying cart items.');

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

  // Fallback image
  const fallbackImg = "https://via.placeholder.com/50?text=No+Image";

  let subtotal = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.qty * item.price;
    subtotal += itemTotal;

    html += `
      <tr>
        <td>
          <img src="${item.img}" 
               width="50" 
               alt="${item.name}" 
               onerror="this.onerror=null;this.src='${fallbackImg}';" />
        </td>
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
  cartSection.innerHTML += html;

  // Update Subtotal & Total
  document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
  const total = subtotal + SHIPPING_COST;
  document.getElementById('total').textContent = `₹${total.toFixed(2)}`;

  // Bind remove button events
  const removeBtns = document.querySelectorAll('.removeBtn');
  removeBtns.forEach(btn => {
    btn.addEventListener('click', removeItem);
  });

  // Bind plus/minus quantity buttons
  const qtyBtns = document.querySelectorAll('.qtyBtn');
  qtyBtns.forEach(btn => {
    btn.addEventListener('click', updateItemQty);
  });
}

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
      console.log(`Quantity for ${cart[index].name} is 0. Removing from cart.`);
      cart.splice(index, 1);
    }
  } else if (action === 'plus') {
    cart[index].qty++;
  } else {
    console.warn('Unknown action for quantity update:', action);
    return;
  }

  saveCartToLocalStorage();
  updateCartDisplay();
}
