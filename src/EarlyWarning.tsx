import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { AlertTriangle, TrendingUp, Zap, Target, Shield, ChevronRight, Activity, Gauge, TrendingDown, Info } from 'lucide-react';
import Sidebar from './Sidebar';

// Type definitions
type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
type CohortType = 'department' | 'role' | 'custom';

interface RiskScoreData {
  composite: number;
  behavioral: number;
  patternMatch: number;
  impactFactor: number;
  trend: number;
  impactExplanation: {
    accessDescription: string;
    avgBreachCost: string;
    multiplier: string;
  };
}

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
  riskScore: RiskScoreData;
}

interface TrajectoryPoint {
  week: number;
  hsi: number;
  label?: string;
}

const cohorts: RiskCohort[] = [
  {
    id: 1,
    name: 'Executive Leadership',
    type: 'role',
    size: 8,
    currentHSI: 64,
    trend: 8,
    riskLevel: 'critical',
    daysToAction: 3,
    matchedPattern: {
      name: 'Credential Harvest Vulnerability',
      occurrences: 31,
      avgDaysBeforeIncident: 21,
      incidentType: 'Credential Theft',
    },
    recommendation: {
      action: 'Executive Security Briefing + MFA Enforcement',
      urgency: 'Deploy this week',
      estimatedImpact: '+22% HSI in 3 weeks',
    },
    riskScore: {
      composite: 85,
      behavioral: 64,
      patternMatch: 92,
      impactFactor: 4.8,
      trend: 8,
      impactExplanation: {
        accessDescription: 'Executive access to sensitive strategic data and approval workflows',
        avgBreachCost: '$3.6M',
        multiplier: '4.8x the organization average',
      },
    },
  },
  {
    id: 2,
    name: 'Finance Team',
    type: 'department',
    size: 23,
    currentHSI: 82,
    trend: -12,
    riskLevel: 'low',
    daysToAction: 30,
    matchedPattern: {
      name: 'Improving Security Posture',
      occurrences: 156,
      avgDaysBeforeIncident: 90,
      incidentType: 'Low Risk',
    },
    recommendation: {
      action: 'Continue Current Training Program',
      urgency: 'Maintenance mode',
      estimatedImpact: 'Maintain current HSI',
    },
    riskScore: {
      composite: 24,
      behavioral: 82,
      patternMatch: 18,
      impactFactor: 3.2,
      trend: -12,
      impactExplanation: {
        accessDescription: 'Finance team has access to payment systems and bank accounts',
        avgBreachCost: '$2.4M',
        multiplier: '3.2x the organization average',
      },
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
    riskScore: {
      composite: 64,
      behavioral: 52,
      patternMatch: 76,
      impactFactor: 1.4,
      trend: -6,
      impactExplanation: {
        accessDescription: 'Variable access based on role; unfamiliar with security policies',
        avgBreachCost: '$890K',
        multiplier: '1.4x the organization average',
      },
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
    riskScore: {
      composite: 52,
      behavioral: 71,
      patternMatch: 67,
      impactFactor: 2.1,
      trend: -3,
      impactExplanation: {
        accessDescription: 'HR access to employee PII and sensitive personnel records',
        avgBreachCost: '$1.6M',
        multiplier: '2.1x the organization average',
      },
    },
  },
];

// Mock trajectory data - one pattern per cohort
const trajectoryPatterns: Record<number, { actual: TrajectoryPoint[], predicted: TrajectoryPoint[], network: TrajectoryPoint[] }> = {
  // Executive Leadership (critical - declining sharply)
  1: {
    actual: [
      { week: -8, hsi: 78 },
      { week: -6, hsi: 74 },
      { week: -4, hsi: 70 },
      { week: -2, hsi: 67 },
      { week: 0, hsi: 64, label: 'Today' },
    ],
    predicted: [
      { week: 0, hsi: 64 },
      { week: 2, hsi: 58 },
      { week: 4, hsi: 52 },
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
  // Finance Team (low risk - improving)
  2: {
    actual: [
      { week: -8, hsi: 68 },
      { week: -6, hsi: 72 },
      { week: -4, hsi: 76 },
      { week: -2, hsi: 79 },
      { week: 0, hsi: 82, label: 'Today' },
    ],
    predicted: [
      { week: 0, hsi: 82 },
      { week: 2, hsi: 84 },
      { week: 4, hsi: 86 },
    ],
    network: [
      { week: -8, hsi: 70 },
      { week: -6, hsi: 74 },
      { week: -4, hsi: 78 },
      { week: -2, hsi: 81 },
      { week: 0, hsi: 84 },
      { week: 2, hsi: 87, label: 'Stable' },
    ],
  },
  // New Hires (high risk - declining)
  3: {
    actual: [
      { week: -8, hsi: 65 },
      { week: -6, hsi: 60 },
      { week: -4, hsi: 56 },
      { week: -2, hsi: 54 },
      { week: 0, hsi: 52, label: 'Today' },
    ],
    predicted: [
      { week: 0, hsi: 52 },
      { week: 2, hsi: 48 },
      { week: 4, hsi: 44 },
    ],
    network: [
      { week: -8, hsi: 62 },
      { week: -6, hsi: 57 },
      { week: -4, hsi: 51 },
      { week: -2, hsi: 46 },
      { week: 0, hsi: 42 },
      { week: 2, hsi: 38, label: 'Avg Incident' },
    ],
  },
  // HR Department (medium risk - slight decline)
  4: {
    actual: [
      { week: -8, hsi: 76 },
      { week: -6, hsi: 74 },
      { week: -4, hsi: 73 },
      { week: -2, hsi: 72 },
      { week: 0, hsi: 71, label: 'Today' },
    ],
    predicted: [
      { week: 0, hsi: 71 },
      { week: 2, hsi: 68 },
      { week: 4, hsi: 65 },
    ],
    network: [
      { week: -8, hsi: 74 },
      { week: -6, hsi: 70 },
      { week: -4, hsi: 66 },
      { week: -2, hsi: 62 },
      { week: 0, hsi: 58 },
      { week: 2, hsi: 54, label: 'Avg Incident' },
    ],
  },
};

const generateTrajectory = (cohortId: number): { actual: TrajectoryPoint[], predicted: TrajectoryPoint[], network: TrajectoryPoint[] } => {
  return trajectoryPatterns[cohortId] || trajectoryPatterns[1];
};

const RiskScoreBreakdown: React.FC<{ cohort: RiskCohort }> = ({ cohort }) => {
  const { riskScore } = cohort;

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Critical';
    if (score >= 50) return 'High';
    if (score >= 30) return 'Medium';
    return 'Low';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-gray-900';
    if (score >= 50) return 'bg-orange-100 text-gray-900';
    if (score >= 30) return 'bg-yellow-100 text-gray-900';
    return 'bg-green-100 text-gray-900';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Gauge size={20} className="text-gray-900" />
        <h3 className="text-lg font-extrabold text-gray-900">Enhanced Risk Scoring</h3>
        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium ml-auto">Network-Powered</span>
      </div>

      {/* Composite Score */}
      <div className="bg-gray-100 rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-gray-600">Composite Risk Score</div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getScoreBadgeColor(riskScore.composite)}`}>
            {getScoreLabel(riskScore.composite)}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-gray-900">{riskScore.composite}</span>
          <span className="text-xl text-gray-400">/100</span>
        </div>
        <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden relative">
          <div
            className="h-full transition-all rounded-full"
            style={{
              width: `${riskScore.composite}%`,
              background: 'linear-gradient(to right, #22c55e, #facc15, #fb923c, #ef4444)'
            }}
          />
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">Behavioral Score</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{riskScore.behavioral}</span>
            <span className="text-sm text-gray-400">/100</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">HSI, click rate, reporting</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">Pattern Match</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{riskScore.patternMatch}%</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Similarity to pre-incident</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">Impact Factor</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{riskScore.impactFactor}x</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Role & access multiplier</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">30-Day Trend</div>
          <div className="flex items-center gap-1">
            {riskScore.trend > 0 ? (
              <>
                <TrendingUp size={18} className="text-red-600" />
                <span className="text-2xl font-bold text-red-600">+{riskScore.trend}%</span>
              </>
            ) : (
              <>
                <TrendingDown size={18} className="text-green-600" />
                <span className="text-2xl font-bold text-green-600">{riskScore.trend}%</span>
              </>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">{riskScore.trend > 0 ? 'Increasing risk' : 'Improving'}</div>
        </div>
      </div>

      {/* Impact Factor Explanation */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-start gap-3">
          <Info size={18} className="text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-gray-900 mb-2">Why Impact Factor is {riskScore.impactFactor}x</div>
            <div className="text-xs text-gray-600 space-y-1.5">
              <p>• {riskScore.impactExplanation.accessDescription}</p>
              <p>• Average breach cost for this cohort: <strong className="text-gray-900">{riskScore.impactExplanation.avgBreachCost}</strong></p>
              <p>• This is <strong className="text-gray-900">{riskScore.impactExplanation.multiplier}</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Network Context */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Shield size={14} />
          <span>Risk scoring model trained on <strong className="text-gray-700">5,284 incidents</strong> across <strong className="text-gray-700">2,847 organizations</strong></span>
        </div>
      </div>
    </div>
  );
};

const CohortCard: React.FC<{ cohort: RiskCohort; onClick: () => void; isActive: boolean }> = ({ cohort, onClick, isActive }) => {
  // Positive trend (going up) = bad (red), Negative trend (going down) = good (green)
  const trendColor = cohort.trend > 0 ? 'text-red-600' : 'text-green-600';
  const trendIcon = cohort.trend > 0 ? '↑' : '↓';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 cursor-pointer transition-all ${
        isActive
          ? 'bg-gradient-to-br from-blue-50 to-gray-100 border-2 border-blue-200'
          : 'bg-gray-100 hover:bg-gray-150'
      }`}
    >
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900">{cohort.name}</h3>
        <p className="text-xs text-gray-900 mt-1">{cohort.size} employees</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <div className="text-xs text-gray-600 mb-1">Current HSI</div>
          <div className="text-2xl font-bold text-gray-900">{cohort.currentHSI}</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 mb-1">Trend (30d)</div>
          <div className={`text-2xl font-bold ${trendColor}`}>
            {trendIcon}{Math.abs(cohort.trend)}%
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs font-bold text-gray-900 mb-1">
          Pattern Match: {cohort.matchedPattern.name}
        </div>
        <div className="text-xs text-gray-900">
          Seen in {cohort.matchedPattern.occurrences} orgs before {cohort.matchedPattern.incidentType}
        </div>
      </div>

      <button className="w-full flex items-center justify-between bg-gray-900 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors">
        <span>{cohort.recommendation.action}</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

const TrajectoryChart: React.FC<{ cohort: RiskCohort }> = ({ cohort }) => {
  const data = generateTrajectory(cohort.id);

  // Color based on risk level
  const riskColors: Record<RiskLevel, string> = {
    critical: '#ef4444', // red-500
    high: '#f97316',     // orange-500
    medium: '#eab308',   // yellow-500
    low: '#22c55e',      // green-500
  };
  const actualColor = riskColors[cohort.riskLevel];

  // X-axis categories (weeks)
  const xAxisData = ['-8 wks', '-6 wks', '-4 wks', '-2 wks', 'Today', '+2 wks', '+4 wks'];

  // Convert trajectory data to ECharts format
  const mapToChartData = (points: TrajectoryPoint[]) => {
    return points.map(p => {
      const weekIndex = (p.week + 8) / 2; // Convert week to index (0-6)
      return [weekIndex, p.hsi];
    });
  };

  const chartOption = {
    grid: {
      left: 45,
      right: 20,
      top: 20,
      bottom: 35,
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#6b7280',
        fontSize: 11,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 25,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: { color: '#e5e7eb', type: 'solid' },
      },
      axisLabel: {
        color: '#6b7280',
        fontSize: 11,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    },
    series: [
      // Network incident pattern (dashed amber)
      {
        name: 'Network incident pattern',
        type: 'line',
        data: mapToChartData(data.network),
        smooth: false,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#d97706',
          width: 3,
          type: 'dashed',
          opacity: 0.7,
        },
        itemStyle: {
          color: '#d97706',
          opacity: 0.9,
        },
      },
      // Actual trajectory (solid, risk-colored)
      {
        name: 'Your cohort (actual)',
        type: 'line',
        data: mapToChartData(data.actual),
        smooth: false,
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          color: actualColor,
          width: 3,
        },
        itemStyle: {
          color: actualColor,
        },
      },
      // Predicted trajectory (dashed gray)
      {
        name: 'Predicted',
        type: 'line',
        data: mapToChartData(data.predicted),
        smooth: false,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#9ca3af',
          width: 3,
          type: 'dashed',
        },
        itemStyle: {
          color: '#9ca3af',
        },
      },
    ],
    legend: {
      show: true,
      bottom: 0,
      itemWidth: 24,
      itemHeight: 3,
      textStyle: {
        color: '#111827',
        fontSize: 11,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-extrabold text-gray-900 mb-2">Risk Trajectory Analysis</h3>
        <p className="text-xs text-gray-900">
          Comparing {cohort.name} behavior pattern against {cohort.matchedPattern.occurrences} historical incidents
        </p>
      </div>

      {/* ECharts visualization */}
      <div className="bg-gray-50 rounded-xl p-4">
        <ReactECharts option={chartOption} style={{ height: '280px' }} />
      </div>

      {/* Pattern details */}
      <div className="mt-4 p-4 bg-gray-100 rounded-xl">
        <div className="flex items-start gap-3">
          <Activity size={20} className="text-gray-900 mt-0.5" />
          <div>
            <div className="font-bold text-gray-900 mb-2">Pattern Analysis</div>
            <div className="text-xs text-gray-900 space-y-1">
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
              <h1 className="text-5xl font-black text-gray-900">Early Warning</h1>
              <p className="text-xs text-gray-900 mt-2">Network-wide behavioral pattern matching for proactive risk mitigation</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-gray-600">Active Alerts</div>
                <div className="text-2xl font-bold text-amber-600">{criticalCount + highCount}</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
          </div>
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
              <div className="p-2.5 rounded-xl bg-white w-fit mb-3">
                <AlertTriangle size={20} className="text-gray-900" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{criticalCount}</div>
              <div className="text-sm font-bold text-gray-600 mt-1">Critical Risk Cohorts</div>
              <div className="text-xs text-gray-500 mt-1">Action needed within 3 days</div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
              <div className="p-2.5 rounded-xl bg-white w-fit mb-3">
                <TrendingUp size={20} className="text-gray-900" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{highCount}</div>
              <div className="text-sm font-bold text-gray-600 mt-1">High Risk Cohorts</div>
              <div className="text-xs text-gray-500 mt-1">Action within 7-14 days</div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
              <div className="p-2.5 rounded-xl bg-white w-fit mb-3">
                <Target size={20} className="text-gray-900" />
              </div>
              <div className="text-3xl font-bold text-gray-900">94%</div>
              <div className="text-sm text-gray-600 mt-1">Pattern Match Accuracy</div>
              <div className="text-xs text-gray-500 mt-1">Based on 5,284 incidents</div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all">
              <div className="p-2.5 rounded-xl bg-white w-fit mb-3">
                <Shield size={20} className="text-gray-900" />
              </div>
              <div className="text-3xl font-bold text-gray-900">87%</div>
              <div className="text-sm text-gray-600 mt-1">Prevention Success Rate</div>
              <div className="text-xs text-gray-500 mt-1">When acted upon early</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-gray-50 rounded-3xl border border-gray-200 p-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">At-Risk Cohorts</h2>
            <div className="grid grid-cols-3 gap-6">
              {/* Cohort List */}
              <div className="col-span-1 space-y-4">
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
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap size={24} className="text-gray-900" />
                      <h3 className="text-xl font-extrabold text-gray-900">Recommended Intervention</h3>
                    </div>

                    <div className="bg-white rounded-xl p-4 mb-4">
                      <div className="font-bold text-lg text-gray-900 mb-2">{selectedCohort.recommendation.action}</div>
                      <div className="text-xs text-gray-900 space-y-1">
                        <p>• <strong>Urgency:</strong> {selectedCohort.recommendation.urgency}</p>
                        <p>• <strong>Expected Impact:</strong> {selectedCohort.recommendation.estimatedImpact}</p>
                        <p>• <strong>Target:</strong> {selectedCohort.size} employees in {selectedCohort.name}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                        <Zap size={18} />
                        Deploy Now
                      </button>
                      <button className="px-6 py-3 bg-white hover:bg-gray-50 rounded-xl font-bold text-gray-900 transition-colors">
                        Schedule
                      </button>
                      <button className="px-6 py-3 bg-white hover:bg-gray-50 rounded-xl font-bold text-gray-900 transition-colors">
                        Customize
                      </button>
                    </div>
                  </div>

                  <RiskScoreBreakdown cohort={selectedCohort} />

                  <TrajectoryChart cohort={selectedCohort} />
                </>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
