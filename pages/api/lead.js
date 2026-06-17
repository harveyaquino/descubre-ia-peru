import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { isValidEmail } from '../../lib/validate';

/**
 * Captura opcional de lead al final de la conversación. Guarda el email
 * y la ficha generada. Si Supabase no está configurado, responde ok sin
 * guardar (no rompemos la experiencia del usuario).
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email, ficha } = req.body || {};

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Ingresa un correo válido.' });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    // Sin Supabase: confirmamos igual para no frustrar al usuario.
    return res.status(200).json({ saved: false });
  }

  const { error } = await supabase.from('leads').insert([
    {
      email: String(email).trim().toLowerCase(),
      ficha: ficha || null,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error('Error guardando lead:', error.message);
    return res.status(200).json({ saved: false });
  }

  return res.status(200).json({ saved: true });
}
