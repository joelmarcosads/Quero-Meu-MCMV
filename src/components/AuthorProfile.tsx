export default function AuthorProfile() {
  return (
    <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <img
        src="/joel-marcos-corretor-minha-casa-minha-vida-itaborai.png"
        alt="Joel Marcos, corretor de imóveis especialista em Minha Casa Minha Vida em Itaboraí-RJ – CRECI 39.583F"
        width={80}
        height={80}
        className="w-20 h-20 rounded-full flex-shrink-0 object-cover object-top border-2 border-primary/20"
        loading="lazy"
        decoding="async"
      />
      <div>
        <div className="text-sm font-semibold text-accent mb-1">Conteúdo preparado por:</div>
        <h3 className="font-bold text-slate-900 text-lg">Joel Marcos</h3>
        <p className="text-sm text-slate-600 mb-3">Corretor de Imóveis • CRECI 39.583F</p>
        <p className="text-slate-700 text-sm leading-relaxed">
          Joel Marcos é corretor de imóveis (CRECI 39.583F) especialista no programa Minha Casa Minha Vida em Itaboraí-RJ, com atendimento também em São Gonçalo, Niterói e Maricá.
        </p>
      </div>
    </div>
  );
}
