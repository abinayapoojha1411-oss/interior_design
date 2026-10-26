/**
 * Haven Interiors - Contact Form Validation & Handler
 * Validates inputs, simulates fast server response, displays success message and reference ID
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  prefillFromUrlParams();
});

function initContactForm() {
  const form = document.getElementById('contactInquiryForm');
  const successBox = document.getElementById('contactSuccessBox');
  const summaryDetails = document.getElementById('inquirySummaryDetails');
  const refNumElement = document.getElementById('inquiryRefNumber');
  const whatsappFollowUpBtn = document.getElementById('whatsappFollowUpBtn');

  if (!form) return;

  // Real-time error removal
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      clearFieldError(input);
    });
    input.addEventListener('change', () => {
      clearFieldError(input);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // 1. Name validation
    const nameInput = form.querySelector('#fullName');
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showFieldError(nameInput, 'Please enter your full name (at least 2 characters).');
      isValid = false;
    } else {
      clearFieldError(nameInput);
    }

    // 2. Phone validation
    const phoneInput = form.querySelector('#phoneNumber');
    const phoneVal = phoneInput.value.trim().replace(/[\s-]/g, '');
    const phoneRegex = /^[+]?[0-9]{10,14}$/;
    if (!phoneVal || !phoneRegex.test(phoneVal)) {
      showFieldError(phoneInput, 'Please enter a valid 10-digit phone number.');
      isValid = false;
    } else {
      clearFieldError(phoneInput);
    }

    // 3. Email validation
    const emailInput = form.querySelector('#emailAddress');
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      showFieldError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }

    // 4. Project Type validation
    const projectTypeSelect = form.querySelector('#projectType');
    if (!projectTypeSelect.value) {
      showFieldError(projectTypeSelect, 'Please select your project type.');
      isValid = false;
    } else {
      clearFieldError(projectTypeSelect);
    }

    if (!isValid) {
      // Scroll to first error
      const firstError = form.querySelector('.form-control.error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // If valid:
    const submitBtn = form.querySelector('#contactSubmitBtn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      Sending Inquiry...
    `;
    submitBtn.disabled = true;

    // Simulate reliable submission
    setTimeout(() => {
      const generatedRef = 'HVN-' + Math.floor(10000 + Math.random() * 90000);
      const budgetVal = form.querySelector('#budgetRange')?.value || 'Not specified';
      const messageVal = form.querySelector('#projectMessage')?.value.trim() || 'No specific requirements noted';

      if (refNumElement) {
        refNumElement.textContent = generatedRef;
      }

      if (summaryDetails) {
        summaryDetails.innerHTML = `
          <div style="text-align: left; background: #FFFFFF; padding: 18px 24px; border-radius: 8px; border: 1px solid #D1FAE5; margin-top: 16px; font-size: 0.9rem;">
            <p><strong>Name:</strong> ${escapeHtml(nameInput.value.trim())}</p>
            <p><strong>Phone:</strong> ${escapeHtml(phoneVal)}</p>
            <p><strong>Email:</strong> ${escapeHtml(emailVal)}</p>
            <p><strong>Project:</strong> ${escapeHtml(projectTypeSelect.options[projectTypeSelect.selectedIndex].text)}</p>
            <p><strong>Estimated Budget:</strong> ${escapeHtml(budgetVal)}</p>
            <p><strong>Inquiry Reference:</strong> <span style="color:#059669; font-weight:700;">${generatedRef}</span></p>
          </div>
        `;
      }

      // Configure WhatsApp follow-up button with pre-filled message
      if (whatsappFollowUpBtn) {
        const waText = encodeURIComponent(
          `Hello Haven Interiors, I just submitted an inquiry (Ref: ${generatedRef}) for ${projectTypeSelect.options[projectTypeSelect.selectedIndex].text}. My name is ${nameInput.value.trim()}.`
        );
        whatsappFollowUpBtn.href = `https://wa.me/919876543216?text=${waText}`;
      }

      // Hide form & display success message
      form.style.display = 'none';
      if (successBox) {
        successBox.classList.add('active');
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }, 800);
  });
}

function showFieldError(input, message) {
  input.classList.add('error');
  const parent = input.closest('.form-group');
  if (parent) {
    let errorEl = parent.querySelector('.error-message');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'error-message active';
      parent.appendChild(errorEl);
    }
    errorEl.textContent = message;
    errorEl.classList.add('active');
  }
}

function clearFieldError(input) {
  input.classList.remove('error');
  const parent = input.closest('.form-group');
  if (parent) {
    const errorEl = parent.querySelector('.error-message');
    if (errorEl) {
      errorEl.classList.remove('active');
      errorEl.textContent = '';
    }
  }
}

function prefillFromUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  if (serviceParam) {
    const projectSelect = document.getElementById('projectType');
    if (projectSelect) {
      for (let i = 0; i < projectSelect.options.length; i++) {
        if (projectSelect.options[i].value.toLowerCase() === serviceParam.toLowerCase() ||
            projectSelect.options[i].text.toLowerCase().includes(serviceParam.toLowerCase())) {
          projectSelect.selectedIndex = i;
          break;
        }
      }
    }
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
