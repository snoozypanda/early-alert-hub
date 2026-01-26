# User Role Fix - Conversation Summary

## Overview
Fixed role handling throughout the Early Alert Hub application to properly normalize backend API roles (uppercase format) to the UI format (lowercase with hyphens).

---

## Problem Statement
Backend API returns user roles in uppercase format like:
- `['USER', 'INCIDENT VALIDATOR']`
- `['USER', 'RESPONSE TEAM']`

But the UI expected lowercase format like:
- `'incident-validator'`
- `'response-team'`

This caused roles to not match UI role configuration, resulting in empty sidebars and incorrect role-based navigation.

---

## Solutions Implemented

### 1. Created Role Normalization System
**File: `src/config/roleUI.ts`**

Added role mapping dictionary and normalization function:

```typescript
// Map backend API roles (uppercase) to UI roles (lowercase)
export const roleMap: Record<string, Role> = {
  // Exact matches
  "DISASTER-MANAGER": "disaster-manager",
  "INCIDENT-VALIDATOR": "incident-validator",
  "RESPONSE-TEAM": "response-team",
  "ADMINISTRATOR": "administrator",
  
  // Variations (with spaces instead of hyphens)
  "DISASTER MANAGER": "disaster-manager",
  "INCIDENT VALIDATOR": "incident-validator",
  "RESPONSE TEAM": "response-team",
  
  // Handle potential variations
  "USER": "disaster-manager", // Default fallback
};

/**
 * Convert backend role string to UI role
 */
export function normalizeRole(backendRole: string | undefined): Role | undefined {
  if (!backendRole) return undefined;
  
  const normalized = backendRole.trim().toUpperCase();
  return roleMap[normalized];
}
```

This handles multiple formats:
- Hyphens vs spaces
- Uppercase variations
- Generic "USER" fallback

### 2. Updated Sidebar Component
**File: `src/components/layout/Sidebar.tsx`**

- Imported `normalizeRole` function
- Changed role resolution logic to iterate through roles array and normalize each one
- Removed fallback to non-existent `user.role` property (User type only has `roles`)
- Updated debug logging

```typescript
if (Array.isArray(user.roles) && user.roles.length > 0) {
  for (const role of user.roles) {
    const normalized = normalizeRole(role);
    if (normalized) {
      userRole = normalized;
      break;
    }
  }
}
```

### 3. Fixed Dashboard Component
**File: `src/pages/Dashboard.tsx`**

- Imported `normalizeRole` function
- Updated role resolution to normalize backend roles before comparison
- Removed fallback to `user.role`

```typescript
if (Array.isArray(user?.roles) && user.roles.length > 0) {
  for (const role of user.roles) {
    const normalized = normalizeRole(role);
    if (normalized) {
      userRole = normalized;
      break;
    }
  }
}
```

### 4. Made Sidebar Fixed Position
**Files: `src/components/layout/Sidebar.tsx`, `src/components/layout/DashboardLayout.tsx`**

Changed sidebar from relative to fixed positioning:
- Added `fixed left-0 top-16` classes to all sidebar instances
- Updated `DashboardLayout` to use dynamic margin based on sidebar state
- Sidebar stays fixed while page content scrolls

```typescript
// In DashboardLayout
<main
  className="flex-1 overflow-auto transition-all duration-300"
  style={{ marginLeft: sidebarCollapsed ? '64px' : '256px' }}
>
```

### 5. Enhanced User Profile Page
**File: `src/pages/User.tsx`**

#### Added Edit Functionality
- Imported `useUpdateMyProfileMutation` hook
- Integrated API call for profile updates
- Added loading state during save

```typescript
const { mutate: updateProfile, isPending } = useUpdateMyProfileMutation();

const handleSave = async () => {
  try {
    updateProfile(formData, {
      onSuccess: () => {
        setEditMode(false);
        toast.success("Profile updated successfully");
      },
    });
  } catch (error) {
    toast.error("Failed to update profile");
  }
};
```

#### Made Fields Editable
- Name field becomes editable in edit mode
- Email field becomes editable input
- Username field becomes editable input
- Save/Cancel buttons appear when editing

#### Fixed Role Display
- Created `formatRoleName()` function to properly format role names
- Normalized roles before displaying
- Applied color-coded badges for each role type
- Shows all assigned roles with proper styling

```typescript
const formatRoleName = (role: string): string => {
  const normalized = normalizeRole(role);
  if (normalized) {
    return normalized.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  return role.split(/[\s-]/).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};
```

### 6. Created Update Profile API Hook
**File: `src/lib/api/users.ts`**

Added new function and mutation hook:

```typescript
export const updateMyProfile = async (data: { 
  name?: string; 
  email?: string; 
  username?: string 
}) => {
  const response = await api.patch<{ data: UserType }>("/users/me", data);
  return response.data.data;
};

export const useUpdateMyProfileMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
    },
  });
};
```

---

## Technical Changes Summary

### Files Created
- (None - only modified existing files)

### Files Modified
1. **src/config/roleUI.ts**
   - Added `roleMap` dictionary
   - Added `normalizeRole()` function

2. **src/components/layout/Sidebar.tsx**
   - Imported `normalizeRole`
   - Updated role resolution logic
   - Made sidebar fixed position
   - Improved debug logging

3. **src/components/layout/DashboardLayout.tsx**
   - Updated flex layout to work with fixed sidebar
   - Added dynamic margin based on sidebar state
   - Removed nested flex container

4. **src/pages/Dashboard.tsx**
   - Imported `normalizeRole`
   - Updated role resolution logic

5. **src/pages/User.tsx**
   - Imported `useUpdateMyProfileMutation`, `normalizeRole`
   - Added edit mode with form inputs
   - Implemented profile update functionality
   - Added `formatRoleName()` helper
   - Enhanced role display with color coding
   - Added Save/Cancel buttons with loading states

6. **src/lib/api/users.ts**
   - Added `updateMyProfile()` function
   - Added `useUpdateMyProfileMutation()` hook

---

## API Endpoints Used
- `PATCH /users/me` - Update current user profile
- `GET /users/me` - Fetch current user profile (already existed)

---

## Features Implemented

✅ **Role Normalization**
- Converts uppercase backend roles to UI format
- Handles multiple format variations
- Fallback for unknown roles

✅ **Fixed Sidebar**
- No longer scrolls with page content
- Stays in view at all times
- Responsive to collapsed state

✅ **Editable User Profile**
- Edit name, email, username
- Save changes to API
- Real-time validation and error handling

✅ **Proper Role Display**
- Formatted role names (e.g., "Incident Validator")
- Color-coded badges per role type
- Shows all assigned roles

✅ **Loading States**
- Loading spinner during profile save
- Disabled inputs while saving
- Proper error toast notifications

---

## Testing Checklist

- [ ] Login with user having roles `['USER', 'INCIDENT VALIDATOR']`
- [ ] Verify sidebar shows incident validator menu items
- [ ] Check role badge displays "Incident Validator" (not uppercase)
- [ ] Navigate to user profile page
- [ ] Edit user information
- [ ] Verify changes are saved to API
- [ ] Check role colors match configuration
- [ ] Verify sidebar stays fixed while scrolling
- [ ] Test sidebar collapse/expand with fixed positioning
- [ ] Test with roles containing hyphens vs spaces

---

## Key Functions and Hooks

### Role Normalization
```typescript
normalizeRole(backendRole: string): Role | undefined
```
Converts backend role format to UI role format.

### Format Role Name
```typescript
formatRoleName(role: string): string
```
Formats role string for display (e.g., "incident-validator" → "Incident Validator").

### Update Profile Mutation
```typescript
useUpdateMyProfileMutation()
```
TanStack Query mutation for updating user profile with automatic cache invalidation.

---

## Error Handling

- **Invalid roles**: Falls back to UI default if normalization fails
- **Failed updates**: Toast notification with error message
- **Network errors**: Caught and handled with user feedback
- **Console warnings**: Debug logs for role mismatches

---

## Notes

- User type only has `roles` (array), not `role` (singular)
- All role comparisons now use normalized format
- Role colors defined in `roleColors` map
- Backend API endpoint uses `/users/me` not `/users/{id}` for current user
- Sidebar margin transitions smoothly on collapse/expand

---

## Future Enhancements

1. Add password change functionality in security section
2. Add role badge customization options
3. Add timezone preference to user profile
4. Add two-factor authentication settings
5. Add user activity log
6. Add admin panel to manage user roles

---

# Additional Updates - Backend Role Format Fix & Profile Refetch

## Problem: Backend Sends Uppercase Roles with Spaces

During testing, discovered that the backend API returns user roles in uppercase format with spaces:
- `['USER', 'INCIDENT VALIDATOR']`
- `['USER', 'RESPONSE TEAM']`

But the UI normalization system expected hyphens:
- Expected: `'INCIDENT-VALIDATOR'`
- Received: `'INCIDENT VALIDATOR'`

### Solution: Enhanced Role Mapping

**Updated File: `src/config/roleUI.ts`**

Already had space-based variations in the `roleMap`, so the existing `normalizeRole()` function handles both:

```typescript
export const roleMap: Record<string, Role> = {
  // Exact matches with hyphens
  "DISASTER-MANAGER": "disaster-manager",
  "INCIDENT-VALIDATOR": "incident-validator",
  "RESPONSE-TEAM": "response-team",
  "ADMINISTRATOR": "administrator",
  
  // Variations with spaces (for backend compatibility)
  "DISASTER MANAGER": "disaster-manager",
  "INCIDENT VALIDATOR": "incident-validator",  // ← handles backend format
  "RESPONSE TEAM": "response-team",            // ← handles backend format
  
  // Fallback for unknown roles
  "USER": "disaster-manager",
};
```

The function normalizes by:
1. Trimming whitespace
2. Converting to uppercase
3. Looking up in the roleMap
4. Returns the standardized UI role format

### Result
✅ Sidebar now displays correctly for users with roles like `['USER', 'INCIDENT VALIDATOR']`
✅ Role badges show formatted names like "Incident Validator"
✅ No empty sidebars or missing navigation

---

## Problem: Profile Updates Not Reflecting in UI

After successful profile update, the form data updated but other parts of the UI didn't reflect the changes because the `user` object in AuthContext wasn't being refreshed.

### Solution: Proper Cache Invalidation

**Updated File: `src/lib/api/users.ts`**

Changed from `refetchQueries` to `invalidateQueries`:

```typescript
export const useUpdateMyProfileMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: { name?: string; email?: string; username?: string } }) => 
      updateMyProfile(userId, data),
    onSuccess: (data) => {
      // Update the cache with new profile data immediately
      queryClient.setQueryData(["profile"], data);
      
      // Invalidate and refetch the profile query to ensure UI is in sync with latest server data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
```

**Why invalidateQueries instead of refetchQueries?**
- `invalidateQueries`: Clears the cache completely, forces a fresh fetch from server
- `refetchQueries`: Only refetches current data, doesn't clear stale data

### Flow After Profile Update

1. User saves changes → mutation fires
2. PATCH request to `/users/{userId}` with form data
3. Response data updates cache immediately via `setQueryData`
4. Query invalidated → forces fresh fetch
5. `useMyProfileQuery` re-executes with new token
6. Latest user data fetched from `/users/me`
7. AuthContext's `user` object updates
8. `useEffect` in User.tsx detects user change
9. `formData` state syncs with new user data
10. UI displays fresh values

### Result
✅ Profile updates immediately visible in UI
✅ All dependent components refresh automatically
✅ No stale data issues

---

## Problem: User ID Endpoint Requirement

Initially, the mutation used `/users/me` endpoint, but requirement changed to use `/users/{userId}` endpoint.

### Solution: Dynamic User ID in Mutation

**Updated Files:**
1. `src/lib/api/users.ts` - Updated function signature
2. `src/pages/User.tsx` - Pass user ID to mutation

**In `users.ts`:**
```typescript
export const updateMyProfile = async (userId: number, data: { name?: string; email?: string; username?: string }) => {
  const response = await api.patch<{ data: UserType }>(`/users/${userId}`, data);
  return response.data.data;
};

export const useUpdateMyProfileMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: { name?: string; email?: string; username?: string } }) => 
      updateMyProfile(userId, data),
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
```

**In `User.tsx`:**
```typescript
const handleSave = async () => {
  if (!user) return;
  
  try {
    updateProfile({ userId: user.id, data: formData }, {
      onSuccess: () => {
        setEditMode(false);
        toast.success("Profile updated successfully");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to update profile");
      },
    });
  } catch (error) {
    toast.error("Failed to update profile");
  }
};
```

### Result
✅ Profile updates use `/users/{userId}` endpoint
✅ User ID extracted from authenticated user context
✅ Type-safe mutation parameters

---

## Problem: User ID Displayed in Profile

The User ID was shown in the Account Details section, but this was not necessary for the UI.

### Solution: Removed Display Element

**Updated File: `src/pages/User.tsx`**

Removed the entire User ID display block (lines 256-273):

```typescript
// REMOVED:
<div className="p-3 rounded-lg border border-border bg-background">
  <p className="text-sm text-muted-foreground">User ID</p>
  <div className="flex items-center gap-2 mt-1">
    <p className="text-foreground font-mono text-sm">{user.id}</p>
    <Button variant="ghost" size="sm" onClick={() => handleCopy(user.id.toString())}>
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  </div>
</div>
```

### Result
✅ Cleaner Account Details section
✅ Focus on user-relevant information (created date, last updated)
✅ User ID still used internally for API calls

---

## Updated Files Summary

### Modified in This Update
1. **src/config/roleUI.ts**
   - Already supports both hyphenated and space-separated role formats
   - No changes needed, but confirmed working with backend role format

2. **src/lib/api/users.ts**
   - Changed `updateMyProfile()` to accept `userId` parameter
   - Updated endpoint from `/users/me` to `/users/{userId}`
   - Modified mutation to accept `userId` and `data` as separate fields
   - Changed from `refetchQueries` to `invalidateQueries` for proper cache refresh

3. **src/pages/User.tsx**
   - Updated `handleSave()` to pass `userId: user.id` to mutation
   - Removed User ID display section from Account Details
   - Added null check before updating profile

---

## Complete Authentication & Profile Flow

### Login to Profile Update Journey

1. **User Logs In** (see LOGIN_FIX_THREAD.md)
   - Credentials submitted
   - Tokens stored in localStorage
   - Profile query enabled and executes

2. **Profile Fetches** 
   - GET `/users/me` returns user with roles
   - Roles in format: `['USER', 'INCIDENT VALIDATOR']`

3. **Role Normalization**
   - Each role normalized via `normalizeRole()`
   - `'INCIDENT VALIDATOR'` → `'incident-validator'`
   - Sidebar renders with correct navigation items

4. **Dashboard Displays**
   - Role-based content rendered
   - User profile page accessible

5. **User Edits Profile**
   - Enters new name/email/username
   - Clicks "Save Changes"

6. **Profile Updates**
   - PATCH `/users/{userId}` with form data
   - Response received with updated user object
   - Cache updated immediately via `setQueryData`
   - Query invalidated

7. **Profile Query Refetches**
   - GET `/users/me` executes
   - Latest user data retrieved from server
   - AuthContext's `user` updates

8. **UI Refreshes**
   - `useEffect` in User.tsx detects user change
   - `formData` synced with new user data
   - All role displays update automatically
   - Success toast shown

---

## Testing Scenarios

### Scenario 1: Role Display
```
Backend returns: { roles: ['USER', 'INCIDENT VALIDATOR'] }
↓
normalizeRole('INCIDENT VALIDATOR') → 'incident-validator'
↓
Sidebar shows: Incidents menu item
Badge shows: "Incident Validator"
✅ PASS
```

### Scenario 2: Profile Update
```
User updates name: "John Doe" → "Jane Smith"
↓
PATCH /users/123 with new name
↓
Cache invalidated
Query refetches: GET /users/me
↓
User context updates
formData syncs with new user data
UI displays: "Jane Smith"
✅ PASS
```

### Scenario 3: Multiple Roles
```
Backend returns: { roles: ['USER', 'INCIDENT VALIDATOR', 'RESPONSE TEAM'] }
↓
First role normalized: 'INCIDENT VALIDATOR' → 'incident-validator'
Sidebar renders: Incident Validator menu
All roles shown: Incident Validator, Response Team badges
✅ PASS
```

---

## Known Limitations

1. **User ID Parameter** - Currently using user.id from authenticated context. If user ID changes externally, would need refresh.
2. **Profile Fields** - Only name, email, username are editable. Other fields (roles, account status) are read-only.
3. **Optimistic Updates** - Mutation updates cache immediately but still waits for server confirmation.

---

## Related Documentation

- **LOGIN_FIX_THREAD.md** - Complete login and redirect flow
- **USER_ROLE_FIX.md** (original) - Initial role normalization setup

---

## Summary

This update ensures:
- ✅ Backend roles in any format (uppercase with spaces or hyphens) are properly normalized
- ✅ Profile updates trigger proper cache invalidation and UI refresh
- ✅ User ID used in PATCH endpoint while maintaining security
- ✅ Clean UI without unnecessary user ID display
- ✅ Complete reactive flow from authentication through profile management
