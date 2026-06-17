import { useState, useRef, useEffect } from 'react';
import Ficha from './Ficha';

const GREETING =
  '¡Hola! Soy Lucía 👋 Te voy a hacer unas preguntas cortas para entender en qué ' +
  'momento está tu negocio y recomendarte el mejor punto de partida con ' +
  'inteligencia artificial. Son unos 5 minutos y no necesitas registrarte. ' +
  'Para empezar, cuéntame: ¿a qué se dedica tu negocio y hace cuánto está en marcha?';

function initialMessages() {
  return [{ role: 'assistant', content: GREETING }];
}

export default function Chat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ficha, setFicha] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const reset = () => {
    setMessages(initialMessages());
    setInput('');
    setFicha(null);
  };

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();

      if (data.type === 'ficha') {
        // Mostramos un cierre breve de Lucía (si lo hay) y luego la ficha.
        if (data.text) {
          setMessages((m) => [...m, { role: 'assistant', content: data.text }]);
        }
        setFicha(data.ficha);
      } else {
        setMessages((m) => [...m, { role: 'assistant', content: data.text }]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: 'Disculpa, tuve un problema de conexión. ¿Puedes intentarlo otra vez?',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="chat-section" id="conversacion">
      <div className="container">
        <div className="chat-card">
          <div className="chat-header">
            <div className="avatar">L</div>
            <div>
              <div className="name">Lucía</div>
              <div className="status">Asistente de IA · en línea</div>
            </div>
          </div>

          <div className="messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.role}`}>
                {renderText(m.content)}
              </div>
            ))}

            {loading && (
              <div className="bubble assistant typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            {ficha && (
              <div className="ficha-slot">
                <Ficha ficha={ficha} onReset={reset} />
              </div>
            )}
          </div>

          {!ficha && (
            <form className="composer" onSubmit={send}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu respuesta..."
                disabled={loading}
                autoComplete="off"
              />
              <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
                Enviar
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .chat-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #fafaf8 0%, #f5f5f0 100%);
        }

        .chat-card {
          max-width: 640px;
          margin: 0 auto;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: var(--primary);
          color: white;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .name {
          font-weight: 600;
        }

        .status {
          font-size: 0.75rem;
          opacity: 0.85;
        }

        .messages {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-height: 320px;
          max-height: 460px;
          overflow-y: auto;
        }

        .bubble {
          max-width: 85%;
          padding: 0.7rem 1rem;
          border-radius: 14px;
          line-height: 1.5;
          font-size: 0.97rem;
          white-space: pre-wrap;
        }

        .bubble.assistant {
          align-self: flex-start;
          background: #f1f1ef;
          color: #1a1a1a;
          border-bottom-left-radius: 4px;
        }

        .bubble.user {
          align-self: flex-end;
          background: var(--primary);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .typing {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #aaa;
          animation: blink 1.2s infinite both;
        }

        .typing span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes blink {
          0%,
          80%,
          100% {
            opacity: 0.3;
          }
          40% {
            opacity: 1;
          }
        }

        .ficha-slot {
          margin-top: 0.5rem;
        }

        .composer {
          display: flex;
          gap: 0.6rem;
          padding: 1rem 1.25rem;
          border-top: 1px solid #eee;
        }

        .composer input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 24px;
          font-size: 1rem;
          font-family: inherit;
        }

        .composer input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(27, 94, 63, 0.1);
        }

        .composer button {
          border-radius: 24px;
          padding: 12px 24px;
        }

        .composer button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .chat-section {
            padding: 2rem 0;
          }
          .messages {
            max-height: 60vh;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * Render mínimo de *negritas* tipo markdown que usa Lucía en el saludo.
 */
function renderText(text) {
  const parts = String(text).split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <strong key={i}>{part.slice(1, -1)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}
