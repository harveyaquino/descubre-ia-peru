import { continueConversation } from '../../lib/chat';

/**
 * Endpoint de la conversación. Recibe el historial completo y devuelve
 * el siguiente turno de Lucía (un mensaje, o la ficha final).
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Falta el historial de la conversación.' });
  }

  // Límite defensivo: evitar payloads abusivos.
  if (messages.length > 40) {
    return res.status(400).json({ error: 'Conversación demasiado larga.' });
  }

  const result = await continueConversation(messages);

  if (!result.ok) {
    return res.status(200).json({
      type: 'message',
      text:
        'Disculpa, tuve un problema para responder. ¿Puedes intentarlo de nuevo en un momento?',
      degraded: true,
    });
  }

  if (result.type === 'ficha') {
    return res.status(200).json({ type: 'ficha', ficha: result.ficha, text: result.text });
  }

  return res.status(200).json({ type: 'message', text: result.text });
}
