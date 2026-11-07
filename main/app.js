const bandaContent = window.BANDA_CONTENT;
document.getElementById('friendship-intro').textContent = bandaContent.intro;
document.getElementById('greeting-caption').textContent = bandaContent.greetings.caption;
const greetingDialog = document.getElementById('greeting-dialog');
const greetingLarge = document.getElementById('greeting-large');
let greetingTrigger;
function createPhotoButton(photo, className, eager = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.setAttribute('aria-label', 'Увеличить: ' + photo.alt);

  const image = document.createElement('img');
  image.src = photo.src;
  image.alt = photo.alt;
  image.width = photo.width;
  image.height = photo.height;
  image.loading = eager ? 'eager' : 'lazy';
  image.decoding = 'async';
  if (eager) image.fetchPriority = 'high';
  button.append(image);

  button.addEventListener('click', () => {
    greetingTrigger = button;
    greetingLarge.src = photo.full || photo.src;
    greetingLarge.alt = photo.alt;
    greetingDialog.setAttribute('aria-label', photo.alt);
    greetingDialog.showModal();
  });
  return button;
}

if (bandaContent.hero) {
  document.getElementById('group-photo').append(createPhotoButton(bandaContent.hero, 'group-photo', true));
}

bandaContent.greetings.photos.forEach(photo => {
  const figure = document.createElement('figure');
  figure.className = 'greeting-figure';
  const caption = document.createElement('figcaption');
  caption.className = 'hand';
  caption.textContent = photo.caption || '';
  figure.append(createPhotoButton(photo, 'greeting-photo'), caption);
  document.getElementById('greeting-photos').append(figure);
});

const friendshipAlbum = document.getElementById('friendship-album');
for (const photo of bandaContent.friendshipPhotos || []) {
  friendshipAlbum.append(createPhotoButton(photo, 'friendship-photo'));
}

const soundtrack = document.getElementById('friendship-soundtrack');
for (const track of bandaContent.soundtrack || []) {
  const entry = document.createElement('div');
  entry.className = 'friendship-track';

  const player = document.createElement('audio');
  player.controls = true;
  player.preload = 'none';
  player.src = track.audio;
  player.setAttribute('aria-label', track.title);
  entry.append(createPhotoButton(track.cover, 'friendship-photo'), player);
  soundtrack.append(entry);
}

// Play events do not bubble. Capture them to include the fixed hymn player.
document.addEventListener('play', event => {
  const playing = event.target;
  if (!(playing instanceof HTMLAudioElement)) return;

  for (const player of document.querySelectorAll('audio')) {
    if (player !== playing && !player.paused) player.pause();
  }
  if ('mediaSession' in navigator && 'MediaMetadata' in window) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: playing.getAttribute('aria-label'),
      album: 'Воздуханки'
    });
  }
}, true);


greetingDialog.querySelector('button').addEventListener('click', () => greetingDialog.close());
greetingDialog.addEventListener('click', event => { if (event.target === greetingDialog) { const r = greetingDialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) greetingDialog.close(); } });
greetingDialog.addEventListener('close', () => { greetingLarge.removeAttribute('src'); greetingTrigger?.focus(); });
