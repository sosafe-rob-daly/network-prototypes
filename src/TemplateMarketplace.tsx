import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Mail, Shield, Users, TrendingUp, Star, Search,
  FileText, Zap, Globe, Phone, Smartphone, QrCode, Layers,
  MessageCircle, Sparkles, ChevronLeft
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Sidebar from './Sidebar';
import docusignLogo from '../Assets/Docusign.png';
import m365Logo from '../Assets/M365.png';
import paypalLogo from '../Assets/PayPal.png';
import whatsappLogo from '../Assets/WhatsApp.png';
import zoomLogo from '../Assets/Zoom.png';
import linkedinLogo from '../Assets/LinkedIn.webp';
import dhlLogo from '../Assets/DHL.png';
import deutschePostLogo from '../Assets/DeutschePost.png';

// === Type Definitions ===
type AttackChannel = 'email' | 'whatsapp' | 'vishing' | 'sms' | 'qr-code' | 'multi-channel';
type TemplateSource = 'sosafe-curated' | 'community';
type TemplateStatus = 'new' | 'trending' | 'popular' | 'updated';
type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
type SortOption = 'popularity' | 'effectiveness' | 'newest' | 'rating' | 'difficulty';

interface TemplateAuthor {
  name: string;
  type: TemplateSource;
  industry?: string;
  orgSize?: string;
  trustScore?: number;
  templatesPublished?: number;
  memberSince?: string;
}

interface EffectivenessMetrics {
  avgClickRate: number;
  avgReportingRate: number;
  clickRateOverTime: number[];
  reportingRateOverTime: number[];
  completionRate: number;
  behaviorChangeScore: number;
}

interface NetworkUsageStats {
  totalOrganizations: number;
  totalSimulations: number;
  industries: { name: string; count: number }[];
  orgSizes: { label: string; count: number }[];
  regions: { name: string; count: number }[];
  lastDeployedAgo: string;
}

interface TemplateReview {
  id: number;
  orgIndustry: string;
  orgSize: string;
  rating: number;
  comment: string;
  clickRateReduction: number;
  timeAgo: string;
}

interface MarketplaceTemplate {
  id: number;
  name: string;
  description: string;
  attackChannel: AttackChannel;
  author: TemplateAuthor;
  status: TemplateStatus;
  difficulty: DifficultyLevel;
  tags: string[];
  language: string;
  previewImageUrl?: string;
  previewColor?: string;
  effectiveness: EffectivenessMetrics;
  networkUsage: NetworkUsageStats;
  reviews: TemplateReview[];
  avgRating: number;
  isNetworkPowered: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FilterState {
  channel: AttackChannel | 'all';
  source: TemplateSource | 'all';
  search: string;
  sort: SortOption;
}

// === Channel Configuration ===
const channelConfig: Record<AttackChannel, { label: string; icon: LucideIcon; color: string }> = {
  'email': { label: 'Email', icon: Mail, color: 'bg-blue-100 text-blue-700' },
  'whatsapp': { label: 'WhatsApp', icon: MessageCircle, color: 'bg-green-100 text-green-700' },
  'vishing': { label: 'Vishing', icon: Phone, color: 'bg-orange-100 text-orange-700' },
  'sms': { label: 'SMS', icon: Smartphone, color: 'bg-purple-100 text-purple-700' },
  'qr-code': { label: 'QR Code', icon: QrCode, color: 'bg-pink-100 text-pink-700' },
  'multi-channel': { label: 'Multi', icon: Layers, color: 'bg-gray-200 text-gray-700' },
};

// === Mock Data ===
const allTemplates: MarketplaceTemplate[] = [
  {
    id: 1,
    name: 'DocuSign Credential Harvest',
    description: 'Sophisticated credential harvesting attack impersonating DocuSign document signing requests. Targets users with realistic-looking signing invitations that redirect to phishing pages.',
    attackChannel: 'email',
    author: { name: 'SoSafe Threat Lab', type: 'sosafe-curated' },
    status: 'trending',
    difficulty: 4,
    tags: ['credential-harvest', 'brand-impersonation', 'finance'],
    language: 'English',
    previewImageUrl: docusignLogo,
    effectiveness: {
      avgClickRate: 23.4, avgReportingRate: 41.2,
      clickRateOverTime: [28, 27, 25, 24, 23, 22, 21, 22, 23, 24, 23, 23],
      reportingRateOverTime: [32, 34, 35, 37, 38, 39, 40, 40, 41, 41, 42, 41],
      completionRate: 94, behaviorChangeScore: 18,
    },
    networkUsage: {
      totalOrganizations: 1247, totalSimulations: 186420,
      industries: [{ name: 'Financial Services', count: 412 }, { name: 'Technology', count: 298 }, { name: 'Healthcare', count: 187 }, { name: 'Manufacturing', count: 156 }, { name: 'Other', count: 194 }],
      orgSizes: [{ label: '1-500', count: 312 }, { label: '500-2000', count: 534 }, { label: '2000+', count: 401 }],
      regions: [{ name: 'DACH', count: 523 }, { name: 'Western Europe', count: 389 }, { name: 'North America', count: 213 }, { name: 'Other', count: 122 }],
      lastDeployedAgo: '2 hours ago',
    },
    reviews: [
      { id: 1, orgIndustry: 'Financial Services firm', orgSize: '1,200 employees', rating: 5, comment: 'Extremely realistic template. Our click rate dropped 34% after the first deployment.', clickRateReduction: -34, timeAgo: '2 weeks ago' },
      { id: 2, orgIndustry: 'Tech company', orgSize: '800 employees', rating: 4, comment: 'Great quality. The DocuSign branding is very convincing.', clickRateReduction: -22, timeAgo: '1 month ago' },
      { id: 3, orgIndustry: 'Healthcare provider', orgSize: '3,400 employees', rating: 5, comment: 'Helped us identify high-risk departments quickly.', clickRateReduction: -41, timeAgo: '3 weeks ago' },
    ],
    avgRating: 4.7, isNetworkPowered: true, createdAt: 'Oct 12, 2024', updatedAt: 'Feb 18, 2025',
  },
  {
    id: 2,
    name: 'Microsoft 365 MFA Reset',
    description: 'MFA fatigue attack simulation impersonating Microsoft 365 security alerts. Tests employee response to urgent password reset and MFA verification requests.',
    attackChannel: 'email',
    author: { name: 'SoSafe Threat Lab', type: 'sosafe-curated' },
    status: 'popular',
    difficulty: 3,
    tags: ['mfa', 'credential-harvest', 'microsoft'],
    language: 'English',
    previewImageUrl: m365Logo,
    effectiveness: {
      avgClickRate: 18.7, avgReportingRate: 38.5,
      clickRateOverTime: [24, 22, 21, 20, 19, 19, 18, 18, 19, 18, 19, 18],
      reportingRateOverTime: [28, 30, 32, 33, 35, 36, 37, 37, 38, 38, 39, 38],
      completionRate: 96, behaviorChangeScore: 15,
    },
    networkUsage: {
      totalOrganizations: 892, totalSimulations: 124300,
      industries: [{ name: 'Technology', count: 312 }, { name: 'Financial Services', count: 234 }, { name: 'Professional Services', count: 178 }, { name: 'Other', count: 168 }],
      orgSizes: [{ label: '1-500', count: 198 }, { label: '500-2000', count: 412 }, { label: '2000+', count: 282 }],
      regions: [{ name: 'DACH', count: 367 }, { name: 'Western Europe', count: 298 }, { name: 'North America', count: 156 }, { name: 'Other', count: 71 }],
      lastDeployedAgo: '4 hours ago',
    },
    reviews: [
      { id: 4, orgIndustry: 'Software company', orgSize: '600 employees', rating: 4, comment: 'Effective at testing MFA awareness. Well-crafted urgency signals.', clickRateReduction: -28, timeAgo: '1 week ago' },
      { id: 5, orgIndustry: 'Consulting firm', orgSize: '2,100 employees', rating: 5, comment: 'Our executives particularly benefited from this simulation.', clickRateReduction: -31, timeAgo: '3 weeks ago' },
    ],
    avgRating: 4.5, isNetworkPowered: true, createdAt: 'Sep 5, 2024', updatedAt: 'Feb 10, 2025',
  },
  {
    id: 3,
    name: 'WhatsApp CEO Impersonation',
    description: 'Voice message and text-based CEO fraud simulation via WhatsApp. Tests employee susceptibility to authority-based social engineering through messaging apps.',
    attackChannel: 'whatsapp',
    author: { name: 'Allianz SE Security Team', type: 'community', industry: 'Financial Services', orgSize: '5,000+ employees', trustScore: 94, templatesPublished: 7, memberSince: 'Mar 2024' },
    status: 'trending',
    difficulty: 5,
    tags: ['ceo-fraud', 'social-engineering', 'messaging'],
    language: 'English',
    previewImageUrl: whatsappLogo,
    effectiveness: {
      avgClickRate: 31.2, avgReportingRate: 28.4,
      clickRateOverTime: [38, 36, 35, 33, 32, 31, 31, 30, 31, 31, 32, 31],
      reportingRateOverTime: [18, 20, 22, 23, 25, 26, 27, 27, 28, 28, 29, 28],
      completionRate: 89, behaviorChangeScore: 24,
    },
    networkUsage: {
      totalOrganizations: 347, totalSimulations: 42100,
      industries: [{ name: 'Financial Services', count: 142 }, { name: 'Insurance', count: 87 }, { name: 'Professional Services', count: 64 }, { name: 'Other', count: 54 }],
      orgSizes: [{ label: '1-500', count: 67 }, { label: '500-2000', count: 134 }, { label: '2000+', count: 146 }],
      regions: [{ name: 'DACH', count: 198 }, { name: 'Western Europe', count: 102 }, { name: 'Other', count: 47 }],
      lastDeployedAgo: '6 hours ago',
    },
    reviews: [
      { id: 6, orgIndustry: 'Banking institution', orgSize: '4,200 employees', rating: 5, comment: 'Uncovered a critical blind spot in our exec team. WhatsApp attacks are the future threat vector.', clickRateReduction: -38, timeAgo: '1 week ago' },
      { id: 7, orgIndustry: 'Insurance company', orgSize: '1,800 employees', rating: 4, comment: 'Very realistic scenario. High engagement from employees.', clickRateReduction: -26, timeAgo: '2 weeks ago' },
    ],
    avgRating: 4.6, isNetworkPowered: true, createdAt: 'Nov 20, 2024', updatedAt: 'Feb 22, 2025',
  },
  {
    id: 4,
    name: 'IT Helpdesk Callback',
    description: 'Vishing simulation impersonating internal IT helpdesk requesting remote access or credential verification over the phone. Tests voice-based social engineering defenses.',
    attackChannel: 'vishing',
    author: { name: 'SoSafe Threat Lab', type: 'sosafe-curated' },
    status: 'new',
    difficulty: 4,
    tags: ['vishing', 'helpdesk', 'remote-access'],
    language: 'English',
    previewColor: 'from-orange-500 to-amber-500',
    effectiveness: {
      avgClickRate: 27.1, avgReportingRate: 22.3,
      clickRateOverTime: [34, 32, 30, 29, 28, 27, 27, 26, 27, 27, 27, 27],
      reportingRateOverTime: [14, 16, 17, 18, 19, 20, 21, 21, 22, 22, 22, 22],
      completionRate: 91, behaviorChangeScore: 21,
    },
    networkUsage: {
      totalOrganizations: 523, totalSimulations: 31200,
      industries: [{ name: 'Technology', count: 187 }, { name: 'Financial Services', count: 134 }, { name: 'Healthcare', count: 98 }, { name: 'Other', count: 104 }],
      orgSizes: [{ label: '1-500', count: 156 }, { label: '500-2000', count: 234 }, { label: '2000+', count: 133 }],
      regions: [{ name: 'DACH', count: 234 }, { name: 'Western Europe', count: 178 }, { name: 'North America', count: 67 }, { name: 'Other', count: 44 }],
      lastDeployedAgo: '1 day ago',
    },
    reviews: [
      { id: 8, orgIndustry: 'Tech startup', orgSize: '300 employees', rating: 5, comment: 'Game-changing for our security posture. Voice phishing is underestimated.', clickRateReduction: -42, timeAgo: '5 days ago' },
    ],
    avgRating: 4.8, isNetworkPowered: false, createdAt: 'Jan 28, 2025', updatedAt: 'Feb 24, 2025',
  },
  {
    id: 5,
    name: 'Deutsche Post Package Notification',
    description: 'SMS-based package delivery notification phishing that redirects to credential harvesting pages. Leverages urgency of missed deliveries.',
    attackChannel: 'sms',
    author: { name: 'Deutsche Telekom Security', type: 'community', industry: 'Telecommunications', orgSize: '10,000+ employees', trustScore: 97, templatesPublished: 12, memberSince: 'Jan 2024' },
    status: 'popular',
    difficulty: 2,
    tags: ['smishing', 'delivery', 'brand-impersonation'],
    language: 'German',
    previewImageUrl: deutschePostLogo,
    effectiveness: {
      avgClickRate: 14.8, avgReportingRate: 45.2,
      clickRateOverTime: [20, 19, 18, 17, 16, 15, 15, 14, 15, 14, 15, 14],
      reportingRateOverTime: [34, 36, 38, 39, 41, 42, 43, 44, 44, 45, 45, 45],
      completionRate: 97, behaviorChangeScore: 12,
    },
    networkUsage: {
      totalOrganizations: 1456, totalSimulations: 234500,
      industries: [{ name: 'Retail', count: 423 }, { name: 'Logistics', count: 312 }, { name: 'Manufacturing', count: 287 }, { name: 'Financial Services', count: 198 }, { name: 'Other', count: 236 }],
      orgSizes: [{ label: '1-500', count: 534 }, { label: '500-2000', count: 567 }, { label: '2000+', count: 355 }],
      regions: [{ name: 'DACH', count: 876 }, { name: 'Western Europe', count: 345 }, { name: 'Other', count: 235 }],
      lastDeployedAgo: '30 minutes ago',
    },
    reviews: [
      { id: 9, orgIndustry: 'Retail company', orgSize: '2,800 employees', rating: 5, comment: 'Perfect for DACH region. Very high engagement and learning effect.', clickRateReduction: -29, timeAgo: '1 week ago' },
      { id: 10, orgIndustry: 'Logistics firm', orgSize: '1,100 employees', rating: 4, comment: 'Great SMS template. Simple but effective.', clickRateReduction: -18, timeAgo: '3 weeks ago' },
    ],
    avgRating: 4.4, isNetworkPowered: true, createdAt: 'Aug 15, 2024', updatedAt: 'Feb 5, 2025',
  },
  {
    id: 6,
    name: 'WiFi Security QR Trap',
    description: 'QR code-based attack simulation placed on fake company posters or in common areas. Tests employee awareness of malicious QR codes leading to phishing sites.',
    attackChannel: 'qr-code',
    author: { name: 'Siemens Cyber Defense', type: 'community', industry: 'Manufacturing', orgSize: '10,000+ employees', trustScore: 96, templatesPublished: 9, memberSince: 'Feb 2024' },
    status: 'new',
    difficulty: 3,
    tags: ['qr-code', 'physical', 'wifi'],
    language: 'English',
    previewColor: 'from-pink-500 to-rose-500',
    effectiveness: {
      avgClickRate: 19.5, avgReportingRate: 31.7,
      clickRateOverTime: [26, 24, 23, 22, 21, 20, 20, 19, 19, 20, 19, 19],
      reportingRateOverTime: [22, 24, 26, 27, 28, 29, 30, 30, 31, 31, 32, 31],
      completionRate: 88, behaviorChangeScore: 16,
    },
    networkUsage: {
      totalOrganizations: 234, totalSimulations: 18700,
      industries: [{ name: 'Manufacturing', count: 89 }, { name: 'Technology', count: 67 }, { name: 'Financial Services', count: 42 }, { name: 'Other', count: 36 }],
      orgSizes: [{ label: '1-500', count: 56 }, { label: '500-2000', count: 98 }, { label: '2000+', count: 80 }],
      regions: [{ name: 'DACH', count: 112 }, { name: 'Western Europe', count: 78 }, { name: 'Other', count: 44 }],
      lastDeployedAgo: '3 days ago',
    },
    reviews: [
      { id: 11, orgIndustry: 'Engineering firm', orgSize: '4,500 employees', rating: 5, comment: 'Brilliant concept. Physical+digital attack vector is very eye-opening for employees.', clickRateReduction: -33, timeAgo: '2 weeks ago' },
    ],
    avgRating: 4.5, isNetworkPowered: true, createdAt: 'Dec 10, 2024', updatedAt: 'Feb 20, 2025',
  },
  {
    id: 7,
    name: 'PayPal Invoice Notification',
    description: 'Fake PayPal invoice and payment request emails targeting finance teams and employees who regularly process payments.',
    attackChannel: 'email',
    author: { name: 'SoSafe Threat Lab', type: 'sosafe-curated' },
    status: 'popular',
    difficulty: 2,
    tags: ['invoice-fraud', 'brand-impersonation', 'finance'],
    language: 'English',
    previewImageUrl: paypalLogo,
    effectiveness: {
      avgClickRate: 12.1, avgReportingRate: 52.3,
      clickRateOverTime: [18, 16, 15, 14, 13, 13, 12, 12, 12, 12, 12, 12],
      reportingRateOverTime: [38, 40, 42, 44, 46, 48, 49, 50, 51, 52, 52, 52],
      completionRate: 98, behaviorChangeScore: 11,
    },
    networkUsage: {
      totalOrganizations: 2341, totalSimulations: 412800,
      industries: [{ name: 'Financial Services', count: 678 }, { name: 'Retail', count: 534 }, { name: 'Technology', count: 423 }, { name: 'Professional Services', count: 312 }, { name: 'Other', count: 394 }],
      orgSizes: [{ label: '1-500', count: 812 }, { label: '500-2000', count: 934 }, { label: '2000+', count: 595 }],
      regions: [{ name: 'DACH', count: 756 }, { name: 'Western Europe', count: 678 }, { name: 'North America', count: 534 }, { name: 'Other', count: 373 }],
      lastDeployedAgo: '1 hour ago',
    },
    reviews: [
      { id: 12, orgIndustry: 'E-commerce company', orgSize: '900 employees', rating: 4, comment: 'Essential for finance teams. Simple but catches people off guard.', clickRateReduction: -19, timeAgo: '2 weeks ago' },
      { id: 13, orgIndustry: 'Accounting firm', orgSize: '350 employees', rating: 5, comment: 'High reporting rate shows great awareness building.', clickRateReduction: -24, timeAgo: '1 month ago' },
    ],
    avgRating: 4.3, isNetworkPowered: true, createdAt: 'Jul 20, 2024', updatedAt: 'Jan 15, 2025',
  },
  {
    id: 8,
    name: 'LinkedIn Recruiter Message',
    description: 'Spear-phishing via fake LinkedIn recruiter messages containing malicious links or attachments. Targets employees interested in career opportunities.',
    attackChannel: 'email',
    author: { name: 'Commerzbank InfoSec', type: 'community', industry: 'Financial Services', orgSize: '5,000+ employees', trustScore: 91, templatesPublished: 5, memberSince: 'May 2024' },
    status: 'trending',
    difficulty: 3,
    tags: ['spear-phishing', 'linkedin', 'recruitment'],
    language: 'English',
    previewImageUrl: linkedinLogo,
    effectiveness: {
      avgClickRate: 21.3, avgReportingRate: 33.8,
      clickRateOverTime: [28, 26, 25, 24, 23, 22, 22, 21, 21, 21, 21, 21],
      reportingRateOverTime: [24, 26, 28, 29, 30, 31, 32, 33, 33, 34, 34, 33],
      completionRate: 92, behaviorChangeScore: 17,
    },
    networkUsage: {
      totalOrganizations: 678, totalSimulations: 89400,
      industries: [{ name: 'Technology', count: 234 }, { name: 'Financial Services', count: 189 }, { name: 'Professional Services', count: 134 }, { name: 'Other', count: 121 }],
      orgSizes: [{ label: '1-500', count: 198 }, { label: '500-2000', count: 312 }, { label: '2000+', count: 168 }],
      regions: [{ name: 'DACH', count: 312 }, { name: 'Western Europe', count: 234 }, { name: 'North America', count: 89 }, { name: 'Other', count: 43 }],
      lastDeployedAgo: '5 hours ago',
    },
    reviews: [
      { id: 14, orgIndustry: 'Consulting firm', orgSize: '1,500 employees', rating: 4, comment: 'Targets a realistic attack vector. Good for mid-career employees.', clickRateReduction: -21, timeAgo: '10 days ago' },
    ],
    avgRating: 4.2, isNetworkPowered: true, createdAt: 'Oct 1, 2024', updatedAt: 'Feb 12, 2025',
  },
  {
    id: 9,
    name: 'Bank Transfer Verification',
    description: 'WhatsApp-based urgent bank transfer verification scam targeting finance and treasury teams. Uses deepfake voice notes and CFO impersonation.',
    attackChannel: 'whatsapp',
    author: { name: 'UBS Cyber Security', type: 'community', industry: 'Financial Services', orgSize: '10,000+ employees', trustScore: 98, templatesPublished: 11, memberSince: 'Jan 2024' },
    status: 'popular',
    difficulty: 4,
    tags: ['ceo-fraud', 'bank-transfer', 'deepfake'],
    language: 'English',
    previewColor: 'from-emerald-600 to-teal-500',
    effectiveness: {
      avgClickRate: 25.6, avgReportingRate: 29.1,
      clickRateOverTime: [32, 30, 29, 28, 27, 26, 26, 25, 25, 26, 25, 25],
      reportingRateOverTime: [20, 22, 24, 25, 26, 27, 28, 28, 29, 29, 29, 29],
      completionRate: 90, behaviorChangeScore: 22,
    },
    networkUsage: {
      totalOrganizations: 412, totalSimulations: 34100,
      industries: [{ name: 'Financial Services', count: 198 }, { name: 'Insurance', count: 87 }, { name: 'Professional Services', count: 67 }, { name: 'Other', count: 60 }],
      orgSizes: [{ label: '1-500', count: 78 }, { label: '500-2000', count: 178 }, { label: '2000+', count: 156 }],
      regions: [{ name: 'DACH', count: 189 }, { name: 'Western Europe', count: 134 }, { name: 'North America', count: 56 }, { name: 'Other', count: 33 }],
      lastDeployedAgo: '12 hours ago',
    },
    reviews: [
      { id: 15, orgIndustry: 'Private bank', orgSize: '700 employees', rating: 5, comment: 'Caught our CFO. Exactly the wake-up call our leadership needed.', clickRateReduction: -45, timeAgo: '1 week ago' },
      { id: 16, orgIndustry: 'Asset management', orgSize: '400 employees', rating: 5, comment: 'The deepfake voice angle makes this incredibly realistic.', clickRateReduction: -37, timeAgo: '3 weeks ago' },
    ],
    avgRating: 4.8, isNetworkPowered: true, createdAt: 'Nov 5, 2024', updatedAt: 'Feb 18, 2025',
  },
  {
    id: 10,
    name: 'Zoom Meeting Invite',
    description: 'Fake Zoom meeting invitation with urgent subject lines directing users to credential harvesting pages. Exploits remote work culture.',
    attackChannel: 'email',
    author: { name: 'SoSafe Threat Lab', type: 'sosafe-curated' },
    status: 'popular',
    difficulty: 2,
    tags: ['credential-harvest', 'zoom', 'remote-work'],
    language: 'English',
    previewImageUrl: zoomLogo,
    effectiveness: {
      avgClickRate: 16.4, avgReportingRate: 44.7,
      clickRateOverTime: [22, 20, 19, 18, 17, 17, 16, 16, 16, 16, 16, 16],
      reportingRateOverTime: [34, 36, 38, 39, 41, 42, 43, 44, 44, 45, 45, 44],
      completionRate: 95, behaviorChangeScore: 13,
    },
    networkUsage: {
      totalOrganizations: 1893, totalSimulations: 298400,
      industries: [{ name: 'Technology', count: 534 }, { name: 'Professional Services', count: 412 }, { name: 'Financial Services', count: 356 }, { name: 'Education', count: 234 }, { name: 'Other', count: 357 }],
      orgSizes: [{ label: '1-500', count: 678 }, { label: '500-2000', count: 734 }, { label: '2000+', count: 481 }],
      regions: [{ name: 'DACH', count: 534 }, { name: 'Western Europe', count: 512 }, { name: 'North America', count: 534 }, { name: 'Other', count: 313 }],
      lastDeployedAgo: '3 hours ago',
    },
    reviews: [
      { id: 17, orgIndustry: 'University', orgSize: '5,000 employees', rating: 4, comment: 'Simple but effective. Great for baseline testing across large orgs.', clickRateReduction: -15, timeAgo: '2 weeks ago' },
    ],
    avgRating: 4.1, isNetworkPowered: false, createdAt: 'Jun 10, 2024', updatedAt: 'Dec 20, 2024',
  },
  {
    id: 11,
    name: 'DHL Delivery Reschedule',
    description: 'SMS phishing simulation impersonating DHL delivery notifications requesting address verification through malicious links.',
    attackChannel: 'sms',
    author: { name: 'BMW Group Security', type: 'community', industry: 'Automotive', orgSize: '10,000+ employees', trustScore: 95, templatesPublished: 8, memberSince: 'Apr 2024' },
    status: 'updated',
    difficulty: 2,
    tags: ['smishing', 'delivery', 'dhl'],
    language: 'German',
    previewImageUrl: dhlLogo,
    effectiveness: {
      avgClickRate: 13.7, avgReportingRate: 48.9,
      clickRateOverTime: [19, 17, 16, 15, 15, 14, 14, 13, 13, 14, 13, 13],
      reportingRateOverTime: [36, 38, 40, 42, 44, 45, 46, 47, 48, 48, 49, 48],
      completionRate: 96, behaviorChangeScore: 10,
    },
    networkUsage: {
      totalOrganizations: 987, totalSimulations: 156700,
      industries: [{ name: 'Manufacturing', count: 312 }, { name: 'Automotive', count: 234 }, { name: 'Logistics', count: 189 }, { name: 'Other', count: 252 }],
      orgSizes: [{ label: '1-500', count: 312 }, { label: '500-2000', count: 398 }, { label: '2000+', count: 277 }],
      regions: [{ name: 'DACH', count: 623 }, { name: 'Western Europe', count: 234 }, { name: 'Other', count: 130 }],
      lastDeployedAgo: '8 hours ago',
    },
    reviews: [
      { id: 18, orgIndustry: 'Automotive supplier', orgSize: '2,300 employees', rating: 4, comment: 'Effective SMS template for the DACH market.', clickRateReduction: -16, timeAgo: '1 month ago' },
    ],
    avgRating: 4.3, isNetworkPowered: true, createdAt: 'Sep 15, 2024', updatedAt: 'Feb 8, 2025',
  },
  {
    id: 12,
    name: 'Office 365 Shared Document',
    description: 'Simulated SharePoint/OneDrive document sharing notification with embedded credential harvesting. Mimics internal document collaboration.',
    attackChannel: 'email',
    author: { name: 'SoSafe Threat Lab', type: 'sosafe-curated' },
    status: 'popular',
    difficulty: 3,
    tags: ['credential-harvest', 'sharepoint', 'internal'],
    language: 'English',
    previewImageUrl: m365Logo,
    effectiveness: {
      avgClickRate: 20.2, avgReportingRate: 36.4,
      clickRateOverTime: [26, 24, 23, 22, 21, 21, 20, 20, 20, 20, 20, 20],
      reportingRateOverTime: [26, 28, 30, 31, 33, 34, 35, 35, 36, 36, 36, 36],
      completionRate: 94, behaviorChangeScore: 14,
    },
    networkUsage: {
      totalOrganizations: 1567, totalSimulations: 267300,
      industries: [{ name: 'Technology', count: 456 }, { name: 'Financial Services', count: 389 }, { name: 'Professional Services', count: 298 }, { name: 'Healthcare', count: 187 }, { name: 'Other', count: 237 }],
      orgSizes: [{ label: '1-500', count: 534 }, { label: '500-2000', count: 612 }, { label: '2000+', count: 421 }],
      regions: [{ name: 'DACH', count: 489 }, { name: 'Western Europe', count: 456 }, { name: 'North America', count: 378 }, { name: 'Other', count: 244 }],
      lastDeployedAgo: '45 minutes ago',
    },
    reviews: [
      { id: 19, orgIndustry: 'Law firm', orgSize: '450 employees', rating: 5, comment: 'The internal document angle is brilliant. Much more effective than external phishing.', clickRateReduction: -27, timeAgo: '1 week ago' },
      { id: 20, orgIndustry: 'Pharmaceutical company', orgSize: '3,200 employees', rating: 4, comment: 'Good for testing SharePoint-heavy organizations.', clickRateReduction: -20, timeAgo: '2 weeks ago' },
    ],
    avgRating: 4.4, isNetworkPowered: false, createdAt: 'May 1, 2024', updatedAt: 'Jan 28, 2025',
  },
  {
    id: 13,
    name: 'Vendor Invoice Multi-Channel',
    description: 'Coordinated multi-channel attack combining email invoice with follow-up SMS and WhatsApp confirmation. Tests cross-channel verification habits.',
    attackChannel: 'multi-channel',
    author: { name: 'Deloitte Cyber Team', type: 'community', industry: 'Professional Services', orgSize: '10,000+ employees', trustScore: 93, templatesPublished: 6, memberSince: 'Jun 2024' },
    status: 'new',
    difficulty: 5,
    tags: ['multi-channel', 'invoice-fraud', 'advanced'],
    language: 'English',
    previewColor: 'from-gray-700 to-gray-900',
    effectiveness: {
      avgClickRate: 29.8, avgReportingRate: 24.1,
      clickRateOverTime: [36, 34, 33, 32, 31, 30, 30, 29, 30, 30, 29, 29],
      reportingRateOverTime: [16, 18, 19, 20, 21, 22, 23, 23, 24, 24, 24, 24],
      completionRate: 85, behaviorChangeScore: 26,
    },
    networkUsage: {
      totalOrganizations: 189, totalSimulations: 12400,
      industries: [{ name: 'Professional Services', count: 67 }, { name: 'Financial Services', count: 56 }, { name: 'Technology', count: 34 }, { name: 'Other', count: 32 }],
      orgSizes: [{ label: '1-500', count: 23 }, { label: '500-2000', count: 78 }, { label: '2000+', count: 88 }],
      regions: [{ name: 'DACH', count: 67 }, { name: 'Western Europe', count: 56 }, { name: 'North America', count: 45 }, { name: 'Other', count: 21 }],
      lastDeployedAgo: '2 days ago',
    },
    reviews: [
      { id: 21, orgIndustry: 'Consulting firm', orgSize: '6,000 employees', rating: 5, comment: 'The multi-channel approach is exactly how real attacks work. Eye-opening results.', clickRateReduction: -48, timeAgo: '4 days ago' },
    ],
    avgRating: 4.9, isNetworkPowered: true, createdAt: 'Jan 15, 2025', updatedAt: 'Feb 25, 2025',
  },
  {
    id: 14,
    name: 'Tax Office Callback',
    description: 'Vishing simulation impersonating tax authorities requesting urgent verification of company details. Leverages authority and compliance pressure.',
    attackChannel: 'vishing',
    author: { name: 'PwC Cybersecurity', type: 'community', industry: 'Professional Services', orgSize: '10,000+ employees', trustScore: 92, templatesPublished: 4, memberSince: 'Jul 2024' },
    status: 'updated',
    difficulty: 3,
    tags: ['vishing', 'authority', 'tax', 'compliance'],
    language: 'German',
    previewColor: 'from-red-500 to-orange-500',
    effectiveness: {
      avgClickRate: 22.4, avgReportingRate: 26.8,
      clickRateOverTime: [30, 28, 27, 26, 25, 24, 23, 23, 22, 22, 22, 22],
      reportingRateOverTime: [18, 20, 21, 23, 24, 25, 26, 26, 27, 27, 26, 26],
      completionRate: 93, behaviorChangeScore: 19,
    },
    networkUsage: {
      totalOrganizations: 312, totalSimulations: 24600,
      industries: [{ name: 'Financial Services', count: 112 }, { name: 'Professional Services', count: 87 }, { name: 'Manufacturing', count: 56 }, { name: 'Other', count: 57 }],
      orgSizes: [{ label: '1-500', count: 89 }, { label: '500-2000', count: 134 }, { label: '2000+', count: 89 }],
      regions: [{ name: 'DACH', count: 234 }, { name: 'Western Europe', count: 56 }, { name: 'Other', count: 22 }],
      lastDeployedAgo: '1 day ago',
    },
    reviews: [
      { id: 22, orgIndustry: 'Manufacturing company', orgSize: '1,800 employees', rating: 4, comment: 'Finance team was completely fooled. Great learning opportunity.', clickRateReduction: -30, timeAgo: '2 weeks ago' },
    ],
    avgRating: 4.3, isNetworkPowered: true, createdAt: 'Oct 20, 2024', updatedAt: 'Feb 15, 2025',
  },
];

// === Helper Components ===

const TemplateCard: React.FC<{
  template: MarketplaceTemplate;
  onClick: () => void;
  isActive: boolean;
}> = ({ template, onClick, isActive }) => {
  const channel = channelConfig[template.attackChannel];
  const ChannelIcon = channel.icon;

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 cursor-pointer transition-all ${
        isActive
          ? 'bg-gradient-to-br from-blue-50 to-gray-100 border-2 border-blue-200'
          : 'bg-white border border-gray-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        {template.previewImageUrl ? (
          <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src={template.previewImageUrl} alt={template.name} className="w-10 h-10 object-contain" />
          </div>
        ) : (
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.previewColor} flex items-center justify-center flex-shrink-0`}>
            <ChannelIcon size={20} className="text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">{template.name}</h4>
          <div className="flex items-center gap-1.5 mt-1">
            {template.author.type === 'sosafe-curated' ? (
              <Shield size={12} className="text-blue-600 flex-shrink-0" />
            ) : (
              <Globe size={12} className="text-green-600 flex-shrink-0" />
            )}
            <span className="text-xs text-gray-500 truncate">{template.author.name}</span>
            {template.author.trustScore && (
              <span className="text-xs text-gray-400 flex-shrink-0">({template.author.trustScore}%)</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${channel.color}`}>
          {channel.label}
        </span>
        {template.isNetworkPowered && (
          <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-medium">Network-Powered</span>
        )}
        {template.status === 'new' && (
          <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">New</span>
        )}
        {template.status === 'trending' && (
          <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">Trending</span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-gray-100 rounded-lg p-2">
          <div className="text-sm font-bold text-gray-900">{template.effectiveness.avgClickRate}%</div>
          <div className="text-xs text-gray-500">click rate</div>
        </div>
        <div className="bg-gray-100 rounded-lg p-2">
          <div className="text-sm font-bold text-gray-900">{template.networkUsage.totalOrganizations.toLocaleString()}</div>
          <div className="text-xs text-gray-500">orgs</div>
        </div>
        <div className="bg-gray-100 rounded-lg p-2">
          <div className="text-sm font-bold text-gray-900">D{template.difficulty}</div>
          <div className="text-xs text-gray-500">difficulty</div>
        </div>
        <div className="bg-gray-100 rounded-lg p-2">
          <div className="flex items-center justify-center gap-0.5">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-gray-900">{template.avgRating.toFixed(1)}</span>
          </div>
          <div className="text-xs text-gray-500">rating</div>
        </div>
      </div>
    </div>
  );
};

const TemplateCardCompact: React.FC<{
  template: MarketplaceTemplate;
  onClick: () => void;
  isActive: boolean;
}> = ({ template, onClick, isActive }) => {
  const channel = channelConfig[template.attackChannel];
  const ChannelIcon = channel.icon;

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-3 cursor-pointer transition-all ${
        isActive
          ? 'bg-gradient-to-br from-blue-50 to-gray-100 border-2 border-blue-200'
          : 'bg-white border border-gray-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        {template.previewImageUrl ? (
          <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src={template.previewImageUrl} alt={template.name} className="w-8 h-8 object-contain" />
          </div>
        ) : (
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${template.previewColor} flex items-center justify-center flex-shrink-0`}>
            <ChannelIcon size={16} className="text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-xs truncate">{template.name}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs font-medium px-1.5 py-0 rounded-full ${channel.color}`}>
              {channel.label}
            </span>
            <span className="text-xs text-gray-500">{template.effectiveness.avgClickRate}% click</span>
            <span className="text-xs text-gray-400">D{template.difficulty}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplateDetailPanel: React.FC<{
  template: MarketplaceTemplate;
  onClose: () => void;
}> = ({ template, onClose }) => {
  const channel = channelConfig[template.attackChannel];
  const ChannelIcon = channel.icon;

  const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

  const clickRateChartOption = {
    grid: { left: 40, right: 16, top: 12, bottom: 28, containLabel: false },
    xAxis: {
      type: 'category',
      data: months,
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#878E96', fontSize: 10, fontWeight: 500, fontFamily: 'Inter, system-ui, sans-serif' },
    },
    yAxis: {
      type: 'value',
      min: 0,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true, lineStyle: { color: '#DEE1E6', type: 'solid' } },
      axisLabel: { color: '#878E96', fontSize: 10, fontWeight: 500, fontFamily: 'Inter, system-ui, sans-serif', formatter: '{value}%' },
    },
    series: [{
      type: 'line',
      data: template.effectiveness.clickRateOverTime,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: '#ef4444', width: 2 },
      itemStyle: { color: '#ef4444' },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(239, 68, 68, 0.15)' }, { offset: 1, color: 'rgba(239, 68, 68, 0)' }] } },
    }],
  };

  const reportingRateChartOption = {
    grid: { left: 40, right: 16, top: 12, bottom: 28, containLabel: false },
    xAxis: {
      type: 'category',
      data: months,
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#878E96', fontSize: 10, fontWeight: 500, fontFamily: 'Inter, system-ui, sans-serif' },
    },
    yAxis: {
      type: 'value',
      min: 0,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true, lineStyle: { color: '#DEE1E6', type: 'solid' } },
      axisLabel: { color: '#878E96', fontSize: 10, fontWeight: 500, fontFamily: 'Inter, system-ui, sans-serif', formatter: '{value}%' },
    },
    series: [{
      type: 'line',
      data: template.effectiveness.reportingRateOverTime,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: '#22c55e', width: 2 },
      itemStyle: { color: '#22c55e' },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(34, 197, 94, 0.15)' }, { offset: 1, color: 'rgba(34, 197, 94, 0)' }] } },
    }],
  };

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors mr-3">
            <ChevronLeft size={20} className="text-gray-400" />
          </button>
          <div className="flex items-start gap-4 flex-1">
            {template.previewImageUrl ? (
              <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src={template.previewImageUrl} alt={template.name} className="w-12 h-12 object-contain" />
              </div>
            ) : (
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${template.previewColor} flex items-center justify-center flex-shrink-0`}>
                <ChannelIcon size={28} className="text-white" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-gray-900">{template.name}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${channel.color}`}>
                  {channel.label}
                </span>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">D{template.difficulty}</span>
                {template.isNetworkPowered && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Network-Powered</span>
                )}
                <div className="flex items-center gap-0.5 ml-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < Math.round(template.avgRating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">{template.avgRating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-xs text-gray-900 mt-2">{template.description}</p>
            </div>
          </div>
        </div>

        {/* Author info */}
        <div className="bg-gray-50 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2">
            {template.author.type === 'sosafe-curated' ? (
              <>
                <Shield size={14} className="text-blue-600" />
                <span className="text-xs font-bold text-gray-900">{template.author.name}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">SoSafe Verified</span>
              </>
            ) : (
              <>
                <Globe size={14} className="text-green-600" />
                <span className="text-xs font-bold text-gray-900">{template.author.name}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Trust: {template.author.trustScore}%</span>
                {template.author.industry && <span className="text-xs text-gray-500">· {template.author.industry}</span>}
                {template.author.templatesPublished && <span className="text-xs text-gray-500">· {template.author.templatesPublished} templates</span>}
              </>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-100 rounded-xl p-3">
            <div className="text-2xl font-bold text-gray-900">{template.effectiveness.avgClickRate}%</div>
            <div className="text-xs text-gray-900 font-medium mt-1">Avg Click Rate</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-3">
            <div className="text-2xl font-bold text-gray-900">{template.effectiveness.avgReportingRate}%</div>
            <div className="text-xs text-gray-900 font-medium mt-1">Report Rate</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-3">
            <div className="text-2xl font-bold text-gray-900">{template.networkUsage.totalOrganizations.toLocaleString()}</div>
            <div className="text-xs text-gray-900 font-medium mt-1">Organizations</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-3">
            <div className="text-2xl font-bold text-gray-900">+{template.effectiveness.behaviorChangeScore}%</div>
            <div className="text-xs text-gray-900 font-medium mt-1">HSI Improvement</div>
          </div>
        </div>
      </div>

      {/* Effectiveness Charts */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-extrabold text-gray-900 mb-2">Effectiveness Over Time</h3>
        <p className="text-xs text-gray-900 mb-4">Performance across {template.networkUsage.totalSimulations.toLocaleString()} simulations</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-900 mb-2">Click Rate Trend</div>
            <ReactECharts option={clickRateChartOption} style={{ height: '180px' }} />
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-900 mb-2">Reporting Rate Trend</div>
            <ReactECharts option={reportingRateChartOption} style={{ height: '180px' }} />
          </div>
        </div>
      </div>

      {/* Network Usage */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-gray-900" />
          <h3 className="text-lg font-extrabold text-gray-900">Network Usage</h3>
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium ml-auto">
            Last deployed {template.networkUsage.lastDeployedAgo}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">By Industry</div>
            <div className="space-y-2">
              {template.networkUsage.industries.map((ind, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs text-gray-900">{ind.name}</span>
                  <span className="text-xs font-bold text-gray-900">{ind.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">By Org Size</div>
            <div className="space-y-2">
              {template.networkUsage.orgSizes.map((size, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs text-gray-900">{size.label}</span>
                  <span className="text-xs font-bold text-gray-900">{size.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">By Region</div>
            <div className="space-y-2">
              {template.networkUsage.regions.map((region, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs text-gray-900">{region.name}</span>
                  <span className="text-xs font-bold text-gray-900">{region.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-extrabold text-gray-900 mb-4">Community Reviews</h3>
        <div className="space-y-3">
          {template.reviews.map((review) => (
            <div key={review.id} className="bg-gray-100 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-bold text-gray-900">{review.orgIndustry}</div>
                  <div className="text-xs text-gray-600">{review.orgSize} · {review.timeAgo}</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-900">{review.comment}</p>
              <div className="mt-2 text-xs font-bold text-green-700">
                Click rate reduced by {Math.abs(review.clickRateReduction)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex gap-3">
          <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            <Zap size={18} />
            Deploy Template
          </button>
          <button className="px-6 py-3 bg-white hover:bg-gray-50 rounded-xl font-bold text-gray-900 transition-colors border border-gray-200">
            Customize
          </button>
          <button className="px-6 py-3 bg-white hover:bg-gray-50 rounded-xl font-bold text-gray-900 transition-colors border border-gray-200">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

// === Main Page Component ===

export default function TemplateMarketplace() {
  const [selectedTemplate, setSelectedTemplate] = useState<MarketplaceTemplate | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    channel: 'all',
    source: 'all',
    search: '',
    sort: 'popularity',
  });

  const filteredTemplates = useMemo(() => {
    let result = [...allTemplates];

    if (filters.channel !== 'all') {
      result = result.filter(t => t.attackChannel === filters.channel);
    }
    if (filters.source !== 'all') {
      result = result.filter(t => t.author.type === filters.source);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.includes(q)) ||
        t.author.name.toLowerCase().includes(q)
      );
    }

    switch (filters.sort) {
      case 'popularity': result.sort((a, b) => b.networkUsage.totalOrganizations - a.networkUsage.totalOrganizations); break;
      case 'effectiveness': result.sort((a, b) => b.effectiveness.avgClickRate - a.effectiveness.avgClickRate); break;
      case 'newest': result.sort((a, b) => b.id - a.id); break;
      case 'rating': result.sort((a, b) => b.avgRating - a.avgRating); break;
      case 'difficulty': result.sort((a, b) => a.difficulty - b.difficulty); break;
    }

    return result;
  }, [filters]);

  const totalTemplates = allTemplates.length;
  const communityCount = allTemplates.filter(t => t.author.type === 'community').length;
  const avgClickRate = (allTemplates.reduce((acc, t) => acc + t.effectiveness.avgClickRate, 0) / allTemplates.length).toFixed(1);
  const totalOrgs = allTemplates.reduce((acc, t) => acc + t.networkUsage.totalOrganizations, 0);

  const channelTabs: { key: AttackChannel | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'email', label: 'Email' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'vishing', label: 'Vishing' },
    { key: 'sms', label: 'SMS' },
    { key: 'qr-code', label: 'QR Code' },
    { key: 'multi-channel', label: 'Multi-Channel' },
  ];

  const getChannelCount = (key: AttackChannel | 'all') => {
    if (key === 'all') return allTemplates.length;
    return allTemplates.filter(t => t.attackChannel === key).length;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />

      <div className="flex-1 flex flex-col relative">
        {/* Purple gradient overlay */}
        <div
          className="absolute top-0 left-0 w-[600px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 0% 0%, rgba(192, 132, 252, 0.4) 0%, rgba(192, 132, 252, 0.2) 30%, rgba(192, 132, 252, 0.05) 50%, transparent 70%)',
          }}
        />

        <div className="flex-1 overflow-y-auto px-8 py-8 relative z-10">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-5xl font-black text-gray-900">Template Marketplace</h1>
              <p className="text-xs text-gray-900 mt-2">Simulation templates powered by the SoSafe network · Curated by experts and validated by {totalOrgs.toLocaleString()}+ organizations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg">
                <Sparkles size={14} className="text-gray-900" />
                <span className="text-sm font-bold text-gray-900">4</span>
                <span className="text-xs text-gray-900">new this week</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
              <div className="p-2.5 rounded-xl bg-white w-fit mb-3">
                <FileText size={20} className="text-gray-900" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalTemplates}</div>
              <div className="text-sm font-bold text-gray-600 mt-1">Total Templates</div>
              <div className="text-xs text-gray-500 mt-1">Across all channels</div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
              <div className="p-2.5 rounded-xl bg-white w-fit mb-3">
                <Globe size={20} className="text-gray-900" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{communityCount}</div>
              <div className="text-sm font-bold text-gray-600 mt-1">Community Contributed</div>
              <div className="text-xs text-gray-500 mt-1">Network validated</div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
              <div className="p-2.5 rounded-xl bg-white w-fit mb-3">
                <TrendingUp size={20} className="text-gray-900" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{avgClickRate}%</div>
              <div className="text-sm font-bold text-gray-600 mt-1">Avg Click Rate</div>
              <div className="text-xs text-gray-500 mt-1">Across all templates</div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
              <div className="p-2.5 rounded-xl bg-white w-fit mb-3">
                <Users size={20} className="text-gray-900" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalOrgs.toLocaleString()}</div>
              <div className="text-sm font-bold text-gray-600 mt-1">Organizations Active</div>
              <div className="text-xs text-gray-500 mt-1">Across the network</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={filters.search}
                  onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Source toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                {([['all', 'All Sources'], ['sosafe-curated', 'SoSafe Curated'], ['community', 'Community']] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFilters(f => ({ ...f, source: key }))}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                      filters.source === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={filters.sort}
                onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value as SortOption }))}
                className="bg-gray-100 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="popularity">Most Popular</option>
                <option value="effectiveness">Highest Click Rate</option>
                <option value="newest">Newest</option>
                <option value="rating">Top Rated</option>
                <option value="difficulty">Easiest First</option>
              </select>
            </div>

            {/* Channel tabs */}
            <div className="flex gap-2">
              {channelTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilters(f => ({ ...f, channel: tab.key }))}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                    filters.channel === tab.key
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5 text-xs opacity-70">{getChannelCount(tab.key)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          {selectedTemplate ? (
            <div className="grid grid-cols-3 gap-6">
              {/* Compact list */}
              <div className="col-span-1">
                <div className="space-y-3 max-h-[calc(100vh-420px)] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {filteredTemplates.map(t => (
                    <TemplateCardCompact
                      key={t.id}
                      template={t}
                      onClick={() => setSelectedTemplate(t)}
                      isActive={selectedTemplate.id === t.id}
                    />
                  ))}
                </div>
              </div>

              {/* Detail panel */}
              <div className="col-span-2">
                <TemplateDetailPanel template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filteredTemplates.map(t => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  onClick={() => setSelectedTemplate(t)}
                  isActive={false}
                />
              ))}
              {filteredTemplates.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No templates found</h3>
                  <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
