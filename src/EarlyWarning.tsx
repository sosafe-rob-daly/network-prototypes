import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Clock, Zap, Target, Shield, ChevronRight, Activity } from 'lucide-react';
import Sidebar from './Sidebar';

// Type definitions
type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
type CohortType = 'department' | 'role' | 'custom';

interface RiskCohort {
  id: number;
  name: string;
  type: CohortType;
  size: number;
  currentHSI: number;
  trend: number; // percentage change
  riskLevel: RiskLevel;
  daysToAction: number;
  matchedPattern: {
    name: string;
    occurrences: number;
    avgDaysBeforeIncident: number;
    incidentType: string;
  };
  recommendation: {
    action: string;
    urgency: string;
    estimatedImpact: string;
  };
}

interface TrajectoryPoint {
  week: number;
  hsi: number;
  label?: string;
}

const cohorts: RiskCohort[] = [
  {
    id: 1,
    name: 'Finance Team',
    type: 'department',
    size: 23,
    currentHSI: 58,
    trend: -12,
    riskLevel: 'critical',
    daysToAction: 3,
    matchedPattern: {
      name: 'Pre-BEC Attack Pattern',
      occurrences: 47,
      avgDaysBeforeIncident: 14,
      incidentType: 'Business Email Compromise',
    },
    recommendation: {
      action: 'Targeted BEC Simulation + Sofie Daily Nudges',
      urgency: 'Deploy this week',
      estimatedImpact: '+18% HSI in 2 weeks',
    },
  },
  {
    id: 2,
    name: 'Executive Leadership',
    type: 'role',
    size: 8,
    currentHSI: 64,
    trend: -8,
    riskLevel: 'high',
    daysToAction: 7,
    matchedPattern: {
      name: 'Credential Harvest Vulnerability',
      occurrences: 31,
      avgDaysBeforeIncident: 21,
      incidentType: 'Credential Theft',
    },
    recommendation: {
      action: 'Executive Security Briefing + MFA Enforcement',
      urgency: 'Deploy within 7 days',
      estimatedImpact: '+22% HSI in 3 weeks',
    },
  },
  {
    id: 3,
    name: 'New Hires (< 90 days)',
    type: 'custom',
    size: 34,
    currentHSI: 52,
    trend: -6,
    riskLevel: 'high',
    daysToAction: 10,
    matchedPattern: {
      name: 'Onboarding Gap Pattern',
      occurrences: 89,
      avgDaysBeforeIncident: 28,
      incidentType: 'Phishing Click-through',
    },
    recommendation: {
      action: 'Enhanced Onboarding Security Module',
      urgency: 'Deploy within 10 days',
      estimatedImpact: '+15% HSI in 4 weeks',
    },
  },
  {
    id: 4,
    name: 'HR Department',
    type: 'department',
    size: 12,
    currentHSI: 71,
    trend: -3,
    riskLevel: 'medium',
    daysToAction: 14,
    matchedPattern: {
      name: 'Data Exfiltration Precursor',
      occurrences: 18,
      avgDaysBeforeIncident: 35,
      incidentType: 'Insider Threat',
    },
    recommendation: {
      action: 'Data Handling Refresher + Monitoring',
      urgency: 'Deploy within 2 weeks',
      estimatedImpact: '+10% HSI in 3 weeks',
    },
  },
];

// Mock trajectory data
const generateTrajectory = (cohortId: number): { actual: TrajectoryPoint[], predicted: TrajectoryPoint[], network: TrajectoryPoint[] } => {
  const basePatterns = [
    // Finance (critical decline)
    {
      actual: [
        { week: -8, hsi: 78 },
        { week: -6, hsi: 74 },
        { week: -4, hsi: 68 },
        { week: -2, hsi: 62 },
        { week: 0, hsi: 58, label: 'Today' },
      ],
      predicted: [
        { week: 0, hsi: 58 },
        { week: 2, hsi: 54 },
        { week: 4, hsi: 48 },
      ],
      network: [
        { week: -8, hsi: 76 },
        { week: -6, hsi: 71 },
        { week: -4, hsi: 64 },
        { week: -2, hsi: 58 },
        { week: 0, hsi: 52 },
        { week: 2, hsi: 45, label: 'Avg Incident' },
      ],
    },
    // Executive (moderate decline)
    {
      actual: [
        { week: -8, hsi: 76 },
        { week: -6, hsi: 73 },
        { week: -4, hsi: 70 },
        { week: -2, hsi: 67 },
        { week: 0, hsi: 64, label: 'Today' },
      ],
      predicted: [
        { week: 0, hsi: 64 },
        { week: 2, hsi: 61 },
        { week: 4, hsi: 57 },
      ],
      network: [
        { week: -8, hsi: 74 },
        { week: -6, hsi: 70 },
        { week: -4, hsi: 65 },
        { week: -2, hsi: 60 },
        { week: 0, hsi: 55 },
        { week: 2, hsi: 49, label: 'Avg Incident' },
      ],
    },
  ];

  return cohortId === 1 ? basePatterns[0] : basePatterns[1];
};

const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const config = {
    critical: { label: 'Critical Risk', color: 'text-red-700 bg-red-50 border-red-300', icon: '🔴' },
    high: { label: 'High Risk', color: 'text-orange-700 bg-orange-50 border-orange-300', icon: '🟠' },
    medium: { label: 'Medium Risk', color: 'text-yellow-700 bg-yellow-50 border-yellow-300', icon: '🟡' },
    low: { label: 'Low Risk', color: 'text-green-700 bg-green-50 border-green-300', icon: '🟢' },
  };

  const { label, color, icon } = config[level];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${color}`}>
      <span>{icon}</span>
      {label}
    </span>
  );
};

const UrgencyCountdown: React.FC<{ days: number; riskLevel: RiskLevel }> = ({ days }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 rounded-xl p-4 text-white shadow-lg shadow-purple-300/50">
      <div className="flex items-center gap-3">
        <Clock size={24} className="animate-pulse" />
        <div>
          <div className="text-2xl font-bold">{days} Days</div>
          <div className="text-sm opacity-90">Recommended action window</div>
        </div>
      </div>
    </div>
  );
};

const CohortCard: React.FC<{ cohort: RiskCohort; onClick: () => void; isActive: boolean }> = ({ cohort, onClick, isActive }) => {
  const trendColor = cohort.trend < -10 ? 'text-red-600' : cohort.trend < -5 ? 'text-orange-600' : 'text-yellow-600';
  const trendIcon = cohort.trend < 0 ? '↓' : '↑';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all ${
        isActive ? 'ring-2 ring-purple-200 border-purple-200 shadow-lg' : 'border-gray-200/50 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{cohort.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{cohort.size} employees</p>
        </div>
        <RiskBadge level={cohort.riskLevel} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Current HSI</div>
          <div className="text-2xl font-bold text-gray-900">{cohort.currentHSI}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Trend (30d)</div>
          <div className={`text-2xl font-bold ${trendColor}`}>
            {trendIcon}{Math.abs(cohort.trend)}%
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-3 border border-red-100 mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-semibold text-red-900 mb-1">
              Pattern Match: {cohort.matchedPattern.name}
            </div>
            <div className="text-xs text-red-700">
              Seen in {cohort.matchedPattern.occurrences} orgs before {cohort.matchedPattern.incidentType}
            </div>
          </div>
        </div>
      </div>

      <button className="w-full flex items-center justify-between bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:shadow-lg transition-all">
        <span>{cohort.recommendation.action}</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const TrajectoryChart: React.FC<{ cohort: RiskCohort }> = ({ cohort }) => {
  const data = generateTrajectory(cohort.id);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/50 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Trajectory Analysis</h3>
        <p className="text-sm text-gray-600">
          Comparing {cohort.name} behavior pattern against {cohort.matchedPattern.occurrences} historical incidents
        </p>
      </div>

      {/* Chart visualization */}
      <div className="relative h-80 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 mb-4">
        <div className="absolute inset-0 p-6">
          {/* Y-axis labels */}
          <div className="absolute left-2 top-6 bottom-6 flex flex-col justify-between text-xs text-gray-500">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>

          {/* Chart area */}
          <div className="ml-8 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-t border-gray-200" />
              ))}
            </div>

            {/* Network pattern (historical incidents) - red dashed */}
            <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
              <polyline
                points={data.network.map((p) => {
                  const x = ((p.week + 8) / 12) * 100;
                  const y = 100 - p.hsi;
                  return `${x}%,${y}%`;
                }).join(' ')}
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray="8,4"
                opacity="0.6"
              />
              {data.network.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={`${((p.week + 8) / 12) * 100}%`}
                    cy={`${100 - p.hsi}%`}
                    r="4"
                    fill="#ef4444"
                    opacity="0.8"
                  />
                  {p.label && (
                    <text
                      x={`${((p.week + 8) / 12) * 100}%`}
                      y={`${100 - p.hsi - 8}%`}
                      textAnchor="middle"
                      className="text-xs font-semibold fill-red-600"
                    >
                      {p.label}
                    </text>
                  )}
                </g>
              ))}
            </svg>

            {/* Actual trajectory - solid purple */}
            <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
              <polyline
                points={data.actual.map((p) => {
                  const x = ((p.week + 8) / 12) * 100;
                  const y = 100 - p.hsi;
                  return `${x}%,${y}%`;
                }).join(' ')}
                fill="none"
                stroke="#9333ea"
                strokeWidth="3"
              />
              {data.actual.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={`${((p.week + 8) / 12) * 100}%`}
                    cy={`${100 - p.hsi}%`}
                    r="5"
                    fill="#9333ea"
                  />
                  {p.label && (
                    <text
                      x={`${((p.week + 8) / 12) * 100}%`}
                      y={`${100 - p.hsi + 20}%`}
                      textAnchor="middle"
                      className="text-xs font-semibold fill-purple-600"
                    >
                      {p.label}
                    </text>
                  )}
                </g>
              ))}
            </svg>

            {/* Predicted trajectory - dashed purple */}
            <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
              <polyline
                points={data.predicted.map((p) => {
                  const x = ((p.week + 8) / 12) * 100;
                  const y = 100 - p.hsi;
                  return `${x}%,${y}%`;
                }).join(' ')}
                fill="none"
                stroke="#9333ea"
                strokeWidth="3"
                strokeDasharray="6,4"
                opacity="0.5"
              />
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 translate-y-6">
              <span>-8 wks</span>
              <span>-6 wks</span>
              <span>-4 wks</span>
              <span>-2 wks</span>
              <span className="font-semibold text-purple-600">Today</span>
              <span>+2 wks</span>
              <span>+4 wks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-purple-600" />
          <span className="text-gray-700">Your cohort (actual)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-purple-600 opacity-50" style={{ borderTop: '3px dashed' }} />
          <span className="text-gray-700">Predicted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-red-500 opacity-60" style={{ borderTop: '3px dashed' }} />
          <span className="text-gray-700">Network incident pattern</span>
        </div>
      </div>

      {/* Pattern details */}
      <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
        <div className="flex items-start gap-3">
          <Activity size={20} className="text-red-600 mt-0.5" />
          <div>
            <div className="font-semibold text-red-900 mb-2">Pattern Analysis</div>
            <div className="text-sm text-red-800 space-y-1">
              <p>• Your cohort's trajectory closely matches the pre-incident pattern seen in {cohort.matchedPattern.occurrences} organizations</p>
              <p>• On average, incidents occurred {cohort.matchedPattern.avgDaysBeforeIncident} days after reaching your current HSI level</p>
              <p>• Without intervention, projected to reach critical threshold in {cohort.daysToAction + 7} days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EarlyWarning() {
  const [selectedCohort, setSelectedCohort] = useState<RiskCohort | null>(cohorts[0]);

  const criticalCount = cohorts.filter(c => c.riskLevel === 'critical').length;
  const highCount = cohorts.filter(c => c.riskLevel === 'high').length;

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
                  <span className="text-gray-900 font-medium">Early Warning</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Predictive Risk Cohorts</h1>
                <p className="text-sm text-gray-600 mt-1">Network-wide behavioral pattern matching for proactive risk mitigation</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Active Alerts</div>
                  <div className="text-2xl font-bold text-red-600">{criticalCount + highCount}</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-300" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-200/50 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-50 to-orange-50">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <RiskBadge level="critical" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{criticalCount}</div>
              <div className="text-sm text-gray-600 mt-1">Critical Risk Cohorts</div>
              <div className="text-xs text-gray-500 mt-1">Action needed within 3 days</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200/50 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50">
                  <TrendingUp size={20} className="text-orange-600" />
                </div>
                <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2 py-1 rounded-full border border-orange-200">High Risk</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{highCount}</div>
              <div className="text-sm text-gray-600 mt-1">High Risk Cohorts</div>
              <div className="text-xs text-gray-500 mt-1">Action within 7-14 days</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200/50 shadow-sm">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 w-fit mb-3">
                <Target size={20} className="text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">94%</div>
              <div className="text-sm text-gray-600 mt-1">Pattern Match Accuracy</div>
              <div className="text-xs text-gray-500 mt-1">Based on 5,284 incidents</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200/50 shadow-sm">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 w-fit mb-3">
                <Shield size={20} className="text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">87%</div>
              <div className="text-sm text-gray-600 mt-1">Prevention Success Rate</div>
              <div className="text-xs text-gray-500 mt-1">When acted upon early</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-3 gap-6">
            {/* Cohort List */}
            <div className="col-span-1 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">At-Risk Cohorts</h2>
                <span className="text-xs text-gray-500">Sorted by urgency</span>
              </div>

              {cohorts.map((cohort) => (
                <CohortCard
                  key={cohort.id}
                  cohort={cohort}
                  onClick={() => setSelectedCohort(cohort)}
                  isActive={selectedCohort?.id === cohort.id}
                />
              ))}
            </div>

            {/* Detail Panel */}
            <div className="col-span-2 space-y-4">
              {selectedCohort && (
                <>
                  <UrgencyCountdown days={selectedCohort.daysToAction} riskLevel={selectedCohort.riskLevel} />

                  <TrajectoryChart cohort={selectedCohort} />

                  <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-green-300/50">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap size={24} />
                      <h3 className="text-xl font-semibold">Recommended Intervention</h3>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 mb-4 backdrop-blur-sm">
                      <div className="font-semibold text-lg mb-2">{selectedCohort.recommendation.action}</div>
                      <div className="text-green-100 text-sm space-y-1">
                        <p>• <strong>Urgency:</strong> {selectedCohort.recommendation.urgency}</p>
                        <p>• <strong>Expected Impact:</strong> {selectedCohort.recommendation.estimatedImpact}</p>
                        <p>• <strong>Target:</strong> {selectedCohort.size} employees in {selectedCohort.name}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all flex items-center justify-center gap-2">
                        <Zap size={18} />
                        Deploy Now
                      </button>
                      <button className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all">
                        Schedule
                      </button>
                      <button className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all">
                        Customize
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
