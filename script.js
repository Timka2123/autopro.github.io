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

// ======= ГЛОБАЛЬНЫЕ ДАННЫЕ =======
let partsData = [];
let prevPrices = new Map();
const REFRESH_MS = 30000;
const updatedProducts = new Set();
const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

// ======= ФУНКЦИЯ: Первое слово с большой, остальные с маленькой =======
function lowerAfterFirstWord(str) {
  return str
    .replace(/^\S+/, w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .replace(/(\s+)(\S+)/g, (m, space, w) => space + w.toLowerCase());
}

// ======= ЗАГРУЗКА И АВТО-ОБНОВЛЕНИЕ =======
document.addEventListener('DOMContentLoaded', () => {
  loadAndRender();
  setInterval(loadAndRender, REFRESH_MS);
  document.addEventListener('visibilitychange', () => !document.hidden && loadAndRender());
});

function loadAndRender() {
  fetch('export_fixed.json?ts=' + Date.now(), { cache: 'no-store' })
    .then(res => res.json())
    .then(data => {
      partsData = data;
      renderParts(partsData);
      populateFilters();
    })
    .catch(err => {
      document.getElementById('parts-catalog').innerHTML = '<div class="no-results"><i class="fas fa-exclamation-triangle"></i><h3>Ошибка загрузки данных</h3></div>';
      console.error('Ошибка загрузки JSON:', err);
    });
}

// ======= ФИЛЬТРЫ =======
function populateFilters() {
  const categorySelect = document.getElementById('category-select');
  const brandSelect = document.getElementById('brand-select');
  const catValue = categorySelect.value;
  const brValue  = brandSelect.value;
  categorySelect.innerHTML = '<option value="all">Все категории</option>';
  brandSelect.innerHTML = '<option value="all">Все бренды</option>';
  [...new Set(partsData.map(p => p.category))].forEach(cat => {
    categorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
  [...new Set(partsData.map(p => p.brand))].forEach(br => {
    brandSelect.innerHTML += `<option value="${br}">${br}</option>`;
  });
  categorySelect.value = catValue;
  brandSelect.value    = brValue;
}

// ======= ФИЛЬТРАЦИЯ =======
function filterItems() {
  const cat  = document.getElementById('category-select').value;
  const br   = document.getElementById('brand-select').value;
  const stk  = document.getElementById('stock-select').value;
  const sort = document.getElementById('sort-select').value;

  let items = partsData.slice();
  if (cat !== 'all') items = items.filter(p => p.category === cat);
  if (br  !== 'all') items = items.filter(p => p.brand    === br);

  if (stk === 'in-stock')          items = items.filter(p => p.stock > 10);
  else if (stk === 'low-stock')    items = items.filter(p => p.stock > 0 && p.stock <= 10);
  else if (stk === 'out-of-stock') items = items.filter(p => p.stock === 0);

  if (sort !== 'default') {
    const cmp = {
      'price-asc':  (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      'name-asc':   (a, b) => a.name.localeCompare(b.name),
      'name-desc':  (a, b) => b.name.localeCompare(a.name),
    }[sort];
    items.sort(cmp);
  }
  renderParts(items);
}

// ======= РЕНДЕР КАТАЛОГА =======
function renderParts(arr) {
  const box = document.getElementById('parts-catalog');
  if (!arr.length) {
    box.innerHTML = '<div class="no-results"><i class="fas fa-search"></i><h3>Ничего не найдено</h3></div>';
    return;
  }

  box.innerHTML = arr.map(p => {
    let badge = '', stockTxt = '', stockClass = '';
    if (p.stock > 10)      { stockTxt = 'В наличии';        badge = '<span class="badge new">NEW</span>'; stockClass = 'in-stock'; }
    else if (p.stock > 0)  { stockTxt = `Мало (${p.stock})`; badge = '<span class="badge sale">SALE</span>'; stockClass = 'low-stock'; }
    else                   { stockTxt = 'Нет в наличии';    badge = '<span class="badge out">OUT</span>';  stockClass = 'out-of-stock'; }

    const full = Math.floor(p.rating), half = p.rating % 1 >= 0.5;
    let stars = '';
    for (let i = 1; i <= 5; i++)
      stars += i <= full ? '<i class="fas fa-star"></i>' :
        i === full + 1 && half ? '<i class="fas fa-star-half-alt"></i>' : '<i class="far fa-star"></i>';

    let priceClass = '';
    const oldPrice = prevPrices.get(p.id);
    let flag = '';
    if (updatedProducts.has(p.id)) {
      flag = `<span class="price-flag"><i class="fas fa-sync-alt" style="font-size:.95em;"></i> Цена обновлена</span>`;
    }
    if (oldPrice !== undefined && oldPrice !== p.price) {
      priceClass = p.price > oldPrice ? 'price-up' : 'price-down';
      updatedProducts.add(p.id);
      flag = `<span class="price-flag"><i class="fas fa-sync-alt" style="font-size:.95em;"></i> Цена обновлена</span>`;
    }

    return `
      <div class="item" data-id="${p.id}">
        ${badge}
        <div class="brand-logo">${lowerAfterFirstWord(p.brand)}</div>
        <img src="${p.img}" alt="${p.name}">
        <h3>${lowerAfterFirstWord(p.name)}</h3>
        <div class="category" data-category="${p.category}">${lowerAfterFirstWord(p.category)}</div>
        <div class="price ${priceClass}">
          <span class="price-value">${p.price.toLocaleString('ru-RU')}</span> <span>₽</span>
          ${flag}
        </div>
        <button class="btn analysis-btn" data-id="${p.id}" style="margin-top:8px;">Показать анализ спроса</button>
        <div class="analysis-container" id="analysis-${p.id}" style="display:none; margin-top:16px;"></div>
        <div class="toast-hint" id="toast-${p.id}"></div>
        <p>${p.description || ''}</p>
        <div class="stock ${stockClass}">${stockTxt}</div>
        <div class="rating">${stars} <span>${p.rating}</span></div>
      </div>
    `;
  }).join('');

  arr.forEach(p => {
    const itemEl  = document.querySelector(`.item[data-id="${p.id}"]`);
    const priceEl = itemEl?.querySelector('.price');
    const flagEl  = itemEl?.querySelector('.price-flag');
    const toastEl = itemEl?.querySelector('.toast-hint');
    const old = prevPrices.get(p.id);

    if (old !== undefined && old !== p.price) {
      priceEl?.classList.remove('price-up','price-down');
      void priceEl?.offsetWidth;
      if (p.price > old) priceEl?.classList.add('price-up');
      else               priceEl?.classList.add('price-down');
      let delta = Math.abs(p.price - old).toLocaleString('ru-RU');
      let toast = p.price > old
        ? `Цена увеличилась на ${delta} ₽`
        : `Цена снижена на ${delta} ₽`;
      toast = lowerAfterFirstWord(toast);
      toastEl.textContent = toast;
      toastEl.classList.add('show');
      flagEl?.classList.remove('hide');
      setTimeout(() => {
        toastEl.classList.remove('show');
        priceEl?.classList.remove('price-up','price-down');
      }, 1800);
    }
    prevPrices.set(p.id, p.price);
  });

  document.querySelectorAll('.analysis-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = btn.getAttribute('data-id');
      showAnalysis(id);
    });
  });
}

// ======= АНАЛИЗ СПРОСА =======
function showAnalysis(id) {
  const part = partsData.find(p => String(p.id) === String(id));
  const container = document.getElementById('analysis-' + id);
  if (!part || !container) return;

  const sales = Array.isArray(part.sold) && part.sold.length === 12 ? part.sold : Array(12).fill(0);
  const avg = sales.reduce((a,b)=>a+b,0)/sales.length || 1;
  const seasonality = sales.map(x => (x/avg).toFixed(2));
  const nextMonth = (new Date().getMonth() + 1) % 12;
  const forecast = Math.round(avg * seasonality[nextMonth]);

  container.innerHTML = `
    <div style="font-size:1.1em;margin-bottom:0.5em;"><b>Анализ спроса:</b></div>
    <canvas id="chart-${id}" width="440" height="190" style="max-width:100%;display:block"></canvas>
    <div style="margin-top:0.5em;">
      <span>Средний спрос: <b>${avg.toFixed(1)}</b> шт/мес</span><br>
      <span>Сезонный коэффициент (${monthNames[nextMonth]}): <b>${seasonality[nextMonth]}</b></span><br>
      <span>Прогноз на ${monthNames[nextMonth]}: <b>${forecast}</b> шт</span>
    </div>
  `;
  container.style.display = 'block';

  if (container._chart) container._chart.destroy();
  const ctx = document.getElementById(`chart-${id}`).getContext('2d');
  container._chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthNames,
      datasets: [{
        label: 'Продажи, шт.',
        data: sales,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.08)',
        tension: 0.24,
        fill: true,
        pointRadius: 3
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { display: false }},
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Продажи' } },
        x: { title: { display: true, text: 'Месяц' } }
      }
    }
  });
}
