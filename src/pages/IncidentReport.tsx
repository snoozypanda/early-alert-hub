// FIXED VERSION
// - Aligns with Incident interface
// - Adds latitude & longitude properly
// - Displays important attributes clearly
// - Removes undefined fields (id, severityLevel, reportedBy, reportDate)

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Incident, BaseGenericApiResponse } from "@/types/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// -----------------------------------------------------------------------------
// COLOR HELPERS
// -----------------------------------------------------------------------------
const severityColors: Record<Incident["severity"], string> = {
  low: "bg-green-500/20 text-green-600",
  medium: "bg-yellow-500/20 text-yellow-600",
  high: "bg-orange-500/20 text-orange-600",
  critical: "bg-red-500/20 text-red-600",
};

const statusColors: Record<Incident["status"], string> = {
  pending: "bg-yellow-500/20 text-yellow-600",
  approved: "bg-green-500/20 text-green-600",
  rejected: "bg-red-500/20 text-red-600",
};

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------
const IncidentReport = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState<Incident>({
    title: "",
    description: "",
    severity: "medium",
    status: "pending",
    area: "",
    attachments: "",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["incidents"],
    queryFn: async () => {
      const res =
        await api.get<BaseGenericApiResponse<Incident[]>>("/incident");
      return res.data;
    },
  });

  const incidents = data?.data ?? [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/incident", formData);
      toast.success("Incident reported successfully");
      setIsDialogOpen(false);
      refetch();
    } catch {
      toast.error("Failed to report incident");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" /> Incidents
            </h1>
            <p className="text-muted-foreground">Reported incidents overview</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Report Incident
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Incident</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Latitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          latitude: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          longitude: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Severity</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(val) =>
                      setFormData({ ...formData, severity: val as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No incidents reported
                      </TableCell>
                    </TableRow>
                  )}

                  {incidents.map((incident, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {incident.title}
                      </TableCell>
                      <TableCell>{incident.area}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(severityColors[incident.severity])}
                        >
                          {incident.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(statusColors[incident.status])}
                        >
                          {incident.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default IncidentReport;
