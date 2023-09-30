function calc() {
  // Calculator

  const result = document.querySelector('.calculating__result span');
  let sex = localStorage.getItem('sex') || 'female';
  let ratio = localStorage.getItem('ratio') || 1.375;
  let height;
  let weight;
  let age;

  function initLocalSettings(selector, activeClass) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(elem => {
      elem.classList.remove(activeClass);
      if (elem.getAttribute('id') === localStorage.getItem('sex')) {
        elem.classList.add(activeClass);
      }

      if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
        elem.classList.add(activeClass);
      }
    });
  }

  initLocalSettings('#gender div', 'calculating__choose-item_active');
  initLocalSettings('#ratio div', 'calculating__choose-item_active');

  function calcTotal() {
    if (!sex || !height || !weight || !age || !ratio) {
      result.textContent = '________';
      return;
    }

    if (sex === 'female') {
      result.textContent = Math.round(447.6 + 9.2 * weight + 3.1 * height - 4.3 * age * ratio);
    } else {
      result.textContent = Math.round(88.36 + 9.2 * weight + 4.8 * height - 5.7 * age * ratio);
    }
  }

  calcTotal();

  function getStaticInformation(selector, activeClass) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(elem =>
      elem.addEventListener('click', e => {
        if (e.target.getAttribute('data-ratio')) {
          ratio = +e.target.getAttribute('data-ratio');
          localStorage.setItem('ratio', ratio);
        } else {
          sex = e.target.getAttribute('id');
          localStorage.setItem('sex', sex);
        }
        elements.forEach(elem => elem.classList.remove(activeClass));
        e.target.classList.add(activeClass);
        calcTotal();
      })
    );
  }

  function getDynamicInformation(selector) {
    const input = document.querySelector(selector);
    input.addEventListener('input', () => {
      if (input.value.match(/\D/g)) {
        input.style.border = '1px solid red';
      } else {
        input.style.border = 'none';
      }

      switch (input.id) {
        case 'height':
          height = +input.value;
          break;
        case 'weight':
          weight = +input.value;
          break;
        case 'age':
          age = +input.value;
          break;
        default:
      }
      calcTotal();
    });
  }

  getDynamicInformation('#height');
  getDynamicInformation('#weight');
  getDynamicInformation('#age');

  getStaticInformation('#gender div', 'calculating__choose-item_active');
  getStaticInformation('#ratio div', 'calculating__choose-item_active');
}

export default calc;
