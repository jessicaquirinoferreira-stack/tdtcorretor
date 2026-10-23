import { put } from '@vercel/blob';
import { applyWatermarkToImage, dataURLtoBlob } from '../utils/watermark';
import { getSiteConfig, updateSiteConfig } from './storage';

export interface UploadResult {
  url: string;
  source: 'vercel-blob' | 'device-processed';
  fileName: string;
  watermarked: boolean;
}

export const DEFAULT_VERCEL_BLOB_TOKEN =
  'vercel_blob_rw_BuI5Eog1UypRBK4m_KBJMAtlKIGFaParKiTsImKbvd91c7Z';

const BLOB_TOKEN_KEY = 'tft_vercel_blob_token';

/**
 * Retrieves the active Vercel Blob Token from localStorage, siteConfig, env, or default
 */
export function getActiveBlobToken(): string {
  try {
    const fromStorage = localStorage.getItem(BLOB_TOKEN_KEY);
    if (fromStorage && fromStorage.trim().length > 10) {
      return fromStorage.trim();
    }
    const config = getSiteConfig();
    if (config.vercelBlobToken && config.vercelBlobToken.trim().length > 10) {
      return config.vercelBlobToken.trim();
    }
  } catch {
    // fallback
  }

  // Check Vite env variables
  const envToken =
    (import.meta as any).env?.VITE_BLOB_READ_WRITE_TOKEN ||
    (import.meta as any).env?.BLOB_READ_WRITE_TOKEN;
  if (envToken && String(envToken).trim().length > 10) {
    return String(envToken).trim();
  }

  // Pre-configured official Vercel Blob Token provided by user
  return DEFAULT_VERCEL_BLOB_TOKEN;
}

/**
 * Saves Vercel Blob Token
 */
export function saveActiveBlobToken(token: string): void {
  const clean = token.trim();
  try {
    if (clean) {
      localStorage.setItem(BLOB_TOKEN_KEY, clean);
    } else {
      localStorage.removeItem(BLOB_TOKEN_KEY);
    }
    const cfg = getSiteConfig();
    updateSiteConfig({
      ...cfg,
      vercelBlobToken: clean,
    });
  } catch (e) {
    console.error('Failed to save Vercel Blob token:', e);
  }
}

/**
 * Uploads an image file from user device.
 * 1. Optionally applies official TFT transparent watermark onto the image via Canvas
 * 2. If Vercel Blob token is available, uploads directly to Vercel Blob and returns public CDN URL
 * 3. If no token is provided, returns the high-fidelity watermarked image data URL directly so it works instantly!
 */
export async function uploadPropertyPhoto(
  file: File,
  options: {
    applyWatermark?: boolean;
    customToken?: string;
    onProgress?: (status: string) => void;
  } = {}
): Promise<UploadResult> {
  const { applyWatermark = true, customToken, onProgress } = options;

  onProgress?.('Processando imagem do dispositivo...');

  let processedDataUrl: string;
  let wasWatermarked = false;

  if (applyWatermark) {
    onProgress?.("Aplicando marca d'água oficial TFT...");
    try {
      processedDataUrl = await applyWatermarkToImage(file, {
        opacity: 0.88,
        position: 'bottom-right',
        scaleRatio: 0.28,
      });
      wasWatermarked = true;
    } catch (e) {
      console.warn("Watermark failed, compressing image without watermark:", e);
      try {
        processedDataUrl = await applyWatermarkToImage(file, { opacity: 0 });
      } catch {
        processedDataUrl = await readFileAsDataUrl(file);
      }
    }
  } else {
    try {
      processedDataUrl = await applyWatermarkToImage(file, { opacity: 0 });
    } catch {
      processedDataUrl = await readFileAsDataUrl(file);
    }
  }

  const token = customToken || getActiveBlobToken();

  // Upload directly to Vercel Blob CDN so photos never bloat Firestore or LocalStorage
  if (token) {
    onProgress?.('Enviando para o Vercel Blob CDN...');
    try {
      const blobToUpload = dataURLtoBlob(processedDataUrl);
      const sanitizedName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '_');
      const filename = `tft-imoveis/${Date.now()}-${sanitizedName}`;

      // 1. Direct browser fetch to Vercel Blob Storage API (works 100% across all browsers)
      const directRes = await fetch(`https://blob.vercel-storage.com/${filename}`, {
        method: 'PUT',
        headers: {
          'authorization': `Bearer ${token}`,
          'x-api-version': '7',
          'content-type': blobToUpload.type || 'image/jpeg',
        },
        body: blobToUpload,
      });

      if (directRes.ok) {
        const data = await directRes.json();
        if (data.url) {
          onProgress?.('Foto enviada para o Vercel Blob com sucesso!');
          return {
            url: data.url,
            source: 'vercel-blob',
            fileName: file.name,
            watermarked: wasWatermarked,
          };
        }
      }

      // 2. Secondary fallback via @vercel/blob put
      const putRes = await put(filename, blobToUpload, {
        access: 'public',
        token,
      });

      if (putRes.url) {
        onProgress?.('Foto enviada para o Vercel Blob com sucesso!');
        return {
          url: putRes.url,
          source: 'vercel-blob',
          fileName: file.name,
          watermarked: wasWatermarked,
        };
      }
    } catch (blobErr) {
      console.error('Vercel Blob upload failed:', blobErr);
      onProgress?.('Erro ao enviar para o Vercel Blob. Tentando novamente...');
    }
  }

  // If upload couldn't reach Vercel Blob, return compressed processed image
  onProgress?.('Imagem processada!');
  return {
    url: processedDataUrl,
    source: 'device-processed',
    fileName: file.name,
    watermarked: wasWatermarked,
  };
}

/**
 * Applies watermark to an existing image URL or Data URL
 */
export async function watermarkExistingPhoto(imageUrl: string): Promise<string> {
  return applyWatermarkToImage(imageUrl, {
    opacity: 0.88,
    position: 'bottom-right',
    scaleRatio: 0.28,
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
