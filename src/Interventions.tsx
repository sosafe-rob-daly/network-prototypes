import React from 'react';
import { TrendingUp, Users, Clock, Target, CheckCircle, ArrowRight, Lightbulb, BarChart3, Zap, LucideIcon } from 'lucide-react';
import Sidebar from './Sidebar';

// Type definitions
type InterventionCategory = 'training' | 'nudge' | 'simulation' | 'mixed';
type ConfidenceLevel = 'high' | 'medium' | 'low';

interface Intervention {
  id: number;
  name: string;
  category: InterventionCategory;
  description: string;
  effectiveness: number; // percentage improvement
  timeToImpact: string;
  sampleSize: number;
  confidence: ConfidenceLevel;
  targetedRoles?: string[];
  components: string[];
  matchScore: number; // how well it matches user's org profile
}

interface OrgProfile {
  size: string;
  industry: string;
  cultureScore: number;
  currentHSI: number;
}

// Mock organization profile
const orgProfile: OrgProfile = {
  size: '500-2000 employees',
  industry: 'Financial Services',
  cultureScore: 42,
  currentHSI: 68,
};

// Mock interventions data
const interventions: Intervention[] = [
  {
    id: 1,
    name: 'Sofie AI Nudges + Role-Specific Training',
    category: 'mixed',
    description: 'Adaptive AI-driven behavioral nudges combined with targeted role-based security training modules',
    effectiveness: 34,
    timeToImpact: '8 weeks',
    sampleSize: 847,
    confidence: 'high',
    targetedRoles: ['Finance', 'HR', 'Executive'],
    components: ['Sofie Nudges (Daily)', 'Role-Based Modules', 'Phishing Simulations'],
    matchScore: 96,
  },
  {
    id: 2,
    name: 'High-Frequency Micro-Learning',
    category: 'training',
    description: '5-minute daily security awareness sessions delivered via Slack/Teams with gamification',
    effectiveness: 28,
    timeToImpact: '6 weeks',
    sampleSize: 1203,
    confidence: 'high',
    targetedRoles: ['All Employees'],
    components: ['Daily Micro-Lessons', 'Gamification', 'Peer Challenges'],
    matchScore: 89,
  },
  {
    id: 3,
    name: 'Contextual Phishing Simulations',
    category: 'simulation',
    description: 'Industry-specific phishing scenarios with immediate educational feedback',
    effectiveness: 22,
    timeToImpact: '10 weeks',
    sampleSize: 2156,
    confidence: 'high',
    targetedRoles: ['All Employees'],
    components: ['Bi-weekly Simulations', 'Instant Feedback', 'Remediation Training'],
    matchScore: 84,
  },
  {
    id: 4,
    name: 'Security Champion Network',
    category: 'mixed',
    description: 'Peer-led security advocacy program with trained champions in each department',
    effectiveness: 31,
    timeToImpact: '12 weeks',
    sampleSize: 534,
    confidence: 'medium',
    targetedRoles: ['Department Leaders'],
    components: ['Champion Training', 'Monthly Workshops', 'Peer Support'],
    matchScore: 78,
  },
  {
    id: 5,
    name: 'Executive-Led Culture Change',
    category: 'training',
    description: 'Top-down culture transformation with executive messaging and visible commitment',
    effectiveness: 19,
    timeToImpact: '16 weeks',
    sampleSize: 342,
    confidence: 'medium',
    targetedRoles: ['Leadership', 'Executives'],
    components: ['Executive Training', 'Town Halls', 'Policy Updates'],
    matchScore: 71,
  },
];

const MatchBadge: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 90 ? 'bg-green-100 text-gray-900 border-green-200'
    : score >= 80 ? 'bg-yellow-100 text-gray-900 border-yellow-200'
    : 'bg-gray-100 text-gray-900 border-gray-200';

  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${color}`}>
      {score}% Match
    </span>
  );
};

const ConfidenceBadge: React.FC<{ level: ConfidenceLevel }> = ({ level }) => {
  const config = {
    high: { label: 'High Confidence', color: 'text-gray-900 bg-green-100 border-green-200' },
    medium: { label: 'Medium Confidence', color: 'text-gray-900 bg-yellow-100 border-yellow-200' },
    low: { label: 'Low Confidence', color: 'text-gray-900 bg-orange-100 border-orange-200' },
  };

  const { label, color } = config[level];

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${color}`}>
      <Target size={12} />
      {label}
    </span>
  );
};

const InterventionCard: React.FC<{ intervention: Intervention; isTop?: boolean }> = ({ intervention, isTop = false }) => {
  const categoryIcons: Record<InterventionCategory, LucideIcon> = {
    training: BarChart3,
    nudge: Lightbulb,
    simulation: Zap,
    mixed: TrendingUp,
  };

  const CategoryIcon = categoryIcons[intervention.category];

  return (
    <div className={`bg-white rounded-2xl p-6 hover:shadow-sm transition-all ${
      isTop ? 'bg-gradient-to-br from-blue-50 to-gray-100 border-2 border-blue-200' : 'border border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-3 rounded-xl bg-gray-100">
            <CategoryIcon size={24} className="text-gray-900" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-extrabold text-gray-900">{intervention.name}</h3>
              {isTop && (
                <span className="text-xs font-bold text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                  RECOMMENDED
                </span>
              )}
            </div>
            <p className="text-xs text-gray-900">{intervention.description}</p>
          </div>
        </div>
        <MatchBadge score={intervention.matchScore} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-100 rounded-xl p-3">
          <div className="text-2xl font-bold text-gray-900">+{intervention.effectiveness}%</div>
          <div className="text-xs text-gray-900 font-medium mt-1">HSI Improvement</div>
        </div>
        <div className="bg-gray-100 rounded-xl p-3">
          <div className="text-2xl font-bold text-gray-900">{intervention.timeToImpact}</div>
          <div className="text-xs text-gray-900 font-medium mt-1">Time to Impact</div>
        </div>
        <div className="bg-gray-100 rounded-xl p-3">
          <div className="text-2xl font-bold text-gray-900">{intervention.sampleSize.toLocaleString()}</div>
          <div className="text-xs text-gray-900 font-medium mt-1">Organizations</div>
        </div>
        <div className="bg-gray-100 rounded-xl p-3">
          <div className="text-2xl font-bold text-gray-900">{Math.round(intervention.effectiveness * 1.5)}</div>
          <div className="text-xs text-gray-900 font-medium mt-1">Expected ROI</div>
        </div>
      </div>

      {/* Components */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Includes
        </div>
        <div className="flex flex-wrap gap-2">
          {intervention.components.map((component, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full"
            >
              <CheckCircle size={12} className="text-gray-500" />
              {component}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <ConfidenceBadge level={intervention.confidence} />
          {intervention.targetedRoles && (
            <span className="text-xs text-gray-900">
              Target: {intervention.targetedRoles.join(', ')}
            </span>
          )}
        </div>
        <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors">
          Apply Playbook
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

const ProfileCard: React.FC<{ profile: OrgProfile }> = ({ profile }) => {
  return (
    <div className="bg-gray-100 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users size={20} className="text-gray-900" />
        <h3 className="font-extrabold text-lg text-gray-900">Your Organization Profile</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-600 mb-1">Organization Size</div>
          <div className="font-bold text-gray-900">{profile.size}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Industry</div>
          <div className="font-bold text-gray-900">{profile.industry}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Security Culture Score</div>
          <div className="font-bold text-gray-900">{profile.cultureScore}/100</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Current HSI</div>
          <div className="font-bold text-gray-900">{profile.currentHSI}/100</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-900">
          Recommendations are personalized based on outcomes from organizations with similar profiles in the SoSafe network.
        </p>
      </div>
    </div>
  );
};

// Benchmark Comparison Component
const BenchmarkComparison: React.FC = () => {
  const metrics = [
    { label: 'Click Rate', you: 12.4, cohortAvg: 9.2, topQuartile: 5.1, unit: '%', better: 'lower' },
    { label: 'Reporting Rate', you: 34, cohortAvg: 28, topQuartile: 52, unit: '%', better: 'higher' },
    { label: 'Training Completion', you: 78, cohortAvg: 82, topQuartile: 94, unit: '%', better: 'higher' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-extrabold text-gray-900 mb-2">Network Benchmark</h3>
      <p className="text-xs text-gray-900 mb-4">500-2000 employees, Financial Services, DACH region</p>

      <div className="space-y-4">
        {metrics.map((metric, idx) => {
          const isGood = metric.better === 'lower'
            ? metric.you < metric.cohortAvg
            : metric.you > metric.cohortAvg;
          return (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gray-900">{metric.label}</span>
                <span className="text-xs font-medium text-gray-900">
                  {isGood ? '↑ Above avg' : '↓ Below avg'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${isGood ? 'bg-gray-400' : 'bg-gray-300'}`}
                    style={{ width: `${Math.min((metric.you / metric.topQuartile) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-900">
                <span>You: <span className="font-bold">{metric.you}{metric.unit}</span></span>
                <span>Avg: {metric.cohortAvg}{metric.unit}</span>
                <span>Top: {metric.topQuartile}{metric.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-900">
          Organizations like yours who deployed the top playbook saw <span className="font-bold">+34% HSI improvement</span> on average.
        </p>
      </div>
    </div>
  );
};

// Signal Chain Funnel Component
const SignalChainFunnel: React.FC = () => {
  const stages = [
    { label: 'Sent', you: 1247, benchmark: 1200, trend: 'up' },
    { label: 'Delivered', you: 1198, benchmark: 1150, trend: 'up' },
    { label: 'Opened', you: 892, benchmark: 850, trend: 'up' },
    { label: 'Reported', you: 312, benchmark: 238, trend: 'up', isPositive: true },
    { label: 'Clicked', you: 156, benchmark: 132, trend: 'down', isNegative: true },
    { label: 'Landed', you: 98, benchmark: 84, trend: 'down', isNegative: true },
    { label: 'Data Entry', you: 23, benchmark: 31, trend: 'up' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-extrabold text-gray-900 mb-2">Signal Chain Analysis</h3>
      <p className="text-xs text-gray-600 mb-4">Your phishing simulation funnel vs network</p>

      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const widthPercent = Math.max(20, 100 - (idx * 12));
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-16 text-xs font-bold text-gray-900">{stage.label}</div>
              <div className="flex-1">
                <div
                  className={`h-6 rounded-lg flex items-center justify-end px-2 ${
                    stage.isPositive ? 'bg-green-100' : stage.isNegative ? 'bg-red-100' : 'bg-gray-100'
                  }`}
                  style={{ width: `${widthPercent}%` }}
                >
                  <span className="text-xs font-bold text-gray-900">{stage.you}</span>
                </div>
              </div>
              <div className="w-12 text-xs text-gray-600 text-right">
                <span className={stage.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {stage.trend === 'up' ? '↑' : '↓'}
                </span>
                {' '}{stage.benchmark}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-teal-50 rounded-xl">
        <p className="text-xs text-teal-800">
          <span className="font-bold">Target intervention:</span> The recommended playbook specifically targets the <span className="font-bold">Clicked → Landed</span> conversion, where your cohort underperforms.
        </p>
      </div>
    </div>
  );
};

export default function Interventions() {

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
          <div className="mb-8">
            <h1 className="text-5xl font-black text-gray-900">Intervention Playbook</h1>
            <p className="text-xs text-gray-900 mt-2">Evidence-based recommendations from the SoSafe network • Based on {interventions.reduce((acc, i) => acc + i.sampleSize, 0).toLocaleString()} organizations</p>
          </div>
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-white">
                  <TrendingUp size={20} className="text-gray-900" />
                </div>
                <span className="text-xs font-medium text-gray-900 bg-green-100 px-2.5 py-1 rounded-full border border-green-200">
                  Best Match
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">+34%</div>
              <div className="text-sm text-gray-600 mt-1">Average HSI Lift</div>
              <div className="text-xs text-gray-500 mt-1">Top recommendation</div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
              <div className="p-2.5 rounded-xl bg-white w-fit mb-3">
                <Clock size={20} className="text-gray-900" />
              </div>
              <div className="text-3xl font-bold text-gray-900">8 weeks</div>
              <div className="text-sm text-gray-600 mt-1">Fastest Impact</div>
              <div className="text-xs text-gray-500 mt-1">Median time to results</div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
              <div className="p-2.5 rounded-xl bg-white w-fit mb-3">
                <Users size={20} className="text-gray-900" />
              </div>
              <div className="text-3xl font-bold text-gray-900">847</div>
              <div className="text-sm text-gray-600 mt-1">Similar Organizations</div>
              <div className="text-xs text-gray-500 mt-1">In your cohort</div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
              <div className="p-2.5 rounded-xl bg-white w-fit mb-3">
                <Target size={20} className="text-gray-900" />
              </div>
              <div className="text-3xl font-bold text-gray-900">96%</div>
              <div className="text-sm text-gray-600 mt-1">Match Confidence</div>
              <div className="text-xs text-gray-500 mt-1">Statistical significance</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-3 gap-6">
            {/* Interventions List */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-extrabold text-gray-900">Recommended Interventions</h2>
                <span className="text-xs text-gray-900">Ranked by effectiveness for your profile</span>
              </div>

              {interventions.map((intervention, idx) => (
                <InterventionCard
                  key={intervention.id}
                  intervention={intervention}
                  isTop={idx === 0}
                />
              ))}
            </div>

            {/* Sidebar */}
            <div className="col-span-1 space-y-4">
              <ProfileCard profile={orgProfile} />

              <BenchmarkComparison />

              <SignalChainFunnel />

              <div className="bg-gray-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={18} className="text-gray-900" />
                  <h3 className="font-extrabold text-gray-900">Success Story</h3>
                </div>
                <p className="text-xs text-gray-900 mb-3">
                  A 1,200-employee financial services firm with a 45 Culture score deployed the top playbook and achieved a <strong>+38% HSI improvement</strong> in 9 weeks.
                </p>
                <button className="text-sm text-gray-900 font-bold hover:underline">
                  Read full case study →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
