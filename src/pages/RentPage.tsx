import React from 'react';
import { CheckCircle2, MessageCircle, ArrowRight, UserCheck, Key, Shield } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';

interface RentPageProps {
  onNavigate: (path: string) => void;
}

export const RentPage: React.FC<RentPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
          06 · Locação de Imóveis
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2B20] font-editorial leading-tight">
          Mais organização para quem oferece e para quem procura.
        </h1>
        <p className="text-base text-gray-600 leading-relaxed font-light">
          A locação reúne expectativas, documentos, prazos e responsabilidades. O corretor ajuda a organizar esse encontro com tranquilidade para ambas as partes.
        </p>
      </div>

      {/* Dual Columns from PDF Page 7 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Para o Proprietário */}
        <div className="bg-[#0B2B20] text-white p-8 lg:p-10 rounded-2xl shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#134636] text-[#C8A251] flex items-center justify-center font-bold text-sm">
              P
            </div>
            <div>
              <h2 className="text-2xl font-bold font-editorial">
                Para o Proprietário
              </h2>
              <p className="text-xs text-gray-300">Segurança patrimonial e inquilinos qualificados</p>
            </div>
          </div>

          <ul className="space-y-3.5 text-xs text-gray-200">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C8A251] shrink-0 mt-0.5" />
              <span>Cadastro e apresentação profissional do imóvel com fotografias claras</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C8A251] shrink-0 mt-0.5" />
              <span>Divulgação e atendimento prioritário a interessados</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C8A251] shrink-0 mt-0.5" />
              <span>Organização e acompanhamento de todas as visitas</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C8A251] shrink-0 mt-0.5" />
              <span>Recebimento e checagem da documentação cadastral</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C8A251] shrink-0 mt-0.5" />
              <span>Intermediação alinhada das condições de locação</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C8A251] shrink-0 mt-0.5" />
              <span>Encaminhamento para formalização contratual segura</span>
            </li>
          </ul>

          <div className="pt-4">
            <button
              onClick={() => onNavigate('/anunciar-imovel')}
              className="w-full py-3 text-xs uppercase tracking-wider font-semibold text-[#0B2B20] bg-[#C8A251] hover:bg-[#D4AF37] rounded-md transition shadow"
            >
              Anunciar meu imóvel para locação
            </button>
          </div>
        </div>

        {/* Para o Locatário */}
        <div className="bg-white text-gray-800 p-8 lg:p-10 rounded-2xl border border-gray-200 shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-[#0B2B20] flex items-center justify-center font-bold text-sm">
              L
            </div>
            <div>
              <h2 className="text-2xl font-bold font-editorial text-[#0B2B20]">
                Para o Locatário
              </h2>
              <p className="text-xs text-gray-500">Agilidade, clareza e respeito às suas necessidades</p>
            </div>
          </div>

          <ul className="space-y-3.5 text-xs text-gray-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0B2B20] shrink-0 mt-0.5" />
              <span>Seleção de opções compatíveis com sua rotina e orçamento</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0B2B20] shrink-0 mt-0.5" />
              <span>Informações transparentes sobre valores, encargos e condições</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0B2B20] shrink-0 mt-0.5" />
              <span>Agendamento flexível e acompanhamento das visitas</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0B2B20] shrink-0 mt-0.5" />
              <span>Orientação clara sobre garantias e documentos solicitados</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0B2B20] shrink-0 mt-0.5" />
              <span>Comunicação direta e sem intermediários desnecessários</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0B2B20] shrink-0 mt-0.5" />
              <span>Acompanhamento da vistoria até a entrega das chaves</span>
            </li>
          </ul>

          <div className="pt-4">
            <a
              href={getWhatsAppUrl('locacao')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-md transition shadow flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Consultar opções de locação no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4 Steps */}
      <div className="space-y-6 pt-4">
        <h2 className="text-2xl font-bold text-[#0B2B20] font-editorial text-center">
          Os 4 Passos da Locação Tranquila
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { n: '1', t: 'Cadastro', d: 'Levantamento das características do imóvel ou do perfil de moradia pretendido.' },
            { n: '2', t: 'Visitas', d: 'Apresentação detalhada aos interessados, respondendo dúvidas com clareza.' },
            { n: '3', t: 'Condições', d: 'Alinhamento equilibrado de valores, prazos, garantias e responsabilidades.' },
            { n: '4', t: 'Formalização', d: 'Confecção contratual, vistoria descritiva e entrega das chaves.' },
          ].map((step) => (
            <div key={step.n} className="bg-white p-6 rounded-xl border border-gray-200 text-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#0B2B20] text-[#C8A251] font-bold text-sm mx-auto flex items-center justify-center">
                {step.n}
              </div>
              <h3 className="text-sm font-bold text-[#0B2B20] font-editorial">{step.t}</h3>
              <p className="text-xs text-gray-600">{step.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
