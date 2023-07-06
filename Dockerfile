# syntax=docker/dockerfile:1

FROM node:18-alpine
ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --development

COPY . .

EXPOSE 8080
CMD ["node", "server.js"]
