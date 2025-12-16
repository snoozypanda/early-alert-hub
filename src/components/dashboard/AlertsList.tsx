import React from 'react';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface AlertsListProps {
  alerts: Alert[];
  title?: string;
  showViewAll?: boolean;
}

const AlertsList = ({ alerts, title = 'Recent Alerts', showViewAll = true }: AlertsListProps) => {
  const severityColors = {
    low: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
    medium: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
    high: 'bg-destructive/20 text-destructive border-destructive/30',
    critical: 'bg-destructive text-destructive-foreground border-destructive',
  };

  const statusColors = {
    active: 'bg-destructive/10 text-destructive',
    monitoring: 'bg-chart-4/10 text-chart-4',
    resolved: 'bg-chart-1/10 text-chart-1',
  };

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        {showViewAll && (
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              'p-4 rounded-lg border transition-colors hover:bg-accent/50',
              'border-border'
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={cn('text-xs', severityColors[alert.severity])}>
                    {alert.severity}
                  </Badge>
                  <Badge variant="outline" className={cn('text-xs', statusColors[alert.status])}>
                    {alert.status}
                  </Badge>
                </div>
                <h4 className="font-medium text-foreground">{alert.type}</h4>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {alert.area}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {alert.date}
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{alert.id}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AlertsList;
