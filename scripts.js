(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ADH = [
    {intro:['أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ','بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'],
     text:'قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَهِ النَّاسِ، مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ…',
     rep:3, src:'من قالها حين يصبح وحين يمسي كفته من كل شيء'},
    {intro:[], text:'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ ﷺ نَبِيًّا', rep:3,
     src:'من قالها حين يصبح وحين يمسي كان حقًا على الله أن يرضيه يوم القيامة'},
    {intro:[], text:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', rep:100, src:'رواه البخاري ومسلم'}
  ];
  var $ = function(id){return document.getElementById(id)};

  var idx = 0, cnt = 0, C = 414.7;
  function paint(){
    var d = ADH[idx];
    $('hTitle').textContent = (idx+1)+' / '+ADH.length;
    $('hIntro').innerHTML = d.intro.join('<br>'); $('hIntro').style.display = d.intro.length ? '' : 'none';
    $('hText').textContent = d.text;
    $('hText').style.fontSize = d.text.length > 60 ? '17px' : (d.text.length > 30 ? '20px' : '25px');
    $('hNum').textContent = cnt; $('hOf').textContent = '/'+d.rep;
    $('hPg').style.strokeDashoffset = C * (1 - Math.min(cnt/d.rep,1));
    $('hSrc').textContent = d.src;
    var done = cnt >= d.rep, nx = $('hNext');
    nx.className = 'sbtn' + (done ? ' fill' : '');
  }
  $('hNum').addEventListener('click', function(){ if(cnt < ADH[idx].rep){ cnt++; paint(); }});
  $('hReset').addEventListener('click', function(){ cnt = 0; paint(); });
  $('hNext').addEventListener('click', function(){ idx = (idx+1) % ADH.length; cnt = 0; paint(); });
  paint();

  var wi = 0;
  function wpaint(){
    var d = ADH[wi];
    $('wText').textContent = d.text.length > 70 ? d.text.slice(0,68)+'…' : d.text;
    $('wText').style.fontSize = d.text.length > 40 ? '15px' : '19px';
    $('wMeta').textContent = 'التكرار: '+d.rep+' مرة • '+(wi+1)+'/'+ADH.length;
  }
  $('wNext').addEventListener('click', function(e){ e.stopPropagation(); wi = (wi+1) % ADH.length; wpaint(); });
  wpaint();

  var scene = $('scene'), world = $('world');
  var tx = 0, ty = 0, cx = 0, cy = 0, active = false, t0 = performance.now();
  function setT(clientX, clientY){
    var r = scene.getBoundingClientRect();
    var nx = ((clientX - r.left) / r.width - .5) * 2, ny = ((clientY - r.top) / r.height - .5) * 2;
    ty = Math.max(-1,Math.min(1,nx)) * 22; tx = -Math.max(-1,Math.min(1,ny)) * 14;
  }
  scene.addEventListener('pointermove', function(e){ active = true; setT(e.clientX, e.clientY); });
  scene.addEventListener('pointerleave', function(){ active = false; });
  (function loop(now){
    if(!active && !reduce){ var t = (now - t0)/1000; ty = Math.sin(t*.6)*14; tx = Math.cos(t*.45)*6; }
    cx += (tx - cx) * .08; cy += (ty - cy) * .08;
    world.style.setProperty('--rx', cx.toFixed(2)+'deg'); world.style.setProperty('--ry', cy.toFixed(2)+'deg');
    requestAnimationFrame(loop);
  })(performance.now());

  var caps = [
    ['الرئيسية','تحية حسب الوقت، التذكير القادم، والذكر الحالي بين يديك مع موعد الصلاة التالية.'],
    ['صفحة الذكر','عدّاد ثابت، حجم نص تلقائي، شريط للاستعاذة والبسملة، وزر «التالي» داخل التصنيف.'],
    ['تقويم الالتزام','أيام إتمامك مظلّلة بحسب عدد الأذكار. اضغط على يوم لترى تفاصيله.'],
    ['مواقيت الصلاة','تُحسب بحسب موقعك بطريقة الهيئة المصرية العامة للمساحة، ويمكنك اختيار الصلوات التي تُنبَّه لها.'],
    ['إعدادات التذكير','تفعيل التذكيرات، الفاصل الزمني، الترتيب، واختيار التصنيفات.'],
    ['الإعدادات','التنبيهات، المفضلة، مواقيت الصلاة، المظهر، حجم الخط، المشاركة، مرتبة الشرف، مسح البيانات.']
  ];
  var ang = 0, cur = 0, N = 6, ring = $('cring'), dots = $('dots'), timer = null;
  for(var i=0;i<N;i++){ var d = document.createElement('i'); d.dataset.i = i; d.setAttribute('role','button'); d.setAttribute('aria-label','الشاشة '+(i+1)); dots.appendChild(d); }
  function go(i, instant){
    cur = ((i % N) + N) % N;
    var target = -cur * 60, diff = ((target - ang) % 360 + 540) % 360 - 180;
    ang = ang + diff;
    ring.classList.toggle('drag', !!instant);
    ring.style.setProperty('--ang', ang+'deg');
    [].forEach.call(dots.children, function(el,k){ el.classList.toggle('on', k === cur); });
    $('cap').querySelector('h3').textContent = caps[cur][0];
    $('cap').querySelector('p').textContent = caps[cur][1];
  }
  dots.addEventListener('click', function(e){ if(e.target.dataset.i){ go(+e.target.dataset.i); restart(); }});
  $('cNext').addEventListener('click', function(){ go(cur+1); restart(); });
  $('cPrev').addEventListener('click', function(){ go(cur-1); restart(); });
  function restart(){ clearInterval(timer); if(!reduce) timer = setInterval(function(){ go(cur+1); }, 5200); }
  var car = $('car'), dx0 = null, a0 = 0;
  car.addEventListener('pointerdown', function(e){ dx0 = e.clientX; a0 = ang; ring.classList.add('drag'); car.setPointerCapture(e.pointerId); clearInterval(timer); });
  car.addEventListener('pointermove', function(e){ if(dx0 === null) return;
    ang = a0 + (e.clientX - dx0) * .35; ring.style.setProperty('--ang', ang+'deg'); });
  function endDrag(){ if(dx0 === null) return; dx0 = null; ring.classList.remove('drag');
    go(Math.round(-ang/60)); restart(); }
  car.addEventListener('pointerup', endDrag); car.addEventListener('pointercancel', endDrag);
  car.addEventListener('mouseenter', function(){ clearInterval(timer); });
  car.addEventListener('mouseleave', restart);
  go(0, true); restart();

  [].forEach.call(document.querySelectorAll('.mode button'), function(b){
    b.addEventListener('click', function(){
      document.documentElement.setAttribute('data-appmode', b.dataset.m);
      [].forEach.call(document.querySelectorAll('.mode button'), function(x){ x.classList.toggle('on', x === b); });
    });
  });

  var heat = [0,2,5,8,6,0,3,9,12,10,4,7,0,5,11,13,8,6,2,0,9,14,10,7,5,3,0,8,12,15];
  var mx = 15, cal = $('calGrid'), names = ['س','ح','ن','ث','ر','خ','ج'];
  if(cal){
    names.forEach(function(n){ var b = document.createElement('b'); b.textContent = n; cal.appendChild(b); });
    var lead = 1; 
    for(var k=0;k<lead;k++) cal.appendChild(document.createElement('span'));
    heat.forEach(function(v, k){
      var s = document.createElement('span'), r = v ? .3 + .7*(v/mx) : 0;
      s.textContent = k+1;
      s.style.background = 'color-mix(in srgb, var(--p) '+Math.round(r*100)+'%, var(--bub))';
      s.style.color = r > .55 ? 'var(--op)' : 'var(--t)';
      cal.appendChild(s);
    });
  }

  var cats = [['أذكار الصباح',29],['أذكار المساء',30],['أذكار النوم',15],['بعد الصلاة',32],['أذكار عامة',12],['استغفار',4],['أدعية',13]];
  var MAXV = 32, box = $('caps'), chart = $('chart');
  cats.forEach(function(c){
    var col = document.createElement('div'); col.className = 'cc' + (c[1] === MAXV ? ' peak' : '');
    var h = Math.max(12, c[1]/MAXV*100);
    col.innerHTML = '<div class="track"><div class="fillc" style="--h:'+h+'%;--o:'+(.55+.45*c[1]/MAXV)+';--g:'+(.15+.4*c[1]/MAXV)+'"><div class="chip">'+c[1]+'</div></div></div><div class="cl">'+c[0]+'</div>';
    box.appendChild(col);
  });
  if('IntersectionObserver' in window){
    var io2 = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ chart.classList.add('in'); io2.disconnect(); }}); }, {threshold:.35});
    io2.observe(chart);
  } else { chart.classList.add('in'); }
  setTimeout(function(){ chart.classList.add('in'); }, 9000);

  var rv = document.querySelectorAll('section > .eyebrow, section h2, .feat, .demo, .honor');
  [].forEach.call(rv, function(el){ el.classList.add('rv'); });
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }}); }, {threshold:.12});
    [].forEach.call(rv, function(el){ io.observe(el); });
  } else { [].forEach.call(rv, function(el){ el.classList.add('in'); }); }
})();