# Analytics Password Setup

## Overview

The analytics dashboard requires password authentication. Set the password via environment variables for your deployment.

## Configuration

### Local Development

Create `.env.local` in project root:
```
REACT_APP_ANALYTICS_PASSWORD=your_password
```

Restart dev server to apply changes.

### Production & Higher Environments

Set the environment variable during build time:

**GitHub Actions:**
```yaml
env:
  REACT_APP_ANALYTICS_PASSWORD: ${{ secrets.ANALYTICS_PASSWORD }}
run: npm run build
```

**Vercel/Netlify:** Add to Environment Variables dashboard

**Docker:**
```bash
docker build --build-arg REACT_APP_ANALYTICS_PASSWORD="password" .
```

## Important

⚠️ Environment variables are bundled at **build time**

- Must set password when building
- Rebuild required to change password
- Different passwords for each environment

## Security Notes

✅ Use secrets management (GitHub Secrets, etc.)
✅ Never commit `.env.local` to version control
✅ Use strong, unique passwords
✅ Rotate passwords regularly
✅ Keep access details private

## Troubleshooting

**Password doesn't work after deployment?**
- Confirm env var was set during build
- Rebuild after adding the variable
- Clear browser cache

**Getting default fallback password?**
- Variable name must be `REACT_APP_ANALYTICS_PASSWORD`
- Check CI/CD logs to confirm build-time environment
- Redeploy with correct variable

---

For specific analytics access details, see private documentation (not in version control).


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
