const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    toggle.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    toggle.textContent = '☰';
  }));
}
document.getElementById('year').textContent = new Date().getFullYear();


// Conteúdo editável pelo painel Pages CMS (content/site.json).
fetch('content/site.json', { cache: 'no-cache' })
  .then(response => { if (!response.ok) throw new Error('Conteúdo não encontrado'); return response.json(); })
  .then(data => {
    document.querySelectorAll('[data-cms]').forEach(el => {
      const key = el.getAttribute('data-cms');
      if (Object.prototype.hasOwnProperty.call(data, key)) el.textContent = data[key];
    });
    const meta = document.querySelector('[data-cms-meta="seoDescription"]');
    if (meta && data.seoDescription) meta.setAttribute('content', data.seoDescription);
    if (data.seoTitle) document.title = data.seoTitle;
    if (data.heroImage) document.documentElement.style.setProperty('--hero-image', `url("${data.heroImage.replace(/["\\]/g, '')}")`);
    if (data.methodImage) document.documentElement.style.setProperty('--method-image', `url("${data.methodImage.replace(/["\\]/g, '')}")`);
    const wa = 'https://wa.me/' + String(data.whatsappNumber || '5554996362049').replace(/\D/g, '') + '?text=' + encodeURIComponent(data.whatsappMessage || 'Olá! Gostaria de conversar com a Seiva Gestão Financeira.');
    document.querySelectorAll('[data-cms-whatsapp]').forEach(el => el.href = wa);
    document.querySelectorAll('[data-cms-email-link]').forEach(el => el.href = 'mailto:' + (data.email || 'contato@seivafinancas.com'));
    const emailText = document.querySelector('[data-cms="email"]');
    if (emailText && data.email) emailText.textContent = data.email;
    const waDisplay = document.querySelector('[data-cms="whatsappDisplay"]');
    if (waDisplay && data.whatsappNumber) {
      const n = String(data.whatsappNumber).replace(/\D/g, '');
      waDisplay.textContent = n.startsWith('55') && n.length >= 12 ? `+55 ${n.slice(2,4)} ${n.slice(4,9)}-${n.slice(9)}` : '+' + n;
    }
    for (let i = 1; i <= 5; i++) {
      const items = String(data[`service${i}Items`] || '').split('|').map(x => x.trim()).filter(Boolean);
      const card = document.querySelector(`[data-cms="service${i}Title"]`)?.closest('.solution-card');
      if (card) {
        const list = card.querySelector('ul');
        if (list && items.length) list.innerHTML = items.map((item, j) => `<li data-cms="service${i}Item${j+1}"></li>`).join('');
        if (list && items.length) list.querySelectorAll('li').forEach((li, j) => li.textContent = items[j]);
      }
    }
    const note = document.querySelector('[data-cms="service5Note"]');
    if (note && data.service5Note) note.textContent = data.service5Note;
  })
  .catch(() => { /* Se o arquivo de conteúdo não carregar, o conteúdo padrão do HTML permanece visível. */ });
