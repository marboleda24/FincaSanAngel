# === Etapa 1: Constructor (Builder) ===
FROM node:22-alpine AS builder

WORKDIR /app

# Dependencias necesarias de sistema
RUN apk add --no-cache libc6-compat openssl

# Instalar dependencias del proyecto
COPY package.json package-lock.json* ./
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Generar el cliente de Prisma
RUN npx prisma generate

# Construir la aplicación para producción
RUN npm run build


# === Etapa 2: Producción (Runner) ===
FROM node:22-alpine AS runner

WORKDIR /app

# Dependencias necesarias para Prisma en runtime
RUN apk add --no-cache openssl

# Establecer entorno de producción
ENV NODE_ENV production

# Copiar desde el constructor lo estrictamente necesario
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Exponer el puerto
EXPOSE 3000

# Comando por defecto para iniciar en producción
CMD ["npm", "start"]
