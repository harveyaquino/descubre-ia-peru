/**
 * Validación de los datos del formulario. Se usa tanto en el cliente (UX rápida)
 * como en el servidor (seguridad). Mantenerla aquí evita duplicar reglas.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLead(data) {
  const errors = {};
  const d = data || {};

  if (!d.name || !String(d.name).trim()) {
    errors.name = 'El nombre es obligatorio.';
  }

  if (!d.email || !EMAIL_RE.test(String(d.email).trim())) {
    errors.email = 'Ingresa un correo válido.';
  }

  if (!d.company || !String(d.company).trim()) {
    errors.company = 'La empresa es obligatoria.';
  }

  if (!d.industry || !String(d.industry).trim()) {
    errors.industry = 'Selecciona una industria.';
  }

  if (!d.challenge || !String(d.challenge).trim()) {
    errors.challenge = 'Cuéntanos tu desafío.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
