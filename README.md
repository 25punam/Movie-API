# 🎬 Movie API

## 🚀 Movie Search API & Scalable Data Engine

A high-performance movie discovery platform featuring a responsive **4-column grid**, smart **pagination**, and a scalable **Django backend capable of handling 300,000+ records**.

---

## ✨ Features

* 🔍 Movie Search API
* 📄 Pagination for large datasets
* 📅 Release Year Filtering
* 🖼 Automatically hides cards when poster images are missing
* ⚡ Optimized database queries for high performance
* 🐳 Docker containerized backend
* 📱 Responsive 4-column movie grid layout

---

## 🛠 Tech Stack

* **Backend:** Django, Django REST Framework
* **Frontend:** React
* **Database:** PostgreSQL
* **DevOps:** Docker, Docker Compose

---

## 🐳 Docker Backend Setup

The recommended way to run the **backend** is with Docker.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/25punam/movie-api.git
cd movie-api
```

### 2️⃣ Build and Start Backend Services

```bash
docker compose up --build
```

### 3️⃣ Access the Backend API

http://localhost:8000

---

## 💻 React Frontend Setup

The frontend is started manually using npm.

### 1️⃣ Navigate to the Frontend Folder

```bash
cd frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start the Development Server

```bash
npm start
```

### 4️⃣ Access the Frontend

http://localhost:3000

---

## 🔎 API Example

Example endpoint:

```
/api/search/?language=en&page=1&limit=12
```

Example full URL:

```
http://localhost:8000/api/search/?language=en&page=1&limit=12
```

---

## 📂 Project Structure

```
movie-api/
│
├── movie_api/        # Django backend
├── frontend/         # React frontend
├── docker-compose.yml
└── README.md
```

---

## ⚡ Performance

* Efficient database queries and pagination
* Optimized API responses for large datasets
* Containerized deployment for easy scaling

---

## 🌟 Future Improvements

* Advanced search filters
* Movie recommendation system
* Redis caching
* Elasticsearch integration for faster search





<img width="1080" height="603" alt="image" src="https://github.com/user-attachments/assets/db0c9f52-bde5-4d89-9f2f-ac375b3e112e" />


<img width="1067" height="636" alt="image" src="https://github.com/user-attachments/assets/d05a9590-d623-435a-ad93-5361dec96240" />




