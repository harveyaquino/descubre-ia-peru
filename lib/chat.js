import Anthropic from '@anthropic-ai/sdk';

/**
 * Lógica de la conversación con "Lucía", la asistente que entrevista al
 * visitante y, cuando tiene contexto suficiente, entrega una ficha con su
 * "primer empleado IA" + un plan de 7 días.
 *
 * La conversación es multi-turno y sin estado en el servidor: el cliente
 * envía el historial completo en cada llamada.
 */

const MODEL = 'claude-opus-4-8';

export const ASSISTANT_NAME = 'Lucía';

// Saludo inicial: se muestra en el cliente y se incluye como primer turno
// del asistente en el historial, así Lucía sabe que ya saludó.
export const GREETING =
  '¡Hola! Soy Lucía 👋 Te voy a hacer unas preguntas cortas sobre tu negocio ' +
  'para descubrir cuál sería tu *primer empleado IA*: la tarea que más te ' +
  'conviene delegar a la inteligencia artificial. Son unos 5 minutos y no ' +
  'necesitas registrarte. Para empezar, cuéntame: ¿a qué se dedica tu negocio?';

const SYSTEM = `Eres Lucía, una asesora cercana y práctica que ayuda a emprendedores y
PYMEs del Perú a descubrir su "primer empleado IA": la primera tarea o función que
les conviene delegar a la inteligencia artificial.

Tu estilo:
- Hablas en español de Perú, con "tú", cálida y sin tecnicismos.
- Haces UNA sola pregunta por mensaje. Mensajes cortos.
- Ya saludaste y preguntaste a qué se dedica el negocio (ese fue tu primer mensaje).

Tu objetivo: en una conversación corta (entre 4 y 6 preguntas en total) entender:
- A qué se dedica y de qué tamaño es (solo/a o con equipo).
- Cómo consigue y atiende clientes (WhatsApp, redes, local, etc.).
- En qué tareas repetitivas se le va más tiempo o qué le gustaría dejar de hacer.

Reglas:
- No alargues la conversación. En cuanto tengas una idea clara del negocio y de su
  mayor dolor o tarea repetitiva, llama a la herramienta "entregar_ficha".
- Recomienda un "empleado IA" realista y accesible para un presupuesto limitado
  (WhatsApp Business, chatbots simples, asistentes de contenido, automatización de
  cotizaciones o agenda, etc.). Nada de soluciones caras o complejas.
- El plan de 7 días debe ser concreto y accionable, un paso por día.
- Nunca menciones que esto es parte de un taller, curso o evento.`;

const FICHA_TOOL = {
  name: 'entregar_ficha',
  description:
    'Entrega la ficha final con el "primer empleado IA" recomendado y el plan de 7 días. ' +
    'Llámala solo cuando ya tengas suficiente contexto del negocio.',
  input_schema: {
    type: 'object',
    properties: {
      empleado_nombre: {
        type: 'string',
        description:
          'Nombre del rol del empleado IA, ej: "Asistente de WhatsApp" o "Community Manager IA".',
      },
      empleado_resumen: {
        type: 'string',
        description: '1-2 frases sobre qué es y por qué encaja con este negocio.',
      },
      tareas: {
        type: 'array',
        description: '3 a 5 tareas concretas que haría este empleado IA.',
        items: { type: 'string' },
      },
      herramientas: {
        type: 'array',
        description: '2 a 4 herramientas accesibles para empezar.',
        items: {
          type: 'object',
          properties: {
            nombre: { type: 'string' },
            para_que: { type: 'string' },
          },
          required: ['nombre', 'para_que'],
          additionalProperties: false,
        },
      },
      plan_7_dias: {
        type: 'array',
        description: 'Exactamente 7 pasos, uno por día (día 1 al día 7).',
        items: {
          type: 'object',
          properties: {
            dia: { type: 'string', description: 'Ej: "Día 1"' },
            accion: { type: 'string' },
          },
          required: ['dia', 'accion'],
          additionalProperties: false,
        },
      },
      cierre: {
        type: 'string',
        description: 'Mensaje breve y motivador de cierre.',
      },
    },
    required: [
      'empleado_nombre',
      'empleado_resumen',
      'tareas',
      'herramientas',
      'plan_7_dias',
      'cierre',
    ],
    additionalProperties: false,
  },
};

/**
 * @param {Array<{role: 'user'|'assistant', content: string}>} messages
 * @returns {Promise<{ok: boolean, type?: 'message'|'ficha', text?: string, ficha?: object, error?: string}>}
 */
export async function continueConversation(messages) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'ANTHROPIC_API_KEY no configurada' };
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: 'Conversación vacía' };
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: SYSTEM,
      tools: [FICHA_TOOL],
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    if (response.stop_reason === 'refusal') {
      return { ok: false, error: 'La solicitud no pudo procesarse.' };
    }

    const toolUse = response.content.find((b) => b.type === 'tool_use');
    if (toolUse) {
      const text = response.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('\n')
        .trim();
      return { ok: true, type: 'ficha', ficha: toolUse.input, text };
    }

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    return { ok: true, type: 'message', text };
  } catch (err) {
    console.error('Error en la conversación con Claude:', err);
    return { ok: false, error: 'No se pudo continuar la conversación.' };
  }
}
