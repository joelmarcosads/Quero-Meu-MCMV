import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">Termos de Uso</h1>
        
        <div className="prose prose-slate prose-lg max-w-none text-slate-700">
          <p>
            Bem-vindo à Quero Meu MCMV. Ao acessar e utilizar o nosso site, você concorda em cumprir e ficar vinculado aos seguintes Termos de Uso. Se você não concorda com qualquer parte destes termos, por favor, não utilize nosso site.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Uso do Site</h2>
          <p>
            O conteúdo das páginas deste site é apenas para sua informação geral e uso. Está sujeito a alterações sem aviso prévio. Este site contém material que é de nossa propriedade ou licenciado para nós. Este material inclui, mas não se limita ao design, layout, aparência e gráficos. A reprodução é proibida, exceto de acordo com o aviso de direitos autorais, que faz parte destes termos e condições.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Serviços de Simulação</h2>
          <p>
            A simulação de financiamento imobiliário fornecida em nosso site é apenas uma estimativa baseada nas informações que você fornece e nas regras atuais do programa Minha Casa Minha Vida. Os resultados não constituem uma oferta de crédito e não garantem a aprovação do financiamento pela Caixa Econômica Federal ou qualquer outra instituição financeira. A aprovação de crédito está sujeita a análise da instituição financeira e das construtoras.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Informações do Usuário</h2>
          <p>
            Você é responsável por garantir que todas as informações que você nos fornece (como nome, renda, etc.) sejam precisas e verdadeiras. Ao fornecer suas informações de contato, você concorda em ser contatado por nossos consultores e parceiros.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">4. Links para Outros Sites</h2>
          <p>
            Periodicamente, este site pode incluir links para outros sites. Esses links são fornecidos para sua conveniência e para fornecer mais informações. Eles não significam que endossamos os sites ligados. Não temos responsabilidade pelo conteúdo do(s) site(s) vinculado(s).
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">5. Limitação de Responsabilidade</h2>
          <p>
            A Quero Meu MCMV, seus funcionários, parceiros ou representantes, não serão responsáveis por quaisquer perdas ou danos que surjam em conexão com o uso deste site, seja direta ou indiretamente, incluindo, sem limitação, perda de dados ou lucros decorrentes do uso ou dependência das informações contidas neste site.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">6. Lei Aplicável</h2>
          <p>
            O uso deste site e qualquer disputa decorrente de tal uso estão sujeitos às leis do Brasil.
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
