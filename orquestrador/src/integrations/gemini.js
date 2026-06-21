// integrations/gemini.js — geração de texto/laudo com Google Gemini.
//
// Requer GEMINI_API_KEY. Implementar com o fetch nativo do Node (sem SDK).

/**
 * Gera um laudo/descrição do imóvel a partir de dados estruturados.
 * @param {object} input Dados do imóvel (bairro, metragem, preço, etc.).
 * @returns {Promise<string>} Texto gerado (vazio enquanto stub).
 */
export async function generatePropertyReport(input) {
  // TODO(0.7): POST https://generativelanguage.googleapis.com/v1beta/models/
  //   gemini-2.5-flash:generateContent?key=GEMINI_API_KEY
  //   body: { contents: [{ parts: [{ text: prompt }] }] }
  return '';
}
