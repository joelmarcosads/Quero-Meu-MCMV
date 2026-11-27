import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'motion/react';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppFloat from './components/WhatsAppFloat';
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
import NiteroiRJ from './pages/NiteroiRJ';
import UnicSaoGoncalo from './pages/UnicSaoGoncalo';
import MiranteBoacVista from './pages/MiranteBoacVista';
import VertAlcantara from './pages/VertAlcantara';
import MarDeTrindade from './pages/MarDeTrindade';
import OrlaCentralNiteroi from './pages/OrlaCentralNiteroi';
import BosqueResidenceNiteroi from './pages/BosqueResidenceNiteroi';
import OrlaGuanabaraNiteroi from './pages/OrlaGuanabaraNiteroi';
import SunInStudioDesignNiteroi from './pages/SunInStudioDesignNiteroi';
import CaminhosGuanabaraNiteroi from './pages/CaminhosGuanabaraNiteroi';
import ImperioDoOuroSG from './pages/ImperioDoOuroSG';
import NiteroiOpenResidence from './pages/NiteroiOpenResidence';
import GreenOpenResidencialNiteroi from './pages/GreenOpenResidencialNiteroi';
import GreenLifeNiteroi from './pages/GreenLifeNiteroi';
import SolarManilha from './pages/SolarManilha';

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
        <Route path="/solar-manilha-itaborai" element={<SolarManilha />} />
        <Route path="/solar-de-manilha-itaborai" element={<SolarManilha />} />
        <Route path="/minha-casa-minha-vida-itaborai" element={<McmvItaborai />} />
        <Route path="/minha-casa-minha-vida-sao-goncalo" element={<McmvSaoGoncalo />} />
        <Route path="/financiamento-minha-casa-minha-vida" element={<Financiamento />} />
        <Route path="/fgts-minha-casa-minha-vida" element={<FgtsMcmv />} />
        <Route path="/subsidio-minha-casa-minha-vida" element={<SubsidioMcmv />} />
        <Route path="/renda-minha-casa-minha-vida" element={<RendaMcmv />} />
        <Route path="/documentos-minha-casa-minha-vida" element={<DocumentosMcmv />} />
        <Route path="/niteroirj" element={<NiteroiRJ />} />
        <Route path="/unicsaogoncalo" element={<UnicSaoGoncalo />} />
        <Route path="/orla-central-niteroi" element={<OrlaCentralNiteroi />} />
        <Route path="/orla-central-niteroi/" element={<OrlaCentralNiteroi />} />
        <Route path="/bosque-residence-niteroi" element={<BosqueResidenceNiteroi />} />
        <Route path="/bosque-residence-niteroi/" element={<BosqueResidenceNiteroi />} />
        <Route path="/orla-guanabara-niteroi" element={<OrlaGuanabaraNiteroi />} />
        <Route path="/orla-guanabara-niteroi/" element={<OrlaGuanabaraNiteroi />} />
        <Route path="/sun-in-studio-design-niteroi" element={<SunInStudioDesignNiteroi />} />
        <Route path="/sun-in-studio-design-niteroi/" element={<SunInStudioDesignNiteroi />} />
        <Route path="/caminhos-guanabara-niteroi" element={<CaminhosGuanabaraNiteroi />} />
        <Route path="/caminhos-guanabara-niteroi/" element={<CaminhosGuanabaraNiteroi />} />
        <Route path="/imperio-do-ouro-sg" element={<ImperioDoOuroSG />} />
        <Route path="/imperio-do-ouro-sg/" element={<ImperioDoOuroSG />} />
        <Route path="/niteroi-open-residence" element={<NiteroiOpenResidence />} />
        <Route path="/niteroi-open-residence/" element={<NiteroiOpenResidence />} />
        <Route path="/green-open-residencial-niteroi" element={<GreenOpenResidencialNiteroi />} />
        <Route path="/green-open-residencial-niteroi/" element={<GreenOpenResidencialNiteroi />} />
        <Route path="/green-life-niteroi" element={<GreenLifeNiteroi />} />
        <Route path="/green-life-niteroi/" element={<GreenLifeNiteroi />} />
        <Route path="/mirante-boa-vista" element={<MiranteBoacVista />} />
        <Route path="/vert-alcantara" element={<VertAlcantara />} />
        <Route path="/apartamentos-mar-de-trindade" element={<MarDeTrindade />} />
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
        <WhatsAppFloat />
      </BrowserRouter>
    </LazyMotion>
  );
}
