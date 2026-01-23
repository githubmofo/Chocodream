// Order success page functionality

const sweetMessages = [
  "Your chocolates are being prepared with extra love and care! 🍫💕",
  "Each chocolate is handcrafted just for you! ✨",
  "Sweet dreams are made of chocolate, and yours are on the way! 🌟",
  "Happiness is a box of chocolates coming your way! 😊",
  "Your taste buds are in for a delightful surprise! 🎁",
  "Made with love, delivered with joy! ❤️",
  "Get ready for a chocolate adventure! 🗺️🍫",
  "Your order is as sweet as you are! 🌸",
  "Pure chocolate bliss is heading your way! 🎊",
  "Your sweet cravings will soon be satisfied! 😋"
];

// Confetti animation
function createConfetti() {
  const confettiContainer = document.getElementById('confettiContainer');
  const colors = ['#FFB300', '#5D4037', '#8D6E63', '#EFEBE9', '#F5F5F0'];

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 3 + 's';
    confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
    confettiContainer.appendChild(confetti);
  }

  // Remove confetti after animation
  setTimeout(() => {
    confettiContainer.innerHTML = '';
  }, 6000);
}

// Display order details
function displayOrderDetails() {
  const orderData = JSON.parse(localStorage.getItem('chocodream_latest_order'));
  if (!orderData) {
    // Redirect if no order data
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('orderNumber').textContent = orderData.orderNumber;
  document.getElementById('orderDate').textContent = orderData.orderDate;
  document.getElementById('orderTotal').textContent = `₹${orderData.totals.total.toFixed(2)}`;
  document.getElementById('deliveryDate').textContent = orderData.deliveryDate;

  const paymentMethods = {
    cod: 'Cash on Delivery',
    upi: 'UPI Payment',
    bank: 'Net Banking',
    card: 'Credit/Debit Card'
  };
  document.getElementById('paymentMethod').textContent = paymentMethods[orderData.paymentMethod] || 'Cash on Delivery';

  const randomMessage = sweetMessages[Math.floor(Math.random() * sweetMessages.length)];
  document.querySelector('#randomMessage p').textContent = randomMessage;
}

// Animate checkmark
function animateCheckmark() {
  const checkmark = document.querySelector('.checkmark');
  checkmark.style.display = 'block';

  setTimeout(() => {
    checkmark.classList.add('animate');
  }, 500);
}

// Social share function
function shareOrder(platform) {
  const orderData = JSON.parse(localStorage.getItem('chocodream_latest_order'));
  const shareText = `🍫 Just ordered delicious chocolates from ChocoDream! Order #${orderData.orderNumber} - Can't wait to indulge! 😍`;

  switch (platform) {
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareText)}`, '_blank');
      break;
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
      break;
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
      break;
  }
}

// Initialize success page,
function initSuccessPage() {
  displayOrderDetails();
  animateCheckmark();
  createConfetti();

  // Clear latest order data after some time to avoid reuse
  setTimeout(() => {
    localStorage.removeItem('chocodream_latest_order');
  }, 30000);
}

// Make shareOrder global so buttons can access it
window.shareOrder = shareOrder;

document.addEventListener('DOMContentLoaded', initSuccessPage);
