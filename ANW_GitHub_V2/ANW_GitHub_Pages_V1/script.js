const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const progress = $('.scroll-progress');
const header = $('.site-header');
const heroBg = $('.hero-bg');
const closingBg = $('.closing-bg');

function onScroll(){
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  progress.style.width = `${max ? (h.scrollTop / max) * 100 : 0}%`;

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const y = window.scrollY;
    if (heroBg) heroBg.style.transform = `translate3d(0,${Math.min(y * .12, 70)}px,0) scale(1.05)`;
    if (closingBg) {
      const rect = $('.closing-section')?.getBoundingClientRect();
      if (rect) closingBg.style.transform = `translate3d(0,${rect.top * -.035}px,0) scale(1.07)`;
    }
  }
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('is-visible');
      revealObserver.unobserve(e.target);
    }
  });
},{threshold:.12});
$$('.reveal').forEach(el => revealObserver.observe(el));

const menuBtn = $('.menu-toggle');
const nav = $('.site-nav');
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
$$('.site-nav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded','false');
}));

const navLinks = $$('.site-nav a');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    }
  });
},{rootMargin:'-40% 0px -52% 0px'});
$$('main section[id]').forEach(section => sectionObserver.observe(section));

$$('.ripple-btn').forEach(el => {
  el.addEventListener('click', e => {
    const r = el.getBoundingClientRect();
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.left = `${e.clientX - r.left}px`;
    span.style.top = `${e.clientY - r.top}px`;
    el.append(span);
    setTimeout(() => span.remove(), 700);
  });
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  $$('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) * .08;
      const y = (e.clientY - r.top - r.height/2) * .08;
      el.style.transform = `translate(${x}px,${y}px)`;
    });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });

  $$('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY-r.top)/r.height-.5) * -3.2;
      const ry = ((e.clientX-r.left)/r.width-.5) * 4.5;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      const glow = $('.image-glow', card);
      if(glow){
        glow.style.setProperty('--gx', `${((e.clientX-r.left)/r.width)*100}%`);
        glow.style.setProperty('--gy', `${((e.clientY-r.top)/r.height)*100}%`);
      }
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });

  $$('.interactive-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX-r.left)/r.width)*100}%`);
      card.style.setProperty('--my', `${((e.clientY-r.top)/r.height)*100}%`);
    });
  });
}

const panelData = {
  discover:{
    title:'Discover',
    meta:'Art · Culture · Stories',
    text:'Explore ideas, artists, perspectives and cultural narratives. This pathway can later connect to dedicated stories, exhibitions, artist features and cultural insight.'
  },
  create:{
    title:'Create',
    meta:'Events · Collaborations · Projects',
    text:'Develop programmes, experiences and creative partnerships. This pathway is designed for future events, collaborations, commissions and cross-disciplinary projects.'
  },
  connect:{
    title:'Connect',
    meta:'Community · Social Media · Partnerships',
    text:'Build relationships across artists, audiences, organisations and communities. This pathway links ANW’s public community, social channels and partnership opportunities.'
  }
};
const sidePanel = $('.side-panel');
const backdrop = $('.panel-backdrop');
function openPanel(key){
  const d = panelData[key];
  if(!d) return;
  $('.panel-title').textContent = d.title;
  $('.panel-meta').textContent = d.meta;
  $('.panel-text').textContent = d.text;
  backdrop.hidden = false;
  requestAnimationFrame(() => backdrop.classList.add('show'));
  sidePanel.classList.add('open');
  sidePanel.setAttribute('aria-hidden','false');
  document.body.classList.add('panel-open');
  $('.panel-close').focus();
}
function closePanel(){
  sidePanel.classList.remove('open');
  sidePanel.setAttribute('aria-hidden','true');
  backdrop.classList.remove('show');
  document.body.classList.remove('panel-open');
  setTimeout(() => backdrop.hidden = true, 350);
}
$$('[data-panel]').forEach(btn => btn.addEventListener('click', () => openPanel(btn.dataset.panel)));
$('.panel-close')?.addEventListener('click', closePanel);
$('.panel-action')?.addEventListener('click', closePanel);
backdrop?.addEventListener('click', closePanel);

const projectDialog = $('.project-dialog');
const contactDialog = $('.contact-dialog');
function showDialog(dialog){
  if(!dialog) return;
  dialog.showModal();
  document.body.classList.add('dialog-open');
}
function closeDialog(dialog){
  dialog?.close();
  document.body.classList.remove('dialog-open');
}
$$('[data-project], .project-open, [data-project-all]').forEach(el => el.addEventListener('click', () => showDialog(projectDialog)));
$('[data-contact]')?.addEventListener('click', () => showDialog(contactDialog));
$$('.dialog-close,.dialog-ok').forEach(btn => btn.addEventListener('click', () => closeDialog(btn.closest('dialog'))));
$$('dialog').forEach(d => d.addEventListener('click', e => {
  const r = d.getBoundingClientRect();
  const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  if(!inside) closeDialog(d);
}));

document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    closePanel();
    if(projectDialog?.open) closeDialog(projectDialog);
    if(contactDialog?.open) closeDialog(contactDialog);
  }
});
