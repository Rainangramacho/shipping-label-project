# 🚚 Shipping Project

A full-stack application for creating and viewing shipping labels using EasyPost integration.

---

## 📦 Project Structure

```
shipping-project/
├── api/        # Backend (Laravel)
└── frontend/   # Frontend (React)
```

---

## 🚀 Tech Stack

### Backend

* Laravel
* MySQL
* Docker

### Frontend

* React
* Vite
* Axios
* TailwindCSS

---

## ⚙️ Prerequisites

Make sure you have the following installed:

* Docker + Docker Compose
* Node.js >= 18
* npm or yarn
* Git

---

# 🔧 Project Setup

## 1. Clone the repository

```bash
git clone https://github.com/your-username/shipping-project.git
cd shipping-project
```

---

# ⚙️ Backend (API)

## 📁 Navigate to the folder

```bash
cd api
```

---

## 🔐 Environment variables

Create the `.env` file:

```bash
cp .env.example .env
```

Edit it with your configuration:

```env
APP_NAME=ShippingProject
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=shipping
DB_USERNAME=laravel
DB_PASSWORD=laravel

EASYPOST_API_KEY=your_api_key_here
```

---

## 📥 Install PHP dependencies

The `vendor/` directory is not in Git. The `app` service runs `php artisan serve`, which needs `vendor/`—so on a **fresh clone** install Composer packages **before** bringing the stack up:

```bash
docker compose build
docker compose run --rm --no-deps app composer install
```

- `run` uses a one-off container with the project mounted; the long-running `app` service does not need to be up yet.  
- `--no-deps` skips MySQL; Composer does not need the database.

After `vendor/` exists, use `docker compose exec app composer …` whenever `app` is running (for example `composer require …`).

---

## 🚀 Start containers

```bash
docker compose up -d
```

Use `docker compose up -d --build` when you change the Dockerfile or `docker-compose.yaml`.

---

## 🗄️ Database

MySQL is started with Docker (service `mysql` in `docker-compose.yaml`, container `shipping_database`). You do not need a local MySQL install. The `DB_*` settings in `.env` match that container.

---

## 🔑 Generate app key

```bash
docker compose exec app php artisan key:generate
```

---

## 📦 Run migrations

```bash
docker compose exec app php artisan migrate
```

---

## 🌐 Backend available at:

```
http://localhost:8035
```

---

# 🎨 Frontend

## 📁 Navigate to the folder

```bash
cd ../frontend
```

---


## 📦 Install dependencies

```bash
npm install
```

---

## ▶️ Run the project

```bash
npm run dev
```

---

## 🌐 Frontend available at:

```
http://localhost:5173
```

---

# 🔗 Integration

The frontend communicates with the backend using localhost.

Make sure the backend is running before starting the frontend.

---

# 🧪 Usage Flow

1. Open the frontend
2. Create an account
3. Log in to the application
4. Fill in the shipping data
5. Create a shipping label
6. View the generated label
7. Print the label
---

# ⚠️ Common Issues

## ❌ Error generating label (EasyPost)

* Check your API key
* Validate address and package data
* Ensure units are correct (ounces/inches)

---

## ❌ AccessDenied when opening label

EasyPost label URLs:

* are temporary
* expire quickly
* are not publicly accessible

---

# 📦 Useful Commands

## Stop containers

```bash
docker compose down
```

## Full rebuild

```bash
docker compose down -v
docker compose up -d --build
```

## View backend logs

```bash
docker logs shipping_database
```

---

# 💡 What I’d do next

1. Implement rate limiting to prevent abuse and control API usage
2. Introduce background jobs and queues to handle shipment creation asynchronously
3. Add caching layer for frequently requested data (e.g. shipping rates)
4. Implement shipment status lifecycle (pending, processing, completed, failed)
5. Integrate webhooks (EasyPost) for real-time tracking updates
6. Add retry mechanisms for external API failures
7. Support international shipping addresses
8. Add more DTOs, create Resources and Unit/Integration tests

---

# 👨‍💻 Author

Rainan Gramacho

---

# 📄 License

This project is for study purposes.

