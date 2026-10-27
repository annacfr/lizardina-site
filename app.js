/* Поведение интерфейса. Содержимое и пути к файлам — в content.js. */
(() => {
  'use strict';
  const c = window.LIZARDINA_CONTENT;
  const $ = id => document.getElementById(id);
  const placeholder = 'assets/placeholders/photo.svg';
  let bookPage = 0;
  let lastFocused = null;

  function image(src, alt, eager = false) {
    const img = document.createElement('img');
    img.src = src || placeholder;
    img.alt = alt || '';
    img.width = 800;
    img.height = 1000;
    img.loading = eager ? 'eager' : 'lazy';
    img.decoding = 'async';
    if (eager) img.fetchPriority = 'high';
    img.addEventListener('error', () => {
      if (img.getAttribute('src') !== placeholder) { img.src = placeholder; img.alt = `${alt || 'фото'} — файл пока не добавлен`; }
    });
    return img;
  }

  function open(dialog) {
    lastFocused = document.activeElement;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    dialog.scrollTop = 0;
  }

  function photo(data, eager = false) {
    const button = document.createElement('button');
    button.className = data.src ? 'photo photo-real' : 'photo';
    if (data.ratio) button.style.aspectRatio = data.ratio;
    button.type = 'button';
    button.setAttribute('aria-label', `Увеличить: ${data.alt}`);
    const img = image(data.src, data.alt, eager);
    img.addEventListener('error', () => button.classList.remove('photo-real'));
    button.append(img);
    button.addEventListener('click', () => {
      $('large-photo').src = data.full || img.getAttribute('src');
      $('large-photo').alt = data.alt;
      $('photo-caption').textContent = data.caption || '';
      $('photo-dialog').setAttribute('aria-label', data.alt);
      if (data.caption) $('photo-dialog').setAttribute('aria-labelledby', 'photo-caption');
      else $('photo-dialog').removeAttribute('aria-labelledby');
      open($('photo-dialog'));
    });
    return button;
  }

  function figure(data) {
    const figure = document.createElement('figure');
    figure.className = 'photo-figure';
    const caption = document.createElement('figcaption');
    caption.textContent = data.caption || '';
    figure.append(photo(data));
    if (data.caption) figure.append(caption);
    return figure;
  }

  $('hero-photo').append(photo(c.hero, true));
  $('funny-photo').append(photo(c.funny));
  if (c.nicknameImage) {
    const name = image(c.nicknameImage, 'Лизардина', true);
    name.addEventListener('error', () => { $('nickname').textContent = 'Лизардина'; });
    $('nickname').replaceChildren(name);
  }
  c.navigation.forEach(item => {
    const link = document.createElement('a');
    link.href = `#${item.id}`;
    link.textContent = item.label;
    $('navigation').append(link);
  });
  $('origin-intro').textContent = c.origin.intro;
  c.origin.traits.forEach(text => {
    const li = document.createElement('li'); li.textContent = text; $('origin-traits').append(li);
  });
  if (c.origin.cover) $('video-cover').src = c.origin.cover;
  $('video-cover').addEventListener('error', e => { if (e.target.getAttribute('src') !== placeholder) e.target.src = placeholder; });

  function youtubeId(raw) {
    try {
      const url = new URL(raw);
      if (!['https:', 'http:'].includes(url.protocol)) return null;
      const host = url.hostname.toLowerCase().replace(/^www\./, '');
      let id;
      if (host === 'youtu.be') id = url.pathname.slice(1).split('/')[0];
      else if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)) {
        id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
      }
      return /^[\w-]{11}$/.test(id || '') ? id : null;
    } catch { return null; }
  }
  $('video-button').addEventListener('click', () => {
    const id = youtubeId(c.origin.youtubeUrl);
    $('video-content').replaceChildren();
    if (id) {
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      frame.title = 'История появления Лизардины';
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      $('video-content').append(frame);
      const fallback = document.createElement('a');
      fallback.href = `https://www.youtube.com/watch?v=${id}`;
      fallback.target = '_blank'; fallback.rel = 'noopener noreferrer';
      fallback.textContent = 'Открыть на YouTube ↗'; fallback.className = 'back';
      $('video-content').append(fallback);
    } else {
      const text = document.createElement('p'); text.className = 'empty-message';
      text.textContent = 'Здесь будет тот самый старый ролик. Ссылка пока не добавлена.';
      $('video-content').append(text);
    }
    open($('video-dialog'));
  });

  if (c.school.drawing) $('school-drawing').append(photo({ src: c.school.drawing, alt: 'Наш рисунок школы', caption: 'место действия — школа' }));
  else {
    const drawing = document.createElement('div'); drawing.className = 'drawing-empty'; drawing.textContent = 'здесь будет рисунок школы'; $('school-drawing').append(drawing);
  }
  c.school.photos.forEach(data => $('school-photos').append(figure(data)));
  c.gallery.forEach(data => $('gallery').append(figure(data)));

  function renderBook() {
    const pages = c.book.pages;
    $('book-page').replaceChildren();
    const page = pages[bookPage];
    if (page) {
      const heading = document.createElement('h3'); heading.textContent = page.title || '';
      const text = document.createElement('p'); text.textContent = page.text || '';
      $('book-page').append(heading);
      if (page.image) $('book-page').append(image(page.image, `Страница ${bookPage + 1} истории «Уборщица Аня»`, true));
      if (page.text) $('book-page').append(text);
    } else {
      const text = document.createElement('p'); text.textContent = 'Здесь будет наша детская история.'; $('book-page').append(text);
    }
    $('page-count').textContent = `${pages.length ? bookPage + 1 : 0} / ${pages.length}`;
    $('prev-page').disabled = bookPage <= 0;
    $('next-page').disabled = bookPage >= pages.length - 1;
    $('book-dialog').scrollTop = 0;
  }
  $('book-button').addEventListener('click', () => { bookPage = 0; renderBook(); open($('book-dialog')); });
  $('prev-page').addEventListener('click', () => { if (bookPage > 0) { bookPage--; renderBook(); } });
  $('next-page').addEventListener('click', () => { if (bookPage < c.book.pages.length - 1) { bookPage++; renderBook(); } });

  $('letter-heading').textContent = c.letter.greeting;
  c.letter.paragraphs.forEach(text => { const p = document.createElement('p'); p.textContent = text; $('letter-content').append(p); });
  $('letter-signature').textContent = c.letter.signature;
  let letterImagesAdded = false;
  $('letter-button').addEventListener('click', () => {
    if (!letterImagesAdded) {
      c.letter.images.forEach((src, index) => $('letter-content').append(image(src, `Рукописное письмо, страница ${index + 1}`, index === 0)));
      letterImagesAdded = true;
    }
    open($('letter-dialog'));
  });
  $('large-photo').addEventListener('error', e => {
    if (e.target.getAttribute('src') !== placeholder) e.target.src = placeholder;
  });

  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.style.overflow = '';
      if (dialog.id === 'video-dialog') $('video-content').replaceChildren();
      lastFocused?.focus({ preventScroll: true });
    });
  });
})();
