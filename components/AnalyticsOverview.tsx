import React, { useEffect, useMemo, useState } from 'react';
import { Task, SystemItem, TaskStatus, TaskPriority, WorkType } from '../types/taskTypes';
import { PieChart, BarChart3, TrendingUp, Gauge, Layers3, Users, Activity } from 'lucide-react';

interface AnalyticsOverviewProps {
  tasks: Task[];
  systems: SystemItem[];
  isLight: boolean;
}

const STATUS_ORDER: TaskStatus[] = ['In Progress', 'Pending', 'Completed', 'In Review', 'Rejected'];
const STATUS_COLOR: Record<TaskStatus, { light: string; dark: string }> = {
  'In Progress': { light: '#3b82f6', dark: '#3b82f6' },
  'Pending': { light: '#f59e0b', dark: '#d97706' },
  'Completed': { light: '#10b981', dark: '#059669' },
  'In Review': { light: '#a855f7', dark: '#a855f7' },
  'Rejected': { light: '#f43f5e', dark: '#e11d48' },
};

const PRIORITY_ORDER: TaskPriority[] = ['Low', 'Medium', 'High', 'Urgent'];
const PRIORITY_COLOR: Record<TaskPriority, { light: string; dark: string }> = {
  'Low': { light: '#10b981', dark: '#059669' },
  'Medium': { light: '#3b82f6', dark: '#3b82f6' },
  'High': { light: '#f59e0b', dark: '#d97706' },
  'Urgent': { light: '#ef4444', dark: '#e11d48' },
};

const WORKTYPE_ORDER: WorkType[] = ['New System', 'Existing System Edit & Update', 'Error Received', 'Complain Report'];
const WORKTYPE_COLOR: Record<WorkType, { light: string; dark: string }> = {
  'New System': { light: '#3b82f6', dark: '#3b82f6' },
  'Existing System Edit & Update': { light: '#10b981', dark: '#059669' },
  'Error Received': { light: '#f59e0b', dark: '#d97706' },
  'Complain Report': { light: '#a855f7', dark: '#a855f7' },
};
const WORKTYPE_SHORT: Record<WorkType, string> = {
  'New System': 'New System',
  'Existing System Edit & Update': 'Edit & Update',
  'Error Received': 'Error',
  'Complain Report': 'Complaint',
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Catmull-Rom → cubic-bezier smoothing so the trend line reads as a continuous curve, not straight segments
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ tasks, systems, isLight }) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredStatus, setHoveredStatus] = useState<TaskStatus | null>(null);
  const [hoveredPriority, setHoveredPriority] = useState<TaskPriority | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const total = tasks.length;
  const year = new Date().getFullYear();

  // ---------- Theme tokens ----------
  const accentHex = isLight ? '#EA552E' : '#22d3ee';
  const cardBase = `rounded-2xl border p-5 transition-all duration-300 ${
    isLight ? 'bg-white border-[#EDE2D3] shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_rgba(234,85,46,0.08)]' : 'bg-[#0F172A]/80 border-white/10 hover:border-white/20'
  }`;
  const mutedText = isLight ? 'text-[#9C8F7D]' : 'text-slate-400';
  const subText = isLight ? 'text-[#6B5D4A]' : 'text-slate-300';
  const inkText = isLight ? 'text-[#2A2118]' : 'text-white';
  const trackCol = isLight ? '#F3EADC' : 'rgba(255,255,255,0.06)';
  const gridCol = isLight ? '#F3EADC' : 'rgba(255,255,255,0.07)';

  // ---------- Derived data ----------
  const statusData = useMemo(() =>
    STATUS_ORDER.map((status) => ({
      status,
      count: tasks.filter((t) => t.status === status).length,
      color: isLight ? STATUS_COLOR[status].light : STATUS_COLOR[status].dark,
    })).filter((d) => d.count > 0)
  , [tasks, isLight]);

  const priorityData = useMemo(() => {
    const maxCount = Math.max(1, ...PRIORITY_ORDER.map((p) => tasks.filter((t) => t.priorityInCustomer === p).length));
    return PRIORITY_ORDER.map((priority) => {
      const count = tasks.filter((t) => t.priorityInCustomer === priority).length;
      return {
        priority,
        count,
        color: isLight ? PRIORITY_COLOR[priority].light : PRIORITY_COLOR[priority].dark,
        pct: (count / maxCount) * 100,
      };
    });
  }, [tasks, isLight]);

  const workTypeData = useMemo(() => {
    const maxCount = Math.max(1, ...WORKTYPE_ORDER.map((w) => tasks.filter((t) => t.typeOfWork === w).length));
    return WORKTYPE_ORDER.map((type) => {
      const count = tasks.filter((t) => t.typeOfWork === type).length;
      return {
        type,
        count,
        color: isLight ? WORKTYPE_COLOR[type].light : WORKTYPE_COLOR[type].dark,
        pct: (count / maxCount) * 100,
      };
    }).filter((d) => d.count > 0);
  }, [tasks, isLight]);

  const systemData = useMemo(() => {
    const counts = new Map<string, number>();
    tasks.forEach((t) => counts.set(t.systemName, (counts.get(t.systemName) || 0) + 1));
    const arr = Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
    arr.sort((a, b) => b.count - a.count);
    const top = arr.slice(0, 5);
    const maxCount = Math.max(1, ...top.map((s) => s.count));
    return top.map((s) => ({ ...s, pct: (s.count / maxCount) * 100 }));
  }, [tasks]);

  const engineerData = useMemo(() => {
    const counts = new Map<string, number>();
    tasks.forEach((t) => {
      const name = t.assignedTo;
      if (!name || name === 'Unassigned') return;
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    const arr = Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
    arr.sort((a, b) => b.count - a.count);
    const top = arr.slice(0, 5);
    const maxCount = Math.max(1, ...top.map((s) => s.count));
    return top.map((s) => ({ ...s, pct: (s.count / maxCount) * 100 }));
  }, [tasks]);

  const unassignedCount = useMemo(() => tasks.filter((t) => !t.assignedTo || t.assignedTo === 'Unassigned').length, [tasks]);

  const trendData = useMemo(() => {
    const raised = new Array(12).fill(0);
    tasks.forEach((t) => {
      const c = new Date(t.createdAt);
      if (!isNaN(c.getTime()) && c.getFullYear() === year) raised[c.getMonth()] += 1;
    });
    return MONTH_LABELS.map((label, i) => ({ label, value: raised[i] }));
  }, [tasks, year]);

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const resolutionPct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // ---------- Donut geometry ----------
  const dSize = 170, dStroke = 20;
  const dR = (dSize - dStroke) / 2;
  const dC = 2 * Math.PI * dR;
  const dGap = statusData.length > 1 ? 3 : 0;
  let cum = 0;
  const segments = statusData.map((d) => {
    const frac = total > 0 ? d.count / total : 0;
    const raw = frac * dC;
    const segLen = Math.max(0, raw - dGap);
    const offset = cum;
    cum += raw;
    return { ...d, segLen, offset, pct: Math.round(frac * 100) };
  });
  const centerContent = hoveredStatus ? segments.find((s) => s.status === hoveredStatus) : null;

  // ---------- Resolution gauge geometry ----------
  const gSize = 160, gStroke = 16;
  const gR = (gSize - gStroke) / 2;
  const gC = 2 * Math.PI * gR;
  const gaugeHex = resolutionPct >= 66 ? '#10b981' : resolutionPct >= 33 ? '#f59e0b' : accentHex;

  // ---------- Trend geometry ----------
  const vbW = 1000, vbH = 240;
  const padL = 40, padR = 18, padT = 16, padB = 32;
  const chartW = vbW - padL - padR;
  const chartH = vbH - padT - padB;
  const maxVal = Math.max(0, ...trendData.map((d) => d.value));
  const niceMax = Math.max(4, Math.ceil(maxVal / 4) * 4);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => niceMax * f);
  const trendPoints = trendData.map((d, i) => ({
    x: padL + (i * chartW) / (trendData.length - 1),
    y: padT + (1 - d.value / niceMax) * chartH,
    ...d,
  }));
  const linePath = smoothPath(trendPoints);
  const areaPath = `${linePath} L ${trendPoints[trendPoints.length - 1].x},${padT + chartH} L ${trendPoints[0].x},${padT + chartH} Z`;
  const hasTrendData = trendData.some((d) => d.value > 0);

  const CardHeader = ({ icon: Icon, title, sub }: { icon: React.ComponentType<{ className?: string }>; title: string; sub: string }) => (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-0.5">
        <Icon className={`w-4 h-4 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
        <h3 className={`text-sm font-black uppercase tracking-wide ${inkText}`}>{title}</h3>
      </div>
      <p className={`text-[11px] ${mutedText}`}>{sub}</p>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* ============ HERO: Ticket Activity Trend ============ */}
      <div className={`stagger-item ${cardBase}`}>
        <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <TrendingUp className={`w-4 h-4 ${isLight ? 'text-[#EA552E]' : 'text-cyan-400'}`} />
              <h3 className={`text-sm font-black uppercase tracking-wide ${inkText}`}>Ticket Activity</h3>
            </div>
            <p className={`text-[11px] ${mutedText}`}>
              {hasTrendData ? `Tickets raised per month · ${year}` : `No tickets raised yet in ${year}`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-xl font-black ${inkText}`}>{total}</div>
              <div className={`text-[9px] font-bold uppercase tracking-widest ${mutedText}`}>Total YTD</div>
            </div>
            <div className={`w-px h-8 ${isLight ? 'bg-[#EDE2D3]' : 'bg-white/10'}`}></div>
            <div className="text-right">
              <div className="text-xl font-black text-emerald-500">{completedCount}</div>
              <div className={`text-[9px] font-bold uppercase tracking-widest ${mutedText}`}>Resolved</div>
            </div>
          </div>
        </div>

        <svg viewBox={`0 0 ${vbW} ${vbH}`} className="w-full h-auto">
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentHex} stopOpacity={isLight ? 0.2 : 0.3} />
              <stop offset="100%" stopColor={accentHex} stopOpacity={0} />
            </linearGradient>
          </defs>

          {yTicks.map((tick, i) => {
            const y = padT + (1 - tick / niceMax) * chartH;
            return (
              <g key={i}>
                <line x1={padL} y1={y} x2={vbW - padR} y2={y} stroke={gridCol} strokeWidth={1} />
                <text x={padL - 10} y={y + 4} textAnchor="end" fontSize="12" fontFamily="monospace" fill={isLight ? '#B5A892' : '#64748b'}>{tick}</text>
              </g>
            );
          })}

          <path d={areaPath} fill="url(#trendFill)" stroke="none" />
          <path
            d={linePath}
            fill="none"
            stroke={accentHex}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: mounted ? 'none' : '2600',
              strokeDashoffset: mounted ? 0 : 2600,
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s',
            }}
          />

          {hoveredMonth !== null && (
            <g>
              <line x1={trendPoints[hoveredMonth].x} y1={padT} x2={trendPoints[hoveredMonth].x} y2={padT + chartH} stroke={accentHex} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.5} />
              <circle cx={trendPoints[hoveredMonth].x} cy={trendPoints[hoveredMonth].y} r={7} fill={accentHex} stroke={isLight ? '#fff' : '#0F172A'} strokeWidth={3} />
            </g>
          )}

          {trendPoints.map((p, i) => (
            <text key={i} x={p.x} y={vbH - 8} textAnchor="middle" fontSize="12" fontWeight={hoveredMonth === i ? 700 : 500} fontFamily="system-ui, sans-serif" fill={hoveredMonth === i ? accentHex : (isLight ? '#9C8F7D' : '#64748b')}>{p.label}</text>
          ))}

          {trendPoints.map((p, i) => {
            const zoneW = chartW / trendPoints.length;
            return <rect key={i} x={p.x - zoneW / 2} y={padT} width={zoneW} height={chartH} fill="transparent" onMouseEnter={() => setHoveredMonth(i)} onMouseLeave={() => setHoveredMonth(null)} className="cursor-crosshair" />;
          })}

          {hoveredMonth !== null && (() => {
            const p = trendPoints[hoveredMonth];
            const tipW = 128, tipH = 42;
            const tipX = Math.min(Math.max(p.x - tipW / 2, padL), vbW - padR - tipW);
            const tipY = Math.max(p.y - tipH - 14, padT);
            return (
              <g style={{ pointerEvents: 'none' }}>
                <rect x={tipX} y={tipY} width={tipW} height={tipH} rx={10} fill={isLight ? '#2A2118' : '#1e293b'} opacity={0.96} />
                <text x={tipX + tipW / 2} y={tipY + 17} textAnchor="middle" fontSize="12.5" fontWeight={700} fill="#fff">{p.label} {year}</text>
                <text x={tipX + tipW / 2} y={tipY + 33} textAnchor="middle" fontSize="12.5" fontFamily="monospace" fill={accentHex}>{p.value} raised</text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* ============ ROW: Resolution Gauge | Status Donut | Priority ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Resolution Rate gauge */}
        <div className={`stagger-item ${cardBase}`}>
          <CardHeader icon={Gauge} title="Resolution Rate" sub="Completed vs total tickets" />
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative" style={{ width: gSize, height: gSize }}>
              <svg width={gSize} height={gSize} viewBox={`0 0 ${gSize} ${gSize}`}>
                <circle cx={gSize / 2} cy={gSize / 2} r={gR} fill="none" stroke={trackCol} strokeWidth={gStroke} />
                {resolutionPct > 0 && (
                  <g transform={`rotate(-90 ${gSize / 2} ${gSize / 2})`}>
                    <circle
                      cx={gSize / 2}
                      cy={gSize / 2}
                      r={gR}
                      fill="none"
                      stroke={gaugeHex}
                      strokeWidth={gStroke}
                      strokeLinecap="round"
                      strokeDasharray={`${mounted ? (resolutionPct / 100) * gC : 0} ${gC}`}
                      style={{ transition: 'stroke-dasharray 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s' }}
                    />
                  </g>
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className={`text-3xl font-black ${inkText}`}>{resolutionPct}<span className="text-lg">%</span></span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${mutedText}`}>Resolved</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="text-center">
                <div className="text-lg font-black text-emerald-500">{completedCount}</div>
                <div className={`text-[9px] font-bold uppercase tracking-widest ${mutedText}`}>Done</div>
              </div>
              <div className={`w-px h-7 ${isLight ? 'bg-[#EDE2D3]' : 'bg-white/10'}`}></div>
              <div className="text-center">
                <div className={`text-lg font-black ${inkText}`}>{total - completedCount}</div>
                <div className={`text-[9px] font-bold uppercase tracking-widest ${mutedText}`}>Open</div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Donut */}
        <div className={`stagger-item ${cardBase}`}>
          <CardHeader icon={PieChart} title="Ticket Status" sub="Live breakdown by stage" />
          {total === 0 ? (
            <div className={`flex items-center justify-center h-40 text-xs ${mutedText}`}>No tickets yet</div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative" style={{ width: dSize, height: dSize }}>
                <svg width={dSize} height={dSize} viewBox={`0 0 ${dSize} ${dSize}`}>
                  <circle cx={dSize / 2} cy={dSize / 2} r={dR} fill="none" stroke={trackCol} strokeWidth={dStroke} />
                  <g transform={`rotate(-90 ${dSize / 2} ${dSize / 2})`}>
                    {segments.map((s) => (
                      <circle
                        key={s.status}
                        cx={dSize / 2}
                        cy={dSize / 2}
                        r={dR}
                        fill="none"
                        stroke={s.color}
                        strokeWidth={hoveredStatus === s.status ? dStroke + 4 : dStroke}
                        strokeLinecap="round"
                        strokeDasharray={mounted ? `${s.segLen} ${dC - s.segLen}` : `0 ${dC}`}
                        strokeDashoffset={-s.offset}
                        onMouseEnter={() => setHoveredStatus(s.status)}
                        onMouseLeave={() => setHoveredStatus(null)}
                        className="cursor-pointer transition-all duration-700 ease-out"
                        style={{ transitionProperty: 'stroke-dasharray, stroke-width', transitionDelay: mounted ? '0.1s' : '0s' }}
                      />
                    ))}
                  </g>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  {centerContent ? (
                    <>
                      <span className={`text-2xl font-black ${inkText}`}>{centerContent.count}</span>
                      <span className={`text-[10px] font-bold ${mutedText}`}>{centerContent.status}</span>
                      <span className="text-[10px] font-mono" style={{ color: centerContent.color }}>{centerContent.pct}%</span>
                    </>
                  ) : (
                    <>
                      <span className={`text-2xl font-black ${inkText}`}>{total}</span>
                      <span className={`text-[10px] font-bold ${mutedText}`}>Total</span>
                    </>
                  )}
                </div>
              </div>
              <div className="w-full mt-4 space-y-1.5">
                {segments.map((s) => (
                  <div
                    key={s.status}
                    onMouseEnter={() => setHoveredStatus(s.status)}
                    onMouseLeave={() => setHoveredStatus(null)}
                    className={`flex items-center justify-between gap-2 px-2 py-1 rounded-lg cursor-pointer transition-colors duration-150 ${hoveredStatus === s.status ? (isLight ? 'bg-[#FBF5EC]' : 'bg-white/5') : ''}`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }}></span>
                      <span className={`text-xs font-semibold truncate ${inkText}`}>{s.status}</span>
                    </span>
                    <span className={`text-xs font-mono font-bold shrink-0 ${mutedText}`}>{s.count} · {s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Priority Breakdown */}
        <div className={`stagger-item ${cardBase}`}>
          <CardHeader icon={BarChart3} title="Priority Breakdown" sub="Urgency across open tickets" />
          <div className="space-y-4 pt-1">
            {priorityData.map((p, idx) => (
              <div
                key={p.priority}
                onMouseEnter={() => setHoveredPriority(p.priority)}
                onMouseLeave={() => setHoveredPriority(null)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold flex items-center gap-1.5 ${inkText}`}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                    {p.priority}
                  </span>
                  <span className={`text-xs font-mono font-bold ${mutedText}`}>{p.count}</span>
                </div>
                <div className={`h-2.5 rounded-full overflow-hidden ${isLight ? 'bg-[#F3EADC]' : 'bg-white/5'}`}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: mounted ? `${p.pct}%` : '0%',
                      backgroundColor: p.color,
                      opacity: hoveredPriority && hoveredPriority !== p.priority ? 0.45 : 1,
                      transitionDuration: '800ms',
                      transitionDelay: `${0.15 + idx * 0.08}s`,
                      transitionProperty: 'width, opacity',
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ ROW: Systems | Engineers | Work Type ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Tickets by System */}
        <div className={`stagger-item ${cardBase}`}>
          <CardHeader icon={Layers3} title="Top Systems" sub="Where work is concentrated" />
          {systemData.length === 0 ? (
            <div className={`flex items-center justify-center h-28 text-xs ${mutedText}`}>No system data</div>
          ) : (
            <div className="space-y-3 pt-1">
              {systemData.map((s, idx) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[11px] font-semibold truncate pr-2 ${subText}`} title={s.name}>{s.name}</span>
                    <span className={`text-[11px] font-mono font-bold shrink-0 ${mutedText}`}>{s.count}</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isLight ? 'bg-[#F3EADC]' : 'bg-white/5'}`}>
                    <div
                      className={`h-full rounded-full ${isLight ? 'bg-[#EA552E]' : 'bg-cyan-500'}`}
                      style={{ width: mounted ? `${s.pct}%` : '0%', transitionDuration: '800ms', transitionDelay: `${0.2 + idx * 0.06}s`, transitionProperty: 'width' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Engineer Workload */}
        <div className={`stagger-item ${cardBase}`}>
          <CardHeader icon={Users} title="Engineer Workload" sub="Active assignments per engineer" />
          {engineerData.length === 0 ? (
            <div className={`flex flex-col items-center justify-center h-28 text-center ${mutedText}`}>
              <span className="text-xs">No engineers assigned yet</span>
              {unassignedCount > 0 && <span className="text-[10px] mt-1">{unassignedCount} ticket{unassignedCount > 1 ? 's' : ''} awaiting assignment</span>}
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {engineerData.map((e, idx) => (
                <div key={e.name} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${isLight ? 'bg-[#FDEEE7] text-[#EA552E]' : 'bg-cyan-500/15 text-cyan-300'}`}>
                    {e.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[11px] font-semibold truncate pr-2 ${subText}`} title={e.name}>{e.name}</span>
                      <span className={`text-[11px] font-mono font-bold shrink-0 ${mutedText}`}>{e.count}</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isLight ? 'bg-[#F3EADC]' : 'bg-white/5'}`}>
                      <div
                        className={`h-full rounded-full ${isLight ? 'bg-[#EA552E]' : 'bg-cyan-500'}`}
                        style={{ width: mounted ? `${e.pct}%` : '0%', transitionDuration: '800ms', transitionDelay: `${0.2 + idx * 0.06}s`, transitionProperty: 'width' }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              {unassignedCount > 0 && (
                <div className={`flex items-center justify-between pt-2 mt-1 border-t text-[11px] ${isLight ? 'border-[#F3EADC] text-amber-600' : 'border-white/5 text-amber-400'}`}>
                  <span className="font-semibold">Unassigned</span>
                  <span className="font-mono font-bold">{unassignedCount}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Work Type Mix */}
        <div className={`stagger-item ${cardBase}`}>
          <CardHeader icon={Activity} title="Work Type Mix" sub="Nature of requests raised" />
          {workTypeData.length === 0 ? (
            <div className={`flex items-center justify-center h-28 text-xs ${mutedText}`}>No work-type data</div>
          ) : (
            <div className="space-y-4 pt-1">
              {workTypeData.map((w, idx) => (
                <div key={w.type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${inkText}`}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: w.color }}></span>
                      {WORKTYPE_SHORT[w.type]}
                    </span>
                    <span className={`text-xs font-mono font-bold ${mutedText}`}>{w.count}</span>
                  </div>
                  <div className={`h-2.5 rounded-full overflow-hidden ${isLight ? 'bg-[#F3EADC]' : 'bg-white/5'}`}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: mounted ? `${w.pct}%` : '0%', backgroundColor: w.color, transitionDuration: '800ms', transitionDelay: `${0.2 + idx * 0.07}s`, transitionProperty: 'width' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
