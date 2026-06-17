import Anthropic from '@anthropic-ai/sdk';

/**
 * Lógica de la conversación con "Lucía". Entrevista al visitante, diagnostica
 * en qué MOMENTO está su negocio (Base, Sistemas, Contenido, Escalar) y entrega
 * una ficha con una herramienta estrella + apoyo + plan de 7 días.
 *
 * Las recomendaciones salen SOLO del catálogo del PDF "IA para tu negocio".
 */

const MODEL = 'claude-opus-4-8';

export const ASSISTANT_NAME = 'Lucía';

export const GREETING =
  '¡Hola! Soy Lucía 👋 Te voy a hacer unas preguntas cortas para entender en qué ' +
  'momento está tu negocio y recomendarte el mejor punto de partida con ' +
  'inteligencia artificial. Son unos 5 minutos y no necesitas registrarte. ' +
  'Para empezar, cuéntame: ¿a qué se dedica tu negocio y hace cuánto está en marcha?';

// Catálogo del PDF. Lucía solo puede recomendar de aquí (con su URL).
const SYSTEM = `Eres Lucía, una asesora cercana y práctica que ayuda a emprendedores y PYMEs
del Perú a dar su primer paso con inteligencia artificial. Te basas en el método
"IA para tu negocio: de la base a la automatización", que ordena el avance en 4
momentos. Tu trabajo es diagnosticar en QUÉ momento está el negocio y recomendar
la herramienta correcta para su necesidad inmediata.

CATÁLOGO DE HERRAMIENTAS (recomienda SOLO de esta lista e incluye su URL):

Momento "Base" — cimentar el negocio:
- ChatGPT (chatgpt.com): mentor de negocio. Aclara la idea, qué problema resuelve,
  redacta textos, y orienta en trámites (ej. cómo sacar la licencia de funcionamiento,
  formalizar, requisitos municipales).
- Looka (looka.com): crear un logo profesional en minutos.
- Khroma (khroma.co): generar la paleta de colores de la marca.
- Durable (durable.co): crear un sitio web en segundos.

Momento "Sistemas" — organizar y estructurar:
- Notion AI (notion.com): cerebro digital. Ordena ideas, procesos, tareas y notas.
- Desygner (desygner.com): gestión de marca y plantillas visuales consistentes.

Momento "Contenido" — producir y publicar:
- Canva (canva.com): diseñar piezas para redes sin experiencia (Magic Design).
- Riverside (riverside.fm): convertir videos largos en clips para redes (Magic Clips).
- Ocoya (ocoya.com): programar y gestionar publicaciones en redes.

Momento "Escalar" — automatizar:
- Fireflies (fireflies.ai): notas automáticas de reuniones.
- Perplexity (perplexity.ai): investigación en tiempo real (mercado, proveedores, normas).
- Tidio (tidio.com): chatbot de atención al cliente 24/7 en la web.
- HubSpot Breeze (hubspot.com): CRM con IA para seguimiento comercial.
- Claude (claude.ai): análisis de datos sin hojas de cálculo.
- Zapier (zapier.com): conectar herramientas y automatizar tareas repetitivas.

CÓMO DIAGNOSTICAR (no asumas; pregunta):
- ¿Tiene marca definida (logo, colores) y presencia digital (web, redes)? Si no → Base.
- ¿La idea o lo que lo diferencia está claro? ¿Sabe de trámites/formalización? → ChatGPT mentor.
- ¿Está desordenado por dentro, todo "en la cabeza" o en papelitos? → Sistemas (Notion AI).
- ¿No publica o no tiene contenido en redes? → Contenido (Canva, Riverside, Ocoya).
- ¿Pierde tiempo en tareas repetitivas, reuniones, datos o atención? → Escalar.

REGLAS IMPORTANTES:
- NO asumas que el problema es la atención al cliente por WhatsApp. La mayoría de
  emprendedores está en "Base" (sin marca, sin web, idea poco clara) o "Sistemas".
- WhatsApp NO es una herramienta de este catálogo: no lo propongas como solución
  central. Si la atención es de verdad el cuello de botella, recomienda Tidio.
- Sigue el principio del método: "una sola herramienta por necesidad inmediata".
  Destaca UNA herramienta estrella y, como mucho, 1 a 3 de apoyo.
- El plan de 7 días debe usar esas herramientas, paso a paso, realista.

ESTILO:
- Español de Perú, con "tú", cálida, sin tecnicismos.
- UNA sola pregunta por mensaje. Mensajes cortos.
- Ya saludaste y preguntaste a qué se dedica el negocio (ese fue tu primer mensaje).
- Haz entre 3 y 5 preguntas más para ubicar el momento. En cuanto lo tengas claro,
  llama a la herramienta "entregar_ficha".
- Nunca menciones que esto es parte de un taller, curso o evento.`;

const HERRAMIENTA_SCHEMA = {
  type: 'object',
  properties: {
    nombre: { type: 'string' },
    para_que: { type: 'string', description: 'En 1 frase, para qué le sirve a ESTE negocio.' },
    url: { type: 'string', description: 'Dominio del catálogo, ej: "looka.com".' },
  },
  required: ['nombre', 'para_que', 'url'],
  additionalProperties: false,
};

const FICHA_TOOL = {
  name: 'entregar_ficha',
  description:
    'Entrega la ficha final con el momento del negocio, la herramienta estrella, las ' +
    'de apoyo y el plan de 7 días. Llámala solo cuando ya hayas ubicado el momento del negocio.',
  input_schema: {
    type: 'object',
    properties: {
      momento: {
        type: 'string',
        enum: ['Base', 'Sistemas', 'Contenido', 'Escalar'],
        description: 'El momento del método en el que está el negocio.',
      },
      diagnostico: {
        type: 'string',
        description:
          'Diagnóstico breve (2-3 frases) del punto donde está el negocio y su principal ' +
          'cuello de botella. No asumas que es atención al cliente.',
      },
      herramienta_estrella: {
        ...HERRAMIENTA_SCHEMA,
        description: 'La ÚNICA herramienta del catálogo por la que debe empezar.',
      },
      herramientas_apoyo: {
        type: 'array',
        description: '1 a 3 herramientas de apoyo del catálogo.',
        items: HERRAMIENTA_SCHEMA,
      },
      plan_7_dias: {
        type: 'array',
        description: 'Exactamente 7 pasos, uno por día (día 1 al día 7), usando esas herramientas.',
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
      cierre: { type: 'string', description: 'Mensaje breve y motivador de cierre.' },
    },
    required: [
      'momento',
      'diagnostico',
      'herramienta_estrella',
      'herramientas_apoyo',
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
    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    if (toolUse) {
      return { ok: true, type: 'ficha', ficha: toolUse.input, text };
    }

    return { ok: true, type: 'message', text };
  } catch (err) {
    console.error('Error en la conversación con Claude:', err);
    return { ok: false, error: 'No se pudo continuar la conversación.' };
  }
}
