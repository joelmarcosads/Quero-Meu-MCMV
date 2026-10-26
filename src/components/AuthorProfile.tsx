export default function AuthorProfile() {
  return (
    <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex-shrink-0 flex items-center justify-center text-primary font-bold text-2xl">
        JM
      </div>
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
