import { m as motion } from 'motion/react';
import { ShieldCheck, MapPin, Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="bg-primary text-white p-2 p-1.5 rounded-lg mr-2">
              <Search className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl leading-none text-primary tracking-tight">Quero Meu</span>
              <span className="font-black text-xl leading-none text-accent tracking-tighter uppercase">MCMV</span>
            </div>
          </div>

          {/* Trust indicators (hidden on small screens) */}
          <div className="hidden md:flex items-center space-x-6 text-slate-600 text-sm font-medium">
            <div className="flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-success" />
              <span>Compra 100% Segura</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-primary" />
              <span>Itaboraí e São Gonçalo</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center">
            <a 
              href="/#simulacao"
              className="bg-accent hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-full transition-colors shadow-lg shadow-orange-500/30 transform hover:-translate-y-0.5"
            >
              Simular Agora
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
