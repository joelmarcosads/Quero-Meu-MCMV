import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Search,
  Calendar,
  Home,
  ArrowRight,
  Clock,
  Sparkles,
  Phone,
  FileCheck2,
  Building2,
  Lock,
  ArrowLeft,
  BadgeCheck,
  HelpCircle,
} from 'lucide-react';

// Central de atendimento Quero Meu MCMV
const WHATSAPP = '5521965928399';

const WhatsAppIcon = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default function Obrigado() {
  const [nome, setNome] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    document.title = 'Recebemos seu interesse! 🏡💚 | Quero Meu MCMV';

    // Impede a página de ser indexada por motores de busca
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);

    let n = '';
    let l = '';
    let email = '';
    let phone = '';
    let externalId = '';
    let utmSource = '';
    let utmMedium = '';
    let utmCampaign = '';
    let jaMarcou = false;

    try {
      n = sessionStorage.getItem('lead_nome') || '';
      l = sessionStorage.getItem('lead_wa') || '';
      email = sessionStorage.getItem('lead_email') || '';
      phone = sessionStorage.getItem('lead_phone') || '';
      externalId = sessionStorage.getItem('lead_external_id') || '';

      const qs = new URLSearchParams(window.location.search);
      utmSource =
        qs.get('utm_source') ||
        sessionStorage.getItem('lead_utm_source') ||
        sessionStorage.getItem('utm_source') ||
        '';
      utmMedium =
        qs.get('utm_medium') ||
        sessionStorage.getItem('lead_utm_medium') ||
        sessionStorage.getItem('utm_medium') ||
        '';
      utmCampaign =
        qs.get('utm_campaign') ||
        sessionStorage.getItem('lead_utm_campaign') ||
        sessionStorage.getItem('utm_campaign') ||
        '';
      jaMarcou = sessionStorage.getItem('lead_convertido') === '1';
    } catch (_) {}

    setNome(n);
    setLink(
      l ||
        `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
          'Olá! Preenchi o formulário no site e quero ver opções de imóveis.'
        )}`
    );

    // Marcação de conversão: 1 vez por envio, mesmo se o usuário recarregar a página
    // Passa pela dataLayer (Google Tag Manager) para evitar duplicidade de contagem
    if (!jaMarcou && externalId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'lead_compra_imovel',
        form_name: 'compra_imovel',
        external_id: externalId,
        event_id: externalId, // Usado para deduplicar eventos Meta Pixel e API
        utm_source: utmSource || undefined,
        utm_medium: utmMedium || undefined,
        utm_campaign: utmCampaign || undefined,
        user_data: {
          email: email || undefined,
          phone_number: phone || undefined,
        },
      });

      try {
        sessionStorage.setItem('lead_convertido', '1');
        // Remove dados pessoais sensíveis do armazenamento após o disparo
        sessionStorage.removeItem('lead_email');
        sessionStorage.removeItem('lead_phone');
      } catch (_) {}
    }

    return () => {
      meta.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-orange-600 selection:text-white">
      {/* Topo institucional acolhedor */}
      <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <a
            href="/"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
            title="Quero Meu MCMV - Início"
          >
            <div className="bg-[#1e3a8a] text-white p-2 rounded-lg shrink-0 shadow-xs">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex items-baseline">
              <span className="font-extrabold text-lg sm:text-xl text-[#1e3a8a] tracking-tight mr-1">
                Quero Meu
              </span>
              <span className="font-black text-lg sm:text-xl text-[#c2410c] tracking-tighter uppercase">
                MCMV
              </span>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100/80 px-2.5 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              CRECI 39.583F
            </span>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#1e3a8a] transition-colors py-1 px-2 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao site</span>
            </a>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Card de Boas-Vindas Principal */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 text-center relative overflow-hidden">
            {/* Ambient subtle glow background */}
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            
            <div className="relative z-10">
              {/* Ícone Animado de Confirmação e Sucesso */}
              <div className="inline-flex items-center justify-center mb-6">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 rounded-full animate-ping opacity-30" />
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md shadow-emerald-500/25 transition-transform hover:scale-105">
                    <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.2]" />
                  </div>
                </div>
              </div>

              {/* Tag humanizada */}
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Solicitação Confirmada com Sucesso</span>
              </div>

              {/* Headline Principal */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {nome ? `Recebemos seu interesse, ${nome}! 🏡💚` : 'Recebemos seu interesse! 🏡💚'}
              </h1>

              {/* Subheadline */}
              <p className="mt-4 text-base sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
                Que alegria ter você aqui! Seu sonho de conquistar a casa própria merece atenção especial, e estamos felizes em fazer parte dessa jornada.
              </p>

              {/* Mensagem Complementar */}
              <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Seus dados foram enviados com sucesso! Nossa equipe poderá entrar em contato para entender melhor o que você procura e apresentar oportunidades que combinem com seus planos.
              </p>

              {/* Linha divisória sutil */}
              <div className="my-8 border-t border-slate-100 max-w-md mx-auto" />

              {/* Bloco de Aceleração / CTA WhatsApp */}
              <div className="bg-gradient-to-b from-emerald-50/50 to-emerald-50/20 border border-emerald-200/80 rounded-2xl p-5 sm:p-7 max-w-xl mx-auto text-left shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <WhatsAppIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                      Quer adiantar seu atendimento agora?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      Se você não quiser aguardar nosso contato, pode nos chamar direto no WhatsApp para tirar dúvidas e já receber opções na sua faixa de valor.
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-[#1f9d55] hover:bg-[#198246] text-white font-bold text-base sm:text-lg py-3.5 px-6 rounded-xl shadow-md shadow-emerald-700/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-3 focus:ring-emerald-400 focus:ring-offset-2"
                  >
                    <WhatsAppIcon className="w-5 h-5 shrink-0" />
                    <span>Falar no WhatsApp Agora</span>
                    <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
                  </a>
                </div>

                <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Atendimento rápido e humanizado · Sem compromisso</span>
                </p>
              </div>
            </div>
          </div>

          {/* O Que Acontece a Seguir — Redução de Ansiedade */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
            <div className="text-center sm:text-left mb-6">
              <span className="text-xs font-bold text-[#c2410c] uppercase tracking-wider block mb-1">
                Transparência Passo a Passo
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                O que acontece a partir de agora?
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Conheça as próximas etapas simples para você conquistar a sua chave:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Etapa 1 */}
              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-[#1e3a8a] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-md">
                      Etapa 1
                    </span>
                    <Search className="w-5 h-5 text-[#1e3a8a]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">
                    Análise do Seu Perfil
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Avaliamos suas preferências, localização e calculamos os maiores subsídios permitidos no Minha Casa Minha Vida.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs font-medium text-slate-500">
                  ⚡ Feito hoje mesmo
                </div>
              </div>

              {/* Etapa 2 */}
              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-[#1e3a8a] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-md">
                      Etapa 2
                    </span>
                    <Home className="w-5 h-5 text-[#1e3a8a]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">
                    Seleção de Opções Reais
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Apresentamos imóveis em Itaboraí, São Gonçalo e região que realmente cabem no seu bolso e atendem sua família.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs font-medium text-slate-500">
                  📱 Envio de fotos e plantas
                </div>
              </div>

              {/* Etapa 3 */}
              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-[#1e3a8a] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-md">
                      Etapa 3
                    </span>
                    <Calendar className="w-5 h-5 text-[#1e3a8a]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">
                    Simulação Caixa e Visita
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Mostramos os valores oficiais de entrada e parcelas pela Caixa Econômica e agendamos uma visita ao empreendimento.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs font-medium text-slate-500">
                  🔑 Sem compromisso
                </div>
              </div>
            </div>
          </div>

          {/* Card de Autoridade e Atendimento Humano (Joel Marcos) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-blue-800 text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shrink-0 shadow-sm">
                JM
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c2410c] bg-orange-50 border border-orange-200/70 px-2.5 py-0.5 rounded-md mb-2">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#c2410c]" />
                  <span>Especialista Credenciado</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Joel Marcos — Corretor de Imóveis
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mb-3">
                  CRECI 39.583F · Especialista Minha Casa Minha Vida
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  &ldquo;A compra da casa própria é um dos momentos mais importantes na vida de uma família. Meu compromisso é garantir que você tenha clareza total sobre o subsídio do governo, uso do FGTS e parcelas da Caixa, sempre com honestidade e segurança jurídica.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Dica de Ouro para Aprovação Rápida */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-5 sm:p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-950 text-base leading-tight">
                Dica importante para acelerar sua aprovação na Caixa:
              </h3>
              <p className="text-xs sm:text-sm text-amber-900/90 mt-1.5 leading-relaxed">
                Já deixe separados seus documentos básicos: <strong>RG, CPF, Comprovante de Residência atualizado</strong> e os <strong>3 últimos comprovantes de renda</strong> (holerites ou extratos bancários). Isso permite aprovar seu financiamento com máxima rapidez!
              </p>
            </div>
          </div>

          {/* Três Pilares de Confiança e Segurança */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 text-center sm:text-left flex items-start gap-3.5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  100% Gratuito
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                  Nenhuma taxa antecipada para simulação ou análise.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 text-center sm:text-left flex items-start gap-3.5">
              <div className="p-2 bg-blue-50 text-[#1e3a8a] rounded-xl shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Sigilo Total (LGPD)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                  Seus dados estão protegidos conforme a lei brasileira.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 text-center sm:text-left flex items-start gap-3.5">
              <div className="p-2 bg-orange-50 text-[#c2410c] rounded-xl shrink-0 mt-0.5">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Caixa e Construtoras
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                  Empreendimentos seguros com MRV, Cury, Direcional e Riva.
                </p>
              </div>
            </div>
          </div>

          {/* Botão de retorno / Ação secundária */}
          <div className="text-center pt-2">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#1e3a8a] transition-colors py-2 px-5 rounded-full border border-slate-200 hover:border-slate-300 bg-white shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Conhecer todos os lançamentos no site</span>
            </a>
          </div>

        </div>
      </main>

      {/* Rodapé sutil e respeitoso */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Quero Meu MCMV · Joel Marcos CRECI 39.583F</p>
          <div className="flex items-center gap-4">
            <a href="/politica-de-privacidade" className="hover:text-slate-600 transition-colors">
              Política de Privacidade
            </a>
            <span>·</span>
            <a href="/termos-de-uso" className="hover:text-slate-600 transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
