function timer(id, deadLine) {
  const timerContainer = document.querySelector(id);

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
    const days = Math.floor(t / (1000 * 60 * 60 * 24));
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((t / (1000 * 60)) % 60);
    const seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  function setClock(selector, endTime) {
    const days = selector.querySelector('#days');
    const hours = selector.querySelector('#hours');
    const minutes = selector.querySelector('#minutes');
    const seconds = selector.querySelector('#seconds');
    const timeInterval = setInterval(updateClock, 1000);
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
}

export default timer;
