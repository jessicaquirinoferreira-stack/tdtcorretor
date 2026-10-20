import React from 'react';
import { ArrowRight, CheckCircle2, MessageCircle, Sparkles, Camera, ShieldCheck, TrendingUp, HandCoins } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';

interface SellPageProps {
  onNavigate: (path: string) => void;
}

export const SellPage: React.FC<SellPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
          05 · Venda de Imóveis
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2B20] font-editorial leading-tight">
          Vender bem exige estratégia, não apenas anúncio.
        </h1>
        <p className="text-base text-gray-600 leading-relaxed font-light">
          O objetivo é apresentar o imóvel ao mercado com informações completas, boa comunicação visual e uma estratégia de negociação coerente.
        </p>
      </div>

      {/* 4 Pillars from PDF Page 6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#0B2B20]/10 text-[#0B2B20] flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0B2B20] font-editorial">
            Preço Coerente
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Referências de mercado reais ajudam a evitar um posicionamento distante da realidade, preservando a liquidez e evitando desvalorização por longa exposição.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#0B2B20]/10 text-[#0B2B20] flex items-center justify-center font-bold">
            <Camera className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0B2B20] font-editorial">
            Apresentação Visual
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Organização, fotografias de qualidade e descrição objetiva devem destacar os diferenciais reais do imóvel sem esconder limitações.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#0B2B20]/10 text-[#0B2B20] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0B2B20] font-editorial">
            Divulgação Qualificada
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Escolha de canais e comunicação direcionada compatíveis com o perfil do imóvel, atraindo interessados com real potencial de compra.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#0B2B20]/10 text-[#0B2B20] flex items-center justify-center font-bold">
            <HandCoins className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#0B2B20] font-editorial">
            Negociação & Fechamento
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Mediação de propostas, prazos, formas de pagamento e contrapropostas com clareza para que as partes decidam com segurança.
          </p>
        </div>
      </div>

      {/* Preparation tips from PDF Page 10 */}
      <div className="bg-[#0B2B20] text-white rounded-2xl p-8 lg:p-12 shadow-xl space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#C8A251] font-semibold block mb-1">
            09 · Antes das Fotos e Visitas
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial">
            Pequenos cuidados podem mudar a primeira impressão.
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 font-light">
            “O objetivo é mostrar o potencial real do imóvel, sem exageros.”
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { t: '01 · Organização', d: 'Reduzir excesso de objetos e facilitar a leitura dos ambientes.' },
            { t: '02 · Iluminação', d: 'Abrir cortinas, valorizar a luz natural e substituir lâmpadas queimadas.' },
            { t: '03 · Limpeza', d: 'Ambientes limpos transmitem cuidado e valorizam cada detalhe construtivo.' },
            { t: '04 · Reparos simples', d: 'Torneiras, puxadores e pequenas falhas podem chamar atenção desnecessária.' },
            { t: '05 · Neutralidade', d: 'Um espaço visualmente leve ajuda o comprador a imaginar seu próprio lar.' },
            { t: '06 · Transparência', d: 'Questões relevantes devem ser tratadas com clareza desde o primeiro contato.' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-[#0F3528] border border-[#1A4535]">
              <span className="text-xs font-bold text-[#C8A251] block mb-1">{item.t}</span>
              <p className="text-xs text-gray-300 leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 lg:p-12 text-center space-y-5 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2B20] font-editorial">
          Deseja avaliar ou colocar seu imóvel à venda?
        </h2>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">
          Faça o cadastro da sua propriedade para receber orientação profissional sobre posicionamento de mercado e estratégias de divulgação.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onNavigate('/anunciar-imovel')}
            className="px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] rounded-md transition shadow"
          >
            Cadastrar meu imóvel no formulário
          </button>

          <a
            href={getWhatsAppUrl('venda')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-md transition shadow"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Conversar sobre a venda pelo WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
