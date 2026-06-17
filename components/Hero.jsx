export default function Hero({ onCTAClick }) {
  return (
    <section className="hero" id="inicio">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Descubre cómo la IA puede transformar tu negocio
          </h1>
          <p className="hero-subtitle">
            Únete a nuestro taller interactivo y aprende de expertos en Inteligencia Artificial.
            Una experiencia diseñada para empresas peruanas que desean innovar.
          </p>
          <p className="hero-meta">
            Completa tu perfil • Recibe recomendaciones personalizadas • Acceso a recursos exclusivos
          </p>
          <button className="btn btn-primary btn-large" onClick={onCTAClick}>
            Comienza ahora
          </button>
          <p className="hero-note">
            Gratis · Sin compromiso · Acceso inmediato
          </p>
        </div>
      </div>

      <style jsx>{`
        .hero {
          padding: 4rem 0;
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
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #555;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .hero-meta {
          font-size: 0.95rem;
          color: #777;
          margin-bottom: 2rem;
          font-weight: 500;
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
