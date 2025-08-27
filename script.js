// --- Data (for services page) ---
const SERVICE_CATEGORIES = [
  {
    title: "Branding and Design",
    items: [
      "Defining brand voice & tone",
      "Logo design",
      "Color palette selection",
      "Typography selection",
      "Brand style guide creation",
      "Stationery & business card design",
      "Packaging design",
      "Marketing collateral design (brochures, flyers, posters)",
      "Rebranding services",
    ],
  },
  {
    title: "Website Building and Design",
    items: [
      "UX (User Experience) design",
      "UI (User Interface) design",
      "Wireframing",
      "Responsive website design (desktop, tablet, mobile)",
      "Custom graphic & icon design",
      "Web accessibility compliance (WCAG)",
      "Interactive elements & animations",
      "Usability testing",
      "Website maintenance & updates",
    ],
  },
];
// Year in footer
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('year').textContent = new Date().getFullYear();
  // Build Home quick list if on home page
  const quickList = document.querySelector('#route-home ul');
  if (quickList) {
    SERVICE_CATEGORIES.forEach(c => {
      const li = document.createElement('li');
      li.className = 'flex items-center gap-2';
      li.innerHTML = '<span class="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500"></span><span>'+c.title+'</span>';
      quickList.appendChild(li);
    });
  }
  // Build Services accordions if on services page
  const servicesGrid = document.getElementById('servicesGrid');
  if (servicesGrid) {
    SERVICE_CATEGORIES.forEach((cat, idx) => {
      const card = document.createElement('div');
      card.className = 'rounded-2xl border border-white/10 bg-white/70 dark:bg-zinc-900/60 glass p-6 shadow-soft';
      const id = 'acc-'+idx;
      card.innerHTML = `
        <button class="w-full flex items-center justify-between text-left" aria-expanded="false">
          <span class="text-xl font-bold">${cat.title}</span>
          <svg class="w-5 h-5 transition-transform" data-acc-arrow><use href="#i-arrow"/></svg>
        </button>
        <div id="${id}" class="overflow-hidden transition-[max-height,opacity] duration-300" style="max-height:0; opacity:0">
          <ul class="mt-4 space-y-2 text-zinc-700 dark:text-zinc-300">
            ${cat.items.map(it => `<li class='flex items-start gap-2'><span class='mt-2 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500'></span><span>${it}</span></li>`).join('')}
          </ul>
        </div>
      `;
      const btn = card.querySelector('button');
      const panel = card.querySelector('#'+id);
      const arrow = card.querySelector('[data-acc-arrow]');
      btn.addEventListener('click', () => {
        const open = panel.style.maxHeight && panel.style.maxHeight !== '0px';
        panel.style.maxHeight = open ? '0' : '1000px';
        panel.style.opacity = open ? '0' : '1';
        arrow.style.transform = open ? 'rotate(0deg)' : 'rotate(90deg)';
        btn.setAttribute('aria-expanded', String(!open));
      });
      servicesGrid.appendChild(card);
    });
};
  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobileBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    const mobileSearch = document.getElementById('mobileSearch');
    if (mobileSearch) {
      mobileSearch.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        openSearch();
      });
    }
  }
  // Search overlay
  const searchData = [
    { label: 'Home', href: 'index.html' },
    { label: 'Services', href: 'services.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Contact', href: 'contact.html' },
    { label: 'Chat (Customized Plan)', href: 'chat.html' },
    // Service items indexed
    ...SERVICE_CATEGORIES.flatMap(cat => [{ label: cat.title, href: 'services.html' }, ...cat.items.map(it => ({ label: `${cat.title} · ${it}`, href: 'services.html' }))])
  ];
  const overlay = (() => {
    const wrap = document.createElement('div');
    wrap.className = 'hidden fixed inset-0 z-50';
    wrap.innerHTML = `
      <div class='absolute inset-0 bg-black/50'></div>
      <div class='relative mx-auto mt-24 w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 shadow-xl ring-1 ring-black/10'>
        <div class='flex items-center gap-3 px-4 py-3 border-b border-black/10'>
          <svg class='w-5 h-5'><use href='#i-search'/></svg>
          <input id='searchInput' class='w-full bg-transparent outline-none' placeholder='Search pages, services, or press / to open…' />
          <button id='closeSearch' class='px-3 py-1 rounded-lg text-sm hover:bg-black/5'>Esc</button>
        </div>
        <div class='max-h-80 overflow-y-auto p-2'>
          <ul id='searchResults' class='divide-y divide-black/5'></ul>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    return wrap;
  })();
  function openSearch() {
    overlay.classList.remove('hidden');
    const input = overlay.querySelector('#searchInput');
    const results = overlay.querySelector('#searchResults');
    input.value = '';
    results.innerHTML = "<li class='px-3 py-6 text-sm text-zinc-600 dark:text-zinc-400'>Start typing to search.</li>";
    input.focus();
    function onInput() {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        results.innerHTML = "<li class='px-3 py-6 text-sm text-zinc-600 dark:text-zinc-400'>Start typing to search.</li>";
        return;
      }
      const found = searchData.filter(r => r.label.toLowerCase().includes(q)).slice(0, 30);
      results.innerHTML = found.map((r, i) => `<li><a href='${r.href}' class='block px-4 py-3 hover:bg-black/5' data-close-search>${r.label}</a></li>`).join('') ||
        "<li class='px-3 py-6 text-sm text-zinc-600 dark:text-zinc-400'>No results.</li>";
    }
    input.addEventListener('input', onInput);
    overlay.addEventListener('click', (e) => {
      if (e.target.id === 'closeSearch' || e.target === overlay.firstElementChild) closeSearch();
      if (e.target.matches('[data-close-search]')) closeSearch();
    }, { once:false });
    function onKey(e){ if (e.key==='Escape'){ closeSearch(); } }
    document.addEventListener('keydown', onKey, { once:true });
  }
  function closeSearch(){ overlay.classList.add('hidden'); }
  const openSearchBtn = document.getElementById('openSearch');
  if (openSearchBtn) {
    openSearchBtn.addEventListener('click', openSearch);
  }
  
  // '/' keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const tag = document.activeElement.tagName.toLowerCase();
      if (tag !== 'input' && tag !== 'textarea') {
        e.preventDefault();
        openSearch();
      }
    }
  });
  // Contact form fake submit
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.classList.add('hidden');
      document.getElementById('contactThanks').classList.remove('hidden');
    });
  }
  // Load Landbot on chat page
  if (document.getElementById('route-chat')) {
    // EXACT SNIPPET (deferred by injection)
    const s1 = document.createElement('script');
    s1.type = 'module';
    s1.setAttribute('SameSite','None; Secure');
    s1.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.mjs';
    const s2 = document.createElement('script');
    s2.type = 'module';
    s2.textContent = `
      var myLandbot = new Landbot.Fullpage({
        configUrl: 'https://storage.googleapis.com/landbot.site/v3/H-3092150-B692X44VC8FDKIEC/index.json',
      });
    `;
    document.body.appendChild(s1);
    document.body.appendChild(s2);
  }
});
