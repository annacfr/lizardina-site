(() => {
  const { story, connections, photos } = window.FRIEND_CONTENT;
  const dialog = document.getElementById('photo-dialog');
  const large = document.getElementById('large-photo');
  let trigger;

  function photoButton(photo) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nastya-photo-button';
    button.setAttribute('aria-label', 'Увеличить: ' + photo.alt);

    const image = document.createElement('img');
    image.src = photo.src;
    image.alt = photo.alt;
    image.width = photo.width;
    image.height = photo.height;
    image.loading = 'lazy';
    image.decoding = 'async';
    button.append(image);

    button.addEventListener('click', () => {
      trigger = button;
      large.src = photo.full || photo.src;
      large.alt = photo.alt;
      dialog.showModal();
    });
    return button;
  }

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
  gallery.append(...photos.map(photoButton));

  const quiz = document.getElementById('field-quiz');
  const result = document.getElementById('field-quiz-result');
  const outcomes = {
    witness: 'Главный свидетель. Ты первой заметишь, что что-то происходит. И первой спросишь, что именно.',
    decoy: 'Отвлекающий манёвр. Пока все решают, где взять кофе, Настя уже дочитала главу.',
    partner: 'Берём в напарницы. Сидеть с умным видом и не выдавать остальных ты уже умеешь.',
    tie: 'Ты на подхвате. Можешь посидеть, поснимать и сбегать за кофе. Настя оставила тебе место.'
  };

  quiz.addEventListener('change', () => { result.hidden = true; });
  quiz.addEventListener('submit', event => {
    event.preventDefault();
    const counts = { witness: 0, decoy: 0, partner: 0 };
    for (const answer of new FormData(quiz).values()) counts[answer] += 1;
    const majority = Object.keys(counts).find(answer => counts[answer] >= 2);
    result.textContent = outcomes[majority || 'tie'];
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
