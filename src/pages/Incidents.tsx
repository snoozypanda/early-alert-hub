import React, { useState } from "react";
import {
  AlertTriangle,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Loader,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  useIncidentsQuery,
  useCreateIncidentMutation,
  useUpdateIncidentMutation,
  useDeleteIncidentMutation,
} from "@/lib/api/incidents";
import { toast } from "sonner";
import { Incident } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";
const Incidents = () => {
  const { user } = useAuth();
  const { data: incidents = [], isLoading } = useIncidentsQuery();

  const { mutate: createIncident, isPending: isCreating } =
    useCreateIncidentMutation();
  const { mutate: updateIncident, isPending: isUpdating } =
    useUpdateIncidentMutation();
  const { mutate: deleteIncident, isPending: isDeleting } =
    useDeleteIncidentMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium" as Incident["severity"],
    status: "pending" as Incident["status"],
    area: "",
    attachment: "",
  });

  const isIncidentValidator = user?.roles?.some(
    (role) => role.toUpperCase() === "INCIDENT VALIDATOR",
  );
  const navigate = useNavigate();
  // const handleCreate = () => {
  //   if (!formData.title || !formData.description) {
  //     toast.error("Title and description are required");
  //     return;
  //   }

  //   createIncident(
  //     {
  //       title: formData.title,
  //       description: formData.description,
  //       status: formData.status,
  //       area: formData.area,
  //       attachment: formData.attachment,
  //     },
  //     {
  //       onSuccess: () => {
  //         toast.success("Incident created successfully");
  //         setIsCreateOpen(false);
  //         setFormData({
  //           title: "",
  //           description: "",
  //           severity: "medium",
  //           status: "pending",
  //           area: "",
  //           attachment: "",
  //         });
  //       },
  //       onError: (error: unknown) => {
  //         toast.error("Failed to create incident");
  //       },
  //     },
  //   );
  // };

  const handleStatusChange = (
    incidentId: number,
    newStatus: Incident["status"],
  ) => {
    if (!isIncidentValidator) {
      toast.error("Only Incident Validators can change status");
      return;
    }

    updateIncident(
      { id: incidentId, data: { status: newStatus } },
      {
        onSuccess: () =>
          toast.success(`Incident status changed to ${newStatus}`),
        onError: () => toast.error("Failed to update incident"),
      },
    );
  };

  const handleDelete = (incidentId: number) => {
    if (!confirm("Delete this incident permanently?")) return;

    deleteIncident(incidentId, {
      onSuccess: () => toast.success("Incident deleted successfully"),
      onError: () => toast.error("Failed to delete incident"),
    });
  };

  const getSeverityColor = (severity: Incident["severity"]) => {
    const colors = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    };
    return colors[severity];
  };

  const getStatusColor = (status: Incident["status"]) => {
    const colors = {
      pending: "bg-gray-100 text-gray-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  const getStatusIcon = (status: Incident["status"]) => {
    const iconClass = "h-4 w-4";
    switch (status) {
      case "pending":
        return <Clock className={iconClass} />;
      case "approved":
        return <CheckCircle className={iconClass} />;
      case "rejected":
        return <AlertTriangle className={iconClass} />;
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
            <h1 className="text-3xl font-bold">Incidents</h1>
            <p className="text-muted-foreground">
              Manage and monitor incident reports
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              {/* <Button>Create Incident</Button> */}
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Incident</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Description *</Label>
                  <textarea
                    className="w-full rounded-md border px-3 py-2"
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Severity</Label>
                  <select
                    className="w-full rounded-md border px-3 py-2"
                    value={formData.severity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        severity: e.target.value as Incident["severity"],
                      })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                {/* <Button
                 onClick={handleCreate} disabled={isCreating}>
                  {isCreating && (
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Create Incident
                </Button> */}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Incident List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader className="h-8 w-8 animate-spin" />
          </div>
        ) : incidents.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center text-muted-foreground">
              No incidents found
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {incidents.map((incident) => (
              <Card key={incident.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between">
                    <div>
                      <div className="flex gap-2 mb-2">
                        <h3 className="font-semibold">{incident.title}</h3>
                        <Badge
                          className={getSeverityColor(
                            incident.severity as Incident["severity"],
                          )}
                        >
                          {incident.severity}
                        </Badge>

                        <Badge
                          className={getStatusColor(
                            incident.status as Incident["status"],
                          )}
                        >
                          <span className="flex gap-1 items-center">
                            {getStatusIcon(
                              incident.status as Incident["status"],
                            )}
                            {incident.status}
                          </span>
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {incident.description}
                      </p>

                      <p className="text-sm">
                        <span className="text-muted-foreground">Area: </span>
                        {incident.area}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {isIncidentValidator && incident.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(incident.id, "approved")
                          }
                        >
                          Approve
                        </Button>
                      )}

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

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          navigate("/incidents/edit/${incident.id}")
                        }
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Edit2 className="h-4 w-4" />
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
