# Используем официальный образ Node.js как базовый
FROM node:20-alpine

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта в контейнер
COPY . .

# Строим приложение
RUN npm run build

# Указываем, на каком порту будет слушать приложение
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "run", "prod"]
