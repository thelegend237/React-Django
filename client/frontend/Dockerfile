# Build stage
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

# Serveur Nginx pour servir le build
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
