# Analytics Access

## Overview

The analytics panel is hidden and only accessible to authorized users through a private keyboard shortcut.

## Security

✅ **Completely Hidden** - Not visible to regular visitors
✅ **Keyboard Shortcut Access** - Private shortcut known only to you
✅ **Password Protected** - Additional security layer
✅ **Session-based Auth** - Automatic logout on browser close
✅ **Manual Logout Available** - Secure logout option

## Accessing the Panel

To access the analytics panel:

1. Use the **private keyboard shortcut** (shared privately, not in public docs)
2. Enter your **password**
3. Analytics dashboard will appear

## Features

- View visitor analytics
- See geolocation data
- Export data as JSON/CSV
- Session-based authentication
- Automatic logout on browser close

## Security Notes

🔒 **Keep this access method private** - Only share with authorized team members

⚠️ **Keyboard shortcut is sensitive information** - Not documented in public repos

ℹ️ **For setup details:** See `.ANALYTICS_PRIVATE_SETUP.txt` (not in version control)

## Deployment

Analytics works in all environments:
- ✅ Local development
- ✅ Staging
- ✅ Production

Password must be set via environment variables during build.


