# Login Page Redirect Fix - Conversation Summary

## Overview
Fixed the login page to properly redirect to the dashboard after successful authentication. The issue was that the page showed "login successful" toast but didn't navigate to `/dashboard`.

---

## Problem Statement

### Initial Issue
- User logs in successfully
- Toast message "login successful" appears
- Page does NOT redirect to `/dashboard`
- User remains on login page despite having valid tokens

### Root Cause Analysis
The problem had multiple layers:

1. **Non-reactive token state** - `useMyProfileQuery` checked `localStorage.getItem("accessToken")` directly in the hook body, which is not reactive to changes
2. **Stale closure** - The `hasToken` boolean was evaluated once at mount time and never updated
3. **Query hook not re-enabled** - When token was stored, the query hook didn't know to enable itself and refetch
4. **Non-centralized login API** - Login mutation used plain `axios` instead of the centralized `api` instance with proper interceptors

---

## Solutions Implemented

### 1. Made Login Use Centralized API Instance
**File: `src/lib/api/userLogin.ts`**

Changed from plain axios to the centralized `api` instance which includes:
- Request interceptors for token injection
- Response interceptors for token refresh
- Proper error handling

```typescript
// BEFORE
const loginUserFunc = async (loginUser: LoginUserType) => {
  const response = await axios.post(`${apiURL}/auth/login`, loginUser);
  return response.data;
};

// AFTER
import { api } from "../api";
import { BaseGenericApiResponse, AuthTokenOutput } from "@/types/api";

const loginUserFunc = async (loginUser: LoginUserType) => {
  const response = await api.post<BaseGenericApiResponse<AuthTokenOutput>>(
    "/auth/login", 
    loginUser
  );
  return response.data;
};
```

### 2. Dispatch Custom Event on Token Change
**File: `src/lib/api/userLogin.ts`**

Added event dispatch to notify all listeners when token changes:

```typescript
export const useLoginUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUserFunc,
    onSuccess: (responseData) => {
      const { accessToken, refreshToken } = responseData.data;
      
      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      
      // Dispatch custom event to notify hooks of token change
      window.dispatchEvent(new Event("token-change"));
      
      // Invalidate profile query so it gets refetched with new token
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
```

### 3. Make Profile Query Hook Reactive
**File: `src/lib/api/users.ts`**

Made `useMyProfileQuery` listen for token changes:

```typescript
export const useMyProfileQuery = () => {
  const [hasToken, setHasToken] = useState(!!localStorage.getItem("accessToken"));

  useEffect(() => {
    // Check token immediately
    setHasToken(!!localStorage.getItem("accessToken"));

    // Also listen to custom event for token changes
    const handleTokenChange = () => {
      setHasToken(!!localStorage.getItem("accessToken"));
    };

    window.addEventListener("token-change", handleTokenChange);
    return () => window.removeEventListener("token-change", handleTokenChange);
  }, []);
  
  return useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
    enabled: hasToken, // Only fetch if token exists
    retry: false, // Don't retry on 401
  });
};
```

### 4. Simplified Auth Context
**File: `src/contexts/AuthContext.tsx`**

Removed complex token state management - let `useMyProfileQuery` handle it:

```typescript
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // Only fetch user if token exists
  const { data: user = null, isLoading, isError } = useMyProfileQuery();
  const hasToken = !!localStorage.getItem("accessToken");

  // If token exists but user failed to load, clear token
  if (hasToken && isError && !isLoading) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  // ... rest of context
};
```

### 5. Updated Login Page Error Handling
**File: `src/pages/Login.tsx`**

Improved success/error handling and UI feedback:

```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!formData.username || !formData.password) {
    toast.error("Username and password are required");
    return;
  }

  try {
    const submissionData: LoginUserType = {
      username: formData.username,
      password: formData.password,
    };

    mutate(submissionData, {
      onSuccess: () => {
        toast.success("Login successful!");
        // The useEffect above will automatically redirect to /dashboard
        // when isAuthenticated becomes true
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Invalid credentials";
        toast.error(errorMessage);
      },
    });
  } finally {
    setLocalError(null);
  }
};
```

Also added loading spinner to button:

```typescript
<Button type="submit" className="w-full" disabled={isPending || isLoading}>
  {isPending || isLoading ? (
    <>
      <Loader className="h-4 w-4 mr-2 animate-spin" />
      Signing in...
    </>
  ) : (
    "Sign In"
  )}
</Button>
```

---

## Complete Authentication Flow

### Step-by-Step Process

1. **User enters credentials and clicks Sign In**
   - Form validation runs
   - `isPending` state shows spinner
   - Button becomes disabled

2. **Login Mutation Executes**
   - `useLoginUserMutation` calls `api.post("/auth/login", credentials)`
   - Request uses centralized API instance with interceptors
   - Server validates credentials and returns tokens

3. **Success Handler Runs**
   - `accessToken` and `refreshToken` stored in localStorage
   - Custom `token-change` event dispatched via `window.dispatchEvent()`
   - `queryClient.invalidateQueries()` clears profile cache

4. **Profile Hook Reacts to Token Change**
   - `token-change` event listener fires in `useMyProfileQuery`
   - `hasToken` state updates from false to true
   - Query automatically becomes enabled
   - `getMyProfile()` executes with new token from interceptor

5. **User Data Returns**
   - `/users/me` endpoint returns user profile
   - `user` data now populated in `useMyProfileQuery`
   - AuthContext receives updated user data

6. **Auth State Updates**
   - AuthContext: `user` is no longer null
   - AuthContext: `isAuthenticated` becomes true (because `!!user && hasToken`)
   - Login page's `useEffect` detects `isAuthenticated === true`

7. **Navigation Triggers**
   - Login page's `useEffect` runs:
     ```typescript
     useEffect(() => {
       if (isAuthenticated && !isLoading) {
         navigate("/dashboard", { replace: true });
       }
     }, [isAuthenticated, isLoading, navigate]);
     ```
   - User redirected to `/dashboard` with `replace: true`
   - Back button doesn't return to login

8. **Dashboard Renders**
   - DashboardLayout checks `isAuthenticated` (true)
   - Shows main content
   - Sidebar renders with user's role-based navigation
   - Dashboard displays role-specific content

---

## Files Modified

### 1. `src/lib/api/userLogin.ts`
- Changed from plain axios to centralized `api` instance
- Added `useQueryClient` for query invalidation
- Added `token-change` event dispatch
- Proper error handling with typed responses

### 2. `src/lib/api/users.ts`
- Added `useState` and `useEffect` imports
- Made `useMyProfileQuery` hook reactive
- Added `token-change` event listener
- State updates when token changes

### 3. `src/contexts/AuthContext.tsx`
- Removed complex token state management
- Simplified to rely on `useMyProfileQuery`
- Kept error handling for failed profile loads
- Removed unused useState/useEffect

### 4. `src/pages/Login.tsx`
- Improved error handling in mutation callbacks
- Better error messages from API response
- Added loading spinner to submit button
- Improved comments explaining the flow

---

## Key Technical Concepts

### Custom Event System
Instead of React state or event emitters, uses browser's native `window.dispatchEvent()`:

```typescript
// Dispatch event when token changes
window.dispatchEvent(new Event("token-change"));

// Listen for event
window.addEventListener("token-change", handleTokenChange);
```

**Why this approach?**
- Works across hooks without prop drilling
- Native browser API, no external dependencies
- Lightweight and performant
- Can be heard by all listeners

### Query Invalidation vs Refetch
```typescript
// Clear cache, force fresh fetch
queryClient.invalidateQueries({ queryKey: ["profile"] });

// NOT: refetchQueries which just refetches current data
```

Invalidation is better here because:
- Clears stale data
- Forces new request with fresh token
- Combines with `enabled` gate to only fetch when hasToken is true

### Request Interceptor for Token Injection
The centralized `api` instance automatically adds the token:

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
```

This ensures every API call after login includes the token automatically.

---

## Testing Checklist

- [ ] Type invalid credentials → Shows error toast
- [ ] Type valid credentials → Shows "Signing in..." spinner
- [ ] After success → "Login successful!" toast appears
- [ ] Within 1 second → Auto-redirects to `/dashboard`
- [ ] Dashboard shows → Correct role-based content
- [ ] Sidebar shows → User's role-based navigation items
- [ ] Back button → Does NOT go back to login (uses `replace: true`)
- [ ] Network error → Shows appropriate error message
- [ ] Already logged in → Redirects to dashboard on page load
- [ ] Logout → Returns to login page

---

## Debugging

### If redirect still doesn't work:

1. **Check browser console** for errors during login
2. **Check Network tab** to see if `/users/me` is called after login
3. **Check Application > Local Storage** to verify tokens are stored
4. **Check React DevTools** to see if `isAuthenticated` becomes true

### Add debugging logs:

```typescript
// In useMyProfileQuery
useEffect(() => {
  const token = localStorage.getItem("accessToken");
  console.log("[useMyProfileQuery] Token changed to:", !!token);
  setHasToken(!!token);
}, []);

// In Login page
useEffect(() => {
  console.log("[Login] isAuthenticated:", isAuthenticated, "isLoading:", isLoading);
  if (isAuthenticated && !isLoading) {
    console.log("[Login] Redirecting to dashboard");
    navigate("/dashboard", { replace: true });
  }
}, [isAuthenticated, isLoading, navigate]);
```

---

## Related Fixes

This fix builds on the earlier USER_ROLE_FIX.md which addressed:
- Role normalization (uppercase to lowercase)
- Sidebar role-based navigation
- User profile page with edit functionality

Both fixes work together to provide a complete authentication and authorization flow.

---

## Future Enhancements

1. **Loading skeleton** during profile fetch after login
2. **Remember me** functionality for persistent login
3. **OAuth/SSO** integration for external authentication
4. **Multi-factor authentication** support
5. **Session timeout** with automatic logout
6. **Redirect after login** to originally requested URL (if user was redirected to login)

---

## Summary

The login redirect was fixed by making the profile query hook **reactive to token changes** through:
1. Custom event dispatch on token storage
2. State-based token detection in the hook
3. Event listener that triggers state updates
4. Proper query invalidation to force refetch
5. Auth context that provides reactive `isAuthenticated` to Login page
6. Login page useEffect that redirects when authenticated

This creates a complete reactive chain from login → token storage → profile fetch → auth update → redirect.
