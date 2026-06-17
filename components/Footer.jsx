export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Primer Empleado IA</h3>
            <p>Descubre qué automatizar primero en tu negocio con inteligencia artificial.</p>
          </div>

          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul className="footer-links">
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#proceso">Cómo funciona</a></li>
              <li><a href="#conversacion">Empezar la conversación</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} · Hecho en Perú 🇵🇪</p>
          <p className="footer-meta">edición experimental · v1</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--dark);
          color: white;
          padding: 3rem 0 1rem;
          border-top: 1px solid #e0e0e0;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-section h3 {
          color: var(--secondary);
          margin-bottom: 1rem;
        }

        .footer-section h4 {
          color: white;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .footer-section p {
          color: #ccc;
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 0.5rem;
        }

        .footer-links a {
          color: #ccc;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: var(--secondary);
        }

        .contact-info {
          margin: 0;
        }

        .contact-info a {
          color: var(--secondary);
          text-decoration: underline;
        }

        .footer-bottom {
          border-top: 1px solid #444;
          padding-top: 1.5rem;
          text-align: center;
        }

        .footer-bottom p {
          color: #999;
          font-size: 0.85rem;
          margin: 0.5rem 0;
        }

        .footer-meta {
          color: #777;
          font-size: 0.8rem;
        }

        @media (max-width: 768px) {
          .footer {
            padding: 2rem 0 1rem;
          }

          .footer-content {
            gap: 1.5rem;
          }
        }
      `}</style>
    </footer>
  );
}
