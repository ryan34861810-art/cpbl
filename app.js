const $=s=>document.querySelector(s);
const now=new Date();const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());const calendarYear=2000;let selected=new Date(calendarYear,today.getMonth(),today.getDate()), view=new Date(calendarYear,today.getMonth(),1),limit=9;
const key=d=>`${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
const displayDate=value=>value.split('/').map(Number).join('/');
const clean=t=>t.replace(/^【[^】]+】/,'').replace(/^歷史上的今天[》」]?\s*/,'').replace(/｜[^｜]+$/,'').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const category=e=>/中職|中華職棒/.test(e.title)?'中華職棒':/MLB|美國職棒/.test(e.title)?'MLB':'棒球故事';
const forDate=d=>EVENTS.filter(e=>e.date===key(d));

function contributionForm(id,date=''){
return `<form class="contribution-form" data-contribution><div class="eyebrow">SHARE YOUR BASEBALL MEMORY</div><h3 id="contribution-title">${date?esc(displayDate(date))+'，你記得什麼故事？':'你記得的棒球故事，值得被留下。'}</h3><p>球員生日、經典比賽，或一段難忘的棒球歷史，都歡迎分享。</p><label for="${id}-message">分享你的棒球故事${date?'（'+esc(displayDate(date))+'）':''}</label><textarea id="${id}-message" name="story" rows="4" maxlength="3000" required placeholder="寫下事件日期、人物與故事；有參考來源也可以一起附上。"></textarea><div class="contribution-actions"><small>示範表單，內容不會傳送或儲存。</small><button class="primary" type="submit">送出投稿 ↗</button></div><p class="contribution-feedback" role="status" aria-live="polite"></p></form>`;
}

function contributionPrompt(id,date=''){
return `<div class="contribution-prompt"><span>${date?'知道這一天的棒球故事？':'分享一段你記得的棒球歷史。'}</span><button type="button" class="contribution-open" data-contribute-date="${esc(date)}" aria-haspopup="dialog" aria-controls="contribution-dialog">我要投稿 ↗</button></div>`;
}
function row(e){return `<button class="event-row" data-event="${e.id}"><span class="event-year">${esc(e.year)}</span><div><h3>${esc(clean(e.title))}</h3><small>${category(e)} · 專欄文章</small></div><span class="arrow">↗</span></button>`}
$('#hero-month').textContent=`${today.getMonth()+1}/`;$('#hero-day').textContent=String(today.getDate());$('#hero-week').textContent=today.toLocaleDateString('zh-TW',{weekday:'long'});
$('#today-label').textContent=displayDate(key(today));const daily=forDate(today);$('#today-events').innerHTML=daily.length?daily.map(row).join(''):`<div class="empty"><span class="empty-symbol">↗</span><div><h3>這一天的歷史故事，待補上。</h3><p>棒球的記憶還在累積，先翻翻其他日子的經典時刻。</p></div><a href="#stories">探索專欄典藏 ↗</a></div>${contributionPrompt('today-contribution',key(today))}`;
function calendar(){const y=view.getFullYear(),m=view.getMonth();$('#month-label').textContent=`${m+1} 月`;let html='';for(let d=1;d<=new Date(y,m+1,0).getDate();d++){const dt=new Date(y,m,d),events=forDate(dt),isSelected=dt.getTime()===selected.getTime();html+=`<button class="day ${events.length?'has-event ':''}${isSelected?'selected ':''}${key(dt)===key(today)?'is-today':''}" data-day="${d}" aria-pressed="${isSelected}" aria-label="${m+1}月${d}日${events.length?'，'+events.length+'篇故事':'，尚無收錄'}">${d}</button>`}$('#calendar-grid').innerHTML=html;$('#selected-heading').textContent=`${displayDate(key(selected))} · 當日故事`;const entries=forDate(selected);$('#selected-events').innerHTML=entries.length?entries.map(row).join(''):`<p class="calendar-empty">這一天尚未收錄故事。歡迎分享你知道的棒球歷史。</p>${contributionPrompt('calendar-contribution',key(selected))}`}
$('#calendar-grid').addEventListener('click',e=>{const b=e.target.closest('[data-day]');if(b){selected=new Date(view.getFullYear(),view.getMonth(),+b.dataset.day);calendar()}});
$('#prev').onclick=()=>{view=new Date(calendarYear,(view.getMonth()+11)%12,1);calendar()};$('#next').onclick=()=>{view=new Date(calendarYear,(view.getMonth()+1)%12,1);calendar()};function reset(){selected=new Date(calendarYear,today.getMonth(),today.getDate());view=new Date(calendarYear,today.getMonth(),1);calendar()}$('#cal-today').onclick=reset;$('#return-today').onclick=()=>{reset();$('#calendar').scrollIntoView({behavior:'smooth'})};
const months=[...new Set(EVENTS.map(e=>e.date.slice(0,2)))].sort();months.forEach(m=>$('#month-filter').insertAdjacentHTML('beforeend',`<option value="${m}">${+m} 月</option>`));
function stories(){const q=$('#search').value.trim().toLocaleLowerCase(),m=$('#month-filter').value;const filtered=EVENTS.filter(e=>(!m||e.date.startsWith(m))&&`${e.title} ${e.year} ${e.date} ${displayDate(e.date)}`.toLocaleLowerCase().includes(q)).sort((a,b)=>a.date.localeCompare(b.date)||String(a.year).localeCompare(String(b.year)));$('#results-count').textContent=`${filtered.length} 篇故事`;$('#story-grid').innerHTML=filtered.length?filtered.slice(0,limit).map(e=>`<a class="story" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(clean(e.title))}，在新分頁閱讀 DAZN 專欄"><div class="story-top"><span class="date">${displayDate(e.date)}</span><span>${category(e)}</span></div><h3>${esc(clean(e.title))}</h3><div class="story-bottom"><span>${esc(e.year)} 年 · 五號位直球</span><span>閱讀專欄 ↗</span></div></a>`).join(''):'<p class="calendar-empty">找不到相關故事，試試其他關鍵字。</p>';$('#more').hidden=limit>=filtered.length}
$('#search').addEventListener('input',()=>{limit=9;stories()});$('#month-filter').onchange=()=>{limit=9;stories()};$('#more').onclick=()=>{limit+=9;stories()};
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-event]');if(!b)return;const e=EVENTS.find(x=>x.id===+b.dataset.event);$('#detail-date').textContent=`${displayDate(e.date)} · ${e.year} 年 · ${category(e)}`;$('#detail-title').textContent=clean(e.title);$('#detail-description').textContent=e.description||`${e.year} 年的這一天，棒球史留下了這段故事。${e.url?'前往五號位直球專欄，閱讀完整內容。':''}`;$('#detail-link').hidden=!e.url;if(e.url)$('#detail-link').href=e.url;$('#detail').showModal()});$('#close-detail').onclick=()=>$('#detail').close();$('#detail').addEventListener('click',e=>{if(e.target===$('#detail')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
for(const a of document.querySelectorAll('nav a'))a.addEventListener('click',()=>{document.querySelectorAll('nav a').forEach(x=>x.classList.remove('active'));a.classList.add('active')});
setInterval(()=>{if(new Date().toDateString()!==today.toDateString())location.reload()},60000);
calendar();stories();

$('#contribute').innerHTML=contributionPrompt('footer-contribution');
document.addEventListener('submit',event=>{
 const form=event.target.closest('[data-contribution]');if(!form)return;
 event.preventDefault();
 const input=form.querySelector('textarea');
 if(!input.value.trim()){input.setCustomValidity('請先寫下你想分享的棒球故事。');input.reportValidity();return;}
 input.setCustomValidity('');
 form.querySelector('.contribution-feedback').textContent='這是示範表單，投稿尚未傳送或儲存。你可以繼續編輯內容。';
});
document.addEventListener('input',event=>{
 if(event.target.matches('[data-contribution] textarea')){event.target.setCustomValidity('');event.target.closest('form').querySelector('.contribution-feedback').textContent='';}
});

const contributionDrafts=new Map();let contributionDate='';
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-contribute-date]');if(!button)return;
 contributionDate=button.dataset.contributeDate;
 $('#contribution-dialog-content').innerHTML=contributionForm('modal-contribution',contributionDate);
 $('#modal-contribution-message').value=contributionDrafts.get(contributionDate)||'';
 $('#contribution-dialog').showModal();
 $('#modal-contribution-message').focus();
});
$('#close-contribution').onclick=()=>$('#contribution-dialog').close();
$('#contribution-dialog').addEventListener('click',event=>{
 const dialog=event.currentTarget;if(event.target!==dialog)return;
 const rect=dialog.getBoundingClientRect();
 if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
});
document.addEventListener('input',event=>{
 if(event.target.id==='modal-contribution-message')contributionDrafts.set(contributionDate,event.target.value);
});
