import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Plus, 
  Image as ImageIcon, 
  MessageSquare, 
  Send, 
  Loader2, 
  Share2, 
  Save, 
  ArrowLeft, 
  Globe, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Twitter, 
  Zap, 
  ShieldCheck, 
  ShieldAlert, 
  Activity,
  Trash2,
  ExternalLink,
  RotateCcw,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { addTestimonialToSheet, fetchTestimonialsFromSheet, fetchSettingsFromSheet, updateSettingsInSheet, checkConnectivity } from '../services/sheetService';
import { getBanners, addBanner, deleteBanner, resetBannersToDefault, BannerItem } from '../services/bannerService';
import { uploadFileToCloudinary } from '../services/taskService';
import { SOCIAL_LINKS } from '../constants';

interface AdminDashboardProps {
  onClose: () => void;
  isLight?: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, isLight = false }) => {
  const [activeTab, setActiveTab] = useState<'clients' | 'social' | 'promo'>('promo');
  const [formData, setFormData] = useState({ name: '', logo: '', feedback: '' });
  
  // Custom Banner State
  const [localBanners, setLocalBanners] = useState<BannerItem[]>(getBanners);
  const [bannerMode, setBannerMode] = useState<'direct_image' | 'custom_card'>('direct_image');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    highlight: '',
    subtitle: '',
    tag: 'SPECIAL OFFER',
    cta: 'Explore Now',
    link: '/services',
    image: '',
    gradient: 'from-[#0A192F] via-[#0F3260] to-[#1E4E8C]'
  });

  const [socialData, setSocialData] = useState({
    facebook: SOCIAL_LINKS.facebook,
    instagram: SOCIAL_LINKS.instagram,
    linkedin: SOCIAL_LINKS.linkedin,
    twitter: SOCIAL_LINKS.twitter === '#' ? '' : SOCIAL_LINKS.twitter,
    whatsapp: SOCIAL_LINKS.whatsapp
  });
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const loadData = async () => {
    setFetching(true);
    try {
      const [clients, settings, ping] = await Promise.all([
        fetchTestimonialsFromSheet(),
        fetchSettingsFromSheet(),
        checkConnectivity()
      ]);
      
      const dataSuccess = clients !== null || settings !== null;
      setIsConnected(dataSuccess || ping);

      if (clients) setClientCount(clients.length);
      if (settings) {
        setSocialData({
          facebook: settings.facebook || '',
          instagram: settings.instagram || '',
          linkedin: settings.linkedin || '',
          twitter: settings.twitter || '',
          whatsapp: settings.whatsapp || ''
        });
      }
    } catch (e) {
      setIsConnected(false);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadData();
    setLocalBanners(getBanners());
  }, []);

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await addTestimonialToSheet(formData);
    if (result.success) {
      setSuccess(true);
      setFormData({ name: '', logo: '', feedback: '' });
      loadData();
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  // Direct Image File Upload Handler
  const handleDirectImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const uploadRes = await uploadFileToCloudinary(file);
      if (uploadRes.success && uploadRes.url) {
        setBannerForm(prev => ({
          ...prev,
          image: uploadRes.url!,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        }));
      } else {
        alert('Image upload failed: ' + (uploadRes.error || 'Network error'));
      }
    } catch (err: any) {
      alert('Error uploading image: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Add New Banner
  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.image) {
      alert('Please upload or provide a banner image.');
      return;
    }

    const isFullImage = bannerMode === 'direct_image';
    const finalTitle = bannerForm.title.trim() || (isFullImage ? 'Promotional Offer' : 'Special Service');

    setLoading(true);
    addBanner({
      isFullImage: isFullImage,
      title: finalTitle,
      highlight: bannerForm.highlight,
      subtitle: bannerForm.subtitle || (isFullImage ? '' : 'Special promotion by Zentrixs'),
      tag: bannerForm.tag || 'SPECIAL OFFER',
      cta: bannerForm.cta || 'Explore',
      link: bannerForm.link || '/services',
      image: bannerForm.image,
      gradient: bannerForm.gradient
    });
    setLocalBanners(getBanners());
    setBannerForm({
      title: '',
      highlight: '',
      subtitle: '',
      tag: 'SPECIAL OFFER',
      cta: 'Explore Now',
      link: '/services',
      image: '',
      gradient: 'from-[#0A192F] via-[#0F3260] to-[#1E4E8C]'
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setLoading(false);
  };

  const handleDeleteBanner = (id: string) => {
    if (window.confirm('Are you sure you want to delete this promotional banner?')) {
      deleteBanner(id);
      setLocalBanners(getBanners());
    }
  };

  const handleResetBanners = () => {
    if (window.confirm('Reset all banners to default 5 official service banners?')) {
      const reset = resetBannersToDefault();
      setLocalBanners(reset);
    }
  };

  const handleUpdateSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateSettingsInSheet(socialData);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  // Theme styling helpers
  const cmsBg = isLight ? 'bg-white' : 'bg-[#08090C]';
  const cmsBorder = isLight ? 'border-[#EDE2D3]' : 'border-white/10';
  const cmsInk = isLight ? 'text-[#2A2118]' : 'text-white';
  const cmsMuted = isLight ? 'text-[#8A7B68]' : 'text-zinc-500';
  const cmsFaint = isLight ? 'text-[#A89A88]' : 'text-zinc-600';
  const cmsInputBase = isLight
    ? 'bg-[#FDFBF7] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#A89A88] focus:border-[#EA552E] focus:bg-white'
    : 'bg-zinc-950 border-white/5 text-white placeholder:text-zinc-700';

  return (
    <div className={`w-full min-h-screen ${isLight ? 'bg-[#FFFCF8] text-[#2A2118]' : 'bg-[#030303] text-white'} p-6 md:p-12 font-sans selection:bg-cyan-500 selection:text-black`}>
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b pb-8 border-current/10">
        <div className="flex items-center gap-6">
          <button 
            onClick={onClose}
            className={`p-4 border rounded-full transition-all group ${cmsBg} ${cmsBorder} hover:border-cyan-500`}
            title="Exit Panel"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-all" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-cyan-400 font-bold">Zentrixs Core System</p>
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mt-1">Broadcast & Banner Console</h1>
          </div>
        </div>

        {/* Action Tabs */}
        <div className={`flex border p-1 rounded-2xl gap-1 ${cmsBg} ${cmsBorder}`}>
          <button 
            onClick={() => setActiveTab('promo')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${activeTab === 'promo' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25' : `${cmsMuted} hover:${cmsInk}`}`}
          >
            Promotional Banners ({localBanners.length})
          </button>
          <button 
            onClick={() => setActiveTab('clients')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${activeTab === 'clients' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25' : `${cmsMuted} hover:${cmsInk}`}`}
          >
            Partners ({clientCount})
          </button>
          <button 
            onClick={() => setActiveTab('social')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${activeTab === 'social' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25' : `${cmsMuted} hover:${cmsInk}`}`}
          >
            Social Links
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PROMOTIONAL BANNERS (CREATE, PREVIEW, LIVE LIST, DELETE)             */}
      {/* ========================================================================= */}
      {activeTab === 'promo' && (
        <div className="space-y-10">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Create Banner Form */}
            <div className={`lg:col-span-6 border rounded-3xl p-6 sm:p-8 shadow-xl ${cmsBg} ${cmsBorder}`}>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-current/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-black tracking-tight ${cmsInk}`}>Add New Banner</h2>
                    <p className={`text-[11px] ${cmsMuted}`}>Will rotate automatically in the Client Portal home screen</p>
                  </div>
                </div>
                {success && (
                  <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    ✓ Deployed!
                  </span>
                )}
              </div>

              {/* Mode Toggle: Direct Image Upload vs Custom Styled Card */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl border bg-black/5 dark:bg-white/5 border-current/10">
                  <button
                    type="button"
                    onClick={() => setBannerMode('direct_image')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      bannerMode === 'direct_image'
                        ? 'bg-cyan-500 text-black shadow-md font-black'
                        : `${cmsMuted} hover:${cmsInk}`
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Direct Image Upload</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerMode('custom_card')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      bannerMode === 'custom_card'
                        ? 'bg-cyan-500 text-black shadow-md font-black'
                        : `${cmsMuted} hover:${cmsInk}`
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Styled Text Banner</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateBanner} className="space-y-4">
                {/* DIRECT IMAGE MODE */}
                {bannerMode === 'direct_image' ? (
                  <div className="space-y-4">
                    {/* File Drop / Select Area */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className={`block text-[11px] font-bold uppercase tracking-wider ${cmsMuted}`}>
                          Upload Banner Graphic *
                        </label>
                        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                          Recommended: 800 x 360 px (Ratio 2.2:1)
                        </span>
                      </div>
                      <label
                        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:border-cyan-400 group ${
                          bannerForm.image
                            ? 'border-emerald-500/50 bg-emerald-500/5'
                            : isLight ? 'border-[#EDE2D3] bg-[#FDFBF7]' : 'border-white/10 bg-black/40'
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleDirectImageUpload(file);
                          }}
                        />
                        {uploadingImage ? (
                          <div className="flex flex-col items-center gap-2 py-4">
                            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                            <p className="text-xs font-bold text-cyan-400">Uploading & processing banner...</p>
                          </div>
                        ) : bannerForm.image ? (
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            <p className="text-xs font-bold text-emerald-400">Image Ready to Deploy!</p>
                            <p className="text-[10px] text-zinc-400">Click to change or select another image</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 py-2">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <p className={`text-xs font-bold ${cmsInk}`}>Click to browse or drop banner image</p>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 bg-black/20 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-current/10">
                              <span className="text-cyan-400 font-bold">Standard Size: 800 x 360 px</span>
                              <span>•</span>
                              <span>Aspect Ratio: 2.2 : 1</span>
                            </div>
                            <p className="text-[9px] text-zinc-500">Supports PNG, JPG, WebP (Retina mobile & desktop friendly)</p>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* Or Paste URL */}
                    <div>
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${cmsMuted}`}>
                        Or Paste Direct Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... or hosted image URL"
                        value={bannerForm.image}
                        onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-medium outline-none ${cmsInputBase}`}
                      />
                    </div>

                    {/* Optional Action / Click Redirect */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${cmsMuted}`}>
                          Banner Title (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Summer Special Offer"
                          value={bannerForm.title}
                          onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                          className={`w-full border rounded-xl px-4 py-2.5 text-xs font-medium outline-none ${cmsInputBase}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${cmsMuted}`}>
                          Click Target Link (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. /services or /contact"
                          value={bannerForm.link}
                          onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                          className={`w-full border rounded-xl px-4 py-2.5 text-xs font-medium outline-none ${cmsInputBase}`}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* STYLED TEXT BANNER MODE */
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${cmsMuted}`}>Banner Headline *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. AI-Powered CRM Suite" 
                        required={bannerMode === 'custom_card'}
                        value={bannerForm.title} 
                        onChange={e => setBannerForm({...bannerForm, title: e.target.value})}
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-medium outline-none ${cmsInputBase}`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${cmsMuted}`}>Tag / Badge</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 50% OFF · EXCLUSIVE" 
                          value={bannerForm.tag} 
                          onChange={e => setBannerForm({...bannerForm, tag: e.target.value})}
                          className={`w-full border rounded-xl px-4 py-2.5 text-xs font-medium outline-none ${cmsInputBase}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${cmsMuted}`}>Highlight Sub-Text</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Zero Setup Cost" 
                          value={bannerForm.highlight} 
                          onChange={e => setBannerForm({...bannerForm, highlight: e.target.value})}
                          className={`w-full border rounded-xl px-4 py-2.5 text-xs font-medium outline-none ${cmsInputBase}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${cmsMuted}`}>Subtitle / Description</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Capture 10x more leads automatically on WhatsApp & Web" 
                        value={bannerForm.subtitle} 
                        onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})}
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-medium outline-none ${cmsInputBase}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${cmsMuted}`}>Banner Image *</label>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          placeholder="https://images.unsplash.com/... or upload" 
                          required={bannerMode === 'custom_card'}
                          value={bannerForm.image} 
                          onChange={e => setBannerForm({...bannerForm, image: e.target.value})}
                          className={`flex-1 border rounded-xl px-4 py-2.5 text-xs font-medium outline-none ${cmsInputBase}`}
                        />
                        <label className="px-3 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleDirectImageUpload(f);
                            }}
                          />
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Upload</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${cmsMuted}`}>CTA Button Text</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Get Started" 
                          value={bannerForm.cta} 
                          onChange={e => setBannerForm({...bannerForm, cta: e.target.value})}
                          className={`w-full border rounded-xl px-4 py-2.5 text-xs font-medium outline-none ${cmsInputBase}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${cmsMuted}`}>Target Link</label>
                        <input 
                          type="text" 
                          placeholder="e.g. /services or /contact" 
                          value={bannerForm.link} 
                          onChange={e => setBannerForm({...bannerForm, link: e.target.value})}
                          className={`w-full border rounded-xl px-4 py-2.5 text-xs font-medium outline-none ${cmsInputBase}`}
                        />
                      </div>
                    </div>

                    {/* Theme Gradient Preset Selector */}
                    <div>
                      <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${cmsMuted}`}>Theme Color Preset</label>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { name: 'Teal', grad: 'from-[#042F2E] via-[#0F766E] to-[#115E59]' },
                          { name: 'Blue', grad: 'from-[#030914] via-[#071933] to-[#0A2540]' },
                          { name: 'Orange', grad: 'from-[#170802] via-[#2F1106] to-[#451808]' },
                          { name: 'Purple', grad: 'from-[#0E041A] via-[#1C0A30] to-[#2B0E4A]' },
                          { name: 'Rose', grad: 'from-[#17030B] via-[#2E0716] to-[#420A20]' },
                        ].map((p) => (
                          <button
                            type="button"
                            key={p.name}
                            onClick={() => setBannerForm({ ...bannerForm, gradient: p.grad })}
                            className={`h-8 rounded-lg bg-gradient-to-r ${p.grad} border-2 transition-all cursor-pointer ${
                              bannerForm.gradient === p.grad ? 'border-white scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                            title={p.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish & Add to Carousel</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Live Card Preview */}
            <div className={`lg:col-span-6 border rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl ${cmsBg} ${cmsBorder}`}>
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-current/10">
                  <h3 className={`text-base font-bold uppercase tracking-wider ${cmsInk}`}>Live Mockup Preview</h3>
                  <span className={`text-[10px] font-mono ${cmsMuted}`}>Portal Real-Time Renderer</span>
                </div>

                {/* Simulated Banner Preview */}
                {bannerMode === 'direct_image' ? (
                  <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-black/40 relative">
                    {bannerForm.image ? (
                      <div className="relative w-full h-44 group">
                        <img src={bannerForm.image} alt="Banner Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                          <span className="text-xs font-bold truncate">{bannerForm.title || 'Direct Graphic Banner'}</span>
                          {bannerForm.link && (
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full border border-white/20 font-mono">
                              Redirects: {bannerForm.link}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-44 flex flex-col items-center justify-center text-zinc-500 gap-2 border-2 border-dashed border-white/10 rounded-2xl">
                        <UploadCloud className="w-8 h-8 opacity-40" />
                        <span className="text-xs font-mono">Upload an image on the left to see live mockup</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`rounded-2xl p-4 sm:p-5 bg-gradient-to-r ${bannerForm.gradient} border border-white/20 shadow-xl text-white relative overflow-hidden`}>
                    <div className="relative z-10 flex items-center justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[8px] font-black font-mono uppercase bg-white/15 border border-white/20">
                          {bannerForm.tag || 'PROMOTION'}
                        </span>
                        <h4 className="text-sm sm:text-base font-black truncate">{bannerForm.title || 'Your Banner Headline'}</h4>
                        <p className="text-[10px] text-cyan-300 font-bold">{bannerForm.highlight || 'Highlight Accent'}</p>
                        <p className="text-[9px] text-zinc-300 line-clamp-1">{bannerForm.subtitle || 'Subtitle / description here'}</p>
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black text-[10px] font-bold">
                            {bannerForm.cta || 'Explore'}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>

                      <div className="w-24 h-20 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-black/40">
                        {bannerForm.image ? (
                          <img src={bannerForm.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-500 font-mono">Image Preview</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-current/10 flex items-center justify-between">
                <span className={`text-xs ${cmsMuted}`}>Total Active in Rotation: <strong className={cmsInk}>{localBanners.length}</strong></span>
                <button
                  type="button"
                  onClick={handleResetBanners}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-500 hover:bg-amber-500/10 border border-amber-500/20 transition-all cursor-pointer"
                  title="Reset to default 5 official banners"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Banners Management Table / Grid */}
          <div className={`border rounded-3xl p-6 sm:p-8 shadow-xl ${cmsBg} ${cmsBorder}`}>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-current/10">
              <div>
                <h3 className={`text-lg font-black uppercase tracking-tight ${cmsInk}`}>Active Banner Carousel Queue</h3>
                <p className={`text-xs ${cmsMuted}`}>Banners appear and auto-scroll in this exact order</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localBanners.map((b, idx) => (
                <div 
                  key={b.id}
                  className={`border rounded-2xl p-4 flex flex-col justify-between gap-3 relative transition-all duration-200 hover:border-cyan-500/40 ${
                    isLight ? 'bg-[#FDFBF7] border-[#EDE2D3]' : 'bg-white/[0.02] border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/15 shrink-0 bg-black/40">
                      <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">Slide {idx + 1}</span>
                        {b.tag && (
                          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/30 text-zinc-300 truncate max-w-[100px]">
                            {b.tag}
                          </span>
                        )}
                      </div>
                      <h4 className={`text-xs font-bold truncate mt-0.5 ${cmsInk}`}>{b.title}</h4>
                      <p className={`text-[10px] line-clamp-1 ${cmsMuted}`}>{b.subtitle}</p>
                      <span className="text-[9px] text-zinc-500 font-mono mt-1 block truncate">Link: {b.link}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-current/10">
                    <span className="text-[9px] text-zinc-500 font-mono">CTA: <strong>{b.cta || 'Explore'}</strong></span>
                    <button
                      type="button"
                      onClick={() => handleDeleteBanner(b.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-red-500 hover:bg-red-500/10 border border-red-500/20 transition-all cursor-pointer"
                      title="Delete this banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CLIENT TESTIMONIALS                                                */}
      {/* ========================================================================= */}
      {activeTab === 'clients' && (
        <div className="grid lg:grid-cols-12 gap-10">
          <div className={`lg:col-span-8 border rounded-[3rem] p-12 shadow-xl ${cmsBg} ${cmsBorder}`}>
            <h2 className={`text-2xl font-black uppercase italic tracking-tighter mb-10 ${cmsInk}`}>Add Enterprise Partner</h2>
            <form onSubmit={handleSubmitTestimonial} className="space-y-8">
              <input 
                type="text" placeholder="CLIENT / COMPANY NAME" required
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className={`w-full border rounded-2xl px-8 py-5 text-sm font-medium outline-none uppercase ${cmsInputBase} focus:border-cyan-500`}
              />
              <input 
                type="text" placeholder="LOGO URL (OPTIONAL)"
                value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})}
                className={`w-full border rounded-2xl px-8 py-5 text-sm font-medium outline-none ${cmsInputBase} focus:border-cyan-500`}
              />
              <textarea 
                placeholder="CLIENT FEEDBACK..." required rows={4}
                value={formData.feedback} onChange={e => setFormData({...formData, feedback: e.target.value})}
                className={`w-full border rounded-2xl p-8 text-sm font-medium outline-none ${cmsInputBase} focus:border-cyan-500`}
              />
              <button 
                type="submit" disabled={loading}
                className={`w-full py-6 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase transition-all ${success ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-500'}`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Deploy To Core'}
              </button>
            </form>
          </div>
          <div className={`lg:col-span-4 border rounded-[3rem] p-12 ${cmsBg} ${cmsBorder}`}>
            <h3 className={`text-xl font-black uppercase italic mb-6 ${cmsInk}`}>Status</h3>
            <p className={`text-sm ${cmsMuted}`}>Active client partners fetched from database.</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SOCIAL LINKS                                                       */}
      {/* ========================================================================= */}
      {activeTab === 'social' && (
        <div className={`border rounded-[3rem] p-12 shadow-xl max-w-2xl mx-auto ${cmsBg} ${cmsBorder}`}>
          <h2 className={`text-2xl font-black uppercase italic tracking-tighter mb-8 ${cmsInk}`}>Social Network Links</h2>
          <form onSubmit={handleUpdateSocials} className="space-y-6">
            <input 
              type="text" placeholder="FACEBOOK URL"
              value={socialData.facebook} onChange={e => setSocialData({...socialData, facebook: e.target.value})}
              className={`w-full border rounded-2xl px-6 py-4 text-xs font-medium outline-none ${cmsInputBase}`}
            />
            <input 
              type="text" placeholder="INSTAGRAM URL"
              value={socialData.instagram} onChange={e => setSocialData({...socialData, instagram: e.target.value})}
              className={`w-full border rounded-2xl px-6 py-4 text-xs font-medium outline-none ${cmsInputBase}`}
            />
            <input 
              type="text" placeholder="LINKEDIN URL"
              value={socialData.linkedin} onChange={e => setSocialData({...socialData, linkedin: e.target.value})}
              className={`w-full border rounded-2xl px-6 py-4 text-xs font-medium outline-none ${cmsInputBase}`}
            />
            <input 
              type="text" placeholder="WHATSAPP NUMBER"
              value={socialData.whatsapp} onChange={e => setSocialData({...socialData, whatsapp: e.target.value})}
              className={`w-full border rounded-2xl px-6 py-4 text-xs font-medium outline-none ${cmsInputBase}`}
            />
            <button 
              type="submit" disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-[10px] tracking-[0.4em] uppercase transition-all ${success ? 'bg-green-600' : 'bg-cyan-600 hover:bg-cyan-500 shadow-2xl active:scale-95'}`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Save Settings'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
