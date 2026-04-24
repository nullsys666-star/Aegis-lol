import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Globe, 
  Satellite, 
  Map as MapIcon, 
  Activity, 
  Terminal, 
  Lock, 
  Eye, 
  Zap, 
  AlertTriangle,
  Radar,
  Plane,
  Ship,
  Search,
  Cpu,
  Fingerprint
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { cn } from './lib/utils';

// --- Static Data Definitions ---

const THREAT_LOGS = [
  { id: '1', level: 'CRITICAL', type: 'SQL_INJECTION', source: '203.0.113.45', target: 'INTERNAL_DB_SC', time: '14:23:45' },
  { id: '2', level: 'HIGH', type: 'BRUTE_FORCE', source: '198.51.100.2', target: 'AUTH_GATEWAY', time: '14:24:12' },
  { id: '3', level: 'LOW', type: 'PORT_SCAN', source: '192.0.2.16', target: 'DMZ_CLUSTER', time: '14:25:01' },
  { id: '4', level: 'MEDIUM', type: 'MALFORMED_PACKET', source: '185.122.3.9', target: 'VOIP_PBX', time: '14:26:33' },
  { id: '5', level: 'CRITICAL', type: 'ZERO_DAY_EXPLOIT', source: 'UNKNOWN', target: 'CORE_SWITCH', time: '14:27:55' },
];

const SATELLITE_DATA = [
  { id: 'AEGIS-1', orbital: 'LEO', state: 'ACTIVE', trajectory: '98.2°', altitude: '542km' },
  { id: 'KH-11X', orbital: 'HEO', state: 'SURVEILLANCE', trajectory: '112.5°', altitude: '12,450km' },
  { id: 'IRIS-B', orbital: 'GEO', state: 'STABLE', trajectory: '0.0°', altitude: '35,786km' },
];

const ASSET_TRACKING = [
  { id: 'FL-442', type: 'AIRCRAFT', model: 'MQ-9 REAPER', status: 'ON_STATION', lat: '34.0522', lng: '-118.2437' },
  { id: 'USNS-INTREPID', type: 'VESSEL', model: 'SPEARHEAD-CLASS', status: 'TRANSIT', lat: '12.4532', lng: '145.2211' },
  { id: 'X-37B', type: 'SPACE_PLANE', model: 'CLASSIFIED', status: 'ORBITAL_MANEUVER', lat: '0.0000', lng: '0.0000' },
];

const VULN_CHART_DATA = [
  { name: '08:00', value: 40 },
  { name: '10:00', value: 30 },
  { name: '12:00', value: 65 },
  { name: '14:00', value: 85 },
  { name: '16:00', value: 50 },
  { name: '18:00', value: 75 },
];

// --- Sub-Components ---

const TacticalPanel = ({ title, icon: Icon, children, className }: any) => (
  <div className={cn("bg-black border border-white/10 rounded-sm overflow-hidden flex flex-col", className)}>
    <div className="flex items-center justify-between px-3 py-2 border-bottom border-white/5 bg-white/5">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-emerald-500" />
        <h3 className="text-[10px] font-mono tracking-widest uppercase text-white/50">{title}</h3>
      </div>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
      </div>
    </div>
    <div className="p-4 flex-1">
      {children}
    </div>
  </div>
);

const TerminalLine = ({ text, delay = 0, type = 'default' }: any) => {
  const colors = {
    default: 'text-emerald-500/80',
    info: 'text-blue-400',
    warning: 'text-yellow-500',
    error: 'text-red-500',
    success: 'text-emerald-400'
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={cn("text-[11px] font-mono mb-1", colors[type as keyof typeof colors])}
    >
      <span className="opacity-50 inline-block w-4">&gt;&gt;</span> {text}
    </motion.div>
  );
};

// --- Main Application ---

export default function App() {
  // --- Detailed Asset & Metadata Definitions ---

  const THREAT_LOGS = [
    { id: '1', level: 'CRITICAL', type: 'SQL_INJECTION', source: '203.0.113.45', target: 'INTERNAL_DB_SC', time: '14:23:45', timestamp: 1713988225, status: 'BLOCKED' },
    { id: '2', level: 'HIGH', type: 'BRUTE_FORCE', source: '198.51.100.2', target: 'AUTH_GATEWAY', time: '14:24:12', timestamp: 1713988452, status: 'MONITORING' },
    { id: '3', level: 'LOW', type: 'PORT_SCAN', source: '192.0.2.16', target: 'DMZ_CLUSTER', time: '14:25:01', timestamp: 1713988501, status: 'LOGGED' },
    { id: '4', level: 'MEDIUM', type: 'MALFORMED_PACKET', source: '185.122.3.9', target: 'VOIP_PBX', time: '14:26:33', timestamp: 1713988593, status: 'BLOCKED' },
    { id: '5', level: 'CRITICAL', type: 'ZERO_DAY_EXPLOIT', source: 'UNKNOWN', target: 'CORE_SWITCH', time: '14:27:55', timestamp: 1713988675, status: 'ACTIVE' },
  ];

  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtering & Sorting State
  const [threatFilter, setThreatFilter] = useState('ALL');
  const [threatSort, setThreatSort] = useState('TIME_DESC');

  // Simulated Threat Intel Feed
  const [threatFeed, setThreatFeed] = useState([
    { id: 'ioc-1', type: 'MALWARE_C2', indicator: '7c8d9e2a...f41b', source: 'CRIT_INTEL', time: '14:30:11', severity: 'HIGH' },
    { id: 'ioc-2', type: 'PHISHING_URL', indicator: 'secure-login-gov.xyz', source: 'PHISH_TANK', time: '14:32:05', severity: 'MEDIUM' },
    { id: 'ioc-3', type: 'ZERO_DAY', indicator: 'CVE-2026-9912', source: 'NVD_MIRROR', time: '14:35:44', severity: 'CRITICAL' },
    { id: 'ioc-4', type: 'IP_REPUTATION', indicator: '212.44.12.9', source: 'OVAL_FEED', time: '14:38:12', severity: 'LOW' },
  ]);

  const filteredThreats = THREAT_LOGS
    .filter(log => threatFilter === 'ALL' || log.level === threatFilter)
    .sort((a, b) => {
      if (threatSort === 'TIME_DESC') return b.timestamp - a.timestamp;
      if (threatSort === 'TIME_ASC') return a.timestamp - b.timestamp;
      if (threatSort === 'SEVERITY') {
        const priority: any = { 'CRITICAL': 3, 'HIGH': 2, 'MEDIUM': 1, 'LOW': 0 };
        return priority[b.level] - priority[a.level];
      }
      return 0;
    });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const alertInterval = setInterval(() => setIsAlertActive(prev => !prev), 2000);
    return () => {
      clearInterval(timer);
      clearInterval(alertInterval);
    };
  }, []);

  const navItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: Activity },
    { id: 'NETWORK', label: 'Network & Intel', icon: Shield },
    { id: 'SATELLITE', label: 'Satellite Ops', icon: Satellite },
    { id: 'ASSETS', label: 'Asset Tracker', icon: Radar }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-mono selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* HUD Header / Agency Bar */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-6 py-3 flex items-center justify-between border-b border-slate-800 backdrop-blur-md bg-slate-950/90 uppercase">
        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 bg-slate-900 border border-slate-800 rounded"
          >
            <Search className="w-4 h-4 text-cyan-400" />
          </button>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center bg-slate-900">
               <Shield className={cn("w-4 h-4", isAlertActive ? "text-red-500" : "text-cyan-400")} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[10px] md:text-xs font-bold tracking-widest text-white leading-none whitespace-nowrap">CENTRAL INTELLIGENCE COMMAND</h1>
              <span className="text-[8px] md:text-[10px] text-cyan-500 opacity-70 tracking-tighter">SECURE OPERATIONAL GATEWAY // UNIT-09</span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden md:block"></div>

          <nav className="hidden md:flex items-center gap-4 text-[10px] tracking-tighter">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "px-2 py-1 transition-all border-b-2",
                  activeTab === item.id 
                    ? "border-cyan-500 text-cyan-400" 
                    : "border-transparent text-slate-500 hover:text-slate-300"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-right">
          <div className="hidden lg:flex gap-4 text-[10px] uppercase tracking-tighter text-left">
            <div className="flex flex-col">
              <span className="text-slate-500">Threat Level</span>
              <span className={cn(isAlertActive ? "text-red-500" : "text-amber-500")}>ELEVATED (BETA-4)</span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-sm md:text-xl font-light text-slate-100 tracking-widest tabular-nums leading-none">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              <span className="text-[8px] md:text-[10px] text-slate-500 ml-1">UTC</span>
            </div>
            <div className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-widest mt-1">
              {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed inset-0 z-[110] bg-slate-950/95 backdrop-blur-xl md:hidden flex flex-col p-6"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-bold tracking-widest text-white uppercase">Menu Selection</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-900 rounded">
                <Zap className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded border transition-all text-left",
                    activeTab === item.id 
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-400" 
                      : "bg-slate-900/50 border-slate-800 text-slate-400"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-auto space-y-4">
               <div className="p-4 bg-slate-900 border border-slate-800 rounded">
                  <span className="text-[10px] text-slate-500 uppercase block mb-2">Search Registry</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter ID or IP..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-black/40 border border-slate-700 px-3 py-2 text-xs text-cyan-400 outline-none"
                    />
                    <button className="p-2 bg-cyan-600 text-black"><Search className="w-4 h-4" /></button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="pt-20 pb-12 px-4 h-screen overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
          
          {/* Collapsible Left Column (Mobile: Hidden/Overlay) */}
          <div className={cn(
            "md:col-span-3 flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-none",
            "hidden md:flex"
          )}>
            <TacticalPanel title="Unified Threat Intel" icon={Fingerprint} className="bg-slate-900/50 border-slate-800">
               <div className="flex flex-col gap-2 mb-4">
                  <div className="flex gap-1">
                     {['ALL', 'CRITICAL', 'HIGH'].map(lvl => (
                        <button 
                          key={lvl}
                          onClick={() => setThreatFilter(lvl)}
                          className={cn(
                            "px-2 py-1 text-[8px] border border-slate-800 rounded uppercase flex-1 transition-colors",
                            threatFilter === lvl ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" : "text-slate-500"
                          )}
                        >
                           {lvl}
                        </button>
                     ))}
                  </div>
                  <select 
                    onChange={(e) => setThreatSort(e.target.value)}
                    className="bg-black/50 border border-slate-800 text-[8px] text-slate-400 p-1 rounded outline-none uppercase"
                  >
                     <option value="TIME_DESC">Sort: Latest</option>
                     <option value="TIME_ASC">Sort: Oldest</option>
                     <option value="SEVERITY">Sort: Severity</option>
                  </select>
               </div>
               <div className="flex flex-col gap-3">
                 {filteredThreats.map((log) => (
                   <div key={log.id} className="p-2 bg-slate-950/50 border-l border-cyan-500/30 hover:bg-slate-900 transition-colors group">
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                          "text-[9px] font-bold tracking-widest uppercase",
                          log.level === 'CRITICAL' ? "text-red-500" : "text-cyan-500"
                        )}>{log.type}</span>
                        <span className="text-[8px] text-slate-600 group-hover:text-slate-400">{log.time}</span>
                      </div>
                      <div className="text-[10px] text-slate-300 font-mono break-all mb-1">{log.source} {"->"} {log.target}</div>
                      <div className="flex justify-between items-center text-[8px] text-slate-500 uppercase tracking-tighter">
                         <span>Status: {log.status}</span>
                         <span className="font-bold">{log.level}</span>
                      </div>
                   </div>
                 ))}
               </div>
            </TacticalPanel>

            <TacticalPanel title="Telemetry Dynamics" icon={Cpu} className="bg-slate-900/50 border-slate-800 flex-1">
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase">
                    <span>Structural Detection</span>
                    <span className="text-emerald-400">NOMINAL</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase">
                    <span>Change Detection</span>
                    <span className="text-amber-400">PENDING [4]</span>
                  </div>
                  <div className="relative h-24 bg-black border border-slate-800 overflow-hidden group">
                     {/* Animated Scan Line */}
                     <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }} 
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-px bg-cyan-400/50 shadow-[0_0_10px_#22d3ee] z-20"
                     />
                     <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay"></div>
                     <div className="p-2 relative z-10 flex flex-col justify-between h-full">
                        <span className="text-[8px] text-cyan-400 font-bold uppercase tracking-widest">Saliency Map v4.2</span>
                        <div className="flex gap-1">
                           <div className="w-2 h-2 bg-red-500/50 animate-ping"></div>
                           <div className="text-[8px] text-red-400 uppercase">Marker Found</div>
                        </div>
                     </div>
                  </div>
               </div>
            </TacticalPanel>
          </div>

          {/* Dynamic Center Column */}
          <div className="col-span-1 md:col-span-6 flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {activeTab === 'DASHBOARD' && (
                <motion.div 
                  key="dash"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 flex flex-col gap-4 overflow-hidden"
                >
                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 p-12">
                      <svg viewBox="0 0 800 400" className="w-full h-full fill-slate-300">
                         <path d="M150,150 L160,140 L180,145 L200,130 L220,135 L240,150 L250,170 L240,190 L220,200 L200,195 L180,210 L160,200 L150,180 Z" />
                         <path d="M450,100 L470,90 L500,95 L520,110 L530,130 L520,150 L500,160 L480,155 L460,140 L450,120 Z" />
                         <path d="M300,250 L320,240 L350,245 L370,260 L380,280 L370,300 L350,310 L330,305 L310,290 L300,270 Z" />
                         <path d="M600,200 L620,190 L650,195 L670,210 L680,230 L670,250 L650,260 L630,255 L610,240 L600,220 Z" />
                         {/* More abstract world map representation */}
                         <rect x="50" y="50" width="700" height="300" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                      </svg>
                    </div>
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-black/80 backdrop-blur-md border border-slate-700 p-3 rounded group cursor-crosshair">
                        <div className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-between gap-12">
                          <span>Operational Theatre</span>
                          <span className="text-cyan-500 font-mono animate-pulse">LIVE</span>
                        </div>
                        <h2 className="text-xs md:text-sm font-bold text-white tracking-widest uppercase italic">ORBITAL VIEWPORT v2.0</h2>
                        <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-800 pt-2">
                           <div className="flex flex-col">
                              <span className="text-[7px] text-slate-600 uppercase">Focus</span>
                              <span className="text-[9px] text-cyan-400">NODE_BETA_9</span>
                           </div>
                           <div className="flex flex-col border-l border-slate-800 pl-2">
                              <span className="text-[7px] text-slate-600 uppercase">Stability</span>
                              <span className="text-[9px] text-emerald-400">98.4%</span>
                           </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Simulated Satellite Pings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                       {[
                         { t: '20%', l: '30%', c: 'red' },
                         { t: '60%', l: '70%', c: 'cyan' },
                         { t: '40%', l: '50%', c: 'red' },
                         { t: '80%', l: '10%', c: 'purple' },
                         { t: '15%', l: '85%', c: 'cyan' }
                       ].map((ping, i) => (
                         <div 
                           key={i} 
                           className="absolute w-2 h-2 rounded-full" 
                           style={{ top: ping.t, left: ping.l }}
                         >
                            <div className={cn(
                              "absolute inset-0 rounded-full animate-ping opacity-75",
                              ping.c === 'red' ? "bg-red-500" : ping.c === 'purple' ? "bg-purple-500" : "bg-cyan-500"
                            )} />
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              ping.c === 'red' ? "bg-red-600" : ping.c === 'purple' ? "bg-purple-600" : "bg-cyan-600"
                            )} />
                         </div>
                       ))}
                    </div>

                    <div className="absolute bottom-4 right-4 flex gap-2 md:gap-4 flex-wrap justify-end">
                      <div className="bg-black/70 border border-slate-700 p-2 rounded flex flex-col min-w-[70px]">
                        <span className="text-[8px] text-slate-500 uppercase">SAT-UP</span>
                        <span className="text-xs text-emerald-400 font-bold font-mono">14/14</span>
                      </div>
                      <div className="bg-black/70 border border-slate-700 p-2 rounded flex flex-col min-w-[70px]">
                        <span className="text-[8px] text-slate-500 uppercase">LATENCY</span>
                        <span className="text-xs text-cyan-400 font-bold font-mono">12ms</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-32 md:h-44 grid grid-cols-2 gap-4">
                     <div className="bg-slate-900 border border-slate-800 rounded p-4 overflow-hidden">
                        <div className="text-[8px] md:text-[10px] text-cyan-400 uppercase font-bold mb-2 flex items-center gap-2">
                           <Activity className="w-3 h-3" /> Live Signal
                        </div>
                        <div className="h-16 md:h-24 w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={VULN_CHART_DATA}>
                                 <Area type="step" dataKey="value" stroke="#06b6d4" fill="#06b6d433" strokeWidth={1} />
                              </AreaChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                     <div className="bg-slate-900 border border-slate-800 rounded p-4 overflow-hidden">
                        <div className="text-[8px] md:text-[10px] text-cyan-400 uppercase font-bold mb-2 flex items-center gap-2">
                           <Shield className="w-3 h-3" /> Security Load
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-16 md:h-20 items-center">
                           <div className="flex flex-col gap-0.5 md:gap-1">
                              <span className="text-[7px] md:text-[8px] text-slate-500 uppercase">Analytic Bypass</span>
                              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                 <motion.div animate={{ width: '85%' }} className="h-full bg-emerald-500" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-0.5 md:gap-1">
                              <span className="text-[7px] md:text-[8px] text-slate-500 uppercase">API Gate</span>
                              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                 <motion.div animate={{ width: '42%' }} className="h-full bg-cyan-500" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'SATELLITE' && (
                <motion.div 
                  key="sat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex-1 flex flex-col gap-4 overflow-hidden"
                >
                  <div className="flex-1 bg-black border border-slate-800 relative overflow-hidden group">
                     {/* Crosshair Overlay */}
                     <div className="absolute inset-0 pointer-events-none border border-cyan-500/5">
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/20"></div>
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-500/20"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-cyan-500/20 rounded-full"></div>
                     </div>
                     
                     <div className="absolute inset-0 flex items-center justify-center opacity-40">
                        <Satellite className="w-48 h-48 text-slate-800 animate-pulse" />
                     </div>

                     <div className="absolute top-4 right-4 text-right z-20">
                        <div className="bg-black/90 p-2 md:p-3 border border-slate-800 rounded max-w-[150px] md:max-w-none">
                           <div className="text-[8px] md:text-[10px] text-cyan-400 font-bold mb-1 uppercase tracking-[0.3em]">Imaging Module</div>
                           <div className="text-[7px] md:text-[9px] text-slate-500 font-mono break-all leading-tight">TAR: 34.0522°N 118.2437°W</div>
                        </div>
                     </div>

                     <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row gap-2 z-20">
                        <div className="flex gap-2">
                           <button className="flex-1 md:flex-none px-4 py-2 bg-cyan-900/40 border border-cyan-500/50 text-[10px] font-bold text-cyan-400 uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all">Archival Search</button>
                           <button className="flex-1 md:flex-none px-4 py-2 bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300 uppercase tracking-widest transition-all">Export</button>
                        </div>
                        <div className="bg-black/80 p-2 border border-slate-800 rounded flex gap-4 overflow-hidden">
                           <div className="flex flex-col whitespace-nowrap">
                              <span className="text-[7px] md:text-[8px] text-slate-500 uppercase">Imagery Node</span>
                              <span className="text-[9px] md:text-[10px] text-white">MAXAR_HD-4</span>
                           </div>
                           <div className="flex flex-col border-l border-slate-800 pl-4 whitespace-nowrap">
                              <span className="text-[7px] md:text-[8px] text-slate-500 uppercase">Detection Mode</span>
                              <span className="text-[9px] md:text-[10px] text-emerald-400 uppercase font-bold">Auto-Pattern</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 h-24 md:h-32">
                     {['INFRARED', 'SAR_RADAR', 'H_SPECTRAL'].map((mode) => (
                        <div key={mode} className="bg-slate-900 border border-slate-800 p-2 md:p-3 flex flex-col group cursor-pointer hover:border-cyan-500/50 transition-all overflow-hidden last:hidden lg:last:flex">
                           <span className="text-[7px] md:text-[9px] text-slate-500 uppercase mb-1">{mode}</span>
                           <div className="flex-1 bg-black/40 border border-slate-800 rounded relative overflow-hidden flex items-center justify-center">
                              <Eye className="w-4 h-4 text-slate-700 group-hover:text-cyan-400" />
                              <div className="absolute top-1 right-1 flex gap-0.5">
                                 <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'NETWORK' && (
                <motion.div 
                  key="network"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col gap-4 overflow-hidden"
                >
                  <TacticalPanel title="Cyber Offensive Module" icon={Zap} className="flex-1 bg-slate-900/50">
                    <div className="grid lg:grid-cols-2 gap-6 h-full">
                      <div className="flex flex-col gap-4">
                        <div className="p-4 bg-black border border-slate-800 rounded">
                           <h4 className="text-[10px] text-cyan-400 uppercase font-bold mb-4 tracking-widest border-b border-cyan-900 pb-1 flex justify-between">
                              <span>Malware Distribution Scan</span>
                              <span className="text-[8px] text-slate-500 font-mono">STATUS: ACTIVE</span>
                           </h4>
                           <div className="flex flex-col gap-3">
                              {[
                                { label: 'Known Trojans', status: 'OK', color: 'text-emerald-400' },
                                { label: 'Ransomware Invariants', status: 'ALERT [1]', color: 'text-red-500 underline' },
                                { label: 'Phishing Heuristics', status: 'ELEVATED', color: 'text-amber-500' },
                                { label: 'Zero-Day Fingerprints', status: 'SEARCHING', color: 'text-cyan-500 animate-pulse' }
                              ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-[10px]">
                                   <span className="text-slate-500">{item.label}</span>
                                   <span className={cn("font-mono", item.color)}>{item.status}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded flex-1 flex flex-col">
                           <h4 className="text-[10px] text-slate-500 uppercase font-bold mb-2">Network Topology (NODE-7 CLUSTER)</h4>
                           <div className="flex-1 bg-black border border-slate-900 rounded p-4 relative overflow-hidden flex items-center justify-center">
                              {/* Simple Topology Vis */}
                              <div className="flex flex-col gap-8 items-center z-10 w-full">
                                 <div className="p-2 border border-cyan-500 rounded text-[8px] text-cyan-400">CORE_GATEWAY</div>
                                 <div className="flex gap-12 w-full justify-center">
                                    <div className="flex flex-col items-center">
                                       <div className="w-px h-8 bg-slate-800"></div>
                                       <div className="p-1.5 border border-slate-700 rounded text-[7px] text-slate-500 uppercase">Edge_01</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                       <div className="w-px h-8 bg-slate-800"></div>
                                       <div className="p-1.5 border border-slate-700 rounded text-[7px] text-slate-500 uppercase scale-110 border-cyan-500 text-cyan-400">Edge_02</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                       <div className="w-px h-8 bg-slate-800"></div>
                                       <div className="p-1.5 border border-slate-700 rounded text-[7px] text-slate-500 uppercase">Edge_03</div>
                                    </div>
                                 </div>
                              </div>
                              <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.5),transparent_70%)]"></div>
                           </div>
                        </div>
                      </div>
                      <div className="space-y-4 flex flex-col h-full overflow-hidden">
                         <div className="flex-1 bg-black border border-slate-800 rounded p-4 flex flex-col overflow-hidden">
                            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                               <h4 className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest flex items-center gap-2">
                                  <Fingerprint className="w-4 h-4" /> Indicators of Compromise
                               </h4>
                               <div className="flex gap-2">
                                  <button className="text-[8px] text-slate-500 hover:text-cyan-400 transition-colors uppercase font-bold tracking-tighter">Export CSV</button>
                                  <button className="text-[8px] text-slate-500 hover:text-cyan-400 transition-colors uppercase font-bold tracking-tighter">Refresh</button>
                               </div>
                            </div>
                            <div className="space-y-2 overflow-y-auto scrollbar-none flex-1">
                               {threatFeed.map(ioc => (
                                 <div key={ioc.id} className="p-3 border border-slate-900 group hover:border-cyan-900 transition-all flex justify-between items-center">
                                    <div className="flex flex-col gap-1">
                                       <div className="flex items-center gap-2">
                                          <span className={cn(
                                            "text-[8px] px-1 font-bold rounded",
                                            ioc.severity === 'CRITICAL' ? "bg-red-950 text-red-500" :
                                            ioc.severity === 'HIGH' ? "bg-cyan-950 text-cyan-500" : "bg-slate-900 text-slate-500"
                                          )}>{ioc.severity}</span>
                                          <span className="text-[10px] text-slate-100 font-bold tracking-widest">{ioc.type}</span>
                                       </div>
                                       <div className="text-[9px] font-mono text-slate-500 group-hover:text-cyan-400 break-all transition-colors">{ioc.indicator}</div>
                                    </div>
                                    <div className="text-right flex flex-col items-end shrink-0 ml-4">
                                       <span className="text-[8px] text-slate-700 uppercase font-bold">{ioc.source}</span>
                                       <span className="text-[8px] text-slate-700 font-mono italic">{ioc.time}</span>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                    </div>
                  </TacticalPanel>
                </motion.div>
              )}

              {activeTab === 'ASSETS' && (
                <motion.div 
                   key="assets"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="flex-1 flex flex-col gap-4"
                >
                   <div className="grid md:grid-cols-2 gap-4 flex-1">
                      <TacticalPanel title="Global Asset Matrix" icon={MapIcon} className="bg-slate-900/50 h-full">
                         <div className="space-y-2 overflow-y-auto h-[400px] scrollbar-none">
                            {ASSET_TRACKING.map(asset => (
                              <div key={asset.id} className="p-3 bg-slate-950 border border-slate-800 group hover:border-cyan-500 transition-all cursor-pointer">
                                 <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                       <div className="p-1.5 bg-slate-900 rounded">
                                          {asset.type === 'AIRCRAFT' ? <Plane className="w-4 h-4 text-cyan-400" /> : <Ship className="w-4 h-4 text-blue-400" />}
                                       </div>
                                       <div className="flex flex-col">
                                          <span className="text-xs font-bold text-slate-100 uppercase tracking-widest">{asset.id}</span>
                                          <span className="text-[8px] text-slate-500 uppercase">{asset.model}</span>
                                       </div>
                                    </div>
                                    <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-tighter">{asset.status}</span>
                                 </div>
                                 <div className="flex justify-between text-[9px] text-slate-600 font-mono mt-3 uppercase tracking-tighter">
                                    <span>COORD: {asset.lat}N {asset.lng}W</span>
                                    <span className="text-cyan-500/50">LOCKED</span>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </TacticalPanel>
                      <div className="flex flex-col gap-4">
                         <div className="h-48 bg-slate-900 border border-slate-800 rounded p-4 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.6),transparent_80%)]"></div>
                            <h4 className="text-[10px] text-cyan-400 uppercase font-bold mb-4 italic">ORBITAL_STRIKE_COORDS</h4>
                            <div className="flex flex-col items-center justify-center h-full gap-2">
                               <Radar className="w-8 h-8 text-slate-800" />
                               <span className="text-[10px] text-slate-600 uppercase font-bold tracking-[0.4em]">Unauthorized</span>
                            </div>
                         </div>
                         <TacticalPanel title="Sub-Surface Assets" icon={Ship} className="flex-1">
                            <div className="flex items-center justify-center h-full flex-col gap-4 opacity-50">
                               <Lock className="w-10 h-10 text-slate-800" />
                               <span className="text-[10px] text-slate-500 font-bold tracking-widest">ENCRYPTED DATASET</span>
                            </div>
                         </TacticalPanel>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column (Mobile: Hidden/Overlay) */}
          <div className={cn(
             "md:col-span-3 flex flex-col gap-4 overflow-y-auto pl-1 scrollbar-none shrink-0",
             "hidden md:flex"
          )}>
            <TacticalPanel title="Live Surveillance" icon={Eye} className="bg-slate-900 border-slate-800">
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-black border border-slate-800 relative group overflow-hidden rounded-sm h-32 flex items-center justify-center">
                   <div className="absolute top-2 left-2 bg-red-600 w-1.5 h-1.5 rounded-full shadow-[0_0_5px_#ef4444] animate-pulse z-20"></div>
                   <div className="absolute top-2 right-2 flex gap-1 z-20">
                      <div className="text-[8px] bg-black/80 px-1 border border-white/10 uppercase tracking-widest font-bold">CAM-01</div>
                   </div>
                   <div className="absolute inset-0 z-10 opacity-10 bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.6),transparent_80%)]"></div>
                   <Plane className="w-8 h-8 text-slate-800 group-hover:text-cyan-400 transition-colors" />
                   <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center z-20">
                      <span className="text-[7px] text-slate-500 font-mono uppercase tracking-tighter">SEC_4A-EAST</span>
                      <span className="text-[7px] text-slate-500 font-mono italic">SIG_SYNCED</span>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div className="bg-black border border-slate-800 aspect-video flex flex-col items-center justify-center opacity-40 group hover:opacity-100 transition-opacity">
                      <Zap className="w-4 h-4 text-slate-800 group-hover:text-amber-500" />
                      <span className="text-[7px] mt-1 text-slate-600 uppercase">Standby</span>
                   </div>
                   <div className="bg-black border border-slate-800 aspect-video flex flex-col items-center justify-center opacity-40">
                      <Lock className="w-4 h-4 text-slate-800" />
                      <span className="text-[7px] mt-1 text-slate-600 uppercase">Secure</span>
                   </div>
                </div>
              </div>
            </TacticalPanel>

            <TacticalPanel title="System Telemetry" icon={Terminal} className="bg-slate-900/50 border-slate-800 flex-1 min-h-[300px]">
                <div className="grid grid-cols-2 gap-2 mb-4">
                   <div className="p-2 bg-black border border-slate-800 rounded flex flex-col group">
                      <span className="text-[7px] text-slate-600 uppercase font-bold">CPU Core Load</span>
                      <div className="flex items-end gap-1 h-8 mt-1">
                         {[40, 70, 55, 90, 30, 65].map((h, i) => (
                           <div key={i} className="flex-1 bg-cyan-900/40 border-t-2 border-cyan-500/50 group-hover:bg-cyan-500/20 transition-all" style={{ height: `${h}%` }}></div>
                         ))}
                      </div>
                   </div>
                   <div className="p-2 bg-black border border-slate-800 rounded flex flex-col group">
                      <span className="text-[7px] text-slate-600 uppercase font-bold">Memory Buffer</span>
                      <div className="flex-1 flex items-center justify-center">
                         <span className="text-xs text-white font-mono font-bold">4.2<span className="text-[8px] text-slate-500 ml-0.5">GB</span></span>
                      </div>
                      <div className="w-full bg-slate-800 h-0.5 mt-1 overflow-hidden">
                         <div className="w-[62%] h-full bg-amber-500"></div>
                      </div>
                   </div>
                </div>
                
                <div className="bg-slate-950 p-2 flex-1 font-mono overflow-y-auto mb-3 scrollbar-none border border-slate-800/50 text-[9px]">
                  <TerminalLine text="Fetching external threat data..." delay={0.1} />
                  <TerminalLine text="MalwareBazaar feed synchronized." delay={0.5} type="success" />
                  <TerminalLine text="Encryption: XOR-ECC ACTIVE" delay={1.0} type="info" />
                  <TerminalLine text="Parsing CVE descriptors..." delay={1.5} />
                  <TerminalLine text="Pattern: 'SUNBURST_VAR_2' DETECTED" delay={2.0} type="warning" />
                  <TerminalLine text="Self-healing protocol initiated." delay={3.0} />
                  <TerminalLine text="NODE-7 Synced." delay={3.5} type="success" />
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                     <div className="p-2 border border-slate-800 bg-slate-950/80 rounded group hover:border-cyan-500 transition-colors">
                        <span className="text-[7px] text-slate-600 block uppercase mb-1">Geofence</span>
                        <span className="text-[9px] text-cyan-400 uppercase font-bold tracking-widest">ACTIVE_12nm</span>
                     </div>
                     <div className="p-2 border border-slate-800 bg-slate-950/80 rounded group hover:border-cyan-500 transition-colors">
                        <span className="text-[7px] text-slate-600 block uppercase mb-1">Enc Level</span>
                        <span className="text-[9px] text-emerald-400 uppercase font-bold tracking-widest">RSA_4096</span>
                     </div>
                  </div>
                  <button className="w-full py-3 bg-red-900/10 border border-red-900/50 text-red-500 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-red-600 hover:text-black transition-all">Emergency Purge</button>
                </div>
            </TacticalPanel>
          </div>
        </div>
      </main>

      {/* Footer / System Bars */}
      <footer className="fixed bottom-0 left-0 right-0 z-[100] h-10 md:h-12 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-4 md:px-6 text-[8px] md:text-[10px] uppercase font-mono tracking-wider italic text-slate-500">
        <div className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 items-center shrink-0">
            <div className={cn("w-1.5 h-1.5 md:w-2 md:h-2 rounded-full", isAlertActive ? "bg-red-500 animate-pulse" : "bg-emerald-500")} /> 
            <span className={cn(isAlertActive ? "text-red-500 font-bold" : "text-emerald-400 font-bold")}>SYSTEM_SECURE</span>
          </div>
          <div className="flex gap-2 items-center shrink-0">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-600 rounded-full" /> 
            <span>Node-7 High-Sec</span>
          </div>
          <div className="hidden sm:flex gap-2 items-center text-cyan-500/80">
            [TRUST_THRESHOLD_V8]
          </div>
        </div>
        <div className="flex gap-4 items-center pl-4 border-l border-slate-800 ml-4 shrink-0">
          <span className="hidden lg:inline opacity-30 tracking-tighter">CLEARANCE: <span className="text-white font-bold">LVL_05_SIGINT</span></span>
          <div className="flex flex-col items-end">
             <span className="text-[8px] leading-none opacity-20">Secure Release</span>
             <span className="text-[9px] md:text-[10px] text-slate-400 leading-none mt-1 font-bold tracking-widest uppercase italic">v8.4-AEGIS</span>
          </div>
        </div>
      </footer>

      {/* Visual Glitch/Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
        <motion.div 
          animate={{ backgroundPosition: ['0px 0px', '0px 100px'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(6,182,212,0.03),transparent)] bg-[length:300px_100%] opacity-20"
        />
      </div>
    </div>
  );
}

