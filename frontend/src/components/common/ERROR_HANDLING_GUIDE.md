# Error Handling Guide

## Overview

This project has a comprehensive error handling system with 3 main components:

1. **ErrorBoundary** - Catches React component crashes
2. **NotFound (404)** - Handles invalid routes
3. **ErrorPage** - Generic reusable error display

---

## 1. ErrorBoundary

### What it does:
- Catches JavaScript errors anywhere in the component tree
- Logs error details to the console
- Displays a user-friendly error screen
- Provides "Reload" and "Go Home" buttons

### Usage:
Already implemented at the app root level in `App.tsx`. All routes are automatically protected.

```tsx
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

### Custom Fallback (Optional):
```tsx
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

### Features:
- ✅ Beautiful animated UI with gradient background
- ✅ Shows error message to users
- ✅ Shows stack trace in development mode only
- ✅ Reload button to reset the app
- ✅ Go Home button for navigation
- ✅ Dark mode support

---

## 2. NotFound (404 Page)

### What it does:
- Displays when user navigates to a non-existent route
- Shows helpful navigation options
- Suggests popular pages

### Usage:
Automatically triggered for any undefined route. Already configured in `App.tsx`:

```tsx
<Route path="*" element={<NotFound />} />
```

### Features:
- ✅ Animated 404 number with gradient
- ✅ Floating plant emojis animation
- ✅ "Go Home" and "Go Back" buttons
- ✅ Popular pages quick links
- ✅ Search suggestions
- ✅ Dark mode support

### Test:
Visit any invalid URL like:
- `/this-page-does-not-exist`
- `/random-route-123`

---

## 3. ErrorPage (Generic Component)

### What it does:
- Reusable error page component
- Can be used manually for custom error scenarios
- Highly customizable

### Usage:

#### Basic:
```tsx
import ErrorPage from '../pages/ErrorPage';

<ErrorPage />
```

#### Custom:
```tsx
<ErrorPage
  title="Access Denied"
  message="You don't have permission to view this page."
  error={errorObject}
  showRetry={true}
  showGoBack={true}
  onRetry={() => console.log('Retry clicked')}
/>
```

### Props:
- `title?: string` - Error title (default: "Something Went Wrong")
- `message?: string` - Error message (default: generic message)
- `error?: Error | string` - Error object or string to display
- `showRetry?: boolean` - Show retry button (default: true)
- `showGoBack?: boolean` - Show go back button (default: true)
- `onRetry?: () => void` - Custom retry handler (default: reload page)

### Features:
- ✅ Customizable title and message
- ✅ Shows error details if provided
- ✅ Flexible button configuration
- ✅ Custom retry handler support
- ✅ Dark mode support

---

## 4. ErrorMessage (Inline Component)

### What it does:
- Small inline error display
- Used within forms or sections
- Already exists in the codebase

### Usage:
```tsx
import ErrorMessage from '../components/common/ErrorMessage';

<ErrorMessage 
  error="Failed to load data"
  onRetry={() => loadData()}
/>
```

---

## Error Handling Best Practices

### 1. Component Level:
Use try-catch in async functions:
```tsx
const loadData = async () => {
  try {
    const data = await api.getData();
    setData(data);
  } catch (error) {
    setError(error.message);
  }
};
```

### 2. API Level:
Service layer already has error handling in `api.ts`

### 3. Route Level:
404 is automatically handled by `<Route path="*" element={<NotFound />} />`

### 4. App Level:
ErrorBoundary catches all unhandled React errors

---

## Testing Error Handling

### Test ErrorBoundary:
1. Temporarily add code that throws an error:
```tsx
const BrokenComponent = () => {
  throw new Error('Test error boundary');
  return <div>This won't render</div>;
};
```
2. You should see the ErrorBoundary screen
3. Click "Reload" or "Go Home"

### Test 404:
1. Navigate to `/invalid-route-xyz`
2. You should see the NotFound page
3. Click popular page links or "Go Home"

### Test ErrorPage:
1. Create a route with ErrorPage:
```tsx
<Route path="/error-test" element={
  <ErrorPage 
    title="Test Error"
    message="This is a test error page"
  />
} />
```
2. Navigate to `/error-test`

---

## Error Hierarchy

```
App (Root)
  ↓
ErrorBoundary (Catches ALL React errors)
  ↓
Router
  ↓
Routes
  ├─ Valid Routes → Render components
  └─ Invalid Routes → NotFound (404)
```

---

## Customization

### Change Colors:
Edit the gradient classes in each component:
- ErrorBoundary: `from-red-500 to-orange-500`
- NotFound: `from-emerald-500 via-green-500 to-teal-500`
- ErrorPage: `from-red-500 to-orange-500`

### Change Animations:
Modify framer-motion props:
- `initial`, `animate`, `transition`
- Duration, delay, easing functions

### Add Error Logging:
In ErrorBoundary `componentDidCatch`:
```tsx
// Send to error tracking service (Sentry, LogRocket, etc.)
logErrorToService(error, errorInfo);
```

---

## Common Scenarios

### 1. API Fails:
```tsx
try {
  const data = await api.getData();
} catch (error) {
  // Show inline error
  return <ErrorMessage error={error} onRetry={loadData} />;
}
```

### 2. Component Crashes:
```tsx
// ErrorBoundary automatically catches this
// No code needed - it's already set up!
```

### 3. Route Not Found:
```tsx
// NotFound automatically shows
// No code needed - it's already configured!
```

### 4. Manual Error Page:
```tsx
if (accessDenied) {
  return <ErrorPage 
    title="Access Denied"
    message="You don't have permission."
  />;
}
```

---

## Summary

✅ **ErrorBoundary** - Wraps entire app  
✅ **NotFound** - 404 route handler  
✅ **ErrorPage** - Reusable component  
✅ **ErrorMessage** - Inline errors  

**All set up and ready to use!** 🎉

