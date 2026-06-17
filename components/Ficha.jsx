import { useState } from 'react';
import { isValidEmail } from '../lib/validate';

/**
 * Renderiza la ficha final: el momento del negocio, el diagnóstico, la
 * herramienta estrella, las de apoyo, el plan de 7 días y la captura
 * OPCIONAL de email. Las herramientas salen del catálogo del PDF.
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

  const estrella = ficha.herramienta_estrella || {};
  const apoyo = ficha.herramientas_apoyo || [];

  return (
    <div className="ficha">
      <div className="ribbon">Momento: {ficha.momento}</div>
      <p className="diagnostico">{ficha.diagnostico}</p>

      <div className="estrella">
        <div className="estrella-label">Empieza por</div>
        <div className="estrella-nombre">{estrella.nombre}</div>
        <p className="estrella-para">{estrella.para_que}</p>
        {estrella.url && (
          <a className="estrella-link" href={toHref(estrella.url)} target="_blank" rel="noreferrer">
            {estrella.url} ↗
          </a>
        )}
      </div>

      {apoyo.length > 0 && (
        <>
          <h3>También te servirá</h3>
          <div className="herramientas">
            {apoyo.map((h, i) => (
              <div key={i} className="herramienta">
                <div className="h-top">
                  <span className="h-nombre">{h.nombre}</span>
                  {h.url && (
                    <a href={toHref(h.url)} target="_blank" rel="noreferrer" className="h-url">
                      {h.url} ↗
                    </a>
                  )}
                </div>
                <span className="h-para">{h.para_que}</span>
              </div>
            ))}
          </div>
        </>
      )}

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
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 20px;
          margin-bottom: 1rem;
        }

        .diagnostico {
          color: #444;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .estrella {
          border: 2px solid var(--primary);
          border-radius: 10px;
          padding: 1.25rem 1.5rem;
          background: rgba(27, 94, 63, 0.04);
        }

        .estrella-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--primary);
        }

        .estrella-nombre {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--dark);
          margin: 0.2rem 0 0.4rem;
        }

        .estrella-para {
          color: #555;
          margin: 0 0 0.6rem;
          line-height: 1.5;
        }

        .estrella-link {
          font-weight: 600;
          color: var(--primary);
          font-size: 0.9rem;
        }

        h3 {
          color: var(--primary);
          font-size: 1.05rem;
          margin: 1.75rem 0 0.75rem;
        }

        .herramientas {
          display: grid;
          gap: 0.7rem;
        }

        .herramienta {
          border-left: 3px solid var(--secondary);
          padding: 0.45rem 0 0.45rem 0.85rem;
        }

        .h-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.8rem;
        }

        .h-nombre {
          font-weight: 600;
          color: var(--dark);
        }

        .h-url {
          font-size: 0.8rem;
          color: var(--primary);
          white-space: nowrap;
        }

        .h-para {
          color: #666;
          font-size: 0.9rem;
        }

        .plan {
          margin: 0;
          padding: 0;
          list-style: none;
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
          background: rgba(242, 183, 5, 0.14);
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
          box-shadow: 0 0 0 3px rgba(27, 94, 63, 0.12);
        }

        .lead-row button {
          white-space: nowrap;
          padding: 12px 24px;
        }

        .lead-error {
          color: #c0392b;
          font-size: 0.8rem;
          margin-top: 0.4rem;
          display: block;
        }

        .lead-ok {
          color: var(--primary);
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

// Normaliza un dominio del catálogo a una URL navegable.
function toHref(url) {
  const u = String(url).trim();
  return u.startsWith('http') ? u : `https://${u}`;
}
