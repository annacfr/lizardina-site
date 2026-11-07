(() => {
  const envelope = document.getElementById('letter-button');
  const dialog = document.getElementById('letter-dialog');
  const close = dialog.querySelector('button');

  envelope.addEventListener('click', () => dialog.showModal());
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => envelope.focus({ preventScroll: true }));
})();
