(() => {
  const { story, photos } = window.FRIEND_CONTENT;
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
    item.append(photoButton(photo));
    storyList.append(item);
  });

  const gallery = document.getElementById('gallery-photos');
  gallery.append(...photos.map(photoButton));

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
