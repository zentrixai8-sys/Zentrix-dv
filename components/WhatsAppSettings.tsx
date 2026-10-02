import React, { useState, useEffect, useRef } from 'react';
import { 
  Key, 
  Lock, 
  Unlock, 
  MessageSquare, 
  Send, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Smartphone, 
  Layers, 
  FileText, 
  Check, 
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Info,
  History,
  Search,
  Trash2,
  Filter,
  ArrowUpRight,
  Sparkles,
  Zap,
  Shield
} from 'lucide-react';
import { 
  WhatsAppConfig, 
  WhatsAppTemplate, 
  WhatsAppLogEntry,
  getWhatsAppConfig, 
  saveWhatsAppConfig, 
  fetchMetaTemplates, 
  sendTicketWhatsAppNotification,
  getWhatsAppLogs,
  clearWhatsAppLogs,
  DEFAULT_META_TEMPLATES
} from '../services/whatsappService';
import { getStoredTheme, PortalTheme } from '../services/themeService';

interface WhatsAppSettingsProps {
  onClose?: () => void;
  isLight?: boolean;
}

export const WhatsAppSettings: React.FC<WhatsAppSettingsProps> = ({ onClose, isLight: isLightProp }) => {
  const [internalTheme, setInternalTheme] = useState<PortalTheme>(getStoredTheme);

  useEffect(() => {
    const handleThemeEvent = () => setInternalTheme(getStoredTheme());
    window.addEventListener('zentrix_theme_change', handleThemeEvent);
    return () => window.removeEventListener('zentrix_theme_change', handleThemeEvent);
  }, []);

  const isLight = isLightProp !== undefined ? isLightProp : internalTheme === 'light';

  // Security PIN state (Required PIN is 5002)
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Settings sub-tab: 'credentials' | 'templates' | 'logs'
  const [settingsTab, setSettingsTab] = useState<'credentials' | 'templates' | 'logs'>('credentials');

  // WhatsApp Meta Config
  const [config, setConfig] = useState<WhatsAppConfig>(getWhatsAppConfig());
  const [showToken, setShowToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Test send state
  const [testNumber, setTestNumber] = useState('');
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Templates state
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(DEFAULT_META_TEMPLATES);
  const [fetchingTemplates, setFetchingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate>(DEFAULT_META_TEMPLATES[0]);
  const [templateNotice, setTemplateNotice] = useState<string | null>(null);

  // Logs state
  const [logs, setLogs] = useState<WhatsAppLogEntry[]>([]);
  const [logSearch, setLogSearch] = useState('');
  const [logStatusFilter, setLogStatusFilter] = useState<'ALL' | 'SENT' | 'FAILED'>('ALL');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedLogDetail, setSelectedLogDetail] = useState<WhatsAppLogEntry | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
        setStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const loaded = getWhatsAppConfig();
    setConfig(loaded);
    if (loaded.testPhoneNumber) {
      setTestNumber(loaded.testPhoneNumber);
    }
    setLogs(getWhatsAppLogs());
  }, []);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '5002') {
      setIsUnlocked(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleSaveConfig = () => {
    setIsSaving(true);
    const updated = saveWhatsAppConfig({
      ...config,
      testPhoneNumber: testNumber
    });
    setConfig(updated);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleSendTestMessage = async () => {
    if (!testNumber.trim()) {
      setTestResult({ success: false, message: 'Please enter a valid recipient WhatsApp number (with country code).' });
      return;
    }

    setTestSending(true);
    setTestResult(null);

    const res = await sendTicketWhatsAppNotification({
      to: testNumber.trim(),
      personName: 'Deepak sahu',
      ticketNumber: 'tkt-2026-101',
      configOverride: config
    });

    setTestSending(false);
    setLogs(getWhatsAppLogs());
    if (res.success) {
      setTestResult({
        success: true,
        message: `Success! Meta WhatsApp message dispatched. (Msg ID: ${res.messageId || 'SENT'})`
      });
    } else {
      setTestResult({
        success: false,
        message: res.error || 'Failed to dispatch Meta WhatsApp notification. Please verify Phone Number ID & Access Token.'
      });
    }
  };

  const handleFetchTemplates = async () => {
    setFetchingTemplates(true);
    setTemplateNotice(null);
    try {
      const res = await fetchMetaTemplates(config);
      setTemplates(res.templates);
      if (res.templates.length > 0) {
        setSelectedTemplate(res.templates[0]);
      }
      if (res.source === 'meta') {
        setTemplateNotice('Templates fetched live from your Meta WhatsApp Business Account (WABA)!');
      } else {
        setTemplateNotice(res.error || 'Displaying pre-configured templates.');
      }
    } catch (err: any) {
      setTemplateNotice('Could not fetch templates from Meta API. Showing template preview.');
    } finally {
      setFetchingTemplates(false);
    }
  };

  // 1. PIN Lock Screen (Requires 5002) - Sleek, Compact & Advanced Enterprise Security
  if (!isUnlocked) {
    return (
      <div className="relative max-w-sm mx-auto my-6 animate-fade-in">
        {/* Subtle Ambient High-Tech Glow */}
        <div className="absolute -top-6 -left-6 w-40 h-40 bg-blue-500/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Compact Glassmorphic Card */}
        <div className={`relative rounded-3xl p-6 sm:p-7 border backdrop-blur-xl transition-all duration-300 shadow-2xl ${
          isLight
            ? 'bg-white/95 border-[#EDE2D3] shadow-[0_12px_36px_rgba(234,85,46,0.08),0_2px_8px_rgba(0,0,0,0.04)]'
            : 'bg-[#0F172A]/95 border-cyan-500/25 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.15)]'
        }`}>
          <div className="text-center space-y-5">
            
            {/* Sleek Compact Header Tag & Lock Icon */}
            <div className="flex flex-col items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                isLight
                  ? 'bg-[#FDF3E7] text-[#EA552E] border-[#F5D5C3]'
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
              }">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>SECURITY CLEARANCE REQUIRED</span>
              </div>

              {/* Compact Cyber Lock Icon */}
              <div className="relative">
                <div className={`w-13 h-13 rounded-2xl flex items-center justify-center border shadow-md transition-transform hover:scale-105 ${
                  isLight
                    ? 'bg-gradient-to-br from-[#FFF8F2] to-[#FDF3E7] border-[#EDE2D3] text-[#EA552E]'
                    : 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-cyan-500/40 text-cyan-400 shadow-cyan-500/10'
                }`}>
                  <Lock className="w-6 h-6" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg flex items-center justify-center text-[10px] text-white font-bold border shadow-sm ${
                  isLight
                    ? 'bg-[#EA552E] border-white'
                    : 'bg-cyan-500 border-slate-900 text-slate-950'
                }`}>
                  <Key className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-1">
              <h2 className={`text-lg font-black tracking-tight ${
                isLight ? 'text-[#2A2118]' : 'text-white'
              }`}>
                Protected Admin Settings
              </h2>
              <p className={`text-xs leading-relaxed max-w-xs mx-auto ${
                isLight ? 'text-[#8A7B68]' : 'text-slate-400'
              }`}>
                Enter security PIN to configure WhatsApp API & automated alerts.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleVerifyPin} className="space-y-4 pt-1">
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between px-1 text-[11px]">
                  <label className={`font-bold flex items-center gap-1 ${
                    isLight ? 'text-[#5C5244]' : 'text-slate-300'
                  }`}>
                    <Shield className="w-3 h-3 text-cyan-500" />
                    Security PIN
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    maxLength={10}
                    autoFocus
                    placeholder="• • • •"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      if (pinError) setPinError(false);
                    }}
                    className={`w-full py-3 px-10 text-center text-xl font-mono tracking-[0.4em] rounded-xl outline-none transition-all duration-200 border ${
                      isLight
                        ? pinError
                          ? 'bg-red-50 border-red-400 text-red-900'
                          : 'bg-[#FBF5EC] border-[#EDE2D3] text-[#2A2118] placeholder:text-[#C9BCA8] focus:border-[#EA552E] focus:bg-white focus:ring-2 focus:ring-[#EA552E]/15'
                        : pinError
                          ? 'bg-red-950/40 border-red-500 text-white'
                          : 'bg-black/50 border-white/15 text-white placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
                    }`}
                  />
                  <Key className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                    isLight ? 'text-[#B5A892]' : 'text-slate-500'
                  }`} />
                </div>

                {pinError && (
                  <div className={`p-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 animate-shake ${
                    isLight 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                    <span>Incorrect Security PIN. Please try again.</span>
                  </div>
                )}
              </div>

              {/* Sleek Action Button */}
              <button
                type="submit"
                className={`w-full py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 ${
                  isLight
                    ? 'bg-gradient-to-r from-[#F0653A] to-[#EA552E] hover:from-[#EA552E] hover:to-[#D9481F] shadow-[#EA552E]/25'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-cyan-500/25'
                }`}
              >
                <Unlock className="w-4 h-4" />
                <span>Verify & Access Settings</span>
              </button>
            </form>

            {/* Compact Security Footer */}
            <div className={`pt-2 border-t flex items-center justify-center gap-4 text-[10px] font-medium ${
              isLight ? 'border-[#EDE2D3] text-[#9C8F7D]' : 'border-white/10 text-slate-400'
            }`}>
              <span className="flex items-center gap-1">
                🛡️ 256-Bit Encrypted
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                🔒 Admin Clearance
              </span>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // 2. Unlocked WhatsApp Settings Interface
  return (
    <div className={`border rounded-2xl overflow-hidden space-y-6 transition-all ${
      isLight 
        ? 'bg-white border-[#EDE2D3] shadow-[0_12px_40px_rgba(0,0,0,0.06)]' 
        : 'bg-[#0B1120] border-white/10 shadow-2xl'
    }`}>
      {/* Top Header */}
      <div className={`border-b p-5 sm:p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
        isLight
          ? 'border-[#EDE2D3] bg-[#FBF9F5]'
          : 'border-white/10 bg-slate-900/60'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shadow-lg shadow-emerald-500/10">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg sm:text-xl font-bold tracking-wide ${
                isLight ? 'text-[#2A2118]' : 'text-white'
              }`}>
                Meta WhatsApp Cloud API Settings
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className={`text-xs ${
              isLight ? 'text-[#7A6B58]' : 'text-slate-400'
            }`}>
              Live automated WhatsApp dispatch to clients upon support ticket creation
            </p>
          </div>
        </div>

        {/* Tab Switcher & Lock Button */}
        <div className="flex items-center gap-3">
          <div className={`flex p-1 rounded-xl border text-xs font-bold transition-all ${
            isLight ? 'bg-[#EDE4D8]/60 border-[#EDE2D3]' : 'bg-black/40 border-white/10'
          }`}>
            <button
              onClick={() => setSettingsTab('credentials')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                settingsTab === 'credentials'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : isLight ? 'text-[#7A6B58] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              Credentials & API
            </button>
            <button
              onClick={() => setSettingsTab('templates')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                settingsTab === 'templates'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : isLight ? 'text-[#7A6B58] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Templates ({templates.length})
            </button>
            <button
              onClick={() => {
                setSettingsTab('logs');
                setLogs(getWhatsAppLogs());
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                settingsTab === 'logs'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : isLight ? 'text-[#7A6B58] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Dispatch Logs</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                isLight ? 'bg-[#EDE2D3] text-[#2A2118]' : 'bg-white/10 text-white'
              }`}>
                {logs.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsUnlocked(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
              isLight
                ? 'text-[#7A6B58] hover:text-red-600 bg-[#EDE4D8]/60 hover:bg-red-50 border-[#EDE2D3]'
                : 'text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border-white/10'
            }`}
            title="Lock WhatsApp settings"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Credentials & API Setup */}
      {settingsTab === 'credentials' && (
        <div className="p-5 sm:p-8 space-y-8">
          {/* Status banner */}
          <div className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isLight
              ? 'bg-blue-50/70 border-blue-200'
              : 'bg-gradient-to-r from-blue-900/20 via-cyan-900/10 to-transparent border-blue-500/20'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
              <div>
                <h4 className={`text-sm font-bold ${
                  isLight ? 'text-blue-900' : 'text-white'
                }`}>
                  Client WhatsApp Notifications Auto-Trigger
                </h4>
                <p className={`text-xs ${
                  isLight ? 'text-blue-700' : 'text-slate-400'
                }`}>
                  When a client raises a ticket, template <code className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">{config.templateName || 'help_ticket'}</code> will be sent directly to the client's phone.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.isEnabled}
                onChange={(e) => setConfig({ ...config, isEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-400 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              <span className={`ml-2.5 text-xs font-bold ${
                isLight ? 'text-[#2A2118]' : 'text-slate-300'
              }`}>
                {config.isEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone Number ID */}
            <div className="space-y-2">
              <label className={`block text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-[#5C4D3C]' : 'text-slate-300'
              }`}>
                WhatsApp Phone Number ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={config.phoneNumberId}
                onChange={(e) => setConfig({ ...config, phoneNumberId: e.target.value })}
                placeholder="e.g. 583920194829102"
                className={`w-full border rounded-xl px-4 py-3 text-sm font-mono outline-none transition-all ${
                  isLight
                    ? 'bg-[#FDFBF7] border-[#EDE2D3] focus:border-cyan-500 focus:bg-white text-[#2A2118] placeholder:text-[#9C8F7D]'
                    : 'bg-[#111A2E] border-white/10 focus:border-cyan-500 text-white placeholder:text-slate-600'
                }`}
              />
              <p className={`text-[11px] ${
                isLight ? 'text-[#8A7B68]' : 'text-slate-500'
              }`}>
                Found in Meta Developer Dashboard &gt; WhatsApp &gt; API Setup &gt; Phone number ID.
              </p>
            </div>

            {/* WABA ID */}
            <div className="space-y-2">
              <label className={`block text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-[#5C4D3C]' : 'text-slate-300'
              }`}>
                WhatsApp Business Account ID (WABA ID) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={config.wabaId}
                onChange={(e) => setConfig({ ...config, wabaId: e.target.value })}
                placeholder="e.g. 102938475610293"
                className={`w-full border rounded-xl px-4 py-3 text-sm font-mono outline-none transition-all ${
                  isLight
                    ? 'bg-[#FDFBF7] border-[#EDE2D3] focus:border-cyan-500 focus:bg-white text-[#2A2118] placeholder:text-[#9C8F7D]'
                    : 'bg-[#111A2E] border-white/10 focus:border-cyan-500 text-white placeholder:text-slate-600'
                }`}
              />
              <p className={`text-[11px] ${
                isLight ? 'text-[#8A7B68]' : 'text-slate-500'
              }`}>
                Required for fetching live templates and managing account assets.
              </p>
            </div>

            {/* Meta Permanent Access Token */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className={`block text-xs font-bold uppercase tracking-wider ${
                  isLight ? 'text-[#5C4D3C]' : 'text-slate-300'
                }`}>
                  Meta Permanent Access Token (System User Bearer Token) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 flex items-center gap-1 cursor-pointer font-semibold"
                >
                  {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showToken ? 'Hide' : 'Show Token'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={config.accessToken}
                  onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
                  placeholder="EAA..."
                  className={`w-full border rounded-xl px-4 py-3 text-sm font-mono outline-none transition-all pr-10 ${
                    isLight
                      ? 'bg-[#FDFBF7] border-[#EDE2D3] focus:border-cyan-500 focus:bg-white text-[#2A2118] placeholder:text-[#9C8F7D]'
                      : 'bg-[#111A2E] border-white/10 focus:border-cyan-500 text-white placeholder:text-slate-600'
                  }`}
                />
              </div>
              <p className={`text-[11px] ${
                isLight ? 'text-[#8A7B68]' : 'text-slate-500'
              }`}>
                Generate in Meta Business Settings &gt; System Users &gt; Generate Token with <code className={isLight ? 'text-[#5C4D3C] font-semibold' : 'text-slate-400'}>whatsapp_business_messaging</code> and <code className={isLight ? 'text-[#5C4D3C] font-semibold' : 'text-slate-400'}>whatsapp_business_management</code> scopes.
              </p>
            </div>

            {/* Template Name */}
            <div className="space-y-2">
              <label className={`block text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-[#5C4D3C]' : 'text-slate-300'
              }`}>
                Target Template Name
              </label>
              <input
                type="text"
                value={config.templateName}
                onChange={(e) => setConfig({ ...config, templateName: e.target.value })}
                placeholder="help_ticket"
                className={`w-full border rounded-xl px-4 py-3 text-sm font-mono outline-none transition-all ${
                  isLight
                    ? 'bg-[#FDFBF7] border-[#EDE2D3] focus:border-cyan-500 focus:bg-white text-[#2A2118] placeholder:text-[#9C8F7D]'
                    : 'bg-[#111A2E] border-white/10 focus:border-cyan-500 text-white placeholder:text-slate-600'
                }`}
              />
              <p className={`text-[11px] ${
                isLight ? 'text-[#8A7B68]' : 'text-slate-500'
              }`}>
                Matches the approved or in-review Meta template name (<code className="text-cyan-600 dark:text-cyan-400 font-semibold">help_ticket</code>).
              </p>
            </div>

            {/* Language Code */}
            <div className="space-y-2">
              <label className={`block text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-[#5C4D3C]' : 'text-slate-300'
              }`}>
                Language Code
              </label>
              <select
                value={config.languageCode}
                onChange={(e) => setConfig({ ...config, languageCode: e.target.value })}
                className={`w-full border rounded-xl px-4 py-3 text-sm font-mono outline-none transition-all cursor-pointer ${
                  isLight
                    ? 'bg-[#FDFBF7] border-[#EDE2D3] focus:border-cyan-500 focus:bg-white text-[#2A2118]'
                    : 'bg-[#111A2E] border-white/10 focus:border-cyan-500 text-white'
                }`}
              >
                <option value="en_US">en_US (English US)</option>
                <option value="en">en (English)</option>
                <option value="en_GB">en_GB (English UK)</option>
                <option value="hi">hi (Hindi)</option>
              </select>
              <p className={`text-[11px] ${
                isLight ? 'text-[#8A7B68]' : 'text-slate-500'
              }`}>
                Must match the exact language configured in your Meta template (English US = <code className={isLight ? 'text-[#5C4D3C] font-semibold' : 'text-slate-400'}>en_US</code>).
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className={`flex flex-wrap items-center justify-between gap-4 pt-4 border-t ${
            isLight ? 'border-[#EDE2D3]' : 'border-white/10'
          }`}>
            <div className="flex items-center gap-2">
              {saveSuccess && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" />
                  Credentials saved securely in Zentrixs system!
                </span>
              )}
            </div>

            <button
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Meta Credentials'}
            </button>
          </div>

          {/* Test Dispatch Console */}
          <div className={`border rounded-2xl p-5 sm:p-6 space-y-4 ${
            isLight
              ? 'bg-[#FAF7F2] border-[#EDE2D3]'
              : 'bg-[#111A2E]/70 border-white/10'
          }`}>
            <div className={`flex items-center gap-2 ${
              isLight ? 'text-[#2A2118]' : 'text-white'
            }`}>
              <Smartphone className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-sm font-bold tracking-wide">Test WhatsApp Message Dispatch</h3>
            </div>
            <p className={`text-xs ${
              isLight ? 'text-[#7A6B58]' : 'text-slate-400'
            }`}>
              Send a test message using template <code className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">{config.templateName || 'help_ticket'}</code> to verify that Meta Cloud API accepts your token and phone number ID.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={testNumber}
                onChange={(e) => setTestNumber(e.target.value)}
                placeholder="Enter WhatsApp Number with country code (e.g. 919876543210)"
                className={`flex-1 border rounded-xl px-4 py-2.5 text-xs font-mono outline-none ${
                  isLight
                    ? 'bg-white border-[#EDE2D3] focus:border-cyan-500 text-[#2A2118] placeholder:text-[#9C8F7D]'
                    : 'bg-[#0B1120] border-white/10 focus:border-cyan-500 text-white placeholder:text-slate-600'
                }`}
              />
              <button
                type="button"
                onClick={handleSendTestMessage}
                disabled={testSending}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {testSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {testSending ? 'Sending...' : 'Send Test Notification'}
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Templates */}
      {settingsTab === 'templates' && (
        <div className="p-5 sm:p-8 space-y-8">
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className={`text-base font-bold ${
                isLight ? 'text-[#2A2118]' : 'text-white'
              }`}>
                Meta WhatsApp Message Templates
              </h3>
              <p className={`text-xs ${
                isLight ? 'text-[#7A6B58]' : 'text-slate-400'
              }`}>
                Fetched from Meta Graph API using your WhatsApp Business Account ID (WABA ID).
              </p>
            </div>

            <button
              onClick={handleFetchTemplates}
              disabled={fetchingTemplates}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetchingTemplates ? 'animate-spin' : ''}`} />
              {fetchingTemplates ? 'Fetching from Meta...' : 'Fetch Live Templates'}
            </button>
          </div>

          {templateNotice && (
            <div className={`rounded-xl p-3 text-xs flex items-center gap-2 border ${
              isLight
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
            }`}>
              <Info className="w-4 h-4 shrink-0" />
              <span>{templateNotice}</span>
            </div>
          )}

          {/* Grid: Templates Table + Live WhatsApp Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Templates Table */}
            <div className={`lg:col-span-7 border rounded-2xl overflow-hidden ${
              isLight ? 'bg-[#FAF7F2] border-[#EDE2D3]' : 'bg-[#111A2E]/70 border-white/10'
            }`}>
              <div className={`p-4 border-b flex items-center justify-between ${
                isLight ? 'bg-[#F5EFEB] border-[#EDE2D3]' : 'bg-slate-900/40 border-white/10'
              }`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? 'text-[#5C4D3C]' : 'text-slate-300'
                }`}>
                  Registered Templates ({templates.length})
                </span>
                <span className={`text-[11px] font-mono ${
                  isLight ? 'text-[#9C8F7D]' : 'text-slate-500'
                }`}>
                  Meta Graph API v20.0
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`uppercase text-[10px] font-bold tracking-wider border-b ${
                    isLight 
                      ? 'bg-[#EDE4D8]/60 text-[#7A6B58] border-[#EDE2D3]' 
                      : 'bg-slate-950/60 text-slate-400 border-white/5'
                  }`}>
                    <tr>
                      <th className="py-3 px-4">Template Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Language</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className={isLight ? 'divide-y divide-[#EDE2D3]' : 'divide-y divide-white/5'}>
                    {templates.map((tpl) => {
                      const isSelected = selectedTemplate?.name === tpl.name;
                      const isReview = tpl.status === 'IN_REVIEW';
                      const isApproved = tpl.status === 'APPROVED';

                      return (
                        <tr
                          key={tpl.id || tpl.name}
                          onClick={() => setSelectedTemplate(tpl)}
                          className={`cursor-pointer transition-colors ${
                            isSelected 
                              ? (isLight ? 'bg-cyan-50' : 'bg-cyan-500/10') 
                              : (isLight ? 'hover:bg-[#F2ECE2]' : 'hover:bg-white/[0.02]')
                          }`}
                        >
                          <td className={`py-3.5 px-4 font-bold ${
                            isLight ? 'text-[#2A2118]' : 'text-white'
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className={`font-mono ${
                                isLight ? (isSelected ? 'text-cyan-700' : 'text-[#2A2118]') : 'text-cyan-300'
                              }`}>
                                {tpl.name}
                              </span>
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                              )}
                            </div>
                            <span className={`text-[10px] block truncate max-w-[180px] ${
                              isLight ? 'text-[#8A7B68]' : 'text-slate-500'
                            }`}>
                              {tpl.bodyText.substring(0, 30)}...
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] ${
                              isLight ? 'bg-[#EAE0D2] text-[#4A3D2E]' : 'bg-white/5 text-slate-300'
                            }`}>
                              {tpl.category}
                            </span>
                          </td>
                          <td className={`py-3.5 px-3 ${
                            isLight ? 'text-[#7A6B58]' : 'text-slate-400'
                          }`}>
                            {tpl.language}
                          </td>
                          <td className="py-3.5 px-3">
                            {isReview ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                In review
                              </span>
                            ) : isApproved ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Approved
                              </span>
                            ) : (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isLight ? 'bg-[#EAE0D2] text-[#4A3D2E]' : 'bg-slate-800 text-slate-300'
                              }`}>
                                {tpl.status}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfig({ ...config, templateName: tpl.name });
                                saveWhatsAppConfig({ templateName: tpl.name });
                                setSelectedTemplate(tpl);
                              }}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                config.templateName === tpl.name
                                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                                  : isLight 
                                    ? 'text-[#7A6B58] hover:text-[#2A2118] hover:bg-[#EDE4D8]/60' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              {config.templateName === tpl.name ? 'Active' : 'Select'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Dynamic Parameter Explainer */}
              <div className={`p-4 border-t space-y-2 ${
                isLight ? 'bg-[#F5EFEB] border-[#EDE2D3]' : 'bg-slate-950/80 border-white/5'
              }`}>
                <div className={`text-[11px] font-bold uppercase tracking-wider ${
                  isLight ? 'text-[#7A6B58]' : 'text-slate-400'
                }`}>
                  Automated Parameter Mapping on Ticket Creation
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#111A2E] border-white/5'
                  }`}>
                    <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">&#123;&#123;1&#125;&#125;</span>
                    <span className={`text-[11px] ${
                      isLight ? 'text-[#4A3D2E]' : 'text-slate-300'
                    }`}>
                      Client Name / Contact Person
                    </span>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#111A2E] border-white/5'
                  }`}>
                    <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">&#123;&#123;2&#125;&#125;</span>
                    <span className={`text-[11px] ${
                      isLight ? 'text-[#4A3D2E]' : 'text-slate-300'
                    }`}>
                      Ticket ID (e.g. tkt-2026-101)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Realistic WhatsApp Preview */}
            <div className="lg:col-span-5 flex flex-col">
              <div className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between ${
                isLight ? 'text-[#5C4D3C]' : 'text-slate-300'
              }`}>
                <span>Live Client Device Preview</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">WhatsApp for iOS/Android</span>
              </div>

              {/* WhatsApp Card Mockup */}
              <div className="flex-1 bg-[#0D1418] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                {/* Chat Top Bar */}
                <div className="bg-[#1F2C34] px-4 py-3 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                      Z
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">Zentrixs Automation</h4>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Official Business Account
                      </span>
                    </div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>

                {/* Chat Wallpaper Container */}
                <div 
                  className="flex-1 p-4 flex flex-col justify-center relative min-h-[300px]"
                  style={{
                    backgroundColor: '#0B141A',
                    backgroundImage: 'radial-gradient(#1f2c34 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}
                >
                  {/* WhatsApp Message Bubble */}
                  <div className="max-w-[92%] bg-[#005C4B] text-white rounded-2xl rounded-tl-sm p-4 shadow-lg border border-white/10 relative self-start space-y-3.5">
                    {/* Message Body */}
                    <p className="text-[13px] leading-relaxed text-slate-100">
                      Hi <span className="font-bold text-white">Deepak sahu</span>, thank you for contacting Zentrixs! 🙏
                    </p>

                    <p className="text-[13px] leading-relaxed text-slate-100">
                      Your support ticket <span className="font-bold text-white font-mono">tkt-2026-101</span> has been raised successfully.
                    </p>

                    <p className="text-[13px] leading-relaxed text-slate-100">
                      You can check your ticket status on our website.
                    </p>

                    {/* Timestamp & Double Checkmarks */}
                    <div className="flex items-center justify-end gap-1 pt-1 text-[10px] text-emerald-200">
                      <span>18:10</span>
                      <span className="text-cyan-300 font-bold">✓✓</span>
                    </div>
                  </div>
                </div>

                {/* Footer Notes */}
                <div className="bg-[#1F2C34]/80 p-3 text-center border-t border-white/5">
                  <span className="text-[11px] text-slate-400">
                    Template: <code className="text-cyan-400 font-bold font-mono">{selectedTemplate?.name || 'help_ticket'}</code> • Dispatched to registered client phone
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Dispatch Logs */}
      {settingsTab === 'logs' && (
        <div className="p-5 sm:p-8 space-y-6">
          {/* Top Info & Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className={`border rounded-2xl p-4 ${
              isLight ? 'bg-[#FAF7F2] border-[#EDE2D3]' : 'bg-[#111A2E] border-white/10'
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                isLight ? 'text-[#7A6B58]' : 'text-slate-400'
              }`}>
                Total Dispatched
              </span>
              <div className={`text-2xl font-black font-mono ${
                isLight ? 'text-[#2A2118]' : 'text-white'
              }`}>
                {logs.length}
              </div>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">Recorded messages</span>
            </div>

            <div className={`border rounded-2xl p-4 ${
              isLight ? 'bg-[#FAF7F2] border-emerald-500/30' : 'bg-[#111A2E] border-emerald-500/20'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">Delivered (Sent)</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-300 font-mono">
                {logs.filter(l => l.status === 'SENT').length}
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Meta API Accepted
              </span>
            </div>

            <div className={`border rounded-2xl p-4 ${
              isLight ? 'bg-[#FAF7F2] border-red-500/30' : 'bg-[#111A2E] border-red-500/20'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block mb-1">Failed Attempts</span>
              <div className="text-2xl font-black text-red-600 dark:text-red-300 font-mono">
                {logs.filter(l => l.status === 'FAILED').length}
              </div>
              <span className="text-[10px] text-red-600 dark:text-red-400">Error response</span>
            </div>

            <div className={`border rounded-2xl p-4 ${
              isLight ? 'bg-[#FAF7F2] border-[#EDE2D3]' : 'bg-[#111A2E] border-white/10'
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                isLight ? 'text-[#7A6B58]' : 'text-slate-400'
              }`}>
                Active Template
              </span>
              <div className={`text-base font-bold font-mono truncate ${
                isLight ? 'text-[#2A2118]' : 'text-white'
              }`}>
                {config.templateName || 'help_ticket'}
              </div>
              <span className={`text-[10px] font-mono ${
                isLight ? 'text-[#7A6B58]' : 'text-slate-400'
              }`}>
                {config.languageCode || 'en_US'}
              </span>
            </div>
          </div>

          {/* Search, Filter & Actions Bar */}
          <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border p-3.5 rounded-2xl ${
            isLight
              ? 'bg-[#FAF7F2] border-[#EDE2D3]'
              : 'bg-slate-900/60 border-white/10'
          }`}>
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  isLight ? 'text-[#9C8F7D]' : 'text-slate-500'
                }`} />
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="Search by client, phone, ticket ID, or template..."
                  className={`w-full border rounded-xl pl-10 pr-4 py-2 text-xs outline-none ${
                    isLight
                      ? 'bg-white border-[#EDE2D3] focus:border-cyan-500 text-[#2A2118] placeholder:text-[#9C8F7D]'
                      : 'bg-[#0B1120] border-white/10 focus:border-cyan-500 text-white placeholder:text-slate-500'
                  }`}
                />
              </div>

              {/* Premium Status Filter Dropdown */}
              <div className="relative" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                    statusDropdownOpen 
                      ? (isLight ? 'bg-white border-cyan-500 ring-2 ring-cyan-500/20 text-[#2A2118]' : 'bg-[#0B1120] border-cyan-400 ring-2 ring-cyan-500/20 text-white')
                      : (isLight ? 'bg-white hover:bg-[#F5EFEB] border-[#EDE2D3] text-[#2A2118]' : 'bg-[#0B1120] hover:bg-[#111A2E] border-white/10 text-slate-200')
                  }`}
                  aria-haspopup="listbox"
                  aria-expanded={statusDropdownOpen}
                >
                  <Filter className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  
                  {/* Status Indicator Dot */}
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    logStatusFilter === 'SENT' 
                      ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' 
                      : logStatusFilter === 'FAILED' 
                      ? 'bg-red-500 shadow-sm shadow-red-500/50' 
                      : 'bg-cyan-500 shadow-sm shadow-cyan-500/50'
                  }`} />
                  
                  <span className="whitespace-nowrap">
                    {logStatusFilter === 'ALL' && 'All Statuses'}
                    {logStatusFilter === 'SENT' && 'Delivered Only'}
                    {logStatusFilter === 'FAILED' && 'Failed Only'}
                  </span>
                  
                  <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                    statusDropdownOpen ? 'rotate-180 text-cyan-500' : (isLight ? 'text-[#9C8F7D]' : 'text-slate-400')
                  }`} />
                </button>

                {/* Dropdown Floating Menu */}
                {statusDropdownOpen && (
                  <div className={`absolute left-0 top-full mt-2 w-52 backdrop-blur-2xl border rounded-2xl p-1.5 shadow-2xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                    isLight
                      ? 'bg-white/95 border-[#EDE2D3] shadow-slate-300/50 text-[#2A2118]'
                      : 'bg-[#0B1120]/95 border-cyan-500/30 shadow-black/90 text-slate-200'
                  }`}>
                    <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b ${
                      isLight ? 'text-[#7A6B58] border-[#EDE2D3]' : 'text-slate-400 border-white/5'
                    }`}>
                      Filter Dispatch Logs
                    </div>

                    {[
                      { 
                        value: 'ALL', 
                        label: 'All Statuses', 
                        desc: 'Delivered & Failed logs', 
                        dotColor: 'bg-cyan-500 shadow-sm shadow-cyan-500/50' 
                      },
                      { 
                        value: 'SENT', 
                        label: 'Delivered Only', 
                        desc: 'Meta 200 OK Accepted', 
                        dotColor: 'bg-emerald-500 shadow-sm shadow-emerald-500/50' 
                      },
                      { 
                        value: 'FAILED', 
                        label: 'Failed Only', 
                        desc: 'Errors & delivery failures', 
                        dotColor: 'bg-red-500 shadow-sm shadow-red-500/50' 
                      }
                    ].map((opt) => {
                      const isSelected = logStatusFilter === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setLogStatusFilter(opt.value as any);
                            setStatusDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left ${
                            isSelected
                              ? (isLight ? 'bg-cyan-50 text-cyan-800 font-bold border border-cyan-200' : 'bg-cyan-500/15 text-white font-bold border border-cyan-500/30')
                              : (isLight ? 'text-[#4A3D2E] hover:text-[#2A2118] hover:bg-[#FAF7F2]' : 'text-slate-300 hover:text-white hover:bg-white/5')
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dotColor}`} />
                            <div>
                              <div className="font-semibold">{opt.label}</div>
                              <div className={`text-[10px] ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>{opt.desc}</div>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setLogs(getWhatsAppLogs())}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isLight
                    ? 'bg-[#EDE2D3]/60 hover:bg-[#EDE2D3] text-[#2A2118]'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
                title="Refresh log list"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all WhatsApp dispatch logs?')) {
                    clearWhatsAppLogs();
                    setLogs([]);
                  }
                }}
                className={`px-3 py-2 border rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isLight
                    ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                    : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border-red-500/20'
                }`}
                title="Clear all logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Logs</span>
              </button>
            </div>
          </div>

          {/* Logs Table */}
          {(() => {
            const filteredLogs = logs.filter((log) => {
              if (logStatusFilter !== 'ALL' && log.status !== logStatusFilter) return false;
              if (!logSearch.trim()) return true;
              const q = logSearch.toLowerCase();
              return (
                log.recipientName?.toLowerCase().includes(q) ||
                log.recipientPhone?.toLowerCase().includes(q) ||
                log.ticketNumber?.toLowerCase().includes(q) ||
                log.templateName?.toLowerCase().includes(q) ||
                log.messageId?.toLowerCase().includes(q)
              );
            });

            if (filteredLogs.length === 0) {
              return (
                <div className={`border rounded-2xl p-12 text-center space-y-3 ${
                  isLight ? 'bg-[#FAF7F2] border-[#EDE2D3]' : 'bg-[#111A2E]/50 border-white/10'
                }`}>
                  <History className={`w-10 h-10 mx-auto ${isLight ? 'text-[#9C8F7D]' : 'text-slate-600'}`} />
                  <h4 className={`text-sm font-bold ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>No WhatsApp Dispatch Logs Found</h4>
                  <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>
                    {logSearch.trim() || logStatusFilter !== 'ALL'
                      ? 'No logs match your search filter.'
                      : 'Logs will appear automatically here whenever tickets are raised by clients or test messages are sent.'}
                  </p>
                </div>
              );
            }

            return (
              <div className={`border rounded-2xl overflow-hidden shadow-xl ${
                isLight ? 'bg-[#FAF7F2] border-[#EDE2D3]' : 'bg-[#111A2E]/70 border-white/10'
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`uppercase text-[10px] font-bold tracking-wider border-b ${
                      isLight ? 'bg-[#EDE4D8]/60 text-[#7A6B58] border-[#EDE2D3]' : 'bg-slate-950/80 text-slate-400 border-white/5'
                    }`}>
                      <tr>
                        <th className="py-3.5 px-4">Date & Time</th>
                        <th className="py-3.5 px-4">Recipient (Client)</th>
                        <th className="py-3.5 px-3">Template Used</th>
                        <th className="py-3.5 px-3">Ticket / Trigger</th>
                        <th className="py-3.5 px-4">Message Snippet</th>
                        <th className="py-3.5 px-3">Status & Meta ID</th>
                      </tr>
                    </thead>
                    <tbody className={isLight ? 'divide-y divide-[#EDE2D3]' : 'divide-y divide-white/5'}>
                      {filteredLogs.map((log) => {
                        const isSent = log.status === 'SENT';
                        const dateObj = new Date(log.timestamp);
                        const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                        const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

                        return (
                          <tr
                            key={log.id}
                            onClick={() => setSelectedLogDetail(log)}
                            className={`transition-colors cursor-pointer ${
                              isLight ? 'hover:bg-[#F2ECE2]' : 'hover:bg-white/[0.03]'
                            }`}
                          >
                            {/* Timestamp */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className={`font-mono font-medium ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{formattedDate}</div>
                              <div className={`text-[10px] font-mono ${isLight ? 'text-[#7A6B58]' : 'text-slate-500'}`}>{formattedTime}</div>
                            </td>

                            {/* Recipient */}
                            <td className="py-4 px-4">
                              <div className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                                <span>{log.recipientName}</span>
                              </div>
                              <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono mt-0.5 flex items-center gap-1">
                                <Smartphone className={`w-3 h-3 shrink-0 ${isLight ? 'text-[#9C8F7D]' : 'text-slate-500'}`} />
                                {log.recipientPhone}
                              </div>
                            </td>

                            {/* Template Used */}
                            <td className="py-4 px-3 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-lg font-mono font-bold text-[11px] border block w-fit ${
                                isLight
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : 'bg-blue-500/10 text-cyan-300 border-blue-500/20'
                              }`}>
                                {log.templateName}
                              </span>
                              <span className={`text-[10px] block mt-1 font-mono ${isLight ? 'text-[#7A6B58]' : 'text-slate-500'}`}>
                                Lang: {log.language}
                              </span>
                            </td>

                            {/* Ticket / Trigger */}
                            <td className="py-4 px-3 whitespace-nowrap">
                              {log.ticketNumber ? (
                                <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] border ${
                                  isLight
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                                }`}>
                                  {log.ticketNumber}
                                </span>
                              ) : (
                                <span className={`text-[11px] ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>Direct Test</span>
                              )}
                              <span className={`text-[10px] block mt-1 ${isLight ? 'text-[#7A6B58]' : 'text-slate-500'}`}>
                                {log.triggerType === 'TICKET_CREATED' ? 'Ticket Auto-Send' : 'Manual Trigger'}
                              </span>
                            </td>

                            {/* Message Preview */}
                            <td className="py-4 px-4 max-w-xs">
                              <p className={`text-[11px] line-clamp-2 leading-relaxed font-sans ${
                                isLight ? 'text-[#4A3D2E]' : 'text-slate-300'
                              }`}>
                                {log.messagePreview || 'Standard ticket confirmation message'}
                              </p>
                            </td>

                            {/* Status & Message ID */}
                            <td className="py-4 px-3 whitespace-nowrap">
                              {isSent ? (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    DELIVERED
                                  </span>
                                  {log.messageId && (
                                    <span className={`text-[9px] font-mono block truncate max-w-[130px] ${
                                      isLight ? 'text-[#7A6B58]' : 'text-slate-500'
                                    }`} title={log.messageId}>
                                      ID: {log.messageId}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30">
                                    <AlertCircle className="w-3 h-3 text-red-500" />
                                    FAILED
                                  </span>
                                  {log.error && (
                                    <span className="text-[9px] text-red-500 block truncate max-w-[130px]" title={log.error}>
                                      {log.error}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className={`p-3.5 border-t flex items-center justify-between text-xs ${
                  isLight ? 'bg-[#F5EFEB] border-[#EDE2D3] text-[#7A6B58]' : 'bg-slate-950/80 border-white/5 text-slate-400'
                }`}>
                  <span>Showing {filteredLogs.length} of {logs.length} logged dispatches</span>
                  <span className={`text-[11px] ${isLight ? 'text-[#9C8F7D]' : 'text-slate-500'}`}>Click any row to view full payload</span>
                </div>
              </div>
            );
          })()}

          {/* Selected Log Detail Modal */}
          {selectedLogDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className={`w-full max-w-lg border rounded-3xl p-6 space-y-5 shadow-2xl ${
                isLight ? 'bg-white border-[#EDE2D3]' : 'bg-[#0F172A] border-white/20'
              }`}>
                <div className={`flex items-center justify-between pb-3 border-b ${
                  isLight ? 'border-[#EDE2D3]' : 'border-white/10'
                }`}>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <h3 className={`font-bold text-base ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>
                      WhatsApp Dispatch Details
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedLogDetail(null)}
                    className={`text-xl p-1 cursor-pointer ${isLight ? 'text-[#9C8F7D] hover:text-[#2A2118]' : 'text-slate-400 hover:text-white'}`}
                  >
                    &times;
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border ${
                    isLight ? 'bg-[#FAF7F2] border-[#EDE2D3]' : 'bg-black/40 border-white/5'
                  }`}>
                    <span className={`block text-[10px] uppercase ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>Recipient Client</span>
                    <strong className={`text-sm ${isLight ? 'text-[#2A2118]' : 'text-white'}`}>{selectedLogDetail.recipientName}</strong>
                    <span className="text-cyan-600 dark:text-cyan-400 font-mono block mt-0.5">{selectedLogDetail.recipientPhone}</span>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    isLight ? 'bg-[#FAF7F2] border-[#EDE2D3]' : 'bg-black/40 border-white/5'
                  }`}>
                    <span className={`block text-[10px] uppercase ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>Template & Language</span>
                    <strong className={`font-mono text-sm ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>{selectedLogDetail.templateName}</strong>
                    <span className={`font-mono block mt-0.5 ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>{selectedLogDetail.language}</span>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    isLight ? 'bg-[#FAF7F2] border-[#EDE2D3]' : 'bg-black/40 border-white/5'
                  }`}>
                    <span className={`block text-[10px] uppercase ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>Ticket Number</span>
                    <strong className={`font-mono text-sm ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>{selectedLogDetail.ticketNumber || 'N/A'}</strong>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    isLight ? 'bg-[#FAF7F2] border-[#EDE2D3]' : 'bg-black/40 border-white/5'
                  }`}>
                    <span className={`block text-[10px] uppercase ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>Dispatch Status</span>
                    <span className={`inline-block font-bold text-xs mt-0.5 ${selectedLogDetail.status === 'SENT' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {selectedLogDetail.status === 'SENT' ? '✓ Accepted by Meta' : '✕ Delivery Failed'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className={`block text-[10px] uppercase font-bold mb-1.5 ${isLight ? 'text-[#7A6B58]' : 'text-slate-400'}`}>Dispatched Message Body</span>
                  <div className={`border rounded-2xl p-4 text-xs leading-relaxed font-sans whitespace-pre-wrap ${
                    isLight ? 'bg-[#FAF7F2] border-[#EDE2D3] text-[#2A2118]' : 'bg-black/60 border-white/10 text-slate-200'
                  }`}>
                    {selectedLogDetail.messagePreview}
                  </div>
                </div>

                {selectedLogDetail.messageId && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs">
                    <span className={`text-[10px] uppercase block ${isLight ? 'text-emerald-800' : 'text-slate-400'}`}>Meta Message ID (WAMID)</span>
                    <span className="text-emerald-600 dark:text-emerald-300 font-mono text-[11px] break-all">{selectedLogDetail.messageId}</span>
                  </div>
                )}

                {selectedLogDetail.error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs">
                    <span className="text-red-600 dark:text-red-400 text-[10px] uppercase block">Failure Reason</span>
                    <span className="text-red-600 dark:text-red-300 text-[11px]">{selectedLogDetail.error}</span>
                  </div>
                )}

                <div className={`flex justify-end pt-2 border-t ${isLight ? 'border-[#EDE2D3]' : 'border-white/10'}`}>
                  <button
                    onClick={() => setSelectedLogDetail(null)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
