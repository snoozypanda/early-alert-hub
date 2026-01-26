# Early Alert Hub - Thread Summary

## Overview
Complete refactoring of the Early Alert Hub dashboard to integrate with real API endpoints, fix authentication issues, and implement a comprehensive user profile system.

---

## 1. Dashboard API Integration

### Initial Setup
- Analyzed Swagger API documentation at `https://api-41pz.onrender.com/swagger`
- Identified available endpoints: `/disaster`, `/incident`, `/users`

### Created API Hooks
**Files Created:**
- `src/lib/api/disasters.ts` - Fetch disasters from backend
- `src/lib/api/incidents.ts` - Fetch incidents from backend  
- `src/lib/api/users.ts` - Fetch user data including profile

**Key Features:**
```typescript
export const getDisasters = async () => {
  const response = await api.get<{ data: DisasterOutput[] }>("/disaster");
  return response.data.data;
};
```

### Updated Dashboard Components
- **DecisionMakerDashboard** - Shows active disasters, pending incidents with real data
- **IncidentValidatorDashboard** - Displays pending/approved incident counts
- **EmergencyResponseTeamDashboard** - Lists active disasters for responders
- **AdministratorDashboard** - System-wide alert monitoring

### Charts & Analytics
- Dynamic pie chart showing disasters by severity
- Bar chart for monthly trends
- Loading states with spinner indicators
- Empty state messaging

---

## 2. Authentication Token Storage Fix

### Problem
- Login was storing tokens as `Authorization` header value
- AuthContext was looking for `accessToken` in localStorage
- Inconsistent token storage between login and register

### Solution
**Updated Files:**
- `src/lib/api/userLogin.ts`
- `src/lib/api/userRegister.ts`
- `src/lib/api.ts`

**Before:**
```typescript
localStorage.setItem("Authorization", `Bearer ${responseData.data.accessToken}`);
```

**After:**
```typescript
localStorage.setItem("accessToken", responseData.data.accessToken);
localStorage.setItem("refreshToken", responseData.data.refreshToken);
```

### API Instance Setup
- Centralized axios instance with automatic token injection
- Request interceptor adds Bearer token from localStorage
- Response interceptor handles token refresh on 401
- Environment variable for API URL: `VITE_API_URL`

---

## 3. AuthContext Integration with TanStack Query

### Architecture Changes
**Before:** Manual state management with useState + useEffect
**After:** Leverages TanStack Query for caching & refetching

**File: `src/contexts/AuthContext.tsx`**

### Key Updates
```typescript
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const hasToken = !!localStorage.getItem("accessToken");
  
  // Only fetch user if token exists
  const { data: user = null, isLoading, isError } = useMyProfileQuery();
  
  // If token exists but user failed to load, clear token
  if (hasToken && isError && !isLoading) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
```

### Features
✅ Conditional user fetching (only if token exists)
✅ Error handling with automatic token cleanup
✅ QueryClient integration for clearing cache on logout
✅ Proper loading states

### useMyProfileQuery Enhancement
```typescript
export const useMyProfileQuery = () => {
  const hasToken = !!localStorage.getItem("accessToken");
  
  return useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
    enabled: hasToken,    // Only fetch if token exists
    retry: false,          // Don't retry on 401
  });
};
```

---

## 4. Dashboard Layout & Protection

### DashboardLayout Component Updates
**File: `src/components/layout/DashboardLayout.tsx`**

Added loading state handling:
```typescript
if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
```

### Authentication Flow
1. App loads → Check if token exists in localStorage
2. If token exists → Fetch user data via Query
3. While loading → Show spinner
4. When loaded → Check user and render appropriate dashboard
5. If token invalid → Clear tokens and redirect to login

---

## 5. Role Resolution & Sidebar Fix

### Problem
- API returns `roles` as array, code expected single `role` property
- Sidebar crashed on undefined role mapping

### Solution
**Universal Role Resolution Pattern:**

```typescript
// Handle user.roles array - get the first role
const userRole = Array.isArray(user?.roles) 
  ? user.roles[0] 
  : user?.role;
```

### Files Updated
- `src/pages/Dashboard.tsx` - Role checking in component
- `src/components/layout/Sidebar.tsx` - Navigation menu generation

**Sidebar Implementation:**
```typescript
const userRole = Array.isArray(user.roles)
  ? user.roles.find((role) => role in roleUI)
  : user.role;

const links = userRole ? roleUI[userRole as keyof typeof roleUI] : [];

if (!links || links.length === 0) {
  return null;
}
```

### StatsCard Enhancement
Added loading state support:
```typescript
interface StatsCardProps {
  // ... existing props
  isLoading?: boolean;
}

{isLoading ? <Loader className="h-6 w-6 animate-spin" /> : value}
```

---

## 6. User Profile Page

### New Page: `/users`
**File: `src/pages/User.tsx`**

### Features
✅ **Profile Header** - User name, role badge, account status
✅ **Contact Information** - Email, username with copy-to-clipboard
✅ **Account Details** - User ID, creation date, last update
✅ **Assigned Roles** - List all roles with badges
✅ **Account Status** - Active/Disabled indicator
✅ **Security Section** - Placeholder for password change

### Copy to Clipboard
```typescript
const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
  setCopied(true);
  toast.success("Copied to clipboard");
  setTimeout(() => setCopied(false), 2000);
};
```

### Role Color Coding
```typescript
const roleColors: Record<string, string> = {
  "disaster-manager": "bg-red-100 text-red-800",
  "incident-validator": "bg-yellow-100 text-yellow-800",
  "response-team": "bg-blue-100 text-blue-800",
  administrator: "bg-purple-100 text-purple-800",
};
```

### Navbar Integration
**File: `src/components/layout/Navbar.tsx`**

```typescript
const handleProfileClick = () => {
  navigate('/users');
};

const handleSettingsClick = () => {
  navigate('/settings');
};
```

Added route to dropdown menu items.

### App Router Update
**File: `src/App.tsx`**

```typescript
<Route path="/users" element={<User />} />
```

---

## 7. API Response Structure

### Disaster Output
```typescript
interface DisasterOutput {
  id: string;
  title: string;
  description: string;
  severityLevel: "low" | "medium" | "high" | "critical";
  scope: string;
  attachments?: string[];
  affectedPopulation: number;
  status: "active" | "monitoring" | "resolved";
  startDate: string;
  createdAt: string;
  updatedAt: string;
  issuedBy: { id: string; name: string; username: string };
  verifiedIncident?: string;
}
```

### Incident Output
```typescript
interface IncidentOutput {
  id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  severityLevel: "low" | "medium" | "high" | "critical";
  attachments?: string[];
  reportDate: string;
  updatedAt: string;
  reportedBy: { id: string; name: string; username: string };
}
```

### User Output
```typescript
interface User {
  id: number;
  name: string;
  username: string;
  roles: string[];
  email: string;
  isAccountDisabled: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## 8. Configuration Files

### Environment Variables
**`.env`**
```
VITE_API_URL=https://api-41pz.onrender.com
```

### Role Configuration
**`src/config/roleUI.ts`**

Defines role-based navigation for:
- `disaster-manager` - Dashboard, Alerts, Analytics, Settings
- `incident-validator` - Dashboard, Alerts, Incidents, Settings
- `response-team` - Dashboard, Alerts, Resources, Analytics, Settings
- `administrator` - Dashboard, Users, Logs, Settings

---

## 9. Best Practices Implemented

### Auth Flow
✅ Token stored consistently (accessToken + refreshToken)
✅ Centralized API instance with interceptors
✅ Conditional user fetching based on token presence
✅ Automatic logout on 401 errors

### Data Fetching
✅ TanStack Query for server state management
✅ Loading states with spinner indicators
✅ Error handling with user feedback
✅ Cache invalidation on mutations

### Component Architecture
✅ Separate dashboard components per role
✅ Reusable StatsCard with loading states
✅ DashboardLayout for protection and layout
✅ Navbar with role-aware display

### Type Safety
✅ Full TypeScript coverage
✅ API response type definitions
✅ User role type validation
✅ Query hook return types

---

## 10. Testing Checklist

### Authentication
- [ ] Login stores tokens correctly in localStorage
- [ ] Token is sent in Authorization header for API calls
- [ ] Dashboard doesn't redirect when token is valid
- [ ] Logout clears tokens and redirects to login
- [ ] Refresh token works on 401 responses

### Dashboard
- [ ] Correct dashboard renders based on user role
- [ ] Stats cards show loading spinners
- [ ] Charts load and display correctly
- [ ] API data populates without errors

### User Profile
- [ ] Profile page loads user information
- [ ] Copy-to-clipboard functionality works
- [ ] Role badges display correctly
- [ ] Account status shows properly

### Navigation
- [ ] Sidebar shows correct menu items per role
- [ ] Profile dropdown navigates correctly
- [ ] Settings link works
- [ ] Logout works from navbar

---

## 11. Future Enhancements

### Planned Features
1. **User Profile Editing** - Implement edit mode with API calls
2. **Password Change** - Add password change functionality
3. **Role Management** - Admin panel for role assignment
4. **Activity Logs** - User action history
5. **Notifications** - Real-time alert notifications
6. **Advanced Filtering** - Dashboard data filtering options

### API Enhancements Needed
1. PATCH `/users/{id}` - Update user profile
2. POST `/users/{id}/change-password` - Password change
3. GET `/users/{id}/activity` - Activity logs
4. WebSocket for real-time updates

---

## Summary of Changes

### Files Created
- `src/lib/api/disasters.ts`
- `src/lib/api/incidents.ts`
- `src/lib/api/users.ts`
- `src/pages/User.tsx`

### Files Modified
- `src/contexts/AuthContext.tsx` - Integrated with Query
- `src/pages/Dashboard.tsx` - Added API integration, role resolution
- `src/components/layout/DashboardLayout.tsx` - Added loading state
- `src/components/layout/Navbar.tsx` - Profile navigation
- `src/components/dashboard/StatsCard.tsx` - Loading states
- `src/lib/api.ts` - Environment variable support
- `src/lib/api/userLogin.ts` - Token storage fix
- `src/lib/api/userRegister.ts` - Token storage fix
- `src/App.tsx` - Added User route

### Key Improvements
✅ Real API data integration
✅ Fixed authentication flow
✅ Proper role-based routing
✅ Comprehensive user profile page
✅ Loading states throughout
✅ Error handling with recovery
✅ Consistent token management
✅ TypeScript type safety

---

## Troubleshooting Guide

### Dashboard Redirects to Login
**Cause:** Token not found or user fetch failed
**Fix:** Check localStorage for `accessToken`, verify API is accessible

### Sidebar Shows Nothing
**Cause:** User role not found in roleUI config
**Fix:** Ensure role matches one of: `disaster-manager`, `incident-validator`, `response-team`, `administrator`

### API Calls Return 401
**Cause:** Token expired or invalid
**Fix:** Token refresh interceptor should handle this automatically, check refresh token validity

### Charts Don't Show
**Cause:** No data from API or loading state stuck
**Fix:** Check browser console for API errors, verify data structure matches expected format

---

## Contact & Support

For questions or issues related to these changes, refer to:
- API Docs: `https://api-41pz.onrender.com/swagger`
- React Query Docs: `https://tanstack.com/query/latest`
- Auth Context Location: `src/contexts/AuthContext.tsx`

---

## 12. Sidebar Visibility & Loading States

### Problem
- Sidebar was returning `null` while loading, causing it to disappear
- No collapse button visible during loading
- Role resolution logic wasn't finding matching roles

### Solution
**File: `src/components/layout/Sidebar.tsx`**

Enhanced sidebar to always render:

```typescript
// Show skeleton/placeholder while loading
if (isLoading || !user) {
  return (
    <aside className={cn(
      "h-[calc(100vh-4rem)] border-r border-border bg-card transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      <nav className="flex-1 p-2 space-y-1 flex items-center justify-center">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </nav>
      <div className="p-2 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full justify-center" onClick={onToggle}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
```

### Role Resolution Improvements

Enhanced role matching to handle edge cases:

```typescript
// Handle user.roles array - get the first matching role
let userRole: string | undefined;

if (Array.isArray(user.roles) && user.roles.length > 0) {
  // Try to find a role that exists in roleUI
  userRole = user.roles.find((role) => (role in roleUI));
  // If no exact match, use the first role anyway
  if (!userRole) {
    userRole = user.roles[0];
  }
} else if (user.role && typeof user.role === 'string') {
  userRole = user.role;
}

// Debug logging for troubleshooting
if (!userRole || !(userRole in roleUI)) {
  console.warn('No valid role found for user:', { 
    roles: user.roles, 
    role: user.role,
    userRole 
  });
}

const links = userRole && userRole in roleUI 
  ? roleUI[userRole as keyof typeof roleUI] 
  : [];

// Show fallback with role info
if (!links || links.length === 0) {
  return (
    <aside className={cn(...)}>
      <nav className="flex-1 p-2 flex items-center justify-center">
        <p className="text-xs text-muted-foreground text-center">
          Role: {userRole || 'unknown'}
        </p>
      </nav>
      {/* Collapse button */}
    </aside>
  );
}
```

### DashboardLayout Update
**File: `src/components/layout/DashboardLayout.tsx`**

Moved loading state to main content area so sidebar is always visible:

```typescript
return (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="p-6">{children}</div>
        )}
      </main>
    </div>
    <Footer />
  </div>
);
```

### Key Features
✅ Sidebar always renders (never returns null)
✅ Loading spinner appears inside sidebar
✅ Collapse button always available
✅ Fallback message shows actual role for debugging
✅ Console warnings for role mismatches

---

## 13. Authentication Redirect for Login/Register Pages

### Problem
- Users with valid tokens could still access `/login` and `/register` pages
- No redirect back to dashboard if already authenticated

### Solution
**Files Updated:**
- `src/pages/Login.tsx`
- `src/pages/Register.tsx`

Added authentication checks to both pages:

```typescript
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";

const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  // ... rest of login form
};
```

### Implementation Details

**useEffect Hook:**
- Triggers whenever `isAuthenticated` or `isLoading` changes
- Uses `{ replace: true }` to replace history entry (prevents back button loop)
- Only navigates when authentication check is complete (`!isLoading`)

**Loading State:**
- Shows spinner while `isLoading` is true
- Prevents form flash before redirect

**Conditional Rendering:**
- Returns null if already authenticated
- Prevents form from rendering while redirecting

### Flow
1. User visits `/login` with valid token
2. `useAuth()` detects authentication
3. Loading spinner appears briefly
4. Page redirects to `/dashboard` with `replace: true`
5. Login form never renders for authenticated users

---

## 14. Summary of Final Changes

### Latest Files Modified
- `src/components/layout/Sidebar.tsx` - Enhanced loading states and role resolution
- `src/components/layout/DashboardLayout.tsx` - Moved loading state to main content
- `src/pages/Login.tsx` - Added authentication redirect
- `src/pages/Register.tsx` - Added authentication redirect

### Complete File Summary

**Created Files (4):**
```
src/lib/api/disasters.ts
src/lib/api/incidents.ts
src/lib/api/users.ts
src/pages/User.tsx
```

**Modified Files (8):**
```
src/contexts/AuthContext.tsx
src/pages/Dashboard.tsx
src/components/layout/DashboardLayout.tsx
src/components/layout/Sidebar.tsx
src/components/layout/Navbar.tsx
src/components/dashboard/StatsCard.tsx
src/lib/api.ts
src/lib/api/userLogin.ts
src/lib/api/userRegister.ts
src/pages/Login.tsx
src/pages/Register.tsx
src/App.tsx
```

### Key Achievements
✅ Complete API integration with real backend data
✅ Robust authentication with token refresh
✅ Proper role-based routing and navigation
✅ User profile management page
✅ Responsive sidebar with collapse functionality
✅ Loading states throughout application
✅ Fallback UI for edge cases
✅ Automatic redirect for authenticated users
✅ Console debugging for troubleshooting
✅ TypeScript type safety

---

## 15. Current Status

### Fully Implemented
- ✅ Login/Register pages with validation
- ✅ Dashboard with role-based content
- ✅ Sidebar navigation per role
- ✅ User profile page
- ✅ Authentication flow with token management
- ✅ API data integration
- ✅ Loading states and error handling
- ✅ Navbar with user menu

### Ready for Testing
1. User registration with role selection
2. Login with credentials
3. Dashboard displays correct role-based content
4. Sidebar shows appropriate menu items
5. User profile page with contact info
6. Collapse/expand sidebar
7. Logout functionality
8. Token refresh on 401 errors

### Ready for Enhancement
1. Profile editing with API calls
2. Password change functionality
3. Admin role management
4. Activity logging
5. Real-time notifications
6. Advanced filtering on dashboards

---

## 16. Quick Reference

### Important Endpoints
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
GET    /api/v1/users/me
GET    /api/v1/users
PATCH  /api/v1/users/{id}
GET    /api/v1/disaster
GET    /api/v1/incident
```

### Environment Variables
```
VITE_API_URL=https://api-41pz.onrender.com
```

### Role Types
```typescript
type UserRole = 
  | "disaster-manager"
  | "incident-validator"
  | "response-team"
  | "administrator";
```

### Key Hooks
```typescript
useAuth()           // Get user, isAuthenticated, isLoading, login, logout
useLanguage()       // Get t (translate), language, setLanguage
useDisastersQuery() // Get disasters data
useIncidentsQuery() // Get incidents data
useMyProfileQuery() // Get current user profile
```

### Protected Routes
All routes under `/` except `/login`, `/register`, `/forgot-password` require authentication via DashboardLayout

---

## Final Notes

This implementation provides a solid foundation for:
- Multi-role disaster management system
- Real-time alert monitoring
- User authentication and authorization
- Responsive dashboard interface
- Extensible component architecture

All components use TypeScript for type safety, TanStack Query for data management, and Tailwind CSS for styling. The auth flow is secure with token refresh capabilities and automatic logout on authentication failures.
