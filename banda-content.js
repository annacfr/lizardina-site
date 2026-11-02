// Тексты и фотографии главной страницы меняются здесь.
window.BANDA_CONTENT = {
  intro: "Этот сайт — для моих троих подруг.\nЗдесь будет немного о нашей дружбе, а у каждой — своя страница.",
  greetings: {
    caption: "", // Сюда позже добавим твой текст под фотографиями.
    photos: [
      { src: "assets/photos/greetings/from-me-01.jpg", alt: "Мои поздравления — фотография 1", width: 960, height: 1280 },
      { src: "assets/photos/greetings/from-me-02.jpg", alt: "Мои поздравления — фотография 2", width: 956, height: 1280 }
    ]
  }
};
const bandaContent = window.BANDA_CONTENT;
document.getElementById('friendship-intro').textContent = bandaContent.intro;
document.getElementById('greeting-caption').textContent = bandaContent.greetings.caption;
const greetingDialog = document.getElementById('greeting-dialog');
const greetingLarge = document.getElementById('greeting-large');
let greetingTrigger;
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
  document.getElementById('greeting-photos').append(button);
});
greetingDialog.querySelector('button').addEventListener('click', () => greetingDialog.close());
greetingDialog.addEventListener('click', event => { if (event.target === greetingDialog) { const r = greetingDialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) greetingDialog.close(); } });
greetingDialog.addEventListener('close', () => { greetingLarge.removeAttribute('src'); greetingTrigger?.focus(); });
