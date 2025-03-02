# DevHack2025

Данный репозиторий содержит два основных раздела:

- **backend** – серверная часть на Django
- **frontend** – клиентская часть на React с использованием Vite

## Оглавление

- [Установка](#установка)
- [Запуск проекта](#запуск-проекта)
  - [Backend (Django)](#backend-django)
  - [Frontend (React-с Vite)](#frontend-react-с-vite)
- [Полезные команды](#полезные-команды)
- [Структура проекта](#структура-проекта)
- [Полезные ссылки](#полезные-ссылки)

## Установка

### 1. Клонирование репозитория

Откройте терминал и выполните команду:

```bash
  git clone https://github.com/vladikgolosnoi/devhack2025.git
```

Перейдите в директорию проекта:

```bash
  cd devhack2025
```

## Запуск проекта

### Backend (Django)

1. Перейдите в папку `backend`:

   ```bash
   cd backend
   ```

2. Создайте виртуальное окружение:

   ```bash
   python -m venv env
   ```

3. Активируйте виртуальное окружение:

   - **На Windows:**

     ```bash
     env\Scripts\activate
     ```

   - **На macOS и Linux:**

     ```bash
     source env/bin/activate
     ```

4. Установите зависимости:

   ```bash
   pip install -r requirements.txt
   ```

5. Примените миграции базы данных:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Запустите сервер разработки:

   ```bash
   python manage.py runserver
   ```

После этого сервер будет доступен по адресу: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

### Frontend (React с Vite)

1. Откройте новый терминал и перейдите в папку `frontend`:

   ```bash
   cd frontend
   ```

2. Установите зависимости (используя npm или yarn):

   ```bash
   npm install --legacy-peer-deps
   ```
   или
   ```bash
   yarn install --legacy-peer-deps
   ```

3. Запустите сервер разработки:

   ```bash
   npm run dev
   ```
   или
   ```bash
   yarn dev
   ```

- Как правило, приложение будет запущено по адресу [http://localhost:5174/](http://localhost:5174/) (точный адрес будет указан в терминале).
- Если адрес будет другой, то в backend/backend/settings.py добавьте в самом конце ваш адрес.
    ```python
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://localhost:5174",
    ]
    ```

## Полезные команды

### Для Django

- **Запуск сервера:** `python manage.py runserver`
- **Применение миграций:** `python manage.py migrate`
- **Создание суперпользователя:** `python manage.py createsuperuser`

### Для Vite (React)

- **Запуск сервера разработки:** `npm run dev` или `yarn dev`
- **Сборка для продакшена:** `npm run build` или `yarn build`

## Структура проекта

- **backend/** – серверная часть на Django.
- **frontend/** – клиентская часть на React с Vite.

## Полезные ссылки

- [Документация Django](https://docs.djangoproject.com/)
- [Документация React](https://reactjs.org/)
- [Документация Vite](https://vitejs.dev/)

Если возникнут вопросы или проблемы, вы можете создать issue в репозитории или обратиться к соответствующей документации.

---
