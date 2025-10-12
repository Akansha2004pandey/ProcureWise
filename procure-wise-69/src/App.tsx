import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import RFPManagement from "./pages/admin/RFPManagement";
import QuotationReview from "./pages/admin/QuotationReview";
import ContractAudit from "./pages/admin/ContractAudit";
import RFPList from "./pages/vendor/RFPList";
import SubmitQuotation from "./pages/vendor/SubmitQuotation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/rfp-management" element={<RFPManagement />} />
          <Route path="/admin/quotation-review" element={<QuotationReview />} />
          <Route path="/admin/contract-audit" element={<ContractAudit />} />
          <Route path="/vendor/rfps" element={<RFPList />} />
          <Route path="/vendor/submit" element={<SubmitQuotation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
