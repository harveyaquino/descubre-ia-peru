import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { analyzeLead } from '../../lib/analyze';
import { validateLead } from '../../lib/validate';

/**
 * Recibe el formulario, valida, guarda el lead en Supabase y genera un
 * análisis personalizado con Claude. Todo ocurre en el servidor, así las
 * claves (service_role + Anthropic) nunca llegan al navegador.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { valid, errors } = validateLead(req.body);
  if (!valid) {
    return res.status(400).json({ error: 'Datos inválidos', fields: errors });
  }

  const lead = {
    name: String(req.body.name).trim(),
    email: String(req.body.email).trim().toLowerCase(),
    company: String(req.body.company).trim(),
    industry: String(req.body.industry).trim(),
    challenge: String(req.body.challenge).trim(),
    phone: req.body.phone ? String(req.body.phone).trim() : null,
  };

  // 1. Guardar el lead. Si Supabase no está configurado, no bloqueamos:
  //    seguimos con el análisis para no perder la experiencia del usuario.
  const supabase = getSupabaseAdmin();
  let saved = false;
  if (supabase) {
    const { error } = await supabase.from('leads').insert([
      { ...lead, created_at: new Date().toISOString() },
    ]);
    if (error) {
      console.error('Error guardando lead en Supabase:', error.message);
    } else {
      saved = true;
    }
  }

  // 2. Generar análisis con Claude.
  const result = await analyzeLead(lead);

  if (!result.ok) {
    // El lead ya quedó guardado; devolvemos éxito parcial.
    return res.status(200).json({
      saved,
      analysis: null,
      message:
        'Recibimos tu información. Pronto te enviaremos tu análisis personalizado.',
    });
  }

  return res.status(200).json({ saved, analysis: result.analysis });
}
