let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.navbar');

menu.onclick = () =>{
  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');
}

document.querySelector('#login-btn').onclick = () =>{
  document.querySelector('.login-form-container').classList.toggle('active');
}

document.querySelector('#close-login-form').onclick = () =>{
  document.querySelector('.login-form-container').classList.remove('active');
}

window.onscroll = () =>{

  menu.classList.remove('fa-times');
  navbar.classList.remove('active');

  if(window.scrollY > 0){
    document.querySelector('.header').classList.add('active');
  }else{
    document.querySelector('.header').classList.remove('active');
  };

};

document.querySelector('.home').onmousemove = (e) =>{

  document.querySelectorAll('.home-parallax').forEach(elm =>{

    let speed = elm.getAttribute('data-speed');

    let x = (window.innerWidth - e.pageX * speed) / 90;
    let y = (window.innerHeight - e.pageY * speed) / 90;

    elm.style.transform = `translateX(${y}px) translateY(${x}px)`;

  });

};


document.querySelector('.home').onmouseleave = (e) =>{

  document.querySelectorAll('.home-parallax').forEach(elm =>{

    elm.style.transform = `translateX(0px) translateY(0px)`;

  });

};

var swiper = new Swiper(".vehicles-slider", {
  grabCursor: true,
  centeredSlides: true,  
  spaceBetween: 20,
  loop:true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable:true,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

var swiper = new Swiper(".featured-slider", {
  grabCursor: true,
  centeredSlides: true,  
  spaceBetween: 20,
  loop:true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable:true,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

var swiper = new Swiper(".review-slider", {
  grabCursor: true,
  centeredSlides: true,  
  spaceBetween: 20,
  loop:true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable:true,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});


const parts = [
  { 
    category: 'двигатель', 
    name: 'Фильтр масляный', 
    price: 800, 
    img: 'image/engine-filter.jpg',
    description: 'Высококачественный масляный фильтр для всех типов двигателей'
  },
  { 
    category: 'тормоза', 
    name: 'Тормозные колодки', 
    price: 1200, 
    img: 'image/brake-pads.jpg',
    description: 'Керамические тормозные колодки с увеличенным сроком службы'
  },
  { 
    category: 'подвеска', 
    name: 'Амортизатор', 
    price: 2500, 
    img: 'image/shock-absorber.jpg',
    description: 'Газомасляный амортизатор для комфортной езды'
  },
  { 
    category: 'двигатель', 
    name: 'Ремень ГРМ', 
    price: 1500, 
    img: 'image/timing-belt.jpg',
    description: 'Ремень газораспределительного механизма с повышенной износостойкостью'
  },
  { 
    category: 'электрика', 
    name: 'Аккумулятор', 
    price: 3500, 
    img: 'image/battery.jpg',
    description: 'Высокоемкостной аккумулятор 65А/ч'
  },
  { 
    category: 'кузов', 
    name: 'Фара передняя', 
    price: 4200, 
    img: 'image/headlight.jpg',
    description: 'LED фара с улучшенной светоотдачей'
  },
  { 
    category: 'тормоза', 
    name: 'Тормозной диск', 
    price: 2800, 
    img: 'image/brake-disc.jpg',
    description: 'Вентилируемый тормозной диск'
  },
  { 
    category: 'подвеска', 
    name: 'Стойка стабилизатора', 
    price: 950, 
    img: 'image/stabilizer-link.jpg',
    description: 'Усиленная стойка стабилизатора'
  }
];

// Обновляем функцию рендеринга
function renderParts(items) {
  const container = document.getElementById('parts-catalog');
  container.innerHTML = '';
  
  items.forEach(part => {
    container.innerHTML += `
      <div class="item">
        <img src="${part.img}" alt="${part.name}">
        <h3>${part.name}</h3>
        <div class="category">${part.category}</div>
        <p>${part.description}</p>
        <p class="price">Цена: ${part.price} руб.</p>
        <a href="#" class="btn">Купить</a>
      </div>
    `;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const catalog = document.getElementById('parts-catalog');
  
  catalog.addEventListener('mouseover', (e) => {
      const item = e.target.closest('.item');
      if (item) {
          const tooltip = item.querySelector('.analysis-tooltip');
          if (tooltip) {
              tooltip.style.opacity = '1';
              tooltip.style.visibility = 'visible';
          }
      }
  });
  
  catalog.addEventListener('mouseout', (e) => {
      const item = e.target.closest('.item');
      if (item) {
          const tooltip = item.querySelector('.analysis-tooltip');
          if (tooltip) {
              tooltip.style.opacity = '0';
              tooltip.style.visibility = 'hidden';
          }
      }
  });
});