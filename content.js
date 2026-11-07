const hubToday=new Date();document.querySelector('#hub-date').textContent=`${hubToday.getMonth()+1}/${hubToday.getDate()}`;
const sectionLinks=[...document.querySelectorAll('.section-navigation a')];
function markSection(){const hash=location.hash||'#home';for(const a of sectionLinks)a.classList.toggle('active',a.getAttribute('href')===hash);}
addEventListener('hashchange',markSection);markSection();
