import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AlertsProvider } from "./contexts/AlertContext";
// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";
import AlertsManagement from "./pages/AlertsManagement";
import CreateAlert from "./pages/CreateAlert";
import ResourcesPage from "./pages/ResourcesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ChatPage from "./pages/ChatPage";
import IncidentReport from "./pages/IncidentReport";
import SafetyPage from "./pages/SafetyPage";
import NotFound from "./pages/NotFound";
import ViewAlert from "./pages/ViewAlert";
import EditAlert from "./pages/EditAlert";
import EditIncident from "./pages/EditIncident";
// import BroadcastAlert from "./pages/BroadcastAlert";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AlertsProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<User />} />
                <Route path="/alerts" element={<AlertsManagement />} />
                <Route path="/create-alert" element={<CreateAlert />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/report-incident" element={<IncidentReport />} />
                <Route path="/incidents" element={<IncidentReport />} />
                <Route path="/tasks" element={<Dashboard />} />
                <Route path="/public-alerts" element={<AlertsManagement />} />
                <Route path="/safety" element={<SafetyPage />} />
                <Route path="/reports" element={<AlertsManagement />} />
                <Route path="/settings" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/alerts/view/:alertId" element={<ViewAlert />} />
                <Route path="/alerts/edit/:alertId" element={<EditAlert />} />
                <Route
                  path="/incidents/edit/:incidentId"
                  element={<EditIncident />}
                />
              </Routes>
            </BrowserRouter>
          </AlertsProvider>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
