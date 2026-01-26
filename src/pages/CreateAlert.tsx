import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, Map, Send } from 'lucide-react';
import MapPlaceholder from '@/components/dashboard/MapPlaceholder';
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";

const CreateAlert = () => {
  const [severity, setSeverity] = useState([50]);
  const [formData, setFormData] = useState({
    disasterType: '',
    title: '',
    description: '',
    affectedArea: '',
  });

  const getSeverityLabel = (value: number) => {
    if (value < 25) return { label: 'Low', color: 'text-chart-1' };
    if (value < 50) return { label: 'Medium', color: 'text-chart-4' };
    if (value < 75) return { label: 'High', color: 'text-destructive' };
    return { label: 'Critical', color: 'text-destructive font-bold' };
  };

  const severityInfo = getSeverityLabel(severity[0]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Need latitude/longitude for Incident. UI doesn't have it easily (has map placeholder).
  // We will default to 0,0 or add hidden fields if we wanted to be precise.
  // For now, hardcode 0,0 as placeholder.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        // 1. Create Incident
        // Map Severity Slider 0-100 to low/medium/high/critical
        let severityLevel = "low";
        const val = severity[0];
        if (val >= 25) severityLevel = "medium";
        if (val >= 50) severityLevel = "high";
        if (val >= 75) severityLevel = "critical";

        // Construct description with type
        const fullDescription = `[${formData.disasterType}] ${formData.description}. Area: ${formData.affectedArea}`;

        const incidentPayload = {
            title: formData.title,
            description: fullDescription,
            latitude: 0, // Placeholder
            longitude: 0, // Placeholder
            severityLevel: severityLevel,
            attachments: []
        };

        const incidentRes = await api.post("/incident", incidentPayload);
        const incidentId = incidentRes.data.data.id;

        // 2. Create Disaster linked to Incident
        // Generate a random disasterID or use timestamp
        const disasterID = `DIS-${Date.now()}`;
        
        const disasterPayload = {
            disasterID: disasterID,
            scope: formData.affectedArea,
            status: "active", // Default status
            affectedPopulation: 0, // Default as UI doesn't have it
            incidentId: incidentId.toString(), // Ensure string if API expects string
            attachments: []
        };

        await api.post("/disaster", disasterPayload);

        toast.success("Alert issued successfully", {
            description: "Incident and Disaster records created."
        });
        navigate("/alerts");

    } catch (error: any) {
        console.error("Failed to issue alert", error);
        toast.error("Failed to issue alert", {
           description: error.response?.data?.error?.message || "Unknown error occurred" 
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-primary" />
            Issue Early Warning
          </h1>
          <p className="text-muted-foreground">Create and broadcast a new disaster alert</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Alert Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="disasterType">Disaster Type</Label>
                  <Select
                    value={formData.disasterType}
                    onValueChange={(value) => setFormData({ ...formData, disasterType: value })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select disaster type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="flood">Flood</SelectItem>
                      <SelectItem value="earthquake">Earthquake</SelectItem>
                      <SelectItem value="drought">Drought</SelectItem>
                      <SelectItem value="landslide">Landslide</SelectItem>
                      <SelectItem value="fire">Fire</SelectItem>
                      <SelectItem value="epidemic">Epidemic</SelectItem>
                      <SelectItem value="storm">Storm / Cyclone</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Alert Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief alert title"
                    className="bg-background"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Severity Level</Label>
                    <span className={severityInfo.color}>{severityInfo.label}</span>
                  </div>
                  <Slider
                    value={severity}
                    onValueChange={setSeverity}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                    <span>Critical</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Affected Area</Label>
                  <Input
                    id="area"
                    placeholder="Region, zone, or specific location"
                    className="bg-background"
                    value={formData.affectedArea}
                    onChange={(e) => setFormData({ ...formData, affectedArea: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about the alert..."
                    className="bg-background min-h-[120px]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Issue Alert
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  Select Affected Area
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-accent/30 rounded-lg flex items-center justify-center border border-dashed border-border">
                  <div className="text-center">
                    <Map className="h-12 w-12 text-primary/40 mx-auto mb-2" />
                    <p className="text-muted-foreground">Click on map to select area</p>
                    <p className="text-sm text-muted-foreground">Draw polygon for custom region</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Broadcast Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <span className="text-sm">SMS Broadcast</span>
                  <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <span className="text-sm">Push Notifications</span>
                  <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <span className="text-sm">Email Notifications</span>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <span className="text-sm">Radio Broadcast</span>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateAlert;
