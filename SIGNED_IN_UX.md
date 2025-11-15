# 🔐 Signed-In User Experience - NovaLibrary

Complete authentication UX implementation with session management, token refresh, and protected routes.

---

## ✨ Features Implemented

### 1. **Session Management**
- ✅ Persistent login with localStorage
- ✅ Auto-restore session on page reload via `/me` endpoint
- ✅ Access token (15min) + Refresh token (7 days)
- ✅ Automatic token refresh on 401 errors
- ✅ Graceful logout with state cleanup

### 2. **Signed-In UI**
- ✅ **Header Actions**: Shows user chip with name/avatar when logged in
- ✅ **Dropdown Menu**: Profile, Orders, Wishlist, Logout
- ✅ **Loading State**: Skeleton while bootstrapping auth
- ✅ **Animations**: Smooth dropdown transitions

### 3. **Profile Page**
- ✅ Display user info: Name, Email, Role, Member Since
- ✅ Avatar with initials
- ✅ Role badge (Admin/Librarian/Reader)
- ✅ Logout button
- ✅ "Edit profile" placeholder (coming soon)
- ✅ Quick stats (Books borrowed, Wishlist, Orders)

### 4. **Protected Routes**
- ✅ `/profile` - User profile page
- ✅ `/orders` - Order history
- ✅ `/wishlist` - Saved items
- ✅ `/checkout` - Payment flow
- ✅ Auto-redirect to login if not authenticated
- ✅ Return to intended page after login

### 5. **Auth Flow**
- ✅ Login → Save tokens → Redirect to previous page
- ✅ Register → Save tokens → Redirect to previous page
- ✅ Logout → Clear tokens → Redirect to login
- ✅ Page refresh → Restore session from localStorage

---

## 📂 Files Modified/Created

### Created:
```
frontend/src/pages/Profile.jsx              # User profile page
frontend/src/routers/PrivateRoute.jsx       # Protected route wrapper
```

### Updated:
```
frontend/src/context/AuthContext.jsx        # Full session management
frontend/src/utils/http.js                  # Auto token refresh interceptor
frontend/src/components/Header/Actions.jsx  # Signed-in UI with dropdown
frontend/src/components/Login.jsx           # Redirect to previous location
frontend/src/components/Register.jsx        # Redirect to previous location
frontend/src/routers/router.jsx             # Add protected routes
frontend/src/index.css                      # Dropdown animations
```

---

## 🔑 AuthContext API

### State:
```javascript
const {
  user,              // Current user object or null
  accessToken,       // JWT access token
  refreshToken,      // JWT refresh token
  isLoading,         // Bootstrap loading state
  isAuthenticated,   // Boolean: !!user
} = useAuth();
```

### Actions:
```javascript
await registerUser(email, password, name);  // Register new user
await loginUser(email, password);           // Login existing user
await logout();                             // Logout and clear session
await fetchMe();                            // Re-fetch current user
await refreshAccess();                      // Refresh access token
```

---

## 🔄 Token Refresh Flow

1. Request to API with expired access token
2. Backend returns **401 Unauthorized**
3. HTTP interceptor catches 401
4. Calls `/auth/refresh` with refresh token
5. Gets new access token
6. Retries original request with new token
7. If refresh fails → logout and redirect to login

---

## 🛡️ Protected Routes Usage

Wrap routes that require authentication:

```jsx
{
  element: <PrivateRoute />,
  children: [
    { path: "profile", element: <Profile /> },
    { path: "orders", element: <Orders /> },
  ]
}
```

**Behavior:**
- If `isLoading` → Show loading spinner
- If `!user` → Redirect to `/login` with `state: { from: currentPath }`
- If `user` → Render protected content

---

## 🎨 Header Actions States

### Signed Out:
```
[Wishlist] [Cart] [Login Button]
```

### Loading:
```
[Wishlist] [Cart] [● Skeleton]
```

### Signed In:
```
[Wishlist] [Cart] [🟢 Hi, John ▼]
                      └─ Dropdown Menu
                         ├─ My Profile
                         ├─ Orders
                         ├─ Wishlist
                         ├─ ───────
                         └─ Logout
```

---

## 🧪 Testing Checklist

### ✅ Login Flow
- [ ] Login with valid credentials
- [ ] See "Hi, {name}" in header
- [ ] Click user chip → dropdown opens
- [ ] Navigate to Profile
- [ ] Profile shows correct user data

### ✅ Session Persistence
- [ ] Login
- [ ] Refresh page (F5)
- [ ] User still logged in
- [ ] Header still shows user chip

### ✅ Protected Routes
- [ ] Logout
- [ ] Try to visit `/profile`
- [ ] Redirected to `/login`
- [ ] Login
- [ ] Automatically redirected back to `/profile`

### ✅ Token Refresh
- [ ] Login
- [ ] Wait 15+ minutes (access token expires)
- [ ] Make any API request
- [ ] Token auto-refreshes
- [ ] Request succeeds

### ✅ Logout
- [ ] Click user chip → Logout
- [ ] Redirected to `/login`
- [ ] Header shows "Login" button
- [ ] Visiting `/profile` redirects to login

---

## 🔧 Environment Variables

```env
# Frontend (.env)
VITE_API_URL=http://localhost:4001/api
VITE_AUTH_MODE=api

# Backend (.env)
PORT=4001
JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
```

---

## 📊 User Object Structure

```json
{
  "id": "uuid-here",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "reader",
  "createdAt": "2025-11-12T15:32:41.436Z"
}
```

---

## 🎯 Future Enhancements

- [ ] Edit profile (name, password)
- [ ] Upload avatar image
- [ ] Email verification
- [ ] Password reset flow
- [ ] Two-factor authentication
- [ ] OAuth (Google, Facebook)
- [ ] Session management (view active sessions)
- [ ] Activity log

---

## 🐛 Troubleshooting

### Session not persisting after refresh?
- Check localStorage for `novalib_access_token`, `novalib_refresh_token`, `novalib_user`
- Check browser console for errors
- Verify `/me` endpoint returns valid user

### Token refresh failing?
- Check refresh token in localStorage
- Verify backend `/auth/refresh` endpoint
- Check refresh token expiration (7 days)

### Dropdown not closing?
- Check if `mousedown` event listener is attached
- Verify `dropdownRef` is correctly assigned

### Protected routes not redirecting?
- Check `PrivateRoute` component is wrapping routes
- Verify `isLoading` is set to `false` after bootstrap
- Check `user` state in AuthContext

---

## 📚 Related Documentation

- [Backend API Documentation](../../backend/README.md)
- [Setup Guide](../../SETUP_GUIDE.md)
- [Port Configuration](../../PORT_CONFIG.md)

---

**Last Updated:** 2025-11-12  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
