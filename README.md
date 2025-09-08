# api.hagovusqueda.com

## Setup and development

```
npm install
docker-compose up
npx prisma migrate dev
```

When changing the schema: `npx prisma migrate dev`
When in need of a clean db: `npx prisma migrate reset`
To regenerate the client: `npx prisma generate`
Built-in UI: `npx prisma studio`
In prod: `npx prisma migrate deploy`

Other useful commands:

- `npx prisma validate`
- `npx prisma format`
