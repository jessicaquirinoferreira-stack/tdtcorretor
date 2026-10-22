import { Property, Lead, LandingPageData, SiteConfig } from '../types';
import { INITIAL_PROPERTIES } from '../data/initialProperties';
import { BROKER_EMAIL, DEFAULT_WHATSAPP_NUMBER, DISPLAY_PHONE, INSTAGRAM_URL } from '../utils/whatsapp';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';

const STORAGE_KEYS = {
  PROPERTIES: 'tft_properties_v1',
  DELETED_PROPERTIES: 'tft_deleted_properties_v1',
  INITIALIZED: 'tft_initialized_v1',
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

// Price formatting utility
export function formatPropertyPrice(price?: string): string {
  if (!price) return 'A consultar';
  const trimmed = price.trim();
  if (
    !trimmed ||
    trimmed.toLowerCase() === 'a consultar' ||
    trimmed.toLowerCase() === 'valor a consultar'
  ) {
    return 'A consultar';
  }
  return trimmed;
}

// Tombstone management to permanently prevent deleted properties from resurrecting
export function getDeletedPropertyIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DELETED_PROPERTIES);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set(arr.filter((id) => typeof id === 'string'));
      }
    }
  } catch (e) {
    console.error('Failed to parse deleted properties', e);
  }
  return new Set<string>();
}

export function markPropertyAsDeletedLocally(id: string): void {
  try {
    const current = getDeletedPropertyIds();
    current.add(id);
    localStorage.setItem(
      STORAGE_KEYS.DELETED_PROPERTIES,
      JSON.stringify(Array.from(current))
    );
  } catch (e) {
    console.error('Failed to save deleted property id locally', e);
  }
}

// Properties
export function getProperties(): Property[] {
  try {
    const deleted = getDeletedPropertyIds();
    const raw = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    if (!raw) {
      // If already initialized before, or if any deletions exist, don't resurrect INITIAL_PROPERTIES
      const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
      if (isInitialized || deleted.size > 0) {
        return [];
      }
      const initial = INITIAL_PROPERTIES.filter((p) => !deleted.has(p.id));
      saveProperties(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((p) => p && p.id && !deleted.has(p.id));
    }
    return [];
  } catch {
    return [];
  }
}

export function saveProperties(props: Property[]): void {
  try {
    const deleted = getDeletedPropertyIds();
    const cleanProps = props.filter((p) => p && p.id && !deleted.has(p.id));
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(cleanProps));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  } catch (e) {
    console.error('Failed to save properties to localStorage', e);
  }
}

export function getPropertyBySlug(slug: string): Property | undefined {
  const props = getProperties();
  return props.find((p) => p.slug === slug || p.id === slug);
}

// Real-time synchronization of Properties with Cloud Firestore
export function subscribeToProperties(
  callback: (properties: Property[]) => void
): Unsubscribe {
  let unsubProps: Unsubscribe = () => {};
  let unsubTombstones: Unsubscribe = () => {};

  try {
    // 1. Listen for deleted properties (tombstones) across all devices
    unsubTombstones = onSnapshot(
      collection(db, 'deleted_properties'),
      (tombstoneSnap) => {
        try {
          const localDeleted = getDeletedPropertyIds();
          let changed = false;
          tombstoneSnap.forEach((docSnap) => {
            if (!localDeleted.has(docSnap.id)) {
              localDeleted.add(docSnap.id);
              changed = true;
            }
          });

          if (changed) {
            localStorage.setItem(
              STORAGE_KEYS.DELETED_PROPERTIES,
              JSON.stringify(Array.from(localDeleted))
            );
            // Re-filter local properties
            const currentProps = getProperties();
            const cleanProps = currentProps.filter((p) => !localDeleted.has(p.id));
            if (cleanProps.length !== currentProps.length) {
              saveProperties(cleanProps);
              callback(cleanProps);
            }
          }
        } catch (tombstoneErr) {
          console.warn('Error processing deleted_properties snapshot:', tombstoneErr);
        }
      },
      (err) => console.warn('deleted_properties snapshot listener error:', err)
    );

    // 2. Listen for properties collection
    unsubProps = onSnapshot(
      collection(db, 'properties'),
      async (snapshot) => {
        try {
          const deleted = getDeletedPropertyIds();

          if (snapshot.empty) {
            const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
            // Only seed if brand-new, never initialized, and no deletions occurred
            if (!isInitialized && deleted.size === 0) {
              console.log('Firestore properties empty on fresh install. Seeding initial dataset...');
              const initialToSeed = INITIAL_PROPERTIES.filter((p) => !deleted.has(p.id));
              for (const p of initialToSeed) {
                await setDoc(doc(db, 'properties', p.id), p).catch((e) =>
                  console.warn('Seed doc error', e)
                );
              }
              saveProperties(initialToSeed);
              callback(initialToSeed);
              return;
            }
            // Admin intentionally deleted all properties or database is empty
            saveProperties([]);
            callback([]);
            return;
          }

          const remoteProps: Property[] = [];
          for (const docSnap of snapshot.docs) {
            const propId = docSnap.id;
            // If this property was marked as deleted, ensure it's removed and NEVER displayed
            if (deleted.has(propId)) {
              deleteDoc(doc(db, 'properties', propId)).catch(() => {});
              continue;
            }

            const data = docSnap.data() as Property;
            remoteProps.push({
              ...data,
              id: propId || data.id,
              price: formatPropertyPrice(data.price),
            });
          }

          // Sort by creation date descending
          remoteProps.sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
          });

          // Cache locally and notify subscribers
          saveProperties(remoteProps);
          callback(remoteProps);
        } catch (innerErr) {
          console.warn('Error processing properties snapshot:', innerErr);
          callback(getProperties());
        }
      },
      (error) => {
        console.warn('Firestore subscription error (using local cache):', error);
        callback(getProperties());
      }
    );

    return () => {
      unsubProps();
      unsubTombstones();
    };
  } catch (err) {
    console.warn('Could not attach Firestore listener:', err);
    callback(getProperties());
    return () => {};
  }
}

export async function addProperty(
  property: Omit<Property, 'id' | 'createdAt'>
): Promise<Property> {
  const props = getProperties();
  const formattedPrice = formatPropertyPrice(property.price);
  const newProp: Property = {
    ...property,
    price: formattedPrice,
    id: `prop-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  // Immediate local cache update
  const updated = [newProp, ...props.filter((p) => p.id !== newProp.id)];
  saveProperties(updated);

  // Sync to Cloud Firestore so all visitors and devices see it
  try {
    await setDoc(doc(db, 'properties', newProp.id), newProp);
    console.log('Imóvel publicado no Cloud Firestore com sucesso:', newProp.id);
  } catch (e) {
    console.warn('Firestore write warning:', e);
  }

  return newProp;
}

export async function updateProperty(
  id: string,
  updates: Partial<Property>
): Promise<Property | null> {
  const props = getProperties();
  const index = props.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const formattedUpdates = { ...updates };
  if (formattedUpdates.price !== undefined) {
    formattedUpdates.price = formatPropertyPrice(formattedUpdates.price);
  }

  const updatedProp = { ...props[index], ...formattedUpdates };
  props[index] = updatedProp;
  saveProperties(props);

  // Sync to Firestore
  try {
    await setDoc(doc(db, 'properties', id), updatedProp, { merge: true });
    console.log('Imóvel atualizado no Cloud Firestore:', id);
  } catch (e) {
    console.warn('Firestore update warning:', e);
  }

  return updatedProp;
}

export async function deleteProperty(id: string): Promise<boolean> {
  // 1. Mark in permanent tombstone locally
  markPropertyAsDeletedLocally(id);

  // 2. Remove from local properties immediately
  const props = getProperties();
  const filtered = props.filter((p) => p.id !== id);
  saveProperties(filtered);

  // 3. Register permanent tombstone in Firestore (so no other client can ever resurrect it)
  try {
    await setDoc(doc(db, 'deleted_properties', id), {
      id,
      deletedAt: new Date().toISOString(),
    });
    console.log('Tombstone permanente gravado no Cloud Firestore:', id);
  } catch (err) {
    console.warn('Erro ao gravar tombstone no Firestore:', err);
  }

  // 4. Permanently delete from Firestore properties collection
  try {
    await deleteDoc(doc(db, 'properties', id));
    console.log('Imóvel removido definitivamente do Cloud Firestore:', id);
  } catch (e) {
    console.warn('Firestore delete warning:', e);
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

export function subscribeToLeads(callback: (leads: Lead[]) => void): Unsubscribe {
  try {
    const unsub = onSnapshot(
      collection(db, 'leads'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteLeads: Lead[] = [];
          snapshot.forEach((d) => remoteLeads.push(d.data() as Lead));
          remoteLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(remoteLeads));
          callback(remoteLeads);
        } else {
          callback(getLeads());
        }
      },
      (err) => {
        console.warn('Firestore leads sync error:', err);
        callback(getLeads());
      }
    );
    return unsub;
  } catch {
    callback(getLeads());
    return () => {};
  }
}

export async function saveLead(
  leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>
): Promise<Lead> {
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
    await setDoc(doc(db, 'leads', newLead.id), newLead);
  } catch (err) {
    console.warn('Firestore lead submission warning:', err);
  }

  return newLead;
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<void> {
  const leads = getLeads();
  const updated = leads.map((l) => (l.id === id ? { ...l, status } : l));
  localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updated));

  // Sync to Firestore
  try {
    await setDoc(doc(db, 'leads', id), { status }, { merge: true });
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
          subheadline:
            'Seu refúgio natural com ampla área, privacidade e tranquilidade garantida no interior de Minas Gerais.',
          customBenefits: [
            '1.800 m² de terreno com topografia favorável',
            'Espaço generoso para convívio com a família e amigos',
            'Atendimento direto e assessoria do corretor Thiago Teixeira',
            'Facilidade para agendamento de visita no local',
          ],
          published: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'land-casa-geminada',
          slug: 'casa-geminada-giovani',
          propertyId: 'prop-casa-geminada-giovani',
          headline: 'More com Conforto no Bairro Giovani — Coronel Fabriciano',
          subheadline:
            'Casa Geminada Duplex com 3 quartos (1 suíte), acabamento primoroso e garagem privativa.',
          customBenefits: [
            'Localização privilegiada na região do Giovani em Coronel Fabriciano',
            '3 quartos amplos com suíte privativa e iluminação natural',
            'Garagem e espaços integrados para seu dia a dia',
            'Pronto para você e sua família visitarem com exclusividade',
          ],
          published: true,
          createdAt: new Date().toISOString(),
        },
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

export function subscribeToLandingPages(
  callback: (pages: LandingPageData[]) => void
): Unsubscribe {
  try {
    const unsub = onSnapshot(
      collection(db, 'landing_pages'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remote: LandingPageData[] = [];
          snapshot.forEach((d) => remote.push(d.data() as LandingPageData));
          saveLandingPages(remote);
          callback(remote);
        } else {
          callback(getLandingPages());
        }
      },
      () => callback(getLandingPages())
    );
    return unsub;
  } catch {
    callback(getLandingPages());
    return () => {};
  }
}

export async function createLandingPage(
  propertyId: string,
  headline?: string,
  subheadline?: string
): Promise<LandingPageData | null> {
  const props = getProperties();
  const prop = props.find((p) => p.id === propertyId);
  if (!prop) return null;

  const pages = getLandingPages();
  const slug = `${prop.slug}-exclusivo`;
  const existing = pages.find((p) => p.propertyId === propertyId);
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
    await setDoc(doc(db, 'landing_pages', newLanding.id), newLanding);
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

export function subscribeToSiteConfig(
  callback: (config: SiteConfig) => void
): Unsubscribe {
  try {
    const unsub = onSnapshot(
      doc(db, 'site_config', 'main_config'),
      (docSnap) => {
        if (docSnap.exists()) {
          const remote = { ...DEFAULT_CONFIG, ...(docSnap.data() as SiteConfig) };
          localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(remote));
          callback(remote);
        } else {
          callback(getSiteConfig());
        }
      },
      () => callback(getSiteConfig())
    );
    return unsub;
  } catch {
    callback(getSiteConfig());
    return () => {};
  }
}

export async function updateSiteConfig(updates: Partial<SiteConfig>): Promise<SiteConfig> {
  const current = getSiteConfig();
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));

  // Sync to Firestore
  try {
    await setDoc(doc(db, 'site_config', 'main_config'), updated, { merge: true });
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

export function loginAdmin(
  email: string,
  password: string
): { success: boolean; error?: string } {
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
    const deletedSnap = await getDocs(collection(db, 'deleted_properties')).catch(() => null);
    if (deletedSnap && !deletedSnap.empty) {
      // User or admin has already performed deletions; do not seed
      return;
    }
    const localDeleted = getDeletedPropertyIds();
    if (localDeleted.size > 0) {
      return;
    }
    const snap = await getDocs(collection(db, 'properties'));
    if (snap.empty) {
      const initialToSeed = INITIAL_PROPERTIES.filter((p) => !localDeleted.has(p.id));
      for (const p of initialToSeed) {
        await setDoc(doc(db, 'properties', p.id), p);
      }
      console.log('Firestore initialized with initial property dataset.');
    }
  } catch (err) {
    console.log('Firebase ready with local persistence bridge:', err);
  }
}
