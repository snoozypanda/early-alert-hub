// EditIncidentValidator.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAlerts } from "@/contexts/AlertContext";
import { Incident, mockIncidents } from "@/lib/mockData";

const EditIncidentValidator = () => {
  const { incidentId } = useParams<{ incidentId: string }>();
  const navigate = useNavigate();
  const { createAlertFromIncident } = useAlerts();

  // Find the incident
  const incident = mockIncidents.find((i) => i.id === incidentId);

  // Form state
  const [formData, setFormData] = useState<Incident | null>(null);

  useEffect(() => {
    if (incident) setFormData({ ...incident });
  }, [incident]);

  // Update a field
  const updateField = <K extends keyof Incident>(
    key: K,
    value: Incident[K],
  ) => {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    // If approved, create alert
    if (formData.status === "approved") {
      createAlertFromIncident(formData);
      navigate("/alerts");
    } else {
      navigate("/incidents");
    }
  };

  if (!formData) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Incident not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Validate Incident</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Read-only info */}
            <div className="space-y-1">
              <label htmlFor="title">Title</label>
              <Input value={formData.title} readOnly placeholder="Title" />
            </div>
            <div className="space-y-1">
              <label htmlFor="description">Description</label>
              <Textarea
                value={formData.description}
                readOnly
                placeholder="Description"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="area">Area</label>
              <Input value={formData.area} readOnly placeholder="Area" />
            </div>
            <div className="space-y-1">
              <label htmlFor="status">Status</label>
              {/* Editable fields */}
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  updateField("status", value as Incident["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label htmlFor="severity">Severity</label>

              <Select
                value={formData.severity}
                onValueChange={(value) =>
                  updateField("severity", value as Incident["severity"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <img src={incident.attachment}></img>
            </div>
            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit">Confirm Decision</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default EditIncidentValidator;
