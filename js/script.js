window.addEventListener('DOMContentLoaded', () => {
  //Tabs

  const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    parent = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabsContent.forEach(item => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    tabs.forEach(item => {
      item.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  parent.addEventListener('click', e => {
    let target = e.target;

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  // Timer

  const deadLine = 'October 1, 2023';
  const timerContainer = document.querySelector('.timer');

  function getTimeRemaining(endTime) {
    const t = Date.parse(endTime) - Date.parse(new Date());

    if (t < 0) {
      return {
        total: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
    const days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / (1000 * 60)) % 60),
      seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  function setClock(selector, endTime) {
    const days = selector.querySelector('#days'),
      hours = selector.querySelector('#hours'),
      minutes = selector.querySelector('#minutes'),
      seconds = selector.querySelector('#seconds'),
      timeInterval = setInterval(updateClock, 1000);
    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endTime);
      days.textContent = t.days < 10 ? `0${t.days}` : t.days;
      hours.textContent = t.hours < 10 ? `0${t.hours}` : t.hours;
      minutes.textContent = t.minutes < 10 ? `0${t.minutes}` : t.minutes;
      seconds.textContent = t.seconds < 10 ? `0${t.seconds}` : t.seconds;
      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock(timerContainer, deadLine);

  // Modal-window

  const connectBtns = document.querySelectorAll('[data-modal]'),
    modalDiv = document.querySelector('.modal');

  function closeModal() {
    modalDiv.classList.remove('show');
    modalDiv.classList.add('hide');
    document.body.style.overflow = '';
  }

  function openModal() {
    modalDiv.classList.remove('hide');
    modalDiv.classList.add('show');
    document.body.style.overflow = 'hidden';
    clearTimeout(modalTimerId);
  }

  function showModalByScroll() {
    if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }
  connectBtns.forEach(elem => elem.addEventListener('click', openModal));

  modalDiv.addEventListener('click', e => {
    if (e.target == modalDiv || e.target.hasAttribute('data-close')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 50000);

  window.addEventListener('scroll', showModalByScroll);

  //Classes

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 27;
      this.changeToUAH();
    }
    changeToUAH() {
      this.price *= this.transfer;
    }

    render() {
      const element = document.createElement('div');
      if (!this.classes.length) {
        this.element = 'menu__item';
        element.classList.add(this.element);
      } else {
        this.classes.forEach(className => element.classList.add(className));
      }
      element.innerHTML = `<img src="${this.src}" alt="${this.alt}">
                    <h3 class="menu__item-subtitle">Меню "${this.title}"</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>`;

      this.parent.append(element);
    }
  }

  const getResource = async url => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };

  getResource('http://localhost:3000/menu').then(data => {
    data.forEach(obj => new MenuCard(...Object.values(obj), '.menu .container', 'menu__item').render());
  });

  //XMLHttpRequest

  const forms = document.querySelectorAll('form');
  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро свяжемся',
    failure: 'Произошла ошибка',
  };

  forms.forEach(form => bindPostData(form));

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });
    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);

      const obj = {};

      formData.forEach((value, key) => {
        obj[key] = value;
      });

      const json = JSON.stringify(Object.fromEntries(formData));

      postData('http://localhost:3000/requests', json)
        .then(data => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = modalDiv.children[0];
    prevModalDialog.classList.add('hide');
    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
    <div class="modal__content">
    <div class="modal_close" data-close>×</div>
    <div class="modal__title">${message}</div>
    </div>
    `;
    modalDiv.append(thanksModal);
    openModal();
    const removeTimer = setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
      clearTimeout(removeTimer);
    }, 4000);
  }

  //Slider
  
  let slideIndex = 1;
  let offset = 0;

  const slides = document.querySelectorAll('.offer__slide'),
    prev = document.querySelector('.offer__slider-prev'),
    next = document.querySelector('.offer__slider-next'),
    currentSlide = document.querySelector('#current'),
    totalSlides = document.querySelector('#total'),
    slidesWrapper = document.querySelector('.offer__slider-wrapper'),
    slidesField = document.querySelector('.offer__slider-inner'),
    width = window.getComputedStyle(slidesWrapper).width;

    if (slides.length < 10) {
		totalSlides.textContent = `0${slides.length}`;
		current.textContent = `0${slideIndex}`;
	} else {
		totalSlides.textContent = slides.length;
		current.textContent = slideIndex;
	}

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slidesWrapper.style.overflow = 'hidden';
    slides.forEach(slide => slide.style.width = width);

    next.addEventListener('click', () => {
      if (offset == parseInt(width) * (slides.length - 1)) {
        offset = 0;
      } else {
        offset += parseInt(width);
      }
      slidesField.style.transform = `translateX(-${offset}px)`;

      if (slideIndex == slides.length) {
        slideIndex = 1;
      } else{
        slideIndex++;
      }
       currentSlide.textContent = slideIndex < 9 ? `0${slideIndex}` : slideIndex;
    })

    prev.addEventListener('click', () => {
      if (offset == 0) {
        offset = parseInt(width) * (slides.length - 1);
      } else {
        offset -= parseInt(width);
      }
      slidesField.style.transform = `translateX(-${offset}px)`;

      if (slideIndex == 1) {
        slideIndex = slides.length;
      } else {
        slideIndex--;
      }
      currentSlide.textContent = slideIndex < 9 ? `0${slideIndex}` : slideIndex;
    })
    
  
  // function showSlides(n) {
  //   if (n > slides.length) {
  //     slideIndex = 1;
  //   }
  //   if (n < 1) {
  //     slideIndex = slides.length;
  //   }

  //   slides.forEach(item => item.classList.add('hide'));
  //   slides[slideIndex - 1].classList.remove('hide');
  //   slides[slideIndex - 1].classList.add('show');
  //   currentSlide.textContent = slideIndex < 9 ? `0${slideIndex}` : slideIndex;
  // }

  // prev.addEventListener('click', () => {
  //   showSlides(slideIndex -= 1);
  // })

  // next.addEventListener('click', () => {
  //   showSlides(slideIndex += 1);
  // })
  // showSlides(slideIndex);
});
