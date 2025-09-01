/* scripts.js
   Scripts separados:
   - control de menú responsive
   - reveal animations con IntersectionObserver
   - lightbox simple para galería
   - animaciones ligeras en imágenes (parallax y floating)
   - form submit demo (no envía, solo feedback)
*/

/* ===== UTILIDADES ===== */
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));

/* ===== MENU RESPONSIVE ===== */
(function navToggle(){
  const toggle = qs('#navToggle');
  const nav = qs('.nav');
  (function navAutoClose(){
  const nav = qs('.nav');
  const toggle = qs('#navToggle');
  const links = qsa('.nav a');

  links.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

  toggle.addEventListener('click', () => {
    // animación hamburguesa
    toggle.classList.toggle('open');
    // mostrar/ocultar nav
    if (nav.classList.contains('open')) {
  nav.classList.remove('open');
  document.body.style.overflow = '';
} else {
  nav.classList.add('open');
  document.body.style.overflow = 'hidden';
}
  });
})();

/* ===== REVEAL ON SCROLL ===== */
(function revealOnScroll(){
  const items = qsa('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        // optional stagger by child
        entry.target.querySelectorAll && entry.target.querySelectorAll('.reveal-child')?.forEach((el, idx) => {
          el.style.transitionDelay = `${idx * 80}ms`;
        });
        io.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});

  items.forEach(i => io.observe(i));
})();

/* ===== GALLERY LIGHTBOX ===== */
(function galleryLightbox(){
  const gallery = qs('#gallery');
  const lightbox = qs('#lightbox');
  const lightboxImg = qs('#lightboxImg');
  const lightboxCaption = qs('#lightboxCaption');
  const closeBtn = qs('#lightboxClose');

  if (!gallery) return;
  gallery.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.matches('.gallery-item')) {
      lightbox.style.display = 'flex';
      lightbox.setAttribute('aria-hidden', 'false');
      lightboxImg.src = target.src;
      lightboxCaption.textContent = target.alt || '';
    }
  });

  const close = () => {
    lightbox.style.display = 'none';
    lightbox.setAttribute('aria-hidden', 'true');
  };
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

/* ===== IMAGE FLOAT RANDOMIZER (gives life to many imgs) ===== */
(function imageFloaters(){
  const imgs = qsa('.media-img, .team-card img, .menu-img, .card img, .decor-card img, .gallery-item, .hero-deco, .img-card img');
  imgs.forEach((img, i) => {
    // small random translate and rotate animation via CSS variables
    const dur = 6 + (i % 5);
    img.style.transition = 'transform .9s ease, filter .4s';
    img.style.willChange = 'transform';
    // subtle periodic animation using JS (different phase per image)
    setInterval(() => {
      img.style.transform = `translateY(${(i % 3) * 1.8 - 1.2}px) rotate(${(i % 2) ? 0.2 : -0.2}deg) scale(1.001)`;
      setTimeout(()=> img.style.transform = 'translateY(0) rotate(0) scale(1)', dur*110);
    }, dur * 700 + (i * 132));
  });
})();

/* ===== PARALLAX HERO (mouse move) ===== */
(function heroParallax(){
  const hero = qs('.hero');
  if (!hero) return;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    qsa('.img-float, .img-card img').forEach((el, idx) => {
      const movement = (idx % 2 === 0) ? 12 : 6;
      el.style.transform = `translate(${x * movement}px, ${y * movement}px)`;
    });
  });
  hero.addEventListener('mouseleave', () => {
    qsa('.img-float, .img-card img').forEach(el => el.style.transform = '');
  });
})();

/* ===== Form demo (no server) ===== */
(function contactForm(){
  const form = qs('#contactForm');
  if (!form) return;
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    // Simular envío y mostrar feedback (puedes integrar con API real)
    setTimeout(()=> {
      btn.textContent = 'Solicitud enviada';
      btn.classList.add('sent');
      setTimeout(()=> {
        btn.disabled = false;
        btn.textContent = original;
      }, 1500);
    }, 1200);
  });
})();

/* ===== Set current year in footer ===== */
(function footerYear(){
  const el = qs('#currentYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ===== Prevent accidental horizontal overflow from large images (extra safe) ===== */
(function fixOverflow(){
  const imgs = qsa('img');
  imgs.forEach(i => i.addEventListener('load', () => {
    if (i.naturalWidth > document.documentElement.clientWidth * 1.2) {
      i.style.maxWidth = '100%';
      i.style.height = 'auto';
    }
  }));
})();


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    const whatsappNumber = "51946026824"; // sin + ni espacios

    // Construimos el mensaje limpio
    const rawMessage = `Hola, soy *${name}* 
Correo: ${email}
Teléfono: ${phone}
Mensaje: ${message}
Quisiera solicitar información/cotización.`;

    // Codificamos TODO
    const encodedMessage = encodeURIComponent(rawMessage);

    // URL final
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Abrir chat
    window.open(url, "_blank");

    // Resetear formulario
    form.reset();
  });
});


