# 🎬 Movie API

<img width="1080" height="603" alt="image" src="https://github.com/user-attachments/assets/db0c9f52-bde5-4d89-9f2f-ac375b3e112e" />


<img width="1067" height="636" alt="image" src="https://github.com/user-attachments/assets/d05a9590-d623-435a-ad93-5361dec96240" />




# 🎬 Movie Search API — Scalable Data Engine

A high-performance movie discovery platform built with **Django REST Framework**, capable of searching and filtering **300,000+ records** in real time. Features background data ingestion via **Celery + Redis**, a containerized **Docker** setup, and a responsive **React.js** frontend.

---

## ✨ Features

- 🔍 **Smart Search API** — Multi-parameter filtering by title, language, genre, rating, and release year
- ⚡ **High Performance** — DB indexed fields + optimized QuerySets on 300,000+ records
- 🔄 **Background Tasks** — Celery workers fetch TMDB data without blocking the API
- 📄 **Pagination** — Offset-based pagination for safe browsing of large datasets
- 🖼 **Smart UI** — Auto-hides movie cards when poster images are missing
- 🐳 **Fully Dockerized** — One command starts the entire 6-service stack
- 📱 **Responsive Grid** — 4-column movie layout built in React.js

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Django, Django REST Framework |
| **Frontend** | React.js |
| **Database** | PostgreSQL 15 |
| **Cache / Broker** | Redis |
| **Task Queue** | Celery (Worker + Beat) |
| **DevOps** | Docker, Docker Compose |

---

## 🏗 Architecture Overview

```
                    ┌─────────────┐
                    │  React.js   │  ← Frontend (localhost:3000)
                    └──────┬──────┘
                           │ HTTP
                    ┌──────▼──────┐
                    │  Django API │  ← DRF (localhost:8000)
                    └──────┬──────┘
            ┌──────────────┼──────────────┐
            │              │              │
     ┌──────▼──────┐ ┌─────▼─────┐ ┌────▼──────────────────┐
     │ PostgreSQL  │ │   Redis   │ │  Celery Worker         │
     │  (Movies DB)│ │  (Broker) │ │  + Beat (Scheduler)    │
     └─────────────┘ └───────────┘ └────────────────────────┘
```

---

## 🐳 Docker Setup (Recommended)

All 6 services — Django, PostgreSQL, Redis, Celery Worker, Celery Beat, Redis Commander — start with a single command.

### Services Started by Docker Compose

| Service | Description | Port |
|---|---|---|
| `web` | Django REST API | `8000` |
| `db` | PostgreSQL 15 database | `5432` |
| `redis` | Message broker for Celery | `6379` |
| `celery_worker` | Processes background TMDB fetch tasks | — |
| `celery_beat` | Schedules periodic data sync tasks | — |
| `redis-commander` | Redis GUI for monitoring queues | `8081` |

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/25punam/movie-api.git
cd movie-api
```

### 2️⃣ Create Environment File

```bash
cp .env.example .env
# Open .env and fill in your credentials
```

`.env` should contain:

```env
SECRET_KEY=your-django-secret-key
DEBUG=True

POSTGRES_DB=Movies
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-strong-password
DB_HOST=db
DB_PORT=5432

TMDB_API_KEY=your-tmdb-api-key
```

> ⚠️ **Never commit your `.env` file to GitHub.** Make sure it is listed in `.gitignore`.

### 3️⃣ Build and Start All Services

```bash
docker compose up --build
```

### 4️⃣ Run Migrations

```bash
docker compose exec web python manage.py migrate
```

### 5️⃣ Access the Services

| Service | URL |
|---|---|
| Django API | http://localhost:8000 |
| Redis Commander (GUI) | http://localhost:8081 |

---

## 💻 React Frontend Setup

The frontend runs separately from the Docker backend.

### 1️⃣ Navigate to Frontend Folder

```bash
cd frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start Development Server

```bash
npm start
```

### 4️⃣ Access Frontend

```
http://localhost:3000
```

> ⚠️ Make sure the Docker backend is running before starting the frontend.

---

## 🔎 API Reference

### Search Movies

```
GET /api/search/
```

**Query Parameters**

| Parameter | Type | Description | Example |
|---|---|---|---|
| `q` | string | Search by title or overview | `Inception` |
| `language` | string | Filter by original language code | `en`, `hi`, `fr` |
| `genre` | string | Filter by genre name or ID (comma-separated) | `Action` or `28,12` |
| `min_rating` | float | Minimum vote average (0–10) | `7.5` |
| `release_year` | integer | Filter by release year | `2023` |
| `page` | integer | Page number (default: `1`) | `2` |
| `limit` | integer | Results per page (max: `100`) | `12` |

**Example Requests**

```
GET /api/search/?language=en&page=1&limit=12
GET /api/search/?q=inception&release_year=2010
GET /api/search/?genre=Action&min_rating=7.5&page=1
GET /api/search/?language=hi&genre=28,12&limit=20
```

**Example Response**

```json
{
  "movies": [
    {
      "id": 27205,
      "title": "Inception",
      "original_language": "en",
      "release_date": "2010-07-16",
      "vote_average": 8.4,
      "popularity": 98.5,
      "poster_path": "https://image.tmdb.org/t/p/w500/..."
    }
  ],
  "total_count": 312000,
  "returned_count": 12,
  "page": 1,
  "page_size": 12,
  "limit": 12
}
```

---

## ⚙️ Celery — Background Tasks

Celery handles all TMDB data fetching in the background so the API stays fast and responsive at all times.

### How It Works

```
User hits API  →  Django responds instantly (no waiting)

Meanwhile in background:
  Celery Beat (scheduler)
        ↓
  Triggers fetch task on schedule
        ↓
  Celery Worker fetches pages from TMDB API
        ↓
  Saves / updates 300,000+ records in PostgreSQL
```

### Trigger a Fetch Task Manually

```bash
docker compose exec web python manage.py shell
```

```python
from movies.tasks import fetch_movies
fetch_movies.delay()
```

### Monitor Workers in Real Time

```bash
# Watch Celery worker logs
docker compose logs celery_worker -f

# Watch Celery Beat scheduler logs
docker compose logs celery_beat -f
```

---

## 📂 Project Structure

```
movie-api/
│
├── movie_api/              # Django project config
│   ├── settings.py
│   ├── celery.py           # Celery app configuration
│   └── urls.py
│
├── movies/                 # Core Django app
│   ├── models.py           # Movie & Genre models with DB indexes
│   ├── views.py            # MovieSearchAPIView (DRF APIView)
│   ├── serializers.py      # DRF serializers
│   ├── tasks.py            # Celery tasks — TMDB data fetch
│   └── urls.py
│
├── frontend/               # React.js frontend
│   ├── src/
│   └── package.json
│
├── docker-compose.yml      # Orchestrates all 6 services
├── Dockerfile
├── requirements.txt
├── .env.example            # Environment variable template
└── README.md
```

---

## ⚡ Performance Optimizations

- **Database Indexing** — `db_index=True` applied on `movie_id`, `title`, `original_language`, `popularity`, `vote_average`, and `release_date` fields, enabling fast filtering and sorting across 300,000+ records without full table scans.

- **Paginated Responses** — Offset-based pagination ensures only one page slice hits the DB at a time (`queryset[offset : offset + page_size]`), so 300,000+ records are never loaded into memory at once. Response size is capped at 100 items per request.

- **N+1 Query Prevention** — Used `prefetch_related("genres")` to fetch all genre data in a single DB query instead of one query per movie row.

- **Django Q Objects** — Multi-field search runs across `title` and `overview` in a single optimized OR query, with `.distinct()` preventing duplicate rows caused by ManyToMany genre joins.

- **Smart Default Limits** — No-filter requests default to 100 results; filtered requests allow up to 500 — balancing performance with usability and preventing accidental rendering of 44,000+ records on a single filter.

- **Popularity + Rating Ordering** — Results sorted by `-popularity, -vote_average` so the most relevant movies always appear first without any client-side sorting overhead.

- **Celery Async Tasks** — TMDB API data ingestion runs entirely in background Celery workers, keeping the Django API fast during large data updates. Celery Beat automates scheduled syncs.

- **PostgreSQL over SQLite** — Production-grade database handles concurrent API requests and 300,000+ records reliably, with full support for indexing and complex multi-parameter queries.

- **Docker Volumes** — PostgreSQL data persists in a named Docker volume (`postgres_db`), so all 300,000+ records survive container restarts and full rebuilds safely.

---

## 🛑 Stopping the Project

```bash
# Stop all running containers
docker compose down

# Stop containers and delete all data volumes (resets the database)
docker compose down -v
```

---

## 🌟 Future Improvements

- [ ] Redis caching for frequent search queries
- [ ] Elasticsearch integration for full-text search
- [ ] Movie recommendation system
- [ ] JWT Authentication for user accounts
- [ ] CI/CD pipeline with GitHub Actions
- [ ] AWS ECS production deployment

---

## 📄 License

MIT License — feel free to use and modify.
