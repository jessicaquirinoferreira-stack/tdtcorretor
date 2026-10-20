import React, { useState } from 'react';
import { Send, CheckCircle2, MessageCircle, Shield, Building2, UploadCloud, Info } from 'lucide-react';
import { saveLead } from '../lib/storage';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const SubmitPropertyPage: React.FC = () => {
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [propertyType, setPropertyType] = useState('Casa');
  const [purpose, setPurpose] = useState('Venda');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState('3');
  const [garages, setGarages] = useState('1');
  const [intendedValue, setIntendedValue] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !phone.trim()) return;

    saveLead({
      name: ownerName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      type: 'anuncio',
      preferredContact: 'whatsapp',
      message: `Imóvel para ${purpose}: ${propertyType} em ${neighborhood}, ${city}. Área: ${area || 'N/A'}, Quartos: ${bedrooms}, Vagas: ${garages}, Valor pretendido: ${intendedValue || 'Sob consulta'}. Observações: ${description}`,
      propertyDetails: {
        type: propertyType,
        city: `${neighborhood ? neighborhood + ', ' : ''}${city}`,
        budget: intendedValue,
      },
    });

    setSubmitted(true);
  };

  const handleWhatsAppFollowup = () => {
    const text = `Olá, Thiago! Acabei de enviar os dados do meu imóvel (${propertyType} em ${city}) pelo site e gostaria de conversar sobre a captação e divulgação.`;
    const url = getWhatsAppUrl('anuncio', { customText: text });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
          07 · Captação de Imóveis
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2B20] font-editorial">
          Anuncie seu Imóvel com a TFT
        </h1>
        <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
          “Para divulgar bem, primeiro é preciso conhecer bem.” Reúna as informações essenciais para que possamos apresentar sua propriedade com excelência ao mercado.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center space-y-5 shadow-lg">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#0B2B20] font-editorial">
            Dados do Imóvel Enviados com Sucesso!
          </h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Obrigado, <span className="font-semibold">{ownerName}</span>. Recebemos as características do seu imóvel e entraremos em contato para combinar os próximos passos (agendamento de fotos, documentação e estratégia).
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={handleWhatsAppFollowup}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-md transition shadow"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Enviar Fotos pelo WhatsApp Agora</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-lg space-y-8">
          {/* Owner details */}
          <div>
            <h3 className="text-base font-bold text-[#0B2B20] font-editorial mb-4 pb-2 border-b border-gray-100">
              1. Dados do Proprietário
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Seu nome"
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

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                />
              </div>
            </div>
          </div>

          {/* Property essentials */}
          <div>
            <h3 className="text-base font-bold text-[#0B2B20] font-editorial mb-4 pb-2 border-b border-gray-100">
              2. Ficha Essencial do Imóvel
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Finalidade Pretendida
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-[#0B2B20]"
                >
                  <option value="Venda">Venda</option>
                  <option value="Locação">Locação</option>
                  <option value="Venda e Locação">Venda ou Locação</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Tipo de Propriedade
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-[#0B2B20]"
                >
                  <option value="Casa">Casa</option>
                  <option value="Casa Geminada Duplex">Casa Geminada Duplex</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Sítio / Propriedade Rural">Sítio / Propriedade Rural</option>
                  <option value="Terreno / Lote">Terreno / Lote</option>
                  <option value="Comercial">Ponto Comercial / Galpão</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Área Aproximada
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Ex: 150 m² ou 1.800 m²"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Coronel Fabriciano"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Bairro / Região
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Bairro Giovani"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Valor Pretendido (opcional)
                </label>
                <input
                  type="text"
                  value={intendedValue}
                  onChange={(e) => setIntendedValue(e.target.value)}
                  placeholder="Ex: R$ 380.000 ou A avaliar"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Quartos
                </label>
                <input
                  type="text"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  placeholder="Ex: 3 quartos"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Vagas de Garagem
                </label>
                <input
                  type="text"
                  value={garages}
                  onChange={(e) => setGarages(e.target.value)}
                  placeholder="Ex: 1 vaga"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                />
              </div>
            </div>
          </div>

          {/* Description & Features */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Diferenciais, Estado de Conservação e Observações
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhes como reformas recentes, suítes, acabamento, posição solar ou pendências documentais..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3 text-xs text-gray-600">
            <Info className="w-4 h-4 text-[#C8A251] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">Fotografias do Imóvel:</p>
              <p>Após o envio inicial dos dados, você poderá nos enviar as fotos diretamente pelo WhatsApp ou combinamos uma visita presencial para captação do material fotográfico.</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Privacidade garantida conforme a LGPD.</span>
            </div>

            <button
              type="submit"
              className="px-8 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] rounded-md transition shadow-md"
            >
              Enviar Dados do Imóvel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
