(() => {
  const data = window.FRIEND_CONTENT;
  const dialog = document.getElementById('vika-photo-dialog');
  const large = document.getElementById('vika-large');
  let trigger;
  function photoButton(photo, eager=false) {
    const button = document.createElement('button'); button.type='button';button.className='vika-image-button';button.setAttribute('aria-label','Увеличить: '+photo.alt);
    const image=document.createElement('img');image.src=photo.src;image.alt=photo.alt;image.width=photo.width;image.height=photo.height;image.loading=eager?'eager':'lazy';image.decoding='async';button.append(image);
    button.addEventListener('click',()=>{trigger=button;large.src=photo.full||photo.src;large.alt=photo.alt;document.getElementById('vika-large-caption').textContent=photo.caption||'';dialog.showModal();});return button;
  }
  function text(tag,cls,value){const el=document.createElement(tag);el.className=cls;el.textContent=value;return el;}
  const featured = new Set();
  if(data.duel){
    const duel=data.duel,section=document.getElementById('legendary-duel');section.className='duel';
    section.append(text('h2','hand duel-title',duel.title),text('p','duel-intro',duel.intro));
    const versus=document.createElement('div');versus.className='duel-versus';
    duel.participants.forEach((person,index)=>{
      featured.add(person.src);const figure=document.createElement('figure');figure.className='duel-contender';figure.append(photoButton(person,true),text('figcaption','hand',person.name));
      if(index)versus.append(text('span','hand duel-vs','VS'));
      versus.append(figure);
    });
    section.append(versus,text('p','hand duel-round','Раунд 1. Достоинство покинуло чат.'));
    const battle=document.createElement('figure');battle.className='duel-battle';battle.append(photoButton(duel.image),text('figcaption','hand duel-caption',duel.caption),text('p','duel-credit',duel.credit));section.append(battle);
    section.append(text('h2','hand duel-rest','а это — остальные улики'));
  }
  data.photos.filter(photo=>!featured.has(photo.src)).forEach((photo,index)=>{
    const figure=document.createElement('figure');figure.className='vika-photo';const caption=text('figcaption','hand',photo.caption);figure.append(photoButton(photo,index===0),caption);document.getElementById('vika-gallery').append(figure);
  });
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{large.removeAttribute('src');trigger?.focus({preventScroll:true});});
})();
