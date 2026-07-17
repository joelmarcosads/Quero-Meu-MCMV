import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">Política de Privacidade</h1>
        
        <div className="prose prose-slate prose-lg max-w-none text-slate-700">
          <p>
            A Quero Meu MCMV ("nós", "nosso", "nossa") se compromete a proteger a sua privacidade. Esta Política de Privacidade explica como suas informações pessoais são coletadas, usadas e divulgadas por nós.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Informações que Coletamos</h2>
          <p>
            Coletamos as informações que você nos fornece diretamente, como quando você preenche o formulário de simulação. Isso inclui seu nome completo, e-mail, número de telefone e renda familiar mensal bruta.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Como Usamos Suas Informações</h2>
          <p>
            Usamos as informações que coletamos para:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Fornecer, manter e melhorar nossos serviços;</li>
            <li>Realizar simulações de financiamento imobiliário;</li>
            <li>Comunicar com você, inclusive para enviar informações sobre imóveis que se encaixam no seu perfil, novidades e ofertas;</li>
            <li>Responder aos seus comentários, perguntas e solicitações de atendimento ao cliente.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Compartilhamento de Informações</h2>
          <p>
            Podemos compartilhar suas informações com parceiros imobiliários (construtoras e corretores parceiros) estritamente com o objetivo de dar andamento à sua simulação de financiamento e apresentar opções de imóveis adequadas ao seu perfil. Não vendemos suas informações pessoais para terceiros.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">4. Seus Direitos de Privacidade (LGPD)</h2>
          <p>
            De acordo com a Lei Geral de Proteção de Dados Pessoais (LGPD), você tem o direito de:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Acessar, corrigir, atualizar ou solicitar a exclusão de suas informações pessoais;</li>
            <li>Opor-se ao processamento de suas informações pessoais ou solicitar a restrição desse processamento;</li>
            <li>Retirar o seu consentimento a qualquer momento.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">5. Segurança das Informações</h2>
          <p>
            Tomamos medidas de segurança razoáveis para proteger suas informações pessoais contra perda, roubo, uso indevido, acesso não autorizado, divulgação, alteração e destruição.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">6. Contato</h2>
          <p>
            Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através do e-mail: contato@queromeumcmv.com.br
          </p>

          <p className="mt-12 text-sm text-slate-500">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
