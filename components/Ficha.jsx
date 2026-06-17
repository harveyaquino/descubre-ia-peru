import { useState } from 'react';
import { isValidEmail } from '../lib/validate';

/**
 * Renderiza la ficha final: el "primer empleado IA" recomendado, sus tareas,
 * herramientas, el plan de 7 días y la captura OPCIONAL de email.
 */
export default function Ficha({ ficha, onReset }) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) {
      setError('Ingresa un correo válido.');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ficha }),
      });
      if (!res.ok) throw new Error('fallo');
      setSent(true);
    } catch {
      setError('No pudimos guardar tu correo. Intenta de nuevo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="ficha">
      <div className="ribbon">Tu primer empleado IA</div>
      <h2 className="empleado">{ficha.empleado_nombre}</h2>
      <p className="resumen">{ficha.empleado_resumen}</p>

      <h3>Qué haría por ti</h3>
      <ul className="tareas">
        {(ficha.tareas || []).map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>

      <h3>Con qué herramientas empezar</h3>
      <div className="herramientas">
        {(ficha.herramientas || []).map((h, i) => (
          <div key={i} className="herramienta">
            <span className="h-nombre">{h.nombre}</span>
            <span className="h-para">{h.para_que}</span>
          </div>
        ))}
      </div>

      <h3>Tu plan de 7 días</h3>
      <ol className="plan">
        {(ficha.plan_7_dias || []).map((p, i) => (
          <li key={i}>
            <span className="dia">{p.dia}</span>
            <span className="accion">{p.accion}</span>
          </li>
        ))}
      </ol>

      {ficha.cierre && <p className="cierre">{ficha.cierre}</p>}

      {/* Captura de email OPCIONAL */}
      <div className="lead-box">
        {sent ? (
          <p className="lead-ok">✓ ¡Listo! Te enviaremos tu ficha y plan al correo.</p>
        ) : (
          <form onSubmit={handleSend} className="lead-form" noValidate>
            <label htmlFor="lead-email">¿Quieres recibir tu ficha y plan por correo? (opcional)</label>
            <div className="lead-row">
              <input
                id="lead-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
              />
              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? 'Enviando...' : 'Enviármela'}
              </button>
            </div>
            {error && <span className="lead-error">{error}</span>}
          </form>
        )}
      </div>

      <button className="btn btn-secondary reset" onClick={onReset}>
        Empezar de nuevo
      </button>

      <style jsx>{`
        .ficha {
          max-width: 640px;
          margin: 0 auto;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 2.5rem;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
        }

        .ribbon {
          display: inline-block;
          background: var(--primary);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 20px;
          margin-bottom: 1rem;
        }

        .empleado {
          color: var(--dark);
          margin-bottom: 0.5rem;
        }

        .resumen {
          color: #555;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        h3 {
          color: var(--primary);
          font-size: 1.05rem;
          margin: 1.75rem 0 0.75rem;
        }

        .tareas {
          margin: 0;
          padding-left: 1.2rem;
          color: #444;
        }

        .tareas li {
          margin-bottom: 0.4rem;
        }

        .herramientas {
          display: grid;
          gap: 0.6rem;
        }

        .herramienta {
          display: flex;
          flex-direction: column;
          border-left: 3px solid var(--secondary);
          padding: 0.4rem 0 0.4rem 0.8rem;
        }

        .h-nombre {
          font-weight: 600;
          color: var(--dark);
        }

        .h-para {
          color: #666;
          font-size: 0.9rem;
        }

        .plan {
          margin: 0;
          padding: 0;
          list-style: none;
          counter-reset: none;
        }

        .plan li {
          display: flex;
          gap: 0.8rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .plan li:last-child {
          border-bottom: none;
        }

        .dia {
          font-weight: 700;
          color: var(--accent);
          min-width: 56px;
          flex-shrink: 0;
        }

        .accion {
          color: #444;
        }

        .cierre {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(247, 184, 1, 0.12);
          border-radius: 8px;
          color: #444;
          line-height: 1.6;
        }

        .lead-box {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #eee;
        }

        .lead-form label {
          display: block;
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
          margin-bottom: 0.6rem;
        }

        .lead-row {
          display: flex;
          gap: 0.6rem;
        }

        .lead-row input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
        }

        .lead-row input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(212, 20, 90, 0.1);
        }

        .lead-row button {
          white-space: nowrap;
          padding: 12px 24px;
        }

        .lead-error {
          color: var(--primary);
          font-size: 0.8rem;
          margin-top: 0.4rem;
          display: block;
        }

        .lead-ok {
          color: var(--accent);
          font-weight: 600;
          margin: 0;
        }

        .reset {
          width: 100%;
          margin-top: 1.5rem;
          padding: 12px;
        }

        @media (max-width: 768px) {
          .ficha {
            padding: 1.5rem;
          }
          .lead-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
