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
   const art=[
    '<path d="M13 43h36l7 8H9zM16 43l5-12h20l6 12M24 31l2-12h12l3 12M22 17h20M30 14v-5M13 51h38"/><circle cx="32" cy="39" r="4"/><path d="m10 25 7-3M46 22l7-4M12 17l5-1" />',
    '<path d="M11 16h16v16H11zM37 16h16v16H37zM11 41h16v13H11zM37 41h16v13H37zM19 16v16M45 16v16M19 41v13M45 41v13"/><path d="M19 8v5M45 8v5M19 35v3M45 35v3"/><path d="m6 8 5 5M58 8l-5 5" />',
    '<path d="M7 52V17h50v35M7 32h50M19 17V7h26v10M20 52V39h24v13M12 52h40"/><path d="M19 27h26M28 17v10M37 17v10"/><circle cx="14" cy="44" r="3"/><circle cx="50" cy="44" r="3"/>'
   ];
   const cards=[...points.querySelectorAll('article')];
   cards.forEach((card,i)=>{
    const icon=document.createElement('span');icon.className='rsl-problem-icon';
    icon.setAttribute('aria-hidden','true');
    icon.innerHTML='<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">'+art[i%art.length]+'</svg>';
    const index=card.querySelector('.rsl-problem-index');
    if(index)index.after(icon);else card.prepend(icon);
   });
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
    if(mobile.matches||reduced.matches){move(current/(items.length-1));return}
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
