# Используем официальный образ Python
FROM python:3.10-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файл зависимостей и устанавливаем их
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь проект в контейнер
COPY . .

# Собираем статику Django
RUN python manage.py collectstatic --noinput

# Открываем порт
EXPOSE 8000

# Запуск Django-сервера (Gunicorn)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]
