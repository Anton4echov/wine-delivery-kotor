document.getElementById('open-map-btn').addEventListener('click', () => {
  const address = document.getElementById('address').value.trim();
  if (address) {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapUrl, '_blank');
  } else {
    alert('Please enter a delivery address first.');
  }
});
