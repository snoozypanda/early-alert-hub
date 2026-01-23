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
import { Incident, mockIncidents } from "@/lib/mockData";
import { useAlerts } from "@/contexts/AlertContext";

const EditIncidentValidator = () => {
  const { incidentId } = useParams<{ incidentId: string }>();
  const navigate = useNavigate();
  const { createAlertFromIncident } = useAlerts();

  const incident = mockIncidents.find((i) => i.id === incidentId);

  const [formData, setFormData] = useState<Incident | null>(null);

  useEffect(() => {
    if (incident) {
      setFormData({ ...incident });
    }
  }, [incident]);

  const updateField = <K extends keyof Incident>(
    key: K,
    value: Incident[K],
  ) => {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    // Approval → Alert creation
    if (formData.status === "approved") {
      createAlertFromIncident(formData);
      navigate("/alerts");
      return;
    }

    navigate("/incidents");
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
            {/* Read-only fields */}
            <Input value={formData.type} readOnly />
            <Input value={formData.location} readOnly />
            <Input value={formData.reportedBy} readOnly />
            <Textarea value={formData.description} readOnly />

            {/* Validator controls */}
            <Select
              value={formData.status}
              onValueChange={(value) =>
                updateField("status", value as Incident["status"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Validation status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={formData.priority}
              onValueChange={(value) =>
                updateField("priority", value as Incident["priority"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

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
