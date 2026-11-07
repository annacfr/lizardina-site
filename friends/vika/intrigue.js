(() => {
  const { title, subtitle, chapters } = window.VIKA_INTRIGUE;
  const cover = document.getElementById('intrigue-cover');
  const reader = document.getElementById('intrigue-reader');
  const sheet = document.getElementById('intrigue-sheet');
  const heading = document.getElementById('intrigue-page-title');
  const content = document.getElementById('intrigue-page-content');
  const previous = document.getElementById('intrigue-previous');
  const next = document.getElementById('intrigue-next');
  const counter = document.getElementById('intrigue-page-number');
  let page = 0;

  document.getElementById('intrigue-cover-title').textContent = title;
  document.getElementById('intrigue-subtitle').textContent = subtitle;

  function paragraph(text) {
    const block = document.createElement('p');
    text.split('**').forEach((part, index) => {
      if (index % 2 === 0) {
        block.append(part);
      } else {
        const emphasis = document.createElement('strong');
        emphasis.textContent = part;
        block.append(emphasis);
      }
    });
    return block;
  }

  function illustration(chapter) {
    const image = document.createElement('img');
    image.src = 'photos/intrigue/' + chapter.image + '.jpg';
    image.alt = chapter.alt;
    image.decoding = 'async';
    image.className = 'intrigue-illustration';
    return image;
  }

  function renderPage() {
    const chapter = chapters[page];
    heading.textContent = chapter.title;
    content.replaceChildren();
    if (chapter.date) {
      const date = document.createElement('p');
      date.className = 'intrigue-date';
      date.textContent = chapter.date;
      content.append(date);
    }
    if (chapter.image && !chapter.imageAtEnd) content.append(illustration(chapter));
    content.append(...chapter.paragraphs.map(paragraph));
    if (chapter.imageAtEnd) content.append(illustration(chapter));
    previous.disabled = page === 0;
    next.disabled = page === chapters.length - 1;
    counter.textContent = (page + 1) + ' / ' + chapters.length;
    sheet.scrollTop = 0;
  }

  function turnPage(offset) {
    const target = page + offset;
    if (target < 0 || target >= chapters.length) return;
    page = target;
    renderPage();
    heading.focus({ preventScroll: true });
  }

  cover.addEventListener('click', () => {
    page = 0;
    renderPage();
    reader.showModal();
    heading.focus({ preventScroll: true });
  });
  previous.addEventListener('click', () => turnPage(-1));
  next.addEventListener('click', () => turnPage(1));
  document.getElementById('intrigue-close').addEventListener('click', () => reader.close());
  reader.addEventListener('close', () => cover.focus({ preventScroll: true }));
})();
