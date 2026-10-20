import React from 'react';
import { MessageCircle, Mail, Phone, Instagram, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { OFFICIAL_LOGO_URL, BROKER_EMAIL, DISPLAY_PHONE, INSTAGRAM_URL, getWhatsAppUrl } from '../utils/whatsapp';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#071C15] text-gray-300 border-t border-[#153D2F]">
      {/* Upper Subtle Trust Bar */}
      <div className="border-b border-[#123024] bg-[#0A241B]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#153D2F] flex items-center justify-center text-[#C8A251]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-sm text-gray-200">
                <span className="font-semibold text-white">Atendimento exclusivo e transparente.</span> Negociações com segurança e orientação em cada etapa.
              </p>
            </div>
            <a
              href={getWhatsAppUrl('geral')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#C8A251] hover:text-[#E2C481] transition-colors"
            >
              <span>Fale diretamente com Thiago Teixeira</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand Information */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#C8A251] bg-black shrink-0 shadow-lg flex items-center justify-center">
                <img
                  src={OFFICIAL_LOGO_URL}
                  alt="TFT Corretor Imobiliário"
                  className="w-full h-full object-contain p-0.5"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = 'https://i.postimg.cc/mg44xzyy/Whats-App-Image-2026-10-20-at-18-22-09.jpg';
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight font-editorial">
                  TFT Corretor Imobiliário
                </h3>
                <p className="text-xs text-[#C8A251] tracking-wider uppercase font-medium">
                  Thiago Teixeira
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400 italic">
              “Seu sonho, meu compromisso.”
            </p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Mais do que intermediar imóveis, meu objetivo é construir relações de confiança, oferecendo assessoria consultiva para compra, venda, locação e captação em Minas Gerais.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#123024] hover:bg-[#C8A251] hover:text-[#0B2B20] text-gray-300 flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={getWhatsAppUrl('geral')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#123024] hover:bg-[#25D366] hover:text-white text-gray-300 flex items-center justify-center transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${BROKER_EMAIL}`}
                className="w-9 h-9 rounded-full bg-[#123024] hover:bg-[#C8A251] hover:text-[#0B2B20] text-gray-300 flex items-center justify-center transition-all"
                aria-label="E-mail"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Links Rápidos */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#1A4535] pb-2">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleLinkClick('/')}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/imoveis')}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Catálogo de Imóveis
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/comprar')}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Quero Comprar
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/vender')}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Quero Vender
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/alugar')}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Locação de Imóveis
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/anunciar-imovel')}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Anunciar Meu Imóvel
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Soluções & Financiamento */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#1A4535] pb-2">
              Soluções & Apoio
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleLinkClick('/servicos')}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Serviços Imobiliários
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/financiamento')}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Simuladores Bancários
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/sobre')}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Sobre Thiago Teixeira
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/privacidade')}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/termos')}
                  className="text-gray-400 hover:text-[#C8A251] transition-colors"
                >
                  Termos de Uso
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contato Direto */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#1A4535] pb-2">
              Atendimento
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href={getWhatsAppUrl('geral')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-gray-300 hover:text-[#25D366] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <span>{DISPLAY_PHONE}</span>
              </a>

              <a
                href={`mailto:${BROKER_EMAIL}`}
                className="flex items-start gap-2.5 text-gray-300 hover:text-[#C8A251] transition-colors break-all"
              >
                <Mail className="w-4 h-4 text-[#C8A251] shrink-0 mt-0.5" />
                <span className="text-xs">{BROKER_EMAIL}</span>
              </a>

              <div className="flex items-start gap-2.5 text-gray-400">
                <MapPin className="w-4 h-4 text-[#C8A251] shrink-0 mt-0.5" />
                <span>Coronel Fabriciano e Vale do Aço / Minas Gerais</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleLinkClick('/contato')}
                  className="w-full py-2 px-3 text-xs font-medium text-center text-[#C8A251] border border-[#C8A251]/40 rounded hover:bg-[#C8A251]/10 transition-colors"
                >
                  Enviar Mensagem Direta
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Discreet Admin Link */}
        <div className="mt-14 pt-8 border-t border-[#123024] flex flex-col items-center justify-center gap-4 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} TFT Corretor Imobiliário — Todos os direitos reservados. Thiago Teixeira.</p>
          <p className="text-[11px] text-gray-500 max-w-2xl leading-relaxed">
            As informações, imagens e disponibilidades constantes neste site podem sofrer alterações sem aviso prévio. A intermediação é conduzida com transparência e formalizada conforme as exigências legais vigentes.
          </p>

          {/* Discreet Admin Link as requested by Section 15 and 20 */}
          <div className="pt-2">
            <button
              onClick={() => handleLinkClick('/admin')}
              className="text-gray-500 hover:text-gray-300 transition-colors text-[11px] underline underline-offset-4 tracking-wider focus:outline-none focus:text-[#C8A251]"
            >
              Painel administrativo
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
