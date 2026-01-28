import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockAlerts } from "@/lib/mockData";

const ViewAlert = () => {
  const { alertId } = useParams<{ alertId: string }>();
  const navigate = useNavigate();

  const alert = mockAlerts.find((a) => a.id === alertId);

  if (!alert) {
    return (
      <DashboardLayout>
        <p className="text-red-500">
          Alert with ID <strong>{alertId}</strong> not found.
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>View Alert</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="id">Alert Id</label>{" "}
            <Input value={alert.id} disabled />
          </div>
          <div className="space-y-1">
            {" "}
            <label htmlFor="type">Alert </label>{" "}
            <Input value={alert.type} disabled />
          </div>
          <div className="space-y-1">
            {" "}
            <label htmlFor="area">Area</label>{" "}
            <Input value={alert.area} disabled />
          </div>
          <div className="space-y-1">
            <label htmlFor="severity">Severity</label>{" "}
            <Input value={alert.severity} disabled />
          </div>
          <div className="space-y-1">
            <label htmlFor="status">Status</label>{" "}
            <Input value={alert.status} disabled />
          </div>
          <div className="space-y-1">
            <label htmlFor="date">Date</label>{" "}
            <Input value={alert.date} disabled />
          </div>
          <div className="space-y-1">
            <label htmlFor="description">Description</label>
            <Textarea value={alert.description} disabled />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ViewAlert;
