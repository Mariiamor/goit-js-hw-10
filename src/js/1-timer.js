import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '../css/1-timer.css';


const dateInput = document.getElementById('datetime-picker');
const startBtn = document.querySelector('[data-start]');
const timeElements = {
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]'),
};

let userDate = null;
let timerId = null;

flatpickr(dateInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userDate = selectedDates[0];
    if (userDate <= new Date()) {
      showMessage('Please choose a date in the future');
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
});

startBtn.addEventListener('click', () => {
  if (!userDate || userDate <= new Date()) return;

  startBtn.disabled = true;
  dateInput.disabled = true;

  timerId = setInterval(() => {
    const timeDiff = userDate - new Date();

    if (timeDiff <= 0) {
      clearInterval(timerId);
      updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      dateInput.disabled = false;
      return;
    }

    updateTimerUI(convertMs(timeDiff));
  }, 1000);
});

function updateTimerUI({ days, hours, minutes, seconds }) {
  timeElements.daysEl.textContent = addLeadingZero(days);
  timeElements.hoursEl.textContent = addLeadingZero(hours);
  timeElements.minutesEl.textContent = addLeadingZero(minutes);
  timeElements.secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

function showMessage(message) {
  iziToast.show({
  message,
  backgroundColor: '#EF4040',
  messageColor: 'white',
  position: 'topRight',
  timeout: 3000,
});

}
