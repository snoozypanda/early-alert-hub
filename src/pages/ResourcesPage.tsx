import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package, MapPin, Truck, Users, Box, Wrench } from 'lucide-react';
import { mockResources } from '@/lib/mockData';
import MapPlaceholder from '@/components/dashboard/MapPlaceholder';
import { cn } from '@/lib/utils';

const ResourcesPage = () => {
  const typeIcons = {
    vehicle: Truck,
    equipment: Wrench,
    personnel: Users,
    supplies: Box,
  };

  const statusColors = {
    available: 'bg-chart-1/20 text-chart-1',
    deployed: 'bg-chart-4/20 text-chart-4',
    maintenance: 'bg-destructive/20 text-destructive',
  };

  const resourcesByType = {
    vehicle: mockResources.filter(r => r.type === 'vehicle'),
    equipment: mockResources.filter(r => r.type === 'equipment'),
    personnel: mockResources.filter(r => r.type === 'personnel'),
    supplies: mockResources.filter(r => r.type === 'supplies'),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Resources Management
            </h1>
            <p className="text-muted-foreground">Track and manage emergency resources</p>
          </div>
          <Button>
            <Package className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>

        {/* Resource Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(resourcesByType).map(([type, resources]) => {
            const Icon = typeIcons[type as keyof typeof typeIcons];
            const available = resources.filter(r => r.status === 'available').length;
            return (
              <Card key={type} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground capitalize">{type}</p>
                      <p className="text-2xl font-bold text-foreground">{resources.length}</p>
                      <p className="text-xs text-chart-1">{available} available</p>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resource Map */}
          <MapPlaceholder title="Resource Locations" height="h-[400px]" />

          {/* Resource Table */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">All Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockResources.map((resource) => {
                    const Icon = typeIcons[resource.type];
                    return (
                      <TableRow key={resource.id} className="border-border">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{resource.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{resource.type}</TableCell>
                        <TableCell>{resource.quantity}</TableCell>
                        <TableCell>
                          <Badge className={cn('text-xs', statusColors[resource.status])}>
                            {resource.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {resource.location}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResourcesPage;
