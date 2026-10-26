/**
 * Haven Interiors - Projects & Lightbox Gallery Module
 * Handles category filtering and full-screen lightbox navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioGallery();
});

function initPortfolioGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxMeta = document.getElementById('lightboxMeta');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentCategory = 'all';
  let activeVisibleItems = [...galleryItems];
  let currentActiveIndex = 0;

  /* --- 1. Category Filtering --- */
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button style
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter') || 'all';
        currentCategory = filterValue;

        // Filter items
        activeVisibleItems = [];
        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.classList.remove('hidden');
            item.style.display = '';
            activeVisibleItems.push(item);
          } else {
            item.classList.add('hidden');
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* --- 2. Lightbox Logic --- */
  function openLightbox(item) {
    if (!lightboxModal) return;

    // Determine index within currently visible items
    currentActiveIndex = activeVisibleItems.indexOf(item);
    if (currentActiveIndex === -1) {
      currentActiveIndex = 0;
    }

    updateLightboxContent();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    if (activeVisibleItems.length === 0) return;
    const item = activeVisibleItems[currentActiveIndex];
    if (!item) return;

    const imgSrc = item.getAttribute('data-full-img') || item.querySelector('img').getAttribute('src');
    const title = item.getAttribute('data-title') || item.querySelector('h4')?.textContent || 'Haven Interior Design';
    const location = item.getAttribute('data-location') || 'Pune, India';
    const specs = item.getAttribute('data-specs') || 'Contemporary Luxury';
    const category = item.getAttribute('data-category-label') || 'Interior';

    if (lightboxImg) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = title;
    }
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxMeta) lightboxMeta.textContent = `${location} • ${category} • ${specs}`;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentActiveIndex + 1} / ${activeVisibleItems.length}`;
    }
  }

  function nextImage() {
    if (activeVisibleItems.length === 0) return;
    currentActiveIndex = (currentActiveIndex + 1) % activeVisibleItems.length;
    updateLightboxContent();
  }

  function prevImage() {
    if (activeVisibleItems.length === 0) return;
    currentActiveIndex = (currentActiveIndex - 1 + activeVisibleItems.length) % activeVisibleItems.length;
    updateLightboxContent();
  }

  // Attach click listener to gallery items
  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(item);
    });
  });

  // Controls
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  // Close on outside backdrop click
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-wrapper')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  });

  // Touch Swipe for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        nextImage(); // Swiped left -> next
      } else {
        prevImage(); // Swiped right -> prev
      }
    }
  }
}
