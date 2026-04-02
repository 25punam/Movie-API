# Movie-API

🎬 Movie Search API & Scalable Data Engine
A high-performance movie discovery platform featuring a responsive 4-column grid, smart pagination, and a scalable Django-backend capable of handling 300,000+ records.


## 🛠 Tech Stack

- **Backend:** Django, Django REST Framework
- **Frontend:** React
- **Database:** PostgreSQL
- **DevOps:** Docker, Docker Compose

---

## 🐳 Docker Backend Setup

The recommended way to run the backend is with Docker.

1. **Clone the repository**
   ```bash
   git clone https://github.com/25punam/movie-api.git
   cd movie-api

2. **Build and start all backend services**
    docker compose up --build

3. **Access the backend API**  
    http://localhost:8000    


## 💻 React Frontend Setup

The frontend is started manually using npm.

1. **Navigate to the frontend folder**
        cd frontend
    ```

2. **Install dependencies**
    ```bash
    npm install
3. **Start the development server**
    ```bash
    npm start
    
4. **Access the frontend**
    http://localhost:3000
    
---

## 🔎 API Example

Example endpoint:
    /api/search/?language=en&page=1&limit=12

Example full URL:
    http://localhost:8000/api/search/?language=en&page=1&limit=12

---

## 📂 Project Structure

movie-api/
│
├── movie_api/        # Django backend
├── frontend/         # React frontend
├── docker-compose.yml
└── README.md


## ⚡ Performance

# Efficient database queries and pagination
# Optimized API responses for large datasets
# Containerized deployment for easy scaling
 
 
## 🌟 Future Improvements

# Advanced search filters
# Movie recommendation system
# Redis caching
# Elasticsearch integration for faster search



<img width="1080" height="603" alt="image" src="https://github.com/user-attachments/assets/db0c9f52-bde5-4d89-9f2f-ac375b3e112e" />


<img width="1067" height="636" alt="image" src="https://github.com/user-attachments/assets/d05a9590-d623-435a-ad93-5361dec96240" />


<img width="1080" height="603" alt="image" src="https://github.com/user-attachments/assets/2e4c16fc-fcdf-44fd-bee0-e2404ecc5ba8" />

