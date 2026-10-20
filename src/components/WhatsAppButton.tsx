import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { getWhatsAppUrl, DISPLAY_PHONE } from '../utils/whatsapp';

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="mb-3 max-w-xs bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 p-3.5 relative animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Fechar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="text-xs font-semibold text-[#0B2B20]">Atendimento TFT Imóveis</p>
          <p className="text-xs text-gray-600 mt-1">
            Olá! Precisa de orientações sobre compra, venda ou locação? Fale comigo agora pelo WhatsApp.
          </p>
          <p className="text-[10px] text-gray-400 mt-1 font-mono">{DISPLAY_PHONE}</p>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={getWhatsAppUrl('geral')}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-2xl hover:bg-[#20BA5A] transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
        aria-label="Conversar no WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
        <span className="sr-only">Falar no WhatsApp com Thiago</span>
      </a>
    </div>
  );
};
