import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Package,
  BarChart3,
  Settings,
  Users,
  MessageSquare,
  ClipboardList,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();

  const decisionMakerLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/alerts', icon: AlertTriangle, label: t('alerts') },
    { to: '/reports', icon: FileText, label: t('reports') },
    { to: '/resources', icon: Package, label: t('resources') },
    { to: '/analytics', icon: BarChart3, label: t('analytics') },
    { to: '/settings', icon: Settings, label: t('settings') },
  ];

  const fieldAgentLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/tasks', icon: ClipboardList, label: 'Tasks' },
    { to: '/incidents', icon: AlertTriangle, label: 'Incidents' },
    { to: '/resources', icon: Package, label: t('resources') },
    { to: '/chat', icon: MessageSquare, label: 'Chat' },
    { to: '/settings', icon: Settings, label: t('settings') },
  ];

  const citizenLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/public-alerts', icon: AlertTriangle, label: 'Public Alerts' },
    { to: '/report-incident', icon: FileText, label: 'Report Incident' },
    { to: '/safety', icon: Shield, label: 'Safety Info' },
    { to: '/settings', icon: Settings, label: t('settings') },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'decision-maker':
        return decisionMakerLinks;
      case 'field-agent':
        return fieldAgentLinks;
      case 'citizen':
        return citizenLinks;
      default:
        return decisionMakerLinks;
    }
  };

  const links = getLinks();

  return (
    <aside
      className={cn(
        'h-[calc(100vh-4rem)] border-r border-border bg-card transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <nav className="flex-1 p-2 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
              )
            }
          >
            <link.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={onToggle}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
