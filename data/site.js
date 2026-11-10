// Configuração do site. Tudo que está aqui é texto e estrutura, sem código de comportamento.
window.SITE = {
  nome: "Arthur Ramos",
  // Endereço público do site. Vazio = calcula a partir da página atual (usado pelo painel para gerar links).
  url: "",
  // Temas do "Cuido …", na ordem básica decidida pelo Arthur. "frase" aparece no tambor; "curto" na lista.
  temas: [
    { id: "redacao",      frase: "da redação",             curto: "redação" },
    { id: "video",        frase: "do vídeo",               curto: "vídeo" },
    { id: "redes",        frase: "das redes sociais",      curto: "redes sociais" },
    { id: "design",       frase: "do design",              curto: "design" },
    { id: "automacao",    frase: "dos fluxos de automação", curto: "fluxos de automação" },
    { id: "apuracao",     frase: "da apuração",            curto: "apuração" },
    { id: "planejamento", frase: "do planejamento",        curto: "planejamento" },
    { id: "fotografia",   frase: "da fotografia",          curto: "fotografia" }
  ],
  // As sete salas decididas pelo Arthur. "pasta" é o endereço; "desc" é a linha de abertura de cada sala.
  salas: [
    { id: "design",     pasta: "design",     nome: "Design Gráfico", desc: "Identidade visual, cartilhas, revistas e capas de disco." },
    { id: "jornalismo", pasta: "jornalismo", nome: "Jornalismo",     desc: "Matérias, reportagens em vídeo e cobertura. Texto, foto e câmera, muitas vezes na mesma pauta." },
    { id: "social",     pasta: "social",     nome: "Social Media",   desc: "Conteúdo para redes: carrosséis, posts, stories e reels, do planejamento à publicação." },
    { id: "textos",     pasta: "textos",     nome: "Textos",         desc: "Textos meus, fora de pauta. Comunicação, política, cinema, design e o que mais aparecer." },
    { id: "video",      pasta: "video",      nome: "Vídeo",          desc: "Reportagens, documentários curtos e reels. Captação e edição." },
    { id: "fotos",      pasta: "fotos",      nome: "Fotos",          desc: "Shows, eventos e reportagem." },
    { id: "automacoes", pasta: "automacoes", nome: "Automações",     desc: "Scripts que tiram trabalho braçal da rotina de uma redação." }
  ],
  // Contato. Vazio até o Arthur dizer o que publicar.
  contato: {
    email: "",
    linkedin: "",
    github: ""
  }
};
