const hubEscape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hubClean=t=>t.replace(/^【[^】]+】/,'').replace(/^歷史上的今天[》」]?\s*/,'').replace(/｜[^｜]+$/,'').trim();
const uniqueArticles=[...new Map(EVENTS.filter(e=>e.url).map(e=>[e.url,e])).values()];
const picks=uniqueArticles.slice().sort((a,b)=>a.date.localeCompare(b.date)).slice(0,6);
document.querySelector('#hub-articles').innerHTML=picks.map(e=>`<a class="story" href="${hubEscape(e.url)}" target="_blank" rel="noopener noreferrer" aria-label="${hubEscape(hubClean(e.title))}，在新分頁閱讀"><div class="story-top"><span class="date">${hubEscape(e.date.replace('/',' . '))}</span><span>歷史專欄</span></div><h3>${hubEscape(hubClean(e.title))}</h3><div class="story-bottom"><span>${hubEscape(e.year)} 年 · 五號位直球</span><span>閱讀專欄 ↗</span></div></a>`).join('');
const hubToday=new Date();document.querySelector('#hub-date').textContent=`${String(hubToday.getMonth()+1).padStart(2,'0')} / ${String(hubToday.getDate()).padStart(2,'0')}`;
