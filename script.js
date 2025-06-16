// --- Хелперы и глобалки ---
const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const monthNamesGenitive = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
let partsData = [];
let prevPrices = new Map();
const updatedProducts = new Set();

function lowerAfterFirstWord(str) {
  return str
    .replace(/^[^\s]+/, w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .replace(/(\s+)(\S+)/g, (m, s, w) => s + w.toLowerCase());
}

// --- Загрузка данных и рендер ---
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
    })
    .catch(err => {
      document.getElementById('parts-catalog').innerHTML = '<div class="no-results"><i class="fas fa-exclamation-triangle"></i><h3>Ошибка загрузки данных</h3></div>';
      console.error('Ошибка загрузки JSON:', err);
    });
}

// --- Каталог ---
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

  // После отрисовки обновляем состояния цен
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

  // --- Кнопка с анимацией открытия/закрытия анализа ---
  document.querySelectorAll('.analysis-btn').forEach(btn => btn.addEventListener('click', function () {
    const id = btn.dataset.id;
    const container = document.getElementById('analysis-' + id);
    if (container.style.display !== 'none' && !container.classList.contains('closed')) {
      // закрываем с анимацией
      container.classList.add('closed');
      setTimeout(() => {
        container.style.display = 'none';
        if (container._chart) {
          container._chart.destroy();
          container._chart = null;
        }
        container.innerHTML = '';
      }, 420);
    } else {
      // открываем с анимацией
      showAnalysis(id);
      setTimeout(() => {
        container.classList.remove('closed');
      }, 10);
    }
  }));
}

// --- Анализ цены ---
function showAnalysis(id) {
  const part = partsData.find(p => String(p.id) === String(id));
  const container = document.getElementById('analysis-' + id);
  if (!part || !container) return;
  container.classList.remove('closed');
  container.style.display = 'block';

  // Всегда 12 месяцев, даже если в JSON меньше — добиваем нулями справа
  let sales = Array.isArray(part.sold) ? part.sold.slice(0, 12) : [];
  let prices = Array.isArray(part.currency) ? part.currency.slice(0, 12) : [];
  while (sales.length < 12) sales.push(0);
  while (prices.length < 12) prices.push(part.price);

  // Индекс текущего месяца (0 — январь)
  const now = new Date();
  const currentMonth = now.getMonth();
  const nextMonth = (currentMonth + 1) % 12;

  // Средний спрос только по прошедшим месяцам (до текущего)
  const monthsPassed = sales.slice(0, currentMonth + 1); // +1, чтобы включить текущий месяц
  const avg = monthsPassed.filter(x => x > 0).length
    ? monthsPassed.filter(x => x > 0).reduce((a, b) => a + b, 0) / monthsPassed.filter(x => x > 0).length
    : 0;

  // Сезонный коэффициент для следующего месяца: если нет продаж в будущем — прогнозируем по среднему (коэффициент=1)
  let seasonalCoefficient;
  if (avg && nextMonth <= currentMonth) {
    seasonalCoefficient = sales[nextMonth] > 0 ? (sales[nextMonth] / avg).toFixed(2) : '1.00';
  } else if (avg) {
    seasonalCoefficient = '1.00';
  } else {
    seasonalCoefficient = '-';
  }

  // Прогноз = средний спрос * коэффициент (для будущих месяцев — средний спрос)
  const forecast = (avg && seasonalCoefficient !== '-') ? Math.round(avg * parseFloat(seasonalCoefficient)) : 0;

  // Сохраняем коэффициент и прогноз в data-атрибутах элемента .item
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

// --- Фильтры (если используешь) ---
function populateFilters() {
  const catSel = document.getElementById('category-select');
  const brSel  = document.getElementById('brand-select');
  const catVal = catSel?.value || 'all';
  const brVal  = brSel?.value || 'all';
  if (!catSel || !brSel) return;
  catSel.innerHTML = '<option value="all">Все категории</option>';
  brSel.innerHTML  = '<option value="all">Все бренды</option>';
  [...new Set(partsData.map(p => p.category))].forEach(c => catSel.innerHTML += `<option value="${c}">${c}</option>`);
  [...new Set(partsData.map(p => p.brand))].forEach(b => brSel.innerHTML  += `<option value="${b}">${b}</option>`);
  catSel.value = catVal;
  brSel.value  = brVal;
}
