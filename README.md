# hagovusqueda.com

## System requirements

- Docker and Docker Compose

## Initial setup

1. Copy and configure the necessary env vars

```sh
cp .env.example .env
nano .env
```

2. Only for dev: copy the local override of the docker compose config
```sh
cp docker-compose.override.example.yml docker-compose.override.yml
```

## Running the project

```sh
docker compose up
```

## DB seed

```sh
# Restart db
docker compose exec api npx prisma migrate reset

# Seed data
docker compose exec api npm run seed-data
```
