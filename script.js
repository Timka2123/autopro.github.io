document.addEventListener('DOMContentLoaded', function() {
  // --- Инициализация Firebase ---
  const firebaseConfig = {
    apiKey: "AIzaSyAjVd0NGBE3_r4Ot9phZ-SzIhWMyEYNfrw",
    authDomain: "autopro-e3161.firebaseapp.com",
    projectId: "autopro-e3161",
    storageBucket: "autopro-e3161.appspot.com",
    messagingSenderId: "274244574652",
    appId: "1:274244574652:web:012f0b403667f98b5c1fb9",
    measurementId: "G-G0FH4XQTCC"
  };
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  // --- Модалка логина ---
  const authModal = document.getElementById('auth-modal');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const closeAuth = document.getElementById('close-auth');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegisterBtn = document.getElementById('show-register-btn');
  const showLoginBtn = document.getElementById('show-login-btn');
  const regMessage = document.getElementById('reg-message');

  loginBtn.onclick = () => {
    authModal.style.display = "block";
    loginForm.style.display = "block";
    registerForm.style.display = "none";
};
closeAuth.onclick = () => {
    authModal.style.display = "none";
    document.getElementById('auth-message').textContent = "";
    regMessage.textContent = "";
};
window.onclick = (e) => { if (e.target === authModal) authModal.style.display = "none"; };

// --- Переключение форм
showRegisterBtn.onclick = () => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    document.getElementById('auth-message').textContent = "";
    regMessage.textContent = "";
};
showLoginBtn.onclick = () => {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    regMessage.textContent = "";
    document.getElementById('auth-message').textContent = "";
};

// --- Логика регистрации с проверкой пароля
document.getElementById('auth-register-btn').onclick = () => {
    const email = document.getElementById('reg-email').value.trim();
    const pass1 = document.getElementById('reg-pass').value;
    const pass2 = document.getElementById('reg-pass2').value;
    if (pass1 !== pass2) {
        regMessage.textContent = "Пароли не совпадают!";
        return;
    }
    auth.createUserWithEmailAndPassword(email, pass1)
        .then(() => location.reload())
        .catch(e => regMessage.textContent = e.message);
};

// --- Логика входа
document.getElementById('auth-login-btn').onclick = () => {
    const email = document.getElementById('auth-email').value.trim();
    const pass = document.getElementById('auth-pass').value;
    auth.signInWithEmailAndPassword(email, pass)
        .then(() => location.reload())
        .catch(e => document.getElementById('auth-message').textContent = e.message);
};

// --- Логика выхода
logoutBtn.onclick = () => {
    auth.signOut().then(() => location.reload());
};

// --- Смена отображения кнопок
auth.onAuthStateChanged(user => {
    if (user) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = '';
        document.getElementById('user-email').textContent = user.email;
    } else {
        loginBtn.style.display = '';
        logoutBtn.style.display = 'none';
        document.getElementById('user-email').textContent = '';
    }
  });

  // Клик вне формы закрывает окно
  window.onclick = function(event) {
    if (event.target === authModal) authModal.style.display = 'none';
  }
});

auth.onAuthStateChanged(user => {
  if (user) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = '';
    userEmail.textContent = user.email;
  } else {
    loginBtn.style.display = '';
    logoutBtn.style.display = 'none';
    userEmail.textContent = '';
  }
});
logoutBtn.onclick = () => auth.signOut();

// Переключение между формами
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
document.getElementById('show-register-btn').onclick = () => {
  loginForm.style.display = "none";
  registerForm.style.display = "block";
  document.getElementById('reg-message').textContent = '';
};
document.getElementById('show-login-btn').onclick = () => {
  registerForm.style.display = "none";
  loginForm.style.display = "block";
  document.getElementById('auth-message').textContent = '';
};

// Кнопка регистрации
document.getElementById('auth-register-btn').onclick = () => {
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-pass').value;
  const pass2 = document.getElementById('reg-pass2').value;
  const regMsg = document.getElementById('reg-message');
  regMsg.textContent = '';

  if (pass.length < 6) {
    regMsg.textContent = 'Пароль должен быть не менее 6 символов';
    return;
  }
  if (pass !== pass2) {
    regMsg.textContent = 'Пароли не совпадают!';
    return;
  }
  auth.createUserWithEmailAndPassword(email, pass)
    .then(() => location.reload())
    .catch(e => regMsg.textContent = e.message);
};

/* --- Бургер-меню --- */
const menuBtn = document.querySelector('#menu-btn');
const navbar  = document.querySelector('.navbar');
menuBtn && (menuBtn.onclick = () => {
  menuBtn.classList.toggle('fa-times');
  navbar.classList.toggle('active');
});



/* --- Фиксированная шапка при скролле --- */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  menuBtn?.classList.remove('fa-times');
  navbar?.classList.remove('active');
  header?.classList.toggle('active', window.scrollY > 0);
});

/* --- Параллакс на секции .home --- */
const home      = document.querySelector('.home');
const parallaxs = document.querySelectorAll('.home-parallax');
home?.addEventListener('mousemove', e => {
  parallaxs.forEach(el => {
    const speed = el.dataset.speed;
    el.style.transform = `translateX(${(window.innerWidth  - e.pageX * speed) / 90}px) translateY(${(window.innerHeight - e.pageY * speed) / 90}px)`;
  });
});
home?.addEventListener('mouseleave', () => {
  parallaxs.forEach(el => (el.style.transform = 'translateX(0) translateY(0)'));
});

/* --- Swiper-слайдеры --- */
const baseOpts = {
  grabCursor: true,
  centeredSlides: true,
  spaceBetween: 20,
  loop: true,
  autoplay: { delay: 9500, disableOnInteraction: false },
  pagination: { el: '.swiper-pagination', clickable: true },
  breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024:{ slidesPerView: 3 } }
};
try {
  if (typeof Swiper !== 'undefined') {
    new Swiper('.vehicles-slider', baseOpts);
    new Swiper('.featured-slider', baseOpts);
    new Swiper('.review-slider',   baseOpts);
  }
} catch(e) {}

// --- Глобальные переменные и хелперы ---
const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const monthNamesGenitive = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
let partsData = [];
let prevPrices = new Map();
const updatedProducts = new Set();
const CLOSE_TIMEOUT = 5000; // 5 секунд

function lowerAfterFirstWord(str) {
  return str
    .replace(/^[^\s]+/, w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .replace(/(\s+)(\S+)/g, (m, s, w) => s + w.toLowerCase());
}

// --- Загрузка и рендер каталога ---
document.addEventListener('DOMContentLoaded', () => {
  loadAndRender();
  setInterval(loadAndRender, 30000);
  document.addEventListener('visibilitychange', () => !document.hidden && loadAndRender());
});

function loadAndRender() {
  fetch('export_fixed.json?ts=' + Date.now(), { cache: 'no-store' })
    .then(res => res.json())
    .then(data => {
      partsData = data;
      renderParts(partsData);
      populateFilters();
      setupFilterListeners();
    })
    .catch(err => {
      document.getElementById('parts-catalog').innerHTML = '<div class="no-results"><i class="fas fa-exclamation-triangle"></i><h3>Ошибка загрузки данных</h3></div>';
      console.error('Ошибка загрузки JSON:', err);
    });
}

// --- Фильтры ---
function populateFilters() {
  const catSel = document.getElementById('category-select');
  const brSel  = document.getElementById('brand-select');
  if (!catSel || !brSel) return;
  const catVal = catSel.value;
  const brVal  = brSel.value;
  catSel.innerHTML = '<option value="all">Все категории</option>';
  brSel.innerHTML  = '<option value="all">Все бренды</option>';
  [...new Set(partsData.map(p => p.category))].forEach(c => catSel.innerHTML += `<option value="${c}">${c}</option>`);
  [...new Set(partsData.map(p => p.brand))].forEach(b => brSel.innerHTML  += `<option value="${b}">${b}</option>`);
  catSel.value = catVal;
  brSel.value  = brVal;
}

function setupFilterListeners() {
  document.getElementById('category-select')?.addEventListener('change', filterItems);
  document.getElementById('brand-select')?.addEventListener('change', filterItems);
  document.getElementById('stock-select')?.addEventListener('change', filterItems);
  document.getElementById('sort-select')?.addEventListener('change', filterItems);
  // Кнопка "Применить" (на случай если пользователь предпочитает клик)
  document.querySelector('.filter-btn')?.addEventListener('click', filterItems);
}

function filterItems() {
  const catSel = document.getElementById('category-select');
  const brSel  = document.getElementById('brand-select');
  const stockSel = document.getElementById('stock-select');
  const sortSel  = document.getElementById('sort-select');
  let items = partsData.slice();

  if (catSel && catSel.value !== 'all')
    items = items.filter(p => p.category === catSel.value);

  if (brSel && brSel.value !== 'all')
    items = items.filter(p => p.brand === brSel.value);

  if (stockSel) {
    if (stockSel.value === 'in-stock')      items = items.filter(p => p.stock > 10);
    else if (stockSel.value === 'low-stock') items = items.filter(p => p.stock > 0 && p.stock <= 10);
    else if (stockSel.value === 'out-of-stock') items = items.filter(p => p.stock === 0);
  }

  if (sortSel && sortSel.value !== 'default') {
    const cmp = {
      'price-asc':  (a,b)=>a.price-b.price,
      'price-desc': (a,b)=>b.price-a.price,
      'name-asc':   (a,b)=>a.name.localeCompare(b.name),
      'name-desc':  (a,b)=>b.name.localeCompare(a.name)
    }[sortSel.value];
    items.sort(cmp);
  }
  renderParts(items);
}

// --- Каталог и анализ ---
function renderParts(arr) {
  const box = document.getElementById('parts-catalog');
  if (!arr.length) {
    box.innerHTML = '<div class="no-results"><i class="fas fa-search"></i><h3>Ничего не найдено</h3></div>';
    return;
  }
  box.innerHTML = arr.map(p => {
    let badge='', stockTxt='', stockClass='';
    if (p.stock > 10)      { stockTxt='В наличии'; badge='<span class="badge new">NEW</span>'; stockClass='in-stock'; }
    else if (p.stock > 0)  { stockTxt=`Мало (${p.stock})`; badge='<span class="badge sale">SALE</span>'; stockClass='low-stock'; }
    else                   { stockTxt='Нет в наличии'; badge='<span class="badge out">OUT</span>';  stockClass='out-of-stock'; }
    const full = Math.floor(p.rating), half = p.rating % 1 >= 0.5;
    let stars = ''; for (let i = 1; i <= 5; i++) stars += i <= full ? '<i class="fas fa-star"></i>' : (i === full + 1 && half ? '<i class="fas fa-star-half-alt"></i>' : '<i class="far fa-star"></i>');
    const oldPrice = prevPrices.get(p.id);
    let priceClass = '', flag = '';
    if (updatedProducts.has(p.id)) flag = '<span class="price-flag"><i class="fas fa-sync-alt" style="font-size:.95em;"></i> Цена обновлена</span>';
    if (oldPrice !== undefined && oldPrice !== p.price) {
      priceClass = p.price > oldPrice ? 'price-up' : 'price-down';
      updatedProducts.add(p.id);
      flag = '<span class="price-flag"><i class="fas fa-sync-alt" style="font-size:.95em;"></i> Цена обновлена</span>';
    }
    return `
      <div class="item" data-id="${p.id}">
        ${badge}
        <div class="brand-logo">${lowerAfterFirstWord(p.brand)}</div>
        <img src="${p.img}" alt="${p.name}">
        <h3>${lowerAfterFirstWord(p.name)}</h3>
        <div class="category" data-category="${p.category}">${lowerAfterFirstWord(p.category)}</div>
        <div class="price ${priceClass}">
          <span class="price-value">${p.price.toLocaleString('ru-RU')}</span> ₽ ${flag}
        </div>
        <button class="btn analysis-btn" data-id="${p.id}" style="margin-top:8px;">Показать историю цен</button>
        <div class="analysis-container" id="analysis-${p.id}" style="display:none; margin-top:16px;"></div>
        <div class="toast-hint" id="toast-${p.id}"></div>
        <p>${p.description || ''}</p>
        <div class="stock ${stockClass}">${stockTxt}</div>
        <div class="rating">${stars} <span>${p.rating}</span></div>
      </div>
    `;
  }).join('');

  arr.forEach(p => {
    const itemEl = document.querySelector(`.item[data-id="${p.id}"]`);
    const priceEl = itemEl.querySelector('.price');
    const flagEl  = itemEl.querySelector('.price-flag');
    const toastEl = itemEl.querySelector('.toast-hint');
    const old = prevPrices.get(p.id);
    if (old !== undefined && old !== p.price) {
      priceEl.classList.remove('price-up','price-down'); void priceEl.offsetWidth;
      priceEl.classList.add(p.price > old ? 'price-up' : 'price-down');
      const delta = Math.abs(p.price - old).toLocaleString('ru-RU');
      let toast = p.price > old ? `Цена увеличилась на ${delta} ₽` : `Цена снижена на ${delta} ₽`;
      toastEl.textContent = lowerAfterFirstWord(toast);
      toastEl.classList.add('show'); flagEl.classList.remove('hide');
      setTimeout(() => {
        toastEl.classList.remove('show');
        priceEl.classList.remove('price-up','price-down');
      }, 1800);
    }
    prevPrices.set(p.id, p.price);
  });

  // --- Кнопка анализа + автоанимация ---
  document.querySelectorAll('.analysis-btn').forEach(btn => btn.addEventListener('click', function () {
    const id = btn.dataset.id;
    const container = document.getElementById('analysis-' + id);
    if (container._closeTimer) {
      clearTimeout(container._closeTimer);
      container._closeTimer = null;
    }
    if (container.style.display !== 'none' && !container.classList.contains('closed')) {
      closeAnalysis(container);
    } else {
      showAnalysis(id);
      setTimeout(() => container.classList.remove('closed'), 10);
      setAnalysisAutoClose(container, btn);
    }
  }));
}

function setAnalysisAutoClose(container, btn) {
  let lastActive = Date.now();

  function resetTimer() {
    lastActive = Date.now();
    if (container._closeTimer) clearTimeout(container._closeTimer);
    container._closeTimer = setTimeout(() => {
      if (Date.now() - lastActive >= CLOSE_TIMEOUT) closeAnalysis(container);
    }, CLOSE_TIMEOUT);
  }

  container.onmouseenter = resetTimer;
  container.onmousemove  = resetTimer;
  container.onmouseleave = resetTimer;
  btn.onmouseenter = resetTimer;
  btn.onmousemove  = resetTimer;
  btn.onmouseleave = resetTimer;
  resetTimer();
}

function closeAnalysis(container) {
  container.classList.add('closed');
  setTimeout(() => {
    container.style.display = 'none';
    if (container._chart) {
      container._chart.destroy();
      container._chart = null;
    }
    container.innerHTML = '';
  }, 700);
}

// --- Анализ цены (график и расчет) ---
function showAnalysis(id) {
  const part = partsData.find(p => String(p.id) === String(id));
  const container = document.getElementById('analysis-' + id);
  if (!part || !container) return;
  container.classList.remove('closed');
  container.style.display = 'block';

  let sales = Array.isArray(part.sold) ? part.sold.slice(0, 12) : [];
  let prices = Array.isArray(part.currency) ? part.currency.slice(0, 12) : [];
  while (sales.length < 12) sales.push(0);
  while (prices.length < 12) prices.push(part.price);

  const now = new Date();
  const currentMonth = now.getMonth();
  const nextMonth = (currentMonth + 1) % 12;

  const monthsPassed = sales.slice(0, currentMonth + 1);
  const avg = monthsPassed.filter(x => x > 0).length
    ? monthsPassed.filter(x => x > 0).reduce((a, b) => a + b, 0) / monthsPassed.filter(x => x > 0).length
    : 0;

  let seasonalCoefficient;
  if (avg && nextMonth <= currentMonth) {
    seasonalCoefficient = sales[nextMonth] > 0 ? (sales[nextMonth] / avg).toFixed(2) : '1.00';
  } else if (avg) {
    seasonalCoefficient = '1.00';
  } else {
    seasonalCoefficient = '-';
  }
  const forecast = (avg && seasonalCoefficient !== '-') ? Math.round(avg * parseFloat(seasonalCoefficient)) : 0;

  const itemEl = document.querySelector(`.item[data-id="${id}"]`);
  if (itemEl) {
    itemEl.dataset.seasonalCoefficient = seasonalCoefficient;
    itemEl.dataset.forecastNextMonth = forecast;
  }

  container.innerHTML = `
    <div style="font-size:1.1em;margin-bottom:0.5em;"><b>История цен:</b></div>
    <div class="chart-container"><canvas id="chart-${id}"></canvas></div>
    <div style="margin-top:0.5em; font-size:1.1em; color:#fff;">
      <span>Средний спрос: <b>${avg ? avg.toFixed(1) : '-'}</b> шт/мес</span><br>
      <span>Сезонный коэффициент (${monthNames[nextMonth]}): <b>${seasonalCoefficient}</b></span><br>
      <span>Прогноз на ${monthNames[nextMonth]}: <b>${forecast}</b> шт</span>
    </div>
  `;

  if (container._chart) container._chart.destroy();

  const ctx = document.getElementById(`chart-${id}`).getContext('2d');
  container._chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthNames,
      datasets: [{
        label: 'Цена, ₽',
        data: prices,
        fill: true,
        tension: 0.4,
        borderColor: '#f9d806',
        backgroundColor: 'rgba(249,216,6,0.1)',
        pointBackgroundColor: '#130f40',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(19,15,64,0.9)',
          padding: 12,
          borderColor: '#f9d806',
          borderWidth: 1,
          cornerRadius: 8,
          titleFont: { size: 16, weight: 'bold' },
          bodyFont: { size: 14 },
          displayColors: false,
          callbacks: {
            title: items => monthNames[items[0].dataIndex],
            label: ctx => {
              const i = ctx.dataIndex; const price = prices[i];
              const year = new Date().getFullYear(); const firstDay = 1;
              const lastDay = new Date(year, i + 1, 0).getDate();
              return [
                `Цена: ${price.toLocaleString('ru-RU')} ₽`,
                `Период: ${firstDay}-${lastDay} ${monthNamesGenitive[i]} ${year}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Месяц', font: { size: 14, weight: 'bold' } },
          grid: { display: false, drawBorder: true },
          ticks: { font: { size: 12 }, maxRotation: 45, minRotation: 45 }
        },
        y: {
          title: { display: true, text: 'Цена, ₽', font: { size: 14, weight: 'bold' } },
          beginAtZero: false,
          grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
          ticks: { padding: 10, callback: v => v.toLocaleString('ru-RU') + ' ₽', font: { size: 12 } }
        }
      },
      interaction: { mode: 'nearest', axis: 'x', intersect: false },
      animation: { duration: 300, easing: 'easeOutQuart' },
      layout: { padding: { top: 20, right: 20, bottom: 20, left: 20 } }
    }
  });

  setTimeout(() => container._chart?.resize(), 50);
}

// --- Конец ---




