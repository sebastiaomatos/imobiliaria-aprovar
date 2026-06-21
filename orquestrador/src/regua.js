// regua.js — textos da régua de relacionamento e agenda de recuperação.
//
// Use {{nome}} como placeholder; é substituído na hora do envio por `preencher`.

export const MENSAGENS = {
  M0: 'Oi, {{nome}}! 👋 Aqui é da Imobiliária Aprovar. Que bom seu interesse! Pra eu te ajudar do jeito certo: você procura o imóvel pra *morar* ou pra *investir*? E pretende comprar via *financiamento* ou *à vista*?',
  R1: 'Ah, {{nome}}, deixa eu te mostrar por que esse imóvel chama atenção 👇 Ele tem saído rápido. Quer que eu segure uma simulação no seu nome? É rápido e sem compromisso.',
  R2: '{{nome}}, fiz uma simulação rápida: dá pra deixar a parcela parecida com um aluguel, usando o FGTS na entrada. 👀 Quer que eu te mande os números?',
  R3: 'Passando só pra avisar: a condição de entrada desse imóvel é por tempo limitado e as unidades são poucas. Se ainda fizer sentido pra você, me avisa que eu garanto a sua. 🔑',
  R4: '{{nome}}, não quero te encher 🙂 Se esse imóvel não foi o ideal, tenho outras opções no mesmo perfil e faixa de preço. Quer que eu te mande?',
  R5: 'Oi, {{nome}}! Surgiu uma novidade que combina com o que você procurava. Vale dar uma olhada? Posso te mandar o vídeo.',
  OPTOUT: 'Tudo bem, {{nome}}! Não te mando mais mensagens automáticas. Quando quiser, é só chamar aqui. 🙏',
};

// Agenda da régua de recuperação (minutos a partir da criação do lead).
// R5a e R5b reaproveitam o texto de R5.
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

/** Resolve a etapa (R1..R5, R5a, R5b) para o texto correto. */
export function textoDaEtapa(etapa) {
  if (etapa === 'R5a' || etapa === 'R5b') return MENSAGENS.R5;
  return MENSAGENS[etapa] || null;
}

/** Substitui {{nome}} no texto (fallback "tudo bem" se o nome vier vazio). */
export function preencher(texto, nome) {
  return String(texto || '').replaceAll('{{nome}}', nome || 'tudo bem');
}
