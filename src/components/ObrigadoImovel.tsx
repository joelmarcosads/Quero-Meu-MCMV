import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Home,
  Clock,
  Sparkles,
  Award,
  ArrowLeft,
  Building2,
  TrendingUp,
  MapPin,
  MessageCircle,
  FileCheck2,
  Compass,
} from 'lucide-react';

const WHATSAPP = '5521965928399';

const WhatsAppIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

export default function ObrigadoImovel() {
  const [nome, setNome] = useState('');
  const [link, setLink] = useState('');
  const [imovelInfo, setImovelInfo] = useState<{
    tipo: string;
    situacao: string;
    bairro: string;
    cidade: string;
    estado: string;
    quartos: string;
    suites: string;
    banheiros: string;
    diferenciais: string;
    objetivo: string;
  }>({
    tipo: '',
    situacao: '',
    bairro: '',
    cidade: '',
    estado: '',
    quartos: '',
    suites: '',
    banheiros: '',
    diferenciais: '',
    objetivo: '',
  });

  useEffect(() => {
    document.title = 'Avaliação de Imóvel Solicitada | Joel Marcos Corretor';

    // Evita indexação no Google
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const createdMeta = !meta;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';

    let n = '';
    let l = '';
    let phone = '';
    let externalId = '';
    let tipo = '';
    let situacao = '';
    let bairro = '';
    let cidade = '';
    let estado = '';
    let quartos = '';
    let suites = '';
    let banheiros = '';
    let diferenciais = '';
    let objetivo = '';
    let jaMarcou = false;

    try {
      n = sessionStorage.getItem('prop_nome') || '';
      l = sessionStorage.getItem('prop_wa') || '';
      phone = sessionStorage.getItem('prop_phone') || '';
      externalId = sessionStorage.getItem('prop_external_id') || '';
      tipo = sessionStorage.getItem('prop_tipo') || '';
      situacao = sessionStorage.getItem('prop_situacao') || '';
      bairro = sessionStorage.getItem('prop_bairro') || '';
      cidade = sessionStorage.getItem('prop_cidade') || '';
      estado = sessionStorage.getItem('prop_estado') || '';
      quartos = sessionStorage.getItem('prop_quartos') || '';
      suites = sessionStorage.getItem('prop_suites') || '';
      banheiros = sessionStorage.getItem('prop_banheiros') || '';
      diferenciais = sessionStorage.getItem('prop_diferenciais') || '';
      objetivo = sessionStorage.getItem('prop_objetivo') || '';
      jaMarcou = sessionStorage.getItem('prop_convertido') === '1';
    } catch (_) {}

    setNome(n);
    setImovelInfo({ tipo, situacao, bairro, cidade, estado, quartos, suites, banheiros, diferenciais, objetivo });
    setLink(
      l ||
        `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
          'Olá, Joel! Acabei de cadastrar meu imóvel para avaliação e gostaria de conversar com você.'
        )}`
    );

    // Conversão única via Google Tag Manager
    if (!jaMarcou && externalId) {
      const win = window as unknown as { dataLayer?: unknown[] };
      win.dataLayer = win.dataLayer || [];
      win.dataLayer.push({
        event: 'lead_captacao_imovel',
        form_name: 'captacao_imovel',
        external_id: externalId,
        event_id: externalId,
        user_data: { phone_number: phone || undefined },
      });
      try {
        sessionStorage.setItem('prop_convertido', '1');
        sessionStorage.removeItem('prop_phone');
      } catch (_) {}
    }

    return () => {
      if (createdMeta && meta && meta.parentNode) {
        meta.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header Bar */}
      <header className="border-b border-stone-200/80 bg-white/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à página inicial</span>
          </a>

          <div className="flex items-center gap-2 text-xs text-stone-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-stone-800">Joel Marcos</span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-600 font-medium">CRECI-RJ 39.583F</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Main Success Hero Card */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xl shadow-stone-900/5 p-6 sm:p-10 relative overflow-hidden">
          {/* Subtle warm accent bar top */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-600 to-amber-600" />

          {/* Status Badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 flex-shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-semibold tracking-wide uppercase text-emerald-700">
                Cadastro recebido com sucesso
              </div>
              <div className="text-xs text-stone-500">
                Prioridade de atendimento ativada · {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
            {nome ? (
              <>Excelente decisão, <span className="text-amber-800">{nome}</span>! Seu imóvel já está em análise técnica.</>
            ) : (
              <>Excelente decisão! Seu imóvel já está em análise técnica.</>
            )}
          </h1>

          {/* Property summary if available */}
          {imovelInfo.tipo && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 text-sm text-stone-800 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-1.5 font-semibold text-amber-900">
                <Home className="w-4 h-4 text-amber-700" />
                {imovelInfo.tipo}
                {imovelInfo.situacao && <span className="font-normal text-stone-600">· {imovelInfo.situacao}</span>}
                {imovelInfo.estado && <span className="font-normal text-stone-600">({imovelInfo.estado})</span>}
              </span>
              {(imovelInfo.bairro || imovelInfo.cidade) && (
                <span className="inline-flex items-center gap-1 text-stone-700">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  {[imovelInfo.bairro, imovelInfo.cidade].filter(Boolean).join(', ')}
                </span>
              )}
              {(imovelInfo.quartos || imovelInfo.suites || imovelInfo.banheiros) && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white/80 border border-amber-200/60 text-stone-700">
                  {[
                    imovelInfo.quartos,
                    imovelInfo.suites && imovelInfo.suites !== 'Sem suíte' ? imovelInfo.suites : null,
                    imovelInfo.banheiros,
                  ].filter(Boolean).join(' · ')}
                </span>
              )}
              {imovelInfo.diferenciais && (
                <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-medium border border-emerald-200/80">
                  ✨ {imovelInfo.diferenciais}
                </span>
              )}
              {imovelInfo.objetivo && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white text-amber-900 font-medium border border-amber-200/80">
                  {imovelInfo.objetivo}
                </span>
              )}
            </div>
          )}

          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
            Para garantir que você não perca dinheiro nem tempo, o corretor credenciado{' '}
            <strong className="text-stone-900">Joel Marcos</strong> cruzará pessoalmente os dados do seu imóvel
            com as negociações reais mais recentes na região para apresentar uma avaliação precisa e realista.
          </p>

          {/* Primary Call to Action Box */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-900 to-stone-900 text-white relative shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  Agilidade no atendimento
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Quer acelerar a avaliação ou tirar dúvidas agora?
                </h2>
                <p className="text-sm text-emerald-100/90 max-w-xl">
                  Clique no botão abaixo para conversar diretamente pelo WhatsApp com o Joel.
                  Envie fotos ou detalhes para antecipar o parecer.
                </p>
              </div>

              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-base shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex-shrink-0 text-center"
              >
                <WhatsAppIcon className="w-5 h-5 text-white" />
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>

          {/* O Corretor - Humanização autêntica */}
          <div className="mt-8 pt-8 border-t border-stone-200/70">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-stone-50/80 rounded-2xl p-5 border border-stone-200/60">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-700 to-stone-800 text-white flex items-center justify-center font-bold text-xl shadow-inner flex-shrink-0 border-2 border-white">
                JM
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-stone-900 text-base sm:text-lg">Joel Marcos</h3>
                  <span className="text-xs font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                    CRECI-RJ 39.583F
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    Especialista em Itaboraí, São Gonçalo e Região
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-stone-600 leading-relaxed italic">
                  &ldquo;Avaliar um patrimônio é um compromisso sério. Eu não trabalho com palpites de internet:
                  analiso liquidez, documentação e compradores reais para valorizar cada centavo do seu imóvel.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* O que acontece agora: Etapas claras */}
          <div className="mt-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-700" />
              O que acontece a partir de agora:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-stone-200/80 bg-white">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 font-bold flex items-center justify-center text-sm mb-3">
                  1
                </div>
                <h4 className="font-semibold text-stone-900 text-sm mb-1">
                  Estudo de Mercado Local
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Comparamos seu imóvel com o valor do metro quadrado praticado e fechado em cartório no seu bairro.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200/80 bg-white">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-sm mb-3">
                  2
                </div>
                <h4 className="font-semibold text-stone-900 text-sm mb-1">
                  Parecer de Liquidez
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Apresentamos a estimativa do valor de venda e o tempo médio esperado para encontrar o comprador ideal.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200/80 bg-white">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-sm mb-3">
                  3
                </div>
                <h4 className="font-semibold text-stone-900 text-sm mb-1">
                  Compradores Qualificados
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Se desejar vender, ofertamos o imóvel diretamente para clientes com crédito habitacional já aprovado.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Despertar o desejo: Vender bem ou Encontrar o próximo imóvel */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Venda com Segurança */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Por que proprietários fecham conosco?
              </h3>
              <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                Você conta com divulgação profissional em portais, fotos estratégicas, triagem de clientes curiosos e total segurança jurídica em contrato.
              </p>
              <ul className="space-y-2 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Compradores com financiamento pré-aprovado pela Caixa</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Você só paga taxa de intermediação após a venda concluída</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Acompanhamento em cartório do início até a entrega das chaves</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-900"
              >
                <span>Tirar dúvidas sobre a venda</span>
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card Pensando em Comprar / Trocar de Imóvel */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Pensando em comprar ou trocar de imóvel?
              </h3>
              <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                Se o seu objetivo é vender para adquirir uma casa maior, apartamento em condomínio com lazer ou investir, conheça as oportunidades mais procuradas da região.
              </p>
              <div className="space-y-2 text-xs text-stone-700">
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-between">
                  <div>
                    <strong className="text-stone-900 block">Condomínio Prime Club Itaboraí</strong>
                    <span className="text-stone-500">Lazer completo com piscina e clube privativo</span>
                  </div>
                  <span className="text-emerald-700 font-semibold text-xs">Entrada facilitada</span>
                </div>

                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-between">
                  <div>
                    <strong className="text-stone-900 block">Reserva dos Pássaros 2</strong>
                    <span className="text-stone-500">Casas com quintal privativo e condomínio fechado</span>
                  </div>
                  <span className="text-emerald-700 font-semibold text-xs">Subsídio Caixa</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <a
                href="/#imoveis"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-900"
              >
                <span>Ver todos os lançamentos disponíveis</span>
                <Compass className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Garantias & Credibilidade */}
        <div className="mt-8 p-6 rounded-2xl bg-white border border-stone-200/70 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Intermediação 100% Legalizada e Segura</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>CRECI-RJ 39.583F Regularizado</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Avaliação Sem Custo ou Compromisso</span>
            </div>
          </div>
        </div>

        {/* Bottom Direct Contact */}
        <div className="mt-10 text-center">
          <p className="text-sm text-stone-500">
            Precisa de atendimento urgente? Ligue ou envie mensagem para{' '}
            <a
              href={`tel:+${WHATSAPP}`}
              className="font-semibold text-stone-800 underline decoration-stone-300 hover:decoration-stone-800"
            >
              (21) 96592-8399
            </a>
          </p>
          <p className="mt-1 text-xs text-stone-400">
            Joel Marcos dos Santos · Itaboraí, RJ · CRECI 39.583F
          </p>
        </div>
      </main>
    </div>
  );
}
