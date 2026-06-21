// regua.js — textos da régua de relacionamento e agenda de recuperação.
//
// Use {{nome}} como placeholder; é substituído na hora do envio por `preencher`.

export const MENSAGENS = {
  // M0 cumpre a Resolução COFECI 1.551/2025: a IA se identifica como assistente
  // virtual, mantém o CRECI visível e oferece escalada para um corretor humano.
  M0: 'Oi, {{nome}}! 👋 Aqui é a *assistente virtual da Aprovar* (CRECI 9770J), ajudando no lançamento do *Botanique Residence* — condomínio fechado de lotes com lago, praia e lazer completo em Cuiabá. 🌳\nPra eu te orientar do jeito certo: você pensa no lote pra *morar*, *investir* ou *construir*?\nSe preferir falar agora com um corretor de verdade, é só me dizer *"corretor"*. 🙂',
  R1: 'Ah, {{nome}}, deixa eu te mostrar por que o *Botanique* tem chamado tanta atenção 👇 Lago exclusivo com pier e faixa de areia (sim, praia!), pista de cooper de 1,4 km e um clube de lazer entregue pronto. As vagas do acesso antecipado da *lista VIP* são poucas — quer que eu garanta a sua antes de abrir pro público geral?',
  R2: '{{nome}}, pensei no seu bolso 🙂 dá pra começar com uma entrada acessível e dividir o saldo: tem plano em *24x sem juros* e também um plano longo com parcela que cabe no orçamento. Quer que eu faça uma simulação no seu nome, sem compromisso?',
  R3: 'Passando rápido só pra avisar 🔑 o acesso antecipado da *lista VIP* é por tempo limitado e as unidades reservadas pra lista são poucas. Se o Botanique ainda faz sentido pra você, me avisa que eu seguro um lote no seu nome antes do público geral.',
  R4: '{{nome}}, prometo não te encher 🙂 quando o lançamento abrir pro público geral, os melhores lotes (perto do lago e da área de lazer) costumam ir rápido. Quer que eu mantenha sua *prioridade VIP* e te mande as opções no seu perfil?',
  R5a: 'Oi, {{nome}}! 🌿 Lembrei de você: o *Botanique* segue evoluindo e ainda dá tempo de garantir um bom lote à beira do lago. Quer que eu te mande o vídeo e as condições atualizadas? Sem compromisso.',
  R5b: '{{nome}}, última passada por aqui 🙂 se ainda tiver vontade de ter um endereço perto do lago em Cuiabá, me chama que eu te atualizo do que mudou no Botanique. Se preferir não receber mais, é só responder *"parar"*.',
  OPTOUT: 'Tudo bem, {{nome}}! Não te mando mais mensagens automáticas. Quando quiser falar sobre o Botanique, é só chamar aqui. 🙏 Aprovar · CRECI 9770J.',
  // Resposta imediata quando o lead pede atendimento humano (COFECI: escalada).
  ESCALADA: 'Claro, {{nome}}! 🙂 Já estou avisando um corretor da Aprovar pra te atender aqui mesmo. Em instantes ele assume a conversa. (Aprovar · CRECI 9770J)',
};

// Agenda da régua de recuperação (minutos a partir da criação do lead).
// R5a (D15) e R5b (D30) têm textos próprios de reativação.
export const AGENDA_RECUPERACAO = [
  { etapa: 'R1', minutos: 10 },
  { etapa: 'R2', minutos: 2880 },   // 2 dias
  { etapa: 'R3', minutos: 5760 },   // 4 dias
  { etapa: 'R4', minutos: 10080 },  // 7 dias
  { etapa: 'R5a', minutos: 21600 }, // 15 dias
  { etapa: 'R5b', minutos: 43200 }, // 30 dias
];

// Palavras-chave (comparação em lowercase).
export const OPTOUT_KEYS = ['parar', 'sair', 'pare', 'stop', 'cancelar', 'descadastrar'];
export const AVISTA_KEYS = ['à vista', 'a vista', 'avista', 'dinheiro', 'recurso próprio'];
// Pedido explícito de atendimento humano (COFECI 1.551/2025 — escalada).
export const ESCALADA_KEYS = ['corretor', 'humano', 'atendente', 'pessoa de verdade', 'falar com alguém', 'advogado', 'ligar', 'me liga', 'telefone'];

/** Resolve a etapa (R1..R4, R5a, R5b) para o texto correto. */
export function textoDaEtapa(etapa) {
  return MENSAGENS[etapa] || null;
}

/** Substitui {{nome}} no texto (fallback "tudo bem" se o nome vier vazio). */
export function preencher(texto, nome) {
  return String(texto || '').replaceAll('{{nome}}', nome || 'tudo bem');
}
