FROM node:18.15.0 AS build

WORKDIR /app

COPY . .

RUN npm install --force

RUN npm run build

# Serve Application using Nginx Server

FROM nginx:alpine

COPY --from=build /app/dist/inserisci-commesse/ /usr/share/nginx/html

COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

VOLUME /etc/nginx/conf.d

EXPOSE 80