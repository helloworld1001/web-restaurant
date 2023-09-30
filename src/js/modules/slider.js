function slider({ container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field }) {
  // Slider

  let slideIndex = 1;
  let offset = 0;

  const slides = document.querySelectorAll(slide);
  const slider = document.querySelector(container);
  const prev = document.querySelector(prevArrow);
  const next = document.querySelector(nextArrow);
  const currentSlide = document.querySelector(currentCounter);
  const totalSlides = document.querySelector(totalCounter);
  const slidesWrapper = document.querySelector(wrapper);
  const slidesField = document.querySelector(field);
  const { width } = window.getComputedStyle(slidesWrapper);

  if (slides.length < 10) {
    totalSlides.textContent = `0${slides.length}`;
    currentSlide.textContent = `0${slideIndex}`;
  } else {
    totalSlides.textContent = slides.length;
    currentSlide.textContent = slideIndex;
  }

  slidesField.style.width = `${100 * slides.length}%`;
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.5s all';
  slidesWrapper.style.overflow = 'hidden';
  slides.forEach(slide => (slide.style.width = width));

  slider.style.position = 'relative';

  const indicators = document.createElement('ol');
  indicators.classList.add('carousel-indicators');
  slider.append(indicators);

  for (let index = 0; index < slides.length; index++) {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('data-slide-to', index + 1);
    if (index === 0) {
      dot.style.opacity = 1;
    }
    indicators.append(dot);
  }

  function setActiveIndicator(switches) {
    indicators.childNodes.forEach(elem => (elem.style.opacity = '.5'));
    indicators.childNodes[slideIndex - 1].style.opacity = '1';
  }

  next.addEventListener('click', () => {
    if (offset === parseInt(width, 10) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += parseInt(width, 10);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex === slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }
    currentSlide.textContent = slideIndex < 9 ? `0${slideIndex}` : slideIndex;

    setActiveIndicator(indicators);
  });

  prev.addEventListener('click', () => {
    if (offset === 0) {
      offset = parseInt(width, 10) * (slides.length - 1);
    } else {
      offset -= parseInt(width, 10);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex === 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }
    currentSlide.textContent = slideIndex < 9 ? `0${slideIndex}` : slideIndex;

    setActiveIndicator(indicators);
  });

  indicators.childNodes.forEach(element => {
    element.addEventListener('click', e => {
      slideIndex = e.target.getAttribute('data-slide-to');
      offset = parseInt(width, 10) * (slideIndex - 1);

      slidesField.style.transform = `translateX(-${offset}px)`;

      setActiveIndicator(indicators);
      currentSlide.textContent = slideIndex < 9 ? `0${slideIndex}` : slideIndex;
    });
  });
}

export default slider;
