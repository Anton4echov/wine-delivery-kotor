//const foodItems = [];
const foodItems = [
  { name: 'Vranac Prodor', 
    price: 30, 
    quantity: 0, 
    type: 'red',  
    photo: 'https://cdn.glitch.global/cbe7a86a-c58a-4a44-912e-7c23b197bdaa/WhatsApp%20Image%202025-06-13%20at%2000.03.28.jpeg?v=1749733380251', 
    description: "Wine Vranac Prodor" },
  { name: 'Dorian', 
    price: 30, 
    quantity: 0,
    type: 'red',
    photo: 'https://cdn.glitch.global/cbe7a86a-c58a-4a44-912e-7c23b197bdaa/WhatsApp%20Image%202025-06-13%20at%2000.03.28%20(1).jpeg?v=1749733396159', 
    description: "Wine Dorian" },
  { name: 'Barut', 
    price: 60, 
    quantity: 0,
    type: 'red',
    photo: 'https://cdn.glitch.global/cbe7a86a-c58a-4a44-912e-7c23b197bdaa/WhatsApp%20Image%202025-06-13%20at%2000.03.28%20(2).jpeg?v=1749733407823', 
    description: "Wine Barut" },
  { name: 'Chardonnay', 
    price: 24, 
    quantity: 0, 
    type: 'white',  
    photo: 'https://cdn.glitch.global/cbe7a86a-c58a-4a44-912e-7c23b197bdaa/WhatsApp%20Image%202025-06-13%20at%2000.45.18.jpeg?v=1749735854496', 
    description: "Wine Chardonnay" },
  
];

const WineItems = document.querySelector('.wine-items');

loadSavedItems(); // Load from localStorage after items are printed
loadSavedCustomerDetails();
printItemsFromArray();

const quantityElements = document.querySelectorAll('.wine-item p span');
const addButtons = document.querySelectorAll('.add');
const removeButtons = document.querySelectorAll('.remove');
const cartTotalElement = document.querySelector('#total');
const payButton = document.querySelector('#pay-btn');
const clearOrderButton = document.querySelector('#clear-order-btn'); // Add a Clear Order button


function updateTotal() {
  let total = 0;
  let quantities = [];
  const selectedItems = [];

  foodItems.forEach(item => {
    total += item.price * item.quantity;
    if (item.quantity > 0) {
      quantities.push(`(${item.name} x ${item.quantity})`);
      selectedItems.push({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        description: item.description
      });
    }
  });
  cartTotalElement.textContent = `${total} ` + quantities.join(' | ');
  // Save selected items to localStorage
  localStorage.setItem('selectedWineItems', JSON.stringify(selectedItems));
}


addButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    foodItems[index].quantity++;
    quantityElements[index].textContent = foodItems[index].quantity;
    updateTotal();
  });
});

removeButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    if (foodItems[index].quantity > 0) {
      foodItems[index].quantity--;
      quantityElements[index].textContent = foodItems[index].quantity;
      updateTotal();
    }
  });
});

function printItemsFromArray() {
  let html = '';
  foodItems.forEach((item, index) => {
    const bgColor = item.type === 'red' ? '#ffcccc' 
                  : item.type === 'white' ? '#ffffcc' 
                  : '';
    const wineItemHTML = `
      <div class="wine-item" data-index="${index}" style="${bgColor ? `background-color: ${bgColor};` : ''}">
        <img src="${item.photo}" alt="${item.name}">
        <h2>${item.name}</h2>
        <p style="font-size: 11px;">Quantity: <span id="${item.name.toLowerCase()}-quantity" style="font-size: 18px;">${item.quantity}</span></p>
        <button class="remove" data-food="${item.name.toLowerCase()}">-</button>
        <hr>
        <button class="add" data-food="${item.name.toLowerCase()}">+</button>
        <p style="font-size: 13px;">Price: ${item.price}</p>
      </div>
    `;
    html += wineItemHTML;
  });

  WineItems.innerHTML = html;

  // Add event listener to each wine item for showing description
  document.querySelectorAll('.wine-item').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'button') return;
      const idx = el.getAttribute('data-index');
      showPopup(idx);
    });
  });
}


function showPopup(index) {
  const item = foodItems[index];
  const existingPopup = document.querySelector('.description-popup');

  if (existingPopup && existingPopup.dataset.index == index) {
    existingPopup.remove();
    return;
  }

  if (existingPopup) {
    existingPopup.remove();
  }

  const popup = document.createElement('div');
  popup.className = 'description-popup';
  popup.dataset.index = index;

  const description = document.createElement('p');
  description.textContent = item.description;
  popup.appendChild(description);

  if (item.photo) {
    const img = document.createElement('img');
    img.src = item.photo;
    img.alt = item.name || 'Image';
    img.style.maxWidth = '150px';
    img.style.display = 'block';
    img.style.borderRadius = '8px';
    img.style.marginTop = '8px';
    popup.appendChild(img);
  }

  // Style the popup
  
  popup.style.background = 'white';
  popup.style.border = '1px solid #ccc';
  popup.style.padding = '8px';
  popup.style.borderRadius = '8px';
  popup.style.zIndex = '1000';
  popup.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';

  // Hide popup on click
  popup.addEventListener('click', () => {
    popup.remove();
  });

  document.body.appendChild(popup);

  // Optional: remove popup after 3 seconds automatically
  setTimeout(() => {
    popup.remove();
  }, 3000);
}


function loadSavedItems() {
  const savedItems = JSON.parse(localStorage.getItem('selectedWineItems'));
  if (savedItems && Array.isArray(savedItems)) {
    savedItems.forEach(saved => {
      const match = foodItems.find(item => item.name === saved.name);
      if (match) {
        match.quantity = saved.quantity;
      }
    });
  }
}


clearOrderButton.addEventListener('click', clearOrder);

payButton.addEventListener('click', () => {
  const cartTotal = cartTotalElement.textContent;

  // Get input values
  const name = document.getElementById('name').value.trim();
  const address = document.getElementById('address').value.trim();
  const notes = document.getElementById('notes').value.trim();
  
  // Save these to localStorage
  localStorage.setItem('orderCustomerName', name);
  localStorage.setItem('orderCustomerAddress', address);
  localStorage.setItem('orderCustomerNotes', notes);
  
  // Build the WhatsApp message
  let whatsappMessage = `I'd like to place an order:\n\n🧾 Total: €${cartTotal}`;

  if (name) whatsappMessage += `\n👤 Name: ${name}`;
  if (address) whatsappMessage += `\n🏠 Address: ${address}`;
  if (notes) whatsappMessage += `\n📝 Notes: ${notes}`;

  // Encode and open WhatsApp URL
  const whatsappUrl = `https://wa.me/919529420082?text=${encodeURIComponent(whatsappMessage)}`;
  //const whatsappUrl = `https://wa.me/38268517417?text=${encodeURIComponent(whatsappMessage)}`;
  window.open(whatsappUrl, '_blank');
});


// Function to clear the order when all items are removed
function clearOrder() {
  // Reset quantities
  foodItems.forEach(item => {
    item.quantity = 0;
  });

  quantityElements.forEach(element => {
    element.textContent = '0';
  });

  // Clear localStorage items
  localStorage.removeItem('selectedWineItems');
  localStorage.removeItem('orderCustomerName');
  localStorage.removeItem('orderCustomerAddress');
  localStorage.removeItem('orderCustomerNotes');

  // Clear input fields
  document.getElementById('name').value = '';
  document.getElementById('address').value = '';
  document.getElementById('notes').value = '';

  updateTotal();
}


function loadSavedCustomerDetails() {
  const name = localStorage.getItem('orderCustomerName') || '';
  const address = localStorage.getItem('orderCustomerAddress') || '';
  const notes = localStorage.getItem('orderCustomerNotes') || '';

  document.getElementById('name').value = name;
  document.getElementById('address').value = address;
  document.getElementById('notes').value = notes;
}


updateTotal(); // Refresh UI quantities and total
