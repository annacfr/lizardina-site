const bandaContent = window.BANDA_CONTENT;
document.getElementById('friendship-intro').textContent = bandaContent.intro;
document.getElementById('greeting-caption').textContent = bandaContent.greetings.caption;
const greetingDialog = document.getElementById('greeting-dialog');
const greetingLarge = document.getElementById('greeting-large');
let greetingTrigger;
if (bandaContent.hero) {
  const photo = bandaContent.hero;
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'group-photo';
  button.setAttribute('aria-label', 'Увеличить: ' + photo.alt);
  const image = document.createElement('img');
  image.src = photo.src; image.alt = photo.alt; image.width = photo.width; image.height = photo.height;
  image.loading = 'eager'; image.decoding = 'async'; image.fetchPriority = 'high';
  button.append(image);
  button.addEventListener('click', () => { greetingTrigger = button; greetingLarge.src = photo.full || photo.src; greetingLarge.alt = photo.alt; greetingDialog.showModal(); });
  document.getElementById('group-photo').append(button);
}
bandaContent.greetings.photos.forEach(photo => {
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'greeting-photo';
  button.setAttribute('aria-label', 'Увеличить: ' + photo.alt);
  const img = document.createElement('img');
  img.src = photo.src; img.alt = photo.alt;
  img.width = photo.width; img.height = photo.height;
  img.loading = 'lazy'; img.decoding = 'async';
  button.append(img);
  button.addEventListener('click', () => {
    greetingTrigger = button; greetingLarge.src = photo.src; greetingLarge.alt = photo.alt;
    greetingDialog.showModal();
  });
  const figure = document.createElement('figure');
  figure.className = 'greeting-figure';
  const caption = document.createElement('figcaption');
  caption.className = 'hand';
  caption.textContent = photo.caption || '';
  figure.append(button, caption);
  document.getElementById('greeting-photos').append(figure);
});
greetingDialog.querySelector('button').addEventListener('click', () => greetingDialog.close());
greetingDialog.addEventListener('click', event => { if (event.target === greetingDialog) { const r = greetingDialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) greetingDialog.close(); } });
greetingDialog.addEventListener('close', () => { greetingLarge.removeAttribute('src'); greetingTrigger?.focus(); });
