import React, { useState } from 'react';
import {
  MapPin,
  Maximize2,
  Bed,
  Bath,
  Car,
  MessageCircle,
  Calendar,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { Property } from '../types';
import { getWhatsAppUrl, DISPLAY_PHONE } from '../utils/whatsapp';
import { LeadModal } from '../components/LeadModal';
import { PropertyCard } from '../components/PropertyCard';

interface PropertyDetailPageProps {
  property: Property;
  allProperties: Property[];
  onSelectProperty: (property: Property) => void;
  onBack: () => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  property,
  allProperties,
  onSelectProperty,
  onBack,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const images = property.images && property.images.length > 0
    ? property.images
    : [property.coverImage];

  const whatsAppInquiryUrl = getWhatsAppUrl('imovel', { propertyTitle: property.title });
  const whatsAppScheduleUrl = getWhatsAppUrl('agendamento', { propertyTitle: property.title });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Related properties (excluding current)
  const relatedProperties = allProperties
    .filter((p) => p.id !== property.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Navigation breadcrumb bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-[#0B2B20] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao catálogo</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition shadow-xs"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Link Copiado!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-gray-500" />
              <span>Compartilhar</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Gallery & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Gallery & Description (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Photo Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] bg-gray-900 rounded-2xl overflow-hidden shadow-lg group">
              <img
                src={images[activeImageIndex]}
                alt={`${property.title} - Foto ${activeImageIndex + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-opacity duration-300 cursor-pointer"
                onClick={() => setLightboxOpen(true)}
              />

              {/* Prev/Next overlay controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition opacity-0 group-hover:opacity-100"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition opacity-0 group-hover:opacity-100"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Zoom prompt badge */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 px-3 py-1.5 text-[11px] font-medium bg-black/70 hover:bg-black/90 text-white rounded-md backdrop-blur-sm transition flex items-center gap-1.5"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Ampliar {activeImageIndex + 1} de {images.length}</span>
              </button>
            </div>

            {/* Thumbnails row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 sm:w-24 aspect-[16/10] rounded-lg overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-[#C8A251] shadow-md scale-95'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Core Details Header */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#C8A251] bg-[#0B2B20] px-3 py-1 rounded">
                {property.type}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded">
                {property.purpose}
              </span>
              {property.isConceptual && (
                <span className="text-xs font-semibold text-[#0B2B20] bg-[#C8A251]/20 px-3 py-1 rounded flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Estudo Conceitual
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2B20] font-editorial leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-[#C8A251] shrink-0" />
              <span>
                {property.location.neighborhood ? `${property.location.neighborhood}, ` : ''}
                {property.location.city} - {property.location.state}
                {property.location.isApproximate && ' (Localização detalhada mediante consulta)'}
              </span>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-xl border border-gray-200">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider block">Área</span>
              <div className="flex items-center gap-1.5 mt-1 text-base font-bold text-[#0B2B20]">
                <Maximize2 className="w-4 h-4 text-[#C8A251]" />
                <span>{property.area}</span>
              </div>
            </div>

            {property.bedrooms !== undefined && (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider block">Quartos</span>
                <div className="flex items-center gap-1.5 mt-1 text-base font-bold text-[#0B2B20]">
                  <Bed className="w-4 h-4 text-[#C8A251]" />
                  <span>{property.bedrooms} {property.suites ? `(${property.suites} suíte)` : ''}</span>
                </div>
              </div>
            )}

            {property.bathrooms !== undefined && (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider block">Banheiros</span>
                <div className="flex items-center gap-1.5 mt-1 text-base font-bold text-[#0B2B20]">
                  <Bath className="w-4 h-4 text-[#C8A251]" />
                  <span>{property.bathrooms}</span>
                </div>
              </div>
            )}

            {property.garages !== undefined && (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider block">Garagem</span>
                <div className="flex items-center gap-1.5 mt-1 text-base font-bold text-[#0B2B20]">
                  <Car className="w-4 h-4 text-[#C8A251]" />
                  <span>{property.garages}</span>
                </div>
              </div>
            )}
          </div>

          {/* Full Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#0B2B20] font-editorial border-b border-gray-200 pb-2">
              Descrição do Imóvel
            </h2>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line space-y-3">
              <p>{property.description}</p>
            </div>
          </div>

          {/* Features Checklist */}
          {property.features && property.features.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#0B2B20] font-editorial border-b border-gray-200 pb-2">
                Diferenciais & Características
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal / Conceptual Note */}
          {property.isConceptual && (
            <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
              <strong className="block font-semibold mb-1">Estudo Conceitual | Imagem Ilustrativa</strong>
              Este item faz parte do portfólio conceitual de apresentação do corretor (conforme estudos gráficos 2D do documento oficial). Não representa planta aprovada, levantamento técnico definitivo ou garantia de metragem técnica.
            </div>
          )}
        </div>

        {/* Right Column: Sticky Contact & Schedule Card (4 cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 p-6 shadow-xl space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold block">
                Valor Previsto
              </span>
              <div className="text-2xl font-bold text-[#0B2B20] font-editorial mt-1">
                {property.price || 'Valor a consultar'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Condições de negociação, formas de pagamento e permuta sob consulta direta.
              </p>
            </div>

            {/* Broker profile snippet */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#0B2B20] text-[#C8A251] font-bold flex items-center justify-center shrink-0">
                TT
              </div>
              <div>
                <p className="text-sm font-bold text-[#0B2B20]">Thiago Teixeira</p>
                <p className="text-xs text-gray-500">TFT Corretor Imobiliário</p>
                <p className="text-xs text-emerald-700 font-medium">{DISPLAY_PHONE}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <a
                href={whatsAppInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 text-xs uppercase tracking-wider font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Consultar pelo WhatsApp</span>
              </a>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 px-4 text-xs uppercase tracking-wider font-semibold text-[#0B2B20] bg-gray-100 hover:bg-[#0B2B20] hover:text-white rounded-lg transition flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Visita ao Imóvel</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Acompanhamento direto e transparente</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#C8A251] shrink-0" />
                <span>Apoio em documentação e financiamento</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Properties */}
      {relatedProperties.length > 0 && (
        <div className="pt-12 border-t border-gray-200 space-y-6">
          <h2 className="text-2xl font-bold text-[#0B2B20] font-editorial">
            Outras Opções Selecionadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={(p) => {
                  onSelectProperty(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 backdrop-blur-md animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="w-full max-w-7xl flex items-center justify-between text-white py-2">
            <span className="text-sm font-medium">
              Foto {activeImageIndex + 1} de {images.length} · {property.title}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 text-gray-300 hover:text-white transition"
              aria-label="Fechar galeria ampliada"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Active Image */}
          <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-auto">
            <img
              src={images[activeImageIndex]}
              alt={`Foto ${activeImageIndex + 1}`}
              referrerPolicy="no-referrer"
              className="max-h-[82vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm"
                  aria-label="Próxima"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="w-full max-w-3xl flex items-center justify-center gap-2 overflow-x-auto py-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-14 h-10 rounded overflow-hidden shrink-0 border-2 transition ${
                  activeImageIndex === idx ? 'border-[#C8A251] scale-105' : 'border-transparent opacity-50'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumb ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lead/Schedule Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={property}
        type="visita"
      />
    </div>
  );
};
