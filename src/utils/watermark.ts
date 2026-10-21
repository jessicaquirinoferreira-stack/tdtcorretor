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

    // 3. Create canvas
    const canvas = document.createElement('canvas');
    const width = baseImg.naturalWidth || baseImg.width || 1200;
    const height = baseImg.naturalHeight || baseImg.height || 800;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      if (isObjectUrl) URL.revokeObjectURL(baseSrcUrl);
      return typeof imageSource === 'string' ? imageSource : baseSrcUrl;
    }

    // 4. Draw base image
    ctx.drawImage(baseImg, 0, 0, width, height);

    // 5. Calculate watermark dimensions preserving aspect ratio
    const markAspect = markImg.naturalHeight > 0 && markImg.naturalWidth > 0
      ? markImg.naturalHeight / markImg.naturalWidth
      : 0.45;

    const targetW = Math.max(160, Math.min(width * scaleRatio, 450));
    const targetH = targetW * markAspect;

    // 6. Calculate position coordinates
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

    // 7. Render watermark with soft drop shadow for visibility on light & dark photos
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.drawImage(markImg, x, y, targetW, targetH);
    ctx.restore();

    if (isObjectUrl) {
      URL.revokeObjectURL(baseSrcUrl);
    }

    return canvas.toDataURL('image/jpeg', 0.92);
  } catch (err) {
    console.warn('Canvas watermarking failed, returning source:', err);
    if (isObjectUrl) URL.revokeObjectURL(baseSrcUrl);
    return typeof imageSource === 'string' ? imageSource : '';
  }
}

/**
 * Reads a File from user device via FileReader, optionally applies watermark, and returns data URL
 */
export async function processDeviceUpload(
  file: File,
  withWatermark: boolean = true
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Falha ao ler o arquivo do dispositivo.'));
        return;
      }

      if (withWatermark) {
        try {
          const watermarked = await applyWatermarkToImage(dataUrl, {
            opacity: 0.88,
            position: 'bottom-right',
            scaleRatio: 0.28,
          });
          resolve(watermarked);
        } catch {
          resolve(dataUrl);
        }
      } else {
        resolve(dataUrl);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
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
