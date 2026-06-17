/**
 * Validación de email. Se usa en el cliente (UX) y en el servidor (seguridad)
 * cuando el usuario decide, opcionalmente, recibir su ficha por correo.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return typeof value === 'string' && EMAIL_RE.test(value.trim());
}
