#!/bin/bash

# Script to push code to GitHub repository
# Run this script after agreeing to Xcode license if needed

echo "🚀 Pushing code to GitHub..."

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add remote if not exists
if ! git remote | grep -q "origin"; then
    echo "🔗 Adding remote repository..."
    git remote add origin https://github.com/madnikhan/starzpizza.git
else
    echo "✅ Remote already exists, updating URL..."
    git remote set-url origin https://github.com/madnikhan/starzpizza.git
fi

# Add all files
echo "📝 Adding files..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Initial commit: STAR'Z Burger/Pizza & Shakes online ordering website

- Next.js 14 with TypeScript and Tailwind CSS
- Complete menu system with all items
- Shopping cart functionality
- Checkout with order types (takeaway/collection/delivery)
- Firestore database integration
- Real food images for all menu items
- Hero slideshow with food images
- Responsive design
- Logo integration"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Successfully pushed to GitHub!"
echo "🌐 Repository: https://github.com/madnikhan/starzpizza.git"

