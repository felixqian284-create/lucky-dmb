'use strict';
window.initLuckyGallery = function({palettes,currentColor=null}) {
 const root=document.getElementById('artContent'),section=document.getElementById('artworks');
 const works=window.ARTWORKS||[];let selected='all',items=[],index=0,scrollFrame=0;
 section.hidden=false;root.replaceChildren();
 const filters=document.createElement('div');filters.className='gallery-filters';filters.setAttribute('role','group');filters.setAttribute('aria-label','按作品色系筛选');
 const intro=document.createElement('p');intro.className='gallery-intro';intro.textContent='左右滑动，慢慢翻看。每一张，都来自你画过的世界。';
 const track=document.createElement('div');track.className='gallery-track';track.tabIndex=0;track.setAttribute('role','region');track.setAttribute('aria-roledescription','轮播画廊');track.setAttribute('aria-label','又没人看的作品，左右滑动或使用方向键切换');
 const bar=document.createElement('div');bar.className='gallery-bar';
 const previous=document.createElement('button'),next=document.createElement('button'),counter=document.createElement('span'),dots=document.createElement('div');
 const chevron=direction=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="${direction==='left'?'m14 5-7 7 7 7':'m10 5 7 7-7 7'}"/></svg>`;
 previous.innerHTML=chevron('left');next.innerHTML=chevron('right');previous.setAttribute('aria-label','上一张画作');next.setAttribute('aria-label','下一张画作');counter.className='gallery-counter';counter.setAttribute('aria-live','polite');counter.setAttribute('aria-atomic','true');dots.className='gallery-dots';dots.setAttribute('role','group');dots.setAttribute('aria-label','选择画作');
 const controls=document.createElement('div');controls.className='gallery-controls';controls.append(previous,counter,next);bar.append(dots,controls);root.append(filters,intro,track,bar);
 const choices=[{id:'all',name:'全部画作'},...palettes];
 choices.forEach(c=>{const button=document.createElement('button');button.type='button';button.dataset.filter=c.id;button.setAttribute('aria-pressed','false');if(c.hex){const swatch=document.createElement('span');swatch.className='filter-swatch';swatch.style.background=c.hex;button.append(swatch);}button.append(document.createTextNode(c.name));button.onclick=()=>select(c.id);filters.append(button);});
 function update(){counter.textContent=String(index+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');previous.disabled=index===0;next.disabled=index===items.length-1;Array.from(dots.children).forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===index));b.setAttribute('aria-label','第 '+(i+1)+' 张：'+items[i].title);});Array.from(track.children).forEach((f,i)=>f.setAttribute('aria-label',(i+1)+' / '+items.length+'，'+items[i].title));}
 function go(i){index=Math.max(0,Math.min(items.length-1,i));const slide=track.children[index];if(slide)track.scrollTo({left:slide.offsetLeft-track.children[0].offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});update();}
 function select(id){if(!choices.some(c=>c.id===id))id='all';selected=id;items=works.filter(a=>id==='all'||a.colors.includes(id));index=0;track.replaceChildren();dots.replaceChildren();Array.from(filters.children).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===id)));items.forEach((a,i)=>{
  const slide=document.createElement('figure');slide.className='gallery-slide';slide.setAttribute('role','group');slide.setAttribute('aria-roledescription','画作');
  const zoom=document.createElement('a');zoom.className='gallery-picture';zoom.href=a.src;zoom.target='_blank';zoom.rel='noopener';zoom.setAttribute('aria-label','放大欣赏：'+a.title);
  const image=document.createElement('img');image.src=a.src;image.alt='又没人看的插画：'+a.title;image.loading=i===0?'eager':'lazy';image.decoding='async';zoom.append(image);
  const caption=document.createElement('figcaption'),title=document.createElement('h3'),author=document.createElement('span'),detail=document.createElement('p'),link=document.createElement('a');caption.className='gallery-caption';title.textContent=a.title;author.textContent='又没人看';author.className='gallery-author';detail.textContent=a.detail||'';link.textContent='查看原作';link.href=a.url;link.target='_blank';link.rel='noopener noreferrer';link.className='gallery-original';caption.append(title,author,detail,link);slide.append(zoom,caption);track.append(slide);
  const dot=document.createElement('button');dot.type='button';dot.onclick=()=>go(i);dots.append(dot);
 });track.scrollTo({left:0,behavior:'instant'});update();intro.textContent=id==='all'?'左右滑动，慢慢翻看。每一张，都来自你画过的世界。':choices.find(c=>c.id===id).name+' · '+items.length+' 张作品，左右滑动欣赏。';}
 previous.onclick=()=>go(index-1);next.onclick=()=>go(index+1);
 track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(index+1);}else if(e.key==='ArrowLeft'){e.preventDefault();go(index-1);}else if(e.key==='Home'){e.preventDefault();go(0);}else if(e.key==='End'){e.preventDefault();go(items.length-1);}});
 track.addEventListener('scroll',()=>{cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(()=>{const first=track.children[0];if(!first)return;let nearest=0,distance=Infinity;Array.from(track.children).forEach((slide,i)=>{const d=Math.abs(slide.offsetLeft-first.offsetLeft-track.scrollLeft);if(d<distance){distance=d;nearest=i;}});if(index!==nearest){index=nearest;update();}});},{passive:true});
 window.LuckyGallery={select};select(currentColor||'all');
};