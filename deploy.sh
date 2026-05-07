#!/bin/bash

echo "🚀 RentEase Deployment Script"
echo "=============================="
echo ""
echo "Choose deployment target:"
echo "1. Deploy to Render (Frontend + Backend)"
echo "2. Deploy to Vercel (Frontend only)"
echo "3. Deploy to Both"
echo ""

read -p "Enter choice (1-3): " choice

case $choice in
  1)
    echo "📦 Deploying to Render..."
    cd frontend
    npm run build
    git add .
    git commit -m "Deploy to Render"
    git push origin main
    echo "✅ Render deployment triggered!"
    ;;
  2)
    echo "📦 Deploying to Vercel..."
    cd frontend
    vercel --prod
    echo "✅ Vercel deployment complete!"
    ;;
  3)
    echo "📦 Deploying to Both..."
    cd frontend
    npm run build
    git add .
    git commit -m "Deploy to both platforms"
    git push origin main
    vercel --prod
    echo "✅ Both deployments triggered!"
    ;;
  *)
    echo "Invalid choice"
    ;;
esac
