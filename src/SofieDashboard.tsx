import React, { useState } from 'react';
import { MessageCircle, Users, Send, Eye, MousePointer, Clock, TrendingUp, Zap, Globe, Shield, ExternalLink } from 'lucide-react';
import Sidebar from './Sidebar';

// Types
interface NudgeTemplate {
  id: number;
  title: string;
  preview: string;
  interactionRate: number;
  hsiCorrelation: string;
  usedBy: number;
  category: 'top_performing' | 'threat_triggered' | 'contextual';
  triggerType?: string;
}

interface MessageStats {
  sent: number;
  delivered: number;
  opened: number;
  interacted: number;
}

// Mock data
const nudgeTemplates: NudgeTemplate[] = [
  {
    id: 1,
    title: 'Suspicious Link Warning',
    preview: 'Before you click: This link leads to an unfamiliar website. Remember to verify the sender.',
    interactionRate: 67,
    hsiCorrelation: '+8.4% HSI',
    usedBy: 1847,
    category: 'top_performing',
  },
  {
    id: 2,
    title: 'Wire Transfer Reminder',
    preview: 'Processing a wire transfer? Always verify the request via a separate channel before proceeding.',
    interactionRate: 72,
    hsiCorrelation: '+12.1% HSI',
    usedBy: 923,
    category: 'top_performing',
  },
  {
    id: 3,
    title: 'DocuSign Alert',
    preview: 'Network Alert: DocuSign-themed phishing detected across 12 organizations. Extra caution advised.',
    interactionRate: 89,
    hsiCorrelation: '+15.2% HSI',
    usedBy: 2341,
    category: 'threat_triggered',
    triggerType: 'Real-time network threat',
  },
  {
    id: 4,
    title: 'Invoice Scam Warning',
    preview: 'A new invoice-based attack pattern has been detected. Verify all payment requests directly.',
    interactionRate: 78,
    hsiCorrelation: '+11.8% HSI',
    usedBy: 1456,
    category: 'threat_triggered',
    triggerType: 'Network threat detected 4 hours ago',
  },
  {
    id: 5,
    title: 'Uncategorized Domain Alert',
    preview: 'This website hasn\'t been classified yet. If you weren\'t expecting to visit here, proceed carefully.',
    interactionRate: 54,
    hsiCorrelation: '+6.2% HSI',
    usedBy: 847,
    category: 'contextual',
    triggerType: 'Guardian: uncategorized domain visit',
  },
  {
    id: 6,
    title: 'File Download Caution',
    preview: 'You\'re about to download a file from an external source. Verify it\'s from a trusted sender.',
    interactionRate: 61,
    hsiCorrelation: '+7.9% HSI',
    usedBy: 1123,
    category: 'contextual',
    triggerType: 'Guardian: file download detected',
  },
];

const weeklyStats: MessageStats[] = [
  { sent: 12847, delivered: 12654, opened: 8921, interacted: 4287 },
  { sent: 13421, delivered: 13198, opened: 9456, interacted: 4621 },
  { sent: 14032, delivered: 13812, opened: 9812, interacted: 4892 },
  { sent: 13789, delivered: 13567, opened: 9234, interacted: 4534 },
  { sent: 14521, delivered: 14289, opened: 10123, interacted: 5067 },
  { sent: 15234, delivered: 14987, opened: 10567, interacted: 5289 },
  { sent: 14876, delivered: 14623, opened: 10234, interacted: 5123 },
];

const StatCard: React.FC<{
  icon: React.ElementType;
  value: string;
  label: string;
  sublabel?: string;
  trend?: { value: string; positive: boolean };
}> = ({ icon: Icon, value, label, sublabel, trend }) => (
  <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
    <div className="flex items-start justify-between mb-3">
      <div className="p-2.5 rounded-xl bg-white">
        <Icon size={20} className="text-gray-900" />
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-md ${
          trend.positive ? 'bg-green-100 text-gray-900 border border-green-200' : 'bg-red-100 text-gray-900 border border-red-200'
        }`}>
          {trend.value}
        </span>
      )}
    </div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-600 mt-1">{label}</div>
    {sublabel && <div className="text-xs text-gray-500 mt-1">{sublabel}</div>}
  </div>
);

const NudgeCard: React.FC<{ nudge: NudgeTemplate }> = ({ nudge }) => {
  const categoryColors = {
    top_performing: 'bg-gray-200 text-gray-600 border-gray-300',
    threat_triggered: 'bg-gray-200 text-gray-600 border-gray-300',
    contextual: 'bg-gray-200 text-gray-600 border-gray-300',
  };

  const categoryLabels = {
    top_performing: 'Top Performer',
    threat_triggered: 'Threat-Triggered',
    contextual: 'Contextual',
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{nudge.title}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[nudge.category]}`}>
              {categoryLabels[nudge.category]}
            </span>
          </div>
          {nudge.triggerType && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Zap size={12} />
              {nudge.triggerType}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm text-gray-700 italic">
        "{nudge.preview}"
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-lg font-bold text-gray-900">{nudge.interactionRate}%</div>
          <div className="text-xs text-gray-500">Interaction</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-600">{nudge.hsiCorrelation}</div>
          <div className="text-xs text-gray-500">HSI Impact</div>
        </div>
        <div>
          <div className="text-lg font-bold text-purple-600">{nudge.usedBy.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Orgs Using</div>
        </div>
      </div>
    </div>
  );
};

const MessageDeliveryChart: React.FC = () => {
  const maxValue = Math.max(...weeklyStats.map(s => s.sent));
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">Message Delivery & Interaction</h3>
          <p className="text-xs text-gray-500">Last 7 days across your organization</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-purple-500" />
            <span>Sent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-purple-300" />
            <span>Opened</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-teal-500" />
            <span>Interacted</span>
          </div>
        </div>
      </div>

      <div className="h-48 flex items-end gap-2">
        {weeklyStats.map((stat, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '180px' }}>
              <div
                className="w-full bg-purple-500 rounded-t"
                style={{ height: `${(stat.sent / maxValue) * 100}%` }}
              />
              <div
                className="w-full bg-purple-300 rounded"
                style={{ height: `${(stat.opened / maxValue) * 100}%`, marginTop: '-4px' }}
              />
              <div
                className="w-full bg-teal-500 rounded-b"
                style={{ height: `${(stat.interacted / maxValue) * 100}%`, marginTop: '-4px' }}
              />
            </div>
            <span className="text-xs text-gray-500">{days[idx]}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>Network Benchmark: 31% interaction rate</span>
        <span className="text-green-600 font-medium">You: 34% (+3% above avg)</span>
      </div>
    </div>
  );
};

const GuardianInterceptPreview: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Globe size={20} className="text-gray-900" />
        <h3 className="text-lg font-extrabold text-gray-900">Sofie + Guardian Integration</h3>
        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium ml-auto">Browser Extension</span>
      </div>

      {/* Mock Browser */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
        {/* Browser Chrome */}
        <div className="bg-gray-100 px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600 ml-4">
            suspicious-domain-example.net/login
          </div>
        </div>

        {/* Page Content with Overlay */}
        <div className="relative bg-gray-50 h-48">
          {/* Dimmed background */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Sofie Intercept Modal */}
          <div className="absolute inset-x-4 top-6 bg-white rounded-xl shadow-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <MessageCircle size={20} className="text-gray-900" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">Sofie Security Alert</div>
                <p className="text-sm text-gray-600 mb-3">
                  This website hasn't been categorized yet. If you weren't expecting to visit here, I'd recommend caution.
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg">
                    Learn More
                  </button>
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
                    Continue Anyway
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">342</div>
          <div className="text-xs text-gray-500">Intercepts This Week</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-teal-600">28%</div>
          <div className="text-xs text-gray-500">Click-through to Learning</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">94%</div>
          <div className="text-xs text-gray-500">Heeded Warning</div>
        </div>
      </div>

      {/* Network context */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
        <Shield size={14} />
        <span>Intercept messages optimized based on <strong className="text-gray-700">847 organizations</strong> using Guardian + Sofie</span>
      </div>
    </div>
  );
};

export default function SofieDashboard() {
  const [activeTab, setActiveTab] = useState<'all' | 'top_performing' | 'threat_triggered' | 'contextual'>('all');

  const filteredNudges = activeTab === 'all'
    ? nudgeTemplates
    : nudgeTemplates.filter(n => n.category === activeTab);

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
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-5xl font-black text-gray-900">Sofie Network</h1>
              <p className="text-xs text-gray-900 mt-2">Network-powered nudges and contextual security messaging</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-gray-600">Network Status</div>
                <div className="text-sm font-semibold text-green-600">All Systems Active</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <StatCard
              icon={Users}
              value="4,247"
              label="Organizations"
              sublabel="Sofie deployed"
              trend={{ value: '+127 this month', positive: true }}
            />
            <StatCard
              icon={Send}
              value="89,432"
              label="Messages Sent"
              sublabel="Last 24 hours"
            />
            <StatCard
              icon={MousePointer}
              value="34%"
              label="Interaction Rate"
              sublabel="vs 31% network avg"
              trend={{ value: '+3%', positive: true }}
            />
            <StatCard
              icon={Eye}
              value="2.1%"
              label="Muted Rate"
              sublabel="Industry low"
              trend={{ value: '-0.4%', positive: true }}
            />
            <StatCard
              icon={Clock}
              value="4.2s"
              label="Avg Response Time"
              sublabel="User engagement"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Chart and Guardian */}
            <div className="col-span-2 space-y-6">
              <MessageDeliveryChart />
              <GuardianInterceptPreview />
            </div>

            {/* Right Column - Nudge Library */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-gray-900">Network Nudge Library</h2>
                <button className="text-xs text-purple-600 font-medium flex items-center gap-1 hover:underline">
                  View All <ExternalLink size={12} />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'top_performing', label: 'Top' },
                  { key: 'threat_triggered', label: 'Threats' },
                  { key: 'contextual', label: 'Contextual' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      activeTab === tab.key
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Nudge Cards */}
              <div className="space-y-3">
                {filteredNudges.slice(0, 4).map(nudge => (
                  <NudgeCard key={nudge.id} nudge={nudge} />
                ))}
              </div>

              {/* Network Context Card */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp size={16} className="text-gray-900" />
                  </div>
                  <div>
                    <div className="font-semibold text-purple-900 text-sm mb-1">Network Intelligence</div>
                    <p className="text-xs text-purple-700">
                      Nudge effectiveness optimized across <strong>2.4M interactions</strong> this month.
                      Templates auto-updated based on real threat patterns.
                    </p>
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
