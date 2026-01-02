FROM node:24-alpine AS base

RUN apk -U add yt-dlp

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run build  

COPY crontab /var/spool/cron/crontabs/root

ENV NEW_RELIC_APP_NAME=api.hagovusqueda.com

CMD ["sh", "-c", "/usr/sbin/crond -f -l 8 & npm run start"]
