import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckSquare,
  LayoutDashboard,
  Users,
  BarChart3,
  Fish,
  GraduationCap,
  AlertCircle,
  Mail,
  MessageCircle,
  UserCog,
  User,
  Settings,
  ChevronDown,
  Network
} from 'lucide-react';
import companyLogo from '../Assets/Artifix.png';
import personImage from '../Assets/Person.png';

interface NavItem {
  label: string;
  icon: React.ElementType;
  children?: { label: string; path?: string }[];
  expanded?: boolean;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname.slice(1) || 'threat-radar';

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Network': true,
    'Network (old)': false,
  });

  const toggleSection = (label: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const mainNavItems: NavItem[] = [
    { label: 'Checklist', icon: CheckSquare },
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Human Risk Management', icon: Users, children: [] },
    { label: 'Analytics', icon: BarChart3, children: [] },
    { label: 'Phishing', icon: Fish, children: [] },
    { label: 'E-learning', icon: GraduationCap, children: [] },
    { label: 'Phishing Report Button', icon: AlertCircle, children: [] },
  ];

  const communicationItems: NavItem[] = [
    { label: 'Emails', icon: Mail, children: [] },
    { label: 'Sofie', icon: MessageCircle, children: [] },
  ];

  const configurationItems: NavItem[] = [
    {
      label: 'Network',
      icon: Network,
      children: [
        { label: 'Threat Radar', path: 'threat-radar' },
        { label: 'Template Marketplace', path: 'template-marketplace' },
        { label: 'Interventions', path: 'interventions' },
        { label: 'Early Warning', path: 'early-warning' },
      ]
    },
    {
      label: 'Network (old)',
      icon: Network,
      children: [
        { label: 'Threat Radar', path: 'threat-radar-2' },
        { label: 'Interventions', path: 'interventions-old' },
        { label: 'Early Warning', path: 'early-warning-old' }
      ]
    },
    { label: 'User Management', icon: UserCog, children: [] },
    { label: 'Account', icon: User, children: [] },
    { label: 'Settings', icon: Settings, children: [] },
  ];

  const NavSection: React.FC<{ item: NavItem }> = ({ item }) => {
    const Icon = item.icon;
    const isExpandable = item.children && item.children.length >= 0;
    const isExpanded = expandedSections[item.label];

    return (
      <div>
        <button
          onClick={() => isExpandable && toggleSection(item.label)}
          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
            isExpandable ? 'cursor-pointer' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon size={18} className="text-gray-600" />
            <span className="font-normal">{item.label}</span>
          </div>
          {isExpandable && (
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            />
          )}
        </button>
        {isExpandable && item.children && item.children.length > 0 && (
          <div
            className={`ml-11 border-l border-gray-200 overflow-hidden transition-all duration-200 ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {item.children.map((child, idx) => {
              const isActive = child.path === activePage;
              return (
                <button
                  key={idx}
                  onClick={() => child.path && navigate(`/${child.path}`)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? 'text-slate-900 bg-slate-100 font-bold border-l-2 border-slate-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {child.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col overflow-y-auto sticky top-0">
      {/* Logo and User Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center mb-4">
          <img src={companyLogo} alt="Artifix" className="h-12" />
        </div>
        <div className="flex items-center justify-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
          <img src={personImage} alt="Melissa Sands" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">Melissa Sands</div>
            <div className="text-xs text-gray-500 truncate">m.sands@artifix.ai</div>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-2">
        <nav>
          {mainNavItems.map((item, idx) => (
            <NavSection key={idx} item={item} />
          ))}
        </nav>

        {/* Communication Section */}
        <div className="mt-6 px-4 mb-2">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Communication
          </div>
        </div>
        <nav>
          {communicationItems.map((item, idx) => (
            <NavSection key={idx} item={item} />
          ))}
        </nav>

        {/* Configuration Section */}
        <div className="mt-6 px-4 mb-2">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Configuration
          </div>
        </div>
        <nav>
          {configurationItems.map((item, idx) => (
            <NavSection key={idx} item={item} />
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © 2025 SoSafe SE. All rights reserved
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
