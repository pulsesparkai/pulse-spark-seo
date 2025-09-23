import { useState } from "react";
import { 
  LayoutDashboard, 
  Palette, 
  FileText, 
  Search, 
  Sparkles, 
  Settings,
  ChevronRight 
} from "lucide-react";
import pulseLogo from "@/assets/pulse_logo_black_180x40.svg";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "AEO Command Center", url: "/", icon: LayoutDashboard },
  { title: "AEO Citation Flow", url: "/canvas", icon: Palette },
  { title: "AI Answer Optimizer", url: "/content", icon: FileText },
  { title: "AEO Audit", url: "/audit", icon: Search },
  { title: "AI Prompts", url: "/prompts", icon: Sparkles },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className="border-sidebar-border" collapsible="icon">
      <SidebarContent className="bg-sidebar shadow-sidebar">
        <div className="px-4 py-6">
          <div className="flex items-center gap-3">
            {!collapsed ? (
              <img src={pulseLogo} alt="PulseSpark" className="h-8" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-sm" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Company Information */}
        <div className="mt-auto px-4 py-6 border-t border-sidebar-border">
          {!collapsed && (
            <div className="space-y-2 text-xs text-sidebar-foreground/70">
              <div className="font-medium text-sidebar-foreground">PulseSpark.ai LLC</div>
              <div className="space-y-1">
                <div>6425 Living Place</div>
                <div>Suite 200</div>
                <div>Pittsburgh, PA 15206</div>
                <div>United States</div>
              </div>
              <div className="space-y-1 pt-2">
                <div>📞 412-206-5239</div>
                <div>✉️ info@pulsespark.ai</div>
              </div>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}