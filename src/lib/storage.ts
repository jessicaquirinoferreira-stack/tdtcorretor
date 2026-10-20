import { Property, Lead, LandingPageData, SiteConfig } from '../types';
import { INITIAL_PROPERTIES } from '../data/initialProperties';
import { BROKER_EMAIL, DEFAULT_WHATSAPP_NUMBER, DISPLAY_PHONE, INSTAGRAM_URL } from '../utils/whatsapp';
import { db, handleFirestoreError, OperationType } from './firebase';
import { doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

const STORAGE_KEYS = {
  PROPERTIES: 'tft_properties_v1',
  LEADS: 'tft_leads_v1',
  LANDING_PAGES: 'tft_landings_v1',
  CONFIG: 'tft_config_v1',
  ADMIN_AUTH: 'tft_admin_auth_v1',
  ADMIN_PWD: 'tft_admin_pwd_v1',
};

const DEFAULT_CONFIG: SiteConfig = {
  brokerName: 'Thiago Teixeira',
  brandName: 'TFT Corretor Imobiliário',
  slogan: 'Seu sonho, meu compromisso.',
  email: BROKER_EMAIL,
  phoneDisplay: DISPLAY_PHONE,
  whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
  instagramUrl: INSTAGRAM_URL,
  cityState: 'Minas Gerais',
};

// Properties
export function getProperties(): Property[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    if (!raw) {
      saveProperties(INITIAL_PROPERTIES);
      return INITIAL_PROPERTIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PROPERTIES;
  } catch {
    return INITIAL_PROPERTIES;
  }
}

export function saveProperties(props: Property[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(props));
  } catch (e) {
    console.error('Failed to save properties to localStorage', e);
  }
}

export function getPropertyBySlug(slug: string): Property | undefined {
  const props = getProperties();
  return props.find(p => p.slug === slug || p.id === slug);
}

export function addProperty(property: Omit<Property, 'id' | 'createdAt'>): Property {
  const props = getProperties();
  const newProp: Property = {
    ...property,
    id: `prop-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newProp, ...props];
  saveProperties(updated);

  // Sync to Firestore
  try {
    setDoc(doc(db, 'properties', newProp.id), newProp).catch((err) => {
      console.warn('Firestore write warning:', err);
    });
  } catch (e) {
    console.warn('Firestore sync failed', e);
  }

  return newProp;
}

export function updateProperty(id: string, updates: Partial<Property>): Property | null {
  const props = getProperties();
  const index = props.findIndex(p => p.id === id);
  if (index === -1) return null;
  props[index] = { ...props[index], ...updates };
  saveProperties(props);

  // Sync to Firestore
  try {
    setDoc(doc(db, 'properties', id), props[index], { merge: true }).catch((err) => {
      console.warn('Firestore update warning:', err);
    });
  } catch (e) {
    console.warn('Firestore sync failed', e);
  }

  return props[index];
}

export function deleteProperty(id: string): boolean {
  const props = getProperties();
  const filtered = props.filter(p => p.id !== id);
  if (filtered.length === props.length) return false;
  saveProperties(filtered);

  // Delete from Firestore
  try {
    deleteDoc(doc(db, 'properties', id)).catch((err) => {
      console.warn('Firestore delete warning:', err);
    });
  } catch (e) {
    console.warn('Firestore delete failed', e);
  }

  return true;
}

// Leads
export function getLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead {
  const leads = getLeads();
  const newLead: Lead = {
    ...leadData,
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'novo',
  };
  const updated = [newLead, ...leads];
  try {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save lead', e);
  }

  // Push to Cloud Firestore
  try {
    setDoc(doc(db, 'leads', newLead.id), newLead).catch((error) => {
      handleFirestoreError(error, OperationType.CREATE, `leads/${newLead.id}`);
    });
  } catch (err) {
    console.warn('Firestore lead submission warning:', err);
  }

  return newLead;
}

export function updateLeadStatus(id: string, status: Lead['status']): void {
  const leads = getLeads();
  const updated = leads.map(l => l.id === id ? { ...l, status } : l);
  localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));

  // Sync to Firestore
  try {
    setDoc(doc(db, 'leads', id), { status }, { merge: true }).catch((err) => {
      console.warn('Firestore lead status sync warning:', err);
    });
  } catch (e) {
    console.warn('Firestore sync warning', e);
  }
}

// Landing Pages
export function getLandingPages(): LandingPageData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LANDING_PAGES);
    if (!raw) {
      const defaultLandings: LandingPageData[] = [
        {
          id: 'land-sitio-1800m2',
          slug: 'sitio-1800m2',
          propertyId: 'prop-sitio-1800m2',
          headline: 'Oportunidade Exclusiva: Sítio de 1.800 m²',
          subheadline: 'Seu refúgio natural com ampla área, privacidade e tranquilidade garantida no interior de Minas Gerais.',
          customBenefits: [
            '1.800 m² de terreno com topografia favorável',
            'Espaço generoso para convívio com a família e amigos',
            'Atendimento direto e assessoria do corretor Thiago Teixeira',
            'Facilidade para agendamento de visita no local'
          ],
          published: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'land-casa-geminada',
          slug: 'casa-geminada-giovani',
          propertyId: 'prop-casa-geminada-giovani',
          headline: 'More com Conforto no Bairro Giovani — Coronel Fabriciano',
          subheadline: 'Casa Geminada Duplex com 3 quartos (1 suíte), acabamento primoroso e garagem privativa.',
          customBenefits: [
            'Localização privilegiada na região do Giovani em Coronel Fabriciano',
            '3 quartos amplos com suíte privativa e iluminação natural',
            'Garagem e espaços integrados para seu dia a dia',
            'Pronto para você e sua família visitarem com exclusividade'
          ],
          published: true,
          createdAt: new Date().toISOString(),
        }
      ];
      saveLandingPages(defaultLandings);
      return defaultLandings;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLandingPages(pages: LandingPageData[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LANDING_PAGES, JSON.stringify(pages));
  } catch (e) {
    console.error('Failed to save landing pages', e);
  }
}

export function createLandingPage(propertyId: string, headline?: string, subheadline?: string): LandingPageData | null {
  const props = getProperties();
  const prop = props.find(p => p.id === propertyId);
  if (!prop) return null;

  const pages = getLandingPages();
  const slug = `${prop.slug}-exclusivo`;
  const existing = pages.find(p => p.propertyId === propertyId);
  if (existing) return existing;

  const newLanding: LandingPageData = {
    id: `land-${Date.now()}`,
    slug,
    propertyId,
    headline: headline || `Oportunidade em Destaque: ${prop.title}`,
    subheadline: subheadline || prop.description,
    customBenefits: prop.features.slice(0, 4),
    published: true,
    createdAt: new Date().toISOString(),
  };

  saveLandingPages([newLanding, ...pages]);

  // Sync to Firestore
  try {
    setDoc(doc(db, 'landing_pages', newLanding.id), newLanding).catch((err) => {
      console.warn('Firestore landing write warning:', err);
    });
  } catch (e) {
    console.warn('Firestore sync failed', e);
  }

  return newLanding;
}

// Site Config
export function getSiteConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function updateSiteConfig(updates: Partial<SiteConfig>): SiteConfig {
  const current = getSiteConfig();
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));

  // Sync to Firestore
  try {
    setDoc(doc(db, 'site_config', 'main_config'), updated, { merge: true }).catch((err) => {
      console.warn('Firestore site config sync warning:', err);
    });
  } catch (e) {
    console.warn('Firestore sync failed', e);
  }

  return updated;
}

// Admin Auth Mock (Firebase fallback in browser)
export function getStoredPassword(): string {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_PWD) || 'admin4321';
}

export function setStoredPassword(newPwd: string): void {
  localStorage.setItem(STORAGE_KEYS.ADMIN_PWD, newPwd);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
}

export function loginAdmin(email: string, password: string): { success: boolean; error?: string } {
  const currentPwd = getStoredPassword();
  if (email.trim().toLowerCase() === 'admin@x.com' && password === currentPwd) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    return { success: true };
  }
  return { success: false, error: 'E-mail ou senha incorretos.' };
}

export function logoutAdmin(): void {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
}

// Initial Seeder to Firestore
export async function seedFirestoreIfEmpty(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, 'properties'));
    if (snap.empty) {
      for (const p of INITIAL_PROPERTIES) {
        await setDoc(doc(db, 'properties', p.id), p);
      }
      console.log('Firestore initialized with initial property dataset.');
    }
  } catch (err) {
    // Non-blocking fallback
    console.log('Firebase ready with local persistence bridge:', err);
  }
}
