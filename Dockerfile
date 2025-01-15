# Используем официальный образ Node.js как базовый
FROM node:20-alpine

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json в контейнер
COPY package*.json ./
# Устанавливаем зависимости\
RUN npm config rm proxy
RUN npm config rm https-proxy --tried removing npm proxy
RUN npm install
USER root
RUN npm install -g @nestjs/cli --verbose

# Копируем папку app (вместо src) в контейнер
COPY . .

# Строим приложение
RUN npm run build

# Указываем, на каком порту будет слушать приложение
EXPOSE 3000

# Запускаем приложение
CMD ["npx", "nestjs", "new", "project", "npm", "run", "start:prod"] 
