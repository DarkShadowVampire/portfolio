# Analytics Authentication Setup

## Overview

The analytics dashboard is now **password-protected**. Only you can access it by entering the correct password.

## Default Password

**Default Password:** `admin123`

⚠️ **CHANGE THIS IMMEDIATELY!**

## How to Change the Password

### Option 1: Environment Variable (Recommended)

1. Create or update `.env.local` file in your project root:

```bash
# .env.local
REACT_APP_ANALYTICS_PASSWORD=your_secret_password_here
```

2. Restart your development server:
```bash
npm start
```

3. The analytics panel will now require your custom password

### Option 2: Direct Code Change

Edit [src/components/AnalyticsDebugPanel.tsx](src/components/AnalyticsDebugPanel.tsx):

```typescript
// Around line 14
const ANALYTICS_PASSWORD = "your_secret_password_here";
```

## Features

✅ **Password Protection** - Only you can access analytics
✅ **Session-based Auth** - Authentication persists during browser session
✅ **Auto-logout on Browser Close** - Session storage clears when browser closes
✅ **Login Error Messages** - Visual feedback for wrong password
✅ **Logout Button** - Quickly log out to secure the panel

## Security Notes

- Password is **NOT encrypted** in the environment variable
- This is suitable for **development/personal use only**
- For production dashboards, use proper authentication (OAuth, JWT, etc.)
- Authentication state is stored in **sessionStorage** (cleared on browser close)
- Do NOT commit your `.env.local` file with real passwords to version control

## Using the Analytics Panel

1. Click **"Show Analytics"** button (bottom-right)
2. Enter your password
3. Click **"Unlock Analytics"**
4. View and manage your visitor data
5. Click **"Logout"** when done

## What's Protected

- Visitor data overview
- Device information
- User interactions
- Analytics summary
- Geolocation requests
- Data export (JSON/CSV)
- Clear analytics function

## .gitignore Setup

Make sure `.env.local` is in your `.gitignore`:

```bash
# .gitignore
.env.local
.env*.local
```

This ensures passwords are never committed to version control.

## Example .env.local

```bash
# Analytics authentication
REACT_APP_ANALYTICS_PASSWORD=MySecurePassword123!

# Optional: other environment variables
REACT_APP_ANALYTICS_ENDPOINT=https://api.example.com/analytics
```

## Tips

- Use a strong, unique password
- Don't share your password publicly
- Change password regularly
- Use different passwords for different deployments
- For team access, consider a proper authentication system

## Troubleshooting

### "Invalid password" error
- Double-check you're using the correct password
- Make sure you didn't accidentally add spaces
- Passwords are case-sensitive

### Password not working after restart
- Verify `.env.local` file exists in project root
- Make sure the file has correct format: `REACT_APP_ANALYTICS_PASSWORD=your_password`
- Restart the dev server: `npm start`

### Lost your password?
- Check `.env.local` file
- Or restore the default: `admin123`
- Or update the environment variable and restart

---

**Security Tip:** Update your password today! 🔒
