import { useRef } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Process from '../components/Process';
import Chat from '../components/Chat';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function Home() {
  const chatRef = useRef(null);

  const handleCTAClick = () => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>Descubre por dónde empezar con IA en tu negocio</title>
        <meta
          name="description"
          content="Conversa unos minutos con Lucía y recibe un diagnóstico de tu negocio y una ruta práctica con IA. Para emprendedores y PYMEs del Perú."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Descubre por dónde empezar con IA en tu negocio" />
        <meta
          property="og:description"
          content="Conversa unos minutos con Lucía: diagnóstico de tu negocio + ruta práctica con IA. Gratis y sin registro."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Primer Empleado IA" />
        <meta property="og:url" content="https://descubre-ia-cix.vercel.app/" />
        <meta property="og:locale" content="es_PE" />
        <meta property="og:image" content="https://descubre-ia-cix.vercel.app/api/og" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Descubre por dónde empezar con IA en tu negocio" />
        <meta
          name="twitter:description"
          content="Diagnóstico de tu negocio + ruta práctica con IA. Gratis y sin registro."
        />
        <meta name="twitter:image" content="https://descubre-ia-cix.vercel.app/api/og" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Hero onCTAClick={handleCTAClick} />
      <Process />

      <div ref={chatRef}>
        <Chat />
      </div>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
