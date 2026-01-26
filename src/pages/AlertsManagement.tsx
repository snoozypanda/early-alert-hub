import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { alertsRoleUI } from "@/config/alertRoleUI";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Edit,
  X,
  Eye,
  Megaphone,
  Plus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Disaster, BaseGenericApiResponse } from "@/types/api";
import { format } from "date-fns";
import { toast } from "sonner";

const AlertsManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { user } = useAuth();
  const navigate = useNavigate();

  // API User uses roles string[]
  const userRole = user?.roles?.[0] || "disaster-manager";
  const roleConfig = typeof userRole === 'string' ? alertsRoleUI[userRole] : undefined;

  const handleRoleAction = (action?: string) => {
    if (action === "create-alert") {
      navigate("/create/alerts");
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["disasters", currentPage],
    queryFn: async () => {
      const res = await api.get<BaseGenericApiResponse<Disaster[]>>(`/disaster?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`);
      return res.data;
    },
  });

  const alerts = data?.data || [];

  const severityColors: Record<string, string> = {
    low: "bg-chart-1/20 text-chart-1 border-chart-1/30",
    medium: "bg-chart-4/20 text-chart-4 border-chart-4/30",
    high: "bg-destructive/20 text-destructive border-destructive/30",
    critical: "bg-destructive text-destructive-foreground",
  };

  const statusColors: Record<string, string> = {
    active: "bg-destructive/10 text-destructive",
    monitoring: "bg-chart-4/10 text-chart-4",
    resolved: "bg-chart-1/10 text-chart-1",
    pending: "bg-yellow-500/10 text-yellow-600",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-primary" />
              {roleConfig?.title ?? "Disasters (Alerts)"}{" "}
            </h1>
            <p className="text-muted-foreground">
              {roleConfig?.description ?? "View system alerts and disasters"}{" "}
            </p>
          </div>
          {roleConfig?.showButton && roleConfig.buttonText && (
            <Button onClick={() => handleRoleAction(roleConfig.action)}>
              {roleConfig.buttonIcon && (
                <roleConfig.buttonIcon className="h-4 w-4 mr-2" />
              )}
              {roleConfig.buttonText}
            </Button>
          )}
        </div>

        {/* Alerts (Disasters) Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">
              All Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="text-center py-4">Loading alerts...</div>
            ) : (
            <>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.length === 0 && (
                     <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No alerts found.
                        </TableCell>
                    </TableRow>
                )}
                {alerts.map((alert) => (
                  <TableRow key={alert.id} className="border-border">
                    <TableCell className="font-mono text-sm">
                      {alert.id}
                    </TableCell>
                    <TableCell className="font-medium">{alert.title}</TableCell>
                    <TableCell>{alert.scope}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs",
                          severityColors[alert.severityLevel?.toLowerCase()] || severityColors.low
                        )}
                      >
                        {alert.severityLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", statusColors[alert.status?.toLowerCase()] || "bg-gray-100")}
                      >
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{alert.startDate ? format(new Date(alert.startDate), "MMM dd, yyyy") : "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                                navigate(`/alerts/view/${alert.id}`)
                            }
                            >
                            <Eye className="h-4 w-4" />
                            </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="text-sm">Page {currentPage}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={alerts.length < itemsPerPage}
                >
                  Next
                </Button>
             </div>
            </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AlertsManagement;
