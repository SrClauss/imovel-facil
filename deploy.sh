#!/bin/bash
# Usage: ./deploy.sh "commit message"
if [ -z "$1" ]; then
  echo "Please provide a commit message."
  exit 1
fi
MESSAGE="$1"

# stage, commit and push
git add .
git commit -m "$MESSAGE"
git push

# remote deploy
ssh root@187.77.43.72 <<'EOF'
cd /srv/imovel-facil
git fetch --all && git reset --hard origin/master
# ensure docker-compose is available
docker compose up --build -d
EOF

echo "Deployment finished."
