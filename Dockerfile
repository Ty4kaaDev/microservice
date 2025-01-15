# Используем официальный образ Node.js как базовый
FROM node:20-alpine

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json в контейнер
COPY package*.json ./
# Устанавливаем зависимости
RUN npm install
RUN npm install -g @nestjs/cli --unsafe-perm=true

# Копируем папку app (вместо src) в контейнер
COPY . .

# Строим приложение
RUN npm run build

# Указываем, на каком порту будет слушать приложение
EXPOSE 3000

# Запускаем приложение
CMD ["npx", "nestjs", "new", "project", "npm", "run", "start:prod"] 
