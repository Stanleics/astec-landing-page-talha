/* ============================================================
   Astec — Catálogo de Talhas Elétricas
   Filtros por capacidade, tipo e trole
   ============================================================ */

const WA_BASE = 'https://api.whatsapp.com/send?phone=555130513302&text=';

// Active filter state
const activeFilters = {
  capacity: 'all',
  type:     'all',
  trolley:  'all',
};

function applyFilters() {
  const cards = document.querySelectorAll('.product-card');
  let visible = 0;

  cards.forEach(card => {
    const cap     = card.dataset.capacity;
    const type    = card.dataset.type;
    const trolley = card.dataset.trolley;

    const matchCap     = activeFilters.capacity === 'all' || cap     === activeFilters.capacity;
    const matchType    = activeFilters.type     === 'all' || type    === activeFilters.type;
    const matchTrolley = activeFilters.trolley  === 'all' || trolley === activeFilters.trolley;

    const show = matchCap && matchType && matchTrolley;
    card.classList.toggle('hidden-card', !show);
    if (show) visible++;
  });

  updateCounter(visible);
  updateEmptyState(visible);
}

function updateCounter(count) {
  const el = document.getElementById('filter-count');
  if (!el) return;
  el.textContent = count === 0
    ? 'Nenhum modelo encontrado'
    : `${count} modelo${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
}

function updateEmptyState(count) {
  const el = document.getElementById('catalog-empty');
  if (!el) return;
  el.style.display = count === 0 ? 'flex' : 'none';
}

function resetFilters() {
  activeFilters.capacity = 'all';
  activeFilters.type     = 'all';
  activeFilters.trolley  = 'all';

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === 'all');
  });

  applyFilters();
}

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.filter;
      const value = btn.dataset.value;

      // Deactivate siblings, activate clicked
      document.querySelectorAll(`.filter-btn[data-filter="${group}"]`).forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      activeFilters[group] = value;
      applyFilters();
    });
  });

  // Initial state
  applyFilters();

  // Trigger entrance animations for visible cards
  requestAnimationFrame(() => {
    document.querySelectorAll('.product-card').forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 60);
    });
  });
}

// Reset button (inside empty state)
document.addEventListener('click', e => {
  if (e.target.id === 'reset-filters-btn') resetFilters();
});

document.addEventListener('DOMContentLoaded', initFilters);
