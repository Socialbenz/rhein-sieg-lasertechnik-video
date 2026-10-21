/* Rhein-Sieg Lasertechnik: GSAP 3.15 / ScrollTrigger – 21.10.2026
   Motion is an enhancement only; mobile, blocked scripts and reduced-motion
   users can always read every full card without pinning or clipping. */
(()=>{
 'use strict';
 if(!window.gsap||!window.ScrollTrigger)return;
 const {gsap,ScrollTrigger}=window;
 gsap.registerPlugin(ScrollTrigger);
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const mm=gsap.matchMedia();

 // Normal page flow stays intact. On roomy desktop viewports the left headline
 // stays put while the three problem statements crossfade in the right column
 // as the visitor scrolls through the pinned section.
 mm.add('(min-width:960px) and (min-height:760px) and (prefers-reduced-motion:no-preference)',()=>{
  const section=document.querySelector('#problem');
  const viewport=section?.querySelector('.rsl-problem-viewport');
  const points=section?.querySelector('.rsl-problem-points');
  const cards=points?[...points.querySelectorAll('article')]:[];
  const progress=section?.querySelector('.rsl-problem-meter-fill');
  const count=section?.querySelector('.rsl-problem-meter-label');
  if(!section||!viewport||!points||cards.length!==3)return;

  section.classList.add('rsl-split-active');
  gsap.set(cards,{opacity:0,y:14});
  gsap.set(cards[0],{opacity:1,y:0});
  cards[0].classList.add('is-current');

  // Each card holds roughly a third of the scroll range, with short
  // crossfade windows between them rather than a hard cut.
  const b=[0,.3,.42,.58,.7,1];
  function visibility(i,p){
   if(i===0)return p<=b[1]?1:p>=b[2]?0:1-(p-b[1])/(b[2]-b[1]);
   if(i===1){
    if(p<=b[1])return 0;
    if(p<=b[2])return(p-b[1])/(b[2]-b[1]);
    if(p<=b[3])return 1;
    if(p<=b[4])return 1-(p-b[3])/(b[4]-b[3]);
    return 0;
   }
   if(p<=b[3])return 0;
   if(p<=b[4])return(p-b[3])/(b[4]-b[3]);
   return 1;
  }
  let current=-1;
  function applyProgress(p){
   cards.forEach((card,i)=>{
    const v=visibility(i,p);
    gsap.set(card,{opacity:v,y:(1-v)*14});
   });
   const slide=p<b[2]?0:(p<b[4]?1:2);
   if(current!==slide){
    current=slide;
    cards.forEach((card,i)=>card.classList.toggle('is-current',i===slide));
   }
   if(progress)progress.style.transform='scaleX('+Math.max(0,Math.min(1,p))+')';
   if(count)count.textContent=String(slide+1).padStart(2,'0')+' / 03';
  }
  applyProgress(0);

  // ScrollTrigger pins precisely this section. The spacer returns users to
  // ordinary vertical scrolling after the third card has settled.
  const trigger=ScrollTrigger.create({
   trigger:section,
   start:'top top',
   end:()=>'+='+Math.max(820,Math.round(innerHeight*0.95)),
   pin:true,pinSpacing:true,scrub:0.6,
   invalidateOnRefresh:true,anticipatePin:1,
   onUpdate:self=>applyProgress(self.progress)
  });
  const refresh=()=>ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh).catch(()=>{});
  return ()=>{
   trigger.kill();
   section.classList.remove('rsl-split-active');
   cards.forEach(card=>{card.classList.remove('is-current');gsap.set(card,{clearProps:'opacity,transform'})});
   if(progress)progress.style.removeProperty('transform');
  };
 });

 // Scroll-reveals: short, readable and restrained rather than a full-site parallax.
 mm.add('(prefers-reduced-motion:no-preference)',()=>{
  const titles=[
   '.rsl-solution-copy h2',
   '.rsl-benefits-intro h2',
   '#anwendungen h2',
   '#ergebnisse h2',
   '.tech-copy h2',
   '.rsl-timeline-text h2',
   '.team h2',
   '.faq-modern h2',
   '.contact h2'
  ];
  titles.forEach(selector=>{
   const el=document.querySelector(selector);
   if(!el)return;
   gsap.from(el,{
    y:30,autoAlpha:0,duration:.95,ease:'power3.out',clearProps:'all',
    scrollTrigger:{trigger:el,start:'top 89%',once:true}
   });
  });

  const groups=[
   {trigger:'.rsl-solution-benefits',children:'.rsl-solution-benefits > div',dx:0,dy:25},
   {trigger:'.rsl-benefits-grid',children:'.rsl-benefits-grid article',dx:0,dy:22},
   {trigger:'.tech-steps',children:'.tech-steps > div',dx:20,dy:8},
   {trigger:'.team .people',children:'.team .person',dx:0,dy:28},
   {trigger:'.faq-modern .faq-list',children:'.faq-modern details',dx:0,dy:18},
   {trigger:'.contact .form-grid',children:'.contact .field',dx:0,dy:14},
   {trigger:'footer .footer-top',children:'footer .footer-top > *',dx:0,dy:15}
  ];
  groups.forEach(group=>{
   const nodes=gsap.utils.toArray(group.children);
   if(!nodes.length)return;
   gsap.from(nodes,{
    x:group.dx,y:group.dy,autoAlpha:0,duration:.66,
    stagger:.095,ease:'power2.out',clearProps:'all',
    scrollTrigger:{trigger:group.trigger,start:'top 88%',once:true}
   });
  });

  // A slight photographic reveal on the solution visual.
  const solution=document.querySelector('.rsl-solution-figure .rsl-solution-photo');
  if(solution){
   gsap.from(solution,{
    scale:1.065,duration:1.3,ease:'power2.out',clearProps:'transform',
    scrollTrigger:{trigger:solution,start:'top 91%',once:true}
   });
  }

  // Soft outline draw / tactile hover is handled in rsl-gsap-motion.css.
  const foot=document.querySelector('footer');
  if(foot){
   gsap.from(foot,{backgroundColor:'#071e36',duration:1,ease:'power1.out',clearProps:'backgroundColor',
    scrollTrigger:{trigger:foot,start:'top 94%',once:true}});
  }

  // Active step photos are already changed by the timeline controller; GSAP
  // adds only a small tactile image reveal and never overrides its progress line.
  const visual=document.querySelector('.rsl-timeline-visual');
  if(visual)gsap.from(visual,{y:22,autoAlpha:0,duration:1,ease:'power2.out',clearProps:'all',
   scrollTrigger:{trigger:visual,start:'top 90%',once:true}});
 });

 // Layout can change after fonts and images settle, and after tab/mobile resize.
 addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});

 // Benefit icons: subtle single-run animation on first scroll-into-view, replayed on hover/focus.
 const icons=[...document.querySelectorAll('.rsl-animated-icon')];
 if(icons.length){
  const play=icon=>{if(reduce.matches)return;icon.classList.remove('rsl-micro-play');void icon.offsetWidth;icon.classList.add('rsl-micro-play')};
  if('IntersectionObserver' in window){
   const observer=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){play(entry.target);observer.unobserve(entry.target)}
   },{threshold:.5});
   icons.forEach(icon=>observer.observe(icon));
  }
  icons.forEach(icon=>{
   const holder=icon.closest('article,button,.step')||icon;
   holder.addEventListener('pointerenter',()=>play(icon));
   holder.addEventListener('focusin',()=>play(icon));
  });
 }
})();
