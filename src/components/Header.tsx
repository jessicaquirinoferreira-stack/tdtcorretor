import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X, Phone, Building2 } from 'lucide-react';
import { getWhatsAppUrl, OFFICIAL_LOGO_URL, LOCAL_LOGO_URL } from '../utils/whatsapp';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', path: '/' },
    { label: 'Imóveis', path: '/imoveis' },
    { label: 'Comprar', path: '/comprar' },
    { label: 'Vender', path: '/vender' },
    { label: 'Alugar', path: '/alugar' },
    { label: 'Financiamento', path: '/financiamento' },
    { label: 'Sobre', path: '/sobre' },
    { label: 'Contato', path: '/contato' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B2B20]/95 backdrop-blur-md shadow-md py-2 sm:py-2.5 text-white border-b border-[#1A4535]'
          : 'bg-[#0B2B20] text-white py-2.5 sm:py-3 border-b border-[#153D2F]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark & Official Large Transparent Logo */}
          <button
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A251] rounded-xl group shrink-0 py-0.5"
            aria-label="Ir para a página inicial"
          >
            {/* Official Transparent Logo - Enlarged and enhanced for dark background legibility */}
            <div className="relative h-14 sm:h-16 md:h-17 w-auto flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-[1.03]">
              <img
                src={OFFICIAL_LOGO_URL}
                alt="Logo Oficial TFT Corretor Imobiliário"
                className="h-13 sm:h-15 md:h-16 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] drop-shadow-[0_0_12px_rgba(200,162,81,0.35)] drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)]"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== LOCAL_LOGO_URL) {
                    target.src = LOCAL_LOGO_URL;
                  }
                }}
              />
            </div>
            <div className="hidden sm:flex flex-col justify-center">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-none font-editorial group-hover:text-[#E2C481] transition-colors">
                TFT <span className="text-[#C8A251] font-normal text-xs sm:text-sm font-sans tracking-widest uppercase ml-1">Corretor</span>
              </span>
              <span className="text-[11px] text-gray-300 uppercase tracking-widest font-semibold mt-1">
                Thiago Teixeira
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (single-line, elegant hover) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`relative py-1 transition-colors whitespace-nowrap focus:outline-none ${
                    isActive
                      ? 'text-[#C8A251] font-semibold'
                      : 'text-gray-200 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C8A251] rounded-full animate-in fade-in" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action CTA */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a
              href={getWhatsAppUrl('geral')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-md transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={getWhatsAppUrl('geral')}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white bg-[#25D366] rounded-md sm:hidden"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#C8A251] rounded-md"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A261C] border-b border-[#1A4535] px-4 pt-4 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#153D2F]">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-[#153D2F] text-[#C8A251] font-semibold'
                      : 'text-gray-200 hover:bg-[#113327]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href={getWhatsAppUrl('geral')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-md transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Conversar com Thiago</span>
            </a>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-1">
              <Phone className="w-3.5 h-3.5" />
              <span>+55 (31) 98966-8814</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
