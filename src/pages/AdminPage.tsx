import React, { useState } from 'react';
import {
  Lock,
  LogOut,
  Building2,
  Users,
  LayoutTemplate,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  MessageCircle,
  Upload,
  KeyRound,
  ShieldAlert,
  Save,
  Loader2
} from 'lucide-react';
import { Property, Lead, LandingPageData, PropertyType, PropertyPurpose } from '../types';
import {
  isAuthenticated,
  loginAdmin,
  logoutAdmin,
  getStoredPassword,
  setStoredPassword,
  addProperty,
  updateProperty,
  deleteProperty,
  updateLeadStatus,
  createLandingPage,
  getLandingPages,
  saveLandingPages,
  getSiteConfig,
  updateSiteConfig
} from '../lib/storage';
import { PhotoUploader } from '../components/PhotoUploader';

interface AdminPageProps {
  properties: Property[];
  leads: Lead[];
  onRefreshData: () => void;
  onNavigateHome: () => void;
  onPreviewProperty: (property: Property) => void;
  onPreviewLanding: (slug: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  properties,
  leads,
  onRefreshData,
  onNavigateHome,
  onPreviewProperty,
  onPreviewLanding,
}) => {
  const [authed, setAuthed] = useState<boolean>(isAuthenticated());
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'imoveis' | 'leads' | 'landings' | 'config' | 'deploy'>('imoveis');

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangedMsg, setPasswordChangedMsg] = useState(false);

  // Property form state
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propForm, setPropForm] = useState({
    title: '',
    type: 'Casa' as PropertyType,
    purpose: 'Venda' as PropertyPurpose,
    price: 'Valor a consultar',
    city: 'Coronel Fabriciano',
    state: 'Minas Gerais',
    neighborhood: '',
    area: '150 m²',
    bedrooms: '3',
    bathrooms: '2',
    garages: '1',
    description: '',
    featuresStr: '',
    images: [] as string[],
    imagesStr: '',
    coverImage: '',
    isFeatured: true,
  });
  const [isCreatingProp, setIsCreatingProp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Site config state
  const [siteConfig, setSiteConfigState] = useState(getSiteConfig());
  const [configSaved, setConfigSaved] = useState(false);

  const landings = getLandingPages();

  // Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginAdmin(emailInput, passwordInput);
    if (result.success) {
      setAuthed(true);
      setLoginError('');
    } else {
      setLoginError(result.error || 'Credenciais inválidas.');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setAuthed(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setStoredPassword(newPassword.trim());
    setPasswordChangedMsg(true);
    setNewPassword('');
    setTimeout(() => setPasswordChangedMsg(false), 3000);
  };

  const handleStartCreateProperty = () => {
    const defaultImg = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80';
    setEditingPropertyId(null);
    setSaveError(null);
    setPropForm({
      title: '',
      type: 'Casa',
      purpose: 'Venda',
      price: 'A consultar',
      city: 'Coronel Fabriciano',
      state: 'Minas Gerais',
      neighborhood: '',
      area: '120 m²',
      bedrooms: '3',
      bathrooms: '2',
      garages: '1',
      description: '',
      featuresStr: 'Excelente localização\nAcabamento moderno\nGaragem privativa',
      images: [defaultImg],
      imagesStr: defaultImg,
      coverImage: defaultImg,
      isFeatured: true,
    });
    setIsCreatingProp(true);
  };

  const handleStartEditProperty = (p: Property) => {
    const pImages = Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.coverImage ? [p.coverImage] : []);
    const pLoc = p.location || { city: 'Coronel Fabriciano', state: 'Minas Gerais', neighborhood: '' };
    const pFeats = Array.isArray(p.features) ? p.features : [];
    setEditingPropertyId(p.id);
    setSaveError(null);
    setPropForm({
      title: p.title || '',
      type: p.type || 'apartamento',
      purpose: p.purpose || 'venda',
      price: p.price || 'A consultar',
      city: pLoc.city || 'Coronel Fabriciano',
      state: pLoc.state || 'Minas Gerais',
      neighborhood: pLoc.neighborhood || '',
      area: p.area || '',
      bedrooms: String(p.bedrooms ?? ''),
      bathrooms: String(p.bathrooms ?? ''),
      garages: String(p.garages ?? ''),
      description: p.description || '',
      featuresStr: pFeats.join('\n'),
      images: pImages,
      imagesStr: pImages.join('\n'),
      coverImage: p.coverImage || pImages[0] || '',
      isFeatured: !!p.isFeatured,
    });
    setIsCreatingProp(true);
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    if (!propForm.title || !propForm.title.trim()) {
      setSaveError('Por favor, informe o título ou nome do imóvel.');
      return;
    }

    if (isUploadingPhotos) {
      setSaveError('Aguarde o envio das fotos para o Vercel Blob ser concluído antes de salvar.');
      return;
    }

    setIsSaving(true);

    try {
      const imgs = propForm.images && propForm.images.length > 0
        ? propForm.images
        : propForm.imagesStr
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);
      const feats = propForm.featuresStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const slug = propForm.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const fallbackCover = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80';
      const finalCover = propForm.coverImage || imgs[0] || fallbackCover;
      const finalImages = imgs.length > 0 ? imgs : [finalCover];

      // If user enters a price (e.g. R$ 450.000), show that price.
      // If left blank or left as "A consultar" / "Valor a consultar", show "A consultar".
      const rawPrice = propForm.price ? propForm.price.trim() : '';
      const isConsult = !rawPrice || rawPrice.toLowerCase().includes('consultar');
      const finalPrice = isConsult ? 'A consultar' : rawPrice;

      const propData = {
        slug: slug || `imovel-${Date.now()}`,
        title: propForm.title.trim(),
        type: propForm.type,
        purpose: propForm.purpose,
        price: finalPrice,
        location: {
          city: propForm.city.trim() || 'Coronel Fabriciano',
          state: propForm.state.trim() || 'Minas Gerais',
          neighborhood: propForm.neighborhood.trim(),
        },
        area: propForm.area.trim() || 'Sob consulta',
        bedrooms: propForm.bedrooms ? (isNaN(Number(propForm.bedrooms)) ? propForm.bedrooms : Number(propForm.bedrooms)) : undefined,
        bathrooms: propForm.bathrooms ? (isNaN(Number(propForm.bathrooms)) ? propForm.bathrooms : Number(propForm.bathrooms)) : undefined,
        garages: propForm.garages ? (isNaN(Number(propForm.garages)) ? propForm.garages : Number(propForm.garages)) : undefined,
        description: propForm.description.trim() || 'Excelente imóvel em localização privilegiada.',
        features: feats.length > 0 ? feats : ['Excelente localização', 'Acabamento diferenciado'],
        images: finalImages,
        coverImage: finalCover,
        isFeatured: propForm.isFeatured,
        status: 'published' as const,
      };

      if (editingPropertyId) {
        await updateProperty(editingPropertyId, propData);
      } else {
        await addProperty(propData);
      }

      onRefreshData();
      setIsCreatingProp(false);
      setEditingPropertyId(null);
      setSaveSuccessMsg(
        editingPropertyId
          ? 'Imóvel atualizado com sucesso!'
          : 'Imóvel publicado com sucesso e visível para todos os visitantes!'
      );
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Falha ao salvar imóvel:', err);
      setSaveError(
        err?.message ||
        'Ocorreu um erro ao salvar o imóvel. Os dados foram preservados localmente.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (confirm('Tem certeza de que deseja excluir este imóvel?')) {
      await deleteProperty(id);
      onRefreshData();
    }
  };

  const handleCreateLanding = async (propId: string) => {
    const landing = await createLandingPage(propId);
    if (landing) {
      alert(`Landing page criada com sucesso! URL: /landing/${landing.slug}`);
      onRefreshData();
      setActiveTab('landings');
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteConfig(siteConfig);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  };

  // Login view if not authenticated
  if (!authed) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#0B2B20] text-[#C8A251] rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#0B2B20] font-editorial">
              Painel Administrativo
            </h1>
            <p className="text-xs text-gray-500">
              Acesso restrito para administração de imóveis e contatos da TFT Corretor Imobiliário.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                E-mail Administrativo
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@x.com"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2B20]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Senha de Acesso
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2B20]"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 leading-snug">
              <strong>Credenciais Iniciais (Solicitadas no Prompt):</strong>
              <br />E-mail: <code className="font-mono">admin@x.com</code>
              <br />Senha temporária: <code className="font-mono">admin4321</code>
            </div>

            <button
              type="submit"
              className="w-full py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] rounded-lg transition shadow-md"
            >
              Entrar no Painel
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={onNavigateHome}
              className="text-xs text-gray-500 hover:text-gray-900 transition underline underline-offset-4"
            >
              ← Voltar ao site público
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isTemporaryPassword = getStoredPassword() === 'admin4321';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Admin Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h1 className="text-xl font-bold text-[#0B2B20] font-editorial">
              Painel de Gestão · TFT Corretor
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Logado como <span className="font-semibold text-gray-700">admin@x.com</span> · Modo Administrativo Secundário
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
          >
            Visualizar Site Público
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Security Warning to replace temporary password */}
      {isTemporaryPassword && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Alerta de Segurança: Senha Temporária em Uso
              </h2>
              <p className="text-xs text-amber-800 mt-0.5">
                Você está utilizando a senha inicial <code className="font-mono bg-amber-100 px-1 rounded">admin4321</code>. Substitua-a na aba <strong>Configurações</strong> antes de publicar o site em produção.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('config')}
            className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded transition shrink-0"
          >
            Alterar Senha
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1 text-xs font-medium">
        {[
          { id: 'imoveis', label: `Imóveis (${properties.length})`, icon: Building2 },
          { id: 'leads', label: `Leads & Contatos (${leads.length})`, icon: Users },
          { id: 'landings', label: `Landing Pages (${landings.length})`, icon: LayoutTemplate },
          { id: 'config', label: 'Configurações & Senha', icon: Settings },
          { id: 'deploy', label: 'Guia de Deploy (Vercel/Firebase)', icon: ExternalLink },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setIsCreatingProp(false);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-[#0B2B20] text-[#0B2B20] font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: IMOVEIS */}
      {activeTab === 'imoveis' && (
        <div className="space-y-6">
          {/* Header Action */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0B2B20] font-editorial">
              Gerenciamento de Imóveis
            </h2>
            {!isCreatingProp && (
              <button
                onClick={handleStartCreateProperty}
                className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] rounded-md transition shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Imóvel</span>
              </button>
            )}
          </div>

          {/* Success Notification */}
          {saveSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl flex items-center gap-2.5 shadow-sm animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{saveSuccessMsg}</span>
            </div>
          )}

          {/* Form to create/edit property */}
          {isCreatingProp ? (
            <form onSubmit={handleSaveProperty} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#0B2B20]">
                    {editingPropertyId ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    O imóvel será publicado no Cloud Firestore e fotos persistidas no Vercel Blob CDN.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatingProp(false)}
                  className="text-xs text-gray-500 hover:text-gray-800"
                >
                  Cancelar
                </button>
              </div>

              {saveError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Nome / Título do Imóvel *
                  </label>
                  <input
                    type="text"
                    required
                    value={propForm.title}
                    onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                    placeholder="Ex: Casa Geminada Duplex — Giovani"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Tipo de Imóvel
                  </label>
                  <select
                    value={propForm.type}
                    onChange={(e) => setPropForm({ ...propForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-[#0B2B20]"
                  >
                    <option value="Casa Geminada Duplex">Casa Geminada Duplex</option>
                    <option value="Sítio / Propriedade Rural">Sítio / Propriedade Rural</option>
                    <option value="Casa">Casa</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Terreno / Lote">Terreno / Lote</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Finalidade
                  </label>
                  <select
                    value={propForm.purpose}
                    onChange={(e) => setPropForm({ ...propForm, purpose: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-[#0B2B20]"
                  >
                    <option value="Venda">Venda</option>
                    <option value="Locação">Locação</option>
                    <option value="Venda e Locação">Venda e Locação</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Preço
                    </label>
                    <button
                      type="button"
                      onClick={() => setPropForm({ ...propForm, price: 'A consultar' })}
                      className={`text-[10px] px-2 py-0.5 rounded font-medium transition ${
                        !propForm.price || propForm.price.toLowerCase().includes('consultar')
                          ? 'bg-[#0B2B20] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      A consultar
                    </button>
                  </div>
                  <input
                    type="text"
                    value={propForm.price}
                    onChange={(e) => setPropForm({ ...propForm, price: e.target.value })}
                    placeholder="Ex: R$ 450.000 ou A consultar"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                  />
                  <span className="block text-[10px] mt-1 text-gray-500">
                    {!propForm.price || propForm.price.toLowerCase().includes('consultar') ? (
                      <span className="text-amber-700 font-medium">Exibição: <strong>A consultar</strong></span>
                    ) : (
                      <span className="text-emerald-700 font-medium">Exibição: <strong>{propForm.price}</strong></span>
                    )}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    required
                    value={propForm.city}
                    onChange={(e) => setPropForm({ ...propForm, city: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={propForm.neighborhood}
                    onChange={(e) => setPropForm({ ...propForm, neighborhood: e.target.value })}
                    placeholder="Bairro ou Região"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Área
                  </label>
                  <input
                    type="text"
                    value={propForm.area}
                    onChange={(e) => setPropForm({ ...propForm, area: e.target.value })}
                    placeholder="Ex: 1.800 m² ou 140 m²"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Quartos
                  </label>
                  <input
                    type="text"
                    value={propForm.bedrooms}
                    onChange={(e) => setPropForm({ ...propForm, bedrooms: e.target.value })}
                    placeholder="Ex: 3"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Banheiros
                  </label>
                  <input
                    type="text"
                    value={propForm.bathrooms}
                    onChange={(e) => setPropForm({ ...propForm, bathrooms: e.target.value })}
                    placeholder="Ex: 2"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Vagas
                  </label>
                  <input
                    type="text"
                    value={propForm.garages}
                    onChange={(e) => setPropForm({ ...propForm, garages: e.target.value })}
                    placeholder="Ex: 1"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Descrição Completa
                </label>
                <textarea
                  rows={4}
                  required
                  value={propForm.description}
                  onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Diferenciais (um por linha)
                </label>
                <textarea
                  rows={3}
                  value={propForm.featuresStr}
                  onChange={(e) => setPropForm({ ...propForm, featuresStr: e.target.value })}
                  placeholder="3 quartos (1 suíte)&#10;Garagem privativa&#10;Acabamento moderno"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                />
              </div>

              {/* Gestão Completa de Fotos: Upload do Dispositivo, Vercel Blob e Marca d'Água Oficial */}
              <div className="pt-2">
                <PhotoUploader
                  images={propForm.images}
                  coverImage={propForm.coverImage}
                  onUploadingChange={setIsUploadingPhotos}
                  onChangeImages={(newImgs) =>
                    setPropForm((prev) => ({
                      ...prev,
                      images: newImgs,
                      imagesStr: newImgs.join('\n'),
                    }))
                  }
                  onChangeCoverImage={(newCover) =>
                    setPropForm((prev) => ({
                      ...prev,
                      coverImage: newCover,
                    }))
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featCheck"
                  checked={propForm.isFeatured}
                  onChange={(e) => setPropForm({ ...propForm, isFeatured: e.target.checked })}
                  className="rounded text-[#0B2B20] focus:ring-[#0B2B20]"
                />
                <label htmlFor="featCheck" className="text-xs text-gray-700 font-semibold cursor-pointer">
                  Destacar este imóvel na página inicial
                </label>
              </div>

              {saveError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <div className="text-[11px] text-gray-500">
                  {isUploadingPhotos ? (
                    <span className="text-amber-700 font-medium flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Enviando fotografias para o Vercel Blob CDN...
                    </span>
                  ) : isSaving ? (
                    <span className="text-blue-700 font-medium flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Salvando dados no Cloud Firestore e sincronizando...
                    </span>
                  ) : (
                    <span>Pronto para publicação. Clique em Salvar Imóvel.</span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => setIsCreatingProp(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || isUploadingPhotos}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition shadow"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Salvando Imóvel...</span>
                      </>
                    ) : isUploadingPhotos ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Aguarde Upload...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Salvar Imóvel</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Properties Table */
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-4 py-3">Imóvel</th>
                      <th className="px-4 py-3">Tipo / Finalidade</th>
                      <th className="px-4 py-3">Localização</th>
                      <th className="px-4 py-3">Fotos</th>
                      <th className="px-4 py-3">Preço</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {properties.map((p) => {
                      const pImages = Array.isArray(p.images) ? p.images : [];
                      const pCover = p.coverImage || pImages[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
                      const pLoc = p.location || { city: 'Minas Gerais', state: 'MG' };
                      return (
                        <tr key={p.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-10 rounded overflow-hidden bg-gray-100 shrink-0">
                                <img
                                  src={pCover}
                                  alt={p.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                  <span>{p.title}</span>
                                  {p.isFeatured && (
                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-1.5 py-0.2 rounded">
                                      Destaque
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-gray-400">/{p.slug}</span>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <span className="font-medium text-gray-700 block">{p.type}</span>
                            <span className="text-[10px] text-gray-500">{p.purpose}</span>
                          </td>

                          <td className="px-4 py-3 text-gray-600">
                            {pLoc.neighborhood ? `${pLoc.neighborhood}, ` : ''}{pLoc.city}
                          </td>

                          <td className="px-4 py-3 text-gray-600 font-mono">
                            {pImages.length} fotos
                          </td>

                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {!p.price || p.price.toLowerCase().includes('consultar') ? (
                            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200">
                              A consultar
                            </span>
                          ) : (
                            <span className="text-[#0B2B20] font-bold">
                              {p.price}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => onPreviewProperty(p)}
                            title="Visualizar no site público"
                            className="p-1.5 text-gray-600 hover:text-[#0B2B20] rounded hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleCreateLanding(p.id)}
                            title="Criar Landing Page Exclusiva"
                            className="p-1.5 text-amber-600 hover:text-amber-800 rounded hover:bg-amber-50"
                          >
                            <LayoutTemplate className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleStartEditProperty(p)}
                            title="Editar"
                            className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteProperty(p.id)}
                            title="Excluir"
                            className="p-1.5 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LEADS */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0B2B20] font-editorial">
              Contatos e Solicitações Recebidas
            </h2>
            <span className="text-xs text-gray-500">
              Total de contatos registrados: {leads.length}
            </span>
          </div>

          {leads.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-4 py-3">Data</th>
                      <th className="px-4 py-3">Nome / Contato</th>
                      <th className="px-4 py-3">Tipo / Imóvel</th>
                      <th className="px-4 py-3">Mensagem</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {new Date(l.createdAt).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(l.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-900">{l.name}</div>
                          <div className="text-[11px] text-emerald-700 font-mono">{l.phone}</div>
                          {l.email && <div className="text-[10px] text-gray-500">{l.email}</div>}
                        </td>

                        <td className="px-4 py-3">
                          <span className="uppercase text-[10px] font-bold text-gray-500 tracking-wider block">
                            {l.type}
                          </span>
                          <span className="text-gray-800 font-medium">
                            {l.propertyTitle || 'Contato Geral'}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                          {l.message || '—'}
                        </td>

                        <td className="px-4 py-3">
                          <select
                            value={l.status}
                            onChange={(e) => {
                              updateLeadStatus(l.id, e.target.value as any);
                              onRefreshData();
                            }}
                            className={`text-[11px] font-semibold rounded px-2 py-1 border ${
                              l.status === 'novo'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : l.status === 'em_atendimento'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            <option value="novo">Novo</option>
                            <option value="em_atendimento">Em Atendimento</option>
                            <option value="concluido">Concluído</option>
                          </select>
                        </td>

                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <a
                            href={`https://wa.me/55${l.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá, ${l.name}! Aqui é Thiago Teixeira, corretor da TFT Imóveis.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#25D366] hover:bg-[#20BA5A] text-white text-[11px] font-semibold rounded transition"
                          >
                            <MessageCircle className="w-3 h-3 fill-current" />
                            <span>Chamar</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-xs text-gray-500">
              Nenhum contato recebido ainda. Formulários preenchidos no site público aparecerão aqui.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LANDINGS */}
      {activeTab === 'landings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0B2B20] font-editorial">
                Landing Pages de Empreendimentos (/landing/[slug])
              </h2>
              <p className="text-xs text-gray-500">
                Páginas comerciais exclusivas com layout de alta conversão geradas a partir dos imóveis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {landings.map((land) => {
              const prop = properties.find((p) => p.id === land.propertyId);
              return (
                <div key={land.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#C8A251] tracking-wider block">
                        Imóvel: {prop?.title || 'Imóvel'}
                      </span>
                      <h3 className="text-base font-bold text-[#0B2B20] font-editorial">
                        {land.headline}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded">
                      Publicada
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2">
                    {land.subheadline}
                  </p>

                  <div className="p-3 bg-gray-50 rounded-lg text-xs font-mono text-gray-700 flex items-center justify-between">
                    <span>/landing/{land.slug}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/landing/${land.slug}`);
                        alert('Link público copiado!');
                      }}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                    <button
                      onClick={() => onPreviewLanding(land.slug)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#0B2B20] hover:text-[#C8A251] transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Abrir Landing Page</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CONFIGURAÇÕES & SENHA */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Site Contacts Config */}
          <form onSubmit={handleSaveConfig} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#0B2B20] font-editorial border-b border-gray-100 pb-2">
              Configurações da Marca & Canais
            </h2>

            {configSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Configurações salvas com sucesso!</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Nome do Corretor
              </label>
              <input
                type="text"
                value={siteConfig.brokerName}
                onChange={(e) => setSiteConfigState({ ...siteConfig, brokerName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                WhatsApp Oficial (apenas números com DDI: ex 5531989668814)
              </label>
              <input
                type="text"
                value={siteConfig.whatsappNumber}
                onChange={(e) => setSiteConfigState({ ...siteConfig, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Telefone de Exibição
              </label>
              <input
                type="text"
                value={siteConfig.phoneDisplay}
                onChange={(e) => setSiteConfigState({ ...siteConfig, phoneDisplay: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                E-mail Comercial
              </label>
              <input
                type="email"
                value={siteConfig.email}
                onChange={(e) => setSiteConfigState({ ...siteConfig, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={siteConfig.instagramUrl}
                onChange={(e) => setSiteConfigState({ ...siteConfig, instagramUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Vercel Blob Storage Token
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Insira seu <strong>BLOB_READ_WRITE_TOKEN</strong> para persistir uploads de fotos de imóveis diretamente na nuvem da Vercel.
                  </p>
                </div>
                {siteConfig.vercelBlobToken && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
                    Token Salvo
                  </span>
                )}
              </div>
              <input
                type="password"
                value={siteConfig.vercelBlobToken || ''}
                onChange={(e) => setSiteConfigState({ ...siteConfig, vercelBlobToken: e.target.value })}
                placeholder="vercel_blob_rw_..."
                className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
              />
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center gap-4">
              <div className="h-16 w-auto shrink-0 flex items-center justify-center p-2 bg-[#0B2B20] rounded-lg">
                <img
                  src="https://i.postimg.cc/DzTYyHj7/Logo-TFT-Corretor-Imobiliario-em-Verde.png"
                  alt="Logo Oficial TFT"
                  className="h-12 w-auto object-contain filter drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)]"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#0B2B20] block">
                  Logotipo Oficial e Marca d'Água Ativa
                </span>
                <p className="text-[11px] text-gray-600">
                  Logo oficial com fundo transparente configurada como identidade visual do site e aplicada nas fotos dos empreendimentos.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] rounded-md transition shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </form>

          {/* Change Admin Password */}
          <form onSubmit={handleChangePassword} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#0B2B20] font-editorial border-b border-gray-100 pb-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#C8A251]" />
              <span>Substituição da Senha do Painel</span>
            </h2>

            <p className="text-xs text-gray-600 leading-relaxed">
              Conforme exigido pelo projeto, a senha temporária inicial (<code className="font-mono bg-gray-100 px-1">admin4321</code>) deve ser alterada antes da disponibilização pública do site.
            </p>

            {passwordChangedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Nova senha salva com sucesso!</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Nova Senha (mínimo 6 dígitos)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha segura"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-md transition shadow"
              >
                Atualizar Senha
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: GUIA DE DEPLOY */}
      {activeTab === 'deploy' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-[#0B2B20] font-editorial">
              Guia Completo para Publicação na Vercel e Firebase
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Checklist passo a passo conforme as especificações das seções 15, 16, 17 e 21.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <div className="p-4 bg-gray-50 rounded-xl space-y-2">
              <h3 className="font-bold text-[#0B2B20]">1. Publicação na Vercel (Front-end & Edge)</h3>
              <p>Conecte o repositório GitHub à sua conta na Vercel. O framework pré-configurado é Vite/React.</p>
              <p className="font-mono text-xs bg-white p-2 rounded border border-gray-200">
                Build Command: npm run build | Output Directory: dist
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-2">
              <h3 className="font-bold text-[#0B2B20]">2. Configuração do Firebase Authentication & Cloud Firestore</h3>
              <p>No Firebase Console, crie um projeto, habilite o Authentication (E-mail/Senha) e crie o banco Cloud Firestore no modo de produção.</p>
              <p>Copie as variáveis do projeto e insira nas variáveis de ambiente da Vercel conforme especificado em <code className="font-mono bg-white px-1">.env.example</code>.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-2">
              <h3 className="font-bold text-[#0B2B20]">3. Vercel Blob para Armazenamento de Fotografias</h3>
              <p>Na aba <em>Storage</em> do painel da Vercel, crie um Vercel Blob store e adicione o token <code className="font-mono bg-white px-1">BLOB_READ_WRITE_TOKEN</code> nas variáveis de ambiente.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-2">
              <h3 className="font-bold text-[#0B2B20]">4. Domínio e Verificação WhatsApp</h3>
              <p>Adicione seu domínio personalizado (ex: tftcorretor.com.br) nas configurações de domínio da Vercel e teste todos os botões de contato com o número oficial <code className="font-mono bg-white px-1">+55 31 98966-8814</code>.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
