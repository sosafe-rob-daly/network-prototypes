import React, { useState, useEffect } from 'react';
import { AlertTriangle, Users, Zap, Globe, Clock, TrendingUp, CheckCircle, ArrowRight, Radio } from 'lucide-react';

// SoSafe logo as SVG component
const SoSafeLogo = () => (
  <svg viewBox="0 0 120 32" className="h-7">
    <text x="0" y="24" fontFamily="system-ui, -apple-system, sans-serif" fontSize="24" fontWeight="700" fill="#0d9488">
      SoSafe
    </text>
  </svg>
);

// Mock data for threats
const initialThreats = [
  {
    id: 1,
    name: 'DocuSign Credential Harvest',
    type: 'Phishing',
    severity: 'critical',
    detectedAt: 'Frankfurt, DE',
    detectedTime: '14 min ago',
    affectedOrgs: 1,
    protectedOrgs: 234,
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

const networkNodes = [
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

const StatCard = ({ icon: Icon, label, value, subvalue, trend }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-xl bg-gray-50">
          <Icon size={20} className="text-gray-600" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500 mt-1">{label}</div>
        {subvalue && <div className="text-xs text-gray-400 mt-1">{subvalue}</div>}
      </div>
    </div>
  );
};

const ThreatCard = ({ threat, isActive, onClick }) => {
  const severityColors = {
    critical: 'bg-pink-500',
    high: 'bg-pink-400',
    medium: 'bg-pink-300',
  };
  
  const statusConfig = {
    propagating: { label: 'Propagating Defense', color: 'text-pink-600 bg-pink-50', icon: Radio },
    contained: { label: 'Network Protected', color: 'text-teal-600 bg-teal-50', icon: CheckCircle },
  };
  
  const status = statusConfig[threat.status];
  const StatusIcon = status.icon;
  
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 border cursor-pointer transition-all ${
        isActive ? 'border-pink-200 shadow-lg ring-2 ring-pink-100' : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 ${severityColors[threat.severity]}`} />
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
              <span className="text-gray-400">Click rate: </span>
              <span className="font-medium text-gray-700">{threat.successRate}</span>
            </div>
            <div className="text-xs">
              <span className="text-gray-400">Protected: </span>
              <span className="font-medium text-teal-600">{threat.protectedOrgs.toLocaleString()} orgs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NetworkVisualization = ({ activeThreat }) => {
  const [animatedNodes, setAnimatedNodes] = useState([1]);
  
  useEffect(() => {
    if (activeThreat?.status === 'propagating') {
      setAnimatedNodes([1]);
      const intervals = [];
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
  
  const getNodeColor = (node) => {
    if (node.id === 1) return '#ec4899'; // Source - pink-500
    if (!animatedNodes.includes(node.id)) return '#e5e7eb'; // Not yet reached
    if (node.status === 'propagating') return '#f472b6'; // Pink-400 - in progress
    return '#14b8a6'; // Teal-500 - protected
  };
  
  const getNodeSize = (size) => {
    const sizes = { sm: 8, md: 12, lg: 16 };
    return sizes[size] || 10;
  };
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Network Defense Propagation</h3>
          <p className="text-sm text-gray-500 mt-0.5">Real-time threat intelligence distribution</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            <span className="text-gray-500">Detection Source</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span className="text-gray-500">Protected</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-pink-50/30 rounded-xl overflow-hidden">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full">
          {networkNodes.slice(1).map((node) => {
            const source = networkNodes[0];
            const isAnimated = animatedNodes.includes(node.id);
            return (
              <line
                key={`line-${node.id}`}
                x1={`${source.x}%`}
                y1={`${source.y}%`}
                x2={`${node.x}%`}
                y2={`${node.y}%`}
                stroke={isAnimated ? '#14b8a6' : '#e5e7eb'}
                strokeWidth="1.5"
                strokeDasharray={isAnimated ? "0" : "4"}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        
        {/* Nodes */}
        {networkNodes.map((node) => {
          const size = getNodeSize(node.size);
          const isAnimated = animatedNodes.includes(node.id);
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
              <div
                className={`rounded-full transition-colors duration-300 ${
                  node.id === 1 ? 'animate-pulse' : ''
                }`}
                style={{
                  width: size * 2,
                  height: size * 2,
                  backgroundColor: getNodeColor(node),
                  boxShadow: node.id === 1 ? '0 0 20px rgba(236, 72, 153, 0.4)' : 'none',
                }}
              />
              {node.label && (
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs font-medium text-pink-600 whitespace-nowrap">
                  {node.label}
                </span>
              )}
            </div>
          );
        })}
        
        {/* Propagation pulse effect */}
        {activeThreat?.status === 'propagating' && (
          <div 
            className="absolute w-32 h-32 rounded-full border-2 border-pink-400 opacity-0 animate-ping"
            style={{
              left: `${networkNodes[0].x}%`,
              top: `${networkNodes[0].y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </div>
      
      {activeThreat && (
        <div className="mt-4 p-3 bg-pink-50 rounded-xl border border-pink-100">
          <div className="flex items-center gap-2 text-sm">
            <Zap size={16} className="text-pink-600" />
            <span className="font-medium text-pink-800">
              {activeThreat.status === 'propagating' 
                ? `Pushing proactive simulations to ${activeThreat.protectedOrgs.toLocaleString()} organizations...`
                : `${activeThreat.protectedOrgs.toLocaleString()} organizations protected against this threat pattern`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const TimelineEvent = ({ time, title, description, isLast }) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center">
      <div className="w-2.5 h-2.5 rounded-full bg-pink-500 mt-1.5" />
      {!isLast && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
    </div>
    <div className="pb-4">
      <div className="text-xs text-gray-400">{time}</div>
      <div className="font-medium text-gray-900 text-sm mt-0.5">{title}</div>
      <div className="text-xs text-gray-500 mt-0.5">{description}</div>
    </div>
  </div>
);

export default function ThreatRadar() {
  const [activeThreat, setActiveThreat] = useState(initialThreats[0]);
  const [protectedCount, setProtectedCount] = useState(234);
  
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
    <div className="min-h-screen bg-gray-50/80">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <SoSafeLogo />
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Threat Radar</h1>
                <p className="text-xs text-gray-500">Networked Defense Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-gray-600">Live</span>
              <span className="text-gray-400 ml-2">Last updated: just now</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-6">
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
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Active Threats</h2>
                <p className="text-sm text-gray-500 mt-0.5">Click to view propagation</p>
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
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Propagation Timeline</h3>
                <div className="space-y-1">
                  <TimelineEvent
                    time="14:32 CET"
                    title="Threat Detected"
                    description="Novel DocuSign template identified at Deutsche Bank AG"
                  />
                  <TimelineEvent
                    time="14:33 CET"
                    title="Pattern Analyzed"
                    description="AI classified as credential harvest with 94% confidence"
                  />
                  <TimelineEvent
                    time="14:34 CET"
                    title="Network Alert"
                    description="Pushed to 234 organizations in Finance vertical"
                  />
                  <TimelineEvent
                    time="14:36 CET"
                    title="Simulations Deployed"
                    description="Proactive training triggered for high-risk cohorts"
                    isLast
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-5 text-white">
                <h3 className="font-semibold text-lg">Collective Intelligence</h3>
                <p className="text-teal-100 text-sm mt-2">
                  Every SoSafe customer makes every other customer more secure. This threat was neutralized across 234 organizations before attackers could pivot.
                </p>
                <div className="mt-6 pt-4 border-t border-teal-400/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">4 min</div>
                      <div className="text-teal-200 text-sm">Detection → Defense</div>
                    </div>
                    <button className="flex items-center gap-2 bg-white text-teal-600 px-4 py-2 rounded-xl font-medium text-sm hover:bg-teal-50 transition-colors">
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
  );
}
