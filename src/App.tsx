import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'motion/react';
import ScrollToTop from './components/ScrollToTop';
import UtmTracker from './components/UtmTracker';
import Home from './pages/Home';
import Obrigado from './pages/Obrigado';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import ReservaDosPassaros2 from './pages/ReservaDosPassaros2';
import PrimeClubItaborai from './pages/PrimeClubItaborai';
import FloresDeMaio from './pages/FloresDeMaio';
import SolarDaTrindade from './pages/SolarDaTrindade';
import ResidencialFlorescer from './pages/ResidencialFlorescer';
import ConquistaOceanica from './pages/ConquistaOceanica';
import McmvItaborai from './pages/McmvItaborai';
import McmvSaoGoncalo from './pages/McmvSaoGoncalo';
import Financiamento from './pages/Financiamento';
import FgtsMcmv from './pages/FgtsMcmv';
import SubsidioMcmv from './pages/SubsidioMcmv';
import RendaMcmv from './pages/RendaMcmv';
import DocumentosMcmv from './pages/DocumentosMcmv';
import Sobre from './pages/Sobre';
import NotFound from './pages/NotFound';
import ObrigadoImovel from './components/ObrigadoImovel';
import CaptacaoDeImoveis from './pages/CaptacaoDeImoveis';

export function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <UtmTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/captacaodeimoveis" element={<CaptacaoDeImoveis />} />
        <Route path="/captacaodeimoveis/" element={<CaptacaoDeImoveis />} />
        <Route path="/captacaodeimoveis/index.html" element={<CaptacaoDeImoveis />} />
        <Route path="/captacaodeimoveis.html" element={<CaptacaoDeImoveis />} />
        <Route path="/captacao" element={<CaptacaoDeImoveis />} />
        <Route path="/captacao/" element={<CaptacaoDeImoveis />} />
        <Route path="/captacao-de-imoveis" element={<CaptacaoDeImoveis />} />
        <Route path="/obrigado" element={<Obrigado />} />
        <Route path="/obrigado/" element={<Obrigado />} />
        <Route path="/obrigado.html" element={<Obrigado />} />
        <Route path="/obrigado.imoveis" element={<ObrigadoImovel />} />
        <Route path="/obrigado.imoveis/" element={<ObrigadoImovel />} />
        <Route path="/obrigado.imoveis.html" element={<ObrigadoImovel />} />
        <Route path="/obrigado-imovel" element={<ObrigadoImovel />} />
        <Route path="/obrigado-imovel/" element={<ObrigadoImovel />} />
        <Route path="/obrigado-imovel.html" element={<ObrigadoImovel />} />
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
        <Route path="/fgts-minha-casa-minha-vida" element={<FgtsMcmv />} />
        <Route path="/subsidio-minha-casa-minha-vida" element={<SubsidioMcmv />} />
        <Route path="/renda-minha-casa-minha-vida" element={<RendaMcmv />} />
        <Route path="/documentos-minha-casa-minha-vida" element={<DocumentosMcmv />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <LazyMotion features={domAnimation}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </LazyMotion>
  );
}
