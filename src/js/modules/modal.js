function closeModal(modalSelector) {
  const modalDiv = document.querySelector(modalSelector);
  modalDiv.classList.remove('show');
  modalDiv.classList.add('hide');
  document.body.style.overflow = '';
}

function openModal(modalSelector, modalTimerId) {
  const modalDiv = document.querySelector(modalSelector);
  modalDiv.classList.remove('hide');
  modalDiv.classList.add('show');
  document.body.style.overflow = 'hidden';
  if (modalTimerId) {
    clearTimeout(modalTimerId);
  }
}

function modal(triggerSelector, modalSelector, modalTimerId) {
  const modalTrigger = document.querySelectorAll(triggerSelector);
  const modalDiv = document.querySelector(modalSelector);
  function showModalByScroll() {
    if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal(modalSelector, modalTimerId);
      window.removeEventListener('scroll', showModalByScroll);
    }
  }
  modalTrigger.forEach(elem => elem.addEventListener('click', () => openModal(modalSelector, modalTimerId)));

  modalDiv.addEventListener('click', e => {
    if (e.target === modalDiv || e.target.hasAttribute('data-close')) {
      closeModal(modalSelector);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      closeModal(modalSelector);
    }
  });

  window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export { closeModal, openModal };
