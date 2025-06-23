document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('wineItems');

  function scrollTwoItems() {
    const itemWidth = 150;
    const gap = 16;
    const scrollDistance = (itemWidth * 2) ;

    // Scroll forward
    container.scrollBy({
      left: scrollDistance,
      behavior: 'smooth'
    });

    // Then scroll back after 1 second
    setTimeout(() => {
      container.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
      });
    }, 2000); // Delay in milliseconds
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        scrollTwoItems();
        observer.unobserve(container); // run only once
      }
    });
  }, { threshold: 0 });

  // Check if already visible on load
  const rect = container.getBoundingClientRect();
  const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

  if (isVisible) {
    scrollTwoItems();
  } else {
    observer.observe(container);
  }
});
