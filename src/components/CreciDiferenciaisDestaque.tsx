import { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  FileSearch, 
  UserCheck, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  Building2, 
  Lock,
  MessageCircle
} from 'lucide-react';

interface CreciDiferenciaisDestaqueProps {
  onCtaClick?: () => void;
}

export default function CreciDiferenciaisDestaque({ onCtaClick }: CreciDiferenciaisDestaqueProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'todos' | 'seguranca' | 'metodologia' | 'agilidade'>('todos');

  const handleCopyCreci = () => {
    navigator.clipboard.writeText('39.583F');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const diferenciais = [
    {
      id: 'metodologia-1',
      categoria: 'metodologia',
      badge: 'Metodologia Real',
      titulo: 'Preço de Mercado Real, Sem Promessas Vazias',
      descricao: 'Não inflamos para agradar nem desvalorizamos para desovar rápido. Avaliação baseada em transações efetivamente realizadas nos bairros de Itaboraí nos últimos 90 dias.',
      icon: TrendingUp,
      destaque: 'Baseado em dados reais de Itaboraí'
    },
    {
      id: 'seguranca-1',
      categoria: 'seguranca',
      badge: 'Segurança Jurídica',
      titulo: 'Responsabilidade Profissional CRECI 39.583F',
      descricao: 'Seu imóvel e seus dados tratados com o rigor do Conselho Regional de Corretores de Imóveis (1ª Região - RJ). Contratos transparentes e ética comprovada em mais de 20 anos de carreira.',
      icon: ShieldCheck,
      destaque: 'Intermediação legal e segura'
    },
    {
      id: 'seguranca-2',
      categoria: 'seguranca',
      badge: 'Triagem Ativa',
      titulo: 'Filtro Rigoroso Anti-Curiosos',
      descricao: 'Só visita seu imóvel quem passou por qualificação prévia de renda, forma de pagamento e capacidade de crédito. Ninguém entra na sua casa apenas para especular.',
      icon: UserCheck,
      destaque: 'Visitas apenas com perfil qualificado'
    },
    {
      id: 'metodologia-2',
      categoria: 'metodologia',
      badge: 'Prevenção',
      titulo: 'Checagem Documental Prévia e Gratuita',
      descricao: 'Mapeamos antecipadamente pendências de certidões, IPTU, habite-se ou inventário. O que for identificado cedo é resolvido antes do comprador assinar, sem travar o cartório.',
      icon: FileSearch,
      destaque: 'Evita desistências de última hora'
    },
    {
      id: 'agilidade-1',
      categoria: 'agilidade',
      badge: 'Agilidade',
      titulo: 'Retorno em até 48h pelo WhatsApp',
      descricao: 'Análise ágil com parecer detalhado entregue diretamente no seu WhatsApp. Você recebe o estudo comparativo e tira dúvidas sem intermediários ou formulários engessados.',
      icon: Clock,
      destaque: 'Contato direto com Joel Marcos'
    },
    {
      id: 'seguranca-3',
      categoria: 'seguranca',
      badge: 'Zero Custo',
      titulo: '100% Grátis e Sem Obrigatoriedade',
      descricao: 'Você recebe o valor venal e de locação estimado e tem total liberdade para decidir se quer anunciar agora, depois ou por conta própria. Não cobramos nenhuma taxa pela avaliação.',
      icon: CheckCircle,
      destaque: 'Sem compromisso ou pegadinha'
    }
  ];

  const diferenciaisFiltrados = activeTab === 'todos' 
    ? diferenciais 
    : diferenciais.filter(d => d.categoria === activeTab);

  const scrollToForm = () => {
    if (onCtaClick) {
      onCtaClick();
      return;
    }
    const formEl = document.getElementById('avaliacao') || document.getElementById('owner-form-root');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="credencial-creci" 
      className="py-16 md:py-24 bg-gradient-to-b from-[#FAF7F2] via-white to-[#F1EADF] border-b border-[#E0D3C4] relative overflow-hidden"
    >
      {/* Background sutil decorativo de linhas arquitetônicas */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#5B3A29_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* ============================================================== */}
        {/* BLOCO DE DESTAQUE MASTER: O SELO OFICIAL DE AUTORIDADE CRECI   */}
        {/* ============================================================== */}
        <div className="bg-[#2A1D15] rounded-3xl p-6 sm:p-10 md:p-12 text-white shadow-2xl border border-[#A9743B]/40 relative overflow-hidden mb-16">
          
          {/* Brilho dourado de fundo */}
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-[#D4A64A]/25 via-[#A9743B]/15 to-transparent blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#0F7A5A]/20 blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Lado Esquerdo: Identidade, Brasão e Registro Oficial */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
              
              {/* Emblema / Brasão CRECI Certificado */}
              <div className="relative mb-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#FAF7F2] via-[#E0D3C4] to-[#A9743B] p-[2px] shadow-xl">
                  <div className="w-full h-full rounded-[14px] bg-[#1a110c] flex flex-col items-center justify-center p-3 text-center border border-[#D4A64A]/30">
                    <Award className="w-8 h-8 sm:w-10 sm:h-10 text-[#D4A64A] mb-1 drop-shadow-sm" />
                    <span className="text-[10px] tracking-widest uppercase font-extrabold text-[#D4A64A]">
                      CRECI-RJ
                    </span>
                    <span className="text-xs font-black tracking-tight text-white font-mono">
                      39.583-F
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#0F7A5A] text-white p-1.5 rounded-full border-2 border-[#2A1D15] shadow-md" title="Registro Ativo e Regularizado">
                  <ShieldCheck className="w-4 h-4 text-emerald-100" />
                </div>
              </div>

              {/* Título de Credenciamento */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A9743B]/20 border border-[#D4A64A]/40 text-[#D4A64A] text-xs font-bold uppercase tracking-wider mb-3">
                <Building2 className="w-3.5 h-3.5" />
                <span>Corretor Oficial Credenciado</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display leading-tight mb-2">
                Joel Marcos
              </h2>
              
              <p className="text-sm text-[#E0D3C4]/90 mb-5 max-w-sm">
                Inscrito no Conselho Regional de Corretores de Imóveis do Rio de Janeiro sob o registro <strong className="text-white">CRECI 39.583F</strong>.
              </p>

              {/* Botão Interativo de Copiar Registro CRECI */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyCreci}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all duration-150 cursor-pointer shadow-xs active:scale-95"
                  title="Copiar número do CRECI para consulta no órgão oficial"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#0F7A5A]" />
                      <span className="text-emerald-300">CRECI 39.583F Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#D4A64A]" />
                      <span>Copiar CRECI 39.583F</span>
                    </>
                  )}
                </button>

                <a 
                  href="https://www.creci-rj.gov.br/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-[#D4A64A] hover:text-white underline underline-offset-4 font-semibold transition-colors"
                >
                  Consultar no CRECI-RJ
                </a>
              </div>

            </div>

            {/* Lado Direito: Por que isso protege o proprietário */}
            <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#0F7A5A]/30 border border-[#0F7A5A]/60 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Por que a credencial CRECI é indispensável para você?
                  </h3>
                  <p className="text-xs text-white/70">
                    A segurança patrimonial de uma vida inteira não pode ficar na mão de intermediários informais.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 text-sm">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-[#0F7A5A] text-white flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                  <div>
                    <strong className="block text-white text-xs uppercase tracking-wide mb-0.5">Segurança Jurídica</strong>
                    <span className="text-white/80 text-xs leading-relaxed">Avaliação assinada com responsabilidade civil e respaldo do COFECI.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-[#0F7A5A] text-white flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                  <div>
                    <strong className="block text-white text-xs uppercase tracking-wide mb-0.5">+20 Anos de Mercado</strong>
                    <span className="text-white/80 text-xs leading-relaxed">Experiência comprovada em negociações em RJ, SP, SC, MG, BA, PB e RN.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-[#0F7A5A] text-white flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                  <div>
                    <strong className="block text-white text-xs uppercase tracking-wide mb-0.5">Sem Golpe de Falso Comprador</strong>
                    <span className="text-white/80 text-xs leading-relaxed">Checagem prévia de antecedentes e capacidade financeira antes de visitas.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-[#0F7A5A] text-white flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                  <div>
                    <strong className="block text-white text-xs uppercase tracking-wide mb-0.5">Contrato Escrito e Transparente</strong>
                    <span className="text-white/80 text-xs leading-relaxed">Comissão paga apenas no êxito da venda ou aluguel, sem taxas escondidas.</span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação Imediata */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0F7A5A] hover:bg-[#0B5F46] text-white font-bold text-sm transition-all duration-150 shadow-lg shadow-[#0F7A5A]/30 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Pedir Avaliação Gratuita do Meu Imóvel</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="https://wa.me/5521965928399?text=Ol%C3%A1%20Joel!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20a%20avalia%C3%A7%C3%A3o%20gratuita%20do%20meu%20im%C3%B3vel%20(CRECI%2039.583F)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold text-sm transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#D4A64A]" />
                  <span>Falar com Joel pelo WhatsApp</span>
                </a>
              </div>

            </div>

          </div>

        </div>

        {/* ============================================================== */}
        {/* SEÇÃO DOS DIFERENCIAIS DA AVALIAÇÃO GRATUITA                    */}
        {/* ============================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1EADF] border border-[#E0D3C4] text-[#5B3A29] text-xs font-bold uppercase tracking-wider mb-3">
            <span>Diferenciais Exclusivos</span>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#5B3A29] font-display tracking-tight">
            Por que a nossa avaliação gratuita é diferente do mercado tradicional?
          </h3>

          <p className="text-base text-[#2A1D15]/80 mt-3 leading-relaxed">
            Não entregamos números genéricos gerados por computadores sem conhecimento do bairro. Você recebe um estudo mercadológico detalhado conduzido por quem vive o dia a dia imobiliário de Itaboraí.
          </p>

          {/* Filtros de Categoria */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              type="button"
              onClick={() => setActiveTab('todos')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'todos'
                  ? 'bg-[#5B3A29] text-white shadow-sm'
                  : 'bg-white border border-[#E0D3C4] text-[#5B3A29] hover:bg-[#FAF7F2]'
              }`}
            >
              Todos os Diferenciais (6)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seguranca')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'seguranca'
                  ? 'bg-[#0F7A5A] text-white shadow-sm'
                  : 'bg-white border border-[#E0D3C4] text-[#5B3A29] hover:bg-[#FAF7F2]'
              }`}
            >
              Segurança & CRECI
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('metodologia')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'metodologia'
                  ? 'bg-[#0F7A5A] text-white shadow-sm'
                  : 'bg-white border border-[#E0D3C4] text-[#5B3A29] hover:bg-[#FAF7F2]'
              }`}
            >
              Metodologia de Preço
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('agilidade')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'agilidade'
                  ? 'bg-[#0F7A5A] text-white shadow-sm'
                  : 'bg-white border border-[#E0D3C4] text-[#5B3A29] hover:bg-[#FAF7F2]'
              }`}
            >
              Agilidade no WhatsApp
            </button>
          </div>
        </div>

        {/* Grid de Cards dos Diferenciais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diferenciaisFiltrados.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E0D3C4] shadow-sm hover:shadow-md hover:border-[#A9743B]/60 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E0D3C4] group-hover:bg-[#0F7A5A]/10 group-hover:border-[#0F7A5A]/30 flex items-center justify-center transition-colors">
                      <IconComp className="w-6 h-6 text-[#5B3A29] group-hover:text-[#0F7A5A] transition-colors" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A9743B] bg-[#F1EADF] px-2.5 py-1 rounded-md">
                      {item.badge}
                    </span>
                  </div>

                  <h4 className="font-bold text-lg text-[#5B3A29] font-display mb-2 group-hover:text-[#0F7A5A] transition-colors leading-snug">
                    {item.titulo}
                  </h4>

                  <p className="text-sm text-[#2A1D15]/80 leading-relaxed mb-4">
                    {item.descricao}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E0D3C4]/60 flex items-center justify-between text-xs font-semibold text-[#0F7A5A]">
                  <span>{item.destaque}</span>
                  <Check className="w-4 h-4 text-[#0F7A5A]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Barra de Ação Inferior do Destaque */}
        <div className="mt-12 p-6 sm:p-8 bg-[#F1EADF] rounded-2xl border border-[#E0D3C4] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-[#5B3A29] font-display">
              Pronto para saber exatamente quanto vale o seu imóvel?
            </h4>
            <p className="text-sm text-[#2A1D15]/80 mt-1">
              Preenchimento rápido em menos de 2 minutos. Receba a avaliação gratuita pelo WhatsApp.
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#0F7A5A] hover:bg-[#0B5F46] text-white font-bold text-sm transition-all shadow-md shadow-[#0F7A5A]/25 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Preencher Dados do Imóvel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
