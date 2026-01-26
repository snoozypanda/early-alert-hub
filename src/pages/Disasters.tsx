import React, { useState } from "react";
import {
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Zap,
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
  useDisastersQuery,
  useCreateDisasterMutation,
  useUpdateDisasterMutation,
  useDeleteDisasterMutation,
} from "@/lib/api/disasters";
import { toast } from "sonner";

const Disasters = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { data: disasters = [], isLoading } = useDisastersQuery();
  const { mutate: createDisaster, isPending: isCreating } =
    useCreateDisasterMutation();
  const { mutate: updateDisaster, isPending: isUpdating } =
    useUpdateDisasterMutation();
  const { mutate: deleteDisaster, isPending: isDeleting } =
    useDeleteDisasterMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    disasterID: "",
    scope: "",
    status: "inactive",
    affectedPopulation: 0,
    incidentId: "",
    attachments: [],
  });

  const isDisasterManager = user?.roles?.some(
    (role) => role.toUpperCase() === "DISASTER MANAGER"
  );

  const handleCreate = () => {
    if (!formData.disasterID || !formData.scope) {
      toast.error("Disaster ID and Scope are required");
      return;
    }

    createDisaster(
      {
        disasterID: formData.disasterID,
        scope: formData.scope,
        status: formData.status,
        affectedPopulation: formData.affectedPopulation,
        incidentId: formData.incidentId,
        attachments: formData.attachments,
      },
      {
        onSuccess: () => {
          toast.success("Disaster created successfully");
          setIsCreateOpen(false);
          setFormData({
            disasterID: "",
            scope: "",
            status: "inactive",
            affectedPopulation: 0,
            incidentId: "",
            attachments: [],
          });
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Failed to create disaster"
          );
        },
      }
    );
  };

  const handleStatusChange = (disasterId: number, newStatus: string) => {
    if (!isDisasterManager) {
      toast.error("Only Disaster Managers can change disaster status");
      return;
    }

    updateDisaster(
      { id: disasterId, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success(`Disaster status changed to ${newStatus}`);
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Failed to update disaster"
          );
        },
      }
    );
  };

  const handleDelete = (disasterId: number) => {
    if (
      confirm(
        "Are you sure you want to delete this disaster? This action cannot be undone."
      )
    ) {
      deleteDisaster(disasterId, {
        onSuccess: () => {
          toast.success("Disaster deleted successfully");
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Failed to delete disaster"
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
      active: "bg-red-100 text-red-800",
      inactive: "bg-gray-100 text-gray-800",
      mitigated: "bg-green-100 text-green-800",
    };
    return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Disasters</h1>
            <p className="text-muted-foreground">
              Manage and monitor active disasters
            </p>
          </div>
          {isDisasterManager && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Disaster
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Disaster</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="disasterID">Disaster ID *</Label>
                    <Input
                      id="disasterID"
                      value={formData.disasterID}
                      onChange={(e) =>
                        setFormData({ ...formData, disasterID: e.target.value })
                      }
                      placeholder="Unique disaster identifier"
                    />
                  </div>
                  <div>
                    <Label htmlFor="scope">Scope *</Label>
                    <Input
                      id="scope"
                      value={formData.scope}
                      onChange={(e) =>
                        setFormData({ ...formData, scope: e.target.value })
                      }
                      placeholder="Geographic scope of disaster"
                    />
                  </div>
                  <div>
                    <Label htmlFor="affectedPopulation">
                      Affected Population
                    </Label>
                    <Input
                      id="affectedPopulation"
                      type="number"
                      value={formData.affectedPopulation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          affectedPopulation: parseInt(e.target.value),
                        })
                      }
                      placeholder="Number of affected people"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="inactive">Inactive</option>
                      <option value="active">Active</option>
                      <option value="mitigated">Mitigated</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="incidentId">Incident ID (optional)</Label>
                    <Input
                      id="incidentId"
                      value={formData.incidentId}
                      onChange={(e) =>
                        setFormData({ ...formData, incidentId: e.target.value })
                      }
                      placeholder="Link to incident"
                    />
                  </div>
                  <Button
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="w-full"
                  >
                    {isCreating && (
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Create Disaster
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Disasters List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : disasters.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No disasters found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {disasters.map((disaster) => (
              <Card key={disaster.id} className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {disaster.title}
                        </h3>
                        <Badge
                          className={getSeverityColor(
                            disaster.severityLevel
                          )}
                        >
                          {disaster.severityLevel.charAt(0).toUpperCase() +
                            disaster.severityLevel.slice(1)}
                        </Badge>
                        <Badge className={getStatusColor(disaster.status)}>
                          <span className="flex items-center gap-1">
                            {disaster.status === "active" && (
                              <Zap className="h-3 w-3" />
                            )}
                            {disaster.status.charAt(0).toUpperCase() +
                              disaster.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {disaster.description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Scope</p>
                          <p className="font-medium">{disaster.scope}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Affected Population
                          </p>
                          <p className="font-medium">
                            {disaster.affectedPopulation?.toLocaleString() || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Started</p>
                          <p className="font-medium">
                            {new Date(disaster.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Issued By</p>
                          <p className="font-medium">
                            {disaster.issuedBy?.name || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {isDisasterManager && (
                        <>
                          {disaster.status === "inactive" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusChange(disaster.id, "active")
                              }
                              disabled={isUpdating}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {isUpdating ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : (
                                "Activate"
                              )}
                            </Button>
                          )}
                          {disaster.status === "active" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatusChange(disaster.id, "mitigated")
                              }
                              disabled={isUpdating}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isUpdating ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : (
                                "Mitigate"
                              )}
                            </Button>
                          )}
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {}}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {isDisasterManager && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(disaster.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
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

export default Disasters;
