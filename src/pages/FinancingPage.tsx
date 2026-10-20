import React, { useState } from 'react';
import { ExternalLink, MessageCircle, Calculator, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight, Building } from 'lucide-react';
import { BANK_SIMULATORS } from '../data/initialProperties';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { BankLogo } from '../components/BankLogo';

export const FinancingPage: React.FC = () => {
  // Calculator state
  const [propertyValue, setPropertyValue] = useState<number>(350000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [termYears, setTermYears] = useState<number>(30);
  const [annualRate, setAnnualRate] = useState<number>(10.5);
  const [amortizationType, setAmortizationType] = useState<'PRICE' | 'SAC'>('PRICE');

  // Math
  const downPaymentValue = (propertyValue * downPaymentPercent) / 100;
  const loanAmount = propertyValue - downPaymentValue;
  const totalMonths = termYears * 12;
  const monthlyRate = annualRate / 100 / 12;

  // PRICE (French system)
  let firstInstallment = 0;
  let lastInstallment = 0;

  if (amortizationType === 'PRICE') {
    if (monthlyRate > 0) {
      firstInstallment = (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      lastInstallment = firstInstallment;
    } else {
      firstInstallment = loanAmount / totalMonths;
      lastInstallment = firstInstallment;
    }
  } else {
    // SAC (Constant amortization)
    const constantAmortization = loanAmount / totalMonths;
    firstInstallment = constantAmortization + loanAmount * monthlyRate;
    lastInstallment = constantAmortization + constantAmortization * monthlyRate;
  }

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const handleConsultWhatsApp = () => {
    const text = `Olá, Thiago! Fiz uma estimativa de financiamento no seu site para um imóvel de ${formatBRL(propertyValue)} (entrada de ${formatBRL(downPaymentValue)} em ${termYears} anos). Gostaria de orientações sobre as opções bancárias.`;
    const url = getWhatsAppUrl('financiamento', { customText: text });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
          13 · Compra Financiada & Simuladores
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2B20] font-editorial leading-tight">
          Simuladores Oficiais de Financiamento
        </h1>
        <p className="text-base text-gray-600 leading-relaxed font-light">
          Planeje sua aquisição com transparência. Acesse os canais oficiais das instituições financeiras autorizadas pelo Banco Central e faça sua simulação personalizada.
        </p>
      </div>

      {/* Interactive Quick Calculator */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-lg space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B2B20] text-[#C8A251] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0B2B20] font-editorial">
                Estimativa Rápida de Parcelas
              </h2>
              <p className="text-xs text-gray-500">
                Simulação orientativa para apoiar seu planejamento financeiro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg text-xs font-semibold self-start md:self-auto">
            <button
              onClick={() => setAmortizationType('PRICE')}
              className={`px-3 py-1.5 rounded-md transition ${
                amortizationType === 'PRICE' ? 'bg-[#0B2B20] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tabela Price (Fixa)
            </button>
            <button
              onClick={() => setAmortizationType('SAC')}
              className={`px-3 py-1.5 rounded-md transition ${
                amortizationType === 'SAC' ? 'bg-[#0B2B20] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tabela SAC (Decrescente)
            </button>
          </div>
        </div>

        {/* Inputs & Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Valor do Imóvel:</span>
                <span className="text-[#0B2B20] font-bold">{formatBRL(propertyValue)}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="2000000"
                step="10000"
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="w-full accent-[#0B2B20] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Entrada ({downPaymentPercent}%):</span>
                <span className="text-[#0B2B20] font-bold">{formatBRL(downPaymentValue)}</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-[#0B2B20] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Prazo: {termYears} anos ({totalMonths} meses)
                </label>
                <select
                  value={termYears}
                  onChange={(e) => setTermYears(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-[#0B2B20]"
                >
                  <option value={15}>15 anos (180 meses)</option>
                  <option value={20}>20 anos (240 meses)</option>
                  <option value={25}>25 anos (300 meses)</option>
                  <option value={30}>30 anos (360 meses)</option>
                  <option value={35}>35 anos (420 meses)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Taxa Estimada Anual
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                />
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="lg:col-span-5 bg-[#071C15] text-white p-6 rounded-xl space-y-4">
            <span className="text-[11px] uppercase tracking-wider text-[#C8A251] font-semibold block">
              Resultado da Estimativa ({amortizationType})
            </span>

            <div>
              <span className="text-xs text-gray-400 block">Primeira Parcela Estimada:</span>
              <div className="text-3xl font-bold font-editorial text-white tabular-nums">
                {formatBRL(firstInstallment)}
              </div>
            </div>

            {amortizationType === 'SAC' && (
              <div>
                <span className="text-xs text-gray-400 block">Última Parcela Estimada:</span>
                <div className="text-xl font-bold font-editorial text-gray-300 tabular-nums">
                  {formatBRL(lastInstallment)}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-gray-800 text-xs text-gray-300 space-y-1">
              <p>Valor Financiado: <span className="text-white font-semibold">{formatBRL(loanAmount)}</span></p>
              <p>Entrada Recomendada: <span className="text-white font-semibold">{formatBRL(downPaymentValue)}</span></p>
            </div>

            <button
              onClick={handleConsultWhatsApp}
              className="w-full mt-2 py-3 text-xs uppercase tracking-wider font-semibold text-[#0B2B20] bg-[#C8A251] hover:bg-[#D4AF37] rounded-md transition flex items-center justify-center gap-2 shadow"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Conversar com Thiago sobre Financiamento</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Official Bank Simulator Cards (Section 12) */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-[#0B2B20] font-editorial">
            Instituições Financeiras Oficiais
          </h2>
          <p className="text-xs text-gray-600">
            Clique no banco de sua preferência para ser direcionado ao ambiente seguro oficial da instituição.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BANK_SIMULATORS.map((bank) => (
            <div
              key={bank.id}
              className="group bg-white rounded-2xl border border-gray-200/90 p-6 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header with Official Logo & Category Badge */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                  <BankLogo bankId={bank.id} />
                  {bank.badge && (
                    <span className="text-[10px] uppercase font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded shrink-0">
                      {bank.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {bank.description}
                </p>
              </div>

              <div className="pt-6 space-y-2.5">
                <a
                  href={bank.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 text-xs uppercase tracking-wider font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md"
                >
                  <span>Acessar Simulador Oficial</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={getWhatsAppUrl('financiamento')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 transition flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Dúvidas sobre este banco? Fale no WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Disclaimer as required by Section 12 & PDF */}
      <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-gray-800">
            Aviso de Transparência e Responsabilidade Bancária:
          </p>
          <p>
            A concessão de crédito, taxas de juros, prazos de pagamento, amortização, seguros habitacionais e aprovação cadastral dependem exclusivamente da instituição financeira escolhida e das condições individuais de cada cliente. A TFT Corretor Imobiliário atua como intermediadora e consultora imobiliária, prestando orientações e acompanhamento na organização de documentos, sem atuar como representante financeira exclusiva ou promissora de aprovações de crédito.
          </p>
        </div>
      </div>
    </div>
  );
};
