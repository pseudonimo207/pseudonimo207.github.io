// Funções compartilhadas: tema, cabeçalho, rodapé e a ordem personalizada dos temas.
(function () {
  var html = document.documentElement;
  var ROOT = html.getAttribute('data-root') || '';
  var HOME = ROOT || './';
  var S = window.SITE || { temas: [], salas: [], contato: {} };

  // Tema: escuro por padrão; o visitante pode trocar e a escolha fica no navegador dele.
  var tema = null;
  try { tema = localStorage.getItem('tema'); } catch (e) {}
  html.setAttribute('data-theme', tema === 'light' ? 'light' : 'dark');
  function alternarTema() {
    var novo = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', novo);
    try { localStorage.setItem('tema', novo); } catch (e) {}
    atualizarBotoesTema();
  }
  function atualizarBotoesTema() {
    var escuro = html.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.tema').forEach(function (b) { b.textContent = escuro ? 'Modo claro' : 'Modo escuro'; });
  }

  // Ordem dos temas codificada no link (?r=xxxx). Código de Lehmer em base 36, com um caractere aleatório na frente.
  var B36 = '0123456789abcdefghijklmnopqrstuvwxyz';
  function codificar(perm) {
    var n = perm.length, num = 0, pool = [];
    for (var i = 0; i < n; i++) pool.push(i);
    for (var k = 0; k < n; k++) {
      var idx = pool.indexOf(perm[k]);
      num = num * (n - k) + idx;
      pool.splice(idx, 1);
    }
    var s = num.toString(36);
    while (s.length < 3) s = '0' + s;
    return B36[Math.floor(Math.random() * 36)] + s;
  }
  function decodificar(code, n) {
    if (!code || code.length !== 4 || !/^[0-9a-z]+$/.test(code)) return null;
    var num = parseInt(code.slice(1), 36);
    if (isNaN(num)) return null;
    var fat = 1;
    for (var i = 2; i <= n; i++) fat *= i;
    if (num >= fat) return null;
    var idxs = new Array(n), m = num;
    for (var k = n - 1; k >= 0; k--) { var r = n - k; idxs[k] = m % r; m = Math.floor(m / r); }
    var pool = [], perm = [];
    for (var j = 0; j < n; j++) pool.push(j);
    for (var q = 0; q < n; q++) perm.push(pool.splice(idxs[q], 1)[0]);
    return perm;
  }
  function ordemAtual() {
    var n = S.temas.length;
    var p = new URLSearchParams(location.search).get('r');
    if (p) {
      var perm = decodificar(p, n);
      if (perm) { try { sessionStorage.setItem('ordem', JSON.stringify(perm)); } catch (e) {} return perm; }
    }
    try {
      var s = sessionStorage.getItem('ordem');
      if (s) { var arr = JSON.parse(s); if (Array.isArray(arr) && arr.length === n) return arr; }
    } catch (e) {}
    var base = [];
    for (var i = 0; i < n; i++) base.push(i);
    return base;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function caminho(p) { return /^https?:/.test(p) ? p : ROOT + p; }
  function thumb(p) { return p.indexOf('/img/') >= 0 ? p.replace(/\.(jpg|png)$/, '.t.$1') : p; }
  function fmtData(iso) {
    if (!iso) return '';
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!m) return iso;
    var meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return parseInt(m[3], 10) + ' de ' + meses[parseInt(m[2], 10) - 1] + ' de ' + m[1];
  }

  function renderTopo(ativa) {
    var el = document.querySelector('.topo');
    if (!el) return;
    var links = S.salas.map(function (s) {
      return '<a href="' + ROOT + s.pasta + '/" style="--cor:var(--' + s.id + ')"' + (s.id === ativa ? ' aria-current="page"' : '') + '>' + esc(s.nome) + '</a>';
    }).join('');
    links += '<a href="' + ROOT + 'sobre/"' + (ativa === 'sobre' ? ' aria-current="page"' : '') + '>Sobre</a>';
    el.innerHTML = '<a class="marca" href="' + HOME + '#site">' + esc(S.nome) + '</a><nav class="nav" aria-label="Salas">' + links + '</nav><button class="tema" type="button"></button>';
    el.querySelector('.tema').addEventListener('click', alternarTema);
    atualizarBotoesTema();
  }
  function renderRodape() {
    var el = document.querySelector('.rodape');
    if (!el) return;
    el.innerHTML = '<span>' + esc(S.nome) + ' · Brasília</span><span><a href="' + HOME + '#historia">Ver a história</a></span>';
  }

  window.AR = { ROOT: ROOT, HOME: HOME, S: S, esc: esc, caminho: caminho, thumb: thumb, fmtData: fmtData, codificar: codificar, decodificar: decodificar, ordemAtual: ordemAtual, alternarTema: alternarTema, renderTopo: renderTopo, renderRodape: renderRodape };

  document.addEventListener('DOMContentLoaded', function () {
    renderTopo(document.body.getAttribute('data-sala'));
    renderRodape();
    atualizarBotoesTema();
  });
})();
