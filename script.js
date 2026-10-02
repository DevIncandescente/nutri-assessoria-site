'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(){ navigation.classList.remove('is-open'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Abrir menu'); }
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true'; navigation.classList.toggle('is-open',open); menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{navigation.querySelectorAll('a').forEach(a=>a.classList.remove('active'));link.classList.add('active');closeMenu();}));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
const services=[
 ['Consultoria em Segurança Alimentar','Orientação para adequar a rotina do seu negócio às boas práticas de manipulação e à segurança dos alimentos.'],
 ['Regularização Sanitária','Acompanhamento das adequações e dos processos necessários à regularização sanitária do estabelecimento.'],
 ['Responsabilidade Técnica','Acompanhamento técnico dos processos relacionados à qualidade e à segurança dos alimentos.'],
 ['Auditorias de Qualidade','Avaliação das práticas e dos processos da operação para identificar riscos e orientar melhorias.'],
 ['Treinamento de Equipes','Capacitação da equipe para aplicar boas práticas de higiene, manipulação e segurança dos alimentos no dia a dia.'],
 ['Documentação Sanitária','Orientação na organização dos documentos e registros que apoiam a rotina de controle sanitário.'],
 ['Assessoria para Eventos','Acompanhamento dos cuidados com os alimentos e das boas práticas durante a organização e a realização de eventos.'],
 ['Conformidade Sanitária','Acompanhamento das condições da operação e orientação para atender às exigências sanitárias aplicáveis.']
];
const dialog=document.querySelector('#service-dialog');
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{const [title,description]=services[Number(button.dataset.service)];document.querySelector('#dialog-title').textContent=title;document.querySelector('#dialog-description').textContent=description;document.querySelector('#dialog-contact').href='https://wa.me/5511952389224?text='+encodeURIComponent('Olá! Gostaria de saber mais sobre '+title+'.');dialog.showModal();}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
const testimonialFigure=document.querySelector('.testimonials figure');
const testimonialSection=document.querySelector('.testimonials');
const testimonialQuote=testimonialFigure.querySelector('blockquote');
const testimonialCaption=testimonialFigure.querySelector('figcaption');
const testimonialDots=[...document.querySelectorAll('.testimonial-dot')];
const testimonialSlides=[
  {quote:testimonialQuote.textContent,author:'Nerciane Perin',context:'Restaurante Rancho do Cupim – Sorocaba/SP'},
  {quote:'Ter o acompanhamento da Nutri Assessoria fez muita diferença para nós. Sempre que precisamos, temos orientação e suporte. É um trabalho próximo, que ajuda de verdade na organização e na rotina do restaurante.',author:'Josellma',context:'Churrascaria São Judas'},
  {quote:'A Nutri Assessoria está sempre presente e nos ajudando no dia a dia. As orientações e os treinamentos são práticos, a equipe é muito atenciosa e hoje nos sentimos muito mais seguros e organizados com todos os processos.',author:'Fernanda Perin',context:'Churrascaria Anchieta Grill'}
];
let testimonialIndex=0;
let testimonialPaused=false;
let testimonialTimer;
function scheduleTestimonial(){
  window.clearInterval(testimonialTimer);
  if(!testimonialPaused)testimonialTimer=window.setInterval(()=>{if(!document.hidden)showTestimonial(testimonialIndex+1);},8000);
}
function showTestimonial(index,manual=false){
  const previousIndex=testimonialIndex;
  testimonialIndex=(index+testimonialSlides.length)%testimonialSlides.length;
  if(manual)scheduleTestimonial();
  if(testimonialIndex===previousIndex)return;
  const slide=testimonialSlides[testimonialIndex];
  testimonialQuote.textContent=slide.quote;
  const name=document.createElement('strong');name.textContent=slide.author;
  testimonialCaption.replaceChildren(name,document.createElement('br'),document.createTextNode(slide.context));
  testimonialFigure.setAttribute('aria-label',`Depoimento ${testimonialIndex+1} de ${testimonialSlides.length}`);
  testimonialFigure.setAttribute('aria-live',manual?'polite':'off');
  testimonialDots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===testimonialIndex)));
  testimonialFigure.style.setProperty('--slide-direction',index<previousIndex?-1:1);
  testimonialFigure.classList.remove('is-entering');
  void testimonialFigure.offsetWidth;
  testimonialFigure.classList.add('is-entering');
}
document.querySelector('.testimonial-prev').addEventListener('click',()=>showTestimonial(testimonialIndex-1,true));
document.querySelector('.testimonial-next').addEventListener('click',()=>showTestimonial(testimonialIndex+1,true));
testimonialDots.forEach((dot,i)=>dot.addEventListener('click',()=>showTestimonial(i,true)));
/* Sem botão de pausa: a rotação automática para enquanto o usuário interage com os depoimentos (mouse ou foco). */
function setTestimonialPaused(paused){testimonialPaused=paused;scheduleTestimonial();}
testimonialSection.addEventListener('mouseenter',()=>setTestimonialPaused(true));
testimonialSection.addEventListener('mouseleave',()=>setTestimonialPaused(testimonialSection.contains(document.activeElement)));
testimonialSection.addEventListener('focusin',()=>setTestimonialPaused(true));
testimonialSection.addEventListener('focusout',event=>{if(!testimonialSection.contains(event.relatedTarget))setTestimonialPaused(testimonialSection.matches(':hover'));});
testimonialFigure.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();showTestimonial(testimonialIndex+(event.key==='ArrowLeft'?-1:1),true);}});
let touchStart=null;
testimonialSection.addEventListener('touchstart',event=>{if(!event.target.closest('button'))touchStart={x:event.changedTouches[0].clientX,y:event.changedTouches[0].clientY};},{passive:true});
testimonialSection.addEventListener('touchend',event=>{if(!touchStart)return;const dx=event.changedTouches[0].clientX-touchStart.x,dy=event.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))showTestimonial(testimonialIndex+(dx<0?1:-1),true);touchStart=null;},{passive:true});
scheduleTestimonial();
const track=document.querySelector('.client-track'),previous=document.querySelector('#client-prev'),next=document.querySelector('#client-next');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
function clientState(){previous.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;}
function moveClients(direction){track.scrollBy({left:direction*track.clientWidth,behavior:reducedMotion.matches?'instant':'smooth'});}
previous.addEventListener('click',()=>moveClients(-1));next.addEventListener('click',()=>moveClients(1));
track.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();moveClients(event.key==='ArrowRight'?1:-1);}});
track.addEventListener('scroll',clientState,{passive:true});window.addEventListener('resize',clientState);clientState();
/* Movimento de rolagem: secoes surgem ao entrar na tela e algumas camadas decorativas ganham profundidade (paralaxe). */
const revealItems=[...document.querySelectorAll('.reveal, .reveal-stagger')];
if(revealItems.length){
  if('IntersectionObserver' in window){
    const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}});},{threshold:.18,rootMargin:'0px 0px -8% 0px'});
    revealItems.forEach(item=>revealObserver.observe(item));
  } else {
    revealItems.forEach(item=>item.classList.add('is-visible'));
  }
}
const parallaxLayers=[...document.querySelectorAll('[data-parallax]')].map(el=>({el,speed:Number(el.dataset.parallax)}));
const heroContent=document.querySelector('.hero-content');
const heroSection=document.querySelector('.hero');
let parallaxTicking=false;
function updateParallax(){
  parallaxTicking=false;
  const viewportHeight=window.innerHeight;
  parallaxLayers.forEach(({el,speed})=>{const rect=el.getBoundingClientRect();const offset=rect.top+rect.height/2-viewportHeight/2;el.style.transform=`translateY(${(-offset*speed).toFixed(1)}px)`;});
  if(heroContent&&heroSection){const progress=Math.min(Math.max(window.scrollY/heroSection.offsetHeight,0),1);heroContent.style.opacity=String(Math.max(1-progress*1.6,0));heroContent.style.transform=`translateY(${(progress*-46).toFixed(1)}px)`;}
}
function requestParallax(){if(!parallaxTicking){parallaxTicking=true;requestAnimationFrame(updateParallax);}}
if((parallaxLayers.length||heroContent)&&!reducedMotion.matches){
  window.addEventListener('scroll',requestParallax,{passive:true});
  window.addEventListener('resize',requestParallax);
  updateParallax();
}
