/*******************************************************
 * CART.JS
 * - Displays cart items
 * - Handles quantity adjustments, item removal
 * - Toggles the cart-total section visibility
 ******************************************************/

document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }
});

/**
 * Renders the cart items onto the cart page (cart.html).
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

  // The totals container
  const totalsSection = document.getElementById('cartTotalSection');

  // Remove any existing table
  const existingTable = cartSection.querySelector('table');
  if (existingTable) {
    existingTable.remove();
  }

  // If cart is empty
  if (cart.length === 0) {
    cartHeader.innerHTML = '<h2>Your Cart is empty</h2>';
    // Hide the entire totals section
    if (totalsSection) {
      totalsSection.style.display = 'none';
    }
    return;
  }

  // If cart is NOT empty, show totals section
  if (totalsSection) {
    totalsSection.style.display = 'block';
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
        <td>
          <a href="product-detail.html?id=${item.id || ''}">
            ${item.name}
          </a>
        </td>
        <td>₪‎${item.price.toFixed(2)}</td>
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

  // Calculate and display totals
  const total = subtotal + SHIPPING_COST;
  document.getElementById('subtotal').textContent = `₪‎${subtotal.toFixed(2)}`;
  document.getElementById('total').textContent = `₪‎${total.toFixed(2)}`;

  // Bind remove / qty events
  const removeBtns = document.querySelectorAll('.removeBtn');
  removeBtns.forEach(btn => btn.addEventListener('click', removeItem));

  const qtyBtns = document.querySelectorAll('.qtyBtn');
  qtyBtns.forEach(btn => btn.addEventListener('click', updateItemQty));
}

/** Removes an item from cart by index */
function removeItem(e) {
  const index = parseInt(e.target.getAttribute('data-index'));
  if (isNaN(index) || index < 0 || index >= cart.length) {
    console.warn('Invalid index for removal:', index);
    return;
  }
  const removedItem = cart.splice(index, 1)[0];
  console.log(`Removed item from cart: ${removedItem.name}`);
  saveCartToLocalStorage();
  updateCartCount();
  updateCartDisplay();
}

/** Adjust item qty by index */
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
      cart.splice(index, 1);
    }
  } else if (action === 'plus') {
    cart[index].qty++;
  } else {
    console.warn('Unknown action for quantity update:', action);
    return;
  }

  saveCartToLocalStorage();
  updateCartCount();
  updateCartDisplay();
}

/**
 * Example handleCheckout function (if you have one)
 */
function handleCheckout() {
  const msgDiv = document.getElementById('checkoutMessage');
  if (!msgDiv) return;

  if (cart.length === 0) {
    msgDiv.style.display = 'block';
    msgDiv.innerHTML = `<p style="color:red;font-size:18px;">
      Your cart is empty. Please add items before checking out.
    </p>`;
    return;
  }
  // Clear cart
  cart = [];
  saveCartToLocalStorage();
  updateCartCount();
  updateCartDisplay();

  msgDiv.style.display = 'block';
  msgDiv.innerHTML = `
    <h2 style="margin-bottom:10px;">Thank You for Your Purchase!</h2>
    <p>Your order is being processed, and your cart is now empty.</p>
  `;
}
