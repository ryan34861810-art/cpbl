const hubToday=new Date();document.querySelector('#hub-date').textContent=`${String(hubToday.getMonth()+1).padStart(2,'0')} / ${String(hubToday.getDate()).padStart(2,'0')}`;
const sectionLinks=[...document.querySelectorAll('.section-navigation a')];
function markSection(){const hash=location.hash||'#home';for(const a of sectionLinks)a.classList.toggle('active',a.getAttribute('href')===hash);}
addEventListener('hashchange',markSection);markSection();
