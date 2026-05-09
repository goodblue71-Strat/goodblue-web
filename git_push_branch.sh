#!/bin/bash
# GoodBlue Git automation script
# Usage: ./git_push.sh "your commit message"

# Exit immediately if any command fails
set -e

# Check for commit message
if [ -z "$1" ]; then
  echo "❌ Please provide a commit message."
  echo "Usage: ./git_push.sh 'your message here'"
  exit 1
fi

COMMIT_MSG="$1"

echo "🌿 Switching to feature/comprag branch..."
git checkout feature/auth

echo "⬇️ Pulling latest changes from origin/feature/comprag..."
git pull origin feature/auth

echo "🔄 Staging changes..."
git add .

echo "💬 Committing with message: '$COMMIT_MSG'"
git commit -m "$COMMIT_MSG" || echo "⚠️ No changes to commit."

echo "⬆️ Pushing to origin/feature/auth..."
git push origin feature/auth
echo "✅ Done! All changes have been pushed to feature/comprag."
