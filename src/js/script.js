import tabs from './modules/tabs';
import modal, { openModal } from './modules/modal';
import timer from './modules/timer';
import cards from './modules/cards';
import calc from './modules/calc';
import forms from './modules/forms';
import slider from './modules/slider';

window.addEventListener('DOMContentLoaded', () => {
  const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 50000);

  tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
  timer('.timer', 'October 1, 2023');
  modal('[data-modal]', '.modal', modalTimerId);
  cards();
  forms('form', modalTimerId);
  slider({
    container: '.offer__slider',
    slide: '.offer__slide',
    nextArrow: '.offer__slider-next',
    prevArrow: '.offer__slider-prev',
    totalCounter: '#total',
    currentCounter: '#current',
    wrapper: '.offer__slider-wrapper',
    field: '.offer__slider-inner',
  });
  calc();
});
