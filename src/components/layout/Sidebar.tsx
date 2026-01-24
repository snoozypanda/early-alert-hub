import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { roleUI } from "@/config/roleUI";
import { Loader } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();

  // Show skeleton/placeholder while loading
  if (isLoading || !user) {
    return (
      <aside
        className={cn(
          "h-[calc(100vh-4rem)] border-r border-border bg-card transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <nav className="flex-1 p-2 space-y-1 flex items-center justify-center">
          <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
        </nav>
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={onToggle}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>
    );
  }

  // Handle user.roles array - get the first matching role
  let userRole: string | undefined;
  
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    // Try to find a role that exists in roleUI
    userRole = user.roles.find((role) => (role in roleUI));
    // If no exact match, use the first role anyway
    if (!userRole) {
      userRole = user.roles[0];
    }
  } else if (user.role && typeof user.role === 'string') {
    userRole = user.role;
  }

  // Debug logging
  if (!userRole || !(userRole in roleUI)) {
    console.warn('No valid role found for user:', { 
      roles: user.roles, 
      role: user.role,
      userRole 
    });
  }

  const links = userRole && userRole in roleUI 
    ? roleUI[userRole as keyof typeof roleUI] 
    : [];

  if (!links || links.length === 0) {
    // Fallback: show empty sidebar with collapse button
    return (
      <aside
        className={cn(
          "h-[calc(100vh-4rem)] border-r border-border bg-card transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <nav className="flex-1 p-2 flex items-center justify-center">
          <p className="text-xs text-muted-foreground text-center">
            Role: {userRole || 'unknown'}
          </p>
        </nav>
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={onToggle}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] border-r border-border bg-card transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <nav className="flex-1 p-2 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.route}
            to={link.route}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              )
            }
          >
            <link.icon className="h-5 w-5 shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium">{t(link.labelKey)}</span>
            )}
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
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
