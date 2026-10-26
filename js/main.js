/**
 * Haven Interiors - Main JavaScript
 * Handles Navigation, Mobile Menu, Header Scroll, Modals, and Global Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initBackToTop();
  initConsultationModal();
  initNewsletterForm();
  highlightActiveNavLink();
});

/* --- 1. Sticky Header on Scroll --- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on initial load
}

/* --- 2. Mobile Hamburger Menu Drawer --- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-menu-overlay');

  if (!toggleBtn || !mobileMenu || !overlay) return;

  function openMenu() {
    toggleBtn.classList.add('active');
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    toggleBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Close when clicking any nav link inside mobile menu
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* --- 3. Active Nav Link Detection --- */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- 4. Back To Top Button --- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  }, { passive: true });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --- 5. Global Consultation Modal --- */
function initConsultationModal() {
  const modal = document.querySelector('.consultation-modal');
  const openBtns = document.querySelectorAll('[data-open-modal="consultation"]');
  const closeBtns = document.querySelectorAll('[data-close-modal="consultation"]');
  const form = document.getElementById('modalConsultationForm');
  const successBox = document.getElementById('modalSuccessBox');

  if (!modal) return;

  function openModal(prefillService = '') {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (prefillService && form) {
      const select = form.querySelector('select[name="projectType"]');
      if (select) {
        select.value = prefillService;
      }
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (form) {
      form.reset();
      form.style.display = 'block';
    }
    if (successBox) {
      successBox.classList.remove('active');
      successBox.style.display = 'none';
    }
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openModal(service);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Modal Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();

      if (!name || !phone || !email) {
        alert('Please fill in your name, phone number, and email.');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Submitting Request...';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        if (successBox) {
          successBox.classList.add('active');
          successBox.style.display = 'block';
          const refEl = successBox.querySelector('.inquiry-ref-num');
          if (refEl) {
            refEl.textContent = '#HVN-' + Math.floor(1000 + Math.random() * 9000);
          }
        }
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 700);
    });
  }
}

/* --- 6. Newsletter Subscription --- */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input || !input.value.trim()) return;

    const originalBtn = form.querySelector('button');
    if (originalBtn) {
      originalBtn.textContent = 'Subscribed!';
      originalBtn.style.backgroundColor = 'var(--color-gold)';
      originalBtn.disabled = true;
    }
    input.value = '';
    input.placeholder = 'Thank you for joining our private list!';
  });
}
