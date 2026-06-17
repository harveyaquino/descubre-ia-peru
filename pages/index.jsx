import { useRef } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Process from '../components/Process';
import SignupForm from '../components/SignupForm';
import Footer from '../components/Footer';

export default function Home() {
  const signupRef = useRef(null);

  const handleCTAClick = () => {
    signupRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>IA Perú | Taller de Inteligencia Artificial</title>
        <meta
          name="description"
          content="Descubre cómo la IA puede transformar tu negocio. Taller interactivo para empresas peruanas."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="IA Perú | Taller de Inteligencia Artificial" />
        <meta property="og:description" content="Descubre cómo la IA puede transformar tu negocio" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Hero onCTAClick={handleCTAClick} />
      <Process />

      <div ref={signupRef}>
        <SignupForm />
      </div>

      <Footer />
    </>
  );
}
