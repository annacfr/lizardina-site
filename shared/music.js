(() => {
  'use strict';
  const script = document.currentScript || [...document.scripts].find(s => s.src.endsWith('/shared/music.js'));
  const page = script.dataset.page;
  const base = new URL('../', script.src);
  const tracks = window.BANDA_AUDIO?.[page] || [];
  if (!tracks.some(t => t?.src)) return;
  const dock = document.createElement('aside');
  dock.className = 'music-dock'; dock.setAttribute('aria-label', 'Музыка этой страницы');
  dock.innerHTML = '<div class="music-heading"><div id="music-art"></div><p class="music-name" id="music-name"></p></div><audio controls preload="none" aria-label="Песня страницы"></audio><details><summary>песни этой страницы · 01 / 02</summary><ol class="music-list"></ol></details><p class="music-error" role="status" hidden></p>';
  document.body.append(dock); document.body.classList.add('has-music');
  const audio = dock.querySelector('audio'), name = dock.querySelector('.music-name'), art = dock.querySelector('#music-art'), list = dock.querySelector('.music-list'), error = dock.querySelector('.music-error');
  let current = -1;
  function select(index, play = false) {
    const track = tracks[index]; if (!track?.src) return;
    if (current !== index) {
      current = index; audio.pause(); audio.src = new URL(track.src, base).href;
      audio.setAttribute('aria-label', track.title); name.textContent = track.title;
      art.replaceChildren();
      const placeholder = () => { const empty = document.createElement('span'); empty.className = 'music-cover music-cover-empty'; empty.textContent = 'обложка'; art.replaceChildren(empty); };
      if (track.cover) { const image = document.createElement('img'); image.className = 'music-cover'; image.alt = 'Обложка: ' + track.title; image.src = new URL(track.cover, base).href; image.addEventListener('error', placeholder, {once:true}); art.append(image); } else placeholder();
      error.hidden = true;
      list.querySelectorAll('button').forEach(button => button.setAttribute('aria-current', String(Number(button.dataset.index) === index)));
      if ('mediaSession' in navigator && 'MediaMetadata' in window) navigator.mediaSession.metadata = new MediaMetadata({title:track.title,album:'Банда'});
    }
    if (play) audio.play().catch(() => { error.textContent = 'Нажми ▶ в проигрывателе, чтобы включить песню.'; error.hidden = false; });
  }
  for (let index = 0; index < Math.max(2, tracks.length); index++) {
    const li = document.createElement('li'), track = tracks[index];
    if (track?.src) { const button = document.createElement('button'); button.type = 'button'; button.dataset.index = index; button.textContent = String(index+1).padStart(2,'0') + ' — ' + track.title; button.addEventListener('click', () => select(index, true)); li.append(button); }
    else { li.className = 'music-future'; li.textContent = String(index+1).padStart(2,'0') + ' — здесь будет ещё одна песня'; }
    list.append(li);
  }
  audio.addEventListener('error', () => { error.textContent = 'Песня пока не загрузилась. Попробуй включить её ещё раз.'; error.hidden = false; });
  audio.addEventListener('ended', () => { const next = tracks.findIndex((t,i) => i > current && t?.src); if (next >= 0) select(next,true); });
  document.getElementById('video-button')?.addEventListener('click', () => audio.pause());
  select(tracks.findIndex(t => t?.src));
})();
