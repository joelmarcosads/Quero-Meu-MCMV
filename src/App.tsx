import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LazyMotion, domAnimation } from 'motion/react';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from "./components/WhatsAppButton";
import Home from './pages/Home';

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const ReservaDosPassaros2 = lazy(() => import('./pages/ReservaDosPassaros2'));
const PrimeClubItaborai = lazy(() => import('./pages/PrimeClubItaborai'));
const FloresDeMaio = lazy(() => import('./pages/FloresDeMaio'));
const SolarDaTrindade = lazy(() => import('./pages/SolarDaTrindade'));
const ResidencialFlorescer = lazy(() => import('./pages/ResidencialFlorescer'));
const ConquistaOceanica = lazy(() => import('./pages/ConquistaOceanica'));
const McmvItaborai = lazy(() => import('./pages/McmvItaborai'));
const McmvSaoGoncalo = lazy(() => import('./pages/McmvSaoGoncalo'));
const Financiamento = lazy(() => import('./pages/Financiamento'));
const Sobre = lazy(() => import('./pages/Sobre'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <LazyMotion features={domAnimation}>
      <BrowserRouter>
        <ScrollToTop />
        <WhatsAppButton />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
            <Route path="/termos-de-uso" element={<TermsOfUse />} />
            <Route path="/reserva-dos-passaros-2" element={<ReservaDosPassaros2 />} />
            <Route path="/prime-club-itaborai" element={<PrimeClubItaborai />} />
            <Route path="/flores-de-maio" element={<FloresDeMaio />} />
            <Route path="/solar-da-trindade" element={<SolarDaTrindade />} />
            <Route path="/residencial-florescer" element={<ResidencialFlorescer />} />
            <Route path="/conquista-oceanica" element={<ConquistaOceanica />} />
            <Route path="/minha-casa-minha-vida-itaborai" element={<McmvItaborai />} />
            <Route path="/minha-casa-minha-vida-sao-goncalo" element={<McmvSaoGoncalo />} />
            <Route path="/financiamento-minha-casa-minha-vida" element={<Financiamento />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LazyMotion>
  );
}
