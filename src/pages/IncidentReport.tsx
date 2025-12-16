import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, MapPin, Upload, Camera, Send } from 'lucide-react';
import MapPlaceholder from '@/components/dashboard/MapPlaceholder';

const IncidentReport = () => {
  const [formData, setFormData] = useState({
    incidentType: '',
    location: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Incident report submitted (UI demo)');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Report Incident
          </h1>
          <p className="text-muted-foreground">Submit a new incident report</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Incident Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="incidentType">Incident Type</Label>
                  <Select
                    value={formData.incidentType}
                    onValueChange={(value) => setFormData({ ...formData, incidentType: value })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="flood">Flood / Water Damage</SelectItem>
                      <SelectItem value="collapse">Building Collapse</SelectItem>
                      <SelectItem value="fire">Fire</SelectItem>
                      <SelectItem value="road">Road Blockage</SelectItem>
                      <SelectItem value="medical">Medical Emergency</SelectItem>
                      <SelectItem value="utilities">Utility Failure</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Enter location or use GPS"
                      className="bg-background pl-10"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    Use Current Location
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the incident in detail..."
                    className="bg-background min-h-[120px]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Media Upload */}
                <div className="space-y-2">
                  <Label>Attach Media</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-accent/50 cursor-pointer transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload Files</p>
                      <p className="text-xs text-muted-foreground">Images, videos, documents</p>
                    </div>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-accent/50 cursor-pointer transition-colors">
                      <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Take Photo</p>
                      <p className="text-xs text-muted-foreground">Use camera</p>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Submit Report
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Mark Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-accent/30 rounded-lg flex items-center justify-center border border-dashed border-border">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary/40 mx-auto mb-2" />
                    <p className="text-muted-foreground">Click on map to mark incident location</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Provide accurate location information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Include photos if safe to take them
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Describe any immediate dangers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Note approximate number of affected people
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Stay safe - do not put yourself at risk
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IncidentReport;
