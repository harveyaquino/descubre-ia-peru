/**
 * Muestra el resultado: el análisis generado por Claude, o un mensaje de
 * éxito parcial si el análisis no se pudo generar (pero el lead sí se guardó).
 */
export default function Analysis({ result, onReset }) {
  const { analysis, message } = result;

  if (!analysis) {
    return (
      <div className="analysis-wrapper">
        <div className="success-icon">✓</div>
        <h2>¡Información recibida!</h2>
        <p className="success-msg">
          {message || 'Pronto te enviaremos tu análisis personalizado.'}
        </p>
        <button className="btn btn-secondary" onClick={onReset}>
          Enviar otro
        </button>

        <style jsx>{styles}</style>
      </div>
    );
  }

  const impactoColor = {
    alto: 'var(--accent)',
    medio: 'var(--secondary)',
    bajo: '#999',
  };

  return (
    <div className="analysis-wrapper">
      <div className="success-icon">✓</div>
      <h2>Tu análisis de IA</h2>

      <p className="resumen">{analysis.resumen}</p>

      <h3>Oportunidades para tu negocio</h3>
      <div className="oportunidades">
        {analysis.oportunidades.map((op, i) => (
          <div key={i} className="op-card">
            <div className="op-header">
              <span className="op-title">{op.titulo}</span>
              <span
                className="op-badge"
                style={{ background: impactoColor[op.impacto] || '#999' }}
              >
                {op.impacto}
              </span>
            </div>
            <p className="op-desc">{op.descripcion}</p>
          </div>
        ))}
      </div>

      <div className="primer-paso">
        <h3>Tu primer paso esta semana</h3>
        <p>{analysis.primer_paso}</p>
      </div>

      <button className="btn btn-secondary" onClick={onReset}>
        Analizar otro negocio
      </button>

      <style jsx>{styles}</style>
    </div>
  );
}

const styles = `
  .analysis-wrapper {
    max-width: 700px;
    margin: 0 auto;
    text-align: center;
  }

  .success-icon {
    width: 56px;
    height: 56px;
    margin: 0 auto 1rem;
    border-radius: 50%;
    background: var(--accent);
    color: white;
    font-size: 1.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h2 {
    color: var(--primary);
    margin-bottom: 1rem;
  }

  h3 {
    color: var(--dark);
    margin: 2rem 0 1rem;
    text-align: left;
  }

  .resumen,
  .success-msg {
    color: #444;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .oportunidades {
    display: grid;
    gap: 1rem;
    text-align: left;
  }

  .op-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.25rem;
    background: white;
  }

  .op-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    gap: 1rem;
  }

  .op-title {
    font-weight: 600;
    color: var(--dark);
  }

  .op-badge {
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 12px;
    white-space: nowrap;
  }

  .op-desc {
    color: #555;
    margin: 0;
    line-height: 1.5;
  }

  .primer-paso {
    margin-top: 2rem;
    padding: 1.5rem;
    background: rgba(247, 184, 1, 0.1);
    border-radius: 8px;
    text-align: left;
  }

  .primer-paso h3 {
    margin-top: 0;
  }

  .primer-paso p {
    color: #444;
    margin: 0;
    line-height: 1.6;
  }

  button {
    margin-top: 2rem;
    padding: 14px 32px;
  }
`;
