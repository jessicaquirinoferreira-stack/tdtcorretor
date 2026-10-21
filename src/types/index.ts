export type PropertyType = 
  | 'Casa'
  | 'Casa Geminada'
  | 'Casa Geminada Duplex'
  | 'Apartamento'
  | 'Cobertura'
  | 'Sítio / Propriedade Rural'
  | 'Terreno / Lote'
  | 'Comercial'
  | 'Outro';

export type PropertyPurpose = 'Venda' | 'Locação' | 'Venda e Locação';

export interface Property {
  id: string;
  slug: string;
  title: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  price: string; // e.g. "Valor a consultar" or formatted price
  priceValue?: number; // for numeric filtering if available
  location: {
    city: string;
    state: string;
    neighborhood?: string;
    address?: string;
    isApproximate?: boolean;
  };
  area: string; // e.g. "1.800 m²" or "140 m²"
  bedrooms?: number | string;
  suites?: number | string;
  bathrooms?: number | string;
  garages?: number | string;
  features: string[];
  description: string;
  images: string[];
  coverImage: string;
  isFeatured?: boolean;
  isConceptual?: boolean; // For portfolio architectural conceptual studies (PDF pages 21-23)
  createdAt: string;
  status: 'published' | 'draft' | 'archived';
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  type: 'compra' | 'venda' | 'locacao' | 'visita' | 'anuncio' | 'financiamento' | 'geral';
  message?: string;
  preferredContact: 'whatsapp' | 'email' | 'telefone';
  createdAt: string;
  status: 'novo' | 'em_atendimento' | 'concluido';
  propertyDetails?: {
    type?: string;
    city?: string;
    budget?: string;
  };
}

export interface BankSimulator {
  id: string;
  bankName: string;
  logoUrl?: string;
  accentColor: string;
  description: string;
  officialUrl: string;
  badge?: string;
}

export interface LandingPageData {
  id: string;
  slug: string;
  propertyId: string;
  headline: string;
  subheadline: string;
  customBenefits: string[];
  published: boolean;
  createdAt: string;
}

export interface SiteConfig {
  brokerName: string;
  brandName: string;
  slogan: string;
  email: string;
  phoneDisplay: string;
  whatsappNumber: string;
  instagramUrl: string;
  cityState: string;
  vercelBlobToken?: string;
  watermarkLogoUrl?: string;
}
