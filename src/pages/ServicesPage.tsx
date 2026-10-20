import React from 'react';
import {
  Building2,
  KeyRound,
  Compass,
  FileCheck,
  TrendingUp,
  FileSpreadsheet,
  HandCoins,
  ShieldCheck,
  CheckCircle2,
  MessageCircle
} from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const services = [
    {
      num: '01',
      title: 'Compra de Imóveis',
      subtitle: 'Diagnóstico e curadoria personalizada',
      desc: 'Busca ativa, seleção criteriosa e visitas a imóveis compatíveis com localização, perfil da família e orçamento planejado. Evitamos perda de tempo com visitas desnecessárias.',
      details: [
        'Diagnóstico das prioridades inegociáveis',
        'Curadoria no mercado amplo',
        'Acompanhamento técnico nas visitas presenciais',
        'Formalização e defesa da proposta'
      ],
      cta: 'Quero Comprar',
      action: () => onNavigate('/comprar'),
    },
    {
      num: '02',
      title: 'Venda de Imóveis',
      subtitle: 'Estratégia comercial e posicionamento',
      desc: 'Posicionamento adequado ao mercado real, apresentação profissional, divulgação direcionada, acompanhamento de visitas e intermediação assertiva de propostas.',
      details: [
        'Análise mercadológica para precificação defensável',
        'Material fotográfico organizado e de alta qualidade',
        'Divulgação direcionada para compradores em potencial',
        'Negociação estruturada preservando as partes'
      ],
      cta: 'Quero Vender',
      action: () => onNavigate('/vender'),
    },
    {
      num: '03',
      title: 'Locação Estruturada',
      subtitle: 'Equilíbrio e segurança jurídica',
      desc: 'Apoio na apresentação do imóvel, visitas acompanhadas, alinhamento de prazos, análise cadastral preventiva e organização completa das etapas de locação.',
      details: [
        'Atendimento dedicado tanto a proprietários quanto a locatários',
        'Vistoria inicial descritiva para salvaguarda do patrimônio',
        'Orientação clara sobre garantias locatícias',
        'Acompanhamento até a entrega solene das chaves'
      ],
      cta: 'Ver Locações',
      action: () => onNavigate('/alugar'),
    },
    {
      num: '04',
      title: 'Captação Qualificada',
      subtitle: 'Ficha essencial e levantamento completo',
      desc: 'Levantamento detalhado das características, conservação, entorno e documentação do imóvel para preparar uma oferta transparente e atrativa ao mercado.',
      details: [
        'Registro de metragem, cômodos, acabamentos e diferenciais',
        'Avaliação das condições de conservação e manutenção',
        'Levantamento inicial da situação documental da matrícula',
        'Planejamento de comunicação assertiva'
      ],
      cta: 'Anunciar Imóvel',
      action: () => onNavigate('/anunciar-imovel'),
    },
    {
      num: '05',
      title: 'Análise de Mercado & Precificação',
      subtitle: 'Referências de imóveis comparáveis',
      desc: 'Um preço bem posicionado atrai atenção qualificada e evita desvalorização por tempo excessivo de exposição. Apoio analítico para tomada de decisão fundamentada.',
      details: [
        'Mapeamento de valores praticados no bairro e entorno',
        'Consideração de padrão construtivo, insolação e diferenciais',
        'Margem de negociação planejada estrategicamente',
        'Apoio consultivo contínuo durante a comercialização'
      ],
      cta: 'Consultar Análise',
      action: () => {
        const url = getWhatsAppUrl('geral', { customText: 'Olá, Thiago! Gostaria de solicitar uma análise de mercado para precificação do meu imóvel.' });
        window.open(url, '_blank', 'noopener,noreferrer');
      },
    },
    {
      num: '06',
      title: 'Intermediação & Negociação Consciente',
      subtitle: 'Comunicação objetiva entre as partes',
      desc: 'Negociar não é pressionar, é criar condições para uma decisão consciente. O corretor atua como ponte de confiança entre compradores e vendedores.',
      details: [
        'Eliminação de ruídos e mal-entendidos na negociação',
        'Registro formal de condições, contrapropostas e prazos',
        'Alinhamento de mobília, benfeitorias e datas de entrega',
        'Manutenção das partes informadas em cada fase'
      ],
      cta: 'Falar no WhatsApp',
      action: () => {
        const url = getWhatsAppUrl('geral');
        window.open(url, '_blank', 'noopener,noreferrer');
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
          03 · Soluções Imobiliárias
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2B20] font-editorial leading-tight">
          Como Posso Ajudar Você
        </h1>
        <p className="text-base text-gray-600 leading-relaxed font-light">
          Serviços especializados para cada fase da jornada imobiliária, sempre pautados por escuta ativa, organização rigorosa e acompanhamento humanizado.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((svc) => (
          <div
            key={svc.num}
            className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <span className="text-sm font-bold text-[#C8A251] font-mono">
                {svc.num}
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#0B2B20] font-editorial">
                  {svc.title}
                </h3>
                <p className="text-xs text-[#C8A251] font-medium mt-0.5">
                  {svc.subtitle}
                </p>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {svc.desc}
              </p>

              <div className="pt-2 border-t border-gray-100 space-y-2">
                {svc.details.map((d, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0B2B20] shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={svc.action}
              className="w-full py-2.5 px-4 text-xs uppercase tracking-wider font-semibold text-[#0B2B20] bg-gray-100 hover:bg-[#0B2B20] hover:text-white rounded-lg transition"
            >
              {svc.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Trust & Document Safety Section from PDF Page 13 */}
      <div className="bg-[#0B2B20] text-white rounded-2xl p-8 lg:p-12 shadow-xl space-y-6">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
            12 · Organização Documental
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial">
            Documentos fazem parte da segurança do negócio.
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
            A documentação necessária varia conforme o tipo de imóvel, a operação, as partes envolvidas e a forma de pagamento. Orientamos a conferência prévia para evitar surpresas na formalização.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#0F3528] border border-[#1A4535]">
            <span className="text-xs font-bold text-[#C8A251] block mb-1">V · Vendedor</span>
            <p className="text-xs text-gray-300">
              Documentos pessoais, certidões negativas e comprovações aplicáveis à operação.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0F3528] border border-[#1A4535]">
            <span className="text-xs font-bold text-[#C8A251] block mb-1">C · Comprador</span>
            <p className="text-xs text-gray-300">
              Dados pessoais, cadastrais e financeiros conforme a modalidade de pagamento escolhida.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0F3528] border border-[#1A4535]">
            <span className="text-xs font-bold text-[#C8A251] block mb-1">I · Imóvel</span>
            <p className="text-xs text-gray-300">
              Certidão de matrícula atualizada, IPTU, quitação condominial e situação cadastral do bem.
            </p>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 italic pt-2">
          * Quando a operação exigir análise jurídica, bancária, cartorária ou técnica especializada, cada profissional ou instituição atua dentro de sua devida competência.
        </p>
      </div>
    </div>
  );
};
