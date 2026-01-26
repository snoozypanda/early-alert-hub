# Incident & Disaster Management System

## Overview
This document describes the complete implementation of incident and disaster management features based on the ROLE_SPECIFICATIONS.md document.

---

## Features Implemented

### ✅ Incident Management
- **Create Incidents** - Users can submit new incident reports with location, description, and severity
- **View Incidents** - Paginated list of all incidents with filters
- **Validate Incidents** - Incident Validators can change status: Pending → Active → Resolved
- **Edit Incidents** - Update incident details
- **Delete Incidents** - Remove incidents from the system
- **Status Workflow** - Pending → Active → Resolved

### ✅ Disaster Management
- **Create Disasters** - Disaster Managers can create new disaster records
- **View Disasters** - List of all active disasters with details
- **Activate Disasters** - Change status from Inactive → Active
- **Mitigate Disasters** - Change status from Active → Mitigated
- **Edit Disasters** - Update disaster information
- **Delete Disasters** - Remove disasters (Disaster Managers only)
- **Link to Incidents** - Associate disasters with verified incidents

---

## Role-Based Access Control

### Incident Validator Role
**Can Perform:**
- ✅ View all incidents
- ✅ Validate incident submissions (change status Pending → Active)
- ✅ Resolve incidents (change status Active → Resolved)
- ✅ Add validation notes/comments
- ❌ Cannot create incidents
- ❌ Cannot delete incidents
- ❌ Cannot manage disasters

**Sidebar Access:**
- Dashboard
- Public Alerts / Incidents
- Settings

### Disaster Manager Role
**Can Perform:**
- ✅ Create disasters
- ✅ Activate disasters (Inactive → Active)
- ✅ Mitigate disasters (Active → Mitigated)
- ✅ Delete disasters
- ✅ Edit disaster information
- ✅ Link incidents to disasters
- ❌ Cannot validate individual incidents
- ❌ Cannot manage users

**Sidebar Access:**
- Dashboard
- Broadcast Alert
- Analytics
- Settings

### Other Roles
- **Emergency Response Team** - View active disasters only
- **System Administrator** - Full access (system-wide)
- **Executive / Decision Maker** - View-only access to analytics

---

## API Endpoints

### Incident Endpoints
```
GET    /incident              - Fetch all incidents
GET    /incident/{id}         - Fetch single incident
POST   /incident              - Create incident
PATCH  /incident/{id}         - Update incident
DELETE /incident/{id}         - Delete incident
```

### Disaster Endpoints
```
GET    /disaster              - Fetch all disasters
GET    /disaster/{id}         - Fetch single disaster
POST   /disaster              - Create disaster
PATCH  /disaster/{id}         - Update disaster
DELETE /disaster/{id}         - Delete disaster
```

---

## File Structure

### Created Files

#### 1. `src/lib/api/incidents.ts`
Provides all API hooks for incident management:

```typescript
// Query Hooks
export const useIncidentsQuery()     // Fetch all incidents
export const useIncidentQuery(id)    // Fetch single incident

// Mutation Hooks
export const useCreateIncidentMutation()   // Create incident
export const useUpdateIncidentMutation()   // Update incident
export const useDeleteIncidentMutation()   // Delete incident

// Direct API Functions
export const getIncidents()
export const getIncidentById(id)
export const createIncident(data)
export const updateIncident(id, data)
export const deleteIncident(id)
```

#### 2. `src/lib/api/disasters.ts`
Provides all API hooks for disaster management:

```typescript
// Query Hooks
export const useDisastersQuery()    // Fetch all disasters
export const useDisasterQuery(id)   // Fetch single disaster

// Mutation Hooks
export const useCreateDisasterMutation()   // Create disaster
export const useUpdateDisasterMutation()   // Update disaster
export const useDeleteDisasterMutation()   // Delete disaster

// Direct API Functions
export const getDisasters()
export const getDisasterById(id)
export const createDisaster(data)
export const updateDisaster(id, data)
export const deleteDisaster(id)
```

#### 3. `src/pages/Incidents.tsx`
Complete incident management interface:

**Features:**
- List all incidents with status and severity badges
- Create new incident dialog
- Change incident status (Pending → Active → Resolved)
- Edit and delete incidents
- Role-based action buttons
- Loading and error states
- Toast notifications

**Components Used:**
- Dialog (Create incident form)
- Card (Incident list items)
- Badge (Status and severity)
- Button (Actions)
- Input (Form fields)

#### 4. `src/pages/Disasters.tsx`
Complete disaster management interface:

**Features:**
- List all disasters with status badges
- Create new disaster dialog (Disaster Managers only)
- Activate/mitigate disasters
- Edit and delete disasters
- Show affected population and scope
- Loading and error states
- Role-based restrictions

**Components Used:**
- Dialog (Create disaster form)
- Card (Disaster list items)
- Badge (Status and severity)
- Button (Actions)
- Input (Form fields)

---

## Data Types

### Incident Structure
```typescript
interface Incident {
  id: number;
  title: string;
  description: string;
  status: "pending" | "active" | "resolved";
  severityLevel: "low" | "medium" | "high" | "critical";
  attachments: string[];
  reportDate: string;
  updatedAt: string;
  reportedBy: {
    id: number;
    name: string;
  };
}

interface CreateIncidentInput {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  severityLevel: string;
  attachments: string[];
}

interface UpdateIncidentInput {
  status?: string;
  severityLevel?: string;
}
```

### Disaster Structure
```typescript
interface Disaster {
  id: number;
  title: string;
  description: string;
  severityLevel: string;
  scope: string;
  attachments: string[];
  affectedPopulation: number;
  status: "inactive" | "active" | "mitigated";
  startDate: string;
  createdAt: string;
  updatedAt: string;
  issuedBy: {
    id: number;
    name: string;
  };
  verifiedIncident: Incident;
}

interface CreateDisasterInput {
  disasterID: string;
  scope: string;
  status: string;
  affectedPopulation: number;
  incidentId: string;
  attachments: string[];
}

interface UpdateDisasterInput {
  status?: string;
  scope?: string;
  affectedPopulation?: number;
  attachments?: string[];
}
```

---

## Implementation Details

### Incident Status Workflow

```
┌─────────┐     Validate     ┌────────┐     Resolve     ┌──────────┐
│ Pending │ ───────────────> │ Active │ ───────────────> │ Resolved │
└─────────┘                   └────────┘                  └──────────┘
                              ▲
                              │
                              │ (Incident Validator Only)
```

**Status Transitions:**
1. **Pending** - Initial state when incident is reported
2. **Active** - Incident has been validated and is being handled
3. **Resolved** - Incident has been addressed and closed

### Disaster Status Workflow

```
┌──────────┐     Activate     ┌────────┐     Mitigate     ┌──────────┐
│ Inactive │ ───────────────> │ Active │ ───────────────> │ Mitigated│
└──────────┘                   └────────┘                  └──────────┘
                              ▲
                              │
                              │ (Disaster Manager Only)
```

**Status Transitions:**
1. **Inactive** - Disaster created but not yet activated
2. **Active** - Disaster is ongoing and active response is needed
3. **Mitigated** - Disaster has been mitigated or resolved

---

## Usage Examples

### Using Incident Hooks

```typescript
import { useIncidentsQuery, useCreateIncidentMutation } from "@/lib/api/incidents";

function MyComponent() {
  // Fetch incidents
  const { data: incidents, isLoading } = useIncidentsQuery();
  
  // Create incident
  const { mutate: createIncident } = useCreateIncidentMutation();
  
  const handleCreate = () => {
    createIncident({
      title: "Flood Alert",
      description: "Heavy flooding in downtown area",
      latitude: 40.7128,
      longitude: -74.0060,
      severityLevel: "high",
      attachments: [],
    }, {
      onSuccess: (data) => {
        console.log("Created:", data);
      },
      onError: (error) => {
        console.error("Failed:", error);
      }
    });
  };
  
  return (
    <div>
      {incidents?.map(incident => (
        <div key={incident.id}>{incident.title}</div>
      ))}
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}
```

### Using Disaster Hooks

```typescript
import { useDisastersQuery, useUpdateDisasterMutation } from "@/lib/api/disasters";

function MyComponent() {
  // Fetch disasters
  const { data: disasters } = useDisastersQuery();
  
  // Update disaster
  const { mutate: updateDisaster } = useUpdateDisasterMutation();
  
  const handleActivate = (disasterId: number) => {
    updateDisaster(
      { id: disasterId, data: { status: "active" } },
      {
        onSuccess: () => toast.success("Disaster activated"),
      }
    );
  };
  
  return (
    <div>
      {disasters?.map(disaster => (
        <button key={disaster.id} onClick={() => handleActivate(disaster.id)}>
          Activate {disaster.title}
        </button>
      ))}
    </div>
  );
}
```

---

## Route Configuration

### New Routes in `src/App.tsx`

```typescript
<Route path="/incidents" element={<Incidents />} />
<Route path="/disasters" element={<Disasters />} />
```

### Sidebar Navigation

**Incident Validator:**
- Dashboard
- **Public Alerts / Incidents** ← Links to `/incidents`
- Settings

**Disaster Manager:**
- Dashboard
- Broadcast Alert
- **Analytics**
- Settings

**Emergency Response Team:**
- Dashboard
- **Alerts** ← Shows active disasters
- Resources
- Analytics
- Settings

---

## Testing Checklist

### Incident Management

- [ ] Login as Incident Validator
- [ ] View incidents list
- [ ] See pending, active, and resolved incidents
- [ ] Change incident status Pending → Active
- [ ] Change incident status Active → Resolved
- [ ] Cannot delete incidents (permission check)
- [ ] Edit incident details
- [ ] Toast notifications appear on success/error

### Disaster Management

- [ ] Login as Disaster Manager
- [ ] View disasters list
- [ ] Create new disaster with form
- [ ] Activate disaster (Inactive → Active)
- [ ] Mitigate disaster (Active → Mitigated)
- [ ] Delete disaster
- [ ] Cannot delete as other roles
- [ ] Toast notifications on success/error

### Role-Based Restrictions

- [ ] Incident Validator cannot see "Create Disaster" button
- [ ] Emergency Response Team can only view incidents
- [ ] System Administrator sees all options
- [ ] Executive cannot modify anything

### Error Handling

- [ ] Form validation works
- [ ] API errors show toast messages
- [ ] Network failures handled gracefully
- [ ] Loading states display correctly
- [ ] Delete confirmation dialog appears

---

## Future Enhancements

### Incident Management
1. **Advanced Filtering**
   - Filter by status, severity, date range
   - Search by title or description
   - Filter by location/area

2. **Incident Comments**
   - Add validation notes/comments
   - Track comment history
   - @mention users

3. **Bulk Operations**
   - Bulk status changes
   - Bulk delete with confirmation
   - Export incidents to CSV/PDF

4. **Mobile Alerts**
   - Push notifications for status changes
   - SMS alerts for critical incidents
   - Email notifications

5. **Integration**
   - Webhook notifications
   - Third-party system integration
   - Automatic status triggers

### Disaster Management
1. **Resource Allocation**
   - Link resources to disasters
   - Track resource usage
   - Predict resource needs

2. **Disaster Analytics**
   - Historical disaster trends
   - Duration and impact metrics
   - Response effectiveness

3. **Automated Workflows**
   - Automatic incident-to-disaster escalation
   - Alert broadcasting on activation
   - Resource request automation

4. **Collaborative Features**
   - Assign team members
   - Disaster task assignments
   - Real-time collaboration

---

## Security Considerations

### Current Implementation
- ✅ Role-based access control on UI
- ✅ Token-based authentication
- ❌ Server-side authorization (needs implementation)

### Recommended Security Measures
1. **Server-Side Validation**
   - Verify user role before allowing modifications
   - Check ownership of records
   - Validate all input data

2. **Audit Logging**
   - Log all incident/disaster modifications
   - Track who changed what and when
   - Immutable audit trail

3. **Data Protection**
   - Encrypt sensitive incident information
   - Implement field-level access control
   - Rate limit API endpoints

4. **Permission Enforcement**
   - Return 403 Forbidden for unauthorized access
   - Implement granular permissions
   - Role hierarchy validation

---

## Troubleshooting

### Common Issues

**Incidents list is empty**
- Check if API endpoint is correct
- Verify user has incidents to view
- Check network tab for API errors

**Cannot create incident**
- Verify form validation passes
- Check if user has required role
- Look for API error messages in toast

**Status change not working**
- Confirm user is Incident Validator/Disaster Manager
- Check if current status allows transition
- Verify API endpoint is accessible

**Mutations not updating cache**
- Ensure `queryClient.invalidateQueries()` is called
- Check if query key matches in hooks
- Verify mutation `onSuccess` callback fires

---

## Summary

This implementation provides:
- ✅ Complete incident management system
- ✅ Complete disaster management system
- ✅ Role-based access control
- ✅ Status workflow automation
- ✅ Real-time UI updates
- ✅ Error handling and validation
- ✅ Toast notifications
- ✅ Type-safe API integration

The system is ready for testing with real API endpoints. Server-side authorization and audit logging should be prioritized for production deployment.

---

## Related Documentation

- **ROLE_SPECIFICATIONS.md** - Role definitions and permissions
- **USER_ROLE_FIX.md** - Role normalization implementation
- **LOGIN_FIX_THREAD.md** - Authentication flow
