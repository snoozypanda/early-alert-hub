import React from "react";
import {
  AlertTriangle,
  Activity,
  Package,
  Plus,
  TrendingUp,
  Loader,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import AlertsList from "@/components/dashboard/AlertsList";
import MapPlaceholder from "@/components/dashboard/MapPlaceholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockAlerts, mockChartData } from "@/lib/mockData";
import { useDisastersQuery } from "@/lib/api/disasters";
import { useIncidentsQuery } from "@/lib/api/incidents";
import { normalizeRole } from "@/config/roleUI";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "hsl(158, 64%, 51%)",
  "hsl(141, 69%, 58%)",
  "hsl(172, 66%, 50%)",
  "hsl(82, 77%, 55%)",
  "hsl(0, 0%, 45%)",
];

const DecisionMakerDashboard = () => {
  const { t } = useLanguage();
  const { data: disasters = [], isLoading: disastersLoading } =
    useDisastersQuery();
  const { data: incidents = [], isLoading: incidentsLoading } =
    useIncidentsQuery();

  const activeDisasters = disasters.filter((d) => d.status === "active");
  const pendingIncidents = incidents.filter((i) => i.status === "pending");

  const chartDataByType = disasters.reduce(
    (acc, d) => {
      const existing = acc.find((item) => item.name === d.severityLevel);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: d.severityLevel, value: 1 });
      }
      return acc;
    },
    [] as Array<{ name: string; value: number }>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Disaster Manager Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time disaster monitoring and management
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t("issueAlert")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t("activeAlerts")}
          value={activeDisasters.length}
          icon={AlertTriangle}
          variant="danger"
          trend={{ value: 15, positive: false }}
          isLoading={disastersLoading}
        />
        <StatsCard
          title="Pending Incidents"
          value={pendingIncidents.length}
          icon={Activity}
          variant="warning"
          trend={{ value: 5, positive: false }}
          isLoading={incidentsLoading}
        />
        <StatsCard
          title={t("availableResources")}
          value={156}
          icon={Package}
          variant="success"
          trend={{ value: 10, positive: true }}
        />
      </div>

      {/* Map and Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MapPlaceholder />
        {incidentsLoading ? (
          <Card className="border-border flex items-center justify-center h-[350px]">
            <Loader className="h-8 w-8 animate-spin" />
          </Card>
        ) : (
          <AlertsList
            alerts={incidents.slice(0, 4).map((i) => ({
              id: i.id,
              type: i.title,
              area: i.description.slice(0, 50),
              severity: (i.severityLevel as any) || "medium",
              status: (i.status === "approved" ? "active" : "monitoring") as any,
              date: new Date(i.reportDate).toLocaleDateString(),
              description: i.description,
              createdAt: i.reportDate,
            }))}
          />
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Disasters by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {disastersLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="h-8 w-8 animate-spin" />
                </div>
              ) : chartDataByType.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartDataByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {chartDataByType.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Disaster Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData.alertsByMonth}>
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="alerts"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[500px]">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Handle user.roles array - normalize and get the first valid role
  let userRole: string | undefined;
  
  if (Array.isArray(user?.roles) && user.roles.length > 0) {
    for (const role of user.roles) {
      const normalized = normalizeRole(role);
      if (normalized) {
        userRole = normalized;
        break;
      }
    }
  }

  if (userRole === "disaster-manager") {
    return (
      <DashboardLayout>
        <DecisionMakerDashboard />
      </DashboardLayout>
    );
  }

  if (userRole === "incident-validator") {
    return (
      <DashboardLayout>
        <IncidentValidatorDashboard />
      </DashboardLayout>
    );
  }

  if (userRole === "response-team") {
    return (
      <DashboardLayout>
        <EmergencyResponseTeamDashboard />
      </DashboardLayout>
    );
  }

  if (userRole === "administrator") {
    return (
      <DashboardLayout>
        <AdministratorDashboard />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <EmergencyResponseTeamDashboard />
    </DashboardLayout>
  );
};

// Incident Validator Dashboard
const IncidentValidatorDashboard = () => {
  const { data: incidents = [], isLoading: incidentsLoading } =
    useIncidentsQuery();

  const pendingIncidents = incidents.filter((i) => i.status === "pending");
  const approvedIncidents = incidents.filter((i) => i.status === "approved");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Incident Validator Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage and monitor all submitted incident.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Pending Review"
          value={pendingIncidents.length}
          icon={AlertTriangle}
          variant="warning"
          isLoading={incidentsLoading}
        />
        <StatsCard
          title="Approved Incidents"
          value={approvedIncidents.length}
          icon={Activity}
          variant="danger"
          isLoading={incidentsLoading}
        />
        <StatsCard
          title="Total Incidents"
          value={incidents.length}
          icon={TrendingUp}
          variant="success"
          isLoading={incidentsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TasksList />
        <MapPlaceholder title="Current Location" height="h-[350px]" />
      </div>
    </div>
  );
};

// Emergency Response Team Dashboard
const EmergencyResponseTeamDashboard = () => {
  const { data: disasters = [], isLoading: disastersLoading } =
    useDisastersQuery();

  const activeDisasters = disasters.filter((d) => d.status === "active");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Emergency Response Team Dashboard
        </h1>
        <p className="text-muted-foreground">Manage resources for alerts.</p>
      </div>

      {disastersLoading ? (
        <Card className="border-border flex items-center justify-center h-[350px]">
          <Loader className="h-8 w-8 animate-spin" />
        </Card>
      ) : (
        <AlertsList
          alerts={activeDisasters.map((d) => ({
            id: d.id,
            type: d.title,
            area: d.scope,
            severity: (d.severityLevel as any) || "medium",
            status: "active" as any,
            date: new Date(d.startDate).toLocaleDateString(),
            description: d.description,
            createdAt: d.startDate,
          }))}
          title="Active Public Alerts"
          showViewAll={false}
        />
      )}

      <SafetyPanel />
    </div>
  );
};

const AdministratorDashboard = () => {
  const { data: disasters = [], isLoading: disastersLoading } =
    useDisastersQuery();

  const activeDisasters = disasters.filter((d) => d.status === "active");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Administrator Dashboard
        </h1>
        <p className="text-muted-foreground">Manage users and system logs.</p>
      </div>

      {disastersLoading ? (
        <Card className="border-border flex items-center justify-center h-[350px]">
          <Loader className="h-8 w-8 animate-spin" />
        </Card>
      ) : (
        <AlertsList
          alerts={activeDisasters.map((d) => ({
            id: d.id,
            type: d.title,
            area: d.scope,
            severity: (d.severityLevel as any) || "medium",
            status: "active" as any,
            date: new Date(d.startDate).toLocaleDateString(),
            description: d.description,
            createdAt: d.startDate,
          }))}
          title="Active Public Alerts"
          showViewAll={false}
        />
      )}

      <SafetyPanel />
    </div>
  );
};

// Tasks List Component for Field Agent
// import { mockTasks } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TasksList = () => {
  const severityColors = {
    low: "bg-chart-1/20 text-chart-1",
    medium: "bg-chart-4/20 text-chart-4",
    high: "bg-destructive/20 text-destructive",
    critical: "bg-destructive text-destructive-foreground",
  };

  return (
    <Card className="border-border">
    {/* //   <CardHeader>
    //     <CardTitle className="text-lg">Assigned Tasks</CardTitle>
    //   </CardHeader>
    //   <CardContent className="space-y-3">
    //     {mockTasks.map((task) => (
    //       <div
    //         key={task.id}
    //         className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
    //       >
    //         <div className="flex items-start justify-between">
    //           <div>
    //             <h4 className="font-medium text-foreground">{task.title}</h4>
    //             <p className="text-sm text-muted-foreground">{task.location}</p>
    //           </div>
    //           <Badge className={cn("text-xs", severityColors[task.severity])}>
    //             {task.severity}
    //           </Badge>
    //         </div>
    //         {task.status === "pending" && (
    //           <Button size="sm" className="mt-3">
    //             Accept Task
    //           </Button>
    //         )}
    //       </div>
    //     ))}
    //   </CardContent> */}
    </Card>
  );
};

// Safety Panel for Citizens
import { safetyInstructions } from "@/lib/mockData";
import { Droplets, Activity as ActivityIcon, Flame } from "lucide-react";

const iconMap: Record<string, any> = {
  Droplets,
  Activity: ActivityIcon,
  Flame,
};

const SafetyPanel = () => {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Safety Instructions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {safetyInstructions.map((item) => {
            const Icon = iconMap[item.icon] || AlertTriangle;
            return (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-border bg-accent/20"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <h4 className="font-medium text-foreground">{item.title}</h4>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {item.instructions.map((instruction, idx) => (
                    <li key={idx}>• {instruction}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
