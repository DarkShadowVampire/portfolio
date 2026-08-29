# Hidden Analytics Access

## Overview

The analytics panel is **completely hidden from view** to all visitors. Only you can access it using a keyboard shortcut.

## How to Access Analytics

### Keyboard Shortcut
Press **`Ctrl + Shift + A`** (Windows/Linux) or **`Cmd + Shift + A`** (Mac)

This will open the analytics dashboard in the bottom-right corner.

## Security Features

✅ **Completely Hidden** - No button visible to anyone
✅ **Keyboard Shortcut Only** - Access via Ctrl+Shift+A / Cmd+Shift+A
✅ **Password Protected** - Must enter password after opening
✅ **Session-based Auth** - Logout when browser closes
✅ **Manual Logout** - Click "Logout" button to manually sign out

## Step-by-Step Access

1. **Open your portfolio** at `http://localhost:3000`
2. **Press Ctrl+Shift+A** (or Cmd+Shift+A on Mac)
   - Analytics panel appears in bottom-right corner
3. **Enter your password** (default: `admin123`)
4. **Click "Unlock Analytics"**
5. **View all your visitor data**
6. **Click the ✕ button** to close the panel
7. **Press Ctrl+Shift+A again** to reopen

## Closing the Panel

**Method 1:** Click the **✕** button in the top-right of the panel

**Method 2:** Press **Ctrl+Shift+A** again (toggles on/off)

## Password

**Default:** `admin123`

See [ANALYTICS_AUTH_SETUP.md](ANALYTICS_AUTH_SETUP.md) to change the password.

## Tips

- Keyboard shortcut works anywhere on the page
- Panel closes automatically when you close the browser (logout)
- You can manually logout using the "Logout" button
- If you forget the shortcut, refer to this file
- The shortcut works even if you've navigated around the site

## Production Deployment

For production:
1. Change the default password in `.env.local`
2. The analytics panel will remain hidden from visitors
3. Only you will know about the keyboard shortcut
4. Share the shortcut only with authorized users

## Troubleshooting

### Shortcut not working?
- Make sure you're pressing Ctrl+Shift+A (not Cmd+A or Ctrl+A)
- On Mac, use Cmd+Shift+A instead
- Try refreshing the page
- Check browser console for errors

### Panel won't open?
- Confirm you're in development mode
- Try different keyboard combinations
- Clear browser cache
- Check console for JavaScript errors

### Forgot keyboard shortcut?
- It's Ctrl+Shift+A (Windows/Linux) or Cmd+Shift+A (Mac)
- Bookmark this file for reference

---

**Security Tip:** Keep this access method private! 🔒
