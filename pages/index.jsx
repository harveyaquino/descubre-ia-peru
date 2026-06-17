import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Process from '../components/Process';
import SignupForm from '../components/SignupForm';
import Footer from '../components/Footer';

export default function Home() {
  const signupFormRef = useRef(null);
  const [supabase, setSupabase] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setError('Supabase no está configurado correctamente. Por favor, añade tus variables de entorno.');
    } else {
      const client = createClient(supabaseUrl, supabaseKey);
      setSupabase(client);
    }
  }, []);

  const handleCTAClick = () => {
    if (signupFormRef.current) {
      signupFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Head>
        <title>IA Perú | Taller de Inteligencia Artificial</title>
        <meta name="description" content="Descubre cómo la IA puede transformar tu negocio. Taller interactivo para empresas peruanas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="IA Perú | Taller de Inteligencia Artificial" />
        <meta property="og:description" content="Descubre cómo la IA puede transformar tu negocio" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Hero onCTAClick={handleCTAClick} />
      <Process />

      <div ref={signupFormRef}>
        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #fcc',
            padding: '1rem',
            margin: '1rem',
            borderRadius: '4px',
            textAlign: 'center',
            color: '#c00'
          }}>
            <strong>Nota:</strong> {error}
          </div>
        )}
        <SignupForm supabase={supabase} />
      </div>

      <Footer />

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
}
