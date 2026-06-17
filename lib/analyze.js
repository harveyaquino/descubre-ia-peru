import Anthropic from '@anthropic-ai/sdk';

/**
 * Genera un análisis personalizado de oportunidades de IA para el negocio
 * del participante, usando Claude. Pensado para empresas peruanas (PYMEs).
 *
 * Devuelve un objeto JSON estructurado para que el frontend lo pueda
 * renderizar de forma consistente.
 */

const MODEL = 'claude-opus-4-8';

const SCHEMA = {
  type: 'object',
  properties: {
    resumen: {
      type: 'string',
      description: 'Diagnóstico breve (2-3 frases) de la situación del negocio.',
    },
    oportunidades: {
      type: 'array',
      description: 'Entre 3 y 4 oportunidades concretas de aplicar IA.',
      items: {
        type: 'object',
        properties: {
          titulo: { type: 'string' },
          descripcion: { type: 'string' },
          impacto: {
            type: 'string',
            enum: ['alto', 'medio', 'bajo'],
          },
        },
        required: ['titulo', 'descripcion', 'impacto'],
        additionalProperties: false,
      },
    },
    primer_paso: {
      type: 'string',
      description: 'El primer paso accionable que debería tomar esta semana.',
    },
  },
  required: ['resumen', 'oportunidades', 'primer_paso'],
  additionalProperties: false,
};

const SYSTEM = `Eres un consultor de transformación digital especializado en IA para
PYMEs peruanas. Hablas en español de Perú, de forma clara, cercana y sin tecnicismos
innecesarios. Das recomendaciones realistas para empresas con presupuesto limitado.
Priorizas herramientas accesibles (WhatsApp Business, hojas de cálculo, chatbots,
automatizaciones simples) antes que soluciones costosas. Eres concreto: nada de
generalidades vacías.`;

export async function analyzeLead(lead) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'ANTHROPIC_API_KEY no configurada' };
  }

  const client = new Anthropic({ apiKey });

  const userPrompt = `Analiza este negocio y genera recomendaciones de IA:

- Empresa: ${lead.company || 'No especificada'}
- Industria: ${lead.industry || 'No especificada'}
- Desafío principal: ${lead.challenge || 'No especificado'}

Genera un diagnóstico, 3-4 oportunidades de IA priorizadas por impacto, y un primer
paso accionable para esta semana.`;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      thinking: { type: 'adaptive' },
      system: SYSTEM,
      output_config: { format: { type: 'json_schema', schema: SCHEMA } },
      messages: [{ role: 'user', content: userPrompt }],
    });

    if (response.stop_reason === 'refusal') {
      return { ok: false, error: 'La solicitud no pudo procesarse.' };
    }

    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock) {
      return { ok: false, error: 'Respuesta vacía del modelo.' };
    }

    const analysis = JSON.parse(textBlock.text);
    return { ok: true, analysis };
  } catch (err) {
    console.error('Error analizando lead con Claude:', err);
    return { ok: false, error: 'No se pudo generar el análisis.' };
  }
}
