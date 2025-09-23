import { Sparkles, User, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
export function TopBar() {
  return <header className="h-16 border-b border-border bg-dashboard-surface px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="p-2" />
        
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                <User className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm hidden sm:block">Demo User</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Account Preferences</DropdownMenuItem>
            <DropdownMenuItem>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>;
}