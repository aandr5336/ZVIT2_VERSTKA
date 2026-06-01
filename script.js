document.addEventListener('DOMContentLoaded', () => {

  new Splide('#splide-reviews', {
    type: 'loop',
    perPage: 1,
    perMove: 1,
    gap: '1.5rem',
    pagination: true,
    arrows: true,
    autoplay: true,
    interval: 5000,
    pauseOnHover: true
  }).mount();

  const header = document.querySelector('#header');
  const goTop = document.querySelector('#go-top');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
    goTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8);
  }, { passive: true });

  goTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const html = document.documentElement;
  const themeBtn = document.querySelector('#theme-btn');
  const themeIcon = themeBtn.querySelector('i');
  const savedTheme = localStorage.getItem('eduflex-theme') || 'light';

  html.setAttribute('data-theme', savedTheme);
  if (themeIcon) {
    themeIcon.className = savedTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    if (themeIcon) {
      themeIcon.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    localStorage.setItem('eduflex-theme', next);
  });

  const burger = document.querySelector('#burger');
  const mobileMenu = document.querySelector('#mobile-menu');
  const overlay = document.querySelector('#overlay');
  const menuClose = document.querySelector('#menu-close');

  const openMobileMenu = () => {
    mobileMenu.classList.add('open');
    overlay.classList.add('visible');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('lock-scroll');
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('visible');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('lock-scroll');
  };

  burger.addEventListener('click', openMobileMenu);
  menuClose.addEventListener('click', closeMobileMenu);
  overlay.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  const modalOverlay = document.querySelector('#modal-overlay');
  const modalBody = document.querySelector('#modal-body');
  const formSuccess = document.querySelector('#form-success');
  const modalCloseBtn = document.querySelector('#modal-close-btn');
  const successCloseBtn = document.querySelector('#success-close-btn');

  const openModal = () => {
    modalOverlay.classList.add('open');
    document.body.classList.add('lock-scroll');
  };

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.classList.remove('lock-scroll');
    setTimeout(() => {
      modalBody.classList.remove('hidden');
      formSuccess.classList.remove('show');
    }, 300);
  };

  modalCloseBtn.addEventListener('click', closeModal);
  successCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  const enrollButtons = [
    '#header-enroll-btn',
    '#mobile-enroll-btn',
    '#instructor-enroll-btn',
    '#countdown-cta-btn',
    '#footer-enroll-btn'
  ];
  
  enrollButtons.forEach(selector => {
    const btn = document.querySelector(selector);
    if (btn) btn.addEventListener('click', (e) => {
      if (selector === '#mobile-enroll-btn' || selector === '#footer-enroll-btn') e.preventDefault();
      openModal();
    });
  });

  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = value => !!value.trim().match(emailRegex);

  document.querySelector('#enroll-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const nameInput = document.querySelector('#m-name');
    const emailInput = document.querySelector('#m-email');
    const fgName = document.querySelector('#fg-name');
    const fgEmail = document.querySelector('#fg-email');
    const errName = document.querySelector('#err-name');
    const errEmail = document.querySelector('#err-email');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    let valid = true;

    fgName.classList.remove('invalid');
    errName.classList.remove('show');
    fgEmail.classList.remove('invalid');
    errEmail.classList.remove('show');

    if (name.length < 2) {
      fgName.classList.add('invalid');
      errName.classList.add('show');
      valid = false;
    }

    if (!isValidEmail(email)) {
      fgEmail.classList.add('invalid');
      errEmail.textContent = email
        ? 'Введіть коректний email (user@mail.com)'
        : 'Введіть email';
      errEmail.classList.add('show');
      valid = false;
    }

    if (valid) {
      modalBody.classList.add('hidden');
      formSuccess.classList.add('show');
    }
  });

  const prefillAndOpen = (inputId) => {
    const inputField = document.querySelector(`#${inputId}`);
    const value = inputField.value;
    if (!isValidEmail(value)) {
      inputField.classList.add('input-error');
      return;
    }
    inputField.classList.remove('input-error');
    document.querySelector('#m-email').value = value;
    openModal();
  };

  const startButtons = [
    { btnId: 'hero-start-btn', inputId: 'hero-email' },
    { btnId: 'bar-start-btn', inputId: 'bar-email' },
    { btnId: 'footer-start-btn', inputId: 'footer-email' }
  ];

  startButtons.forEach(({ btnId, inputId }) => {
    const btn = document.querySelector(`#${btnId}`);
    if (btn) {
      btn.addEventListener('click', () => prefillAndOpen(inputId));
    }
  });

  const cookieBar = document.querySelector('#cookie-bar');
  const getCookie = (name) => {
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  if (getCookie('eduflex_cookie_accepted') === 'true') {
    cookieBar.classList.add('hidden');
  }

  document.querySelector('#cookie-accept').addEventListener('click', () => {
    document.cookie = "eduflex_cookie_accepted=true; max-age=31536000; path=/; SameSite=Lax";
    cookieBar.classList.add('hidden');
  });

  document.querySelector('#cookie-decline').addEventListener('click', () => {
    cookieBar.classList.add('hidden');
  });

  const updateCountdown = () => {
    const now = new Date();
    const end = new Date(2026, now.getMonth() + 1, 1);
    const diff = end - now;

    if (diff <= 0) {
      ['days', 'hours', 'mins', 'secs'].forEach(k => {
        document.querySelector(`#cd-${k}`).textContent = '00';
      });
      return;
    }

    document.querySelector('#cd-days').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
    document.querySelector('#cd-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    document.querySelector('#cd-mins').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.querySelector('#cd-secs').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

});