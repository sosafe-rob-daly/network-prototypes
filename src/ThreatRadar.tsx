import React, { useState, useEffect } from 'react';
import { AlertTriangle, Users, Zap, Globe, Clock, TrendingUp, CheckCircle, ArrowRight, Radio, LucideIcon } from 'lucide-react';
import Sidebar from './Sidebar';

// Type definitions
type ThreatSeverity = 'critical' | 'high' | 'medium';
type ThreatStatus = 'propagating' | 'contained';
type NodeStatus = 'source' | 'protected' | 'propagating';
type NodeSize = 'sm' | 'md' | 'lg';

interface Threat {
  id: number;
  name: string;
  type: string;
  severity: ThreatSeverity;
  detectedAt: string;
  detectedTime: string;
  affectedOrgs: number;
  protectedOrgs: number;
  status: ThreatStatus;
  successRate: string;
  vector: string;
}

interface NetworkNode {
  id: number;
  x: number;
  y: number;
  size: NodeSize;
  status: NodeStatus;
  label: string;
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subvalue?: string;
  trend?: string;
}

interface ThreatCardProps {
  threat: Threat;
  isActive: boolean;
  onClick: () => void;
}

interface NetworkVisualizationProps {
  activeThreat: Threat | null;
}

interface TimelineEventProps {
  time: string;
  title: string;
  description: string;
  isLast?: boolean;
}

// Mock data for threats
const initialThreats: Threat[] = [
  {
    id: 1,
    name: 'DocuSign Credential Harvest',
    type: 'Phishing',
    severity: 'critical',
    detectedAt: 'Frankfurt, DE',
    detectedTime: '14 min ago',
    affectedOrgs: 1,
    protectedOrgs: 8431,
    status: 'propagating',
    successRate: '12.4%',
    vector: 'Email',
  },
  {
    id: 2,
    name: 'Microsoft 365 MFA Bypass',
    type: 'Credential Theft',
    severity: 'high',
    detectedAt: 'London, UK',
    detectedTime: '2 hours ago',
    affectedOrgs: 3,
    protectedOrgs: 892,
    status: 'contained',
    successRate: '8.2%',
    vector: 'Email + SMS',
  },
  {
    id: 3,
    name: 'PayPal Invoice Scam',
    type: 'BEC',
    severity: 'medium',
    detectedAt: 'Munich, DE',
    detectedTime: '4 hours ago',
    affectedOrgs: 1,
    protectedOrgs: 1205,
    status: 'contained',
    successRate: '3.1%',
    vector: 'Email',
  },
];

const networkNodes: NetworkNode[] = [
  { id: 1, x: 50, y: 30, size: 'lg', status: 'source', label: 'Detection' },
  { id: 2, x: 25, y: 55, size: 'md', status: 'protected', label: '' },
  { id: 3, x: 40, y: 65, size: 'sm', status: 'protected', label: '' },
  { id: 4, x: 60, y: 60, size: 'md', status: 'propagating', label: '' },
  { id: 5, x: 75, y: 50, size: 'sm', status: 'protected', label: '' },
  { id: 6, x: 35, y: 80, size: 'sm', status: 'protected', label: '' },
  { id: 7, x: 55, y: 85, size: 'md', status: 'protected', label: '' },
  { id: 8, x: 80, y: 75, size: 'sm', status: 'protected', label: '' },
  { id: 9, x: 15, y: 40, size: 'sm', status: 'protected', label: '' },
  { id: 10, x: 85, y: 35, size: 'sm', status: 'protected', label: '' },
];

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, subvalue, trend }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50">
          <Icon size={20} className="text-purple-600" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 px-2 py-1 rounded-full border border-green-200/50">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600 mt-1">{label}</div>
        {subvalue && <div className="text-xs text-gray-500 mt-1">{subvalue}</div>}
      </div>
    </div>
  );
};

const ThreatCard: React.FC<ThreatCardProps> = ({ threat, isActive, onClick }) => {
  const severityColors: Record<ThreatSeverity, string> = {
    critical: 'bg-red-500',
    high: 'bg-yellow-500',
    medium: 'bg-green-500',
  };

  const statusConfig: Record<ThreatStatus, { label: string; color: string; icon: LucideIcon }> = {
    propagating: { label: 'Propagating Defense', color: 'text-red-600 bg-red-50', icon: Radio },
    contained: { label: 'Network Protected', color: 'text-green-600 bg-green-50', icon: CheckCircle },
  };

  const status = statusConfig[threat.status];
  const StatusIcon = status.icon;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 border cursor-pointer transition-all ${
        isActive ? `border-${threat.severity === 'critical' ? 'red' : threat.severity === 'high' ? 'yellow' : 'green'}-200 ring-2 ring-${threat.severity === 'critical' ? 'red' : threat.severity === 'high' ? 'yellow' : 'green'}-100` : 'border-gray-200/50 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 ${severityColors[threat.severity]} shadow-md`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-gray-900 truncate">{threat.name}</h3>
            <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap ${status.color}`}>
              <StatusIcon size={12} />
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Globe size={14} />
              {threat.detectedAt}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {threat.detectedTime}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="text-xs">
              <span className="text-gray-500">Click rate: </span>
              <span className="font-medium text-gray-700">{threat.successRate}</span>
            </div>
            <div className="text-xs">
              <span className="text-gray-500">Protected: </span>
              <span className="font-semibold text-green-600">{threat.protectedOrgs.toLocaleString()} orgs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Department {
  id: number;
  name: string;
  employees: number;
  deployed: boolean;
  deployedAt?: string;
}

const departments: Department[] = [
  { id: 1, name: 'Finance', employees: 23, deployed: true, deployedAt: '14:35 CET' },
  { id: 2, name: 'Sales', employees: 45, deployed: true, deployedAt: '14:36 CET' },
  { id: 3, name: 'Engineering', employees: 67, deployed: true, deployedAt: '14:36 CET' },
  { id: 4, name: 'HR', employees: 12, deployed: true, deployedAt: '14:37 CET' },
  { id: 5, name: 'Marketing', employees: 18, deployed: false },
  { id: 6, name: 'Operations', employees: 34, deployed: false },
];

const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({ activeThreat }) => {
  const [animatedNodes, setAnimatedNodes] = useState<number[]>([1]);
  const [activeTab, setActiveTab] = useState<'network' | 'my-org'>('network');

  useEffect(() => {
    if (activeThreat?.status === 'propagating') {
      setAnimatedNodes([1]);
      const intervals: NodeJS.Timeout[] = [];
      networkNodes.forEach((node, index) => {
        if (node.id !== 1) {
          const timeout = setTimeout(() => {
            setAnimatedNodes(prev => [...prev, node.id]);
          }, index * 300);
          intervals.push(timeout);
        }
      });
      return () => intervals.forEach(clearTimeout);
    } else {
      setAnimatedNodes(networkNodes.map(n => n.id));
    }
  }, [activeThreat]);

  const getNodeColor = (node: NetworkNode): string => {
    if (node.id === 1) return '#ef4444'; // Source - red-500 (detection zone)
    if (!animatedNodes.includes(node.id)) return '#e5e7eb'; // Not yet reached
    if (node.status === 'propagating') return '#fbbf24'; // yellow-400 - in progress
    return '#10b981'; // green-500 - protected
  };

  const getNodeSize = (size: NodeSize): number => {
    const sizes: Record<NodeSize, number> = { sm: 8, md: 12, lg: 16 };
    return sizes[size] || 10;
  };

  const deployedCount = departments.filter(d => d.deployed).length;
  const totalEmployees = departments.reduce((sum, d) => sum + d.employees, 0);
  const deployedEmployees = departments.filter(d => d.deployed).reduce((sum, d) => sum + d.employees, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/50 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Defense Propagation</h3>
          <p className="text-sm text-gray-600 mt-0.5">Real-time threat intelligence distribution</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('network')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'network'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Network
          </button>
          <button
            onClick={() => setActiveTab('my-org')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'my-org'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            My Organization
          </button>
        </div>
      </div>

      {activeTab === 'network' ? (
        <div className="relative h-64 rounded-xl overflow-hidden shadow-inner">
          {/* Mesh gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-yellow-50/20 to-green-50/30" />
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `
              radial-gradient(at 20% 30%, rgba(239, 68, 68, 0.15) 0px, transparent 50%),
              radial-gradient(at 80% 70%, rgba(16, 185, 129, 0.15) 0px, transparent 50%),
              radial-gradient(at 50% 50%, rgba(251, 191, 36, 0.1) 0px, transparent 50%)
            `
          }} />

          {/* Glassmorphism Legend */}
          <div className="absolute top-3 right-3 flex items-center gap-4 text-xs bg-white/70 backdrop-blur-md px-3 py-2 rounded-lg border border-white/40 shadow-lg shadow-gray-200/50">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
              <span className="text-gray-700 font-medium">Threat Source</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm" />
              <span className="text-gray-700 font-medium">Propagating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm" />
              <span className="text-gray-700 font-medium">Protected</span>
            </div>
          </div>

          {/* SVG with gradients and connections */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              {/* Gradient definitions for connection lines */}
              {networkNodes.slice(1).map((node) => {
                const source = networkNodes[0];
                return (
                  <linearGradient
                    key={`gradient-${node.id}`}
                    id={`line-gradient-${node.id}`}
                    x1={`${source.x}%`}
                    y1={`${source.y}%`}
                    x2={`${node.x}%`}
                    y2={`${node.y}%`}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                );
              })}
            </defs>

            {/* Connection lines with gradients */}
            {networkNodes.slice(1).map((node) => {
              const source = networkNodes[0];
              const isAnimated = animatedNodes.includes(node.id);
              return (
                <g key={`connection-${node.id}`}>
                  {/* Glow layer */}
                  {isAnimated && (
                    <line
                      x1={`${source.x}%`}
                      y1={`${source.y}%`}
                      x2={`${node.x}%`}
                      y2={`${node.y}%`}
                      stroke={`url(#line-gradient-${node.id})`}
                      strokeWidth="6"
                      opacity="0.3"
                      className="transition-all duration-500"
                      style={{ filter: 'blur(4px)' }}
                    />
                  )}
                  {/* Main line */}
                  <line
                    x1={`${source.x}%`}
                    y1={`${source.y}%`}
                    x2={`${node.x}%`}
                    y2={`${node.y}%`}
                    stroke={isAnimated ? `url(#line-gradient-${node.id})` : '#e5e7eb'}
                    strokeWidth="2"
                    strokeDasharray={isAnimated ? "0" : "4"}
                    className="transition-all duration-500"
                    opacity={isAnimated ? "0.9" : "0.3"}
                  />
                  {/* Animated particle */}
                  {isAnimated && activeThreat?.status === 'propagating' && (
                    <circle
                      r="3"
                      fill="url(#particle-gradient)"
                      className="opacity-90"
                    >
                      <animateMotion
                        dur="2s"
                        repeatCount="indefinite"
                        path={`M ${source.x} ${source.y} L ${node.x} ${node.y}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Gradient for particles */}
            <defs>
              <radialGradient id="particle-gradient">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
              </radialGradient>
            </defs>
          </svg>

          {/* Nodes with enhanced depth */}
          {networkNodes.map((node) => {
            const size = getNodeSize(node.size);
            const isAnimated = animatedNodes.includes(node.id);
            const nodeColor = getNodeColor(node);

            return (
              <div
                key={node.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  isAnimated ? 'scale-100 opacity-100' : 'scale-75 opacity-50'
                }`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
              >
                {/* Outer glow ring */}
                {isAnimated && (
                  <div
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                      width: size * 3,
                      height: size * 3,
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: `radial-gradient(circle, ${nodeColor}40 0%, transparent 70%)`,
                    }}
                  />
                )}

                {/* Main node */}
                <div
                  className={`rounded-full transition-all duration-300 relative ${
                    node.id === 1 ? 'animate-pulse' : ''
                  }`}
                  style={{
                    width: size * 2,
                    height: size * 2,
                    backgroundColor: nodeColor,
                    boxShadow: node.id === 1
                      ? '0 0 30px rgba(239, 68, 68, 0.7), 0 0 60px rgba(239, 68, 68, 0.4), 0 4px 12px rgba(239, 68, 68, 0.3)'
                      : isAnimated
                      ? `0 0 20px ${nodeColor}60, 0 0 40px ${nodeColor}30, 0 4px 12px ${nodeColor}20`
                      : 'none',
                  }}
                >
                  {/* Inner highlight for depth */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)',
                    }}
                  />
                </div>

                {node.label && (
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs font-bold text-red-600 whitespace-nowrap drop-shadow-sm">
                    {node.label}
                  </span>
                )}
              </div>
            );
          })}

          {/* Enhanced propagation pulse effect */}
          {activeThreat?.status === 'propagating' && (
            <>
              {/* First wave - red to yellow */}
              <div
                className="absolute w-32 h-32 rounded-full opacity-0 animate-ping"
                style={{
                  left: `${networkNodes[0].x}%`,
                  top: `${networkNodes[0].y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(251, 191, 36, 0.2) 50%, transparent 70%)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              />
              {/* Second wave - yellow to green */}
              <div
                className="absolute w-48 h-48 rounded-full opacity-0 animate-ping"
                style={{
                  left: `${networkNodes[0].x}%`,
                  top: `${networkNodes[0].y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 70%)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                  animationDelay: '0.5s',
                }}
              />
            </>
          )}
        </div>
      ) : (
        <div className="h-64">
          {/* My Organization View */}
          <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-purple-900">Forrester Research Inc.</div>
                <div className="text-xs text-purple-700 mt-0.5">{deployedCount} of {departments.length} departments protected • {deployedEmployees} of {totalEmployees} employees</div>
              </div>
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>

          {/* Department List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  dept.deployed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${dept.deployed ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                    <div className="text-xs text-gray-600">{dept.employees} employees</div>
                  </div>
                </div>
                <div className="text-right">
                  {dept.deployed ? (
                    <div>
                      <div className="text-xs font-semibold text-green-700">Deployed</div>
                      <div className="text-xs text-green-600">{dept.deployedAt}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">Pending</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeThreat && (
        <div className={`mt-4 p-3 rounded-xl border ${
          activeThreat.status === 'propagating'
            ? 'bg-gradient-to-r from-red-50 to-yellow-50 border-red-200'
            : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
        }`}>
          <div className="flex items-center gap-2 text-sm">
            <Zap size={16} className={activeThreat.status === 'propagating' ? 'text-red-600' : 'text-green-600'} />
            <span className={`font-medium ${activeThreat.status === 'propagating' ? 'text-red-800' : 'text-green-800'}`}>
              {activeTab === 'network' ? (
                activeThreat.status === 'propagating'
                  ? `Pushing proactive simulations to ${activeThreat.protectedOrgs.toLocaleString()} organizations...`
                  : `${activeThreat.protectedOrgs.toLocaleString()} organizations protected against this threat pattern`
              ) : (
                `Your organization: ${deployedCount} departments deployed, ${departments.length - deployedCount} pending`
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const TimelineEvent: React.FC<TimelineEventProps & { color?: string }> = ({ time, title, description, isLast, color = 'bg-purple-500' }) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center">
      <div className={`w-2.5 h-2.5 rounded-full ${color} mt-1.5 shadow-sm`} />
      {!isLast && <div className="w-0.5 h-full bg-gradient-to-b from-gray-300 to-gray-200 mt-1" />}
    </div>
    <div className="pb-4">
      <div className="text-xs text-gray-500">{time}</div>
      <div className="font-medium text-gray-900 text-sm mt-0.5">{title}</div>
      <div className="text-xs text-gray-600 mt-0.5">{description}</div>
    </div>
  </div>
);

interface ThreatRadarProps {
  onNavigate?: (page: string) => void;
}

export default function ThreatRadar({ onNavigate }: ThreatRadarProps) {
  const [activeThreat, setActiveThreat] = useState<Threat | null>(initialThreats[0]);
  const [protectedCount, setProtectedCount] = useState<number>(8431);

  // Simulate real-time protection count increase
  useEffect(() => {
    if (activeThreat?.status === 'propagating') {
      const interval = setInterval(() => {
        setProtectedCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [activeThreat]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <Sidebar activePage="threat-radar" onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200/50">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  <span className="hover:underline cursor-pointer">Network</span>
                  <span className="mx-2">/</span>
                  <span className="text-gray-900 font-medium">Threat Radar</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Threat Radar</h1>
                <p className="text-sm text-gray-600 mt-1">Real-time networked defense intelligence across your organization</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-300" />
                <span className="text-gray-700 font-medium">Live</span>
                <span className="text-gray-500 ml-2">Last updated: just now</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={AlertTriangle}
            label="Active Threats"
            value="3"
            subvalue="Across the network"
          />
          <StatCard
            icon={Users}
            label="Organizations Protected"
            value={protectedCount.toLocaleString()}
            subvalue="In the last 24 hours"
            trend="+12%"
          />
          <StatCard
            icon={Zap}
            label="Avg. Response Time"
            value="4.2 min"
            subvalue="Detection to defense"
            trend="-18%"
          />
          <StatCard
            icon={TrendingUp}
            label="Attack Prevention Rate"
            value="94.7%"
            subvalue="Network-wide efficacy"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Threat List */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm">
              <div className="p-4 border-b border-gray-200/50">
                <h2 className="font-semibold text-gray-900">Active Threats</h2>
                <p className="text-sm text-gray-600 mt-0.5">Click to view propagation</p>
              </div>
              <div className="p-3 space-y-3">
                {initialThreats.map((threat) => (
                  <ThreatCard
                    key={threat.id}
                    threat={threat}
                    isActive={activeThreat?.id === threat.id}
                    onClick={() => setActiveThreat(threat)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Network Visualization */}
          <div className="col-span-2 space-y-4">
            <NetworkVisualization activeThreat={activeThreat} />

            {/* Timeline & Action */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-200/50 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Propagation Timeline</h3>
                <div className="space-y-1">
                  <TimelineEvent
                    time="14:32 CET"
                    title="Threat Detected"
                    description="Novel DocuSign template identified at Deutsche Bank AG"
                    color="bg-red-500"
                  />
                  <TimelineEvent
                    time="14:33 CET"
                    title="Pattern Analyzed"
                    description="AI classified as credential harvest with 94% confidence"
                    color="bg-orange-500"
                  />
                  <TimelineEvent
                    time="14:34 CET"
                    title="Network Alert"
                    description="Pushed to 8,431 organizations in Finance vertical"
                    color="bg-yellow-500"
                  />
                  <TimelineEvent
                    time="14:36 CET"
                    title="Simulations Deployed"
                    description="Proactive training triggered for high-risk cohorts"
                    color="bg-green-500"
                    isLast
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600 rounded-2xl p-5 text-white shadow-lg shadow-purple-300/50">
                <h3 className="font-semibold text-lg">Collective Intelligence</h3>
                <p className="text-purple-100 text-sm mt-2">
                  Every SoSafe customer makes every other customer more secure. This threat was neutralized across 8,431 organizations before attackers could pivot.
                </p>
                <div className="mt-6 pt-4 border-t border-purple-400/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">4 min</div>
                      <div className="text-purple-100 text-sm">Detection → Defense</div>
                    </div>
                    <button className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-xl font-medium text-sm hover:bg-purple-50 transition-colors">
                      View Details
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
