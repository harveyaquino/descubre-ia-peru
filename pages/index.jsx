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
        <title>Descubre tu primer empleado IA</title>
        <meta
          name="description"
          content="Conversa unos minutos y descubre qué parte de tu negocio puedes automatizar con IA. Para emprendedores y PYMEs del Perú."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Descubre tu primer empleado IA" />
        <meta
          property="og:description"
          content="Conversa unos minutos y descubre qué automatizar primero en tu negocio."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Primer Empleado IA" />
        <meta property="og:url" content="https://descubre-ia-cix.vercel.app/" />
        <meta property="og:locale" content="es_PE" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Descubre tu primer empleado IA" />
        <meta
          name="twitter:description"
          content="Conversa unos minutos y descubre qué automatizar primero en tu negocio."
        />
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
