import React from 'react';
import { Map, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MapPlaceholderProps {
  title?: string;
  height?: string;
}

const MapPlaceholder = ({ title = 'GIS Map View', height = 'h-[400px]' }: MapPlaceholderProps) => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`${height} bg-accent/30 rounded-lg flex flex-col items-center justify-center border border-dashed border-border`}>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            <Map className="h-16 w-16 text-primary/40 relative" />
          </div>
          <p className="mt-4 text-muted-foreground font-medium">Interactive Map Area</p>
          <p className="text-sm text-muted-foreground">GIS integration placeholder</p>
          
          {/* Fake map markers */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-1 text-xs text-destructive">
              <MapPin className="h-4 w-4" />
              <span>3 Critical</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-chart-4">
              <MapPin className="h-4 w-4" />
              <span>5 High</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-chart-1">
              <MapPin className="h-4 w-4" />
              <span>8 Medium</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapPlaceholder;
