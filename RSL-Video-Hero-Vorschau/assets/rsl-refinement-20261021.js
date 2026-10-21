/* Rhein-Sieg Lasertechnik – gezielte Motion-Ergänzungen; keine Änderungen an main. */
(()=>{
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 // Der Motivwähler gehört zur Hero und darf nicht über dem Footer schweben.
 const hero=document.querySelector('main>.hero');
 const picker=document.querySelector('.video-hero-preview');
 if(hero&&picker){hero.appendChild(picker);picker.classList.remove('is-away')}

 // Für beide Porträts identische feste Bildfenster statt verschiedener optischer Größen.
 document.querySelectorAll('.team .rsl-team-photo').forEach(img=>{
  if(img.parentElement.classList.contains('rsl-team-frame'))return;
  const frame=document.createElement('span');
  frame.className='rsl-team-frame';
  img.before(frame);frame.appendChild(img);
 });

 // Drei vorhandene Problemtexte bleiben unverändert; Symbole und eine Scrollbühne ergänzen sie.
 const problem=document.querySelector('.rsl-problem');
 if(problem){
  const wrap=problem.querySelector(':scope > .wrap');
  const points=problem.querySelector('.rsl-problem-points');
  if(wrap&&points){
   const sticky=document.createElement('div');sticky.className='rsl-problem-sticky';
   wrap.before(sticky);sticky.appendChild(wrap);
   const viewport=document.createElement('div');viewport.className='rsl-problem-viewport';
   points.before(viewport);viewport.appendChild(points);
   // Anschauliche Symbole: Schleifgerät / Materialprüfung / fest verbautes Bauteil.
   // Kundenfreigabe: Problem-Section ohne Icons.
   const cards=[...points.querySelectorAll('article')];
   const meter=document.createElement('div');meter.className='rsl-problem-meter';meter.setAttribute('aria-hidden','true');
   meter.innerHTML='<span class="rsl-problem-meter-label">01 / 03</span><span class="rsl-problem-meter-track"><span class="rsl-problem-meter-fill"></span></span><span class="rsl-problem-meter-hint">Weiter scrollen ↘</span>';
   viewport.after(meter);
   const fill=meter.querySelector('.rsl-problem-meter-fill'),label=meter.querySelector('.rsl-problem-meter-label');
   /* Kartennavigation steuert jetzt GSAP ScrollTrigger in rsl-gsap-motion.js. */

  }
 }

 // Vier Arbeitsschritte: Scrollposition bewegt den Punkt kontinuierlich auf der Linie.
 const section=document.querySelector('.rsl-timeline');
 if(section){
  const items=[...section.querySelectorAll('.rsl-timeline-step')];
  const photos=[...section.querySelectorAll('.rsl-timeline-image')];
  if(items.length===4&&photos.length===4){
   const list=section.querySelector('.rsl-timeline-steps'),mobile=matchMedia('(max-width:760px)');
   const line=document.createElement('span'),runner=document.createElement('span');
   line.className='rsl-timeline-line-fill';runner.className='rsl-timeline-runner';
   line.setAttribute('aria-hidden','true');runner.setAttribute('aria-hidden','true');
   list.prepend(runner);list.prepend(line);
   let current=0,raf=0,interactionUntil=0;
   photos.forEach((photo,i)=>{
    const preview=document.createElement('figure');preview.className='rsl-timeline-mobile-preview';
    preview.id='rsl-timeline-mobile-image-'+i;
    const image=photo.querySelector('img,.rsl-timeline-scene'),caption=photo.querySelector('figcaption');
    if(image)preview.append(image.cloneNode(true));
    if(caption)preview.append(caption.cloneNode(true));
    items[i].insertAdjacentElement('afterend',preview);
   });
   section.classList.add('is-mobile-enhanced');
   function syncControls(){
    items.forEach((el,i)=>el.setAttribute('aria-controls',mobile.matches?'rsl-timeline-mobile-image-'+i:'rsl-timeline-image-'+i));
   }
   function activate(index){
    current=index;
    items.forEach((el,i)=>{el.classList.toggle('is-active',i===index);el.setAttribute('aria-expanded',String(i===index))});
    photos.forEach((photo,i)=>{photo.hidden=i!==index;photo.classList.toggle('is-active',i===index)});
   }
   function positions(){return items.map(el=>el.offsetTop+30.5)}
   function move(progress){
    const ys=positions(),a=ys[0],b=ys[ys.length-1],p=Math.max(0,Math.min(1,progress));
    line.style.top=a+'px';line.style.height=Math.max(0,b-a)+'px';line.style.transform='scaleY('+p+')';
    runner.style.transform='translate3d(0,'+(a+(b-a)*p-7)+'px,0)';
   }
   items.forEach((el,i)=>el.addEventListener('click',()=>{
    interactionUntil=Date.now()+2000;
    runner.style.transition='';
    activate(i);move(i/(items.length-1));
   }));
   function update(){
    raf=0;
    if(reduced.matches){move(current/(items.length-1));return}
    const top=items[0].getBoundingClientRect().top+30.5;
    const bottom=items[items.length-1].getBoundingClientRect().top+30.5;
    const progress=Math.max(0,Math.min(1,(innerHeight*.47-top)/Math.max(1,bottom-top)));
    if(Date.now()<interactionUntil)return;
    runner.style.transition='none';
    move(progress);
    const next=Math.round(progress*(items.length-1));
    if(next!==current)activate(next);
   }
   function tick(){if(!raf)raf=requestAnimationFrame(update)}
   addEventListener('scroll',tick,{passive:true});
   addEventListener('resize',tick,{passive:true});
   mobile.addEventListener?.('change',()=>{syncControls();tick()});
   syncControls();activate(0);tick();
  }
 }

 // Reveal-Animationen werden zentral über GSAP mit Reduced-Motion-Fallback gesteuert.

})();
