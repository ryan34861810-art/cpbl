document.querySelectorAll('.page-switcher').forEach(nav=>{
 const links=[...nav.querySelectorAll('a')];
 nav.style.setProperty('--switch-position',String(Math.max(0,links.findIndex(a=>a.classList.contains('current')))));
 links.forEach((link,index)=>link.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target==='_blank')return;
  if(link.classList.contains('current')){event.preventDefault();return;}
  event.preventDefault();
  nav.style.setProperty('--switch-position',String(index));
  links.forEach(a=>a.classList.toggle('current',a===link));
  const delay=matchMedia('(prefers-reduced-motion: reduce)').matches?0:190;
  setTimeout(()=>location.assign(link.href),delay);
 }));
});
