// Mock data for ISDREM application

export type UserRole =
  | "disaster-manager"
  | "administrator"
  | "incident-validator"
  | "response-team";

export interface Alert {
  id: string;
  type: string;
  area: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "monitoring" | "resolved";
  date: string;
  description: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  type: string;
  location: string;
  reportedBy: string;
  status: "pending" | "approved" | "rejected";
  priority: "low" | "medium" | "high" | "critical";
  date: string;
  description: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  name: string;
  type: "vehicle" | "equipment" | "personnel" | "supplies";
  quantity: number;
  status: "available" | "deployed" | "maintenance";
  location: string;
}

export interface Task {
  id: string;
  title: string;
  location: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "pending" | "accepted" | "in-progress" | "completed";
  assignedTo?: string;
  date: string;
}

export const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    type: "Flood",
    area: "Addis Ababa - Bole",
    severity: "high",
    status: "active",
    date: "2024-01-15",
    description:
      "Heavy rainfall expected, potential flooding in low-lying areas",
    createdAt: "2024-01-15",
  },
  {
    id: "ALT-002",
    type: "Earthquake",
    area: "Afar Region",
    severity: "critical",
    status: "active",
    date: "2024-01-14",
    description: "Seismic activity detected, magnitude 4.5",
    createdAt: "2024-01-14",
  },
  {
    id: "ALT-003",
    type: "Drought",
    area: "Somali Region",
    severity: "high",
    status: "monitoring",
    date: "2024-01-13",
    description: "Extended dry period affecting agricultural areas",
    createdAt: "2024-01-13",
  },
  {
    id: "ALT-004",
    type: "Landslide",
    area: "SNNPR - Wolaita",
    severity: "medium",
    status: "active",
    date: "2024-01-12",
    description: "Soil erosion risk due to recent rains",
    createdAt: "2024-01-12",
  },
  {
    id: "ALT-005",
    type: "Fire",
    area: "Oromia - Jimma",
    severity: "low",
    status: "resolved",
    date: "2024-01-11",
    description: "Forest fire contained and extinguished",
    createdAt: "2024-01-11",
  },
];

export const mockIncidents: Incident[] = [
  {
    id: "INC-001",
    type: "Building Collapse",
    location: "Addis Ababa",
    reportedBy: "Field Agent",
    status: "approved",
    priority: "high",
    date: "2024-01-15",
    description: "Forest fire contained and extinguished",
    createdAt: "2024-01-15",
  },
  {
    id: "INC-002",
    type: "Road Blockage",
    location: "Amhara Region",
    reportedBy: "Citizen",
    status: "pending",
    priority: "medium",
    date: "2024-01-14",
    description: "Forest fire contained and extinguished",
    createdAt: "2024-01-14",
  },
  {
    id: "INC-003",
    type: "Water Contamination",
    location: "Tigray Region",
    reportedBy: "Field Agent",
    status: "rejected",
    priority: "high",
    date: "2024-01-13",
    description: "Forest fire contained and extinguished",
    createdAt: "2024-01-13",
  },
];

export const mockResources: Resource[] = [
  {
    id: "RES-001",
    name: "Emergency Ambulance",
    type: "vehicle",
    quantity: 12,
    status: "available",
    location: "Central Station",
  },
  {
    id: "RES-002",
    name: "Fire Trucks",
    type: "vehicle",
    quantity: 8,
    status: "deployed",
    location: "Fire Station A",
  },
  {
    id: "RES-003",
    name: "Medical Kits",
    type: "supplies",
    quantity: 500,
    status: "available",
    location: "Warehouse B",
  },
  {
    id: "RES-004",
    name: "Rescue Teams",
    type: "personnel",
    quantity: 45,
    status: "available",
    location: "HQ",
  },
  {
    id: "RES-005",
    name: "Water Pumps",
    type: "equipment",
    quantity: 20,
    status: "maintenance",
    location: "Depot C",
  },
  {
    id: "RES-006",
    name: "Emergency Tents",
    type: "supplies",
    quantity: 200,
    status: "available",
    location: "Warehouse A",
  },
];

// export const mockTasks: Task[] = [
//   {
//     id: "TSK-001",
//     title: "Flood Assessment - Bole Area",
//     location: "Addis Ababa - Bole",
//     severity: "high",
//     status: "pending",
//     date: "2024-01-15",
//   },
//   {
//     id: "TSK-002",
//     title: "Evacuate Residents - Sector 7",
//     location: "Afar Region",
//     severity: "critical",
//     status: "accepted",
//     date: "2024-01-14",
//   },
//   {
//     id: "TSK-003",
//     title: "Distribute Water Supplies",
//     location: "Somali Region",
//     severity: "medium",
//     status: "in-progress",
//     date: "2024-01-13",
//   },
//   {
//     id: "TSK-004",
//     title: "Road Clearance Operation",
//     location: "SNNPR",
//     severity: "low",
//     status: "completed",
//     date: "2024-01-12",
//   },
// ];

export const mockChartData = {
  alertsByType: [
    { name: "Flood", value: 35 },
    { name: "Earthquake", value: 15 },
    { name: "Drought", value: 25 },
    { name: "Fire", value: 15 },
    { name: "Other", value: 10 },
  ],
  alertsByMonth: [
    { month: "Jul", alerts: 12 },
    { month: "Aug", alerts: 19 },
    { month: "Sep", alerts: 15 },
    { month: "Oct", alerts: 22 },
    { month: "Nov", alerts: 18 },
    { month: "Dec", alerts: 25 },
    { month: "Jan", alerts: 28 },
  ],
  responseTime: [
    { region: "Addis Ababa", time: 15 },
    { region: "Oromia", time: 28 },
    { region: "Amhara", time: 32 },
    { region: "SNNPR", time: 25 },
    { region: "Tigray", time: 35 },
  ],
};

export const safetyInstructions = [
  {
    id: 1,
    title: "Flood Safety",
    icon: "Droplets",
    instructions: [
      "Move to higher ground immediately",
      "Avoid walking through moving water",
      "Do not drive through flooded areas",
      "Keep emergency supplies ready",
    ],
  },
  {
    id: 2,
    title: "Earthquake Safety",
    icon: "Activity",
    instructions: [
      "Drop, Cover, and Hold On",
      "Stay away from windows and heavy objects",
      "If outdoors, move to an open area",
      "Be prepared for aftershocks",
    ],
  },
  {
    id: 3,
    title: "Fire Safety",
    icon: "Flame",
    instructions: [
      "Evacuate immediately if instructed",
      "Stay low to avoid smoke inhalation",
      "Cover nose and mouth with wet cloth",
      "Use designated evacuation routes",
    ],
  },
];

export const translations = {
  en: {
    dashboard: "Dashboard",
    alerts: "Alerts",
    reports: "Reports",
    resources: "Resources",
    analytics: "Analytics",
    settings: "Settings",
    login: "Login",
    register: "Register",
    logout: "Logout",
    search: "Search alerts, incidents...",
    activeAlerts: "Active Alerts",
    ongoingIncidents: "Ongoing Incidents",
    availableResources: "Available Resources",
    recentAlerts: "Recent Alerts",
    issueAlert: "Issue Alert",
    viewAll: "View All",
    broadcastAlert: "Broadcast Alert",
    donation: "Donation",
    users: "Users",
    log: "Log",
    // tasks: "Tasks",
    incidents: "Incidents",
  },
  am: {
    dashboard: "ዳሽቦርድ",
    alerts: "ማንቂያዎች",
    reports: "ሪፖርቶች",
    resources: "ሀብቶች",
    analytics: "ትንተና",
    settings: "ቅንብሮች",
    login: "ግባ",
    register: "ተመዝገብ",
    logout: "ውጣ",
    search: "ማንቂያዎችን፣ ክስተቶችን ይፈልጉ...",
    activeAlerts: "ንቁ ማንቂያዎች",
    ongoingIncidents: "በመካሄድ ላይ ያሉ ክስተቶች",
    availableResources: "የሚገኙ ሀብቶች",
    recentAlerts: "የቅርብ ማንቂያዎች",
    issueAlert: "ማንቂያ ይስጡ",
    viewAll: "ሁሉንም ይመልከቱ",
    tasks: "ተግባሮች",
    incidents: "ከስተቶች",
    broadcast: "ብሮድካስት ማንኪያዎች",
  },
};
export type TranslationKey = keyof typeof translations.en;
