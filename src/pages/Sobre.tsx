import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { UserCheck, Award, Target, Home, ShieldCheck, Instagram, Facebook, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const WHATSAPP_URL =
  'https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Vim%20pelo%20site%20e%20quero%20simular%20meu%20Minha%20Casa%20Minha%20Vida.';

export default function Sobre() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Joel Marcos, Corretor MCMV em Itaboraí | CRECI 39.583F</title>
        <meta name="description" content="Joel Marcos é corretor de imóveis especialista no Minha Casa Minha Vida em Itaboraí-RJ, com atendimento em São Gonçalo, Niterói e Maricá." />
        <link rel="canonical" href="https://queromeumcmv.com.br/sobre" />
        <meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content="Joel Marcos, Corretor MCMV em Itaboraí | CRECI 39.583F" />
        <meta property="og:description" content="Joel Marcos é corretor de imóveis especialista no Minha Casa Minha Vida em Itaboraí-RJ, com atendimento em São Gonçalo, Niterói e Maricá." />
        <meta property="og:url" content="https://queromeumcmv.com.br/sobre" />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Joel Marcos, Corretor MCMV em Itaboraí | CRECI 39.583F" />
        <meta name="twitter:description" content="Joel Marcos é corretor de imóveis especialista no Minha Casa Minha Vida em Itaboraí-RJ, com atendimento em São Gonçalo, Niterói e Maricá." />
        <meta name="twitter:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
      </Helmet>
      <Header />
      
      <main>
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary-light font-medium text-sm mb-4 border border-primary/30">
              Conheça Nossa História
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Sobre o Quero Meu MCMV</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Transparência, ética e dedicação para ajudar você a conquistar o sonho da casa própria com segurança jurídica.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Joel Marcos</h2>
                <div className="inline-flex items-center text-primary font-bold mb-6 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Corretor de Imóveis • CRECI 39.583F
                </div>
                {/* Primeiro parágrafo começa obrigatoriamente com a frase-entidade oficial */}
                <p className="text-slate-700 mb-4 leading-relaxed text-justify">
                  Joel Marcos é corretor de imóveis (CRECI 39.583F) especialista no programa Minha Casa Minha Vida em Itaboraí-RJ, com atendimento também em São Gonçalo, Niterói e Maricá. Com atuação consultiva e foco total na aprovação de crédito junto à Caixa Econômica Federal, dedico minha carreira a transformar o sonho da casa própria em uma realidade sólida e acessível.
                </p>
                <p className="text-slate-700 mb-4 leading-relaxed text-justify">
                  Acredito que a compra de um imóvel vai muito além de tijolo e cimento; trata-se de segurança, dignidade e futuro. Por isso, meu compromisso é oferecer um atendimento humano e 100% transparente, sem falsas promessas, baseando-me estritamente nas regras normativas da Caixa Econômica Federal e das maiores construtoras parceiras do mercado (como MRV, Realiza Construtora, Direcional, Tenda e outras).
                </p>
                <p className="text-slate-700 leading-relaxed text-justify">
                  O portal <strong>Quero Meu MCMV</strong> nasceu da necessidade de simplificar a informação. Aqui você encontra um guia claro e honesto sobre <Link to="/renda-minha-casa-minha-vida" className="text-primary hover:underline">faixas de renda</Link>, <Link to="/subsidio-minha-casa-minha-vida" className="text-primary hover:underline">subsídios</Link> e regras do programa.
                </p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 text-center border-b pb-4">Nossos Pilares E-E-A-T</h3>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <Award className="w-8 h-8 text-accent shrink-0 mr-4 mt-1" />
                    <div>
                      <strong className="block text-slate-900">Expertise (Especialização em Itaboraí)</strong>
                      <span className="text-sm text-slate-600 text-justify block mt-1">Foco total no Minha Casa Minha Vida e nas regras de aprovação da Caixa Econômica, dominando os processos de ponta a ponta.</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <UserCheck className="w-8 h-8 text-accent shrink-0 mr-4 mt-1" />
                    <div>
                      <strong className="block text-slate-900">Experiência Humana</strong>
                      <span className="text-sm text-slate-600 text-justify block mt-1">Cada cliente tem uma realidade. Analiso sua renda e capacidade com empatia, mantendo total sigilo bancário e pessoal.</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Target className="w-8 h-8 text-accent shrink-0 mr-4 mt-1" />
                    <div>
                      <strong className="block text-slate-900">Autoridade e Confiança</strong>
                      <span className="text-sm text-slate-600 text-justify block mt-1">Registro profissional regular (CRECI-RJ 39.583F) e transparência comercial. Você sabe exatamente quanto vai pagar, sem taxas ocultas.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Área de Atendimento com as 4 cidades na ordem oficial */}
        <section className="py-16 bg-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Área de Atendimento</h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8">
              Itaboraí é a base e especialidade da minha atuação profissional, com atendimento dedicado também nas cidades vizinhas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <Link to="/minha-casa-minha-vida-itaborai" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group border-2 border-primary">
                <Home className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-900 text-lg">1. Itaboraí</span>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                  Base e Especialidade
                </span>
                <span className="text-xs text-slate-500 mt-2">Ver lançamentos MCMV</span>
              </Link>
              
              <Link to="/minha-casa-minha-vida-sao-goncalo" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group border border-slate-200 hover:border-primary">
                <Home className="w-10 h-10 text-slate-700 mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-900 text-lg">2. São Gonçalo</span>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  Área de Atendimento
                </span>
                <span className="text-xs text-slate-500 mt-2">Ver lançamentos MCMV</span>
              </Link>

              <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center text-center border border-slate-200">
                <Home className="w-10 h-10 text-slate-500 mb-3" />
                <span className="font-bold text-slate-900 text-lg">3. Niterói</span>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  Área de Atendimento
                </span>
                <span className="text-xs text-slate-500 mt-2">Atendimento consultivo</span>
              </div>

              <Link to="/conquista-oceanica" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group border border-slate-200 hover:border-primary">
                <Home className="w-10 h-10 text-slate-700 mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-900 text-lg">4. Maricá</span>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  Área de Atendimento
                </span>
                <span className="text-xs text-slate-500 mt-2">Lançamento Conquista Oceânica</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Seção de Contatos e Redes Sociais */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Canais de Contato e Redes Sociais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener"
                className="flex items-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <Phone className="w-6 h-6 text-emerald-600 mr-3 shrink-0" />
                <div>
                  <div className="text-xs uppercase font-bold text-emerald-700">WhatsApp Oficial</div>
                  <div className="text-sm font-semibold text-slate-900">(21) 96592-8399</div>
                </div>
              </a>

              <a
                href="mailto:contato@queromeumcmv.com.br"
                className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <Mail className="w-6 h-6 text-blue-600 mr-3 shrink-0" />
                <div>
                  <div className="text-xs uppercase font-bold text-blue-700">E-mail Comercial</div>
                  <div className="text-sm font-semibold text-slate-900">contato@queromeumcmv.com.br</div>
                </div>
              </a>

              <a
                href="https://www.instagram.com/queromeumcmv/"
                target="_blank"
                rel="noopener"
                aria-label="Instagram de Joel Marcos, corretor especialista em Minha Casa Minha Vida em Itaboraí"
                className="flex items-center p-4 bg-pink-50 border border-pink-200 rounded-xl hover:bg-pink-100 transition-colors"
              >
                <Instagram className="w-6 h-6 text-pink-600 mr-3 shrink-0" />
                <div>
                  <div className="text-xs uppercase font-bold text-pink-700">Instagram</div>
                  <div className="text-sm font-semibold text-slate-900">@queromeumcmv</div>
                </div>
              </a>

              <a
                href="https://www.facebook.com/queromeumcmv"
                target="_blank"
                rel="noopener"
                aria-label="Facebook de Joel Marcos, corretor especialista em Minha Casa Minha Vida em Itaboraí"
                className="flex items-center p-4 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                <Facebook className="w-6 h-6 text-indigo-600 mr-3 shrink-0" />
                <div>
                  <div className="text-xs uppercase font-bold text-indigo-700">Facebook</div>
                  <div className="text-sm font-semibold text-slate-900">Quero Meu MCMV</div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Formulário de Captação Estratégico */}
        <section className="py-16 bg-slate-50 border-t border-slate-200" id="simulacao">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
                Fale com o Corretor Joel Marcos
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Preencha as informações abaixo para receber atendimento personalizado e simular suas condições no Minha Casa Minha Vida.
              </p>
            </div>
            <div className="max-w-xl mx-auto shadow-xl rounded-2xl overflow-hidden">
              <LeadForm />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
