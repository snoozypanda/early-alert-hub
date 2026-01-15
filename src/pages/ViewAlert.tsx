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
          <Input value={alert.id} disabled />
          <Input value={alert.type} disabled />
          <Input value={alert.area} disabled />
          <Input value={alert.severity} disabled />
          <Input value={alert.status} disabled />
          <Input value={alert.date} disabled />

          <Textarea value={alert.description} disabled />

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
