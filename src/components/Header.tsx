import { useState } from 'react';
import { Link } from 'react-router-dom';
import { m as motion, AnimatePresence } from 'motion/react';
import { MapPin, Search, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/minha-casa-minha-vida-itaborai', label: 'MCMV Itaboraí' },
    { to: '/minha-casa-minha-vida-sao-goncalo', label: 'MCMV São Gonçalo' },
    { to: '/financiamento-minha-casa-minha-vida', label: 'Financiamento' },
    { to: '/sobre', label: 'Sobre' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20 gap-4 flex-nowrap">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer gap-1.5 sm:gap-2">
            <div className="bg-primary text-white p-1.5 rounded-lg shrink-0">
              <Search className="w-5 h-5 xl:w-6 xl:h-6" />
            </div>
            <div className="flex items-center shrink-0">
              <span className="font-extrabold text-lg xl:text-xl leading-none text-primary tracking-tight mr-1 whitespace-nowrap">Quero Meu</span>
              <span className="font-black text-lg xl:text-xl leading-none text-accent tracking-tighter uppercase whitespace-nowrap">MCMV</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to}
                className="text-slate-600 hover:text-primary font-medium text-sm transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Trust indicators (hidden on smaller screens to make room for nav) */}
          <div className="hidden xl:flex items-center text-slate-500 text-sm font-medium whitespace-nowrap shrink-0">
            <MapPin className="w-4 h-4 mr-1 text-primary shrink-0" />
            <span>Itaboraí e São Gonçalo</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* CTA */}
            <a 
              href="/#simulacao"
              className="hidden sm:inline-flex bg-accent hover:bg-orange-600 text-white font-bold py-2 px-4 text-sm rounded-full transition-colors shadow-lg shadow-orange-500/30 transform hover:-translate-y-0.5 whitespace-nowrap shrink-0"
            >
              Simular Agora
            </a>

            {/* Mobile menu button */}
            <button 
              className="xl:hidden p-2 text-slate-600 hover:text-primary focus:ring-2 focus:ring-primary rounded-md focus:outline-none shrink-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            id="mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-slate-700 font-medium py-2 border-b border-slate-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a 
                href="/#simulacao"
                className="bg-accent hover:bg-orange-600 text-white font-bold py-3 px-5 rounded-xl text-center shadow-lg shadow-orange-500/30 w-full sm:hidden whitespace-nowrap"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Simular Agora
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

