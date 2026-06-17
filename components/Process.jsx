export default function Process() {
  const steps = [
    {
      number: '01',
      title: 'Completa tu perfil',
      description: 'Cuéntanos sobre tu negocio, desafíos y objetivos. Solo 5-10 minutos.'
    },
    {
      number: '02',
      title: 'Recibe análisis personalizado',
      description: 'Nuestro sistema IA analiza tu situación y genera recomendaciones específicas para ti.'
    },
    {
      number: '03',
      title: 'Acceso a plan de acción',
      description: 'Obtén un roadmap claro con pasos próximos para comenzar a implementar IA en tu empresa.'
    }
  ];

  return (
    <section className="process" id="proceso">
      <div className="container">
        <h2 className="process-title">Así funciona</h2>
        <div className="steps-grid">
          {steps.map((step) => (
            <div key={step.number} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .process {
          padding: 4rem 0;
          background: white;
        }

        .process-title {
          text-align: center;
          margin-bottom: 3rem;
          color: var(--primary);
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .step-card {
          padding: 2rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #fafaf8;
          transition: all 0.3s ease;
        }

        .step-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(212, 20, 90, 0.1);
          border-color: var(--primary);
        }

        .step-number {
          font-size: 3rem;
          font-weight: 700;
          color: var(--secondary);
          margin-bottom: 1rem;
        }

        .step-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--dark);
          margin-bottom: 0.75rem;
        }

        .step-description {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 768px) {
          .process {
            padding: 2rem 0;
          }

          .steps-grid {
            gap: 1.5rem;
          }

          .step-card {
            padding: 1.5rem;
          }

          .step-number {
            font-size: 2rem;
          }

          .step-title {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </section>
  );
}
