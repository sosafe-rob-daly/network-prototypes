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
  const color = score >= 90 ? 'bg-green-100 text-green-700 border-green-200'
    : score >= 80 ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
    : 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${color}`}>
      {score}% Match
    </span>
  );
};

const ConfidenceBadge: React.FC<{ level: ConfidenceLevel }> = ({ level }) => {
  const config = {
    high: { label: 'High Confidence', color: 'text-green-700 bg-green-50 border-green-200' },
    medium: { label: 'Medium Confidence', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
    low: { label: 'Low Confidence', color: 'text-orange-700 bg-orange-50 border-orange-200' },
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
    <div className={`bg-white rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-all ${
      isTop ? 'ring-2 ring-purple-200 shadow-md' : 'shadow-sm'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50">
            <CategoryIcon size={24} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{intervention.name}</h3>
              {isTop && (
                <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  RECOMMENDED
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{intervention.description}</p>
          </div>
        </div>
        <MatchBadge score={intervention.matchScore} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
          <div className="text-2xl font-bold text-green-700">+{intervention.effectiveness}%</div>
          <div className="text-xs text-green-600 font-medium mt-1">HSI Improvement</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
          <div className="text-2xl font-bold text-blue-700">{intervention.timeToImpact}</div>
          <div className="text-xs text-blue-600 font-medium mt-1">Time to Impact</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-3 border border-purple-100">
          <div className="text-2xl font-bold text-purple-700">{intervention.sampleSize.toLocaleString()}</div>
          <div className="text-xs text-purple-600 font-medium mt-1">Organizations</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100">
          <div className="text-2xl font-bold text-orange-700">{Math.round(intervention.effectiveness * 1.5)}</div>
          <div className="text-xs text-orange-600 font-medium mt-1">Expected ROI</div>
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
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <ConfidenceBadge level={intervention.confidence} />
          {intervention.targetedRoles && (
            <span className="text-xs text-gray-500">
              Target: {intervention.targetedRoles.join(', ')}
            </span>
          )}
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-xl font-medium text-sm hover:shadow-lg transition-all">
          Apply Playbook
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

const ProfileCard: React.FC<{ profile: OrgProfile }> = ({ profile }) => {
  return (
    <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Users size={20} />
        <h3 className="font-semibold text-lg">Your Organization Profile</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-purple-200 text-xs mb-1">Organization Size</div>
          <div className="font-semibold">{profile.size}</div>
        </div>
        <div>
          <div className="text-purple-200 text-xs mb-1">Industry</div>
          <div className="font-semibold">{profile.industry}</div>
        </div>
        <div>
          <div className="text-purple-200 text-xs mb-1">Security Culture Score</div>
          <div className="font-semibold">{profile.cultureScore}/100</div>
        </div>
        <div>
          <div className="text-purple-200 text-xs mb-1">Current HSI</div>
          <div className="font-semibold">{profile.currentHSI}/100</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-purple-400/30">
        <p className="text-purple-100 text-sm">
          Recommendations are personalized based on outcomes from organizations with similar profiles in the SoSafe network.
        </p>
      </div>
    </div>
  );
};

export default function Interventions() {

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200/50">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  <span className="hover:underline cursor-pointer">Network</span>
                  <span className="mx-2">/</span>
                  <span className="text-gray-900 font-medium">Interventions</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Intervention Playbook</h1>
                <p className="text-sm text-gray-600 mt-1">Evidence-based recommendations from the SoSafe network</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Based on</span>
                <span className="text-sm font-semibold text-purple-600">{interventions.reduce((acc, i) => acc + i.sampleSize, 0).toLocaleString()} organizations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-200/50 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <div className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                  Best Match
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">+34%</div>
              <div className="text-sm text-gray-600 mt-1">Average HSI Lift</div>
              <div className="text-xs text-gray-500 mt-1">Top recommendation</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200/50 shadow-sm">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 w-fit mb-3">
                <Clock size={20} className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">8 weeks</div>
              <div className="text-sm text-gray-600 mt-1">Fastest Impact</div>
              <div className="text-xs text-gray-500 mt-1">Median time to results</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200/50 shadow-sm">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 w-fit mb-3">
                <Users size={20} className="text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">847</div>
              <div className="text-sm text-gray-600 mt-1">Similar Organizations</div>
              <div className="text-xs text-gray-500 mt-1">In your cohort</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200/50 shadow-sm">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 w-fit mb-3">
                <Target size={20} className="text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">96%</div>
              <div className="text-sm text-gray-600 mt-1">Match Confidence</div>
              <div className="text-xs text-gray-500 mt-1">Statistical significance</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-3 gap-6">
            {/* Interventions List */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">Recommended Interventions</h2>
                <span className="text-sm text-gray-500">Ranked by effectiveness for your profile</span>
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

              <div className="bg-white rounded-2xl border border-gray-200/50 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Profile Matching</div>
                      <div className="text-xs text-gray-600 mt-1">We analyze organizations similar to yours across size, industry, and maturity</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Outcome Analysis</div>
                      <div className="text-xs text-gray-600 mt-1">Track what interventions drove measurable HSI improvements</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Personalized Ranking</div>
                      <div className="text-xs text-gray-600 mt-1">Surface interventions with proven track records in your cohort</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={18} className="text-green-600" />
                  <h3 className="font-semibold text-green-900">Success Story</h3>
                </div>
                <p className="text-sm text-green-800 mb-3">
                  A 1,200-employee financial services firm with a 45 Culture score deployed the top playbook and achieved a <strong>+38% HSI improvement</strong> in 9 weeks.
                </p>
                <button className="text-sm text-green-700 font-medium hover:underline">
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
