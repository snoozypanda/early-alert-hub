import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { roleUI } from "@/config/roleUI";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const links = roleUI[user.role];

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
