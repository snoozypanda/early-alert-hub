import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Droplets, Activity, Flame, Wind, Thermometer } from 'lucide-react';

const safetyData = [
  {
    id: 1,
    title: 'Flood Safety',
    icon: Droplets,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    instructions: [
      'Move to higher ground immediately if you notice rising water levels',
      'Never walk, swim, or drive through flood waters',
      'Stay off bridges over fast-moving water',
      'Evacuate if told to do so',
      'Disconnect electrical appliances if safe to do so',
      'Keep emergency supplies in a waterproof container',
    ],
  },
  {
    id: 2,
    title: 'Earthquake Safety',
    icon: Activity,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    instructions: [
      'DROP to your hands and knees',
      'Take COVER under a sturdy desk or table',
      'HOLD ON until the shaking stops',
      'Stay away from windows and heavy furniture',
      'If outdoors, move away from buildings and power lines',
      'Be prepared for aftershocks',
    ],
  },
  {
    id: 3,
    title: 'Fire Safety',
    icon: Flame,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    instructions: [
      'Get out immediately - do not stop to gather belongings',
      'Stay low to the ground if there is smoke',
      'Feel doors before opening - if hot, find another way out',
      'Cover your nose and mouth with a wet cloth',
      'Never use elevators during a fire',
      'Meet at your designated meeting place',
    ],
  },
  {
    id: 4,
    title: 'Drought Preparedness',
    icon: Thermometer,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    instructions: [
      'Store water for emergency use',
      'Fix any leaks in your home',
      'Use water-efficient appliances',
      'Water plants during cooler parts of the day',
      'Follow local water restrictions',
      'Have backup water sources identified',
    ],
  },
  {
    id: 5,
    title: 'Windstorm Safety',
    icon: Wind,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    instructions: [
      'Stay indoors and away from windows',
      'Secure loose outdoor objects',
      'Identify the safest room in your home',
      'Keep emergency supplies ready',
      'Monitor weather updates regularly',
      'Have a battery-powered radio available',
    ],
  },
];

const SafetyPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Safety Information
          </h1>
          <p className="text-muted-foreground">Essential safety guidelines for various emergencies</p>
        </div>

        {/* Emergency Contacts */}
        <Card className="border-border bg-destructive/5 border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-destructive font-bold">Emergency Hotline:</span>
                <span className="text-2xl font-bold text-destructive">911</span>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Disaster Management:</span>
                <span className="font-medium text-foreground">+251-XXX-XXXX</span>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Red Cross:</span>
                <span className="font-medium text-foreground">+251-XXX-XXXX</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safetyData.map((item) => (
            <Card key={item.id} className="border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {item.instructions.map((instruction, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Kit */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Emergency Kit Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { category: 'Water & Food', items: ['Water (1 gallon per person per day)', 'Non-perishable food', 'Manual can opener', 'Eating utensils'] },
                { category: 'First Aid', items: ['First aid kit', 'Prescription medications', 'Pain relievers', 'Bandages and gauze'] },
                { category: 'Tools & Safety', items: ['Flashlight', 'Battery-powered radio', 'Extra batteries', 'Multi-tool or knife'] },
                { category: 'Documents & Money', items: ['ID copies', 'Insurance documents', 'Cash in small bills', 'Emergency contact list'] },
              ].map((section) => (
                <div key={section.category} className="p-4 rounded-lg border border-border">
                  <h4 className="font-medium text-foreground mb-2">{section.category}</h4>
                  <ul className="space-y-1">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <input type="checkbox" className="h-4 w-4 rounded border-border" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SafetyPage;
