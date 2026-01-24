import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Edit, X, Eye, FileText, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Incident, BaseGenericApiResponse } from "@/types/api";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const IncidentReport = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // New incident form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    latitude: 0,
    longitude: 0,
    severityLevel: "low",
    attachments: [] as string[],
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["incidents", currentPage],
    queryFn: async () => {
      // Backend supports limit & offset but let's stick to getting all for now or simple pagination if supported
      // Using arbitrary limit for now or just fetching default
      const res = await api.get<BaseGenericApiResponse<Incident[]>>(`/incident?limit=${itemsPerPage}&offset=${(currentPage - 1) * itemsPerPage}`);
      return res.data;
    },
  });
  
  const incidents = data?.data || [];
  // Note: Backend might retrieve a { meta: { total: number }, data: [] } 
  // but the prompt example says:
  // GET /api/v1/incident
  // Response: { meta: {}, data: [...] }
  // It doesn't explicitly show total count in meta. I'll assume simple pagination or client-side calculation if total is missing,
  // but for server-side pagination efficiently we need total count.
  // For now, I will assume the list is just the page.
  
  const statusColors: Record<string, string> = {
    active: "bg-destructive/10 text-destructive",
    pending: "bg-yellow-500/10 text-yellow-600",
    monitoring: "bg-blue-500/10 text-blue-600",
    resolved: "bg-green-500/10 text-green-600",
    approved: "bg-green-500/10 text-green-600",
    rejected: "bg-red-500/10 text-red-600",
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/incident", formData);
      toast.success("Incident reported successfully");
      setIsDialogOpen(false);
      setFormData({
         title: "",
         description: "",
         latitude: 0,
         longitude: 0,
         severityLevel: "low",
         attachments: [],
      });
      refetch();
    } catch (error: any) {
      toast.error("Failed to create incident", {
        description: error.response?.data?.error?.message || "Unknown error",
      });
    }
  };

  const severityColors: Record<string, string> = {
    low: "bg-green-500/20 text-green-600 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
    high: "bg-orange-500/20 text-orange-600 border-orange-500/30",
    critical: "bg-destructive text-destructive-foreground",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Incidents
            </h1>
            <p className="text-muted-foreground">Manage and report incidents</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Report Incident
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Report New Incident</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                            id="title" 
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                            id="description" 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                            required 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="lat">Latitude</Label>
                            <Input 
                                id="lat" 
                                type="number" 
                                step="any"
                                value={formData.latitude} 
                                onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="long">Longitude</Label>
                            <Input 
                                id="long" 
                                type="number" 
                                step="any"
                                value={formData.longitude} 
                                onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})} 
                                required 
                            />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="severity">Severity</Label>
                        <Select 
                            value={formData.severityLevel} 
                            onValueChange={(val) => setFormData({...formData, severityLevel: val})}
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
                    </div>
                    <Button type="submit" className="w-full">Submit Report</Button>
                </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">
              All Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="text-center py-4">Loading incidents...</div>
            ) : (
            <>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No incidents found.
                        </TableCell>
                    </TableRow>
                )}
                {incidents.map((incident) => (
                  <TableRow key={incident.id} className="border-border">
                    <TableCell className="font-mono text-sm">
                      {incident.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {incident.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs",
                          severityColors[incident.severityLevel?.toLowerCase()] || severityColors.low
                        )}
                      >
                        {incident.severityLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {incident.reportedBy?.name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", statusColors[incident.status?.toLowerCase()] || "bg-gray-100")}
                      >
                        {incident.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                        {incident.reportDate ? format(new Date(incident.reportDate), "MMM dd, yyyy") : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          navigate(`/incidents/edit/${incident.id}`)
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Simple Pagination Controls */}
             <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="text-sm">Page {currentPage}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={incidents.length < itemsPerPage}
                >
                  Next
                </Button>
              </div>
            </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default IncidentReport;
