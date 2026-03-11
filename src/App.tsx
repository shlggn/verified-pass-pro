import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Credentials from "./pages/Credentials";
import ShareQR from "./pages/ShareQR";
import VerifyCredential from "./pages/VerifyCredential";
import VerifySharedCredential from "./pages/VerifySharedCredential";
import VerifyPage from "./pages/VerifyPage";
import AdminApplications from "./pages/AdminApplications";
import AdminUsers from "./pages/AdminUsers";
import VerificationHistory from "./pages/VerificationHistory";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify/share/:shareToken" element={<VerifySharedCredential />} />
            <Route path="/verify/:token" element={<VerifyCredential />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/credentials" element={<ProtectedRoute><Credentials /></ProtectedRoute>} />
            <Route path="/dashboard/share" element={<ProtectedRoute><ShareQR /></ProtectedRoute>} />
            <Route path="/dashboard/verify" element={<ProtectedRoute><VerifyPage /></ProtectedRoute>} />
            <Route path="/dashboard/history" element={<ProtectedRoute><VerificationHistory /></ProtectedRoute>} />
            <Route path="/dashboard/applications" element={<ProtectedRoute><AdminApplications /></ProtectedRoute>} />
            <Route path="/dashboard/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
