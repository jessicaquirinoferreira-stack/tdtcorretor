import { WATERMARK_LOGO_URL, LOCAL_LOGO_URL } from './whatsapp';

export interface WatermarkOptions {
  opacity?: number;
  position?: 'bottom-right' | 'center' | 'bottom-left' | 'top-right';
  scaleRatio?: number; // ratio of watermark width to canvas width (default 0.28)
  margin?: number;
}

/**
 * Loads an image from a URL or File, handling crossOrigin and object URLs safely.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Applies the official TFT Corretor Imobiliário transparent watermark onto an image using HTML5 Canvas.
 * Returns a high-quality data URL string.
 */
export async function applyWatermarkToImage(
  imageSource: string | File,
  options: WatermarkOptions = {}
): Promise<string> {
  const {
    opacity = 0.88,
    position = 'bottom-right',
    scaleRatio = 0.28,
    margin = 24,
  } = options;

  let baseSrcUrl: string;
  let isObjectUrl = false;

  if (imageSource instanceof File) {
    baseSrcUrl = URL.createObjectURL(imageSource);
    isObjectUrl = true;
  } else {
    baseSrcUrl = imageSource;
  }

  try {
    // 1. Load base image
    const baseImg = await loadImage(baseSrcUrl);

    // 2. Load watermark image (try official URL, fallback to local file)
    let markImg: HTMLImageElement;
    try {
      markImg = await loadImage(WATERMARK_LOGO_URL);
    } catch {
      markImg = await loadImage(LOCAL_LOGO_URL);
    }

    // 3. Create canvas with web-optimized dimensions (max 1200px)
    const origW = baseImg.naturalWidth || baseImg.width || 1200;
    const origH = baseImg.naturalHeight || baseImg.height || 800;

    const MAX_DIMENSION = 1200;
    let width = origW;
    let height = origH;

    if (origW > MAX_DIMENSION || origH > MAX_DIMENSION) {
      if (origW >= origH) {
        width = MAX_DIMENSION;
        height = Math.round((origH * MAX_DIMENSION) / origW);
      } else {
        height = MAX_DIMENSION;
        width = Math.round((origW * MAX_DIMENSION) / origH);
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      if (isObjectUrl) URL.revokeObjectURL(baseSrcUrl);
      return typeof imageSource === 'string' ? imageSource : baseSrcUrl;
    }

    // 4. Draw base image scaled smoothly onto canvas
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(baseImg, 0, 0, width, height);

    // 5. Draw watermark only if opacity > 0
    if (opacity > 0) {
      const markAspect = markImg.naturalHeight > 0 && markImg.naturalWidth > 0
        ? markImg.naturalHeight / markImg.naturalWidth
        : 0.45;

      const targetW = Math.max(140, Math.min(width * scaleRatio, 380));
      const targetH = targetW * markAspect;

      let x = width - targetW - margin;
      let y = height - targetH - margin;

      if (position === 'center') {
        x = (width - targetW) / 2;
        y = (height - targetH) / 2;
      } else if (position === 'bottom-left') {
        x = margin;
        y = height - targetH - margin;
      } else if (position === 'top-right') {
        x = width - targetW - margin;
        y = margin;
      }

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.drawImage(markImg, x, y, targetW, targetH);
      ctx.restore();
    }

    if (isObjectUrl) {
      URL.revokeObjectURL(baseSrcUrl);
    }

    // 0.78 quality provides retina-sharp visual fidelity while keeping file sizes ~65-85KB
    return canvas.toDataURL('image/jpeg', 0.78);
  } catch (err) {
    console.warn('Canvas watermarking/compression failed, returning source:', err);
    if (isObjectUrl) URL.revokeObjectURL(baseSrcUrl);
    return typeof imageSource === 'string' ? imageSource : '';
  }
}

/**
 * Reads a File from user device via FileReader, resizes/compresses to web format,
 * and optionally applies watermark, returning an optimized data URL
 */
export async function processDeviceUpload(
  file: File,
  withWatermark: boolean = true
): Promise<string> {
  return applyWatermarkToImage(file, {
    opacity: withWatermark ? 0.88 : 0,
    position: 'bottom-right',
    scaleRatio: 0.28,
  });
}

/**
 * Converts a data URL to a File or Blob object
 */
export function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
