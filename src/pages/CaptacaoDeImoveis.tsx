import { useState, useId } from 'react';
import { Helmet } from 'react-helmet-async';
import OwnerForm from '../components/OwnerForm';
import CreciDiferenciaisDestaque from '../components/CreciDiferenciaisDestaque';

export default function CaptacaoDeImoveis() {
  const [activeTab, setActiveTab] = useState<'vender' | 'alugar'>('vender');
  const [iptu, setIptu] = useState<number>(1200);
  const [condo, setCondo] = useState<number>(350);
  const [outras, setOutras] = useState<number>(150);
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const iptuId = useId();
  const condoId = useId();
  const outrasId = useId();

  // Cálculo da despesa mensal do imóvel parado
  const monthlyCost = (iptu / 12) + condo + outras;
  const sixMonthsCost = monthlyCost * 6;
  const twelveMonthsCost = monthlyCost * 12;

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="captacao-page bg-[#FAF7F2] text-[#2A1D15] antialiased selection:bg-[#E0D3C4] min-h-screen">
      <Helmet>
        <title>Avaliação Gratuita do Seu Imóvel em Itaboraí e Região</title>
        <meta name="description" content="Quer vender seu imóvel em Itaboraí, São Gonçalo ou Niterói? Receba uma avaliação gratuita com corretor CRECI 39.583F." />
        <link rel="canonical" href="https://queromeumcmv.com.br/captacaodeimoveis" />

        {/* Open Graph / Redes Sociais */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://queromeumcmv.com.br/captacaodeimoveis" />
        <meta property="og:title" content="Avaliação Gratuita do Seu Imóvel em Itaboraí e Região" />
        <meta property="og:description" content="Quer vender seu imóvel em Itaboraí, São Gonçalo ou Niterói? Receba uma avaliação gratuita com corretor CRECI 39.583F." />
        <meta property="og:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Avaliação Gratuita do Seu Imóvel em Itaboraí e Região" />
        <meta name="twitter:description" content="Quer vender seu imóvel em Itaboraí, São Gonçalo ou Niterói? Receba uma avaliação gratuita com corretor CRECI 39.583F." />
        <meta name="twitter:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />

        {/* Geo Tags / AEO */}
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Itaboraí, Rio de Janeiro" />
        <meta name="geo.position" content="-22.7444;-42.8597" />
        <meta name="ICBM" content="-22.7444, -42.8597" />
      </Helmet>

      {/* CABEÇALHO OFICIAL */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E0D3C4] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20 gap-4 flex-nowrap">
            
            {/* Logo / Brand Quero Meu MCMV */}
            <a href="/" className="flex-shrink-0 flex items-center cursor-pointer gap-2" title="Quero Meu MCMV - Página Inicial">
              <div className="bg-[#1e3a8a] text-white p-2 rounded-lg shrink-0 flex items-center justify-center shadow-xs">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex items-center shrink-0">
                <span className="font-extrabold text-lg sm:text-xl md:text-2xl leading-none text-[#1e3a8a] tracking-tight mr-1 whitespace-nowrap">Quero Meu</span>
                <span className="font-black text-lg sm:text-xl md:text-2xl leading-none text-[#c2410c] tracking-tighter uppercase whitespace-nowrap">MCMV</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-6">
              <button 
                onClick={() => scrollToSection('credencial-creci')} 
                className="text-slate-700 hover:text-[#1e3a8a] font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#0F7A5A]"></span>
                <span>CRECI 39.583F & Diferenciais</span>
              </button>
              <button 
                onClick={() => scrollToSection('avaliacao')} 
                className="text-slate-700 hover:text-[#1e3a8a] font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer"
              >
                Avaliação Grátis
              </button>
              <button 
                onClick={() => scrollToSection('calculadora')} 
                className="text-slate-700 hover:text-[#1e3a8a] font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer"
              >
                Calculadora
              </button>
              <button 
                onClick={() => scrollToSection('como-funciona')} 
                className="text-slate-700 hover:text-[#1e3a8a] font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer"
              >
                Como Funciona
              </button>
              <button 
                onClick={() => scrollToSection('sobre')} 
                className="text-slate-700 hover:text-[#1e3a8a] font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer"
              >
                Sobre o Corretor
              </button>
              <button 
                onClick={() => scrollToSection('faq')} 
                className="text-slate-700 hover:text-[#1e3a8a] font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer"
              >
                Dúvidas
              </button>
            </nav>

            {/* Selo de Região / Confiança */}
            <div className="hidden lg:flex items-center text-slate-600 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 gap-1.5 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#E0D3C4]">
              <svg className="w-4 h-4 text-[#1e3a8a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Itaboraí e Região · CRECI 39.583</span>
            </div>

            {/* CTA + Botão Menu Mobile */}
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => scrollToSection('avaliacao')}
                className="inline-flex bg-[#0F7A5A] hover:bg-[#0B5F46] text-white font-bold py-2.5 px-4 sm:px-5 text-sm rounded-full transition-all shadow-md shadow-[#0F7A5A]/25 transform hover:-translate-y-0.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Avaliar Meu Imóvel
              </button>

              <button 
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 text-slate-700 hover:text-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a] rounded-lg focus:outline-none shrink-0 cursor-pointer"
                aria-label="Abrir menu de navegação"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[#E0D3C4] bg-white px-4 py-4 space-y-3 shadow-lg">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 pb-2 border-b border-slate-100 font-medium">
              <svg className="w-3.5 h-3.5 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Atendimento em Itaboraí · CRECI-RJ 39.583</span>
            </div>
            <button onClick={() => scrollToSection('credencial-creci')} className="w-full text-left font-semibold text-slate-800 hover:text-[#0F7A5A] py-1.5 flex items-center justify-between">
              <span>CRECI 39.583F & Diferenciais</span>
              <span className="text-[10px] bg-[#A9743B]/20 text-[#5B3A29] px-2 py-0.5 rounded font-bold uppercase">Oficial</span>
            </button>
            <button onClick={() => scrollToSection('avaliacao')} className="w-full text-left font-semibold text-slate-800 hover:text-[#0F7A5A] py-1.5">
              Avaliação Grátis do Imóvel
            </button>
            <button onClick={() => scrollToSection('calculadora')} className="w-full text-left font-semibold text-slate-800 hover:text-[#0F7A5A] py-1.5">
              Calculadora de Custo Parado
            </button>
            <button onClick={() => scrollToSection('como-funciona')} className="w-full text-left font-semibold text-slate-800 hover:text-[#0F7A5A] py-1.5">
              Como Funciona o Acompanhamento
            </button>
            <button onClick={() => scrollToSection('sobre')} className="w-full text-left font-semibold text-slate-800 hover:text-[#0F7A5A] py-1.5">
              Sobre o Corretor Joel Marcos
            </button>
            <button onClick={() => scrollToSection('faq')} className="w-full text-left font-semibold text-slate-800 hover:text-[#0F7A5A] py-1.5">
              Dúvidas Frequentes
            </button>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-[#E0D3C4]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Coluna de Texto Hero */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1EADF] border border-[#E0D3C4] text-xs font-semibold text-[#5B3A29]">
                <span className="text-[#0F7A5A]">✓</span> Corretor credenciado CRECI-RJ 39.583 · Atuação em Itaboraí
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#5B3A29] leading-[1.18] font-display">
                Descubra quanto vale o seu imóvel em Itaboraí, gratuitamente
              </h1>

              <p className="text-lg md:text-xl text-[#2A1D15]/85 leading-relaxed font-normal">
                Avaliação de mercado feita por corretor credenciado, com retorno rápido pelo WhatsApp e acompanhamento do início ao fim. Para vender ou alugar com segurança, sem sumiço e sem enrolação.
              </p>

              {/* Microbenefícios */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-sm font-semibold text-[#5B3A29]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0F7A5A] text-white flex items-center justify-center text-xs">✓</span>
                  <span>Avaliação gratuita</span>
                </div>
                <span className="text-[#E0D3C4] hidden sm:inline">|</span>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0F7A5A] text-white flex items-center justify-center text-xs">✓</span>
                  <span>Sem compromisso</span>
                </div>
                <span className="text-[#E0D3C4] hidden sm:inline">|</span>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0F7A5A] text-white flex items-center justify-center text-xs">✓</span>
                  <span>Retorno rápido pelo WhatsApp</span>
                </div>
              </div>

              {/* CTA Hero Único */}
              <div className="pt-4">
                <button
                  onClick={() => scrollToSection('avaliacao')}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-lg bg-[#0F7A5A] hover:bg-[#0B5F46] transition-all duration-200 shadow-lg shadow-[#0F7A5A]/25 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Avaliar meu imóvel grátis</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Imagem Humanizada com Alt Exato */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-[#ffffff] p-4 rounded-2xl border border-[#E0D3C4] shadow-xl">
                <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-[#F1EADF]">
                  <img
                    src="/assets/aistudio/image_ef74896f.png"
                    alt="Família brasileira feliz diante de casa de médio padrão com quintal em Itaboraí, RJ"
                    className="w-full h-full object-cover"
                    loading="eager"
                    width={600}
                    height={450}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A1D15]/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="font-bold text-sm">Joel Marcos</p>
                    <p className="text-xs text-white/80">Corretor credenciado CRECI-RJ 39.583 · Atuação em Itaboraí</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-[#FAF7F2] rounded-xl border border-[#E0D3C4] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#A9743B] font-semibold">Atendimento Especializado</div>
                    <div className="text-xs font-bold text-[#5B3A29]">Itaboraí · Venda e Locação</div>
                  </div>
                  <span className="inline-block px-2.5 py-1 rounded bg-[#0F7A5A]/15 text-[#0F7A5A] font-bold text-xs">
                    Credenciado
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMPONENTE DE DESTAQUE: CRECI 39.583F & DIFERENCIAIS DA AVALIAÇÃO GRATUITA */}
      <CreciDiferenciaisDestaque onCtaClick={() => scrollToSection('avaliacao')} />

      {/* SEÇÃO #avaliacao */}
      <section id="avaliacao" className="py-14 md:py-20 bg-[#F1EADF] border-b border-[#E0D3C4]">
        <div className="max-w-6xl mx-auto px-4">

          {/* Microcopy Mobile */}
          <div className="lg:hidden mb-6 text-center">
            <h2 className="text-2xl font-bold text-[#5B3A29] font-display">
              Receba a avaliação gratuita do seu imóvel
            </h2>
            <p className="text-sm text-[#5B3A29]/80 mt-1">
              Leva poucos minutos. Atendemos imóveis somente em Itaboraí-RJ.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Coluna Esquerda: Fixa (Sticky no Desktop) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              
              <div className="bg-white p-6 rounded-2xl border border-[#E0D3C4] shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#E0D3C4]">
                  <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E0D3C4] flex items-center justify-center text-[#5B3A29] font-bold text-lg font-display">
                    JM
                  </div>
                  <div>
                    <h3 className="font-bold text-[#5B3A29] text-base leading-tight">Joel Marcos</h3>
                    <p className="text-xs text-[#A9743B] font-semibold">Corretor credenciado CRECI-RJ 39.583</p>
                  </div>
                </div>

                <h4 className="font-bold text-base text-[#5B3A29] mb-4 font-display">Por que cadastrar o seu imóvel comigo</h4>
                <ul className="space-y-3.5 text-sm text-[#2A1D15]/85">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0F7A5A]/15 text-[#0F7A5A] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✓</span>
                    <span>Avaliação gratuita e sem compromisso</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0F7A5A]/15 text-[#0F7A5A] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✓</span>
                    <span>Retorno rápido pelo WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#0F7A5A]/15 text-[#0F7A5A] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✓</span>
                    <span>Corretor credenciado CRECI-RJ 39.583</span>
                  </li>
                </ul>

                {/* Foto humanizada auxiliar */}
                <div className="mt-6 pt-5 border-t border-[#E0D3C4]">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src="/assets/aistudio/Quem_Somos_-Market-Local-digital_ce8da42d.webp"
                      alt="Corretor atendendo proprietário em Itaboraí, RJ"
                      className="w-12 h-12 rounded-full object-cover object-top border-2 border-[#0F7A5A]/30"
                      loading="lazy"
                      width={48}
                      height={48}
                    />
                    <div className="text-xs text-[#64554b]">
                      <div className="font-bold text-[#5B3A29]">Atendimento direto com Joel</div>
                      <div>Sem intermediários ou atendentes automáticos</div>
                    </div>
                  </div>

                  {/* Botão secundário de WhatsApp */}
                  <a
                    href="https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Gostaria%20de%20conversar%20sobre%20a%20avalia%C3%A7%C3%A3o%20do%20meu%20im%C3%B3vel%20em%20Itabora%C3%AD."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-[#0F7A5A] text-[#0F7A5A] hover:bg-[#0F7A5A] hover:text-white font-bold text-sm transition-colors duration-150"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                    <span>Prefiro falar no WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Microcopy Desktop */}
              <p className="text-xs text-[#64554b] px-2 text-center lg:text-left">
                Leva poucos minutos. Atendemos imóveis somente em Itaboraí-RJ.
              </p>
            </div>

            {/* Coluna Direita: O Formulário Oficial */}
            <div className="lg:col-span-7 w-full">
              <div id="owner-form-root" className="min-h-[640px] w-full">
                <OwnerForm />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SEÇÃO: ESPELHO DAS DORES */}
      <section className="py-16 md:py-24 bg-[#FAF7F2] border-b border-[#E0D3C4]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5B3A29] font-display">
              Você já passou por isso com o seu imóvel?
            </h2>
            <p className="text-base sm:text-lg text-[#2A1D15]/80 mt-4 leading-relaxed">
              Se algum destes pontos soa familiar, a culpa não é sua. É o que costuma acontecer quando o imóvel não tem acompanhamento de verdade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E0D3C4] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-[#5B3A29] font-display mb-2">
                  "O corretor pegou a autorização e sumiu."
                </h3>
                <p className="text-[#2A1D15]/80 text-sm leading-relaxed">
                  Você assinou, esperou e ficou sem saber se alguém viu o imóvel, visitou ou desistiu.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E0D3C4] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-[#5B3A29] font-display mb-2">
                  "Só aparece curioso."
                </h3>
                <p className="text-[#2A1D15]/80 text-sm leading-relaxed">
                  Visitas marcadas com quem não tem renda, crédito ou intenção real. Você perde tempo e expõe o imóvel à toa.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E0D3C4] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-[#5B3A29] font-display mb-2">
                  "O anúncio parece abandonado."
                </h3>
                <p className="text-[#2A1D15]/80 text-sm leading-relaxed">
                  Foto escura, descrição genérica e nenhum destaque dos diferenciais do seu imóvel.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E0D3C4] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4">
                  4
                </div>
                <h3 className="text-lg font-bold text-[#5B3A29] font-display mb-2">
                  "Está parado e ninguém faz nada ativo."
                </h3>
                <p className="text-[#2A1D15]/80 text-sm leading-relaxed">
                  O imóvel fica esquecido nos portais, sem campanha e sem estratégia para alcançar o comprador certo.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E0D3C4] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4">
                  5
                </div>
                <h3 className="text-lg font-bold text-[#5B3A29] font-display mb-2">
                  "O preço não bate com a realidade."
                </h3>
                <p className="text-[#2A1D15]/80 text-sm leading-relaxed">
                  Alto demais, só para agradar, e o imóvel mofa. Ou baixo demais, só para vender rápido, e você perde dinheiro.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E0D3C4] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4">
                  6
                </div>
                <h3 className="text-lg font-bold text-[#5B3A29] font-display mb-2">
                  "Apareceu interessado e a negociação esfriou."
                </h3>
                <p className="text-[#2A1D15]/80 text-sm leading-relaxed">
                  Documento atrasado, crédito demorando, contrato lento. Quando a papelada anda devagar, o cliente desiste.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => scrollToSection('avaliacao')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#0F7A5A] hover:bg-[#0B5F46] text-white font-bold text-base transition-colors shadow-md cursor-pointer"
            >
              <span>Quero resolver isso agora</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO: CALCULADORA */}
      <section id="calculadora" className="py-16 md:py-24 bg-[#F1EADF] border-b border-[#E0D3C4]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5B3A29] font-display">
              Quanto custa o seu imóvel parado?
            </h2>
            <p className="text-base sm:text-lg text-[#2A1D15]/80 mt-2">
              Mesmo sem render nada, ele continua custando. Faça a conta em 10 segundos.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E0D3C4] shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label htmlFor={iptuId} className="block font-bold text-xs uppercase tracking-wider text-[#5B3A29] mb-2">
                  IPTU anual (R$)
                </label>
                <input
                  type="number"
                  id={iptuId}
                  className="w-full p-3.5 bg-[#FAF7F2] border border-[#E0D3C4] rounded-xl text-base font-semibold text-[#2A1D15] focus:bg-white focus:outline-[#0F7A5A]"
                  value={iptu}
                  onChange={(e) => setIptu(parseFloat(e.target.value) || 0)}
                  step="50"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor={condoId} className="block font-bold text-xs uppercase tracking-wider text-[#5B3A29] mb-2">
                  Condomínio mensal (R$)
                </label>
                <input
                  type="number"
                  id={condoId}
                  className="w-full p-3.5 bg-[#FAF7F2] border border-[#E0D3C4] rounded-xl text-base font-semibold text-[#2A1D15] focus:bg-white focus:outline-[#0F7A5A]"
                  value={condo}
                  onChange={(e) => setCondo(parseFloat(e.target.value) || 0)}
                  step="25"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor={outrasId} className="block font-bold text-xs uppercase tracking-wider text-[#5B3A29] mb-2">
                  Outras despesas mensais (R$)
                </label>
                <input
                  type="number"
                  id={outrasId}
                  className="w-full p-3.5 bg-[#FAF7F2] border border-[#E0D3C4] rounded-xl text-base font-semibold text-[#2A1D15] focus:bg-white focus:outline-[#0F7A5A]"
                  value={outras}
                  onChange={(e) => setOutras(parseFloat(e.target.value) || 0)}
                  step="25"
                  min="0"
                />
              </div>
            </div>

            {/* Resultado Dinâmico */}
            <div className="mt-8 p-6 bg-[#FAF7F2] border border-[#E0D3C4] rounded-xl text-center sm:text-left">
              <p className="text-base sm:text-lg text-[#2A1D15] leading-relaxed font-medium">
                Seu imóvel parado custa <strong className="text-[#b3261e] font-bold text-xl sm:text-2xl">{formatBRL(monthlyCost)}</strong> por mês. Em 6 meses, são <strong className="text-[#b3261e] font-bold">{formatBRL(sixMonthsCost)}</strong>. Em 12 meses, <strong className="text-[#b3261e] font-bold">{formatBRL(twelveMonthsCost)}</strong> saem do seu bolso sem nenhuma entrada.
              </p>
              <p className="text-xs text-[#64554b] mt-3">
                Nota: Estimativa simples, apenas com as despesas que você informar.
              </p>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => scrollToSection('avaliacao')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#0F7A5A] hover:bg-[#0B5F46] text-white font-bold text-base transition-colors shadow-md cursor-pointer"
              >
                <span>Quero parar de perder dinheiro</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: A SOLUÇÃO */}
      <section className="py-16 md:py-24 bg-[#FAF7F2] border-b border-[#E0D3C4]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5B3A29] font-display">
              O que muda quando você trabalha comigo
            </h2>
            <p className="text-base sm:text-lg text-[#2A1D15]/80 mt-3 leading-relaxed">
              Cada frustração acima tem uma resposta prática, combinada por escrito antes de começar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-7 bg-white rounded-2xl border border-[#E0D3C4] shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#0F7A5A]/15 text-[#0F7A5A] flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="font-bold text-lg text-[#5B3A29] font-display mb-2">
                Você sempre sabe como está o seu imóvel
              </h3>
              <p className="text-sm text-[#2A1D15]/80 leading-relaxed">
                Eu combino com você, em contrato, a frequência dos retornos. Pelo WhatsApp você recebe quantas pessoas se interessaram, quantas visitaram e o que disseram do imóvel, inclusive os motivos de recusa.
              </p>
            </div>

            <div className="p-7 bg-white rounded-2xl border border-[#E0D3C4] shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#0F7A5A]/15 text-[#0F7A5A] flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="font-bold text-lg text-[#5B3A29] font-display mb-2">
                Só visita quem tem perfil
              </h3>
              <p className="text-sm text-[#2A1D15]/80 leading-relaxed">
                Antes de marcar qualquer visita, converso com o interessado sobre renda, forma de pagamento e análise de crédito. Quem não tem condição de fechar não toma o seu tempo.
              </p>
            </div>

            <div className="p-7 bg-white rounded-2xl border border-[#E0D3C4] shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#0F7A5A]/15 text-[#0F7A5A] flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="font-bold text-lg text-[#5B3A29] font-display mb-2">
                Anúncio que valoriza o imóvel
              </h3>
              <p className="text-sm text-[#2A1D15]/80 leading-relaxed">
                Fotos bem feitas e descrição que destaca o que o seu imóvel tem de melhor, com atualização periódica e posicionamento correto nos portais.
              </p>
            </div>

            <div className="p-7 bg-white rounded-2xl border border-[#E0D3C4] shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#0F7A5A]/15 text-[#0F7A5A] flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="font-bold text-lg text-[#5B3A29] font-display mb-2">
                Divulgação ativa, não só nos portais
              </h3>
              <p className="text-sm text-[#2A1D15]/80 leading-relaxed">
                Além de portais imobiliários e redes sociais, uso campanhas segmentadas online para encontrar o comprador ou inquilino com perfil ideal para o seu bairro.
              </p>
            </div>

            <div className="p-7 bg-white rounded-2xl border border-[#E0D3C4] shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#0F7A5A]/15 text-[#0F7A5A] flex items-center justify-center font-bold text-sm mb-4">
                05
              </div>
              <h3 className="font-bold text-lg text-[#5B3A29] font-display mb-2">
                Preço justo e explicado
              </h3>
              <p className="text-sm text-[#2A1D15]/80 leading-relaxed">
                Avalio com comparativos reais de Itaboraí. Nem inflado para agradar, nem rebaixado para vender rápido. Eu mostro na prática como cheguei no valor.
              </p>
            </div>

            <div className="p-7 bg-white rounded-2xl border border-[#E0D3C4] shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#0F7A5A]/15 text-[#0F7A5A] flex items-center justify-center font-bold text-sm mb-4">
                06
              </div>
              <h3 className="font-bold text-lg text-[#5B3A29] font-display mb-2">
                Fechamento sem enrolação
              </h3>
              <p className="text-sm text-[#2A1D15]/80 leading-relaxed">
                Documentação organizada desde o começo, análise de crédito ágil e contrato redigido com rapidez. Quando o interessado certo aparece, o negócio não esfria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: VENDER OU ALUGAR */}
      <section className="py-16 md:py-24 bg-[#F1EADF] border-b border-[#E0D3C4]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5B3A29] font-display">
              Seu objetivo é vender ou alugar? Eu cuido dos dois.
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-[#E0D3C4] p-6 sm:p-10 shadow-sm">
            <div className="flex border-b border-[#E0D3C4] mb-8 gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('vender')}
                className={`pb-3 px-2 font-display font-bold text-lg sm:text-xl transition-colors cursor-pointer ${
                  activeTab === 'vender'
                    ? 'text-[#0F7A5A] border-b-2 border-[#0F7A5A]'
                    : 'text-[#64554b] hover:text-[#5B3A29] border-b-2 border-transparent'
                }`}
              >
                VENDER
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('alugar')}
                className={`pb-3 px-2 font-display font-bold text-lg sm:text-xl transition-colors cursor-pointer ${
                  activeTab === 'alugar'
                    ? 'text-[#0F7A5A] border-b-2 border-[#0F7A5A]'
                    : 'text-[#64554b] hover:text-[#5B3A29] border-b-2 border-transparent'
                }`}
              >
                ALUGAR
              </button>
            </div>

            {activeTab === 'vender' ? (
              <div className="space-y-3">
                <h3 className="font-display font-bold text-xl text-[#5B3A29]">
                  Vender com segurança e no preço certo
                </h3>
                <p className="text-[#2A1D15]/85 text-base leading-relaxed">
                  Reviso a documentação do imóvel (matrícula atualizada, IPTU, certidões, escritura e habite-se quando aplicável), oriento sobre ITBI, escritura e financiamento, e defino com você uma estratégia de preço baseada no mercado de hoje.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-display font-bold text-xl text-[#5B3A29]">
                  Alugar com mais tranquilidade
                </h3>
                <p className="text-[#2A1D15]/85 text-base leading-relaxed">
                  Analiso o crédito do candidato a inquilino e oriento sobre as garantias da Lei do Inquilinato (caução, fiador, seguro-fiança ou cessão fiduciária). O contrato é claro e a vistoria fotográfica é feita na entrada e na saída.
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-[#E0D3C4] bg-[#FAF7F2] p-5 rounded-xl border border-[#E0D3C4]">
              <h4 className="font-display font-bold text-base text-[#5B3A29] mb-1.5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0F7A5A]/15 text-[#0F7A5A] flex items-center justify-center text-xs font-bold">✓</span>
                Checagem documental gratuita
              </h4>
              <p className="text-xs sm:text-sm text-[#2A1D15]/80 leading-relaxed">
                Ao cadastrar o imóvel, você recebe orientação sobre possíveis pendências, como IPTU, certidões, escritura e regularização, e sobre o caminho para resolver cada uma. Pendência descoberta cedo não trava o negócio na hora do comprador.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: COMO FUNCIONA */}
      <section id="como-funciona" className="py-16 md:py-24 bg-[#FAF7F2] border-b border-[#E0D3C4]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5B3A29] font-display">
              Como funciona a avaliação gratuita
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E0D3C4] shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-[#5B3A29] text-white font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h3 className="font-bold text-lg text-[#5B3A29] font-display mb-2">Passo 1: Você cadastra</h3>
              <p className="text-sm text-[#2A1D15]/80 leading-relaxed">
                Preencha os dados do imóvel. Leva poucos minutos.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E0D3C4] shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-[#5B3A29] text-white font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="font-bold text-lg text-[#5B3A29] font-display mb-2">Passo 2: Eu analiso e te chamo</h3>
              <p className="text-sm text-[#2A1D15]/80 leading-relaxed">
                Estudo o mercado de Itaboraí e entro em contato pelo WhatsApp com o comparativo detalhado.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E0D3C4] shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-[#5B3A29] text-white font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="font-bold text-lg text-[#5B3A29] font-display mb-2">Passo 3: Você decide</h3>
              <p className="text-sm text-[#2A1D15]/80 leading-relaxed">
                Recebe a avaliação, tira suas dúvidas e escolhe como seguir, sem qualquer compromisso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: ITABORAÍ HOJE */}
      <section className="py-16 md:py-24 bg-[#F1EADF] border-b border-[#E0D3C4]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E0D3C4] shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#5B3A29] font-display mb-4">
                O preço certo para o mercado de hoje
              </h2>
              <p className="text-base text-[#2A1D15]/85 leading-relaxed">
                Muitos proprietários de Itaboraí esperavam mais valorização depois das promessas em torno do antigo Comperj, hoje chamado Polo GasLub. É compreensível a frustração de ter um imóvel parado, pagando IPTU e manutenção. O futuro de uma região é uma boa notícia, mas não substitui um preço alinhado ao que o mercado paga hoje. Por isso minha avaliação usa comparativos atuais, e não promessas.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E0D3C4]">
              <h3 className="text-xl font-bold text-[#5B3A29] font-display mb-2">
                Bairros atendidos
              </h3>
              <p className="text-sm sm:text-base text-[#2A1D15]/80 leading-relaxed">
                Atendo proprietários em todo o município, incluindo Centro, Manilha, Areal, Joaquim de Oliveira, Outeiro das Pedras, Itambi, Sambaetiba, Venda das Pedras, Reta e Cabuçu. Se o seu imóvel está em Itaboraí, eu avalio.
              </p>
            </div>

            <div className="pt-2">
              <img
                src="/fachada-flores-de-maio.webp"
                alt="Casa de médio padrão com muro e quintal em Itaboraí"
                className="w-full h-48 sm:h-64 object-cover rounded-xl border border-[#E0D3C4]"
                loading="lazy"
                width={800}
                height={320}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: SOBRE O CORRETOR */}
      <section id="sobre" className="py-16 md:py-24 bg-[#FAF7F2] border-b border-[#E0D3C4]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E0D3C4] shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-2xl overflow-hidden flex-shrink-0 border-4 border-[#F1EADF] shadow-lg bg-[#FAF7F2]">
              <img
                src="/assets/aistudio/Quem_Somos_-Market-Local-digital_ce8da42d.webp"
                alt="Joel Marcos, corretor de imóveis com mais de 20 anos de experiência em Itaboraí, RJ"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                width={192}
                height={192}
              />
            </div>
            <div className="space-y-4 text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#F1EADF] text-[#5B3A29]">
                  CRECI-RJ 39.583
                </span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#0F7A5A]/15 text-[#0F7A5A]">
                  +20 Anos de Experiência
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#5B3A29] font-display">
                Joel Marcos, corretor de imóveis em Itaboraí
              </h2>
              <p className="text-sm sm:text-base text-[#2A1D15]/85 leading-relaxed">
                Sou corretor credenciado pelo CRECI-RJ (nº 39.583) com <strong>mais de 20 anos de experiência em intermediação imobiliária</strong>. Trago na bagagem uma sólida vivência prática em negociações e inteligência de mercado nos estados de <strong>São Paulo (SP), Santa Catarina (SC), Minas Gerais (MG), Bahia (BA), Paraíba (PB), Rio Grande do Norte (RN) e Rio de Janeiro (RJ)</strong>.
              </p>
              <p className="text-sm sm:text-base text-[#2A1D15]/85 leading-relaxed">
                Meu foco em Itaboraí é simples e direto: dar retorno transparente, filtrar quem visita para não levar curiosos e anunciar com estratégia comercial assertiva, para que você venda ou alugue o seu imóvel com total segurança.
              </p>
              
              <div className="pt-2">
                <a
                  href="https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Gostaria%20de%20conversar%20sobre%20o%20meu%20im%C3%B3vel%20em%20Itabora%C3%AD."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F7A5A] hover:bg-[#0B5F46] text-white font-bold text-sm transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  <span>Falar com o Joel no WhatsApp</span>
                </a>
              </div>

              <div className="pt-4 border-t border-[#E0D3C4] text-xs text-[#64554b] italic">
                <p>Relacionamentos transparentes construídos com ética, dedicação e acompanhamento passo a passo em Itaboraí.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: FAQ */}
      <section id="faq" className="py-16 md:py-24 bg-[#F1EADF] border-b border-[#E0D3C4]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5B3A29] font-display">
              Dúvidas de quem quer vender ou alugar em Itaboraí
            </h2>
          </div>

          <div className="space-y-4">
            <details className="bg-white rounded-xl border border-[#E0D3C4] p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="font-bold text-base text-[#5B3A29] cursor-pointer flex items-center justify-between">
                <span>Como funciona a avaliação gratuita do meu imóvel em Itaboraí?</span>
                <span className="text-[#0F7A5A] text-lg font-bold">+</span>
              </summary>
              <p className="mt-3 text-sm text-[#2A1D15]/80 leading-relaxed pt-2 border-t border-[#E0D3C4]">
                Você cadastra os dados do imóvel no formulário e eu analiso o mercado de Itaboraí, comparando imóveis parecidos na região. Depois te chamo no WhatsApp para apresentar a avaliação e explicar como cheguei no valor. É gratuita e sem compromisso: você decide se quer vender ou alugar comigo.
              </p>
            </details>

            <details className="bg-white rounded-xl border border-[#E0D3C4] p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="font-bold text-base text-[#5B3A29] cursor-pointer flex items-center justify-between">
                <span>Como o preço do meu imóvel é definido?</span>
                <span className="text-[#0F7A5A] text-lg font-bold">+</span>
              </summary>
              <p className="mt-3 text-sm text-[#2A1D15]/80 leading-relaxed pt-2 border-t border-[#E0D3C4]">
                Comparo imóveis semelhantes do mesmo bairro e região de Itaboraí, considerando metragem, estado de conservação, localização e o que está sendo realmente negociado. O objetivo é um preço de mercado: sem inflar só para agradar e sem rebaixar para vender rápido. Explico cada critério para você decidir com segurança.
              </p>
            </details>

            <details className="bg-white rounded-xl border border-[#E0D3C4] p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="font-bold text-base text-[#5B3A29] cursor-pointer flex items-center justify-between">
                <span>O Comperj (GasLub) valoriza o meu imóvel?</span>
                <span className="text-[#0F7A5A] text-lg font-bold">+</span>
              </summary>
              <p className="mt-3 text-sm text-[#2A1D15]/80 leading-relaxed pt-2 border-t border-[#E0D3C4]">
                Ninguém pode garantir valorização. O antigo Comperj hoje é o Polo GasLub e há retomada de obras, mas o preço do seu imóvel depende principalmente do mercado de hoje, da localização e do estado dele. Por isso a avaliação usa comparativos atuais, e não promessas futuras.
              </p>
            </details>

            <details className="bg-white rounded-xl border border-[#E0D3C4] p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="font-bold text-base text-[#5B3A29] cursor-pointer flex items-center justify-between">
                <span>Meu imóvel tem pendência na documentação. Posso vender ou alugar?</span>
                <span className="text-[#0F7A5A] text-lg font-bold">+</span>
              </summary>
              <p className="mt-3 text-sm text-[#2A1D15]/80 leading-relaxed pt-2 border-t border-[#E0D3C4]">
                Em muitos casos, sim. Pendências como IPTU em atraso, certidões vencidas ou escritura irregular precisam ser tratadas, mas nem sempre impedem a negociação. Na checagem documental gratuita eu oriento o que regularizar e o caminho (cartório, prefeitura ou despachante), para o negócio não travar quando o interessado aparecer.
              </p>
            </details>

            <details className="bg-white rounded-xl border border-[#E0D3C4] p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="font-bold text-base text-[#5B3A29] cursor-pointer flex items-center justify-between">
                <span>Como vocês evitam levar curiosos para visitar o meu imóvel?</span>
                <span className="text-[#0F7A5A] text-lg font-bold">+</span>
              </summary>
              <p className="mt-3 text-sm text-[#2A1D15]/80 leading-relaxed pt-2 border-t border-[#E0D3C4]">
                Antes de marcar uma visita, converso com o interessado para entender renda, forma de pagamento e se há financiamento ou análise de crédito em andamento. Assim, só visita o seu imóvel quem tem perfil para fechar negócio, e você não perde tempo nem expõe o imóvel sem necessidade.
              </p>
            </details>

            <details className="bg-white rounded-xl border border-[#E0D3C4] p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="font-bold text-base text-[#5B3A29] cursor-pointer flex items-center justify-between">
                <span>Como vou acompanhar o andamento da venda ou do aluguel?</span>
                <span className="text-[#0F7A5A] text-lg font-bold">+</span>
              </summary>
              <p className="mt-3 text-sm text-[#2A1D15]/80 leading-relaxed pt-2 border-t border-[#E0D3C4]">
                Combinamos em contrato a frequência dos retornos. Pelo WhatsApp você recebe quantas pessoas se interessaram, quantas visitaram e o que disseram do imóvel, inclusive os motivos de recusa. Assim você acompanha tudo e decide sem precisar correr atrás de notícia.
              </p>
            </details>

            <details className="bg-white rounded-xl border border-[#E0D3C4] p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="font-bold text-base text-[#5B3A29] cursor-pointer flex items-center justify-between">
                <span>Como me proteger de inquilino inadimplente?</span>
                <span className="text-[#0F7A5A] text-lg font-bold">+</span>
              </summary>
              <p className="mt-3 text-sm text-[#2A1D15]/80 leading-relaxed pt-2 border-t border-[#E0D3C4]">
                Não existe risco zero, mas dá para reduzir bastante. Analiso o crédito do candidato e oriento sobre as garantias da Lei do Inquilinato: caução, fiador, seguro-fiança ou cessão fiduciária de quotas (apenas uma por contrato). Também faço contrato claro e vistoria de entrada e de saída.
              </p>
            </details>

            <details className="bg-white rounded-xl border border-[#E0D3C4] p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="font-bold text-base text-[#5B3A29] cursor-pointer flex items-center justify-between">
                <span>Quanto custa trabalhar com você?</span>
                <span className="text-[#0F7A5A] text-lg font-bold">+</span>
              </summary>
              <p className="mt-3 text-sm text-[#2A1D15]/80 leading-relaxed pt-2 border-t border-[#E0D3C4]">
                A avaliação é gratuita. A comissão só é paga se o imóvel for vendido ou alugado, conforme o contrato de autorização assinado por escrito.
              </p>
            </details>

            <details className="bg-white rounded-xl border border-[#E0D3C4] p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="font-bold text-base text-[#5B3A29] cursor-pointer flex items-center justify-between">
                <span>Posso vender um imóvel que ainda está financiado?</span>
                <span className="text-[#0F7A5A] text-lg font-bold">+</span>
              </summary>
              <p className="mt-3 text-sm text-[#2A1D15]/80 leading-relaxed pt-2 border-t border-[#E0D3C4]">
                É possível, sim. Primeiro verifico o saldo devedor e a situação do contrato com o banco, como a alienação fiduciária. Depois estruturo a venda para que o saldo seja quitado na negociação ou tratado conforme as regras do banco. Cada caso é analisado individualmente para ser seguro para você e para o comprador.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* SEÇÃO: CTA FINAL */}
      <section className="py-16 md:py-24 bg-[#FAF7F2] border-b border-[#E0D3C4]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#5B3A29] font-display">
            Seu imóvel em Itaboraí merece acompanhamento de verdade
          </h2>
          <p className="text-base sm:text-lg text-[#2A1D15]/80 max-w-2xl mx-auto">
            Descubra quanto ele vale, sem pagar nada e sem compromisso. Eu te chamo no WhatsApp.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('avaliacao')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-lg bg-[#0F7A5A] hover:bg-[#0B5F46] transition-all duration-200 shadow-lg shadow-[#0F7A5A]/25 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Avaliar meu imóvel grátis</span>
              <span>↑</span>
            </button>
            <a
              href="https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Gostaria%20de%20falar%20no%20WhatsApp%20sobre%20a%20avalia%C3%A7%C3%A3o%20do%20meu%20im%C3%B3vel%20em%20Itabora%C3%AD."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-[#0F7A5A] text-[#0F7A5A] hover:bg-[#0F7A5A] hover:text-white font-bold text-base transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span>Falar no WhatsApp agora</span>
            </a>
          </div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="py-10 bg-[#FAF7F2] border-t border-[#E0D3C4] text-xs text-[#64554b]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-[#5B3A29]">Joel Marcos · Corretor de Imóveis · CRECI-RJ nº 39.583 · Atendimento em Itaboraí-RJ</p>
            <p className="mt-1 text-[11px] text-[#7b6d63]">
              Aviso: A avaliação é uma estimativa de mercado baseada em comparativos e não substitui laudo pericial formal de avaliação judicial.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setPrivacyModalOpen(true)}
              className="underline text-[#5B3A29] hover:text-[#0F7A5A] transition-colors cursor-pointer bg-transparent border-0 p-0 font-medium"
            >
              Política de Privacidade
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL DE POLÍTICA DE PRIVACIDADE */}
      {privacyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-[#E0D3C4] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E0D3C4] mb-4">
              <h3 className="font-display font-bold text-lg text-[#5B3A29]">
                Política de Privacidade
              </h3>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1EADF] text-[#5B3A29] hover:bg-[#E0D3C4] flex items-center justify-center font-bold text-sm cursor-pointer"
                aria-label="Fechar modal"
              >
                ✕
              </button>
            </div>

            <div className="text-sm text-[#2A1D15]/85 space-y-3 leading-relaxed">
              <p>
                Usamos os dados que você informa apenas para entrar em contato sobre a avaliação e o atendimento do seu imóvel, conforme a LGPD (Lei 13.709/2018). Não vendemos seus dados. Para pedir correção ou exclusão, fale com o Joel pelo WhatsApp (21) 96592-8399.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E0D3C4] text-right">
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#0F7A5A] text-white font-bold text-xs hover:bg-[#0B5F46] cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTÃO FLUTUANTE DE WHATSAPP */}
      <aside aria-label="Atendimento via WhatsApp">
        <a
          href="https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20a%20avalia%C3%A7%C3%A3o%20do%20meu%20im%C3%B3vel%20em%20Itabora%C3%AD."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 md:bottom-6 right-6 z-40 w-14 h-14 bg-[#1f9d55] hover:bg-[#188045] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform duration-200"
          title="Falar no WhatsApp com Joel Marcos"
        >
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </a>
      </aside>

      {/* BARRA FIXA MOBILE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E0D3C4] p-3 shadow-2xl flex items-center gap-2">
        <button
          onClick={() => scrollToSection('avaliacao')}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#0F7A5A] text-white font-bold text-sm rounded-xl shadow-md cursor-pointer"
        >
          <span>Avaliar meu imóvel grátis</span>
          <span>→</span>
        </button>
        <a
          href="https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Gostaria%20de%20falar%20no%20WhatsApp%20sobre%20meu%20im%C3%B3vel%20em%20Itabora%C3%AD."
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-[#1f9d55] text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
          title="Falar no WhatsApp"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
