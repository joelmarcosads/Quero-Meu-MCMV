import { MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="lg:col-span-1">
            <div className="flex flex-col mb-4">
              <span className="font-extrabold text-2xl leading-none text-white tracking-tight">Quero Meu</span>
              <span className="font-black text-xl leading-none text-orange-300 tracking-tighter uppercase">MCMV</span>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Especialistas em realizar o sonho da casa própria na região de Itaboraí e São Gonçalo. Atendimento humano, transparente e focado na sua aprovação usando todos os benefícios do Minha Casa Minha Vida.
            </p>
            <div className="text-sm font-bold text-slate-400">
              CRECI: 39.583F
            </div>
          </div>

          <div>
            <h2 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Links Úteis</h2>
            <ul className="space-y-3 pl-0">
              <li>
                <a href="/#simulacao" className="text-sm hover:text-white transition-colors flex items-center">
                  <ChevronRight className="w-4 h-4 mr-1 text-slate-400" /> Fazer Simulação
                </a>
              </li>
              <li>
                <a href="/#empreendimentos" className="text-sm hover:text-white transition-colors flex items-center">
                  <ChevronRight className="w-4 h-4 mr-1 text-slate-400" /> Ver Imóveis
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-sm hover:text-white transition-colors flex items-center">
                  <ChevronRight className="w-4 h-4 mr-1 text-slate-400" /> Dúvidas Frequentes
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contatos</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="w-5 h-5 mr-3 text-orange-300 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-white mb-0.5">WhatsApp Central</div>
                  <a href="https://wa.me/5521965928399" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">(21) 96592-8399</a>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 mr-3 text-orange-300 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-white mb-0.5">E-mail Comercial</div>
                  <a href="#" className="text-sm hover:text-white transition-colors">contato@queromeumcmv.com.br</a>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Escritório</h2>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 text-orange-300 shrink-0" />
              <p className="text-sm leading-relaxed">
                Rua H, nº 492<br />
                Retiro São Joaquim - Itaboraí - RJ<br />
                CEP: 24.813-066<br />
                Atendimento com hora marcada
              </p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} Quero Meu MCMV. Todos os direitos reservados.</p>
          <div className="flex space-x-6">
            <Link to="/politica-de-privacidade" className="hover:text-white transition-colors">Política de Privacidade (LGPD)</Link>
            <Link to="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
