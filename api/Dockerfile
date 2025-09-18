FROM node:24-alpine AS base

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run build  

CMD ["npm", "run", "start"]
