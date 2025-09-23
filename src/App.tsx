import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { NotificationSystem } from "@/components/shared/NotificationSystem";
import { QuickActionsButton } from "@/components/shared/QuickActionsButton";
import { AIAssistantModal } from "@/components/shared/AIAssistantModal";
import { useState } from "react";
import Index from "./pages/Index";
import SEOCanvas from "./pages/SEOCanvas";
import ContentBuilder from "./pages/ContentBuilder";
import SiteAudit from "./pages/SiteAudit";
import AIPrompts from "./pages/AIPrompts";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <NotificationSystem />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-dashboard-surface">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 p-6">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/canvas" element={<SEOCanvas />} />
                    <Route path="/content" element={<ContentBuilder />} />
                    <Route path="/audit" element={<SiteAudit />} />
                    <Route path="/prompts" element={<AIPrompts />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
              <QuickActionsButton onOpenAI={() => setIsAIModalOpen(true)} />
              <AIAssistantModal 
                isOpen={isAIModalOpen} 
                onClose={() => setIsAIModalOpen(false)} 
              />
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
