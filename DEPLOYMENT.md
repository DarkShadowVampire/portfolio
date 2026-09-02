# Deployment & Environment Configuration

## Environment Variables

### Setting Environment Variables by Platform

#### GitHub Actions / CI/CD

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        env:
          REACT_APP_ANALYTICS_PASSWORD: ${{ secrets.ANALYTICS_PASSWORD }}
        run: npm run build
      
      - name: Deploy
        # Your deployment step here
```

#### Vercel

1. Go to Project Settings → Environment Variables
2. Add your environment variables
3. Redeploy your site

#### Netlify

1. Go to Site Settings → Build & Deploy → Environment
2. Click "Edit variables"
3. Add your environment variables
4. Trigger a new build

#### Docker

```dockerfile
ARG REACT_APP_ANALYTICS_PASSWORD=default
ENV REACT_APP_ANALYTICS_PASSWORD=$REACT_APP_ANALYTICS_PASSWORD

RUN npm install
RUN REACT_APP_ANALYTICS_PASSWORD=$REACT_APP_ANALYTICS_PASSWORD npm run build
```

Build with:
```bash
docker build \
  --build-arg REACT_APP_ANALYTICS_PASSWORD="your_password" \
  -t portfolio:latest .
```

## Important Notes

⚠️ **Environment variables are bundled at build time** - Changes require rebuild

⚠️ **Never commit sensitive .env files** - Already ignored in `.gitignore`

✅ **Use secrets management** - GitHub Secrets, Netlify/Vercel dashboards, etc.

## Best Practices

- Use different passwords for each environment
- Rebuild after changing credentials
- Rotate passwords periodically
- Use CI/CD secrets instead of hardcoding

