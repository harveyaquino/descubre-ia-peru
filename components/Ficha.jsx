import { useState } from 'react';
import { isValidEmail } from '../lib/validate';

/**
 * Ficha final: diagnóstico, mapa de las 4 dimensiones (Base, Sistemas,
 * Contenido, Escalar), prioridad inmediata, ruta con links, plan de 7 días
 * y captura OPCIONAL de email.
 */

const ESTADO_META = {
  tiene: { label: 'Ya lo tienes', icon: '✓', color: '#1f9d55', bg: 'rgba(31,157,85,0.1)' },
  mejorar: { label: 'Por mejorar', icon: '◐', color: '#c8810a', bg: 'rgba(200,129,10,0.12)' },
  falta: { label: 'Te falta', icon: '○', color: '#c0392b', bg: 'rgba(192,57,43,0.1)' },
};

function toHref(url) {
  const u = String(url || '').trim();
  if (!u) return '#';
  return u.startsWith('http') ? u : `https://${u}`;
}

function Herramienta({ h }) {
  if (!h) return null;
  return (
    <div className="tool">
      <div className="tool-top">
        <span className="tool-name">{h.nombre}</span>
        {h.url && (
          <a className="tool-url" href={toHref(h.url)} target="_blank" rel="noreferrer">
            {h.url} ↗
          </a>
        )}
      </div>
      <span className="tool-para">{h.para_que}</span>
      <style jsx>{`
        .tool {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .tool-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.8rem;
        }
        .tool-name {
          font-weight: 600;
          color: var(--dark);
        }
        .tool-url {
          font-size: 0.8rem;
          color: var(--primary);
          white-space: nowrap;
        }
        .tool-para {
          color: #666;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}

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

  const dimensiones = ficha.dimensiones || [];
  const prioridad = ficha.prioridad || {};
  const ruta = ficha.ruta || [];

  return (
    <div className="ficha">
      <div className="ribbon">Tu diagnóstico de IA</div>
      <p className="diagnostico">{ficha.diagnostico}</p>

      {/* Mapa de las 4 dimensiones */}
      <h3>Cómo está tu negocio hoy</h3>
      <div className="mapa">
        {dimensiones.map((d, i) => {
          const meta = ESTADO_META[d.estado] || ESTADO_META.falta;
          return (
            <div key={i} className="dim" style={{ borderColor: meta.color }}>
              <div className="dim-head">
                <span className="dim-etapa">{d.etapa}</span>
                <span className="dim-pill" style={{ color: meta.color, background: meta.bg }}>
                  {meta.icon} {meta.label}
                </span>
              </div>
              <span className="dim-nota">{d.nota}</span>
            </div>
          );
        })}
      </div>

      {/* Prioridad inmediata */}
      <div className="prioridad">
        <div className="prioridad-label">Empieza por aquí</div>
        <div className="prioridad-titulo">{prioridad.titulo}</div>
        <p className="prioridad-porque">{prioridad.por_que}</p>
        <Herramienta h={prioridad.herramienta} />
      </div>

      {/* Ruta */}
      {ruta.length > 0 && (
        <>
          <h3>Tu ruta siguiente</h3>
          <div className="ruta">
            {ruta.map((r, i) => (
              <div key={i} className="ruta-paso">
                <div className="ruta-num">{i + 1}</div>
                <div className="ruta-cuerpo">
                  <div className="ruta-titulo">{r.titulo}</div>
                  <Herramienta h={r.herramienta} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Plan de 7 días */}
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
          margin-bottom: 1rem;
        }

        h3 {
          color: var(--primary);
          font-size: 1.05rem;
          margin: 1.75rem 0 0.85rem;
        }

        /* Mapa de dimensiones */
        .mapa {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.7rem;
        }

        .dim {
          border: 1px solid #eee;
          border-left-width: 4px;
          border-radius: 8px;
          padding: 0.75rem 0.9rem;
          background: #fcfcfb;
        }

        .dim-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.35rem;
          gap: 0.4rem;
        }

        .dim-etapa {
          font-weight: 700;
          color: var(--dark);
          font-size: 0.95rem;
        }

        .dim-pill {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          white-space: nowrap;
        }

        .dim-nota {
          color: #666;
          font-size: 0.82rem;
          line-height: 1.4;
        }

        /* Prioridad */
        .prioridad {
          margin-top: 1.75rem;
          border: 2px solid var(--primary);
          border-radius: 10px;
          padding: 1.25rem 1.5rem;
          background: rgba(11, 92, 171, 0.04);
        }

        .prioridad-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--primary);
        }

        .prioridad-titulo {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--dark);
          margin: 0.2rem 0 0.4rem;
        }

        .prioridad-porque {
          color: #555;
          margin: 0 0 0.8rem;
          line-height: 1.5;
        }

        /* Ruta */
        .ruta {
          display: grid;
          gap: 0.8rem;
        }

        .ruta-paso {
          display: flex;
          gap: 0.8rem;
          align-items: flex-start;
        }

        .ruta-num {
          width: 26px;
          height: 26px;
          flex-shrink: 0;
          border-radius: 50%;
          background: var(--secondary);
          color: #08263f;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ruta-cuerpo {
          flex: 1;
        }

        .ruta-titulo {
          font-weight: 600;
          color: var(--dark);
          margin-bottom: 0.2rem;
        }

        /* Plan */
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
          background: rgba(0, 174, 239, 0.1);
          border-radius: 8px;
          color: #444;
          line-height: 1.6;
        }

        /* Lead */
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
          box-shadow: 0 0 0 3px rgba(11, 92, 171, 0.12);
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
          .mapa {
            grid-template-columns: 1fr;
          }
          .lead-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
