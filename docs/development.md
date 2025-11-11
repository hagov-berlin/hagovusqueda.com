# Development

```sh
# When changing the schema run:
docker compose exec api npx prisma migrate dev -n MIGRATION_NAME

# When in need of a clean db:
docker compose exec api npx prisma migrate reset

# To regenerate the client types
npx prisma generate
```

