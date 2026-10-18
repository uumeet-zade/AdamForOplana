/**
 * Adam for Oplana — Campaign Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll detection
  const header = document.getElementById('site-hdr');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.setAttribute('data-scrolled', 'true');
    } else {
      header.setAttribute('data-scrolled', 'false');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Toggle
  const menuOpenBtn = document.getElementById('menu-open');
  const menuCloseBtn = document.getElementById('menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-footer-btns a');

  const openMobileMenu = () => {
    mobileMenu.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  if (menuOpenBtn) menuOpenBtn.addEventListener('click', openMobileMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // 3. Donation Interactive Module
  const donationButtons = document.querySelectorAll('.donation-amt-btn');
  const customInputWrap = document.getElementById('custom-amt-wrap');
  const customInput = document.getElementById('custom-amt-input');
  const impactDesc = document.getElementById('donation-impact-text');
  const donateSubmitBtn = document.getElementById('donate-submit-btn');

  const impactData = {
    '15': '₳15 funds 100 printed voter guides distributed across Oplana neighborhoods.',
    '25': '₳25 sponsors a precinct phone-banking session connecting with 50 local families.',
    '50': '₳50 equips an Oplana grassroots canvass team with clipboards, signs, and campaign materials.',
    '100': '₳100 helps secure hall rentals for neighborhood town halls and civic debates.',
    '250': '₳250 sponsors a district-wide direct mailer to independent and undecided voters.',
    'custom': 'Every single Argent powers our independent, people-backed campaign in Oplana.'
  };

  let selectedAmount = '50';

  const updateDonationState = (amt) => {
    selectedAmount = amt;
    donationButtons.forEach(btn => {
      if (btn.dataset.amount === amt) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    if (amt === 'custom') {
      if (customInputWrap) customInputWrap.classList.add('is-visible');
      if (customInput) customInput.focus();
      if (impactDesc) impactDesc.textContent = impactData['custom'];
      if (donateSubmitBtn) donateSubmitBtn.textContent = `Contribute with Custom Amount →`;
    } else {
      if (customInputWrap) customInputWrap.classList.remove('is-visible');
      if (impactDesc) impactDesc.textContent = impactData[amt] || impactData['custom'];
      if (donateSubmitBtn) donateSubmitBtn.textContent = `Contribute ₳${amt} to Adam for Oplana →`;
    }
  };

  donationButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      updateDonationState(btn.dataset.amount);
    });
  });

  if (customInput) {
    customInput.addEventListener('input', (e) => {
      const val = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = val;
      if (val) {
        donateSubmitBtn.textContent = `Contribute ₳${val} to Adam for Oplana →`;
      } else {
        donateSubmitBtn.textContent = `Contribute Custom Amount →`;
      }
    });
  }

  // Initialize donation button text
  updateDonationState('50');

  // Handle mock donation submission
  if (donateSubmitBtn) {
    donateSubmitBtn.addEventListener('click', () => {
      const amtVal = selectedAmount === 'custom' ? (customInput.value || '50') : selectedAmount;
      openVolunteerModal(`Thank you for pledging ₳${amtVal}! Complete your details below to confirm your grassroots pledge.`, 'donor');
    });
  }

  // 4. Volunteer & Engagement Modal
  const modal = document.getElementById('volunteer-modal');
  const modalClose = document.getElementById('modal-close');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const volunteerForm = document.getElementById('volunteer-form');
  const formSuccess = document.getElementById('form-success');
  const modalTriggers = document.querySelectorAll('[data-open-modal]');

  const openVolunteerModal = (customMsg = '', role = '') => {
    if (modalSubtitle && customMsg) {
      modalSubtitle.textContent = customMsg;
    } else if (modalSubtitle) {
      modalSubtitle.textContent = 'Join neighbors across Oplana building a community-driven campaign for the Caprican Senate.';
    }

    if (role) {
      const roleCheckbox = document.querySelector(`input[name="interest"][value="${role}"]`);
      if (roleCheckbox) roleCheckbox.checked = true;
    }

    if (formSuccess) formSuccess.style.display = 'none';
    if (volunteerForm) volunteerForm.style.display = 'block';

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeVolunteerModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const role = trigger.dataset.openModal || '';
      openVolunteerModal('', role);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeVolunteerModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeVolunteerModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeVolunteerModal();
    }
  });

  // Handle Form Submission
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      volunteerForm.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';

      setTimeout(() => {
        closeVolunteerModal();
        volunteerForm.reset();
        volunteerForm.style.display = 'block';
        if (formSuccess) formSuccess.style.display = 'none';
      }, 3500);
    });
  }

  // 5. Copy Link / Share Button
  const shareBtn = document.getElementById('btn-share-campaign');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        const originalText = shareBtn.textContent;
        shareBtn.textContent = 'Link Copied to Clipboard! ✓';
        setTimeout(() => {
          shareBtn.textContent = originalText;
        }, 2500);
      }
    });
  }
});
