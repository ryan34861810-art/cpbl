const hubToday=new Date();document.querySelector('#hub-date').textContent=`${String(hubToday.getMonth()+1).padStart(2,'0')} / ${String(hubToday.getDate()).padStart(2,'0')}`;
const tabs=[...document.querySelectorAll('[role="tab"]')];
const panels=[...document.querySelectorAll('[role="tabpanel"]')];
function selectContentTab(){
 const requested=location.hash.slice(1);const id=tabs.some(t=>t.id==='tab-'+requested)?requested:'home';
 for(const tab of tabs){const active=tab.id==='tab-'+id;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;tab.classList.toggle('active',active)}
 for(const panel of panels)panel.hidden=panel.id!=='panel-'+id;
}
addEventListener('hashchange',selectContentTab);
for(const tab of tabs){
 tab.addEventListener('click',event=>{event.preventDefault();history.pushState(null,'',tab.getAttribute('href'));selectContentTab();});
 tab.addEventListener('keydown',event=>{
  const index=tabs.indexOf(tab);let next;
  if(event.key==='ArrowRight')next=(index+1)%tabs.length;
  else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
  else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;
  event.preventDefault();tabs[next].click();tabs[next].focus();
 });
}
selectContentTab();
