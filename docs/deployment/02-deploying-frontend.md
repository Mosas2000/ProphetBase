# Deploying Frontend

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub repository
- Vercel account
- Environment variables ready

### Steps

1. **Connect Repository**
   - Go to vercel.com
   - Click "New Project"
   - Import your GitHub repo

2. **Configure Build**
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Set Environment Variables**
   ```
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_address
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your deployment URL

### Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate

## Alternative: Netlify

### Steps
1. Connect GitHub repo
2. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/.next`
3. Add environment variables
4. Deploy

## Self-Hosting

### Using PM2
```bash
cd frontend
npm run build
pm2 start npm --name "prophetbase" -- start
pm2 save
```

### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build
CMD ["npm", "start"]
```

## Post-Deployment

### Verify
- [ ] Homepage loads
- [ ] Wallet connection works
- [ ] Markets display correctly
- [ ] Transactions work
- [ ] Mobile responsive

### Monitor
- Set up error tracking (Sentry)
- Configure analytics
- Monitor performance

## Continuous Deployment

### GitHub Actions
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
```
