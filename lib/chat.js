import Anthropic from '@anthropic-ai/sdk';

/**
 * Lógica de la conversación con "Lucía". Entrevista al visitante, evalúa su
 * negocio en las 4 dimensiones del marco de productividad (Base, Sistemas,
 * Contenido, Escalar) y entrega una ficha con: mapa de dimensiones, prioridad
 * inmediata, ruta a través de las etapas y plan de 7 días.
 *
 * El catálogo del PDF es la guía base, pero Lucía (con Claude) puede recomendar
 * otras herramientas confiables —incluido WhatsApp— si encajan con el momento.
 */

const MODEL = 'claude-opus-4-8';

export const ASSISTANT_NAME = 'Lucía';

export const GREETING =
  '¡Hola! Soy Lucía 👋 Te haré unas preguntas cortas para ver cómo está tu ' +
  'negocio en general y armarte una ruta con inteligencia artificial. Son unos ' +
  '5 minutos y no necesitas registrarte. Para empezar, cuéntame: ¿a qué se ' +
  'dedica tu negocio y hace cuánto está en marcha?';

const SYSTEM = `Eres Lucía, una asesora cercana y práctica que ayuda a emprendedores y PYMEs
del Perú a avanzar con inteligencia artificial. Te guías por el marco de productividad
"IA para tu negocio: de la base a la automatización", que ordena el avance en 4
dimensiones. Un negocio casi nunca está en una sola: suele tener unas resueltas y
otras pendientes (ej. ya tiene web pero no tiene marca consistente ni orden interno).

LAS 4 DIMENSIONES:
- Base: idea clara, marca (logo, colores), presencia digital (web), y temas de
  arranque como formalización o licencia de funcionamiento.
- Sistemas: orden interno, procesos, tareas y datos en un solo lugar.
- Contenido: presencia y publicaciones constantes en redes.
- Escalar: automatización, atención, seguimiento comercial y análisis.

CÓMO ENTREVISTAR:
- Haz 3 a 5 preguntas para ubicar al negocio en LAS 4 dimensiones, no solo en una.
  No te quedes en lo primero que te diga; explora qué tiene y qué le falta en cada una.
- Cuando sea útil, pídele el link de su página web o redes (o que te cuente qué
  tiene) para tomarlo en cuenta en el diagnóstico.
- UNA sola pregunta por mensaje. Mensajes cortos. Español de Perú, con "tú", cálida,
  sin tecnicismos. Ya saludaste y preguntaste a qué se dedica (ese fue tu 1er mensaje).

CATÁLOGO DE REFERENCIA (tu guía base; inclúyelo cuando aplique, con su URL):
- Base: ChatGPT (chatgpt.com, mentor/ideas/trámites), Looka (looka.com, logo),
  Khroma (khroma.co, colores), Durable (durable.co, web).
- Sistemas: Notion AI (notion.com, orden), Desygner (desygner.com, marca).
- Contenido: Canva (canva.com), Riverside (riverside.fm), Ocoya (ocoya.com).
- Escalar: Fireflies (fireflies.ai), Perplexity (perplexity.ai), Tidio (tidio.com),
  HubSpot Breeze (hubspot.com), Claude (claude.ai), Zapier (zapier.com).

LIBERTAD DE RECOMENDACIÓN (importante):
- El catálogo es tu referencia base, NO una jaula. Si otra herramienta conocida y
  confiable encaja mejor con el momento del negocio, recomiéndala con naturalidad.
- Si el momento lo amerita (ej. impulsar ventas o atención por WhatsApp), recomienda
  WhatsApp Business, catálogo, respuestas rápidas o un bot — está perfectamente bien.
- No fuerces ninguna herramienta. Cada recomendación debe relacionarse con la
  dimensión/necesidad que resuelve, con enfoque en productividad.

QUÉ ENTREGAR (llama a "entregar_ficha" cuando tengas el panorama de las 4 dimensiones):
- Un mapa con el estado de las 4 dimensiones (tiene / mejorar / falta).
- La prioridad #1 inmediata (una sola, con su herramienta y link).
- Una ruta con los siguientes pasos a través de las dimensiones que apliquen.
- Un plan de 7 días para arrancar.

Nunca menciones que esto es parte de un taller, curso o evento.`;

const HERRAMIENTA_SCHEMA = {
  type: 'object',
  properties: {
    nombre: { type: 'string' },
    para_que: { type: 'string', description: 'En 1 frase, para qué le sirve a ESTE negocio.' },
    url: {
      type: 'string',
      description: 'Sitio de la herramienta, ej: "looka.com". Para WhatsApp usa "business.whatsapp.com".',
    },
  },
  required: ['nombre', 'para_que', 'url'],
  additionalProperties: false,
};

const FICHA_TOOL = {
  name: 'entregar_ficha',
  description:
    'Entrega la ficha final con el mapa de las 4 dimensiones, la prioridad inmediata, ' +
    'la ruta y el plan de 7 días. Llámala cuando ya tengas el panorama del negocio.',
  input_schema: {
    type: 'object',
    properties: {
      diagnostico: {
        type: 'string',
        description: 'Resumen general (2-3 frases) de cómo está el negocio y qué le conviene priorizar.',
      },
      dimensiones: {
        type: 'array',
        description: 'Exactamente las 4 dimensiones, en orden: Base, Sistemas, Contenido, Escalar.',
        items: {
          type: 'object',
          properties: {
            etapa: { type: 'string', enum: ['Base', 'Sistemas', 'Contenido', 'Escalar'] },
            estado: {
              type: 'string',
              enum: ['tiene', 'mejorar', 'falta'],
              description: '"tiene" = ya resuelto, "mejorar" = a medias, "falta" = no lo tiene.',
            },
            nota: { type: 'string', description: 'Una línea sobre por qué ese estado.' },
          },
          required: ['etapa', 'estado', 'nota'],
          additionalProperties: false,
        },
      },
      prioridad: {
        type: 'object',
        description: 'El siguiente paso inmediato: una sola prioridad.',
        properties: {
          titulo: { type: 'string' },
          por_que: { type: 'string' },
          herramienta: HERRAMIENTA_SCHEMA,
        },
        required: ['titulo', 'por_que', 'herramienta'],
        additionalProperties: false,
      },
      ruta: {
        type: 'array',
        description: '2 a 4 pasos siguientes a través de las dimensiones que apliquen.',
        items: {
          type: 'object',
          properties: {
            titulo: { type: 'string' },
            herramienta: HERRAMIENTA_SCHEMA,
          },
          required: ['titulo', 'herramienta'],
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
      cierre: { type: 'string', description: 'Mensaje breve y motivador de cierre.' },
    },
    required: ['diagnostico', 'dimensiones', 'prioridad', 'ruta', 'plan_7_dias', 'cierre'],
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
      max_tokens: 2560,
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
