// Painel: arrasta os temas e gera o link com a ordem personalizada.
(function () {
  var A = window.AR, S = A.S, esc = A.esc;
  var ul = document.getElementById('ordem');
  var ordem = S.temas.map(function (_, i) { return i; });

  function previa() {
    var frases = ordem.map(function (i) { return S.temas[i].frase; });
    document.getElementById('previa').textContent = 'Cuido ' + frases.join(', ') + '. Cuido de tudo.';
  }
  function render() {
    ul.innerHTML = ordem.map(function (ti, k) {
      return '<li draggable="true" data-k="' + k + '"><span class="n">' + (k + 1) + '</span><span>' + esc(S.temas[ti].frase) + '</span>' +
        '<span class="mv"><button type="button" data-mv="-1" aria-label="Subir">&uarr;</button><button type="button" data-mv="1" aria-label="Descer">&darr;</button></span></li>';
    }).join('');
    previa();
    document.getElementById('saida').hidden = true;
  }
  ul.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-mv]');
    if (!b) return;
    var k = +b.closest('li').dataset.k, j = k + (+b.dataset.mv);
    if (j < 0 || j >= ordem.length) return;
    var t = ordem[k]; ordem[k] = ordem[j]; ordem[j] = t;
    render();
  });
  var de = null;
  ul.addEventListener('dragstart', function (e) {
    var li = e.target.closest('li'); if (!li) return;
    de = +li.dataset.k; li.classList.add('arrastando');
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', String(de)); } catch (err) {}
  });
  ul.addEventListener('dragover', function (e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
  ul.addEventListener('drop', function (e) {
    e.preventDefault();
    var li = e.target.closest('li');
    if (!li || de == null) return;
    var para = +li.dataset.k, item = ordem.splice(de, 1)[0];
    ordem.splice(para, 0, item);
    de = null;
    render();
  });
  ul.addEventListener('dragend', function () { ul.querySelectorAll('li').forEach(function (l) { l.classList.remove('arrastando'); }); });

  document.getElementById('gerar').addEventListener('click', function () {
    var code = A.codificar(ordem);
    var base = S.url || (location.origin + location.pathname.replace(/painel\/?(index\.html)?$/, ''));
    document.getElementById('link').value = base + '?r=' + code;
    document.getElementById('saida').hidden = false;
  });
  document.getElementById('copiar').addEventListener('click', function () {
    var inp = document.getElementById('link'), b = document.getElementById('copiar');
    inp.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    if (navigator.clipboard) navigator.clipboard.writeText(inp.value).then(function () { b.textContent = 'Copiado'; setTimeout(function () { b.textContent = 'Copiar'; }, 1500); });
    else if (ok) { b.textContent = 'Copiado'; setTimeout(function () { b.textContent = 'Copiar'; }, 1500); }
  });
  document.getElementById('resetar').addEventListener('click', function () {
    ordem = S.temas.map(function (_, i) { return i; });
    render();
  });
  render();
})();
