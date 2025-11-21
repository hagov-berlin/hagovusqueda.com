# Dropplet

## Initial setup

```sh
# Install docker and enable it as a service
apt install -y docker.io docker-compose
systemctl enable docker

# Generate SSH Key and add it to Github
ssh-keygen -t ed25519 -C "ignacio.nh@gmail.com"
cat .ssh/id_ed25519.pub

# Clone project
git clone git@github.com:hagov-berlin/api.hagovusqueda.com.git
cd api.hagovusqueda.com/

# Configure .env file
cp .env.example .env
nano .env

# Run the compose daemon
docker-compose up -d --build
```

## Deployment

```sh
cd ~/api.hagovusqueda.com/

# Update the repo
git pull

# Bring all down
docker compose down

# Rebuild
docker compose up --build -d

# Run db migrations
docker-compose exec api npx prisma migrate deploy
```

## DB dump and restore

```sh
# Get into your running docker db via
docker-compose exec db bash

# Generate a dump
pg_dump -U postgres -h localhost -p 5432 --no-owner --no-privileges -Fc -d appdb > /dump_local.backup

# Get out of the container and copy the file to the host
docker cp <container_id>:/dump_local.backup dump_local.backup

# Copy the file to the dropplet
scp dump_local.backup root@hagovusqueda:/root/

# SSH into dropplet
# Update the codebase/migrate if needed (see deployment section)
docker-compose exec db dropdb -f --username=postgres_hagov_db_user hagovusqueda
docker-compose exec db createdb --username=postgres_hagov_db_user hagovusqueda
cat dump_local.backup | docker exec -i <container_id> pg_restore -U postgres_hagov_db_user -d hagovusqueda --no-owner
```
