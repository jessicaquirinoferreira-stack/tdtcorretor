import React, { useState, useMemo } from 'react';
import { Search, Filter, RotateCcw, MessageCircle, SlidersHorizontal } from 'lucide-react';
import { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { getWhatsAppUrl } from '../utils/whatsapp';

interface PropertiesPageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  initialFilters?: Record<string, string>;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  properties,
  onSelectProperty,
  initialFilters,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters?.search || '');
  const [purpose, setPurpose] = useState<string>(initialFilters?.purpose || 'Todas');
  const [propertyType, setPropertyType] = useState<string>(initialFilters?.type || 'Todos');
  const [city, setCity] = useState<string>(initialFilters?.city || 'Todas');
  const [minBedrooms, setMinBedrooms] = useState<string>(initialFilters?.bedrooms || 'Todos');
  const [sortBy, setSortBy] = useState<string>('recentes');

  // Filter logic
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Text search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = prop.title.toLowerCase().includes(query);
        const matchDesc = prop.description.toLowerCase().includes(query);
        const matchCity = prop.location.city.toLowerCase().includes(query);
        const matchType = prop.type.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchCity && !matchType) return false;
      }

      // Purpose
      if (purpose !== 'Todas') {
        if (purpose === 'Venda' && prop.purpose === 'Locação') return false;
        if (purpose === 'Locação' && prop.purpose === 'Venda') return false;
      }

      // Type
      if (propertyType !== 'Todos' && prop.type !== propertyType) {
        return false;
      }

      // City
      if (city !== 'Todas') {
        if (!prop.location.city.toLowerCase().includes(city.toLowerCase())) {
          return false;
        }
      }

      // Bedrooms
      if (minBedrooms !== 'Todos') {
        const min = parseInt(minBedrooms, 10);
        if (typeof prop.bedrooms === 'number' && prop.bedrooms < min) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'nome') return a.title.localeCompare(b.title);
      if (sortBy === 'recentes') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [properties, searchTerm, purpose, propertyType, city, minBedrooms, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setPurpose('Todas');
    setPropertyType('Todos');
    setCity('Todas');
    setMinBedrooms('Todos');
    setSortBy('recentes');
  };

  const isFiltered = searchTerm || purpose !== 'Todas' || propertyType !== 'Todos' || city !== 'Todas' || minBedrooms !== 'Todos';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Bar */}
      <div className="border-b border-gray-200 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block mb-1">
          Catálogo Oficial
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2B20] font-editorial">
          Imóveis Disponíveis
        </h1>
        <p className="text-sm text-gray-600 mt-2 max-w-2xl">
          Consulte nossa seleção de propriedades com informações detalhadas, fotografias reais e atendimento consultivo direto com Thiago Teixeira.
        </p>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm p-5 space-y-4">
        {/* Row 1: Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, bairro, cidade ou características (ex: sítio, duplex, suíte)..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0B2B20] focus:border-transparent"
          />
        </div>

        {/* Row 2: Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Finalidade
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B2B20]"
            >
              <option value="Todas">Todas as finalidades</option>
              <option value="Venda">Comprar (Venda)</option>
              <option value="Locação">Alugar (Locação)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Tipo de Imóvel
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B2B20]"
            >
              <option value="Todos">Todos os tipos</option>
              <option value="Sítio / Propriedade Rural">Sítio / Propriedade Rural</option>
              <option value="Casa Geminada Duplex">Casa Geminada Duplex</option>
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Terreno / Lote">Terreno / Lote</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Cidade
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B2B20]"
            >
              <option value="Todas">Todas as cidades</option>
              <option value="Coronel Fabriciano">Coronel Fabriciano</option>
              <option value="Região Metropolitana">Região Metropolitana / Interior</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Quartos Mínimos
            </label>
            <select
              value={minBedrooms}
              onChange={(e) => setMinBedrooms(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B2B20]"
            >
              <option value="Todos">Qualquer número</option>
              <option value="1">1+ quarto</option>
              <option value="2">2+ quartos</option>
              <option value="3">3+ quartos</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Ordenar Por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B2B20]"
            >
              <option value="recentes">Mais recentes</option>
              <option value="nome">Ordem alfabética</option>
            </select>
          </div>
        </div>

        {/* Action Row: Count and Reset */}
        <div className="flex items-center justify-between pt-2 text-xs border-t border-gray-100">
          <div className="text-gray-600">
            Exibindo <span className="font-bold text-[#0B2B20]">{filteredProperties.length}</span>{' '}
            {filteredProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </div>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0B2B20] font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Properties */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#0B2B20] font-editorial">
            Nenhum imóvel corresponde aos filtros selecionados
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Não encontramos resultados para esta combinação exata. Você pode limpar os filtros ou conversar diretamente com Thiago Teixeira para que façamos uma busca personalizada para você.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 text-xs font-semibold text-[#0B2B20] bg-gray-100 hover:bg-gray-200 rounded-md transition"
            >
              Limpar todos os filtros
            </button>

            <a
              href={getWhatsAppUrl('compra')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-md transition shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Solicitar Busca Personalizada</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
