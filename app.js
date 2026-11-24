const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') === 'false'));
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});

const form = document.querySelector('#booking form');
const serviceSelect = form.elements.service;
const requestedService = new URLSearchParams(location.search).get('service');
const matchingOption = Array.from(serviceSelect.options).find(
  (option) => option.dataset.service === requestedService
);
if (matchingOption) serviceSelect.value = matchingOption.value;

const car = form.elements.car;
const draft = document.querySelector('#draft');
const sendLink = document.querySelector('#send');
const actions = document.querySelector('#draft-actions');
const status = document.querySelector('#status');

form.addEventListener('input', () => {
  car.setCustomValidity('');
  actions.hidden = true;
  draft.hidden = true;
  sendLink.hidden = true;
  sendLink.removeAttribute('href');
  status.textContent = '';
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const carName = car.value.trim();
  if (!carName) {
    car.setCustomValidity('Укажите автомобиль или деталь.');
    car.reportValidity();
    return;
  }

  const comment = form.elements.comment.value.trim();
  const subject = 'Заявка в Pokraska tut';
  const lines = [`Автомобиль или деталь: ${carName}`, `Услуга: ${serviceSelect.value}`];
  if (comment) lines.push(`Комментарий: ${comment}`);
  draft.value = lines.join('\n');
  sendLink.href = `mailto:pokrastut@yandex.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft.value)}`;
  sendLink.hidden = false;
  actions.hidden = false;
  draft.hidden = false;
  draft.focus();
  status.textContent = 'Текст готов. Выберите, как его отправить.';
});

document.querySelector('#copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(draft.value);
    status.textContent = 'Текст скопирован. Его можно вставить в сообщение.';
  } catch {
    draft.focus();
    draft.select();
    status.textContent = 'Текст выделен. Скопируйте его вручную.';
  }
});
form.hidden = false;
