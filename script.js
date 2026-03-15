// =========================================
// АЛІҐАТОР — Website Script 2026
// =========================================

/* ---------- HEADER SCROLL ---------- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  updateFloatCta();
});

/* ---------- MOBILE MENU ---------- */
function toggleMenu() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  nav.classList.toggle('open');
  burger.classList.toggle('active');
}

// Close menu on nav link click
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('nav').classList.remove('open');
    document.getElementById('burger').classList.remove('active');
  });
});

/* ---------- FLOAT CTA ---------- */
const floatCta = document.getElementById('floatCta');
function updateFloatCta() {
  if (window.scrollY > 300) {
    floatCta.classList.add('visible');
  } else {
    floatCta.classList.remove('visible');
  }
}

/* ---------- BOOKING MODAL ---------- */
const modal = document.getElementById('bookingModal');

function openBooking(service) {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('bookDate').min = today;
  document.getElementById('bookDate').value = today;
  // Pre-select service if provided
  if (service) {
    const opts = document.querySelectorAll('.service-opt');
    opts.forEach(opt => {
      opt.classList.remove('active');
      if (opt.dataset.value === service) {
        opt.classList.add('active');
      }
    });
  }
  // Reset form view
  document.getElementById('bookingForm').style.display = 'flex';
  document.getElementById('bookingSuccess').style.display = 'none';
}

function closeBooking() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function closeBookingOnOverlay(e) {
  if (e.target === modal) closeBooking();
}

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeBooking();
});

/* ---------- SERVICE SELECTOR ---------- */
function selectService(el) {
  document.querySelectorAll('.service-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
}

/* ---------- PEOPLE COUNTER ---------- */
function changePeople(delta) {
  const input = document.getElementById('bookPeople');
  const val   = parseInt(input.value) + delta;
  if (val >= 1 && val <= 20) input.value = val;
}

/* ---------- FORM SUBMIT ---------- */
function submitBooking(e) {
  e.preventDefault();
  const form    = document.getElementById('bookingForm');
  const success = document.getElementById('bookingSuccess');

  // Basic validation
  const name  = document.getElementById('bookName').value.trim();
  const phone = document.getElementById('bookPhone').value.trim();
  const date  = document.getElementById('bookDate').value;
  const time  = document.getElementById('bookTime').value;

  if (!name || !phone || !date || !time) {
    showToast('Будь ласка, заповніть всі обов'язкові поля', 'error');
    return;
  }
  if (!validatePhone(phone)) {
    showToast('Введіть коректний номер телефону', 'error');
    return;
  }

  const selectedService = document.querySelector('.service-opt.active');
  const serviceNames = {
    aquapark:   'Аквапарк',
    fitness:    'Фітнес центр',
    spa:        'SPA / Сауна',
    hotel:      'Готель',
    restaurant: 'Ресторан'
  };
  const serviceName = selectedService
    ? serviceNames[selectedService.dataset.value] || selectedService.dataset.value
    : 'Не вказано';

  // Show success
  form.style.display = 'none';
  success.style.display = 'block';
  showToast('Заявку успішно надіслано! ✅', 'success');

  console.log('Booking:', { name, phone, date, time, service: serviceName,
    people: document.getElementById('bookPeople').value,
    comment: document.getElementById('bookComment').value });
}

function validatePhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+380|380|0)\d{9}$/.test(cleaned);
}

/* ---------- PRICES TABS ---------- */
function showPrices(tab) {
  document.querySelectorAll('.prices__tab').forEach((t, i) => {
    t.classList.remove('active');
  });
  document.querySelectorAll('.prices__grid').forEach(g => {
    g.style.display = 'none';
  });

  const tabs = document.querySelectorAll('.prices__tab');
  const map  = { aquapark: 0, fitness: 1, sauna: 2 };
  if (tabs[map[tab]]) tabs[map[tab]].classList.add('active');
  const grid = document.getElementById('prices-' + tab);
  if (grid) grid.style.display = 'grid';
}

/* ---------- TOAST NOTIFICATIONS ---------- */
function showToast(message, type = 'info') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.innerHTML = message;
  Object.assign(toast.style, {
    position:       'fixed',
    bottom:         '100px',
    left:           '50%',
    transform:      'translateX(-50%) translateY(20px)',
    background:     type === 'success' ? '#1a9b3c' : type === 'error' ? '#ef4444' : '#1f2937',
    color:          '#fff',
    padding:        '14px 28px',
    borderRadius:   '50px',
    fontSize:       '0.95rem',
    fontWeight:     '600',
    boxShadow:      '0 8px 32px rgba(0,0,0,.25)',
    zIndex:         '3000',
    transition:     'all 0.35s cubic-bezier(.4,0,.2,1)',
    opacity:        '0',
    whiteSpace:     'nowrap',
    fontFamily:     "'Inter', sans-serif"
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

/* ---------- SMOOTH SCROLL HELPER ---------- */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- INTERSECTION OBSERVER (fade-in) ---------- */
const observerOpts = { threshold: 0.1, rootMargin: '0px 0px -60px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

// Add fade-in classes on load
window.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll(
    '.service-card, .price-card, .contact-block, ' +
    '.detail-section__content, .detail-section__visual, ' +
    '.hero__stat, .schedule__booking'
  );
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
    observer.observe(el);
  });
});

// Visible class triggers the animation
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
});

/* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active-link');
    }
  });
});

/* Highlight active nav link */
const style = document.createElement('style');
style.textContent = `
  .nav__link.active-link {
    color: var(--green) !important;
    background: var(--green-light);
  }
`;
document.head.appendChild(style);

/* ---------- INIT ---------- */
updateFloatCta();
