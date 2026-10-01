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
  ArrowUpRight
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

interface WhatsAppSettingsProps {
  onClose?: () => void;
}

export const WhatsAppSettings: React.FC<WhatsAppSettingsProps> = ({ onClose }) => {
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

  // 1. PIN Lock Screen (Requires 5002)
  if (!isUnlocked) {
    return (
      <div className="bg-[#0B1120] border border-white/10 rounded-2xl p-6 sm:p-10 max-w-lg mx-auto shadow-2xl relative overflow-hidden my-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              Protected Admin Settings
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              WhatsApp & Meta Cloud API configuration requires security authorization.
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="space-y-4 pt-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 text-left mb-1.5">
                Enter Security PIN / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={10}
                  autoFocus
                  placeholder="Enter Security PIN"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (pinError) setPinError(false);
                  }}
                  className={`w-full bg-[#111A2E] border ${
                    pinError ? 'border-red-500 ring-2 ring-red-500/30' : 'border-white/10 focus:border-cyan-500'
                  } rounded-xl px-4 py-3.5 text-center text-xl font-mono tracking-[0.4em] text-white placeholder:text-slate-600 outline-none transition-all`}
                />
                <Key className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              {pinError && (
                <p className="text-xs text-red-400 mt-2 flex items-center justify-center gap-1 font-semibold animate-shake">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Incorrect Security PIN / Password. Access denied.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              Verify & Open WhatsApp Settings
            </button>
          </form>

          <p className="text-[11px] text-slate-500">
            Confidential Configuration • Authorized Zentrixs Personnel Only
          </p>
        </div>
      </div>
    );
  }

  // 2. Unlocked WhatsApp Settings Interface
  return (
    <div className="bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl overflow-hidden space-y-6">
      {/* Top Header */}
      <div className="border-b border-white/10 p-5 sm:p-6 bg-slate-900/60 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                Meta WhatsApp Cloud API Settings
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live automated WhatsApp dispatch to clients upon support ticket creation
            </p>
          </div>
        </div>

        {/* Tab Switcher & Lock Button */}
        <div className="flex items-center gap-3">
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => setSettingsTab('credentials')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                settingsTab === 'credentials'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
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
                  : 'text-slate-400 hover:text-white'
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
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Dispatch Logs</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/10 font-bold">
                {logs.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsUnlocked(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 rounded-xl transition-all cursor-pointer"
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
          <div className="bg-gradient-to-r from-blue-900/20 via-cyan-900/10 to-transparent border border-blue-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
              <div>
                <h4 className="text-sm font-bold text-white">Client WhatsApp Notifications Auto-Trigger</h4>
                <p className="text-xs text-slate-400">
                  When a client raises a ticket, template <code className="text-cyan-400 font-mono font-bold">{config.templateName || 'help_ticket'}</code> will be sent directly to the client's phone.
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
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              <span className="ml-2.5 text-xs font-bold text-slate-300">
                {config.isEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone Number ID */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                WhatsApp Phone Number ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={config.phoneNumberId}
                onChange={(e) => setConfig({ ...config, phoneNumberId: e.target.value })}
                placeholder="e.g. 583920194829102"
                className="w-full bg-[#111A2E] border border-white/10 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500">
                Found in Meta Developer Dashboard &gt; WhatsApp &gt; API Setup &gt; Phone number ID.
              </p>
            </div>

            {/* WABA ID */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                WhatsApp Business Account ID (WABA ID) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={config.wabaId}
                onChange={(e) => setConfig({ ...config, wabaId: e.target.value })}
                placeholder="e.g. 102938475610293"
                className="w-full bg-[#111A2E] border border-white/10 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500">
                Required for fetching live templates and managing account assets.
              </p>
            </div>

            {/* Meta Permanent Access Token */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Meta Permanent Access Token (System User Bearer Token) <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
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
                  className="w-full bg-[#111A2E] border border-white/10 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 outline-none transition-all pr-10"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Generate in Meta Business Settings &gt; System Users &gt; Generate Token with <code className="text-slate-400">whatsapp_business_messaging</code> and <code className="text-slate-400">whatsapp_business_management</code> scopes.
              </p>
            </div>

            {/* Template Name */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Target Template Name
              </label>
              <input
                type="text"
                value={config.templateName}
                onChange={(e) => setConfig({ ...config, templateName: e.target.value })}
                placeholder="help_ticket"
                className="w-full bg-[#111A2E] border border-white/10 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500">
                Matches the approved or in-review Meta template name (<code className="text-cyan-400">help_ticket</code>).
              </p>
            </div>

            {/* Language Code */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Language Code
              </label>
              <select
                value={config.languageCode}
                onChange={(e) => setConfig({ ...config, languageCode: e.target.value })}
                className="w-full bg-[#111A2E] border border-white/10 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm text-white font-mono outline-none transition-all cursor-pointer"
              >
                <option value="en_US">en_US (English US)</option>
                <option value="en">en (English)</option>
                <option value="en_GB">en_GB (English UK)</option>
                <option value="hi">hi (Hindi)</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Must match the exact language configured in your Meta template (English US = <code className="text-slate-400">en_US</code>).
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              {saveSuccess && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-fadeIn">
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
          <div className="bg-[#111A2E]/70 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold tracking-wide">Test WhatsApp Message Dispatch</h3>
            </div>
            <p className="text-xs text-slate-400">
              Send a test message using template <code className="text-cyan-400 font-mono font-bold">{config.templateName || 'help_ticket'}</code> to verify that Meta Cloud API accepts your token and phone number ID.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={testNumber}
                onChange={(e) => setTestNumber(e.target.value)}
                placeholder="Enter WhatsApp Number with country code (e.g. 919876543210)"
                className="flex-1 bg-[#0B1120] border border-white/10 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 outline-none"
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
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/10 text-red-300 border border-red-500/30'
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

      {/* Tab 2: Templates ("secod option template rahega jisme fetch hoke dikhe sab") */}
      {settingsTab === 'templates' && (
        <div className="p-5 sm:p-8 space-y-8">
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Meta WhatsApp Message Templates</h3>
              <p className="text-xs text-slate-400">
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
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-xs text-blue-300 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{templateNotice}</span>
            </div>
          )}

          {/* Grid: Templates Table (Screenshot 1) + Live WhatsApp Preview (Screenshot 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Templates Table matching Screenshot 1 */}
            <div className="lg:col-span-7 bg-[#111A2E]/70 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-slate-900/40 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Registered Templates ({templates.length})
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Meta Graph API v20.0</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-white/5">
                    <tr>
                      <th className="py-3 px-4">Template Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Language</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {templates.map((tpl) => {
                      const isSelected = selectedTemplate?.name === tpl.name;
                      const isReview = tpl.status === 'IN_REVIEW';
                      const isApproved = tpl.status === 'APPROVED';

                      return (
                        <tr
                          key={tpl.id || tpl.name}
                          onClick={() => setSelectedTemplate(tpl)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-cyan-500/10' : 'hover:bg-white/[0.02]'
                          }`}
                        >
                          <td className="py-3.5 px-4 font-bold text-white">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-cyan-300">{tpl.name}</span>
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 block truncate max-w-[180px]">
                              {tpl.bodyText.substring(0, 30)}...
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-300">
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 text-[11px]">
                              {tpl.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-400">
                            {tpl.language}
                          </td>
                          <td className="py-3.5 px-3">
                            {isReview ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                In review
                              </span>
                            ) : isApproved ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
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
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${
                                config.templateName === tpl.name
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
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
              <div className="p-4 bg-slate-950/80 border-t border-white/5 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Automated Parameter Mapping on Ticket Creation
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#111A2E] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-bold">&#123;&#123;1&#125;&#125;</span>
                    <span className="text-slate-300 text-[11px]">Client Name / Contact Person</span>
                  </div>
                  <div className="bg-[#111A2E] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-bold">&#123;&#123;2&#125;&#125;</span>
                    <span className="text-slate-300 text-[11px]">Ticket ID (e.g. tkt-2026-101)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Realistic WhatsApp Preview matching Screenshot 2 */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
                <span>Live Client Device Preview</span>
                <span className="text-[10px] text-emerald-400 font-mono">WhatsApp for iOS/Android</span>
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
                  {/* WhatsApp Message Bubble matching Screenshot 2 */}
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

      {/* Tab 3: Dispatch Logs (Audit Trail requested by user) */}
      {settingsTab === 'logs' && (
        <div className="p-5 sm:p-8 space-y-6">
          {/* Top Info & Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Dispatched</span>
              <div className="text-2xl font-black text-white font-mono">{logs.length}</div>
              <span className="text-[10px] text-cyan-400">Recorded messages</span>
            </div>

            <div className="bg-[#111A2E] border border-emerald-500/20 rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">Delivered (Sent)</span>
              <div className="text-2xl font-black text-emerald-300 font-mono">
                {logs.filter(l => l.status === 'SENT').length}
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Meta API Accepted
              </span>
            </div>

            <div className="bg-[#111A2E] border border-red-500/20 rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-1">Failed Attempts</span>
              <div className="text-2xl font-black text-red-300 font-mono">
                {logs.filter(l => l.status === 'FAILED').length}
              </div>
              <span className="text-[10px] text-red-400">Error response</span>
            </div>

            <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Active Template</span>
              <div className="text-base font-bold text-white font-mono truncate">{config.templateName || 'help_ticket'}</div>
              <span className="text-[10px] text-slate-400 font-mono">{config.languageCode || 'en_US'}</span>
            </div>
          </div>

          {/* Search, Filter & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 border border-white/10 p-3.5 rounded-2xl">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="Search by client, phone, ticket ID, or template..."
                  className="w-full bg-[#0B1120] border border-white/10 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 outline-none"
                />
              </div>

              {/* Premium Status Filter Dropdown */}
              <div className="relative" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className={`flex items-center gap-2.5 bg-[#0B1120] hover:bg-[#111A2E] border rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                    statusDropdownOpen 
                      ? 'border-cyan-400 ring-2 ring-cyan-500/20 text-white' 
                      : 'border-white/10 hover:border-cyan-500/40 text-slate-200'
                  }`}
                  aria-haspopup="listbox"
                  aria-expanded={statusDropdownOpen}
                >
                  <Filter className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  
                  {/* Status Indicator Dot */}
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    logStatusFilter === 'SENT' 
                      ? 'bg-emerald-400 shadow-sm shadow-emerald-500/50' 
                      : logStatusFilter === 'FAILED' 
                      ? 'bg-red-400 shadow-sm shadow-red-500/50' 
                      : 'bg-cyan-400 shadow-sm shadow-cyan-500/50'
                  }`} />
                  
                  <span className="whitespace-nowrap">
                    {logStatusFilter === 'ALL' && 'All Statuses'}
                    {logStatusFilter === 'SENT' && 'Delivered Only'}
                    {logStatusFilter === 'FAILED' && 'Failed Only'}
                  </span>
                  
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    statusDropdownOpen ? 'rotate-180 text-cyan-400' : ''
                  }`} />
                </button>

                {/* Dropdown Floating Menu */}
                {statusDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-52 bg-[#0B1120]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-1.5 shadow-2xl shadow-black/90 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/5">
                      Filter Dispatch Logs
                    </div>

                    {[
                      { 
                        value: 'ALL', 
                        label: 'All Statuses', 
                        desc: 'Delivered & Failed logs', 
                        dotColor: 'bg-cyan-400 shadow-sm shadow-cyan-500/50' 
                      },
                      { 
                        value: 'SENT', 
                        label: 'Delivered Only', 
                        desc: 'Meta 200 OK Accepted', 
                        dotColor: 'bg-emerald-400 shadow-sm shadow-emerald-500/50' 
                      },
                      { 
                        value: 'FAILED', 
                        label: 'Failed Only', 
                        desc: 'Errors & delivery failures', 
                        dotColor: 'bg-red-400 shadow-sm shadow-red-500/50' 
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
                              ? 'bg-cyan-500/15 text-white font-bold border border-cyan-500/30 shadow-inner'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dotColor}`} />
                            <div>
                              <div className="font-semibold">{opt.label}</div>
                              <div className="text-[10px] text-slate-400">{opt.desc}</div>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
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
                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
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
                className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
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
                <div className="bg-[#111A2E]/50 border border-white/10 rounded-2xl p-12 text-center space-y-3">
                  <History className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-white">No WhatsApp Dispatch Logs Found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {logSearch.trim() || logStatusFilter !== 'ALL'
                      ? 'No logs match your search filter.'
                      : 'Logs will appear automatically here whenever tickets are raised by clients or test messages are sent.'}
                  </p>
                </div>
              );
            }

            return (
              <div className="bg-[#111A2E]/70 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-white/5">
                      <tr>
                        <th className="py-3.5 px-4">Date & Time</th>
                        <th className="py-3.5 px-4">Recipient (Client)</th>
                        <th className="py-3.5 px-3">Template Used</th>
                        <th className="py-3.5 px-3">Ticket / Trigger</th>
                        <th className="py-3.5 px-4">Message Snippet</th>
                        <th className="py-3.5 px-3">Status & Meta ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredLogs.map((log) => {
                        const isSent = log.status === 'SENT';
                        const dateObj = new Date(log.timestamp);
                        const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                        const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

                        return (
                          <tr
                            key={log.id}
                            onClick={() => setSelectedLogDetail(log)}
                            className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                          >
                            {/* Timestamp */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="text-white font-mono font-medium">{formattedDate}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{formattedTime}</div>
                            </td>

                            {/* Recipient */}
                            <td className="py-4 px-4">
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{log.recipientName}</span>
                              </div>
                              <div className="text-[11px] text-cyan-400 font-mono mt-0.5 flex items-center gap-1">
                                <Smartphone className="w-3 h-3 text-slate-500 shrink-0" />
                                {log.recipientPhone}
                              </div>
                            </td>

                            {/* Template Used */}
                            <td className="py-4 px-3 whitespace-nowrap">
                              <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-cyan-300 font-mono font-bold text-[11px] border border-blue-500/20 block w-fit">
                                {log.templateName}
                              </span>
                              <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                                Lang: {log.language}
                              </span>
                            </td>

                            {/* Ticket / Trigger */}
                            <td className="py-4 px-3 whitespace-nowrap">
                              {log.ticketNumber ? (
                                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-mono font-bold text-[11px] border border-amber-500/20">
                                  {log.ticketNumber}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Direct Test</span>
                              )}
                              <span className="text-[10px] text-slate-500 block mt-1">
                                {log.triggerType === 'TICKET_CREATED' ? 'Ticket Auto-Send' : 'Manual Trigger'}
                              </span>
                            </td>

                            {/* Message Preview */}
                            <td className="py-4 px-4 max-w-xs">
                              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-sans">
                                {log.messagePreview || 'Standard ticket confirmation message'}
                              </p>
                            </td>

                            {/* Status & Message ID */}
                            <td className="py-4 px-3 whitespace-nowrap">
                              {isSent ? (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    DELIVERED
                                  </span>
                                  {log.messageId && (
                                    <span className="text-[9px] text-slate-500 font-mono block truncate max-w-[130px]" title={log.messageId}>
                                      ID: {log.messageId}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-300 border border-red-500/30">
                                    <AlertCircle className="w-3 h-3 text-red-400" />
                                    FAILED
                                  </span>
                                  {log.error && (
                                    <span className="text-[9px] text-red-400/80 block truncate max-w-[130px]" title={log.error}>
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

                <div className="p-3.5 bg-slate-950/80 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span>Showing {filteredLogs.length} of {logs.length} logged dispatches</span>
                  <span className="text-[11px] text-slate-500">Click any row to view full payload</span>
                </div>
              </div>
            );
          })()}

          {/* Selected Log Detail Modal */}
          {selectedLogDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-lg bg-[#0F172A] border border-white/20 rounded-3xl p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-white text-base">WhatsApp Dispatch Details</h3>
                  </div>
                  <button
                    onClick={() => setSelectedLogDetail(null)}
                    className="text-slate-400 hover:text-white text-xl p-1"
                  >
                    &times;
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Recipient Client</span>
                    <strong className="text-white text-sm">{selectedLogDetail.recipientName}</strong>
                    <span className="text-cyan-400 font-mono block mt-0.5">{selectedLogDetail.recipientPhone}</span>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Template & Language</span>
                    <strong className="text-cyan-300 font-mono text-sm">{selectedLogDetail.templateName}</strong>
                    <span className="text-slate-400 font-mono block mt-0.5">{selectedLogDetail.language}</span>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Ticket Number</span>
                    <strong className="text-amber-300 font-mono text-sm">{selectedLogDetail.ticketNumber || 'N/A'}</strong>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Dispatch Status</span>
                    <span className={`inline-block font-bold text-xs mt-0.5 ${selectedLogDetail.status === 'SENT' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {selectedLogDetail.status === 'SENT' ? '✓ Accepted by Meta' : '✕ Delivery Failed'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1.5">Dispatched Message Body</span>
                  <div className="bg-black/60 border border-white/10 rounded-2xl p-4 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {selectedLogDetail.messagePreview}
                  </div>
                </div>

                {selectedLogDetail.messageId && (
                  <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 text-xs">
                    <span className="text-slate-400 text-[10px] uppercase block">Meta Message ID (WAMID)</span>
                    <span className="text-emerald-300 font-mono text-[11px] break-all">{selectedLogDetail.messageId}</span>
                  </div>
                )}

                {selectedLogDetail.error && (
                  <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3 text-xs">
                    <span className="text-red-400 text-[10px] uppercase block">Failure Reason</span>
                    <span className="text-red-300 text-[11px]">{selectedLogDetail.error}</span>
                  </div>
                )}

                <div className="flex justify-end pt-2 border-t border-white/10">
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
