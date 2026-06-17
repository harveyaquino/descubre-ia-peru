import { useState } from 'react';

export default function SignupForm({ supabase }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    challenge: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!supabase) {
        setError('Error de configuración. Por favor, verifica tus credenciales de Supabase.');
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('leads')
        .insert([{
          name: formData.name,
          email: formData.email,
          company: formData.company,
          industry: formData.industry,
          challenge: formData.challenge,
          phone: formData.phone,
          created_at: new Date().toISOString()
        }]);

      if (insertError) throw insertError;

      setMessage('¡Perfecto! Tu información fue recibida. Pronto recibirás tu análisis personalizado.');
      setFormData({
        name: '',
        email: '',
        company: '',
        industry: '',
        challenge: '',
        phone: ''
      });
    } catch (err) {
      setError(err.message || 'Error al enviar el formulario. Intenta de nuevo.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="signup" id="registro">
      <div className="container">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Cuéntanos sobre tu negocio</h2>
            <p>Completa este formulario para recibir tu análisis personalizado de IA</p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Nombre completo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+51 (xxx) xxx-xxxx"
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
                  required
                  placeholder="Nombre de tu empresa"
                />
              </div>

              <div className="form-group">
                <label htmlFor="industry">Industria *</label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Selecciona una industria</option>
                  <option value="retail">Retail/Comercio</option>
                  <option value="servicios">Servicios</option>
                  <option value="manufactura">Manufactura</option>
                  <option value="educacion">Educación</option>
                  <option value="finanzas">Finanzas</option>
                  <option value="salud">Salud</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
            </div>

            <div className="form-group full">
              <label htmlFor="challenge">¿Cuál es tu mayor desafío actual? *</label>
              <textarea
                id="challenge"
                name="challenge"
                value={formData.challenge}
                onChange={handleChange}
                required
                placeholder="Cuéntanos qué problema quieres resolver con IA..."
                rows="4"
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar mi información'}
            </button>

            {message && <div className="message success">{message}</div>}
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

        input, textarea, select {
          padding: 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.2s;
        }

        input:focus, textarea:focus, select:focus {
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

        .message.success {
          background: rgba(0, 168, 107, 0.1);
          color: #00a86b;
          border: 1px solid #00a86b;
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
