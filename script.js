// =============================================
// АЛІҐАТОР — Script 2026
// No external dependencies
// =============================================

/* ---- HEADER SCROLL ---- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  updateFloatCta();
}, { passive: true });

/* ---- MOBILE MENU ---- */
function toggleMenu() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const open   = nav.classList.toggle('open');
  burger.style.opacity = open ? '.7' : '1';
}
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('nav').classList.remove('open');
  });
});

/* ---- FLOAT CTA ---- */
const floatCta = document.getElementById('floatCta');
function updateFloatCta() {
  floatCta.classList.toggle('visible', window.scrollY > 300);
}

/* ---- BOOKING MODAL ---- */
const modal = document.getElementById('bookingModal');

function openBooking(service) {
  // Reset
  document.getElementById('bookingForm').style.display  = 'flex';
  document.getElementById('bookingSuccess').style.display = 'none';

  // Date: today minimum
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('bookDate');
  dateInput.min   = today;
  if (!dateInput.value) dateInput.value = today;

  // Pre-select service
  if (service) {
    document.querySelectorAll('.service-opt').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.value === service);
    });
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeBooking() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function closeBookingOnOverlay(e) {
  if (e.target === modal) closeBooking();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeBooking();
});

/* ---- SERVICE SELECTOR ---- */
function selectService(el) {
  document.querySelectorAll('.service-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
}

/* ---- PEOPLE COUNTER ---- */
function changePeople(delta) {
  const inp = document.getElementById('bookPeople');
  const val = parseInt(inp.value) + delta;
  if (val >= 1 && val <= 20) inp.value = val;
}

/* ---- FORM SUBMIT ---- */
function submitBooking(e) {
  e.preventDefault();

  const name  = document.getElementById('bookName').value.trim();
  const phone = document.getElementById('bookPhone').value.trim();
  const date  = document.getElementById('bookDate').value;
  const time  = document.getElementById('bookTime').value;

  if (!name || !phone || !date || !time) {
    showToast('Будь ласка, заповніть всі обов\'язкові поля', 'error');
    return;
  }
  if (!validatePhone(phone)) {
    showToast('Введіть коректний номер телефону (+380...)', 'error');
    return;
  }

  // Show success screen
  document.getElementById('bookingForm').style.display    = 'none';
  document.getElementById('bookingSuccess').style.display = 'block';
  showToast('Заявку успішно надіслано! ✅', 'success');
}

function validatePhone(phone) {
  return /^(\+380|380|0)\d{9}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/* ---- PRICES TABS ---- */
function showPrices(tab, btn) {
  document.querySelectorAll('.prices__tab').forEach(t => t.classList.remove('active'));
  ['aquapark','fitness','sauna'].forEach(id => {
    const el = document.getElementById('prices-' + id);
    if (el) el.style.display = (id === tab) ? 'grid' : 'none';
  });
  if (btn) btn.classList.add('active');
}

/* ---- TOAST ---- */
function showToast(msg, type = 'info') {
  const old = document.getElementById('__toast');
  if (old) old.remove();

  const t = document.createElement('div');
  t.id = '__toast';
  t.textContent = msg;
  Object.assign(t.style, {
    position:   'fixed', bottom: '100px', left: '50%',
    transform:  'translateX(-50%) translateY(20px)',
    background: type === 'success' ? '#1a9b3c' : type === 'error' ? '#ef4444' : '#1f2937',
    color:      '#fff', padding: '14px 28px', borderRadius: '50px',
    fontSize:   '.95rem', fontWeight: '600',
    boxShadow:  '0 8px 32px rgba(0,0,0,.25)', zIndex: '3000',
    transition: 'all .35s ease', opacity: '0', whiteSpace: 'nowrap',
    fontFamily: 'inherit'
  });
  document.body.appendChild(t);
  requestAnimationFrame(() => {
    t.style.opacity   = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    t.style.opacity   = '0';
    t.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => t.remove(), 350);
  }, 3500);
}

/* ---- SCROLL ANIMATIONS ---- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll(
  '.service-card, .price-card, .contact-block, ' +
  '.detail-section__content, .detail-section__visual, ' +
  '.schedule__booking, .hero__stat'
).forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = (i * 0.04) + 's';
  io.observe(el);
});

/* ---- ACTIVE NAV ON SCROLL ---- */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 110) current = s.id;
  });
  document.querySelectorAll('.nav__link').forEach(link => {
    link.classList.toggle('active-link', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });

/* ---- INIT ---- */
updateFloatCta();
