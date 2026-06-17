import { useState } from 'react';
import { validateLead } from '../lib/validate';
import Analysis from './Analysis';

const EMPTY = {
  name: '',
  email: '',
  company: '',
  industry: '',
  challenge: '',
  phone: '',
};

export default function SignupForm() {
  const [formData, setFormData] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const { valid, errors } = validateLead(formData);
    setFieldErrors(errors);
    if (!valid) return;

    setLoading(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFieldErrors(data.fields || {});
        setError(data.error || 'Ocurrió un error. Intenta de nuevo.');
        return;
      }

      setResult(data);
      setFormData(EMPTY);
    } catch (err) {
      setError('No pudimos conectar con el servidor. Intenta de nuevo.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Si ya hay análisis, lo mostramos en lugar del formulario.
  if (result) {
    return (
      <section className="signup" id="registro">
        <div className="container">
          <Analysis result={result} onReset={() => setResult(null)} />
        </div>
        <style jsx>{`
          .signup {
            padding: 4rem 0;
            background: #fafaf8;
            border-top: 1px solid #e0e0e0;
            border-bottom: 1px solid #e0e0e0;
          }
          @media (max-width: 768px) {
            .signup {
              padding: 2rem 0;
            }
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="signup" id="registro">
      <div className="container">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Cuéntanos sobre tu negocio</h2>
            <p>Completa este formulario y recibe tu análisis de IA al instante</p>
          </div>

          <form onSubmit={handleSubmit} className="form" noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Nombre completo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                />
                {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                />
                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Teléfono (opcional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+51 999 999 999"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Empresa/Negocio *</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Nombre de tu empresa"
                />
                {fieldErrors.company && <span className="field-error">{fieldErrors.company}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="industry">Industria *</label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Selecciona una industria</option>
                  <option value="retail">Retail/Comercio</option>
                  <option value="servicios">Servicios</option>
                  <option value="manufactura">Manufactura</option>
                  <option value="restaurante">Restaurante/Gastronomía</option>
                  <option value="educacion">Educación</option>
                  <option value="finanzas">Finanzas</option>
                  <option value="salud">Salud</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="otros">Otros</option>
                </select>
                {fieldErrors.industry && <span className="field-error">{fieldErrors.industry}</span>}
              </div>
            </div>

            <div className="form-group full">
              <label htmlFor="challenge">¿Cuál es tu mayor desafío actual? *</label>
              <textarea
                id="challenge"
                name="challenge"
                value={formData.challenge}
                onChange={handleChange}
                placeholder="Cuéntanos qué problema quieres resolver con IA..."
                rows="4"
              ></textarea>
              {fieldErrors.challenge && <span className="field-error">{fieldErrors.challenge}</span>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Analizando tu negocio...' : 'Obtener mi análisis gratis'}
            </button>

            {error && <div className="message error">{error}</div>}
          </form>
        </div>
      </div>

      <style jsx>{`
        .signup {
          padding: 4rem 0;
          background: #fafaf8;
          border-top: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
        }

        .form-wrapper {
          max-width: 600px;
          margin: 0 auto;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-header h2 {
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .form-header p {
          color: #666;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full {
          grid-column: 1 / -1;
        }

        label {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
          font-size: 0.9rem;
        }

        input,
        textarea,
        select {
          padding: 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.2s;
        }

        input:focus,
        textarea:focus,
        select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(212, 20, 90, 0.1);
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-select {
          cursor: pointer;
        }

        .field-error {
          color: var(--primary);
          font-size: 0.8rem;
          margin-top: 0.35rem;
        }

        button {
          width: 100%;
          padding: 14px 32px;
          margin-top: 1rem;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 4px;
          text-align: center;
          font-weight: 500;
        }

        .message.error {
          background: rgba(212, 20, 90, 0.1);
          color: var(--primary);
          border: 1px solid var(--primary);
        }

        @media (max-width: 768px) {
          .signup {
            padding: 2rem 0;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
