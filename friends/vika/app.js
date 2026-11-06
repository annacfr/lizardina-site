(() => {
  const dialog = document.getElementById('vika-photo-dialog');
  const large = document.getElementById('vika-large');
  let trigger;
  window.FRIEND_CONTENT.photos.forEach((photo, index) => {
    const figure = document.createElement('figure'); figure.className = 'vika-photo';
    const button = document.createElement('button'); button.type = 'button'; button.setAttribute('aria-label','Увеличить: '+photo.alt);
    const image = document.createElement('img'); image.src = photo.src; image.alt = photo.alt;
    image.width = photo.width; image.height = photo.height; image.loading = index ? 'lazy' : 'eager'; image.decoding = 'async';
    button.append(image);
    const caption = document.createElement('figcaption'); caption.className = 'hand'; caption.textContent = photo.caption;
    figure.append(button,caption); document.getElementById('vika-gallery').append(figure);
    button.addEventListener('click',() => { trigger = button; large.src = photo.full || photo.src; large.alt = photo.alt; document.getElementById('vika-large-caption').textContent = photo.caption; dialog.showModal(); });
  });
  dialog.querySelector('button').addEventListener('click',() => dialog.close());
  dialog.addEventListener('click',e => { if(e.target === dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();} });
  dialog.addEventListener('close',() => { large.removeAttribute('src'); trigger?.focus({preventScroll:true}); });
})();
