(()=>{
'use strict';
const comparisons=[...document.querySelectorAll('#ergebnisse .comparison-card')];
['01 · Rost / Metall','02 · Graffiti / Stein','03 · Farbe / Holz'].forEach((name,i)=>{
 const el=comparisons[i];if(!el)return;
 const tab=document.createElement('div');tab.className='rsl-folder-tab';tab.setAttribute('aria-hidden','true');
 tab.innerHTML='<span>'+name+'</span>';el.prepend(tab);
});
/* Zusammenarbeit bleibt auf Mobile eine normale Zeitleiste (wie Desktop, nur mit
   kleineren Bildern) statt eigener Sticky-Karten; keine zusätzliche Wrapper-Logik nötig. */
// Visual demonstration only; no optional tracking code is loaded.
const banner=document.createElement('aside');banner.className='rsl-demo-banner';
banner.setAttribute('aria-label','Cookie-Einstellungen, Designentwurf');
banner.innerHTML='<span class="rsl-demo-eyebrow">Designentwurf · Cookie-Einstellungen</span>'+
'<h2>Ihre Privatsphäre.</h2>'+
'<p>Diese Vorschau zeigt, wie die spätere Cookie-Auswahl aussehen könnte. Aktuell sind keine optionalen Analyse- oder Marketingdienste eingebunden.</p>'+
'<p class="rsl-demo-note">Demo-Hinweis: Die Auswahl aktiviert keine Tracker. Ein produktiver Consent-Dienst folgt nach Festlegung der tatsächlich eingesetzten Dienste.</p>'+
'<p><a href="datenschutz.html">Datenschutz-Entwurf ansehen</a></p>'+
'<div class="rsl-demo-actions"><button type="button" data-rsl-demo="all">Alle akzeptieren (Demo)</button><button type="button" data-rsl-demo="necessary">Nur notwendige</button><button type="button" class="rsl-demo-settings" data-rsl-demo="settings">Einstellungen</button></div>'+
'<div class="rsl-demo-preferences" hidden>'+
'<label><span>Notwendig<small>Technische Basisfunktionen.</small></span><input type="checkbox" checked disabled></label>'+
'<label><span>Statistik<small>Zukunftsoption, derzeit inaktiv.</small></span><input type="checkbox" name="stats"></label>'+
'<label><span>Externe Medien<small>Zukunftsoption, derzeit inaktiv.</small></span><input type="checkbox" name="media"></label>'+
'<label><span>Marketing<small>Zukunftsoption, derzeit inaktiv.</small></span><input type="checkbox" name="marketing"></label>'+
'<button type="button" class="rsl-demo-save" data-rsl-demo="save">Demo-Auswahl speichern</button></div>';
document.body.appendChild(banner);
const footer=document.querySelector('footer .footer-links');
if(footer){
 const b=document.createElement('button');b.type='button';b.className='rsl-demo-footer-link';b.textContent='Cookie-Einstellungen (Demo)';
 b.addEventListener('click',()=>{banner.hidden=false;banner.querySelector('[data-rsl-demo="necessary"]').focus()});footer.appendChild(b);
}
const prefs=banner.querySelector('.rsl-demo-preferences');
function save(choice){
 try{sessionStorage.setItem('rsl_preview_cookie_demo',JSON.stringify({choice,options:[...prefs.querySelectorAll('input:not([disabled])')].map(x=>({name:x.name,checked:x.checked}))}))}catch(e){}
 banner.hidden=true;
}
banner.addEventListener('click',e=>{
 const action=e.target.closest('[data-rsl-demo]')?.dataset.rslDemo;
 if(!action)return;
 if(action==='settings'){prefs.hidden=!prefs.hidden;return}
 if(action==='all'){prefs.querySelectorAll('input:not([disabled])').forEach(c=>c.checked=true);save('all')}
 if(action==='necessary'){prefs.querySelectorAll('input:not([disabled])').forEach(c=>c.checked=false);save('necessary')}
 if(action==='save')save('custom');
});
try{banner.hidden=Boolean(sessionStorage.getItem('rsl_preview_cookie_demo'))}catch(e){}
})();
