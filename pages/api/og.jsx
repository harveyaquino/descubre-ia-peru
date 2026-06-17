import { ImageResponse } from 'next/og';

/**
 * Imagen de previsualización (Open Graph) generada dinámicamente. Se usa al
 * compartir el link en WhatsApp/redes. 1200x630, colores de marca.
 */
export const config = { runtime: 'edge' };

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b5cab',
          color: 'white',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 14,
              height: 14,
              borderRadius: 7,
              background: '#00aeef',
              marginRight: 14,
            }}
          />
          Primer Empleado IA
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 66,
              fontWeight: 800,
              lineHeight: 1.08,
              maxWidth: 940,
            }}
          >
            Descubre por dónde empezar con IA en tu negocio
          </div>
          <div style={{ display: 'flex', fontSize: 32, marginTop: 28, color: '#cfe3f7' }}>
            Diagnóstico + ruta práctica en 5 minutos
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', fontSize: 26, color: '#bcd6f2' }}>
          gratis · sin registro · para emprendedores y PYMEs del Perú
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
