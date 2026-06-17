export default function Hero({ onCTAClick }) {
  return (
    <section className="hero" id="inicio">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">Descubre por dónde empezar con IA en tu negocio</h1>
          <p className="hero-subtitle">
            Conversa unos minutos con Lucía: te hace un diagnóstico de tu negocio
            y te arma una ruta práctica con las herramientas de IA ideales para tu
            momento. Para emprendedores y PYMEs del Perú.
          </p>
          <button className="btn btn-primary btn-large" onClick={onCTAClick}>
            Empezar la conversación
          </button>
          <p className="hero-note">gratis · sin registro · te llevas tu diagnóstico y plan</p>
        </div>
      </div>

      <style jsx>{`
        .hero {
          padding: 5rem 0 4rem;
          text-align: center;
          background: linear-gradient(135deg, #fafaf8 0%, #f5f5f0 100%);
          border-bottom: 1px solid #e0e0e0;
        }

        .hero-content {
          max-width: 700px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 1rem;
          line-height: 1.15;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: #555;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .btn-large {
          padding: 16px 48px;
          font-size: 1.1rem;
        }

        .hero-note {
          font-size: 0.85rem;
          color: #888;
          margin-top: 1rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 3rem 0;
          }
          .hero-title {
            font-size: 2rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
          .btn-large {
            padding: 14px 32px;
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
