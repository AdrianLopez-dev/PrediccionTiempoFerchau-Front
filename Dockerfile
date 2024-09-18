# Usamos una imagen base de Node.js para construir el frontend
FROM node:18-alpine AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos el package.json y package-lock.json
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el código fuente
COPY . .

# Ejecutamos el build de la aplicación Angular
RUN npm run build --prod

# Usamos una imagen ligera de Nginx para servir la aplicación estática
FROM nginx:alpine

# Copiamos los archivos generados en el build al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponemos el puerto 80 para servir la aplicación
EXPOSE 80