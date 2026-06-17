/**
 * Botón flotante de WhatsApp para captar consultas directas ("quiero info
 * sobre herramientas de IA"). Pulso suave (no parpadeo) para mantener el tono
 * corporativo. El número es configurable por variable de entorno; si no está,
 * usa el número por defecto.
 */
const DEFAULT_NUMBER = '51979572350';
const MESSAGE =
  'Hola, vi la web y quiero información sobre herramientas de IA para mi negocio.';

export default function WhatsAppButton() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_NUMBER;
  const number = String(raw).replace(/\D/g, '');
  const href = `https://wa.me/${number}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      className="wa"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <span className="wa-label">¿Dudas? Escríbenos</span>
      <span className="wa-icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor">
          <path d="M16.04 3.2c-7.1 0-12.86 5.76-12.86 12.86 0 2.27.6 4.49 1.73 6.44L3.2 28.8l6.46-1.69a12.8 12.8 0 0 0 6.38 1.63h.01c7.1 0 12.86-5.76 12.86-12.86 0-3.44-1.34-6.67-3.77-9.1a12.78 12.78 0 0 0-9.1-3.78zm0 23.34h-.01a10.66 10.66 0 0 1-5.43-1.49l-.39-.23-4.03 1.06 1.08-3.93-.25-.4a10.65 10.65 0 0 1-1.63-5.69c0-5.9 4.8-10.7 10.7-10.7 2.86 0 5.54 1.11 7.56 3.13a10.62 10.62 0 0 1 3.13 7.57c0 5.9-4.8 10.68-10.7 10.68zm5.86-8c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.51-.16-.72.16-.21.32-.83 1.05-1.02 1.26-.19.21-.37.24-.69.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.91-1.79-2.23-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66 0 1.57 1.14 3.08 1.3 3.29.16.21 2.25 3.43 5.45 4.81.76.33 1.35.52 1.81.67.76.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37z" />
        </svg>
      </span>

      <style jsx>{`
        .wa {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 0;
        }

        .wa-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #25d366;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
          flex-shrink: 0;
          /* Pulso suave (no parpadeo) */
          animation: wa-pulse 2.4s ease-in-out infinite;
        }

        .wa-label {
          background: white;
          color: #1f2a37;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 9px 14px;
          border-radius: 22px;
          margin-right: 10px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          white-space: nowrap;
          /* Oculto por defecto en móvil; visible en hover en desktop */
          opacity: 0;
          transform: translateX(8px);
          transition: opacity 0.25s ease, transform 0.25s ease;
          pointer-events: none;
        }

        .wa:hover .wa-label {
          opacity: 1;
          transform: translateX(0);
        }

        .wa:hover .wa-icon {
          animation: none;
          transform: scale(1.05);
        }

        @keyframes wa-pulse {
          0% {
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(37, 211, 102, 0.45);
          }
          70% {
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2), 0 0 0 14px rgba(37, 211, 102, 0);
          }
          100% {
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }

        /* En pantallas grandes mostramos siempre la etiqueta */
        @media (min-width: 769px) {
          .wa-label {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wa-icon {
            animation: none;
          }
        }
      `}</style>
    </a>
  );
}
