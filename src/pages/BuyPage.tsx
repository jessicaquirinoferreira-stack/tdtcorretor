import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, ArrowRight, ShieldCheck, Compass, HelpCircle, Building2 } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { saveLead } from '../lib/storage';

interface BuyPageProps {
  onNavigate: (path: string) => void;
}

export const BuyPage: React.FC<BuyPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('');
  const [preferredType, setPreferredType] = useState('Casa');
  const [preferredCity, setPreferredCity] = useState('Coronel Fabriciano');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    saveLead({
      name: name.trim(),
      phone: phone.trim(),
      type: 'compra',
      preferredContact: 'whatsapp',
      message: `Interesse em comprar: Tipo ${preferredType}, Cidade ${preferredCity}, Orçamento: ${budget || 'A definir'}`,
      propertyDetails: {
        type: preferredType,
        city: preferredCity,
        budget,
      },
    });

    setSubmitted(true);
  };

  const steps = [
    {
      num: '1',
      title: 'Diagnóstico',
      desc: 'Entendimento detalhado do perfil, faixa de investimento, forma de pagamento, prioridades da família e prazo desejado.',
    },
    {
      num: '2',
      title: 'Curadoria',
      desc: 'Seleção minuciosa de imóveis compatíveis, evitando visitas aleatórias a propriedades que não atendam às suas expectativas.',
    },
    {
      num: '3',
      title: 'Visitas',
      desc: 'Organização de agenda e acompanhamento presencial para avaliar distribuição, insolação, ventilação e entorno com olhar técnico.',
    },
    {
      num: '4',
      title: 'Proposta',
      desc: 'Formalização segura das condições desejadas, mediação de valores, formas de pagamento e alinhamento de prazos.',
    },
    {
      num: '5',
      title: 'Documentação',
      desc: 'Conferência de certidões, matrícula do imóvel, dados cadastrais e encaminhamentos jurídicos ou bancários.',
    },
    {
      num: '6',
      title: 'Conclusão',
      desc: 'Formalização em escritura ou contrato de financiamento, vistoria final e entrega comemora das chaves.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
          04 · Compra de Imóveis
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2B20] font-editorial leading-tight">
          O imóvel certo começa com uma busca bem definida.
        </h1>
        <p className="text-base text-gray-600 leading-relaxed font-light">
          Menos visitas aleatórias. Mais opções alinhadas ao que você realmente procura. Atendimento consultivo focado no seu momento de vida.
        </p>
      </div>

      {/* 6 Steps Grid from PDF Page 5 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#0B2B20] font-editorial">
          Jornada de Compra Estruturada
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm relative group hover:border-[#C8A251] transition"
            >
              <div className="w-8 h-8 rounded-full bg-[#0B2B20] text-[#C8A251] font-bold text-sm flex items-center justify-center mb-4">
                {st.num}
              </div>
              <h3 className="text-base font-bold text-[#0B2B20] font-editorial mb-2">
                {st.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Buyer Intake Form & Diagnostic Questionnaire */}
      <div className="bg-[#0B2B20] text-white rounded-2xl p-8 lg:p-12 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#C8A251] font-semibold block">
              Atendimento Consultivo Gratuito
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-editorial leading-tight">
              Conte o que você procura para iniciarmos sua curadoria.
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              Antes de pesquisar, procuramos entender: faixa de investimento, bairros prioritários, tipo de imóvel, metragem desejada, vagas e necessidade de financiamento.
            </p>

            <div className="pt-4 flex items-center gap-4 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-[#C8A251] shrink-0" />
              <span>Seus dados são protegidos e não realizamos ligações invasivas.</span>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white text-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-bold text-[#0B2B20] font-editorial">
                  Perfil de Busca Registrado!
                </h3>
                <p className="text-xs text-gray-600">
                  Obrigado, {name}. Thiago Teixeira entrará em contato para apresentar as opções compatíveis com o seu planejamento.
                </p>
                <a
                  href={getWhatsAppUrl('compra')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-md transition"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Conversar Agora no WhatsApp</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Mariana Silva"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      WhatsApp / Celular *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(31) 99999-9999"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Tipo de Imóvel
                    </label>
                    <select
                      value={preferredType}
                      onChange={(e) => setPreferredType(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20] bg-gray-50"
                    >
                      <option value="Casa">Casa</option>
                      <option value="Casa Geminada Duplex">Casa Geminada Duplex</option>
                      <option value="Apartamento">Apartamento</option>
                      <option value="Sítio / Rural">Sítio / Propriedade Rural</option>
                      <option value="Lote / Terreno">Lote / Terreno</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Cidade Desejada
                    </label>
                    <input
                      type="text"
                      value={preferredCity}
                      onChange={(e) => setPreferredCity(e.target.value)}
                      placeholder="Ex: Coronel Fabriciano"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Faixa de Investimento Pretendida (opcional)
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Ex: Até R$ 350.000 / Financiamento"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] rounded-md transition shadow-md"
                >
                  Enviar Perfil para Curadoria
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
