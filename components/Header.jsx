export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1 className="logo-text">IA Perú</h1>
            <p className="logo-subtitle">Taller de Inteligencia Artificial</p>
          </div>
          <nav className="nav">
            <a href="#inicio" className="nav-link">Inicio</a>
            <a href="#proceso" className="nav-link">Proceso</a>
            <a href="#registro" className="nav-link">Registro</a>
          </nav>
        </div>
      </div>

      <style jsx>{`
        .header {
          background: white;
          border-bottom: 1px solid #e0e0e0;
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          flex: 1;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0;
        }

        .logo-subtitle {
          font-size: 0.75rem;
          color: #666;
          margin: 4px 0 0 0;
          font-weight: 500;
        }

        .nav {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          color: #333;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: var(--primary);
        }

        @media (max-width: 768px) {
          .nav {
            gap: 1rem;
            font-size: 0.9rem;
          }

          .logo-text {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </header>
  );
}
