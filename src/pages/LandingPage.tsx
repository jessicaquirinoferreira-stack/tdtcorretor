import React, { useState } from 'react';
import {
  MessageCircle,
  Calendar,
  Share2,
  Check,
  CheckCircle2,
  MapPin,
  Maximize2,
  Bed,
  Bath,
  Car,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Property, LandingPageData } from '../types';
import { getWhatsAppUrl, DISPLAY_PHONE } from '../utils/whatsapp';
import { saveLead } from '../lib/storage';

interface LandingPageProps {
  landing: LandingPageData;
  property: Property;
  onNavigateHome: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  landing,
  property,
  onNavigateHome,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const images = property.images && property.images.length > 0
    ? property.images
    : [property.coverImage];

  const whatsAppUrl = getWhatsAppUrl('imovel', { propertyTitle: property.title });

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    saveLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      type: 'visita',
      propertyId: property.id,
      propertyTitle: property.title,
      preferredContact: 'whatsapp',
      message: `Lead via Landing Page "${landing.headline}".`,
    });

    setSubmitted(true);
  };

  const handleWhatsAppRedirect = () => {
    const text = `Olá, Thiago! Acessei a página exclusiva de "${property.title}" e gostaria de mais informações e agendar visita.`;
    const url = getWhatsAppUrl('geral', { customText: text });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#1A2621]">
      {/* Exclusive Top Announcement Bar */}
      <div className="bg-[#071C15] text-[#C8A251] text-xs py-2 px-4 text-center border-b border-[#153D2F]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="hover:underline flex items-center gap-1 text-gray-300 hover:text-white"
          >
            ← Voltar ao site principal da TFT
          </button>
          <span className="font-semibold uppercase tracking-wider hidden sm:inline">
            Oportunidade Selecionada · Atendimento Direto
          </span>
          <button
            onClick={handleCopy}
            className="text-gray-300 hover:text-white flex items-center gap-1"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copiado!' : 'Compartilhar'}</span>
          </button>
        </div>
      </div>

      {/* Hero with High-Impact Background and Direct Form */}
      <div className="relative bg-[#071C15] text-white overflow-hidden py-16 lg:py-24">
        {/* Background Image Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={property.coverImage || images[0]}
            alt={property.title}
            className="w-full h-full object-cover filter brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071C15] via-[#071C15]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C8A251] font-semibold">
                <span>{property.type}</span>
                <span>·</span>
                <span>{property.location.city} - {property.location.state}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-white leading-tight">
                {landing.headline || property.title}
              </h1>

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light">
                {landing.subheadline || property.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-300 pt-2">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Maximize2 className="w-4 h-4 text-[#C8A251]" />
                  <span>{property.area}</span>
                </div>
                {property.bedrooms !== undefined && (
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Bed className="w-4 h-4 text-[#C8A251]" />
                    <span>{property.bedrooms} Quartos</span>
                  </div>
                )}
                {property.garages !== undefined && (
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Car className="w-4 h-4 text-[#C8A251]" />
                    <span>{property.garages} Vaga(s)</span>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-lg transition shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Falar Agora no WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Fast Lead Capture Form (5 cols) */}
            <div className="lg:col-span-5 bg-white text-gray-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-100">
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-bold text-[#0B2B20] font-editorial">
                    Solicitação Recebida!
                  </h3>
                  <p className="text-xs text-gray-600">
                    Obrigado, {name}. Thiago Teixeira entrará em contato para passar as informações e verificar a disponibilidade.
                  </p>
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="w-full py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-md transition shadow"
                  >
                    Conversar com Thiago Agora
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#C8A251] block">
                      Agende sua visita com exclusividade
                    </span>
                    <h3 className="text-lg font-bold text-[#0B2B20] font-editorial">
                      Receber Atendimento Prioritário
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome completo"
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
                      E-mail (opcional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] rounded-md transition shadow-md"
                  >
                    Quero Conhecer Este Imóvel
                  </button>

                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Seus dados são 100% confidenciais e protegidos pela LGPD.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
            Fotografias do Imóvel
          </span>
          <h2 className="text-3xl font-bold text-[#0B2B20] font-editorial">
            Conheça Cada Detalhe
          </h2>
          <p className="text-xs text-gray-600">
            Apresentação visual completa e sem distorções para que você perceba o potencial do imóvel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200"
            >
              <img
                src={img}
                alt={`${property.title} - Foto ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Benefits / Diferenciais */}
      {landing.customBenefits && landing.customBenefits.length > 0 && (
        <div className="bg-white py-16 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2B20] font-editorial text-center">
              Diferenciais em Destaque
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {landing.customBenefits.map((ben, idx) => (
                <div key={idx} className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C8A251]" />
                  <p className="text-xs font-semibold text-gray-800 leading-snug">{ben}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA for the Landing Page */}
      <div className="bg-[#0B2B20] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold font-editorial">
            Pronto para dar o próximo passo?
          </h2>
          <p className="text-sm text-gray-300 max-w-xl mx-auto">
            Fale diretamente com Thiago Teixeira para tirar dúvidas, consultar a localização detalhada e agendar sua visita ao imóvel.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-md transition shadow"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chamar no WhatsApp ({DISPLAY_PHONE})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
