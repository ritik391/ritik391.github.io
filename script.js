(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.getElementById('yr').textContent = new Date().getFullYear();

  /* always dark theme: clear any old saved light choice */
  try { localStorage.removeItem('theme'); } catch(e){}

  /* phone menu */
  var navEl = document.querySelector('header.nav'), menuBtn = document.getElementById('menu');
  function setMenu(open){ navEl.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open); menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
  menuBtn.addEventListener('click', function(){ setMenu(!navEl.classList.contains('open')); });
  document.querySelectorAll('#links a').forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });
  addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', function(){ if (innerWidth > 820) setMenu(false); });

  /* scroll progress */
  var bar = document.getElementById('bar');
  function progress(){ var h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')'; }
  addEventListener('scroll', progress, {passive:true}); progress();

  /* nav highlight */
  var links = document.querySelectorAll('#links a');
  var nav = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting) links.forEach(function(a){ a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); }); });
  }, {rootMargin:'-40% 0px -55% 0px'});
  document.querySelectorAll('section[id]').forEach(function(s){ nav.observe(s); });

  /* typing roles */
  var roles = ['Production Associate', 'Data & KPI Analyst', 'Food Technologist', 'MBA Student, Operations & Data Science'];
  var el = document.getElementById('typed');
  if (reduce) el.textContent = roles[0];
  else { var r = 0, c = 0, del = false;
    (function tick(){
      var word = roles[r], wait = del ? 35 : 75;
      el.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; wait = 1400; }
      else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
      else c += del ? -1 : 1;
      setTimeout(tick, wait);
    })(); }

  /* skills marquee */
  var words = ['Food Technology','OEE Analysis','HACCP & ISO 22000','Microsoft Excel','Power BI','Root Cause Analysis','SEO & GEO','Market Research','ERP Data','5S & 7QC','Microbial Analysis','Proximate Analysis','KPI Tracking','Consumer Insight'];
  var track = document.getElementById('track');
  var seps = ['🌾','🧪','🥛','🍃','📊','🥣'];
  track.innerHTML = words.concat(words).map(function(w, i){ return '<span>' + w + '</span><span class="sep">' + seps[i % seps.length] + '</span>'; }).join('');

  /* reveal on scroll with stagger */
  var targets = document.querySelectorAll('h2, .tile, .project, .cert, .contact p, .cta a, .sub, .path, .path li, .tabs, .chips.hot .chip, .act, .filters');
  targets.forEach(function(n){
    if (n.tagName !== 'H2' && !n.classList.contains('path')) {
      var i = Array.prototype.indexOf.call(n.parentNode.children, n);
      n.style.setProperty('--d', Math.min(i, 8) * 0.08 + 's');
    }
    if (!n.classList.contains('path')) n.classList.add('reveal');
  });
  var rev = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); } });
  }, {threshold:.15});
  document.querySelectorAll('.reveal, .path').forEach(function(n){ rev.observe(n); });

  /* count-up */
  var cnt = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if (!e.isIntersecting) return;
      var n = e.target, end = parseFloat(n.dataset.count), d = parseInt(n.dataset.dec || 0, 10), suf = n.dataset.suffix || '';
      if (reduce) { n.textContent = end.toFixed(d) + suf; cnt.unobserve(n); return; }
      var t0 = performance.now();
      (function step(t){
        var p = Math.min((t - t0) / 1500, 1), ease = 1 - Math.pow(1 - p, 3);
        n.textContent = (end * ease).toFixed(d) + suf;
        if (p < 1) requestAnimationFrame(step);
      })(t0);
      cnt.unobserve(n);
    });
  }, {threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(n){ cnt.observe(n); });

  /* experience tabs */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function select(tab){
    tabs.forEach(function(t){
      var on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (on) { p.hidden = false; p.querySelectorAll('.steps li').forEach(function(li){ li.style.animation = 'none'; li.offsetHeight; li.style.animation = ''; }); }
      else p.hidden = true;
    });
  }
  tabs.forEach(function(t, i){
    t.addEventListener('click', function(){ select(t); });
    t.addEventListener('keydown', function(e){
      var k = e.key, n = k === 'ArrowDown' || k === 'ArrowRight' ? 1 : k === 'ArrowUp' || k === 'ArrowLeft' ? -1 : 0;
      if (n) { e.preventDefault(); var nx = tabs[(i + n + tabs.length) % tabs.length]; nx.focus(); select(nx); }
    });
  });

  /* project filter and read-more */
  var fbtns = document.querySelectorAll('.filters button'), cards = document.querySelectorAll('.pc');
  fbtns.forEach(function(b){
    b.addEventListener('click', function(){
      fbtns.forEach(function(x){ x.classList.toggle('on', x === b); });
      cards.forEach(function(c){ c.classList.toggle('gone', b.dataset.f !== 'all' && c.dataset.cat !== b.dataset.f); });
    });
  });
  document.querySelectorAll('.more').forEach(function(m){
    m.addEventListener('click', function(){
      var c = m.closest('.pc'), open = c.classList.toggle('open');
      m.textContent = open ? 'Show less' : 'Read more';
    });
  });

  /* mouse effects (desktop only) */
  if (fine && !reduce) {
    var glow = document.querySelector('.glow');
    addEventListener('mousemove', function(e){
      glow.style.opacity = 1; glow.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
    });
    document.querySelectorAll('.spot').forEach(function(s){
      s.addEventListener('mousemove', function(e){
        var b = s.getBoundingClientRect();
        s.style.setProperty('--mx', (e.clientX - b.left) + 'px'); s.style.setProperty('--my', (e.clientY - b.top) + 'px');
      });
    });
    document.querySelectorAll('.tilt').forEach(function(c){
      c.addEventListener('mousemove', function(e){
        var b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
        c.style.transform = 'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-4px)';
      });
      c.addEventListener('mouseleave', function(){ c.style.transform = ''; });
    });
  }
  /* mascot: Pearl */
  var buddy = document.getElementById('buddy'), bubble = document.getElementById('bubble'), mascot = document.getElementById('mascot');
  var pupils = document.querySelectorAll('.pupil'), hideT, fi = 0, seen = {};
  var facts = [
    '5S stands for Sort, Set in order, Shine, Standardise, Sustain.',
    'Alginate and calcium can turn a liquid into an edible pearl. That is how Hydropearls work!',
    'OEE shows how well equipment is used: availability, performance and quality.',
    'HACCP is a system that finds and controls food safety hazards.',
    'Why-Why analysis: keep asking “why?” until you reach the root cause.',
    'Osmotic dehydration pulls water out of fruit using a concentrated sugar or salt solution.',
    'BMI is weight in kg divided by height in metres squared. Fit-cal starts there.',
    'The 7QC tools include Pareto charts, fishbone diagrams and histograms.'
  ];
  var lines = {
    home: 'Hi! I’m Pearl, Ritik’s lab buddy. Click me for a food-tech fact!',
    about: 'Food technology plus data. That’s Ritik’s recipe.',
    experience: 'Real plant floor, real KPIs.',
    projects: 'That bubbly pearl is my cousin!',
    skills: 'HACCP, ISO, Excel, SEO… hover the chips. They wiggle!',
    beyond: 'Not just labs: events, volunteering and social media too!',
    journey: 'From Lakhisarai to Mumbai, one step at a time.',
    contact: 'Say hello. He’d love to hear from you!'
  };
  function say(msg, ms){
    bubble.textContent = msg; bubble.classList.add('show');
    clearTimeout(hideT); hideT = setTimeout(function(){ bubble.classList.remove('show'); }, ms || 5000);
  }
  var mood = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting && !seen[e.target.id] && lines[e.target.id]) { seen[e.target.id] = 1; say(lines[e.target.id]); } });
  }, {rootMargin:'-45% 0px -50% 0px'});
  document.querySelectorAll('section[id]').forEach(function(s){ mood.observe(s); });
  mascot.addEventListener('click', function(){
    mascot.classList.remove('jump'); void mascot.offsetWidth; mascot.classList.add('jump');
    say('Fun fact: ' + facts[fi++ % facts.length], 7000);
  });
  document.getElementById('bye').addEventListener('click', function(){ buddy.hidden = true; });
  if (fine && !reduce) {
    addEventListener('mousemove', function(e){
      var b = mascot.getBoundingClientRect(), dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height * .5);
      var d = Math.hypot(dx, dy) || 1, k = Math.min(d / 220, 1) * 4.5;
      pupils.forEach(function(p){ p.style.transform = 'translate(' + (dx / d * k) + 'px,' + (dy / d * k) + 'px)'; });
    });
  }
})();