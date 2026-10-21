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

 // Normal page flow stays intact. On roomy desktop viewports the three existing
 // problem statements form complete-width slides during vertical wheel/trackpad input.
 mm.add('(min-width:960px) and (min-height:760px) and (prefers-reduced-motion:no-preference)',()=>{
  const section=document.querySelector('#problem');
  const viewport=section?.querySelector('.rsl-problem-viewport');
  const track=section?.querySelector('.rsl-problem-points');
  const cards=track?[...track.querySelectorAll('article')]:[];
  const progress=section?.querySelector('.rsl-problem-meter-fill');
  const count=section?.querySelector('.rsl-problem-meter-label');
  if(!section||!viewport||!track||cards.length!==3)return;

  section.classList.add('rsl-gsap-active');
  let current=-1;
  function showProgress(p){
   const slide=Math.min(cards.length-1,Math.max(0,Math.round(p*(cards.length-1))));
   if(current!==slide){
    current=slide;
    cards.forEach((card,i)=>card.classList.toggle('is-current',i===slide));
   }
   if(progress)progress.style.transform='scaleX('+Math.max(0,Math.min(1,p))+')';
   if(count)count.textContent=String(slide+1).padStart(2,'0')+' / 03';
  }
  showProgress(0);

  // ScrollTrigger pins precisely this section. The spacer returns users to
  // ordinary vertical scrolling after slide 3 has passed.
  const tween=gsap.fromTo(track,{x:0},{
   x:()=>-Math.max(0,track.scrollWidth-viewport.clientWidth),
   ease:'none',
   scrollTrigger:{
    trigger:section,
    start:'top top',
    end:()=>'+='+Math.max(1150,Math.round(innerHeight*1.8)),
    pin:true,pinSpacing:true,scrub:0.85,
    invalidateOnRefresh:true,anticipatePin:1,
    onUpdate:self=>showProgress(self.progress)
   }
  });
  const refresh=()=>ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh).catch(()=>{});
  return ()=>{
   tween.scrollTrigger?.kill();
   tween.kill();
   section.classList.remove('rsl-gsap-active');
   cards.forEach(card=>card.classList.remove('is-current'));
   if(progress)progress.style.removeProperty('transform');
   gsap.set(track,{clearProps:'transform'});
  };
 });

 // Scroll-reveals: short, readable and restrained rather than a full-site parallax.
 mm.add('(prefers-reduced-motion:no-preference)',()=>{
  const titles=[
   '.rsl-solution-copy h2',
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
})();
