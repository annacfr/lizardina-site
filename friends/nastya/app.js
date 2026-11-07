(() => {
  const { hero, story, connections, photos } = window.FRIEND_CONTENT;
  const dialog = document.getElementById('photo-dialog');
  const large = document.getElementById('large-photo');
  const largeFrame = document.getElementById('large-photo-frame');
  let trigger;

  function applyCrop(frame, photo) {
    const crop = photo.crop;
    frame.classList.toggle('photo-crop', Boolean(crop));
    frame.classList.toggle('photo-crop-round', Boolean(crop?.round));
    if (!crop) return;

    frame.style.setProperty('--crop-ratio', crop.width / crop.height);
    frame.style.setProperty('--crop-image-width', (photo.width / crop.width * 100) + '%');
    frame.style.setProperty('--crop-left', (-crop.x / crop.width * 100) + '%');
    frame.style.setProperty('--crop-top', (-crop.y / crop.height * 100) + '%');
  }

  function photoButton(photo, eager = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nastya-photo-button';
    button.setAttribute('aria-label', 'Увеличить: ' + photo.alt);

    const image = document.createElement('img');
    image.src = photo.src;
    image.alt = photo.alt;
    image.width = photo.width;
    image.height = photo.height;
    image.loading = eager ? 'eager' : 'lazy';
    image.decoding = 'async';
    if (photo.crop) {
      const frame = document.createElement('span');
      applyCrop(frame, photo);
      frame.append(image);
      button.append(frame);
    } else {
      button.append(image);
    }

    button.addEventListener('click', () => {
      trigger = button;
      large.src = photo.full || photo.src;
      large.alt = photo.alt;
      applyCrop(largeFrame, photo);
      dialog.showModal();
    });
    return button;
  }

  const heroCaption = document.createElement('figcaption');
  heroCaption.className = 'hand';
  heroCaption.textContent = hero.caption;
  document.getElementById('nastya-fishing').append(heroCaption, photoButton(hero, true));

  const storyList = document.getElementById('story-photos');
  story.forEach(photo => {
    const item = document.createElement('li');
    const figure = document.createElement('figure');
    const caption = document.createElement('figcaption');
    const title = document.createElement('h3');
    const note = document.createElement('p');
    title.className = 'hand';
    title.textContent = photo.title;
    note.textContent = photo.caption;
    caption.append(title, note);
    figure.append(photoButton(photo), caption);
    item.append(figure);
    storyList.append(item);
  });

  document.getElementById('connections-photo').prepend(photoButton(connections));

  const gallery = document.getElementById('gallery-photos');
  gallery.append(...photos.map(photo => photoButton(photo)));

  const quiz = document.getElementById('field-quiz');
  const result = document.getElementById('field-quiz-result');
  quiz.addEventListener('change', () => { result.hidden = true; });
  quiz.addEventListener('submit', event => {
    event.preventDefault();
    const answers = [...new FormData(quiz).values()];
    const discreet = answers.filter(answer => answer === 'discreet').length;
    result.textContent = discreet >= 2
      ? 'Настя берёт тебя в сообщники. Ты умеешь держать язык за зубами. Место на скамейке твоё.'
      : 'Тебя ждёт судьба Пушкина. Памятника, если что. Настя просила не выносить это в общий чат.';
    result.hidden = false;
    result.focus({ preventScroll: true });
    result.scrollIntoView({ block: 'center' });
  });

  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
      dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    large.removeAttribute('src');
    trigger?.focus({ preventScroll: true });
  });
})();
