import React, { useState } from "react";
import {
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Loader,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useIncidentsQuery,
  useCreateIncidentMutation,
  useUpdateIncidentMutation,
  useDeleteIncidentMutation,
} from "@/lib/api/incidents";
import { toast } from "sonner";
import { UpdateIncidentInput } from "@/types/api";

const Incidents = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { data: incidents = [], isLoading } = useIncidentsQuery();
  const { mutate: createIncident, isPending: isCreating } =
    useCreateIncidentMutation();
  const { mutate: updateIncident, isPending: isUpdating } =
    useUpdateIncidentMutation();
  const { mutate: deleteIncident, isPending: isDeleting } =
    useDeleteIncidentMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    latitude: 0,
    longitude: 0,
    severityLevel: "medium",
    attachments: [],
  });

  const isIncidentValidator = user?.roles?.some(
    (role) => role.toUpperCase() === "INCIDENT VALIDATOR"
  );

  const handleCreate = () => {
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required");
      return;
    }

    createIncident(
      {
        title: formData.title,
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        severityLevel: formData.severityLevel,
        attachments: formData.attachments,
      },
      {
        onSuccess: () => {
          toast.success("Incident created successfully");
          setIsCreateOpen(false);
          setFormData({
            title: "",
            description: "",
            latitude: 0,
            longitude: 0,
            severityLevel: "medium",
            attachments: [],
          });
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Failed to create incident"
          );
        },
      }
    );
  };

  const handleStatusChange = (incidentId: number, newStatus: string) => {
    if (!isIncidentValidator) {
      toast.error("Only Incident Validators can change incident status");
      return;
    }

    updateIncident(
      { id: incidentId, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success(`Incident status changed to ${newStatus}`);
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Failed to update incident"
          );
        },
      }
    );
  };

  const handleDelete = (incidentId: number) => {
    if (
      confirm(
        "Are you sure you want to delete this incident? This action cannot be undone."
      )
    ) {
      deleteIncident(incidentId, {
        onSuccess: () => {
          toast.success("Incident deleted successfully");
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Failed to delete incident"
          );
        },
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    };
    return colors[severity.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-gray-100 text-gray-800",
      active: "bg-orange-100 text-orange-800",
      resolved: "bg-green-100 text-green-800",
    };
    return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const iconClass = "h-4 w-4";
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className={iconClass} />;
      case "active":
        return <AlertTriangle className={iconClass} />;
      case "resolved":
        return <CheckCircle className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Incidents</h1>
            <p className="text-muted-foreground">
              Manage and monitor incident reports
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Incident
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Incident</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Incident title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Incident description"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.0001"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          latitude: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.0001"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          longitude: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="severity">Severity Level</Label>
                  <select
                    id="severity"
                    value={formData.severityLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, severityLevel: e.target.value })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating && (
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Create Incident
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Incidents List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : incidents.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No incidents found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {incidents.map((incident) => (
              <Card key={incident.id} className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {incident.title}
                        </h3>
                        <Badge className={getSeverityColor(incident.severityLevel)}>
                          {incident.severityLevel.charAt(0).toUpperCase() +
                            incident.severityLevel.slice(1)}
                        </Badge>
                        <Badge className={getStatusColor(incident.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(incident.status)}
                            {incident.status.charAt(0).toUpperCase() +
                              incident.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {incident.description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Location</p>
                          <p className="font-medium">
                            {incident.id} (Lat: {incident.id}, Lon: {incident.id})
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Reported</p>
                          <p className="font-medium">
                            {new Date(incident.reportDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Updated</p>
                          <p className="font-medium">
                            {new Date(incident.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Reported By</p>
                          <p className="font-medium">
                            {incident.reportedBy?.name || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {isIncidentValidator && incident.status !== "resolved" && (
                        <>
                          {incident.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusChange(incident.id, "active")
                              }
                              disabled={isUpdating}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              {isUpdating ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : (
                                "Activate"
                              )}
                            </Button>
                          )}
                          {incident.status === "active" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusChange(incident.id, "resolved")
                              }
                              disabled={isUpdating}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isUpdating ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : (
                                "Resolve"
                              )}
                            </Button>
                          )}
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(incident.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(incident.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Incidents;
