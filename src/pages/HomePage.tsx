import React, { useState, useEffect } from 'react';
import {
  Search,
  MessageCircle,
  ArrowRight,
  Shield,
  FileCheck,
  CheckCircle2,
  Compass,
  Building,
  KeyRound,
  TrendingUp,
  FileText,
  PhoneCall,
  ChevronRight,
  ChevronLeft,
  Calculator,
  Eye,
  Sparkles,
  MapPin,
  Maximize2,
  Bed,
  Play,
  Pause
} from 'lucide-react';
import { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { getWhatsAppUrl, DISPLAY_PHONE } from '../utils/whatsapp';

interface HomePageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onNavigate: (path: string, filterParams?: Record<string, string>) => void;
}

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  propertyTitle: string;
  location: string;
  badge: string;
  area: string;
  slug: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  properties,
  onSelectProperty,
  onNavigate,
}) => {
  // Search bar states
  const [purpose, setPurpose] = useState<'Todas' | 'Venda' | 'Locação'>('Todas');
  const [propertyType, setPropertyType] = useState<string>('Todos');
  const [city, setCity] = useState<string>('Todas');
  const [minBedrooms, setMinBedrooms] = useState<string>('Todos');

  // Hero Slideshow state
  const heroSlides: HeroSlide[] = [
    {
      id: 'slide-1',
      image: 'https://i.postimg.cc/MTQ3KtWQ/Whats-App-Image-2026-10-20-at-18-24-11.jpg',
      title: 'Casa Geminada Duplex de Alto Padrão',
      propertyTitle: 'Casa Geminada Duplex — Giovani',
      location: 'Coronel Fabriciano · Bairro Giovani',
      badge: 'Destaque Residencial',
      area: '3 Quartos (1 Suíte) · Garagem',
      slug: 'casa-geminada-duplex-giovani',
    },
    {
      id: 'slide-2',
      image: 'https://i.postimg.cc/jjjGKzwv/Whats-App-Image-2026-10-20-at-18-16-56.jpg',
      title: 'Sítio Exclusivo com 1.800 m²',
      propertyTitle: 'Sítio de 1.800 m²',
      location: 'Interior de Minas Gerais · Ampla Área Verde',
      badge: 'Refúgio & Tranquilidade',
      area: '1.800 m² de terreno',
      slug: 'sitio-1800m2',
    },
    {
      id: 'slide-3',
      image: 'https://i.postimg.cc/856XPw1z/Whats-App-Image-2026-10-20-at-18-24-11-(1).jpg',
      title: 'Ambientes Amplos e Iluminação Natural',
      propertyTitle: 'Casa Geminada Duplex — Giovani',
      location: 'Coronel Fabriciano · MG',
      badge: 'Estrutura Contemporânea',
      area: 'Acabamento Primoroso',
      slug: 'casa-geminada-duplex-giovani',
    },
    {
      id: 'slide-4',
      image: 'https://i.postimg.cc/0NNLxpML/Whats-App-Image-2026-10-20-at-18-16-57.jpg',
      title: 'Topografia e Espaço para Lazer e Descanso',
      propertyTitle: 'Sítio de 1.800 m²',
      location: 'Região Nobre de Minas Gerais',
      badge: 'Espaço e Natureza',
      area: 'Potencial Familiar ou Renda',
      slug: 'sitio-1800m2',
    },
    {
      id: 'slide-5',
      image: 'https://i.postimg.cc/vmjSsCd8/Whats-App-Image-2026-10-20-at-18-24-12.jpg',
      title: 'Setorização Inteligente e Conforto Total',
      propertyTitle: 'Casa Geminada Duplex — Giovani',
      location: 'Vale do Aço · MG',
      badge: 'Pronto para Visita',
      area: 'Duplex Exclusivo',
      slug: 'casa-geminada-duplex-giovani',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play slideshow every 5.5 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying, heroSlides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleSlidePropertyClick = (slug: string) => {
    onNavigate(`/imoveis/${slug}`);
  };

  const featuredProperties = properties.filter((p) => p.isFeatured).slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('/imoveis', {
      purpose: purpose !== 'Todas' ? purpose : '',
      type: propertyType !== 'Todos' ? propertyType : '',
      city: city !== 'Todas' ? city : '',
      bedrooms: minBedrooms !== 'Todos' ? minBedrooms : '',
    });
  };

  const activeSlideData = heroSlides[currentSlide];

  return (
    <div className="space-y-20 lg:space-y-28">
      {/* 7.1 HERO COM CARROSSEL AUTOMÁTICO DE FOTOS DOS EMPREENDIMENTOS */}
      <section className="relative min-h-[90vh] lg:min-h-[94vh] flex items-center justify-center bg-[#071C15] overflow-hidden -mt-4">
        {/* Dynamic Photo Background with Crossfade Transition */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover object-center filter brightness-[0.38] transition-transform duration-[7000ms] ease-out ${
                  idx === currentSlide ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          ))}

          {/* Luxury overlays: radial glow + dark gradient mask */}
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#071C15] via-[#071C15]/80 to-transparent" />
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#071C15] via-transparent to-black/40" />
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#C8A251]/10 rounded-full blur-3xl pointer-events-none z-20" />
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={handlePrevSlide}
          className="hidden sm:flex absolute left-4 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-[#C8A251] text-white hover:text-[#0B2B20] border border-white/20 items-center justify-center transition-all backdrop-blur-sm shadow-lg group"
          aria-label="Foto anterior"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={handleNextSlide}
          className="hidden sm:flex absolute right-4 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-[#C8A251] text-white hover:text-[#0B2B20] border border-white/20 items-center justify-center transition-all backdrop-blur-sm shadow-lg group"
          aria-label="Próxima foto"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Hero Content Grid */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-white w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headline and CTAs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Clean unboxed kicker with live animated dot */}
              <div className="flex items-center gap-2.5 text-xs uppercase tracking-widest text-[#C8A251] font-semibold">
                <span className="inline-block w-2 h-2 rounded-full bg-[#C8A251] animate-ping" />
                <span>TFT Corretor Imobiliário</span>
                <span aria-hidden="true">·</span>
                <span>Thiago Teixeira</span>
                <span aria-hidden="true">·</span>
                <span>Minas Gerais</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] font-editorial text-balance">
                Seu próximo endereço começa com uma boa escolha.
              </h1>

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl font-light">
                Comprar, vender ou alugar um imóvel merece atenção aos detalhes. Conte com atendimento personalizado, transparência e acompanhamento em cada etapa.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('/imoveis')}
                  className="px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-[#0B2B20] bg-[#C8A251] hover:bg-[#D4AF37] rounded-md transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  Encontrar meu imóvel
                </button>

                <button
                  onClick={() => onNavigate('/vender')}
                  className="px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-transparent hover:bg-white/10 border border-white/40 rounded-md transition-all active:scale-95"
                >
                  Quero vender meu imóvel
                </button>

                <a
                  href={getWhatsAppUrl('geral')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-md transition-all shadow-md active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Falar com Thiago</span>
                </a>
              </div>

              {/* Trust quote */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-300">
                <span className="italic text-[#E2C481]">
                  “Um bom negócio começa com informação clara e termina com confiança.”
                </span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-300">Atendimento Consultivo Direto</span>
              </div>
            </div>

            {/* Right Column: Glassmorphic Active Property Spotlight Card (5 cols) */}
            <div className="lg:col-span-5">
              <div
                onClick={() => handleSlidePropertyClick(activeSlideData.slug)}
                className="group cursor-pointer rounded-2xl bg-black/40 hover:bg-black/60 border border-white/20 p-6 backdrop-blur-md shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-1 rounded bg-[#C8A251] text-[#0B2B20] font-bold text-[10px] uppercase tracking-wider">
                    {activeSlideData.badge}
                  </span>
                  <span className="text-gray-300 text-[11px] font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C8A251]" />
                    Empreendimento em Destaque
                  </span>
                </div>

                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 border border-white/10">
                  <img
                    src={activeSlideData.image}
                    alt={activeSlideData.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs text-[#C8A251] font-semibold">{activeSlideData.location}</p>
                    <h4 className="text-base font-bold font-editorial line-clamp-1">{activeSlideData.propertyTitle}</h4>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Diferenciais</span>
                    <span className="text-xs font-semibold text-white">{activeSlideData.area}</span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8A251] group-hover:text-white transition">
                    <span>Conhecer detalhes</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Slideshow Controls & Progress Bars */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition text-xs flex items-center gap-1"
                title={isPlaying ? 'Pausar passagem automática' : 'Iniciar passagem automática'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <span className="text-xs text-gray-300">
                Imóvel {currentSlide + 1} de {heroSlides.length}: <strong className="text-white">{activeSlideData.propertyTitle}</strong>
              </span>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center gap-2">
              {heroSlides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? 'w-8 bg-[#C8A251]'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7.2 Busca de Imóveis (Search Filter Bar com elevação premium) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/90 p-6 lg:p-8 backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0B2B20] font-editorial flex items-center gap-2">
              <Search className="w-5 h-5 text-[#C8A251]" />
              <span>Buscar Imóveis Disponíveis</span>
            </h2>
            <span className="text-xs text-gray-500 hidden sm:inline">
              Filtros integrados ao catálogo em tempo real
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Finalidade */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Finalidade
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2B20] text-gray-800"
              >
                <option value="Todas">Todas as finalidades</option>
                <option value="Venda">Comprar (Venda)</option>
                <option value="Locação">Alugar (Locação)</option>
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Tipo de Imóvel
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2B20] text-gray-800"
              >
                <option value="Todos">Todos os tipos</option>
                <option value="Casa Geminada Duplex">Casa Geminada Duplex</option>
                <option value="Sítio / Propriedade Rural">Sítio / Rural</option>
                <option value="Casa">Casa Unifamiliar</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Terreno / Lote">Terreno / Lote</option>
              </select>
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Cidade / Região
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2B20] text-gray-800"
              >
                <option value="Todas">Todas as cidades</option>
                <option value="Coronel Fabriciano">Coronel Fabriciano</option>
                <option value="Região Metropolitana">Região Metropolitana / Interior</option>
                <option value="Minas Gerais">Minas Gerais (Geral)</option>
              </select>
            </div>

            {/* Quartos */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Quartos
              </label>
              <select
                value={minBedrooms}
                onChange={(e) => setMinBedrooms(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2B20] text-gray-800"
              >
                <option value="Todos">Qualquer quantidade</option>
                <option value="2">2+ quartos</option>
                <option value="3">3+ quartos</option>
                <option value="4">4+ quartos</option>
              </select>
            </div>

            {/* Botão Buscar */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs uppercase tracking-wider font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] rounded-lg transition-colors flex items-center justify-center gap-2 h-[42px] shadow-sm active:scale-98"
              >
                <Search className="w-4 h-4" />
                <span>Encontrar Imóveis</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 7.3 Imóveis em Destaque */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block mb-2">
              Oportunidades Selecionadas
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2B20] font-editorial text-balance">
              Imóveis que podem ser o começo de uma nova história.
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/imoveis')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B2B20] hover:text-[#C8A251] transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <span>Ver todos os imóveis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      </section>

      {/* 7.4 Apresentação do Corretor (Thiago Teixeira) - Conteúdo Fiel ao PDF */}
      <section className="bg-[#0B2B20] text-white py-20 relative overflow-hidden">
        {/* Subtle geometric line accents inspired by architecture */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#0D3628] to-transparent opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column / Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-[#C8A251]/40 shadow-2xl bg-[#082119] group">
                <img
                  src="https://i.postimg.cc/MTQ3KtWQ/Whats-App-Image-2026-10-20-at-18-24-11.jpg"
                  alt="Thiago Teixeira - TFT Corretor Imobiliário"
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="p-6 bg-[#071C15]/95">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#153D2F] flex items-center justify-center text-[#C8A251] font-bold">
                      TT
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-editorial">
                        Thiago Teixeira
                      </h4>
                      <p className="text-xs text-[#C8A251]">
                        Corretor Imobiliário · Minas Gerais
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mt-3 italic">
                    “Negócios imobiliários com clareza, presença e confiança.”
                  </p>
                </div>
              </div>
            </div>

            {/* Editorial Text Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
                01 · Apresentação & Compromisso
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-editorial text-balance">
                Mais do que encontrar imóveis, ajudar você a fazer boas escolhas.
              </h2>

              <p className="text-base text-gray-300 leading-relaxed font-light">
                Sou Thiago Teixeira, corretor de imóveis. Meu trabalho é transformar um processo que pode parecer complexo em uma jornada mais organizada, objetiva e segura.
              </p>

              <p className="text-base text-gray-300 leading-relaxed font-light">
                Antes de falar de metragem, preço ou contrato, procuro entender o que realmente importa para cada cliente: prazo, objetivo, orçamento, localização e prioridades.
              </p>

              {/* 3 Pillars from PDF Page 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-[#0F3528] border border-[#1A4535] hover:border-[#C8A251]/60 transition-colors">
                  <span className="text-xs font-bold text-[#C8A251] block mb-1">A · Atendimento</span>
                  <p className="text-xs text-gray-300 leading-snug">
                    Escuta ativa para compreender sua necessidade e conduzir a busca ou comercialização.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0F3528] border border-[#1A4535] hover:border-[#C8A251]/60 transition-colors">
                  <span className="text-xs font-bold text-[#C8A251] block mb-1">T · Transparência</span>
                  <p className="text-xs text-gray-300 leading-snug">
                    Informações objetivas sobre imóvel, proposta, documentos, prazos e próximos passos.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0F3528] border border-[#1A4535] hover:border-[#C8A251]/60 transition-colors">
                  <span className="text-xs font-bold text-[#C8A251] block mb-1">C · Acompanhamento</span>
                  <p className="text-xs text-gray-300 leading-snug">
                    Presença nas principais etapas, do primeiro contato até a conclusão da negociação.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('/sobre')}
                  className="px-6 py-3 text-xs uppercase tracking-wider font-semibold text-[#0B2B20] bg-[#C8A251] hover:bg-[#D4AF37] rounded-md transition-colors"
                >
                  Conheça meu trabalho
                </button>
                <a
                  href={getWhatsAppUrl('geral')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-gray-200 hover:text-white flex items-center gap-1.5"
                >
                  <span>Iniciar conversa direta</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7.5 Soluções & Serviços Imobiliários (Baseado no PDF) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block mb-2">
            03 · Soluções Imobiliárias
          </span>
          <h2 className="text-3xl font-bold text-[#0B2B20] font-editorial mb-3">
            Como posso ajudar você.
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Serviços para diferentes momentos da jornada imobiliária, sempre com foco em comunicação clara e acompanhamento profissional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Compra de Imóveis',
              desc: 'Busca, seleção e visitas a imóveis compatíveis com localização, perfil e orçamento.',
              icon: Building,
              path: '/comprar',
              cta: 'Quero comprar',
            },
            {
              title: 'Venda de Imóveis',
              desc: 'Posicionamento, apresentação, divulgação, visitas e intermediação de propostas.',
              icon: KeyRound,
              path: '/vender',
              cta: 'Quero vender',
            },
            {
              title: 'Locação Estruturada',
              desc: 'Apoio na apresentação do imóvel, visitas, negociação e organização das etapas para locadores e locatários.',
              icon: Compass,
              path: '/alugar',
              cta: 'Ver locações',
            },
            {
              title: 'Captação Qualificada',
              desc: 'Levantamento detalhado das características do imóvel para preparar uma oferta completa ao mercado.',
              icon: FileCheck,
              path: '/anunciar-imovel',
              cta: 'Anunciar imóvel',
            },
            {
              title: 'Análise de Mercado',
              desc: 'Referências de imóveis comparáveis para apoiar uma estratégia de preço coerente e assertiva.',
              icon: TrendingUp,
              path: '/servicos',
              cta: 'Consultar análise',
            },
            {
              title: 'Orientação de Financiamento',
              desc: 'Apoio nas etapas de simulação bancária, alinhamento de prazos e organização documental da negociação.',
              icon: Calculator,
              path: '/financiamento',
              cta: 'Simuladores oficiais',
            },
          ].map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white rounded-xl border border-gray-200/80 hover:border-[#C8A251]/60 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between transform hover:-translate-y-1"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#0B2B20]/5 text-[#0B2B20] flex items-center justify-center mb-4 group-hover:bg-[#0B2B20] group-hover:text-[#C8A251] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0B2B20] font-editorial mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate(service.path)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2B20] group-hover:text-[#C8A251] transition-colors pt-2 border-t border-gray-100"
                >
                  <span>{service.cta}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7.6 & 7.7 Seções Duplas: Compradores e Proprietários */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Comprador */}
          <div className="bg-gradient-to-br from-[#0B2B20] to-[#133F30] rounded-2xl p-8 lg:p-10 text-white flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
                Para quem deseja comprar
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-editorial leading-tight">
                O imóvel certo começa com uma busca bem orientada.
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed font-light">
                Menos visitas aleatórias, mais opções alinhadas. O atendimento considera suas necessidades reais, localização desejada, perfil da família e orçamento planejado.
              </p>
              <ul className="space-y-2 text-xs text-gray-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A251] shrink-0" />
                  <span>Diagnóstico personalizado de perfil e prioridades</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A251] shrink-0" />
                  <span>Curadoria criteriosa de opções compatíveis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C8A251] shrink-0" />
                  <span>Acompanhamento em visitas e formalização de propostas</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onNavigate('/comprar')}
                className="w-full sm:w-auto px-6 py-3 text-xs uppercase tracking-wider font-semibold text-[#0B2B20] bg-[#C8A251] hover:bg-[#D4AF37] rounded-md transition-all shadow-md"
              >
                Quero encontrar meu imóvel
              </button>
            </div>
          </div>

          {/* Card Proprietário */}
          <div className="bg-white rounded-2xl p-8 lg:p-10 border border-gray-200 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0B2B20] block">
                Para quem deseja vender ou alugar
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-[#0B2B20] leading-tight">
                Seu imóvel merece ser apresentado da melhor forma.
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Vender bem exige estratégia, não apenas anúncio. Organização das informações, boa comunicação visual, divulgação qualificada e condução segura da negociação.
              </p>
              <ul className="space-y-2 text-xs text-gray-600 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0B2B20] shrink-0" />
                  <span>Posicionamento de preço coerente com referências reais</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0B2B20] shrink-0" />
                  <span>Divulgação e apresentação com clareza visual</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0B2B20] shrink-0" />
                  <span>Filtragem de interessados e acompanhamento das visitas</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => onNavigate('/anunciar-imovel')}
                className="w-full sm:w-auto px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] rounded-md transition-all shadow-md"
              >
                Quero anunciar meu imóvel
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7.8 Como Funciona o Atendimento (4 Etapas do PDF) */}
      <section className="bg-gray-100/70 py-20 border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block mb-2">
              02 · Minha Forma de Trabalhar
            </span>
            <h2 className="text-3xl font-bold text-[#0B2B20] font-editorial mb-3">
              Profissionalismo que começa antes da visita.
            </h2>
            <p className="text-sm text-gray-600">
              Cada cliente tem uma realidade diferente. Por isso, o atendimento precisa ser consultivo, organizado e adequado ao momento de decisão.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Escutar',
                desc: 'Entender o motivo da compra, venda ou locação, o prazo disponível e as prioridades que não podem ser negociadas.',
              },
              {
                step: '02',
                title: 'Organizar',
                desc: 'Reunir informações, documentação, referências de mercado e opções coerentes com o perfil do cliente.',
              },
              {
                step: '03',
                title: 'Conduzir',
                desc: 'Facilitar visitas, propostas, contrapropostas e a comunicação entre as partes com objetividade.',
              },
              {
                step: '04',
                title: 'Acompanhar',
                desc: 'Manter o cliente informado até a formalização do negócio e a entrega das chaves.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm relative group hover:border-[#C8A251] transition-colors"
              >
                <div className="text-2xl font-bold font-editorial text-[#C8A251] mb-3">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-[#0B2B20] font-editorial mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Triad from PDF: Ética, Agilidade, Presença */}
          <div className="mt-10 p-6 bg-white rounded-xl border border-gray-200 flex flex-col md:flex-row items-center justify-around gap-6 text-center md:text-left">
            <div>
              <span className="text-xs font-bold text-[#0B2B20] block">Ética</span>
              <span className="text-xs text-gray-500">Respeito às partes e às responsabilidades do negócio.</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200" />
            <div>
              <span className="text-xs font-bold text-[#0B2B20] block">Agilidade</span>
              <span className="text-xs text-gray-500">Respostas objetivas e organização dos próximos passos.</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-200" />
            <div>
              <span className="text-xs font-bold text-[#0B2B20] block">Presença</span>
              <span className="text-xs text-gray-500">Acompanhamento humano em decisões importantes.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7.9 Financiamento Imobiliário Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B2B20] rounded-2xl p-8 lg:p-12 text-white relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
              13 · Compra Financiada
            </span>
            <h2 className="text-3xl font-bold font-editorial">
              Planeje sua compra com mais informação.
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              Consulte os canais oficiais das principais instituições financeiras para conhecer as possibilidades de financiamento imobiliário e planejar seu investimento com clareza.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/financiamento')}
                className="px-6 py-3 text-xs uppercase tracking-wider font-semibold text-[#0B2B20] bg-[#C8A251] hover:bg-[#D4AF37] rounded-md transition-colors shadow-md"
              >
                Conhecer os simuladores
              </button>
              <a
                href={getWhatsAppUrl('financiamento')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-200 hover:text-white"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Tirar dúvidas com Thiago</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7.10 CTA Final */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center max-w-3xl mx-auto space-y-6 p-8 lg:p-14 bg-white rounded-2xl border border-gray-200 shadow-xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
            19 · Vamos Conversar?
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#0B2B20] font-editorial text-balance">
            Seu próximo capítulo pode começar com uma conversa.
          </h2>

          <p className="text-base text-gray-600 leading-relaxed max-w-xl mx-auto">
            Conte o que você procura. Vamos conversar sobre as possibilidades com discrição, clareza e dedicação total.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate('/imoveis')}
              className="px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] rounded-md transition-colors shadow-sm"
            >
              Encontrar imóvel
            </button>

            <button
              onClick={() => onNavigate('/anunciar-imovel')}
              className="px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-[#0B2B20] bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Anunciar imóvel
            </button>

            <a
              href={getWhatsAppUrl('geral')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-md transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Falar pelo WhatsApp</span>
            </a>
          </div>

          <p className="text-xs text-gray-400 pt-2">
            Telefone direto: {DISPLAY_PHONE} · Atendimento em Minas Gerais
          </p>
        </div>
      </section>
    </div>
  );
};
