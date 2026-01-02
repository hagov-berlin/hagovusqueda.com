FROM node:24-alpine AS base

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build  

ENV NEW_RELIC_APP_NAME=hagovusqueda.com

CMD ["npm", "run", "start"]
