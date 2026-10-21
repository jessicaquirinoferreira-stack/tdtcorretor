import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  Cloud,
  HardDrive,
  RefreshCw,
  ExternalLink,
  Plus,
  KeyRound,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { uploadPropertyPhoto, watermarkExistingPhoto, getActiveBlobToken, saveActiveBlobToken } from '../lib/blobStorage';
import { WATERMARK_LOGO_URL, LOCAL_LOGO_URL } from '../utils/whatsapp';

interface PhotoUploaderProps {
  images: string[];
  coverImage: string;
  onChangeImages: (images: string[]) => void;
  onChangeCoverImage: (cover: string) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  images,
  coverImage,
  onChangeImages,
  onChangeCoverImage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [autoWatermark, setAutoWatermark] = useState<boolean>(true);
  const [isApplyingBatchWatermark, setIsApplyingBatchWatermark] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  
  // Vercel Blob token config toggle
  const [showBlobConfig, setShowBlobConfig] = useState(false);
  const [blobTokenInput, setBlobTokenInput] = useState(getActiveBlobToken());
  const [tokenSavedMsg, setTokenSavedMsg] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasBlobToken = !!getActiveBlobToken();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    const newUploadedUrls: string[] = [];
    const total = files.length;

    for (let i = 0; i < total; i++) {
      const file = files[i];
      setUploadProgress(`Processando ${i + 1} de ${total}: "${file.name}"...`);

      try {
        const res = await uploadPropertyPhoto(file, {
          applyWatermark: autoWatermark,
          onProgress: (status) => setUploadProgress(`[${i + 1}/${total}] ${status}`),
        });

        if (res.url) {
          newUploadedUrls.push(res.url);
        }
      } catch (err) {
        console.error('Error uploading file:', file.name, err);
      }
    }

    if (newUploadedUrls.length > 0) {
      const updated = [...images, ...newUploadedUrls];
      onChangeImages(updated);

      // If no cover image set, make first uploaded the cover
      if (!coverImage && newUploadedUrls[0]) {
        onChangeCoverImage(newUploadedUrls[0]);
      }
    }

    setIsUploading(false);
    setUploadProgress('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const targetUrl = images[indexToRemove];
    const filtered = images.filter((_, idx) => idx !== indexToRemove);
    onChangeImages(filtered);

    // If removed photo was cover, select new cover
    if (coverImage === targetUrl) {
      onChangeCoverImage(filtered[0] || '');
    }
  };

  const handleSetCover = (url: string) => {
    onChangeCoverImage(url);
  };

  const handleWatermarkSinglePhoto = async (index: number) => {
    const currentUrl = images[index];
    try {
      setUploadProgress(`Aplicando marca d'água na foto ${index + 1}...`);
      const watermarked = await watermarkExistingPhoto(currentUrl);
      const updated = [...images];
      updated[index] = watermarked;
      onChangeImages(updated);

      if (coverImage === currentUrl) {
        onChangeCoverImage(watermarked);
      }
      setUploadProgress('');
    } catch (e) {
      console.error('Failed to watermark single photo:', e);
      setUploadProgress('Não foi possível aplicar nesta foto (restrição CORS ou formato inválido).');
      setTimeout(() => setUploadProgress(''), 3000);
    }
  };

  const handleBatchApplyWatermark = async () => {
    if (images.length === 0) return;
    setIsApplyingBatchWatermark(true);
    setUploadProgress("Aplicando marca d'água em todas as fotos do empreendimento...");

    const updated = [...images];
    let count = 0;

    for (let i = 0; i < updated.length; i++) {
      try {
        setUploadProgress(`Aplicando marca d'água [${i + 1}/${updated.length}]...`);
        const result = await watermarkExistingPhoto(updated[i]);
        if (result && result !== updated[i]) {
          updated[i] = result;
          count++;
        }
      } catch (err) {
        console.warn(`Could not watermark image ${i + 1}:`, err);
      }
    }

    onChangeImages(updated);
    if (updated[0] && coverImage) {
      // Refresh cover if modified
      const coverIndex = images.indexOf(coverImage);
      if (coverIndex !== -1 && updated[coverIndex]) {
        onChangeCoverImage(updated[coverIndex]);
      }
    }

    setIsApplyingBatchWatermark(false);
    setUploadProgress(`Marca d'água aplicada com sucesso em ${count || updated.length} foto(s)!`);
    setTimeout(() => setUploadProgress(''), 3500);
  };

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrlInput.trim()) return;
    const url = manualUrlInput.trim();
    const updated = [...images, url];
    onChangeImages(updated);
    if (!coverImage) onChangeCoverImage(url);
    setManualUrlInput('');
  };

  const handleSaveBlobToken = (e: React.FormEvent) => {
    e.preventDefault();
    saveActiveBlobToken(blobTokenInput);
    setTokenSavedMsg(true);
    setTimeout(() => setTokenSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Watermark & Vercel Blob Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoWatermark}
              onChange={(e) => setAutoWatermark(e.target.checked)}
              className="w-4 h-4 rounded text-[#0B2B20] focus:ring-[#C8A251]"
            />
            <span className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A251]" />
              Aplicar Marca d'Água Oficial TFT automaticamente
            </span>
          </label>

          {/* Watermark Mini Preview */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-white rounded border border-gray-200 text-[10px] text-gray-600">
            <span>Logotipo:</span>
            <img
              src={WATERMARK_LOGO_URL}
              alt="Marca TFT"
              className="h-4 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = LOCAL_LOGO_URL;
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {images.length > 0 && (
            <button
              type="button"
              onClick={handleBatchApplyWatermark}
              disabled={isApplyingBatchWatermark}
              className="px-3 py-1.5 text-xs font-semibold text-[#0B2B20] bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8A251]" />
              {isApplyingBatchWatermark ? 'Aplicando...' : "Marca d'água em Todas"}
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowBlobConfig(!showBlobConfig)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition ${
              hasBlobToken
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>{hasBlobToken ? 'Vercel Blob Ativo' : 'Configurar Vercel Blob'}</span>
            {showBlobConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Vercel Blob Configuration Panel */}
      {showBlobConfig && (
        <div className="p-4 bg-white rounded-xl border border-gray-300 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Cloud className="w-4 h-4 text-blue-600" />
                Armazenamento em Nuvem · Vercel Blob
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                O site suporta upload direto do seu dispositivo (celular/computador). Se você possui uma conta Vercel, insira o seu <strong>BLOB_READ_WRITE_TOKEN</strong> para hospedar as fotos na CDN de alta velocidade do Vercel Blob.
              </p>
            </div>
            {hasBlobToken && (
              <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
                Conectado
              </span>
            )}
          </div>

          <form onSubmit={handleSaveBlobToken} className="flex gap-2">
            <input
              type="password"
              value={blobTokenInput}
              onChange={(e) => setBlobTokenInput(e.target.value)}
              placeholder="vercel_blob_rw_..."
              className="flex-1 px-3 py-1.5 text-xs font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2B20]"
            />
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] rounded-lg transition shrink-0"
            >
              Salvar Token
            </button>
          </form>

          {tokenSavedMsg && (
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Token salvo com sucesso! Novas fotos serão enviadas para o Vercel Blob.
            </p>
          )}
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#C8A251] bg-[#C8A251]/10 scale-[1.01]'
            : 'border-gray-300 hover:border-[#0B2B20] bg-white hover:bg-gray-50/80 shadow-xs'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          multiple
          accept="image/*"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0B2B20] flex items-center justify-center border border-emerald-100">
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm font-bold text-gray-800">
              Clique para escolher fotos do dispositivo ou arraste até aqui
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Fotos do computador ou smartphone (JPG, PNG, WebP) · Aplicação automática de marca d'água transparente oficial
            </p>
          </div>

          <button
            type="button"
            className="mt-2 px-4 py-1.5 text-xs font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] rounded-lg transition shadow-xs pointer-events-none"
          >
            Selecionar do Dispositivo
          </button>
        </div>
      </div>

      {/* Progress / Status feedback */}
      {uploadProgress && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-lg flex items-center gap-2 animate-in fade-in">
          <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
          <span>{uploadProgress}</span>
        </div>
      )}

      {/* Manual URL Input Accordion */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="url"
          value={manualUrlInput}
          onChange={(e) => setManualUrlInput(e.target.value)}
          placeholder="Ou cole uma URL externa direta de foto (opcional)"
          className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2B20]"
        />
        <button
          type="button"
          onClick={handleAddManualUrl}
          className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition shrink-0 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Adicionar URL
        </button>
      </div>

      {/* Photo Gallery Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Fotos Cadastradas ({images.length})
          </label>
          <span className="text-[11px] text-gray-500">
            Defina uma foto como capa principal para os cards e destaque
          </span>
        </div>

        {images.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-xs text-gray-500">
            Nenhuma foto adicionada ainda. Use o campo acima para carregar fotos do dispositivo ou colar links.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((imgUrl, idx) => {
              const isCover = coverImage === imgUrl || (!coverImage && idx === 0);

              return (
                <div
                  key={idx}
                  className={`group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border-2 transition shadow-xs ${
                    isCover ? 'border-[#C8A251] ring-2 ring-[#C8A251]/20' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Visual Watermark Emblem Indicator */}
                  <div className="absolute bottom-1.5 right-1.5 pointer-events-none">
                    <img
                      src={WATERMARK_LOGO_URL}
                      alt="Marca TFT"
                      className="w-12 h-auto object-contain opacity-80 filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
                      onError={(e) => {
                        e.currentTarget.src = LOCAL_LOGO_URL;
                      }}
                    />
                  </div>

                  {/* Cover Badge */}
                  {isCover && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#C8A251] text-[#0B2B20] text-[10px] font-bold rounded shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Capa Principal
                    </div>
                  )}

                  {/* Photo Index */}
                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 text-white text-[10px] font-mono rounded">
                    #{idx + 1}
                  </div>

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        title="Remover foto"
                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(imgUrl)}
                          className="w-full py-1 text-[10px] font-bold bg-[#C8A251] hover:bg-[#E2C481] text-[#0B2B20] rounded transition flex items-center justify-center gap-1"
                        >
                          <Star className="w-3 h-3" />
                          Tornar Capa
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleWatermarkSinglePhoto(idx)}
                        className="w-full py-1 text-[10px] font-semibold bg-white/90 hover:bg-white text-gray-900 rounded transition flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-[#C8A251]" />
                        Aplicar Marca d'Água
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
