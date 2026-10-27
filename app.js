'use strict';
const $ = id => document.getElementById(id);
const colors = [
 {id:'silver',name:'月光银',hex:'#B8BEC2',ink:'#303C43',title:'慢一点，也会抵达。',text:'种子在泥土里的时候，也在认真生长。允许自己休息片刻，你不需要一直证明自己的价值。',task:'去窗边看看，找一种今天才注意到的光。'},
 {id:'blue',name:'雾海蓝',hex:'#9FC7D5',ink:'#263F4B',title:'留白的地方，会有风。',text:'暂时不知道下一笔画在哪里，也没关系。空白不是失败，它是你还拥有许多可能的地方。',task:'抬头看一会儿天空，把手机暂时放在口袋。'},
 {id:'red',name:'朱砂红',hex:'#AF493D',ink:'#FFF6E9',title:'让喜欢的事，有一点声响。',text:'你可以认真对待自己的热爱，也可以承认它有时让人忐忑。今天不必交出漂亮的答案，愿意继续靠近它，就已经很好。',task:'挑一张自己喜欢的旧作，找回当时画它的心情。'},
 {id:'brown',name:'皮革棕',hex:'#79564A',ink:'#FFF7E9',title:'先把脚下的日子，过踏实。',text:'自由的生活，也可以有让人安心的小小秩序。一顿按时吃的饭、一张整理好的桌子，都在帮你慢慢站稳。',task:'收拾桌面的一小角，留给下一张想画的画。'},
 {id:'ink',name:'墨夜青',hex:'#35434A',ink:'#F7F3E9',title:'你不必一直发光。',text:'安静、低落、暂时没有灵感，也都是你的一部分。今晚先把自己安顿好，明天的颜色，明天再慢慢找。',task:'给自己留十分钟，不处理任何事情。'}
];
const dayKey = () => {const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
function hash(s){return [...s].reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),7);}
let day=dayKey(), daily=colors[hash(day+'又没人看')%colors.length], revealed=false;
const storage={get(k){try{return localStorage.getItem(k);}catch{return null;}},set(k,v){try{localStorage.setItem(k,v);return true;}catch{return false;}}};
let toastTimer;
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3200);}
function refreshDay(){if(day!==dayKey()){day=dayKey();daily=colors[hash(day+'又没人看')%colors.length];revealed=false;$('artworks').hidden=true;} $('date').textContent=day.replaceAll('-',' / ');}
function reveal(){refreshDay();revealed=true;$('reveal').style.background=daily.hex;$('reveal').style.color=daily.ink;$('reveal').setAttribute('aria-label','今日幸运色：'+daily.name+'，'+daily.hex);$('colorName').textContent=daily.name;$('colorHex').textContent=daily.hex+' · 今日专属';$('fortuneLabel').textContent='今日签语 · '+daily.name;$('fortuneTitle').textContent=daily.title;$('fortuneText').textContent=daily.text;$('tinyTask').textContent='今日小事 · '+daily.task;selectColor(daily.hex);storage.set('lucky-revealed',day);if(window.LuckyGallery)window.LuckyGallery.select(daily.id);}
refreshDay();document.addEventListener('visibilitychange',()=>{if(!document.hidden){const old=day;refreshDay();if(old!==day){$('colorName').textContent='给今天，一点色彩';$('colorHex').textContent='轻触，揭晓你的幸运色';$('reveal').style.background='';$('reveal').style.color='';}}});
$('reveal').onclick=reveal;
$('artOpen').onclick=()=>{reveal();window.LuckyGallery.select(daily.id);$('artworks').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
const dialog=$('letter');$('letterOpen').onclick=$('letterBottom').onclick=()=>dialog.showModal();$('letterClose').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
const canvas=$('canvas'),ctx=canvas.getContext('2d');let mode='flower',paint='#BE7C65',actions=[],active=null,pointerId=null;
try{const saved=JSON.parse(storage.get('lucky-garden-v1')||'[]');if(Array.isArray(saved))actions=saved.filter(a=>a&&['flower','pen','star'].includes(a.mode)&&/^#[\da-f]{6}$/i.test(a.color)&&Array.isArray(a.points)&&a.points.length&&a.points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y))).slice(-800);}catch{}
function selectColor(c){paint=c;$('customColor').value=c;document.querySelectorAll('.swatch').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color.toLowerCase()===c.toLowerCase())));}
colors.forEach(c=>{const b=document.createElement('button');b.className='swatch';b.style.background=c.hex;b.dataset.color=c.hex;b.setAttribute('aria-label',c.name);b.setAttribute('aria-pressed','false');b.onclick=()=>selectColor(c.hex);$('swatches').append(b);});
$('customColor').oninput=e=>selectColor(e.target.value);
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));});
function flower(p,color,seed){const size=20+(seed%13);ctx.save();ctx.translate(p.x,p.y);ctx.rotate((seed%31-15)*.015);ctx.strokeStyle='#7d8e69';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,5);ctx.quadraticCurveTo(-7,37,3,64);ctx.stroke();ctx.fillStyle='#9eac85';ctx.beginPath();ctx.ellipse(10,38,13,5,-.6,0,Math.PI*2);ctx.fill();ctx.fillStyle=color;for(let i=0;i<5;i++){ctx.save();ctx.rotate(i*Math.PI*2/5);ctx.beginPath();ctx.ellipse(0,-size*.67,size*.48,size*.65,0,0,Math.PI*2);ctx.fill();ctx.restore();}ctx.fillStyle='#f0d991';ctx.beginPath();ctx.arc(0,0,size*.3,0,Math.PI*2);ctx.fill();ctx.restore();}
function star(p,color,seed){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(seed);ctx.fillStyle=color;ctx.beginPath();for(let i=0;i<8;i++){const r=i%2?5:19;const a=i*Math.PI/4;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.restore();}
function drawAction(a){if(a.mode==='flower')flower(a.points[0],a.color,a.seed);else if(a.mode==='star')star(a.points[0],a.color,a.seed);else{ctx.strokeStyle=a.color;ctx.fillStyle=a.color;ctx.lineWidth=5;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();if(a.points.length===1){ctx.arc(a.points[0].x,a.points[0].y,2.5,0,Math.PI*2);ctx.fill();}else{a.points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();}}}
function redraw(){ctx.clearRect(0,0,1200,650);actions.forEach(drawAction);if(active)drawAction(active);}
let saveWarning=false;function persist(){if(!storage.set('lucky-garden-v1',JSON.stringify(actions))&&!saveWarning){toast('浏览器存储不可用，请用「保存小花园」留住作品。');saveWarning=true;}}
function pos(e){const r=canvas.getBoundingClientRect();return{x:Math.max(0,Math.min(1200,(e.clientX-r.left)/r.width*1200)),y:Math.max(0,Math.min(650,(e.clientY-r.top)/r.height*650))};}
canvas.addEventListener('pointerdown',e=>{if(active||(!e.isPrimary))return;e.preventDefault();pointerId=e.pointerId;canvas.setPointerCapture(pointerId);active={mode,color:paint,seed:Math.floor(Math.random()*10000),points:[pos(e)]};redraw();});
canvas.addEventListener('pointermove',e=>{if(!active||e.pointerId!==pointerId||active.mode!=='pen')return;if(active.points.length<10000)active.points.push(pos(e));redraw();});
function finish(e){if(!active||e.pointerId!==pointerId)return;actions.push(active);actions=actions.slice(-800);active=null;pointerId=null;redraw();persist();}
canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);
$('plant').onclick=()=>{actions.push({mode:mode==='pen'?'flower':mode,color:paint,seed:Math.floor(Math.random()*10000),points:[{x:60+Math.random()*1080,y:60+Math.random()*470}]});actions=actions.slice(-800);redraw();persist();};
$('undo').onclick=()=>{if(!actions.length)return toast('花园还是空白，可以先种一朵。');actions.pop();redraw();persist();};
$('clear').onclick=()=>{if(!actions.length)return;if(confirm('清空这座小花园吗？可以先保存图片。')){actions=[];redraw();persist();}};
$('save').onclick=()=>{const out=document.createElement('canvas');out.width=1200;out.height=740;const c=out.getContext('2d');c.fillStyle='#fbf9f1';c.fillRect(0,0,1200,740);c.drawImage(canvas,0,0);c.fillStyle='#52664b';c.font='22px serif';c.fillText('慢慢有光 · 又没人看的小花园',38,697);c.font='15px sans-serif';c.fillText(day,1030,697);out.toBlob(blob=>{if(!blob)return toast('图片生成失败，请再试一次。');const url=URL.createObjectURL(blob),a=document.createElement('a');a.download='慢慢有光-'+day+'.png';a.href=url;a.click();setTimeout(()=>URL.revokeObjectURL(url),15000);toast('图片已生成；手机上也可在下载列表中保存。');},'image/png');};
$('share').onclick=async()=>{const data={title:'慢慢有光 · 给又没人看',text:'今天也有你的颜色。送你一座可以种花的小花园。',url:location.href.split('#')[0]};try{if(navigator.share){await navigator.share(data);}else if(navigator.clipboard){await navigator.clipboard.writeText(data.url);toast('链接已复制，可以发给在意的人了。');}else prompt('复制这条链接，分享这束光：',data.url);}catch(e){if(e.name!=='AbortError')prompt('复制这条链接，分享这束光：',data.url);}};
redraw();if(storage.get('lucky-revealed')===day)reveal();




window.initLuckyGallery({palettes:colors,currentColor:revealed?daily.id:null});