import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Sparkles, Cpu, Layers, Share2, Globe, GitBranch, Database, 
  Play, Pause, Zap, PhoneCall, ArrowRight, MessageSquare, Radio,
  Activity, Terminal, CheckCircle2, FastForward
} from 'lucide-react';

interface FlowNode {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  type: 'user' | 'agent' | 'llm' | 'memory' | 'gateway' | 'tool';
  accentColor?: string;
  latency?: string;
  statusText?: string;
  payload?: string;
}

interface FlowConnection {
  id: string;
  from: string;
  to: string;
  style?: 'straight' | 'stepped' | 'curved';
  color?: string;
  bidirectional?: boolean;
}

interface FlowStep {
  step: number;
  activeNodeId: string;
  activeConnections: string[];
  title: string;
  log: string;
  latency: string;
}

interface FlowPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  themeColor: string;
  glowColor: string;
  nodes: FlowNode[];
  connections: FlowConnection[];
  steps: FlowStep[];
}

const PRESETS: FlowPreset[] = [
  {
    id: 'mcp-agent',
    name: 'MCP Agent',
    badge: 'LIVE PREVIEW • MCP AGENT',
    description: 'Watch a live request move dynamically through an autonomous agent, its memory layers, LLM reasoning, and connected MCP tool servers in real-time.',
    themeColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    nodes: [
      {
        id: 'user',
        title: 'User Prompt',
        subtitle: 'Natural language input',
        icon: User,
        x: 10,
        y: 50,
        type: 'user',
        latency: '0ms',
        statusText: 'Input Stream Ready',
        payload: '{ "query": "Analyze Q3 revenue & sync CRM" }'
      },
      {
        id: 'agent',
        title: 'AI Agent Core',
        subtitle: 'Autonomous Orchestrator',
        icon: Sparkles,
        x: 36,
        y: 50,
        type: 'agent',
        accentColor: '#f97316',
        latency: '35ms',
        statusText: 'ReAct Loop Active',
        payload: '{ "goal": "multi_step_plan", "steps": 4 }'
      },
      {
        id: 'llm',
        title: 'Reasoning LLM',
        subtitle: 'DeepSeek / GPT-4o',
        icon: Cpu,
        x: 36,
        y: 18,
        type: 'llm',
        latency: '180ms',
        statusText: 'Inference 1.4k t/s',
        payload: '{ "model": "deepseek-r1", "tokens": 842 }'
      },
      {
        id: 'memory',
        title: 'Vector Memory',
        subtitle: 'Semantic Context Store',
        icon: Layers,
        x: 36,
        y: 82,
        type: 'memory',
        latency: '12ms',
        statusText: 'Cosine Similarity 0.94',
        payload: '{ "k_neighbors": 5, "embedded_docs": 18 }'
      },
      {
        id: 'mcp',
        title: 'MCP Server',
        subtitle: 'Tool Protocol Gateway',
        icon: Share2,
        x: 62,
        y: 50,
        type: 'gateway',
        latency: '8ms',
        statusText: 'JSON-RPC Connected',
        payload: '{ "tools_exposed": ["db_query", "web_fetch"] }'
      },
      {
        id: 'browser',
        title: 'Web Scraping',
        subtitle: 'Headless Browser tool',
        icon: Globe,
        x: 62,
        y: 82,
        type: 'tool',
        latency: '45ms',
        statusText: 'DOM Evaluated',
        payload: '{ "url": "https://data.source/q3", "status": 200 }'
      },
      {
        id: 'github',
        title: 'GitHub API',
        subtitle: 'Repo & Commit Action',
        icon: GitBranch,
        x: 88,
        y: 22,
        type: 'tool',
        latency: '52ms',
        statusText: 'PR #108 Created',
        payload: '{ "repo": "zentrix/pipeline", "branch": "sync" }'
      },
      {
        id: 'database',
        title: 'SQL / Vector DB',
        subtitle: 'Structured Warehouse',
        icon: Database,
        x: 88,
        y: 82,
        type: 'tool',
        latency: '18ms',
        statusText: 'Query Cached',
        payload: '{ "rows_scanned": 12840, "execution_ms": 14 }'
      }
    ],
    connections: [
      { id: 'c-user-agent', from: 'user', to: 'agent', color: '#f97316' },
      { id: 'c-agent-llm', from: 'agent', to: 'llm', bidirectional: true, color: '#f97316' },
      { id: 'c-agent-memory', from: 'agent', to: 'memory', bidirectional: true, color: '#f97316' },
      { id: 'c-agent-mcp', from: 'agent', to: 'mcp', color: '#f97316' },
      { id: 'c-agent-browser', from: 'agent', to: 'browser', style: 'stepped', color: '#f97316' },
      { id: 'c-mcp-github', from: 'mcp', to: 'github', style: 'stepped', color: '#f97316' },
      { id: 'c-mcp-database', from: 'mcp', to: 'database', style: 'stepped', color: '#f97316' }
    ],
    steps: [
      {
        step: 1,
        activeNodeId: 'user',
        activeConnections: ['c-user-agent'],
        title: '1. User Inbound Request Dispatched',
        log: '⚡ Inbound user prompt received: "Analyze Q3 sales & commit pipeline report". Packet formatted to JSON-RPC.',
        latency: '0ms'
      },
      {
        step: 2,
        activeNodeId: 'agent',
        activeConnections: ['c-user-agent', 'c-agent-llm', 'c-agent-memory'],
        title: '2. Agent Brain Evaluates Intent & Recalls Context',
        log: '🧠 Agent Core ingests payload. Querying Vector Memory for past session variables & sending system prompt to LLM.',
        latency: '24ms'
      },
      {
        step: 3,
        activeNodeId: 'llm',
        activeConnections: ['c-agent-llm', 'c-agent-mcp'],
        title: '3. LLM Generates Multi-step Tool Plan',
        log: '✨ LLM inference completed. Decision: Execute parallel calls via MCP Gateway (SQL Warehouse + Headless Web Search).',
        latency: '180ms'
      },
      {
        step: 4,
        activeNodeId: 'mcp',
        activeConnections: ['c-agent-mcp', 'c-mcp-github', 'c-mcp-database', 'c-agent-browser'],
        title: '4. MCP Gateway Dispatches Microservice Tools',
        log: '🔌 MCP protocol validates auth tokens and dispatches concurrent tool executions to SQL DB & GitHub API.',
        latency: '42ms'
      },
      {
        step: 5,
        activeNodeId: 'database',
        activeConnections: ['c-mcp-database', 'c-mcp-github'],
        title: '5. Database & APIs Return Structured Results',
        log: '💾 Query executed successfully (12,840 records). GitHub PR #108 created. Data packaged for synthesis.',
        latency: '18ms'
      },
      {
        step: 6,
        activeNodeId: 'agent',
        activeConnections: ['c-user-agent'],
        title: '6. Agent Delivers Streamed Response to User',
        log: '🚀 Full synthesis generated with citations. Request lifecycle completed in 280ms end-to-end!',
        latency: '16ms'
      }
    ]
  },
  {
    id: 'voice-agent',
    name: 'Voice AI Agent',
    badge: 'LIVE PREVIEW • VOICE AGENT',
    description: 'Sub-300ms ultra-low latency conversational telephony flow qualifying inbound callers, streaming speech-to-speech, and triggering real-time CRM updates.',
    themeColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    nodes: [
      {
        id: 'user',
        title: 'Inbound Caller',
        subtitle: 'PSTN / Mobile Phone',
        icon: PhoneCall,
        x: 10,
        y: 50,
        type: 'user',
        latency: '40ms',
        statusText: 'Audio Stream Active',
        payload: '{ "caller_id": "+91 98765 43210", "codec": "Opus 48kHz" }'
      },
      {
        id: 'agent',
        title: 'Voice AI Orchestrator',
        subtitle: 'Full Duplex Engine',
        icon: Radio,
        x: 36,
        y: 50,
        type: 'agent',
        accentColor: '#06b6d4',
        latency: '18ms',
        statusText: 'VAD & Turn-Taking Active',
        payload: '{ "barge_in": true, "sampling": "live" }'
      },
      {
        id: 'llm',
        title: 'Groq / Llama 3.3',
        subtitle: 'Ultra-Fast Reasoning',
        icon: Cpu,
        x: 36,
        y: 18,
        type: 'llm',
        latency: '95ms',
        statusText: 'Streaming TTFT < 80ms',
        payload: '{ "temperature": 0.3, "latency_mode": "ultra_low" }'
      },
      {
        id: 'memory',
        title: 'Call Session Cache',
        subtitle: 'Realtime Transcript Memory',
        icon: Layers,
        x: 36,
        y: 82,
        type: 'memory',
        latency: '5ms',
        statusText: 'Sliding Window 20 turns',
        payload: '{ "sentiment": "High Interest", "intent": "Booking" }'
      },
      {
        id: 'mcp',
        title: 'SIP / WebRTC Gateway',
        subtitle: 'Telephony Switchboard',
        icon: Share2,
        x: 62,
        y: 50,
        type: 'gateway',
        latency: '12ms',
        statusText: 'Zero Jitter Buffer',
        payload: '{ "protocol": "WebRTC", "packet_loss": "0.0%" }'
      },
      {
        id: 'browser',
        title: 'WhatsApp Confirmation',
        subtitle: 'Instant SMS & Catalog',
        icon: MessageSquare,
        x: 62,
        y: 82,
        type: 'tool',
        latency: '60ms',
        statusText: 'Template Dispatched',
        payload: '{ "wa_template": "appointment_confirmed_v2" }'
      },
      {
        id: 'github',
        title: 'Live Human Desk',
        subtitle: 'Warm Transfer Switch',
        icon: User,
        x: 88,
        y: 22,
        type: 'tool',
        latency: '85ms',
        statusText: 'Rep Standby',
        payload: '{ "rep_available": true, "queue_depth": 0 }'
      },
      {
        id: 'database',
        title: 'Zentrix CRM',
        subtitle: 'Lead Auto-Created',
        icon: Database,
        x: 88,
        y: 82,
        type: 'tool',
        latency: '22ms',
        statusText: 'Stage: Qualified Lead',
        payload: '{ "deal_size": "₹2,50,000", "assigned_to": "Rahul S." }'
      }
    ],
    connections: [
      { id: 'c-user-agent', from: 'user', to: 'agent', color: '#06b6d4' },
      { id: 'c-agent-llm', from: 'agent', to: 'llm', bidirectional: true, color: '#06b6d4' },
      { id: 'c-agent-memory', from: 'agent', to: 'memory', bidirectional: true, color: '#06b6d4' },
      { id: 'c-agent-mcp', from: 'agent', to: 'mcp', color: '#06b6d4' },
      { id: 'c-agent-browser', from: 'agent', to: 'browser', style: 'stepped', color: '#06b6d4' },
      { id: 'c-mcp-github', from: 'mcp', to: 'github', style: 'stepped', color: '#06b6d4' },
      { id: 'c-mcp-database', from: 'mcp', to: 'database', style: 'stepped', color: '#06b6d4' }
    ],
    steps: [
      {
        step: 1,
        activeNodeId: 'user',
        activeConnections: ['c-user-agent'],
        title: '1. Inbound Voice Packet Stream Initiated',
        log: '📞 Caller speaks into phone. Voice Activity Detector (VAD) streams 24kHz Opus packets via WebRTC.',
        latency: '15ms'
      },
      {
        step: 2,
        activeNodeId: 'agent',
        activeConnections: ['c-user-agent', 'c-agent-llm'],
        title: '2. Real-time Speech-to-Text & VAD Chunking',
        log: '🎙️ Whisper streaming transcription captures: "I need to schedule a business automation demo for my company tomorrow".',
        latency: '45ms'
      },
      {
        step: 3,
        activeNodeId: 'llm',
        activeConnections: ['c-agent-llm', 'c-agent-memory'],
        title: '3. Groq LLaMA-3 Stream Inference (<80ms TTFT)',
        log: '⚡ Language model infers calendar slot availability and formulates human-sounding spoken confirmation.',
        latency: '78ms'
      },
      {
        step: 4,
        activeNodeId: 'mcp',
        activeConnections: ['c-agent-mcp', 'c-agent-browser', 'c-mcp-database'],
        title: '4. Telephony Audio Synthesis & Webhook Dispatch',
        log: '🔊 Natural neural TTS audio streams back to caller while webhook updates Zentrix CRM & WhatsApp bot in background.',
        latency: '32ms'
      },
      {
        step: 5,
        activeNodeId: 'database',
        activeConnections: ['c-mcp-database'],
        title: '5. Calendar Booked & CRM Lead Recorded',
        log: '✅ CRM Lead created with high qualification score. Instant WhatsApp confirmation sent to caller phone.',
        latency: '22ms'
      }
    ]
  },
  {
    id: 'lead-router',
    name: 'Lead Router & CRM',
    badge: 'LIVE PREVIEW • OMNICHANNEL ROUTER',
    description: 'Auto-captures leads from Meta Ads, WhatsApp, and websites, enriches company context, scores intent, and routes to appropriate sales reps in seconds.',
    themeColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    nodes: [
      {
        id: 'user',
        title: 'Inbound Lead',
        subtitle: 'Meta Ad / Web Form',
        icon: User,
        x: 10,
        y: 50,
        type: 'user',
        latency: '5ms',
        statusText: 'Webhook Triggered',
        payload: '{ "source": "Meta Ads Campaign", "budget": "₹5L+" }'
      },
      {
        id: 'agent',
        title: 'Lead Brain',
        subtitle: 'Auto-Qualify & Score',
        icon: Sparkles,
        x: 36,
        y: 50,
        type: 'agent',
        accentColor: '#10b981',
        latency: '28ms',
        statusText: 'Lead Score: 96/100',
        payload: '{ "urgency": "Immediate", "industry": "Retail & D2C" }'
      },
      {
        id: 'llm',
        title: 'Intent Classifier',
        subtitle: 'Budget & Persona Parser',
        icon: Cpu,
        x: 36,
        y: 18,
        type: 'llm',
        latency: '110ms',
        statusText: 'VIP Enterprise Match',
        payload: '{ "confidence": 0.98, "recommendation": "Priority Call" }'
      },
      {
        id: 'memory',
        title: 'Customer Graph',
        subtitle: 'Past Touchpoints & Interactions',
        icon: Layers,
        x: 36,
        y: 82,
        type: 'memory',
        latency: '14ms',
        statusText: 'Repeat Visitor Identified',
        payload: '{ "pages_viewed": 7, "last_active": "2 mins ago" }'
      },
      {
        id: 'mcp',
        title: 'Router Hub',
        subtitle: 'High-Speed Webhook Mesh',
        icon: Share2,
        x: 62,
        y: 50,
        type: 'gateway',
        latency: '9ms',
        statusText: 'Routing Algorithm: Round-Robin VIP',
        payload: '{ "assigned_cluster": "Enterprise_North" }'
      },
      {
        id: 'browser',
        title: 'GST / Company Lookup',
        subtitle: 'Auto-Enrichment API',
        icon: Globe,
        x: 62,
        y: 82,
        type: 'tool',
        latency: '40ms',
        statusText: 'Verified Company PAN & GST',
        payload: '{ "entity_type": "Private Limited", "turnover": "10Cr+" }'
      },
      {
        id: 'github',
        title: 'WhatsApp Automation',
        subtitle: 'Instant PDF Brochure Bot',
        icon: MessageSquare,
        x: 88,
        y: 22,
        type: 'tool',
        latency: '35ms',
        statusText: 'PDF Case Study Sent',
        payload: '{ "delivered": true, "read_receipt": true }'
      },
      {
        id: 'database',
        title: 'Sales Pipeline',
        subtitle: 'Assigned Senior Rep CRM',
        icon: Database,
        x: 88,
        y: 82,
        type: 'tool',
        latency: '15ms',
        statusText: 'Deal Created: Stage 1',
        payload: '{ "rep_phone": "+91 99000 11223", "sla_timer": "5 mins" }'
      }
    ],
    connections: [
      { id: 'c-user-agent', from: 'user', to: 'agent', color: '#10b981' },
      { id: 'c-agent-llm', from: 'agent', to: 'llm', bidirectional: true, color: '#10b981' },
      { id: 'c-agent-memory', from: 'agent', to: 'memory', bidirectional: true, color: '#10b981' },
      { id: 'c-agent-mcp', from: 'agent', to: 'mcp', color: '#10b981' },
      { id: 'c-agent-browser', from: 'agent', to: 'browser', style: 'stepped', color: '#10b981' },
      { id: 'c-mcp-github', from: 'mcp', to: 'github', style: 'stepped', color: '#10b981' },
      { id: 'c-mcp-database', from: 'mcp', to: 'database', style: 'stepped', color: '#10b981' }
    ],
    steps: [
      {
        step: 1,
        activeNodeId: 'user',
        activeConnections: ['c-user-agent'],
        title: '1. Webhook Triggered from Ad Campaign',
        log: '📈 New prospective lead submits high-ticket inquiry form from digital campaign. Instant webhook received.',
        latency: '5ms'
      },
      {
        step: 2,
        activeNodeId: 'agent',
        activeConnections: ['c-user-agent', 'c-agent-llm', 'c-agent-memory'],
        title: '2. Lead Brain Ingests & Queries Graph History',
        log: '🧠 Lead Brain cross-references customer database to verify if email/phone has interacted previously.',
        latency: '22ms'
      },
      {
        step: 3,
        activeNodeId: 'llm',
        activeConnections: ['c-agent-llm', 'c-agent-mcp', 'c-agent-browser'],
        title: '3. LLM Scores Intent & Triggers Company Enrichment',
        log: '🔍 Lead qualified with 96/100 score. Headless lookup verifies company registry data & GST details.',
        latency: '85ms'
      },
      {
        step: 4,
        activeNodeId: 'mcp',
        activeConnections: ['c-agent-mcp', 'c-mcp-github', 'c-mcp-database'],
        title: '4. Router Hub Dispatches to Rep & WhatsApp Bot',
        log: '⚡ Lead allocated to VIP sales consultant. Personalized WhatsApp brochure dispatched to customer in 1.4s.',
        latency: '25ms'
      },
      {
        step: 5,
        activeNodeId: 'database',
        activeConnections: ['c-mcp-database'],
        title: '5. Pipeline Deal Stage Updated with SLA Alert',
        log: '📊 Deal created in CRM with 5-minute callback alert sent to sales representative Slack & Phone.',
        latency: '15ms'
      }
    ]
  }
];

export const AgentFlow: React.FC = () => {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeNodeId, setActiveNodeId] = useState<string>('agent');
  const [laserActive, setLaserActive] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStepIndex, setSimulationStepIndex] = useState<number>(0);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentPreset = PRESETS[activePresetIndex];
  const activeNode = currentPreset.nodes.find(n => n.id === activeNodeId) || currentPreset.nodes[1];

  // Intersection Observer for Scroll Motion Reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Step-by-Step Simulation Loop
  useEffect(() => {
    if (!isSimulating) {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
      return;
    }

    simulationTimerRef.current = setInterval(() => {
      setSimulationStepIndex((prev) => {
        const next = prev + 1;
        if (next >= currentPreset.steps.length) {
          return 0;
        }
        return next;
      });
    }, 2200);

    return () => {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    };
  }, [isSimulating, currentPreset.steps.length]);

  // Synchronize active node with current simulation step
  useEffect(() => {
    if (isSimulating && currentPreset.steps[simulationStepIndex]) {
      setActiveNodeId(currentPreset.steps[simulationStepIndex].activeNodeId);
    }
  }, [simulationStepIndex, isSimulating, currentPreset]);

  // Trigger high-energy laser pulse animation
  const triggerPulse = () => {
    setLaserActive(true);
    setTimeout(() => setLaserActive(false), 2400);
  };

  // Toggle step-by-step auto flow simulation
  const toggleSimulation = () => {
    if (!isSimulating) {
      setSimulationStepIndex(0);
      setIsSimulating(true);
      triggerPulse();
    } else {
      setIsSimulating(false);
    }
  };

  // Manual next simulation step
  const handleNextStep = () => {
    setIsSimulating(false);
    setSimulationStepIndex((prev) => (prev + 1) % currentPreset.steps.length);
    triggerPulse();
  };

  // Find node by ID
  const getNode = (id: string) => currentPreset.nodes.find(n => n.id === id);

  // Generate SVG path coordinate strings between two percentage-based nodes
  const calculatePath = (conn: FlowConnection) => {
    const fromNode = getNode(conn.from);
    const toNode = getNode(conn.to);
    if (!fromNode || !toNode) return '';

    const x1 = fromNode.x;
    const y1 = fromNode.y;
    const x2 = toNode.x;
    const y2 = toNode.y;

    if (conn.style === 'stepped') {
      const midX = x1 + (x2 - x1) * 0.45;
      return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
    }

    if (x1 === x2) {
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    if (y1 === y2) {
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    const cx1 = x1 + (x2 - x1) * 0.5;
    const cy1 = y1;
    const cx2 = x1 + (x2 - x1) * 0.5;
    const cy2 = y2;
    return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  };

  // 3D Parallax Tilt calculation on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 6, y: -y * 6 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const activeSimulationStep = currentPreset.steps[simulationStepIndex] || currentPreset.steps[0];

  return (
    <section 
      id="ai" 
      ref={sectionRef} 
      className="py-24 md:py-32 relative bg-[#06080c] overflow-hidden border-t border-white/5 reveal reveal-up"
    >
      {/* Background ambient lighting effects with animated breathing pulse */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-[1100px] h-[500px] blur-[160px] rounded-full pointer-events-none -z-10 transition-colors duration-1000 animate-pulse-soft"
        style={{ backgroundColor: currentPreset.glowColor }}
      />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 left-10 w-80 h-80 bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Cyber grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block with Staggered Motion Reveal */}
        <div className={`flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div>
            <div 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-4 shadow-lg backdrop-blur-md transition-all duration-500 hover:scale-105"
              style={{
                backgroundColor: `${currentPreset.themeColor}15`,
                borderColor: `${currentPreset.themeColor}40`,
                boxShadow: `0 0 20px ${currentPreset.themeColor}25`
              }}
            >
              <span 
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: currentPreset.themeColor }}
              />
              <span 
                className="font-mono font-bold tracking-widest text-xs uppercase"
                style={{ color: currentPreset.themeColor }}
              >
                {currentPreset.badge}
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight mb-4 flex items-center gap-3">
              <span>Follow the flow.</span>
              <span 
                className="inline-block w-3 h-3 md:w-4 md:h-4 rounded-full animate-pulse"
                style={{ backgroundColor: currentPreset.themeColor }}
              />
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed">
              {currentPreset.description}
            </p>
          </div>

          {/* Preset Selector & Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center p-1.5 rounded-2xl bg-zinc-900/90 border border-white/10 backdrop-blur-md shadow-2xl">
              {PRESETS.map((preset, index) => {
                const isSelected = activePresetIndex === index;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setActivePresetIndex(index);
                      setSimulationStepIndex(0);
                      triggerPulse();
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 uppercase cursor-pointer relative ${
                      isSelected
                        ? 'text-black font-extrabold shadow-lg scale-105 z-10'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                    style={{
                      backgroundColor: isSelected ? preset.themeColor : 'transparent',
                      boxShadow: isSelected ? `0 0 25px ${preset.glowColor}` : 'none'
                    }}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              {/* Play / Pause Animated Stream */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? 'Pause Motion Particles' : 'Play Motion Particles'}
                className="w-11 h-11 rounded-2xl bg-zinc-900/90 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 hover:border-white/30"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Step-by-Step Auto Simulation Tour */}
              <button
                onClick={toggleSimulation}
                title={isSimulating ? 'Stop Step Simulation' : 'Run Step-by-Step Live Flow Tour'}
                className={`px-3.5 h-11 rounded-2xl border text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  isSimulating 
                    ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse'
                    : 'bg-zinc-900/90 text-zinc-300 border-white/10 hover:text-white hover:border-white/30'
                }`}
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">{isSimulating ? 'Simulating...' : 'Simulate Flow'}</span>
              </button>

              {/* Manual Next Step Button (when simulating or stepping) */}
              {isSimulating && (
                <button
                  onClick={handleNextStep}
                  title="Next Step"
                  className="w-11 h-11 rounded-2xl bg-zinc-900 border border-white/10 text-cyan-400 hover:text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <FastForward className="w-4 h-4" />
                </button>
              )}

              {/* High Voltage Energy Surge Pulse Trigger */}
              <button
                onClick={triggerPulse}
                title="Trigger High Voltage Data Surge"
                className="px-4 h-11 rounded-2xl text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${currentPreset.themeColor}, #ffffff)`,
                  boxShadow: `0 0 25px ${currentPreset.glowColor}`
                }}
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Trigger Surge</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive 2.5D Animated Architecture Diagram Canvas with Smooth 3D Perspective Tilt */}
        <div 
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`relative w-full rounded-[2.5rem] bg-[#0c1017]/95 border border-white/15 shadow-[0_30px_100px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-4 sm:p-8 md:p-12 overflow-hidden transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'
          }`}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            borderColor: `${currentPreset.themeColor}30`,
            boxShadow: `0 30px 100px rgba(0,0,0,0.8), 0 0 50px ${currentPreset.themeColor}15`
          }}
        >
          
          {/* Subtle Canvas Background Grid */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* Central AI Agent Concentric Radar Ripple Rings */}
          <div className="absolute top-1/2 left-[36%] -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] pointer-events-none -z-0">
            <div 
              className="absolute inset-0 rounded-full border animate-ping [animation-duration:3.5s] opacity-25"
              style={{ borderColor: currentPreset.themeColor }}
            />
            <div 
              className="absolute inset-10 rounded-full border animate-pulse [animation-duration:2s] opacity-30"
              style={{ borderColor: currentPreset.themeColor }}
            />
            <div 
              className="absolute inset-20 rounded-full border opacity-40"
              style={{ borderColor: currentPreset.themeColor }}
            />
          </div>

          {/* SVG Connection Lines Layer with Animated Data Particles */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="flowPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={currentPreset.themeColor} stopOpacity="0" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor={currentPreset.themeColor} stopOpacity="0" />
              </linearGradient>

              <filter id="laserGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {currentPreset.connections.map((conn, idx) => {
              const d = calculatePath(conn);
              if (!d) return null;

              const isStepActive = isSimulating && activeSimulationStep.activeConnections.includes(conn.id);
              const strokeColor = isStepActive ? '#ffffff' : (conn.color || currentPreset.themeColor);
              const strokeWidth = isStepActive ? '1.2' : '0.6';

              return (
                <g key={conn.id} className="transition-all duration-300">
                  {/* Background faint guide line */}
                  <path
                    d={d}
                    fill="none"
                    stroke={strokeColor}
                    strokeOpacity={isStepActive ? 0.6 : 0.25}
                    strokeWidth={strokeWidth}
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Flowing Animated Dashed Line with Directional Movement */}
                  {isPlaying && (
                    <path
                      d={d}
                      fill="none"
                      stroke={strokeColor}
                      strokeOpacity={isStepActive ? 1 : 0.8}
                      strokeWidth={isStepActive ? '1.5' : '1'}
                      strokeDasharray={isStepActive ? '5 5' : '4 6'}
                      className="flow-dash-anim"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}

                  {/* High-speed Primary Data Packet */}
                  {isPlaying && (
                    <circle r={isStepActive ? '1.4' : '1.0'} fill={strokeColor} filter="url(#laserGlow)">
                      <animateMotion
                        path={d}
                        dur={laserActive ? '0.9s' : isStepActive ? '1.4s' : `${2.2 + (idx % 3) * 0.4}s`}
                        repeatCount="indefinite"
                        keyPoints="0;1"
                        keyTimes="0;1"
                      />
                    </circle>
                  )}

                  {/* Secondary Staggered Echo Packet for realistic density */}
                  {isPlaying && (
                    <circle r="0.6" fill="#ffffff" filter="url(#laserGlow)" opacity="0.8">
                      <animateMotion
                        path={d}
                        dur={laserActive ? '0.9s' : `${2.2 + (idx % 3) * 0.4}s`}
                        begin={`${0.5 + (idx % 2) * 0.3}s`}
                        repeatCount="indefinite"
                        keyPoints="0;1"
                        keyTimes="0;1"
                      />
                    </circle>
                  )}

                  {/* Bidirectional Return Pulse */}
                  {conn.bidirectional && isPlaying && (
                    <circle r="0.8" fill={strokeColor} filter="url(#laserGlow)" opacity="0.7">
                      <animateMotion
                        path={d}
                        dur={`${2.6 + (idx % 2) * 0.4}s`}
                        repeatCount="indefinite"
                        keyPoints="1;0"
                        keyTimes="0;1"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Desktop/Tablet Node Placement Grid (Interactive 2.5D Floating Cards with Hover & Float Animations) */}
          <div className="relative w-full h-[520px] sm:h-[580px] md:h-[620px] hidden md:block">
            {currentPreset.nodes.map((node, nodeIdx) => {
              const isAgent = node.type === 'agent';
              const isSelected = activeNodeId === node.id;
              const isSimStepActive = isSimulating && activeSimulationStep.activeNodeId === node.id;
              const Icon = node.icon;

              // Different float animation classes for natural asynchronous organic floating motion
              const floatClass = (nodeIdx % 3 === 0) 
                ? 'animate-node-float-1' 
                : (nodeIdx % 3 === 1) 
                  ? 'animate-node-float-2' 
                  : 'animate-node-float-3';

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    setActiveNodeId(node.id);
                    triggerPulse();
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 select-none group z-10 ${floatClass}`}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    animationPlayState: isPlaying ? 'running' : 'paused'
                  }}
                >
                  {/* Node Card Component with Dynamic Glow and Scale on Active */}
                  <div 
                    className={`relative flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 backdrop-blur-md ${
                      isAgent
                        ? 'bg-gradient-to-b from-[#1c1813] to-[#120e0a] border-2 shadow-2xl scale-110 hover:scale-115'
                        : isSelected || isSimStepActive
                          ? 'bg-[#151a24] border-2 scale-110 shadow-2xl'
                          : 'bg-[#12161f]/95 hover:bg-[#181f2c] border border-white/10 hover:border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:scale-105'
                    }`}
                    style={{
                      borderColor: (isAgent || isSelected || isSimStepActive) ? currentPreset.themeColor : undefined,
                      boxShadow: (isAgent || isSelected || isSimStepActive) ? `0 15px 40px ${currentPreset.glowColor}` : undefined
                    }}
                  >
                    {/* Active Halo Ring Pulse when selected or simulating */}
                    {(isSelected || isSimStepActive) && (
                      <span 
                        className="absolute -inset-1 rounded-2xl border animate-pulse pointer-events-none opacity-80"
                        style={{ borderColor: currentPreset.themeColor }}
                      />
                    )}

                    {/* Status Dot Top-Right Indicator */}
                    <span 
                      className={`absolute top-2 right-2 w-2 h-2 rounded-full transition-all ${
                        isAgent || isSimStepActive
                          ? 'animate-ping'
                          : isSelected 
                            ? 'scale-125' 
                            : 'bg-white/30 group-hover:bg-cyan-400'
                      }`}
                      style={{
                        backgroundColor: (isAgent || isSelected || isSimStepActive) ? currentPreset.themeColor : undefined
                      }}
                    />

                    {/* Left Icon Badge */}
                    <div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-md ${
                        isAgent || isSelected || isSimStepActive
                          ? 'text-black font-bold'
                          : 'bg-white/5 border border-white/10 text-zinc-300 group-hover:text-white group-hover:bg-white/10'
                      }`}
                      style={{
                        background: (isAgent || isSelected || isSimStepActive)
                          ? `linear-gradient(135deg, ${currentPreset.themeColor}, #ffffff)`
                          : undefined
                      }}
                    >
                      <Icon className={`w-5 h-5 ${(isAgent || isSelected || isSimStepActive) ? 'stroke-[2.5]' : ''}`} />
                    </div>

                    {/* Text Labels */}
                    <div className="pr-3 text-left">
                      <div 
                        className="text-sm font-black tracking-tight"
                        style={{
                          color: (isAgent || isSelected || isSimStepActive) ? currentPreset.themeColor : '#ffffff'
                        }}
                      >
                        {node.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-normal leading-none mt-0.5 whitespace-nowrap">
                        {node.subtitle}
                      </div>
                    </div>

                    {/* Latency Pill Badge */}
                    {node.latency && (
                      <div className="hidden lg:flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-md bg-black/50 border border-white/10 text-emerald-400">
                        <span>{node.latency}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Stack Fallback View (< 768px screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden relative z-10">
            {currentPreset.nodes.map((node) => {
              const isAgent = node.type === 'agent';
              const isSelected = activeNodeId === node.id;
              const Icon = node.icon;

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    setActiveNodeId(node.id);
                    triggerPulse();
                  }}
                  className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                    isAgent || isSelected
                      ? 'bg-[#1c1813] shadow-lg'
                      : 'bg-[#12161f] border-white/10'
                  }`}
                  style={{
                    borderColor: (isAgent || isSelected) ? currentPreset.themeColor : undefined,
                    boxShadow: (isAgent || isSelected) ? `0 0 30px ${currentPreset.glowColor}` : undefined
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: (isAgent || isSelected)
                        ? `linear-gradient(135deg, ${currentPreset.themeColor}, #ffffff)`
                        : 'rgba(255,255,255,0.05)',
                      color: (isAgent || isSelected) ? '#000' : '#fff'
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div 
                      className="text-sm font-black"
                      style={{
                        color: (isAgent || isSelected) ? currentPreset.themeColor : '#ffffff'
                      }}
                    >
                      {node.title}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {node.subtitle}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-time Telemetry & Live Simulation Log Drawer */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10 bg-black/40 p-4 sm:p-6 rounded-2xl backdrop-blur-md">
            {/* Left: Live Active Node Telemetry */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-3 h-3 rounded-full animate-ping"
                  style={{ backgroundColor: currentPreset.themeColor }}
                />
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  INSPECTING: <strong className="text-white uppercase font-mono">{activeNode.title}</strong>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {activeNode.statusText || 'STATUS: OPERATIONAL'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300">
                  LATENCY: <strong className="text-white">{activeNode.latency || '18ms'}</strong>
                </span>
                {activeNode.payload && (
                  <span className="hidden xl:inline-block px-2.5 py-1 rounded-lg bg-black/60 border border-white/5 text-zinc-400 max-w-xs truncate">
                    {activeNode.payload}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Simulation Step Indicator / CTA Button */}
            <div className="flex items-center justify-between w-full lg:w-auto gap-4">
              {isSimulating ? (
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>STEP {simulationStepIndex + 1}/{currentPreset.steps.length}: {activeSimulationStep.title}</span>
                </div>
              ) : (
                <span className="hidden lg:inline text-xs font-mono text-zinc-400">
                  Click any node to inspect telemetry or start simulation
                </span>
              )}

              <button
                onClick={() => window.open('https://wa.me/917880000000?text=Hi%20Zentrixs,%20I%20want%20to%20deploy%20an%20AI%20Agent%20Architecture%20Flow', '_blank')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-black transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${currentPreset.themeColor}, #ffffff)`
                }}
              >
                <span>Deploy Stack</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Live Step Log Banner (Visible when simulating or inspecting) */}
          {isSimulating && (
            <div className="mt-3 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 flex items-center gap-2 animate-fade-in">
              <Activity className="w-4 h-4 shrink-0 text-cyan-400 animate-pulse" />
              <span className="truncate">{activeSimulationStep.log}</span>
            </div>
          )}

        </div>

      </div>

      {/* Embedded High-Fidelity Custom Motion Styles */}
      <style>{`
        @keyframes flowDash {
          from {
            stroke-dashoffset: 24;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes nodeFloat1 {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-7px);
          }
        }

        @keyframes nodeFloat2 {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(-5px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(4px);
          }
        }

        @keyframes nodeFloat3 {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(2px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-6px);
          }
        }

        .flow-dash-anim {
          animation: flowDash 0.8s linear infinite;
        }

        .animate-node-float-1 {
          animation: nodeFloat1 5s ease-in-out infinite;
        }

        .animate-node-float-2 {
          animation: nodeFloat2 6.5s ease-in-out infinite;
        }

        .animate-node-float-3 {
          animation: nodeFloat3 5.8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default AgentFlow;
