# Movie Search API Frontend

A modern, responsive React-based frontend for the Movie Search API. This single-page application allows users to search and filter movies with an intuitive interface.

## Features

- 🔍 **Advanced Search** - Search movies by title, language, genre, and minimum rating
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 🎬 **Movie Cards** - Beautiful cards displaying movie information with hover effects
- 📊 **Rating Display** - Shows vote averages and vote counts
- 🏷️ **Genre Tags** - Displays movie genres for quick identification
- 📄 **Detailed View** - Expandable movie details including overview and metadata
- 🎨 **Modern UI** - Gradient backgrounds, smooth animations, and professional styling

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

Update the API base URL in [src/App.js](src/App.js) if your Django API is running on a different host/port:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

## Running the Application

Start the development server:

```bash
npm start
```

The application will open at `http://localhost:3000`

## Building for Production

Create a production build:

```bash
npm run build
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── SearchBar.js          # Search and filter component
│   │   ├── MovieGrid.js          # Movie grid layout
│   │   ├── MovieCard.js          # Individual movie card
│   │   ├── LoadingSpinner.js     # Loading state
│   │   └── ErrorMessage.js       # Error display
│   ├── App.js                     # Main application component
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## API Endpoints Used

- **GET /api/search/** - Search and filter movies
  - Query Parameters:
    - `q` - Search by movie title (partial match)
    - `language` - Filter by language code (e.g., 'en', 'es')
    - `genre` - Filter by genre IDs (comma-separated)
    - `min_rating` - Filter by minimum rating (0-10)

## Troubleshooting

### API Connection Error
If you see "Failed to fetch movies. Make sure the Django API is running on http://localhost:8000":
1. Verify the Django API is running
2. Check the API base URL in [src/App.js](src/App.js)
3. Ensure CORS is enabled in Django settings

### No Results Found
- Make sure the Django API has movie data loaded
- Try searching with different filters
- Check if the API is responding correctly using Postman or curl

## Technologies Used

- React 18.2.0
- Axios (HTTP client)
- CSS3 (with Flexbox and Grid)
- React Scripts 5.0.1

## License

This project is open source and available under the MIT License.
