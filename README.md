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
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=shipping
DB_USERNAME=laravel
DB_PASSWORD=laravel

EASYPOST_API_KEY=your_api_key_here
```

---

## 🚀 Start containers

```bash
docker compose up -d --build
```

---

## 🗄️ Database

MySQL is started with Docker (service `mysql` in `docker-compose.yaml`, container `shipping_database`). You do not need a local MySQL install. The `DB_*` settings in `.env` match that container.

---

## 📥 Install PHP dependencies

```bash
docker compose exec app composer install
```

Run this after the containers are up. The `vendor/` directory is not committed, so a fresh clone needs Composer inside the `app` container.

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

# 💡 Future Improvements

1. Implement rate limiting to prevent abuse and control API usage
2. Introduce background jobs and queues to handle shipment creation asynchronously
3. Add caching layer for frequently requested data (e.g. shipping rates)
4. Implement shipment status lifecycle (pending, processing, completed, failed)
5. Integrate webhooks (EasyPost) for real-time tracking updates
6. Add retry mechanisms for external API failures
7. Support international shipping addresses

---

# 👨‍💻 Author

Rainan Gramacho

---

# 📄 License

This project is for study purposes.

