// Página inicial: abertura, percurso (a história) e a home com o tambor do "Cuido".
(function () {
  var A = window.AR, S = A.S, esc = A.esc, caminho = A.caminho;
  var abertura = document.getElementById('abertura');
  var percurso = document.getElementById('percurso');
  var home = document.getElementById('home');
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visitou = false;
  try { visitou = !!localStorage.getItem('visitou'); } catch (e) {}
  function marcarVisita() { try { localStorage.setItem('visitou', '1'); } catch (e) {} }

  // Troca de telas com fade.
  function mostrar(tela) {
    [abertura, percurso].forEach(function (t) {
      if (t.id === tela) {
        if (t.hidden) { t.classList.add('saindo'); t.hidden = false; requestAnimationFrame(function () { requestAnimationFrame(function () { t.classList.remove('saindo'); }); }); }
      } else if (!t.hidden) {
        t.classList.add('saindo');
        setTimeout(function () { t.hidden = true; }, 480);
      }
    });
    if (tela === 'home') {
      home.hidden = false;
      document.body.classList.remove('travado');
      requestAnimationFrame(iniciarHome);
    } else {
      document.body.classList.add('travado');
    }
  }

  // Abertura: o interlocutor fala em cima, as opções ficam embaixo.
  var aberturaOk = false;
  function iniciarAbertura() {
    mostrar('abertura');
    if (aberturaOk) return;
    aberturaOk = true;
    var f1 = abertura.querySelector('.f1'), f2 = abertura.querySelector('.f2'), op = abertura.querySelector('.opcoes');
    function tudo() { f1.classList.add('visivel'); f2.classList.add('visivel'); op.classList.add('visivel'); }
    setTimeout(function () { f1.classList.add('visivel'); }, 300);
    var t2 = setTimeout(tudo, reduz ? 400 : 2200);
    abertura.addEventListener('click', function (e) { if (!e.target.closest('button')) { clearTimeout(t2); tudo(); } });
    abertura.querySelector('.sim').addEventListener('click', function () { marcarVisita(); location.hash = 'historia'; });
    abertura.querySelector('.nao').addEventListener('click', function () { marcarVisita(); location.hash = 'site'; });
  }

  // Percurso: slides com peças reais, em ordem cronológica.
  var idx = 0, percursoOk = false;
  function iniciarPercurso() {
    idx = 0;
    mostrar('percurso');
    renderSlide(true);
    if (!percursoOk) { percursoOk = true; ligarPercurso(); }
  }
  function htmlSlide(s) {
    if (s.fim) return '<div class="s-texto"><p>' + esc(s.texto) + '</p></div>';
    var n = s.media.length, shape = s.shape || 'h';
    var media = s.media.map(function (m) {
      if (m.video) return '<div class="m"><video controls preload="none" playsinline poster="' + caminho(m.poster) + '" src="' + caminho(m.video) + '"></video></div>';
      return '<div class="m"><img src="' + caminho(m.img) + '" alt="' + esc(m.alt || '') + '"></div>';
    }).join('');
    return '<div class="s-media" data-n="' + n + '" data-shape="' + shape + '" style="--n:' + n + '">' + media + '</div><div class="s-texto"><p class="mono kicker">' + esc(s.kicker) + '</p><p>' + esc(s.texto) + '</p></div>';
  }
  function renderSlide(imediato) {
    var d = window.PERCURSO, s = d[idx], el = percurso.querySelector('.slide');
    function troca() {
      el.innerHTML = htmlSlide(s);
      el.classList.toggle('s-fim', !!s.fim);
      el.classList.remove('trocando');
      percurso.querySelector('.n').textContent = (idx + 1) + ' / ' + d.length;
      percurso.querySelector('.ant').disabled = idx === 0;
      var prox = percurso.querySelector('.prox');
      prox.textContent = s.fim ? 'Entrar no site' : 'Próximo';
      prox.classList.toggle('btn-cheio', !!s.fim);
      preCarregar(idx + 1);
      percurso.scrollTop = 0;
    }
    if (imediato || reduz) troca(); else { el.classList.add('trocando'); setTimeout(troca, 260); }
  }
  function preCarregar(i) {
    var s = window.PERCURSO[i];
    if (!s || !s.media) return;
    s.media.forEach(function (m) { if (m.img) { var im = new Image(); im.src = caminho(m.img); } });
  }
  function ligarPercurso() {
    var prox = percurso.querySelector('.prox'), ant = percurso.querySelector('.ant');
    prox.addEventListener('click', function () {
      if (window.PERCURSO[idx].fim) { marcarVisita(); location.hash = 'site'; }
      else { idx++; renderSlide(); }
    });
    ant.addEventListener('click', function () { if (idx > 0) { idx--; renderSlide(); } });
    document.addEventListener('keydown', function (e) {
      if (percurso.hidden) return;
      if (e.key === 'ArrowRight') prox.click();
      if (e.key === 'ArrowLeft') ant.click();
    });
    var x0 = null;
    percurso.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    percurso.addEventListener('touchend', function (e) {
      if (x0 == null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 60) (dx < 0 ? prox : ant).click();
    });
  }

  // Home.
  var homeOk = false;
  function iniciarHome() {
    if (homeOk) return;
    homeOk = true;
    renderSalas();
    renderContato();
    tambor();
  }
  function renderSalas() {
    var el = document.getElementById('salas'), cont = {};
    (window.PECAS || []).forEach(function (p) {
      p.salas.forEach(function (s) { cont[s] = (cont[s] || 0) + (s === 'fotos' ? (p.imgs || []).length : 1); });
    });
    el.innerHTML = S.salas.map(function (s) {
      var q = cont[s.id] || 0, rot;
      if (s.id === 'fotos') rot = q + ' fotos';
      else if (q === 0) rot = 'começando';
      else rot = q + (q === 1 ? ' peça' : ' peças');
      return '<a class="sala" href="' + A.ROOT + s.pasta + '/" style="--cor:var(--' + s.id + ')"><span class="chip"></span><h3>' + esc(s.nome) + '</h3><p>' + esc(s.desc) + '</p><span class="qtd">' + rot + '</span></a>';
    }).join('');
  }
  function renderContato() {
    var el = document.getElementById('contato'), c = S.contato || {}, itens = [];
    if (c.email) itens.push('<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a>');
    if (c.linkedin) itens.push('<a href="' + esc(c.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>');
    if (c.github) itens.push('<a href="' + esc(c.github) + '" target="_blank" rel="noopener">GitHub</a>');
    el.innerHTML = itens.length ? itens.join('') : '<span class="nada">E-mail e redes em breve.</span>';
  }

  // O tambor: "Cuido" fixo, os temas rodando como um rolo, parando em "de tudo."
  function tambor() {
    var hero = document.querySelector('.hero');
    var rolo = hero.querySelector('.tambor-rolo');
    var win = hero.querySelector('.tambor-win');
    var ordem = A.ordemAtual();
    var temas = ordem.map(function (i) { return S.temas[i]; });
    hero.querySelector('.lista').textContent = temas.map(function (t) { return t.curto; }).join(' · ');
    // O rolo passa pelos temas de trás para a frente: o primeiro da lista é o último que se lê antes de "tudo".
    var seq = temas.slice().reverse().map(function (t) { return t.frase; }).concat(['de tudo.']);
    var N = seq.length, ang = 360 / N;
    rolo.innerHTML = seq.map(function (t, i) { return '<li style="--i:' + i + '"' + (i === N - 1 ? ' class="fim"' : '') + '>' + esc(t) + '</li>'; }).join('');
    rolo.style.setProperty('--ang', ang + 'deg');
    function medir() {
      var w = 0;
      rolo.querySelectorAll('li').forEach(function (li) { w = Math.max(w, li.offsetWidth); });
      win.style.width = Math.ceil(w) + 'px';
      var h = win.clientHeight || 100;
      rolo.style.setProperty('--rz', ((h / 2) / Math.tan((ang / 2) * Math.PI / 180)).toFixed(1) + 'px');
    }
    medir();
    window.addEventListener('resize', medir);
    var fim = (N - 1) * ang;
    var visto = false;
    try { visto = !!sessionStorage.getItem('tamborVisto'); } catch (e) {}
    if (reduz || visto) { rolo.style.setProperty('--rot', fim + 'deg'); return; }
    hero.classList.add('animando');
    var total = 720 + fim, dur = 4600, t0 = performance.now() + 500;
    function passo(now) {
      var t = (now - t0) / dur;
      if (t < 0) t = 0;
      if (t > 1) t = 1;
      var e = 1 - Math.pow(1 - t, 4);
      rolo.style.setProperty('--rot', (total * e) + 'deg');
      if (t < 1) requestAnimationFrame(passo);
      else setTimeout(function () { hero.classList.remove('animando'); try { sessionStorage.setItem('tamborVisto', '1'); } catch (e) {} }, 300);
    }
    requestAnimationFrame(passo);
  }

  // Rotas: #historia, #site ou nada.
  function rotear() {
    var h = location.hash.replace('#', '');
    if (h === 'historia') iniciarPercurso();
    else if (h === 'site' || visitou) mostrar('home');
    else iniciarAbertura();
  }
  window.addEventListener('hashchange', rotear);
  rotear();
})();
