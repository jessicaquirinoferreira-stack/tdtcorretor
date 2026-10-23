import React from 'react';
import { MapPin, Maximize2, Bed, Bath, Car, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Property } from '../types';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { WatermarkBadge } from './WatermarkBadge';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const whatsAppUrl = getWhatsAppUrl('imovel', { propertyTitle: property.title });
  const images = Array.isArray(property.images) ? property.images : [];
  const coverImage = property.coverImage || images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
  const location = property.location || { city: 'Coronel Fabriciano', state: 'Minas Gerais' };

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container with aspect ratio */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 cursor-pointer" onClick={() => onSelect(property)}>
        <img
          src={coverImage}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
          }}
        />

        {/* Official TFT Watermark */}
        <WatermarkBadge position="bottom-right" size="sm" opacity="opacity-90" />

        {/* Gradient scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Top Badges (Only interactive/conceptual notes) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
          <span className="px-2.5 py-1 bg-[#0B2B20]/90 text-white font-medium rounded backdrop-blur-sm">
            {property.type}
          </span>

          {property.isConceptual && (
            <span className="px-2.5 py-1 bg-[#C8A251]/95 text-[#0B2B20] font-semibold rounded backdrop-blur-sm flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              Estudo Conceitual
            </span>
          )}
        </div>

        {/* Bottom Price on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <span className="text-xs uppercase tracking-wider text-gray-300 block">Preço</span>
            <span className="text-lg font-bold font-editorial tracking-wide">
              {!property.price || property.price.toLowerCase().includes('consultar') ? 'A consultar' : property.price}
            </span>
          </div>

          <div className="text-xs font-mono text-gray-200">
            {images.length} {images.length === 1 ? 'foto' : 'fotos'}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3
          onClick={() => onSelect(property)}
          className="text-lg font-bold text-[#0B2B20] hover:text-[#C8A251] transition-colors cursor-pointer font-editorial line-clamp-1 mb-1.5"
        >
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3.5">
          <MapPin className="w-3.5 h-3.5 text-[#C8A251] shrink-0" />
          <span className="truncate">
            {location.neighborhood ? `${location.neighborhood}, ` : ''}
            {location.city} - {location.state}
          </span>
        </div>

        {/* Unboxed Metadata Metrics with subtle dot separators */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 mb-4 pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-medium">{property.area}</span>
          </div>

          {property.bedrooms !== undefined && (
            <>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-gray-400" />
                <span>{property.bedrooms} {typeof property.bedrooms === 'number' && property.bedrooms === 1 ? 'quarto' : 'quartos'}</span>
              </div>
            </>
          )}

          {property.bathrooms !== undefined && (
            <>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-gray-400" />
                <span>{property.bathrooms} banh.</span>
              </div>
            </>
          )}

          {property.garages !== undefined && (
            <>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-gray-400" />
                <span>{property.garages} {typeof property.garages === 'number' && property.garages === 1 ? 'vaga' : 'vagas'}</span>
              </div>
            </>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-5 flex-1">
          {property.description}
        </p>

        {/* Actions Button Row */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onSelect(property)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-[#0B2B20] bg-gray-100 hover:bg-[#0B2B20] hover:text-white rounded-md transition-all group/btn"
          >
            <span>Conhecer imóvel</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-md transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
