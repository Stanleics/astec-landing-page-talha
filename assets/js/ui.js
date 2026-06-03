/* ============================================================
   Astec — UI Interactions
   Navbar · Mobile menu · FAQ · Scroll reveal · Form · Active nav
   ============================================================ */

// ── Navbar & floating button on scroll ──────────────────────
const navbar      = document.getElementById('navbar');
const floatBtn    = document.getElementById('whatsapp-float');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 20;
  navbar?.classList.toggle('scrolled', scrolled);
  floatBtn?.classList.toggle('visible', window.scrollY > 200);
}, { passive: true });

// ── Mobile menu ──────────────────────────────────────────────
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu    = document.getElementById('mobile-menu');

mobileMenuBtn?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  mobileMenuBtn.setAttribute('aria-expanded', String(open));
  const icon = mobileMenuBtn.querySelector('iconify-icon');
  if (icon) icon.setAttribute('icon', open ? 'solar:close-circle-linear' : 'solar:hamburger-menu-linear');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu?.classList.remove('open');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    const icon = mobileMenuBtn?.querySelector('iconify-icon');
    if (icon) icon.setAttribute('icon', 'solar:hamburger-menu-linear');
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (!navbar?.contains(e.target)) {
    mobileMenu?.classList.remove('open');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
  }
});

// ── Smooth scroll for anchor links ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Scroll reveal (IntersectionObserver) ────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Active nav link on scroll ────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
    }
  });
}, { threshold: 0.25 });

sections.forEach(s => navObserver.observe(s));

// ── FAQ Accordion ────────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const trigger = item.querySelector('.faq-trigger');
  const content = item.querySelector('.faq-content');

  if (!trigger || !content) return;

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(open => {
      open.classList.remove('open');
      open.querySelector('.faq-content')?.classList.remove('open');
      open.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
    });

    // Toggle current
    if (!isOpen) {
      item.classList.add('open');
      content.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });

  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger.click(); }
    if (e.key === 'Escape') {
      item.classList.remove('open');
      content.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
});

// ── Contact Form ─────────────────────────────────────────────
const form = document.getElementById('contact-form');

form?.addEventListener('submit', async e => {
  e.preventDefault();

  const btn         = form.querySelector('button[type="submit"]');
  const originalHTML = btn.innerHTML;

  btn.innerHTML  = '<iconify-icon icon="solar:spinner-bold" width="20" class="animate-spin"></iconify-icon>&nbsp;Enviando…';
  btn.disabled   = true;
  btn.style.opacity = '0.8';

  const data = Object.fromEntries(new FormData(form));

  try {
    // TODO: replace with real endpoint
    const res = await fetch('/api/orcamento', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    if (!res.ok) throw new Error('HTTP error');
    showFormMessage('success');
    form.reset();
  } catch {
    // Fallback: open WhatsApp with the form data
    const msg = encodeURIComponent(
      `Olá! Gostaria de solicitar um orçamento.\n\n` +
      `Nome: ${data.nome || ''}\n` +
      `Empresa: ${data.empresa || ''}\n` +
      `E-mail: ${data.email || ''}\n` +
      `WhatsApp: ${data.whatsapp || ''}\n` +
      `Capacidade: ${data.capacidade || ''}\n` +
      `Aplicação: ${data.aplicacao || ''}`
    );
    window.open(`https://api.whatsapp.com/send?phone=555130513302&text=${msg}`, '_blank');
    showFormMessage('fallback');
  }

  btn.innerHTML = originalHTML;
  btn.disabled  = false;
  btn.style.opacity = '';
});

function showFormMessage(type) {
  const existing = document.getElementById('form-msg');
  existing?.remove();

  const div = document.createElement('div');
  div.id = 'form-msg';
  div.setAttribute('role', 'alert');
  div.setAttribute('aria-live', 'polite');

  if (type === 'success') {
    div.className = 'mt-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm flex items-center gap-2';
    div.innerHTML = '<iconify-icon icon="solar:check-circle-bold" width="20" style="color:#16A34A;flex-shrink:0"></iconify-icon> Solicitação enviada! Nossa equipe entrará em contato em breve.';
  } else {
    div.className = 'mt-4 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-sm flex items-center gap-2';
    div.innerHTML = '<iconify-icon icon="solar:chat-round-bold" width="20" style="color:#004EA2;flex-shrink:0"></iconify-icon> Abrindo WhatsApp com suas informações…';
  }

  form.after(div);
  setTimeout(() => div.remove(), 7000);
}
