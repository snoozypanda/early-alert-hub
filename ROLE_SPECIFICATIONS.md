# Role Specifications & Dashboard Views

## Overview
This document defines the five main user roles in the Early Alert Hub system, their corresponding dashboard views, and the actions they can perform.

---

## Role Matrix

| Role | Dashboard View | Can Perform These Actions on Web |
|------|---|---|
| Incident Validator | Validator Dashboard | View & validate incidents, change status (Pending → Active → Resolved) |
| Disaster Manager | Manager Dashboard | Approve/activate disasters, broadcast alerts, view high-level overview |
| Emergency Response Team | Response Dashboard | View resource needs, current inventory, deployment status |
| System Administrator | Admin Panel | Manage users, roles, view audit logs |
| Executive / Decision Maker | Analytics Dashboard | View real-time maps, charts, aggregated statistics |

---

## Detailed Role Descriptions

### 1. Incident Validator
**Backend Role:** `INCIDENT VALIDATOR` or `incident-validator`

**Primary Responsibility:** Validate and process incident reports

**Dashboard View:** Validator Dashboard
- Displays pending incidents awaiting validation
- Shows approved incident count
- Total incident statistics

**Permissions & Actions:**
- ✅ View all incident reports
- ✅ Validate incident submissions
- ✅ Change incident status: `Pending` → `Active` → `Resolved`
- ✅ Review incident details (title, description, severity, location)
- ✅ Add validation notes/comments
- ❌ Cannot manage disasters
- ❌ Cannot broadcast alerts
- ❌ Cannot manage users

**Sidebar Navigation:**
- Dashboard
- Public Alerts / Incidents
- Settings

**Use Case:**
Validates citizen-submitted incident reports before they're escalated to disaster managers.

---

### 2. Disaster Manager
**Backend Role:** `DISASTER MANAGER` or `disaster-manager`

**Primary Responsibility:** Manage and coordinate disaster response

**Dashboard View:** Manager Dashboard
- Displays active disasters
- Pending incidents overview
- Available resources count
- Quick action buttons for issuing alerts

**Permissions & Actions:**
- ✅ View active disasters
- ✅ Approve/activate disasters
- ✅ Broadcast public alerts
- ✅ View high-level overview of incidents
- ✅ Monitor response team deployment
- ✅ Access analytics and trends
- ❌ Cannot validate individual incidents
- ❌ Cannot manage user accounts
- ❌ Cannot view audit logs

**Sidebar Navigation:**
- Dashboard
- Broadcast Alert
- Analytics
- Settings

**Use Case:**
Oversees all disaster operations, makes decisions to activate disasters, and broadcasts emergency alerts to the public.

---

### 3. Emergency Response Team
**Backend Role:** `RESPONSE TEAM` or `response-team`

**Primary Responsibility:** Execute on-ground disaster response operations

**Dashboard View:** Response Dashboard
- Lists active disasters requiring response
- Current resource inventory and availability
- Deployment status and assignments
- Safety instructions and guidelines

**Permissions & Actions:**
- ✅ View active disaster alerts
- ✅ Check resource availability
- ✅ View current inventory
- ✅ Monitor deployment status
- ✅ Access safety instructions
- ✅ Report resource updates
- ❌ Cannot validate incidents
- ❌ Cannot approve disasters
- ❌ Cannot broadcast alerts
- ❌ Cannot manage users

**Sidebar Navigation:**
- Dashboard
- Alerts
- Resources
- Analytics
- Settings

**Use Case:**
Field teams that respond to disasters. They need to know what disasters are active, what resources are available, and safety guidelines.

---

### 4. System Administrator
**Backend Role:** `ADMINISTRATOR` or `administrator`

**Primary Responsibility:** System maintenance and user management

**Dashboard View:** Admin Panel
- System-wide overview
- User management interface
- Role assignment panel
- Audit logs and activity tracking

**Permissions & Actions:**
- ✅ Manage all user accounts
- ✅ Assign/revoke roles
- ✅ Create new users
- ✅ Disable/enable accounts
- ✅ View audit logs
- ✅ Monitor system health
- ✅ Access all system settings
- ✅ Generate reports
- ❌ Cannot manually approve disasters (use workflow only)
- ❌ Cannot broadcast alerts (system-level only)

**Sidebar Navigation:**
- Dashboard
- Users
- Logs
- Settings

**Use Case:**
IT/System administrators responsible for managing users, assigning roles, and maintaining system integrity.

---

### 5. Executive / Decision Maker
**Backend Role:** `USER` (default fallback in current mapping)

**Primary Responsibility:** Strategic oversight and decision-making

**Dashboard View:** Analytics Dashboard
- Real-time disaster maps
- Interactive charts and visualizations
- Aggregated statistics
- Trend analysis
- KPI dashboards

**Permissions & Actions:**
- ✅ View real-time maps with disaster locations
- ✅ Access comprehensive analytics
- ✅ View trend reports
- ✅ Export data for reporting
- ✅ Access executive summaries
- ✅ Monitor response metrics
- ❌ Cannot modify disaster status
- ❌ Cannot validate incidents
- ❌ Cannot manage users
- ❌ Cannot manage resources

**Sidebar Navigation:**
- Dashboard
- Analytics
- Settings

**Use Case:**
Government officials, emergency management directors, and executives who need to understand the overall situation and make strategic decisions.

---

## Role Hierarchy & Authorization

### Permission Levels (Highest to Lowest)
1. **Administrator** - Full system access
2. **Disaster Manager** - Operational decisions
3. **Incident Validator** - Validation workflow
4. **Emergency Response Team** - Execution level
5. **Executive / Decision Maker** - Read-only analytics

### Role Combinations
Users can have multiple roles assigned. For example:
- `['USER', 'INCIDENT VALIDATOR']` - Analytics access + validation capability
- `['USER', 'DISASTER MANAGER']` - Analytics access + disaster management
- `['INCIDENT VALIDATOR', 'DISASTER MANAGER']` - Full workflow capability

**Note:** When users have multiple roles, the sidebar shows navigation items from the first valid role in their roles array. The Sidebar logic prioritizes based on the role mapping order.

---

## Implementation Details

### Role Normalization
Backend returns roles in uppercase with spaces: `'INCIDENT VALIDATOR'`
Frontend normalizes to lowercase with hyphens: `'incident-validator'`

This is handled by `normalizeRole()` in `src/config/roleUI.ts`

### Role-Based Sidebar Navigation
**File:** `src/config/roleUI.ts`

```typescript
export const roleUI: Record<Role, RoleNavItem[]> = {
  "disaster-manager": [
    { route: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
    { route: "/alerts", labelKey: "broadcastAlert", icon: Megaphone },
    { route: "/analytics", labelKey: "analytics", icon: BarChart3 },
    { route: "/settings", labelKey: "settings", icon: Settings },
  ],
  
  "incident-validator": [
    { route: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
    { route: "/public-alerts", labelKey: "alerts", icon: AlertTriangle },
    { route: "/incidents", labelKey: "incidents", icon: AlertTriangle },
    { route: "/settings", labelKey: "settings", icon: Settings },
  ],
  
  "response-team": [
    { route: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
    { route: "/alerts", labelKey: "alerts", icon: AlertTriangle },
    { route: "/resources", labelKey: "resources", icon: Package },
    { route: "/analytics", labelKey: "analytics", icon: BarChart3 },
    { route: "/settings", labelKey: "settings", icon: Settings },
  ],
  
  "administrator": [
    { route: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
    { route: "/users", labelKey: "users", icon: Users },
    { route: "/logs", labelKey: "log", icon: FileText },
    { route: "/settings", labelKey: "settings", icon: Settings },
  ],
};
```

### Dashboard Component Routing
**File:** `src/pages/Dashboard.tsx`

Each role gets routed to its specific dashboard component:

```typescript
const userRole = normalizeRole(user.roles[0]);

if (userRole === "disaster-manager") {
  return <DashboardLayout><DecisionMakerDashboard /></DashboardLayout>;
}

if (userRole === "incident-validator") {
  return <DashboardLayout><IncidentValidatorDashboard /></DashboardLayout>;
}

if (userRole === "response-team") {
  return <DashboardLayout><EmergencyResponseTeamDashboard /></DashboardLayout>;
}

if (userRole === "administrator") {
  return <DashboardLayout><AdministratorDashboard /></DashboardLayout>;
}

// Default fallback
return <DashboardLayout><EmergencyResponseTeamDashboard /></DashboardLayout>;
```

---

## Feature Implementation Status

### ✅ Implemented
- [x] Role normalization (backend to UI format)
- [x] Role-based sidebar navigation
- [x] Dashboard routing by role
- [x] User profile with role display
- [x] Role color coding in badges
- [x] Multiple role display in profile

### 🚧 In Progress
- [ ] Admin panel for user management
- [ ] Audit logging system
- [ ] Resource management UI
- [ ] Real-time analytics dashboard
- [ ] Map visualization

### 📋 To Do
- [ ] Incident status workflow (Pending → Active → Resolved)
- [ ] Alert broadcasting system
- [ ] Permission enforcement on API endpoints
- [ ] Role-based data filtering
- [ ] Advanced analytics dashboards
- [ ] Batch user management
- [ ] Role templates for quick assignment

---

## API Considerations

### Backend Role Format
Backend returns roles as uppercase array with spaces:
```json
{
  "id": 1,
  "name": "John Doe",
  "roles": ["USER", "INCIDENT VALIDATOR", "DISASTER MANAGER"]
}
```

### Frontend Normalization
Frontend normalizes to lowercase with hyphens:
```typescript
["USER", "INCIDENT VALIDATOR", "DISASTER MANAGER"]
  ↓
["user", "incident-validator", "disaster-manager"]
```

### Role-Based API Access
Future implementation should include:
- Server-side role validation on all endpoints
- Permission check on resource access
- Audit logging of role-based actions
- Rate limiting per role

---

## Security Considerations

### Current Implementation
- ✅ Client-side role-based UI rendering
- ✅ Token-based authentication
- ✅ Automatic logout on token expiry
- ❌ Server-side role validation (needs implementation)

### Recommended Security Measures
1. **Server-side Authorization**
   - Validate user role on every API request
   - Return 403 Forbidden for unauthorized access
   - Log all authorization failures

2. **Role Validation**
   - Verify roles in token claims
   - Refresh role list on permission denied
   - Implement role change detection

3. **Audit Logging**
   - Log all role-based actions
   - Track who modified what and when
   - Maintain immutable audit trail

4. **Token Security**
   - Include role information in JWT payload
   - Encrypt sensitive role data
   - Implement role claim validation

---

## Testing Scenarios

### Scenario 1: Incident Validator Login
1. User logs in with `INCIDENT VALIDATOR` role
2. Dashboard shows: Pending incidents, approved count, total incidents
3. Sidebar shows: Dashboard, Incidents, Public Alerts, Settings
4. User can view and validate incidents

### Scenario 2: Disaster Manager Login
1. User logs in with `DISASTER MANAGER` role
2. Dashboard shows: Active disasters, pending incidents, available resources
3. Sidebar shows: Dashboard, Broadcast Alert, Analytics, Settings
4. User can approve disasters and broadcast alerts

### Scenario 3: Multiple Roles
1. User logs in with `['USER', 'INCIDENT VALIDATOR']` roles
2. First valid role selected: `incident-validator`
3. Dashboard and sidebar reflect incident validator access
4. Profile shows both roles with color coding

### Scenario 4: Administrator Access
1. User logs in with `ADMINISTRATOR` role
2. Dashboard shows: System overview
3. Sidebar shows: Dashboard, Users, Logs, Settings
4. User can manage users and view audit logs

---

## Future Enhancements

### Custom Roles
- Allow admins to create custom roles
- Map custom roles to permissions
- Template-based role creation

### Fine-Grained Permissions
- Permission-level control instead of role-level
- Granular action restrictions
- Resource-level access control

### Role Groups
- Group users by department/region
- Inherit permissions from parent group
- Hierarchical permission structure

### Temporary Role Assignment
- Time-limited role grants
- Reason tracking for role changes
- Automatic role expiration

### Role Analytics
- Track role usage patterns
- Identify underutilized roles
- Optimize role structure

---

## References

- **USER_ROLE_FIX.md** - Role normalization implementation
- **LOGIN_FIX_THREAD.md** - Authentication flow with roles
- **src/config/roleUI.ts** - Role to UI mapping
- **src/pages/Dashboard.tsx** - Dashboard routing by role
- **src/pages/User.tsx** - Role display in profile

---

## Summary

The Early Alert Hub system implements a five-tier role-based access control system:

1. **Incident Validator** - Validates incident submissions
2. **Disaster Manager** - Manages disaster operations
3. **Emergency Response Team** - Executes field operations
4. **System Administrator** - Manages users and system
5. **Executive / Decision Maker** - Views analytics and trends

Each role has:
- ✅ Dedicated dashboard view
- ✅ Role-specific sidebar navigation
- ✅ Defined permissions and actions
- ✅ Color-coded badges in UI
- ✅ Normalized format handling (uppercase → lowercase)

Client-side implementation is complete. Server-side role validation and enforcement should be prioritized for security.
