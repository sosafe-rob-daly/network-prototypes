import React, { useState, useEffect } from 'react';
import { ArrowRight, Mail, Clock, Shield, FileText, TrendingUp, Sparkles, Users } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import Sidebar from './Sidebar';

// Import stat card icons
import activeThreatsIcon from '../Assets/Active_Threats.png';
import orgsProtectedIcon from '../Assets/Orgs_Protected.png';
import attacksPreventedIcon from '../Assets/Attacks_Prevented.png';
import recreateBetaImage from '../Assets/Recreate_Beta.png';
import reportImage from '../Assets/Report.png';
import docusignLogo from '../Assets/Docusign.png';
import m365Logo from '../Assets/M365.png';
import paypalLogo from '../Assets/PayPal.png';

// Type definitions
type ThreatSeverity = 'critical' | 'high' | 'medium';
type ThreatStatus = 'propagating' | 'contained';

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


interface StatCardProps {
  iconSrc: string;
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
    name: 'DocuSign Creds Breach',
    type: 'Phishing',
    severity: 'critical',
    detectedAt: 'Frankfurt, DE',
    detectedTime: '1 week ago',
    affectedOrgs: 1,
    protectedOrgs: 8431,
    status: 'propagating',
    successRate: '12.4%',
    vector: 'Email',
  },
  {
    id: 2,
    name: 'M365 MFA Bypass',
    type: 'Credential Theft',
    severity: 'high',
    detectedAt: 'London, UK',
    detectedTime: '2 weeks ago',
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
    detectedTime: '4 weeks ago',
    affectedOrgs: 1,
    protectedOrgs: 1205,
    status: 'contained',
    successRate: '3.1%',
    vector: 'Email',
  },
];

// Timeline data for each threat
const threatTimelines: Record<number, { time: string; title: string; description: string; color: string }[]> = {
  1: [
    { time: 'Jan 23, 14:32', title: 'Threat Detected', description: 'Novel DocuSign template identified at Deutsche Bank AG', color: 'bg-red-500' },
    { time: 'Jan 23, 14:33', title: 'Pattern Analyzed', description: 'AI classified as credential harvest with 94% confidence', color: 'bg-orange-500' },
    { time: 'Jan 23, 14:34', title: 'Network Alert', description: 'Pushed to 8,431 organizations in Finance vertical', color: 'bg-yellow-500' },
    { time: 'Jan 23, 14:36', title: 'Simulations Deployed', description: 'Proactive training triggered for high-risk cohorts', color: 'bg-green-500' },
  ],
  2: [
    { time: 'Jan 16, 10:15', title: 'Threat Detected', description: 'MFA bypass attempt flagged at Barclays UK', color: 'bg-red-500' },
    { time: 'Jan 16, 10:17', title: 'Pattern Analyzed', description: 'AI identified session token theft technique', color: 'bg-orange-500' },
    { time: 'Jan 16, 10:19', title: 'Network Alert', description: 'Pushed to 892 organizations using M365', color: 'bg-yellow-500' },
    { time: 'Jan 16, 10:22', title: 'Threat Contained', description: 'All affected sessions invalidated across network', color: 'bg-green-500' },
  ],
  3: [
    { time: 'Jan 2, 08:45', title: 'Threat Detected', description: 'Suspicious PayPal invoice reported at BMW Group', color: 'bg-red-500' },
    { time: 'Jan 2, 08:47', title: 'Pattern Analyzed', description: 'AI matched to known BEC campaign with 89% confidence', color: 'bg-orange-500' },
    { time: 'Jan 2, 08:49', title: 'Network Alert', description: 'Pushed to 1,205 organizations in Automotive vertical', color: 'bg-yellow-500' },
    { time: 'Jan 2, 08:52', title: 'Threat Contained', description: 'Email filters updated, simulation deployed', color: 'bg-green-500' },
  ],
};

// Reported Threat Feed data (PRB reports from across network)
type ReportStatus = 'analyzing' | 'confirmed' | 'pushed';

interface ReportedThreat {
  id: number;
  orgType: string;
  orgSize: string;
  threatType: string;
  trustScore: number;
  timeAgo: string;
  status: ReportStatus;
  confirmedBy?: number;
}

const reportedThreats: ReportedThreat[] = [
  {
    id: 1,
    orgType: 'Financial Services',
    orgSize: '2000+ employees',
    threatType: 'Credential Harvest',
    trustScore: 94,
    timeAgo: '2 min ago',
    status: 'pushed',
    confirmedBy: 12,
  },
  {
    id: 2,
    orgType: 'Healthcare',
    orgSize: '500-2000 employees',
    threatType: 'Invoice Fraud',
    trustScore: 87,
    timeAgo: '8 min ago',
    status: 'confirmed',
    confirmedBy: 7,
  },
  {
    id: 3,
    orgType: 'Manufacturing',
    orgSize: '2000+ employees',
    threatType: 'Spear Phishing',
    trustScore: 72,
    timeAgo: '14 min ago',
    status: 'analyzing',
  },
  {
    id: 4,
    orgType: 'Technology',
    orgSize: '500-2000 employees',
    threatType: 'MFA Bypass',
    trustScore: 91,
    timeAgo: '23 min ago',
    status: 'pushed',
    confirmedBy: 19,
  },
  {
    id: 5,
    orgType: 'Retail',
    orgSize: '200-500 employees',
    threatType: 'Brand Impersonation',
    trustScore: 68,
    timeAgo: '31 min ago',
    status: 'confirmed',
    confirmedBy: 4,
  },
];

// Template Intelligence data
interface SimulationTemplate {
  id: number;
  name: string;
  logo?: string;
  previewColor?: string;
  source: string;
  sourceTime: string;
  adoption: number;
  avgClickRate: number;
  difficulty: number;
  isNetworkPowered: boolean;
  status: 'new' | 'updated' | 'active';
}

const simulationTemplates: SimulationTemplate[] = [
  {
    id: 1,
    name: 'DocuSign Credential Harvest',
    logo: docusignLogo,
    source: 'Derived from network threat',
    sourceTime: '3 days ago',
    adoption: 1247,
    avgClickRate: 23.4,
    difficulty: 4,
    isNetworkPowered: true,
    status: 'new',
  },
  {
    id: 2,
    name: 'Microsoft 365 MFA Request',
    logo: m365Logo,
    source: 'Derived from network threat',
    sourceTime: '5 days ago',
    adoption: 892,
    avgClickRate: 18.7,
    difficulty: 3,
    isNetworkPowered: true,
    status: 'updated',
  },
  {
    id: 3,
    name: 'PayPal Invoice Notification',
    logo: paypalLogo,
    source: 'Derived from network threat',
    sourceTime: '1 week ago',
    adoption: 2341,
    avgClickRate: 12.1,
    difficulty: 2,
    isNetworkPowered: true,
    status: 'active',
  },
  {
    id: 4,
    name: 'IT Password Reset Request',
    previewColor: 'from-purple-500 to-pink-500',
    source: 'Standard template library',
    sourceTime: '2 weeks ago',
    adoption: 4521,
    avgClickRate: 15.3,
    difficulty: 3,
    isNetworkPowered: false,
    status: 'active',
  },
];


const StatCard: React.FC<StatCardProps> = ({ iconSrc, label, value, subvalue, trend }) => {
  return (
    <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
      <div className="flex items-center justify-between mb-3">
        <img src={iconSrc} alt={label} className="w-8 h-8" />
        {trend && (
          <span className="text-xs font-medium text-gray-900 bg-green-100 px-2 py-1 rounded-md border border-green-200">
            {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
      {subvalue && <div className="text-xs text-gray-500 mt-1">{subvalue}</div>}
    </div>
  );
};

const ThreatCard: React.FC<ThreatCardProps> = ({ threat, isActive, onClick }) => {
  const severityColors: Record<ThreatSeverity, string> = {
    critical: 'bg-red-500',
    high: 'bg-yellow-500',
    medium: 'bg-green-500',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 cursor-pointer transition-all ${
        isActive
          ? 'bg-gradient-to-br from-blue-50 to-gray-100 border-2 border-blue-200'
          : 'bg-gray-100 hover:bg-gray-150'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${severityColors[threat.severity]}`} />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900">{threat.name}</h3>
          <p className="text-xs text-gray-900 mt-1">{threat.detectedAt} · {threat.detectedTime}</p>
          <p className="text-xs text-gray-900 mt-2">
            Click rate: <span className="font-bold">{threat.successRate}</span>
          </p>
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

// Chart data variations for each threat
const threatChartData: Record<number, {
  upperBoundaryData: number[];
  behaviorScoreData: number[];
  benchmarkData: number[];
}> = {
  1: {
    // DocuSign - Higher click rates, steeper improvement
    upperBoundaryData: [
      29, 28.5, 29.2, 28.8, 28.2, 29, 28.3, 27.8, 28.5, 29.3,
      28.8, 27.2, 28, 29.5, 29.8, 29.2, 28.5, 27.8, 28.2, 27.5,
      28.8, 29.2, 28.5, 27.2, 26.8, 27.5, 28, 27.2, 26.5, 27.2,
      28, 27.5, 26.8, 26.2, 27, 26.5, 25.8, 26.5, 27, 26.2,
      25.5, 26, 26.8, 27.2, 26.5, 25.8, 25.2, 26, 25.5, 24.8,
      25.5, 26, 25.2, 24.5, 25, 24.5, 23.8, 24.5, 25, 24.2,
      23.5, 24, 24.5, 23.8, 23.2, 23.8, 24.2, 23.5, 22.8, 23.5,
      24, 23.2, 22.5, 23, 22.5, 21.8, 22.5, 23, 22.2, 21.5,
      22, 21.5, 20.8, 21.5, 21, 20.2, 21, 20.5, 19.8, 20.5,
      20, 19.2, 20, 19.5, 18.8, 19.5, 19, 18.5, 19, 18.8
    ],
    behaviorScoreData: [
      20.5, 20.3, 20.1, 19.9, 19.7, 19.5, 19.3, 19.1, 18.9, 18.7,
      18.8, 18.6, 18.4, 18.5, 18.3, 18.1, 18.2, 18.0, 17.8, 17.9,
      17.7, 17.5, 17.6, 17.4, 17.2, 17.3, 17.1, 16.9, 17.0, 16.8,
      16.6, 16.7, 16.5, 16.3, 16.4, 16.2, 16.0, 16.1, 15.9, 15.7,
      15.8, 15.6, 15.4, 15.5, 15.3, 15.1, 15.2, 15.0, 14.8, 14.9,
      14.7, 14.5, 14.6, 14.4, 14.2, 14.3, 14.1, 13.9, 14.0, 13.8,
      13.9, 13.7, 13.5, 13.6, 13.4, 13.2, 13.3, 13.1, 12.9, 13.0,
      13.1, 12.9, 12.7, 12.8, 12.6, 12.4, 12.5, 12.3, 12.1, 12.2,
      12.3, 12.1, 11.9, 12.0, 11.8, 11.6, 11.7, 11.5, 11.3, 11.4,
      11.5, 11.3, 11.1, 11.2, 11.0, 10.8, 10.9, 10.7, 10.5, 10.6
    ],
    benchmarkData: [
      14.0, 13.95, 13.9, 13.85, 13.8, 13.75, 13.7, 13.65, 13.6, 13.55,
      13.5, 13.45, 13.4, 13.35, 13.3, 13.25, 13.2, 13.15, 13.1, 13.05,
      13.0, 12.95, 12.9, 12.85, 12.8, 12.75, 12.7, 12.65, 12.6, 12.55,
      12.5, 12.45, 12.4, 12.35, 12.3, 12.25, 12.2, 12.15, 12.1, 12.05,
      12.0, 11.95, 11.9, 11.85, 11.8, 11.75, 11.7, 11.65, 11.6, 11.55,
      11.5, 11.45, 11.4, 11.35, 11.3, 11.25, 11.2, 11.15, 11.1, 11.05,
      11.0, 10.95, 10.9, 10.85, 10.8, 10.75, 10.7, 10.65, 10.6, 10.55,
      10.5, 10.45, 10.4, 10.35, 10.3, 10.25, 10.2, 10.15, 10.1, 10.05,
      10.0, 9.95, 9.9, 9.85, 9.8, 9.75, 9.7, 9.65, 9.6, 9.55,
      9.5, 9.45, 9.4, 9.35, 9.3, 9.25, 9.2, 9.15, 9.1, 9.05
    ],
  },
  2: {
    // Microsoft 365 MFA - Medium click rates, steady improvement
    upperBoundaryData: [
      25, 24.5, 25.2, 24.8, 24.2, 25, 24.3, 23.8, 24.5, 25.3,
      24.8, 23.2, 24, 25.5, 25.8, 25.2, 24.5, 23.8, 24.2, 23.5,
      24.8, 25.2, 24.5, 23.2, 22.8, 23.5, 24, 23.2, 22.5, 23.2,
      24, 23.5, 22.8, 22.2, 23, 22.5, 21.8, 22.5, 23, 22.2,
      21.5, 22, 22.8, 23.2, 22.5, 21.8, 21.2, 22, 21.5, 20.8,
      21.5, 22, 21.2, 20.5, 21, 20.5, 19.8, 20.5, 21, 20.2,
      19.5, 20, 20.5, 19.8, 19.2, 19.8, 20.2, 19.5, 18.8, 19.5,
      20, 19.2, 18.5, 19, 18.5, 17.8, 18.5, 19, 18.2, 17.5,
      18, 17.5, 16.8, 17.5, 17, 16.2, 17, 16.5, 15.8, 16.5,
      16, 15.2, 16, 15.5, 14.8, 15.5, 15, 14.5, 15, 14.8
    ],
    behaviorScoreData: [
      16.5, 16.3, 16.1, 15.9, 15.7, 15.5, 15.3, 15.1, 14.9, 14.7,
      14.8, 14.6, 14.4, 14.5, 14.3, 14.1, 14.2, 14.0, 13.8, 13.9,
      13.7, 13.5, 13.6, 13.4, 13.2, 13.3, 13.1, 12.9, 13.0, 12.8,
      12.6, 12.7, 12.5, 12.3, 12.4, 12.2, 12.0, 12.1, 11.9, 11.7,
      11.8, 11.6, 11.4, 11.5, 11.3, 11.1, 11.2, 11.0, 10.8, 10.9,
      10.7, 10.5, 10.6, 10.4, 10.2, 10.3, 10.1, 9.9, 10.0, 9.8,
      9.9, 9.7, 9.5, 9.6, 9.4, 9.2, 9.3, 9.1, 8.9, 9.0,
      9.1, 8.9, 8.7, 8.8, 8.6, 8.4, 8.5, 8.3, 8.1, 8.2,
      8.3, 8.1, 7.9, 8.0, 7.8, 7.6, 7.7, 7.5, 7.3, 7.4,
      7.5, 7.3, 7.1, 7.2, 7.0, 6.8, 6.9, 6.7, 6.5, 6.6
    ],
    benchmarkData: [
      14.0, 13.95, 13.9, 13.85, 13.8, 13.75, 13.7, 13.65, 13.6, 13.55,
      13.5, 13.45, 13.4, 13.35, 13.3, 13.25, 13.2, 13.15, 13.1, 13.05,
      13.0, 12.95, 12.9, 12.85, 12.8, 12.75, 12.7, 12.65, 12.6, 12.55,
      12.5, 12.45, 12.4, 12.35, 12.3, 12.25, 12.2, 12.15, 12.1, 12.05,
      12.0, 11.95, 11.9, 11.85, 11.8, 11.75, 11.7, 11.65, 11.6, 11.55,
      11.5, 11.45, 11.4, 11.35, 11.3, 11.25, 11.2, 11.15, 11.1, 11.05,
      11.0, 10.95, 10.9, 10.85, 10.8, 10.75, 10.7, 10.65, 10.6, 10.55,
      10.5, 10.45, 10.4, 10.35, 10.3, 10.25, 10.2, 10.15, 10.1, 10.05,
      10.0, 9.95, 9.9, 9.85, 9.8, 9.75, 9.7, 9.65, 9.6, 9.55,
      9.5, 9.45, 9.4, 9.35, 9.3, 9.25, 9.2, 9.15, 9.1, 9.05
    ],
  },
  3: {
    // PayPal Invoice - Lower click rates, already well-contained
    upperBoundaryData: [
      22, 21.5, 22.2, 21.8, 21.2, 22, 21.3, 20.8, 21.5, 22.3,
      21.8, 20.2, 21, 22.5, 22.8, 22.2, 21.5, 20.8, 21.2, 20.5,
      21.8, 22.2, 21.5, 20.2, 19.8, 20.5, 21, 20.2, 19.5, 20.2,
      21, 20.5, 19.8, 19.2, 20, 19.5, 18.8, 19.5, 20, 19.2,
      18.5, 19, 19.8, 20.2, 19.5, 18.8, 18.2, 19, 18.5, 17.8,
      18.5, 19, 18.2, 17.5, 18, 17.5, 16.8, 17.5, 18, 17.2,
      16.5, 17, 17.5, 16.8, 16.2, 16.8, 17.2, 16.5, 15.8, 16.5,
      17, 16.2, 15.5, 16, 15.5, 14.8, 15.5, 16, 15.2, 14.5,
      15, 14.5, 13.8, 14.5, 14, 13.2, 14, 13.5, 12.8, 13.5,
      13, 12.2, 13, 12.5, 11.8, 12.5, 12, 11.5, 12, 11.8
    ],
    behaviorScoreData: [
      14.5, 14.3, 14.1, 13.9, 13.7, 13.5, 13.3, 13.1, 12.9, 12.7,
      12.8, 12.6, 12.4, 12.5, 12.3, 12.1, 12.2, 12.0, 11.8, 11.9,
      11.7, 11.5, 11.6, 11.4, 11.2, 11.3, 11.1, 10.9, 11.0, 10.8,
      10.6, 10.7, 10.5, 10.3, 10.4, 10.2, 10.0, 10.1, 9.9, 9.7,
      9.8, 9.6, 9.4, 9.5, 9.3, 9.1, 9.2, 9.0, 8.8, 8.9,
      8.7, 8.5, 8.6, 8.4, 8.2, 8.3, 8.1, 7.9, 8.0, 7.8,
      7.9, 7.7, 7.5, 7.6, 7.4, 7.2, 7.3, 7.1, 6.9, 7.0,
      7.1, 6.9, 6.7, 6.8, 6.6, 6.4, 6.5, 6.3, 6.1, 6.2,
      6.3, 6.1, 5.9, 6.0, 5.8, 5.6, 5.7, 5.5, 5.3, 5.4,
      5.5, 5.3, 5.1, 5.2, 5.0, 4.8, 4.9, 4.7, 4.5, 4.6
    ],
    benchmarkData: [
      14.0, 13.95, 13.9, 13.85, 13.8, 13.75, 13.7, 13.65, 13.6, 13.55,
      13.5, 13.45, 13.4, 13.35, 13.3, 13.25, 13.2, 13.15, 13.1, 13.05,
      13.0, 12.95, 12.9, 12.85, 12.8, 12.75, 12.7, 12.65, 12.6, 12.55,
      12.5, 12.45, 12.4, 12.35, 12.3, 12.25, 12.2, 12.15, 12.1, 12.05,
      12.0, 11.95, 11.9, 11.85, 11.8, 11.75, 11.7, 11.65, 11.6, 11.55,
      11.5, 11.45, 11.4, 11.35, 11.3, 11.25, 11.2, 11.15, 11.1, 11.05,
      11.0, 10.95, 10.9, 10.85, 10.8, 10.75, 10.7, 10.65, 10.6, 10.55,
      10.5, 10.45, 10.4, 10.35, 10.3, 10.25, 10.2, 10.15, 10.1, 10.05,
      10.0, 9.95, 9.9, 9.85, 9.8, 9.75, 9.7, 9.65, 9.6, 9.55,
      9.5, 9.45, 9.4, 9.35, 9.3, 9.25, 9.2, 9.15, 9.1, 9.05
    ],
  },
};

// Static chart data - shared across all threats
const chartData = {
  weeks: ['Jan 2', 'Jan 9', 'Jan 16', 'Jan 23', 'Jan 30'],
  xAxisData: Array.from({ length: 100 }, (_, i) => i),
};

const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({ activeThreat }) => {
  const [activeTab, setActiveTab] = useState<'network' | 'my-org'>('network');

  // Get threat-specific chart data
  const currentChartData = threatChartData[activeThreat?.id ?? 1] ?? threatChartData[1];

  // ECharts configuration - matching exact Figma design
  const getChartOption = () => ({
    grid: {
      left: 45,
      right: 20,
      top: 20,
      bottom: 35,
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      data: chartData.xAxisData,
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        show: true,
        interval: 19, // Show label every ~20 points (5 labels for 100 points)
        formatter: (_value: string, index: number) => {
          const weeks = ['Jan 2', 'Jan 9', 'Jan 16', 'Jan 23', 'Jan 30'];
          const weekIndex = Math.floor(index / 20);
          return weeks[Math.min(weekIndex, 4)] || '';
        },
        color: '#878E96',
        fontSize: 10,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 500,
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 30,
      interval: 5,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#DEE1E6',
          width: 1,
          type: 'solid',
        },
      },
      axisLabel: {
        formatter: '{value}%',
        color: '#878E96',
        fontSize: 10,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 500,
        align: 'right',
      },
    },
    series: [
      // Gradient background area with wavy top edge
      {
        name: 'Risk Area',
        type: 'line',
        data: currentChartData.upperBoundaryData,
        smooth: 0.4,
        showSymbol: false,
        lineStyle: { width: 0 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 50, 50, 1)' },        // #FF3232 - Red at top (high risk)
              { offset: 0.48, color: 'rgba(246, 250, 114, 0.6)' }, // #F6FA72 - Yellow
              { offset: 0.70, color: 'rgba(246, 250, 114, 0.4)' }, // #F6FA72 - Yellow
              { offset: 0.80, color: 'rgba(140, 233, 154, 0.6)' }, // #8CE99A - Light green
              { offset: 1, color: 'rgba(49, 240, 77, 1)' },        // #31F04D - Bright green at bottom (low risk)
            ],
          },
        },
        z: 1,
      },
      // Benchmark line - gray dashed
      {
        name: 'Benchmark',
        type: 'line',
        data: currentChartData.benchmarkData,
        smooth: 0.3,
        showSymbol: false,
        lineStyle: {
          color: '#868E96',
          width: 2.1,
          type: [4.2, 4.2], // Dash pattern from Figma
        },
        z: 10,
      },
      // Behavior score line - blue solid
      {
        name: 'Behavior Score',
        type: 'line',
        data: currentChartData.behaviorScoreData,
        smooth: 0.3,
        showSymbol: false,
        lineStyle: {
          color: '#1192E8',
          width: 2.1,
        },
        z: 11,
      },
    ],
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">Click rate vs benchmark</h3>
          <p className="text-xs text-gray-900 mt-0.5">Real-time threat intelligence distribution</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('network')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
              activeTab === 'network'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Network
          </button>
          <button
            onClick={() => setActiveTab('my-org')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
              activeTab === 'my-org'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            My Organization
          </button>
        </div>
      </div>

      {activeTab === 'network' ? (
        <div className="relative" style={{ height: '300px' }}>
          <ReactECharts option={getChartOption()} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
        </div>
      ) : (
        <div style={{ height: '300px' }} className="border border-gray-200 rounded-xl p-2">
          {/* My Organization View - Department List */}
          <div className="space-y-2 h-full overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="flex items-center justify-between p-3 bg-gray-100 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${dept.deployed ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div>
                    <div className="text-sm font-bold text-gray-900">{dept.name}</div>
                    <div className="text-xs text-gray-900">{dept.employees} employees</div>
                  </div>
                </div>
                <div className="text-right">
                  {dept.deployed ? (
                    <div>
                      <div className="text-xs font-bold text-gray-900">Deployed</div>
                      <div className="text-xs text-gray-900">{dept.deployedAt}</div>
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-gray-900">Pending</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-sm font-bold text-gray-900">
        Based on adaptive simulations running in 8,431 organizations
      </div>
    </div>
  );
};

const TimelineEvent: React.FC<TimelineEventProps & { color?: string }> = ({ time, title, description, isLast, color = 'bg-purple-500' }) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center">
      <div className={`w-3 h-3 rounded-full ${color} mt-1 flex-shrink-0`} />
      {!isLast && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
    </div>
    <div className="pb-4">
      <div className="text-xs text-gray-900">{time}</div>
      <div className="font-extrabold text-gray-900 text-sm mt-0.5">{title}</div>
      <div className="text-xs text-gray-900 mt-0.5">{description}</div>
    </div>
  </div>
);

// Reported Threat Feed Component
const ReportedThreatFeed: React.FC = () => {
  const [threats, setThreats] = useState(reportedThreats);
  const [newItemId, setNewItemId] = useState<number | null>(null);
  const [reportCount, setReportCount] = useState(80);

  const statusConfig: Record<ReportStatus, { label: string; color: string }> = {
    analyzing: { label: 'Analyzing', color: 'bg-gray-200 text-gray-600' },
    confirmed: { label: 'Confirmed', color: 'bg-gray-200 text-gray-600' },
    pushed: { label: 'Alert Pushed', color: 'bg-gray-200 text-gray-600' },
  };

  // Cycle threats every 10 seconds - move last item to top with fresh timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      setThreats(prev => {
        const lastItem = prev[prev.length - 1];
        const updatedItem = {
          ...lastItem,
          id: Date.now(), // New unique ID for animation key
          timeAgo: 'Just now',
          status: 'analyzing' as ReportStatus, // New items start as analyzing
          confirmedBy: undefined,
        };
        setNewItemId(updatedItem.id);
        setReportCount(prev => prev + 1);
        return [updatedItem, ...prev.slice(0, -1)];
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Clear new item highlight after animation
  useEffect(() => {
    if (newItemId) {
      const timeout = setTimeout(() => setNewItemId(null), 800);
      return () => clearTimeout(timeout);
    }
  }, [newItemId]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-extrabold text-gray-900">Threat Report Feed</h3>
        <div className="flex items-center gap-2 mt-0.5">
          <Mail size={14} className="text-gray-600" />
          <span className="text-sm font-bold text-gray-900">247</span>
          <span className="text-xs text-gray-600">unique reports this week</span>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-2">
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
        {threats.map((report) => {
          const status = statusConfig[report.status];
          const isNew = report.id === newItemId;
          return (
            <div
              key={report.id}
              className={`rounded-xl p-4 transition-all duration-300 ${
                isNew ? 'bg-purple-50' : 'bg-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-bold text-gray-900">{report.threatType}</div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {report.orgType}, {report.orgSize}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Shield size={12} className="text-gray-500" />
                    <span className="text-xs text-gray-900">
                      Trust: <span className="font-bold">{report.trustScore}%</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-gray-500" />
                    <span className="text-xs text-gray-600">{report.timeAgo}</span>
                  </div>
                </div>
                {report.confirmedBy && (
                  <div className="text-xs text-gray-600 font-medium">
                    Confirmed by {report.confirmedBy} orgs
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      <div className="mt-4 pt-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-600">Last 24H</div>
          <div className="text-sm font-bold text-gray-900">{reportCount} reports</div>
        </div>
        <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors">
          View all reports
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Template Intelligence Panel Component
const TemplateIntelligencePanel: React.FC = () => {
  const networkPoweredCount = simulationTemplates.filter(t => t.isNetworkPowered).length;
  const newThisWeek = simulationTemplates.filter(t => t.status === 'new' || t.status === 'updated').length;

  const statusConfig = {
    new: { label: 'New', color: 'bg-gray-200 text-gray-600' },
    updated: { label: 'Updated', color: 'bg-gray-200 text-gray-600' },
    active: { label: 'Active', color: 'bg-gray-200 text-gray-600' },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">Template Intelligence</h3>
          <p className="text-xs text-gray-900 mt-0.5">Simulation templates informed by network threat data</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg">
            <Sparkles size={14} className="text-gray-900" />
            <span className="text-sm font-bold text-gray-900">{newThisWeek}</span>
            <span className="text-xs text-gray-900">updated this week</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {simulationTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-all"
          >
            <div className="flex items-start gap-3 mb-3">
              {/* Template preview thumbnail */}
              {template.logo ? (
                <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={template.logo} alt={template.name} className="w-10 h-10 object-contain" />
                </div>
              ) : (
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.previewColor} flex items-center justify-center flex-shrink-0`}>
                  <FileText size={20} className="text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{template.name}</h4>
                  {template.isNetworkPowered && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                      Network-Powered
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${statusConfig[template.status].color}`}>
                    {statusConfig[template.status].label}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600 mb-3">
              {template.source} <span className="text-gray-400">·</span> {template.sourceTime}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white rounded-lg p-2">
                <div className="flex items-center justify-center gap-1">
                  <Users size={12} className="text-gray-400" />
                  <span className="text-sm font-bold text-gray-900">{template.adoption.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500">orgs active</div>
              </div>
              <div className="bg-white rounded-lg p-2">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp size={12} className="text-gray-400" />
                  <span className="text-sm font-bold text-gray-900">{template.avgClickRate}%</span>
                </div>
                <div className="text-xs text-gray-500">click rate</div>
              </div>
              <div className="bg-white rounded-lg p-2">
                <div className="text-sm font-bold text-gray-900">D{template.difficulty}</div>
                <div className="text-xs text-gray-500">difficulty</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Shield size={14} />
          <span><span className="font-bold text-gray-900">{networkPoweredCount}</span> templates derived from real network threats</span>
        </div>
        <button className="text-xs font-bold text-gray-900 hover:underline">
          View template library →
        </button>
      </div>
    </div>
  );
};

export default function ThreatRadar2() {
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
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />

      <div className="flex-1 flex flex-col relative">
        {/* Top left gradient */}
        <div
          className="absolute top-0 left-0 w-[600px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 0% 0%, rgba(192, 132, 252, 0.4) 0%, rgba(192, 132, 252, 0.2) 30%, rgba(192, 132, 252, 0.05) 50%, transparent 70%)',
          }}
        />

        <div className="flex-1 overflow-y-auto px-8 py-8 relative z-10">
          {/* Header - no border, flows into content */}
          <div className="mb-8">
            <h1 className="text-5xl font-black text-gray-900">Threat Radar</h1>
            <p className="text-xs text-gray-900 mt-2">Real-time networked defense intelligence across your organization.</p>
          </div>
        {/* Promotional Banners */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Recreate Phishing Attacks Banner */}
          <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-6 border border-orange-100 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Recreate phishing attacks<br />in a few clicks</h3>
              <button className="mt-4 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                Join the beta
              </button>
            </div>
            <div className="w-32 h-32 ml-4">
              <img src={recreateBetaImage} alt="Recreate phishing attacks" className="w-full h-full object-contain rounded-xl" />
            </div>
          </div>

          {/* February Report Banner */}
          <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50 rounded-2xl p-6 border border-purple-100 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">February report is ready!</h3>
              <button className="mt-4 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                Download
              </button>
            </div>
            <div className="w-32 h-32 ml-4">
              <img src={reportImage} alt="February report" className="w-full h-full object-contain rounded-xl" />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <StatCard
            iconSrc={activeThreatsIcon}
            label="Active threats"
            value="3"
          />
          <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-1.5 rounded-full bg-white">
                <Mail size={20} className="text-gray-900" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">1,247</div>
            <div className="text-sm text-gray-600">Network Reports</div>
            <div className="text-xs text-gray-500 mt-1">Last 24 hours</div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="p-1.5 rounded-full bg-white">
                <Clock size={20} className="text-gray-900" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">2.3 min</div>
            <div className="text-sm text-gray-600">Avg. Triage Time</div>
            <div className="text-xs text-gray-500 mt-1">Mail Triage</div>
          </div>
          <StatCard
            iconSrc={orgsProtectedIcon}
            label="Organizations Protected"
            value={protectedCount.toLocaleString()}
          />
          <StatCard
            iconSrc={attacksPreventedIcon}
            label="Attack Prevention Rate"
            value="94.7%"
          />
        </div>

        {/* Main Content - Connected Information Group */}
        <div className="bg-gray-50 rounded-3xl border border-gray-200 p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Row 1: Active threats + Network Visualization */}
            <div className="col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full">
                <div className="mb-4">
                  <h2 className="text-lg font-extrabold text-gray-900">Active threats</h2>
                  <p className="text-xs text-gray-900 mt-0.5">Click to view propagation</p>
                </div>
                <div className="space-y-3">
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
            <div className="col-span-2">
              <NetworkVisualization activeThreat={activeThreat} />
            </div>

            {/* Row 2: Threat Report Feed + Timeline/Collective Intelligence */}
            <div className="col-span-1">
              <ReportedThreatFeed />
            </div>
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-lg font-extrabold text-gray-900 mb-4">Propagation Timeline</h3>
                  <div className="space-y-1">
                    {(threatTimelines[activeThreat?.id ?? 1] ?? threatTimelines[1]).map((event, index, arr) => (
                      <TimelineEvent
                        key={index}
                        time={event.time}
                        title={event.title}
                        description={event.description}
                        color={event.color}
                        isLast={index === arr.length - 1}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="font-extrabold text-lg text-gray-900">Collective Intelligence</h3>
                  <p className="text-xs text-gray-900 mt-2">
                    Every SoSafe customer makes every other customer more secure. This threat is now being simulated across {activeThreat?.protectedOrgs?.toLocaleString() ?? '0'} organizations.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">4 min</div>
                      <div className="text-xs text-gray-900">Detection → Defense</div>
                    </div>
                    <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors">
                      View Details
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Template Intelligence Section */}
        <div className="mt-6">
          <TemplateIntelligencePanel />
        </div>
        </div>
      </div>
    </div>
  );
}
