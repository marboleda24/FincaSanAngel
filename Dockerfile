# Imagen oficial de Node.js ligera
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar las dependencias de sistema necesarias
RUN apk add --no-cache libc6-compat openssl

# Copiar el manifiesto de paquetes y paquete de bloqueo
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiamos la configuración de Prisma
COPY prisma ./prisma/

# Generamos el cliente Prisma internamente
RUN npx prisma generate

# Copiamos todo el resto del código
COPY . .

# Exponer el puerto por el que Next.js escucha peticiones (3000)
EXPOSE 3000

# Comando para arrancar el servidor en entorno de desarrollo.
# (En producción esto cambiaría a "npm run build" y "npm start")
CMD ["npm", "run", "dev"]
