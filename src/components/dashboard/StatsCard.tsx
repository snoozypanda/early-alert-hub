import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: 'default' | 'warning' | 'danger' | 'success';
}

const StatsCard = ({ title, value, icon: Icon, trend, variant = 'default' }: StatsCardProps) => {
  const variantStyles = {
    default: 'bg-primary/10 text-primary',
    warning: 'bg-chart-4/20 text-chart-4',
    danger: 'bg-destructive/10 text-destructive',
    success: 'bg-chart-1/20 text-chart-1',
  };

  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={cn('text-xs', trend.positive ? 'text-chart-1' : 'text-destructive')}>
                {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
              </p>
            )}
          </div>
          <div className={cn('p-3 rounded-lg', variantStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
