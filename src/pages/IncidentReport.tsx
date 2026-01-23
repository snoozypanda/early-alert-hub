import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Edit, X, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, MapPin, Upload, Camera, Send } from "lucide-react";
import MapPlaceholder from "@/components/dashboard/MapPlaceholder";
import { mockIncidents } from "@/lib/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const IncidentReport = () => {
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 5;
  const [formData, setFormData] = useState({
    incidentType: "",
    location: "",
    description: "",
  });
  const statusColors = {
    active: "bg-destructive/10 text-destructive",
    monitoring: "bg-chart-4/10 text-chart-4",
    resolved: "bg-chart-1/10 text-chart-1",
  };
  const filteredIncidents = mockIncidents.filter((incident) => {
    // const matchesSeverity =
    //   filterSeverity === "all" || incident.severity === filterSeverity;
    const matchesStatus =
      filterStatus === "all" || incident.status === filterStatus;
    const matchesSearch =
      incident.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

  const paginatedIncidents = filteredIncidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Incident report submitted (UI demo)");
  };
  const severityColors = {
    low: "bg-chart-1/20 text-chart-1 border-chart-1/30",
    medium: "bg-chart-4/20 text-chart-4 border-chart-4/30",
    high: "bg-destructive/20 text-destructive border-destructive/30",
    critical: "bg-destructive text-destructive-foreground",
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

        {/* {/* Alerts Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">
              All Incidents ({filteredIncidents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.map((incident) => (
                  <TableRow key={incident.id} className="border-border">
                    <TableCell className="font-mono text-sm">
                      {incident.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {incident.type}
                    </TableCell>
                    <TableCell>{incident.location}</TableCell>
                    <TableCell>
                      {/* <Badge
                        className={cn(
                          "text-xs",
                          severityColors[incident.severity]
                        )}
                      > */}
                      {incident.reportedBy}
                      {/* </Badge> */}
                    </TableCell>
                    <TableCell>{incident.status}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", statusColors[incident.status])}
                      >
                        {incident.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{incident.date}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          navigate(`/incidents/view/${incident.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  return (
                    <Button
                      key={page}
                      size="sm"
                      variant={page === currentPage ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}

                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default IncidentReport;
