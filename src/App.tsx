import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import Index from "./pages/Index";
import SEOCanvas from "./pages/SEOCanvas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
                  <Route path="/content" element={<div className="p-8 text-center text-muted-foreground">Content Builder - Coming Soon</div>} />
                  <Route path="/audit" element={<div className="p-8 text-center text-muted-foreground">Site Audit - Coming Soon</div>} />
                  <Route path="/prompts" element={<div className="p-8 text-center text-muted-foreground">AI Prompts - Coming Soon</div>} />
                  <Route path="/settings" element={<div className="p-8 text-center text-muted-foreground">Settings - Coming Soon</div>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
