import React, { useState, useEffect } from "react";
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
import { mockAlerts, Alert } from "@/lib/mockData";
import { useAlerts } from "@/contexts/AlertContext";

const EditAlert = () => {
  const { alertId } = useParams<{ alertId: string }>();
  const navigate = useNavigate();
  const { updateAlert } = useAlerts();

  const alert = mockAlerts.find((a) => a.id === alertId);
  const [formData, setFormData] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (alert) {
      setFormData({ ...alert });
    }
    setLoading(false);
  }, [alert]);

  const updateField = (key: keyof Alert, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      updateAlert(formData); // Actually update the alert in context
      navigate("/alerts"); // Navigate back to the alerts list
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-muted-foreground">Loading alert...</p>
      </DashboardLayout>
    );
  }

  if (!alert) {
    return (
      <DashboardLayout>
        <p className="text-red-500">
          Alert with ID <strong>{alertId}</strong> not found.
        </p>
      </DashboardLayout>
    );
  }

  if (!formData) return null; // Safety

  return (
    <DashboardLayout>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Alert</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Type"
              value={formData.type}
              onChange={(e) => updateField("type", e.target.value)}
            />

            <Input
              placeholder="Area"
              value={formData.area}
              onChange={(e) => updateField("area", e.target.value)}
            />

            <Select
              value={formData.severity}
              onValueChange={(value) =>
                updateField("severity", value as Alert["severity"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={formData.status}
              onValueChange={(value) =>
                updateField("status", value as Alert["status"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default EditAlert;
