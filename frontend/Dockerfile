# Dockerfile para Angular 20
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps && npm run build --prod

# Servidor web para archivos estáticos
FROM nginx:alpine
COPY --from=build /app/dist/temp-frontend/browser /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
