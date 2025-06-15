/* ───── бургер-меню ───── */
const menuBtn = document.querySelector('#menu-btn');
const navbar  = document.querySelector('.navbar');

menuBtn.onclick = () => {
  menuBtn.classList.toggle('fa-times');
  navbar.classList.toggle('active');
};

/* ───── форма входа ───── */
const loginBtn   = document.querySelector('#login-btn');
const loginForm  = document.querySelector('.login-form-container');
const closeLogin = document.querySelector('#close-login-form');

loginBtn?.addEventListener('click', () => loginForm.classList.toggle('active'));
closeLogin?.addEventListener('click', () => loginForm.classList.remove('active'));

/* ───── фиксированная шапка при скролле ───── */
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  menuBtn.classList.remove('fa-times');
  navbar.classList.remove('active');
  header.classList.toggle('active', window.scrollY > 0);
});

/* ───── параллакс на секции .home ───── */
const home      = document.querySelector('.home');
const parallaxs = document.querySelectorAll('.home-parallax');

home?.addEventListener('mousemove', e => {
  parallaxs.forEach(el => {
    const speed = el.dataset.speed;
    el.style.transform = `translateX(${(window.innerWidth  - e.pageX * speed) / 90}px)
                          translateY(${(window.innerHeight - e.pageY * speed) / 90}px)`;
  });
});

home?.addEventListener('mouseleave', () => {
  parallaxs.forEach(el => (el.style.transform = 'translateX(0) translateY(0)'));
});

/* ───── Swiper-слайдеры ───── */
const baseOpts = {
  grabCursor: true,
  centeredSlides: true,
  spaceBetween: 20,
  loop: true,
  autoplay: { delay: 9500, disableOnInteraction: false },
  pagination: { el: '.swiper-pagination', clickable: true },
  breakpoints: {
    0:   { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024:{ slidesPerView: 3 }
  }
};

new Swiper('.vehicles-slider', baseOpts);
new Swiper('.featured-slider', baseOpts);
new Swiper('.review-slider',   baseOpts);
