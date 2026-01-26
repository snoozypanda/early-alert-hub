# Dashboard Role-Based Access & Navigation

## Overview
Each user role has a dedicated dashboard view with quick-access buttons to manage their role-specific features.

---

## Dashboard Views & Accessible Features

### 1. Disaster Manager Dashboard
**Route:** `/dashboard`

**Features:**
- 📊 Real-time disaster monitoring
- 📈 Active disasters count
- ⏳ Pending incidents overview
- 📦 Available resources count
- 📉 Disaster severity pie chart
- 📊 Monthly disaster trends

**Quick Access Buttons:**
- **Manage Disasters** → `/disasters`
  - Create new disasters
  - Activate disasters
  - Mitigate disasters
  - Delete disasters
- **Issue Alert** → Broadcast alerts to public

**Stats Displayed:**
- Active disasters (danger badge)
- Pending incidents (warning badge)
- Available resources (success badge)

**Charts:**
- Disasters by severity (pie chart)
- Monthly disaster trends (bar chart)

---

### 2. Incident Validator Dashboard
**Route:** `/dashboard`

**Features:**
- 📋 Incident validation overview
- ⏳ Pending review count
- ✅ Approved incidents count
- 📊 Total incidents count
- 🗺️ Current location map
- 📋 Task assignment area

**Quick Access Buttons:**
- **View All Incidents** → `/incidents`
  - View all incident reports
  - Change incident status (Pending → Active → Resolved)
  - Edit incident details
  - Delete incidents

**Stats Displayed:**
- Pending review (warning badge)
- Approved incidents (danger badge)
- Total incidents (success badge)

**Additional Features:**
- Tasks list (placeholder for future implementation)
- Map view of incident locations

---

### 3. Emergency Response Team Dashboard
**Route:** `/dashboard`

**Features:**
- 🚨 Active disaster alerts
- 📦 Resource management
- 📊 Analytics overview
- 🛡️ Safety instructions

**Quick Access Buttons:**
- **View Resources** → `/resources`
  - Check resource availability
  - View current inventory
  - Monitor deployment status
  - Report resource updates

**Active Alerts Display:**
- Lists all active disasters
- Shows disaster scope
- Displays severity levels
- Shows start date

**Additional Features:**
- Safety instructions panel
- Flood safety guidelines
- Fire safety guidelines
- Water quality guidelines

---

### 4. System Administrator Dashboard
**Route:** `/dashboard`

**Features:**
- 🏢 System-wide overview
- 👥 User management
- 📝 System logs
- 🚨 Active disaster alerts
- 🛡️ Safety instructions

**Quick Access Buttons:**
- **Manage Users** → `/users`
  - View all users
  - Manage user accounts
  - Assign/revoke roles
  - Create new users
  - Disable/enable accounts

**Active Alerts Display:**
- System-wide disaster overview
- Tracks active disasters
- Shows severity and scope

**Additional Features:**
- Safety instructions for public
- System audit logs (to be implemented)

---

### 5. Executive / Decision Maker Dashboard
**Route:** `/dashboard` (Default fallback)

**Features:**
- 📊 Real-time analytics
- 📈 Aggregated statistics
- 🗺️ Interactive disaster maps
- 📉 Trend analysis
- 📊 KPI dashboards

**Default View:**
- Uses Emergency Response Team dashboard view
- Read-only access to data
- Analytics and reporting focus

---

## Navigation Flow

### From Dashboard to Feature Pages

```
┌─────────────────────────────────────────────────────────┐
│                      Dashboard                          │
└─────────────────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────────────────────────────────┐
        ▼           ▼                   ▼                    ▼
   Manage       View All Incidents   View Resources    Manage Users
   Disasters    (/incidents)         (/resources)      (/users)
   (/disasters) 
        │           │                   │                    │
        ├──► Create ├──► Validate       ├──► Check          ├──► Assign
        ├──► Activate  ├──► Edit          │  Inventory       │    Roles
        ├──► Mitigate  └──► Delete        │                  ├──► Create
        └──► Delete                       │                  │    Users
                                          └──► Deploy        └──► Manage
                                                              Accounts
```

---

## Button Styling & Placement

### All Dashboard Views
Each dashboard header includes:
- **Left Side:** Dashboard title and subtitle
- **Right Side:** Quick action buttons

**Button Types:**
1. **Primary Action Button** (main color)
   - "Issue Alert" (Disaster Manager)
   - Examples: Create, Broadcast, Submit

2. **Secondary Action Button** (outline variant)
   - "Manage Disasters" (blue outline)
   - "View All Incidents" (blue outline)
   - "View Resources" (blue outline)
   - "Manage Users" (blue outline)

**Icon:** All secondary buttons use `ArrowRight` icon for consistency

**Examples:**
```tsx
<Button 
  className="gap-2"
  onClick={() => navigate("/disasters")}
  variant="outline"
>
  <ArrowRight className="h-4 w-4" />
  Manage Disasters
</Button>
```

---

## Feature Availability Matrix

| Feature | Disaster Manager | Incident Validator | Response Team | Administrator | Executive |
|---------|------------------|-------------------|---------------|---------------|-----------|
| View Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Incidents | ❌ | ❌ | ❌ | ✅ | ❌ |
| Validate Incidents | ❌ | ✅ | ❌ | ✅ | ❌ |
| Create Disasters | ✅ | ❌ | ❌ | ✅ | ❌ |
| Activate Disasters | ✅ | ❌ | ❌ | ✅ | ❌ |
| View Resources | ✅ | ❌ | ✅ | ✅ | ❌ |
| Manage Users | ❌ | ❌ | ❌ | ✅ | ❌ |
| View Analytics | ✅ | ❌ | ✅ | ✅ | ✅ |

---

## Implementation Details

### useNavigate Hook Integration
Each dashboard component imports and uses the `useNavigate` hook:

```typescript
import { useNavigate } from "react-router-dom";

const SomeDashboard = () => {
  const navigate = useNavigate();
  
  // Navigate on button click
  const handleNavigate = () => {
    navigate("/target-page");
  };
  
  return (
    <Button onClick={handleNavigate}>
      Go to Page
    </Button>
  );
};
```

### Navigation Targets by Role

**Disaster Manager:**
```typescript
navigate("/disasters")    // Manage disasters
```

**Incident Validator:**
```typescript
navigate("/incidents")    // View and validate incidents
```

**Emergency Response Team:**
```typescript
navigate("/resources")    // Check resources and deployment
```

**System Administrator:**
```typescript
navigate("/users")        // Manage users and roles
```

---

## Route Configuration

### Relevant Routes in `src/App.tsx`

```typescript
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/incidents" element={<Incidents />} />
<Route path="/disasters" element={<Disasters />} />
<Route path="/resources" element={<ResourcesPage />} />
<Route path="/users" element={<User />} />
<Route path="/analytics" element={<AnalyticsPage />} />
```

---

## User Experience Flow

### Scenario 1: Disaster Manager Workflow
```
1. User logs in with DISASTER MANAGER role
2. Dashboard displays "Disaster Manager Dashboard"
3. User sees stats: Active disasters, pending incidents, resources
4. User clicks "Manage Disasters" button
5. Navigates to /disasters page
6. Can create, view, activate, mitigate, or delete disasters
7. Each action updates stats in real-time
8. User can return to dashboard anytime
```

### Scenario 2: Incident Validator Workflow
```
1. User logs in with INCIDENT VALIDATOR role
2. Dashboard displays "Incident Validator Dashboard"
3. User sees stats: Pending review, approved, total incidents
4. User clicks "View All Incidents" button
5. Navigates to /incidents page
6. Can view all incidents and change status
7. Status changes: Pending → Active → Resolved
8. Statistics on dashboard update automatically
```

### Scenario 3: Administrator Workflow
```
1. User logs in with ADMINISTRATOR role
2. Dashboard displays "Administrator Dashboard"
3. User sees system overview and active disasters
4. User clicks "Manage Users" button
5. Navigates to /users page
6. Can manage all user accounts and roles
7. Create new users or modify existing accounts
8. All user management reflected system-wide
```

---

## Future Enhancements

### Dashboard Customization
1. **Configurable Widgets**
   - Allow users to customize dashboard widgets
   - Save widget preferences
   - Different dashboard layouts

2. **Advanced Filters**
   - Filter dashboard data by date range
   - Filter by severity, status, location
   - Saved filter presets

3. **Real-Time Notifications**
   - Push notifications for critical events
   - Alert badges on navigation buttons
   - Real-time data updates

4. **Export & Reporting**
   - Export dashboard data to PDF/CSV
   - Generate reports from dashboard
   - Schedule automated reports

### Navigation Enhancements
1. **Breadcrumb Navigation**
   - Show navigation path: Dashboard → Incidents → Edit
   - Quick links in breadcrumbs

2. **Search & Quick Actions**
   - Global search across all features
   - Quick action shortcuts
   - Command palette (Cmd+K)

3. **Favorites & Shortcuts**
   - Pin frequently used pages
   - Custom shortcut buttons
   - Personalized dashboard

---

## Testing Checklist

- [ ] Login as Disaster Manager
  - [ ] See Disaster Manager Dashboard
  - [ ] Click "Manage Disasters" button
  - [ ] Navigate to /disasters page
  - [ ] Can create/edit/delete disasters

- [ ] Login as Incident Validator
  - [ ] See Incident Validator Dashboard
  - [ ] Click "View All Incidents" button
  - [ ] Navigate to /incidents page
  - [ ] Can validate incidents

- [ ] Login as Response Team
  - [ ] See Response Team Dashboard
  - [ ] Click "View Resources" button
  - [ ] Navigate to /resources page
  - [ ] Can check resources

- [ ] Login as Administrator
  - [ ] See Administrator Dashboard
  - [ ] Click "Manage Users" button
  - [ ] Navigate to /users page
  - [ ] Can manage users

- [ ] All roles
  - [ ] Dashboard stats update in real-time
  - [ ] Navigation buttons use proper styling
  - [ ] ArrowRight icon displays correctly
  - [ ] Role-based access controls work

---

## Summary

The updated Dashboard now provides:
- ✅ Role-specific dashboard views
- ✅ Quick-access navigation buttons
- ✅ Direct links to feature pages
- ✅ Real-time statistics updates
- ✅ Consistent UI/UX across all roles
- ✅ Proper role-based access control

Users can now easily navigate from their dashboard to manage their role-specific features without relying solely on sidebar navigation.

---

## Related Documentation

- **ROLE_SPECIFICATIONS.md** - Role definitions and permissions
- **INCIDENT_DISASTER_MANAGEMENT.md** - Incident/disaster features
- **LOGIN_FIX_THREAD.md** - Authentication and login flow
- **USER_ROLE_FIX.md** - Role normalization system
