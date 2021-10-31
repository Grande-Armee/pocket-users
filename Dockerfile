FROM node:16-alpine AS development

ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

USER node

CMD ["node", "dist/main"]
