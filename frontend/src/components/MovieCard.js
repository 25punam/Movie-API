
import React, { useState } from 'react';
import './MovieCard.css';
// Genre ID to name mapping (TMDB standard)
const GENRE_ID_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  10759: 'Action & Adventure',
  10769: 'Foreign',
  10753: 'Adult',
};

function MovieCard({ movie }) {
  const [showDetails, setShowDetails] = useState(false);
  const normalizeImageUrl = (url) => {
    if (!url) return null;
    try {
      // decode percent-encodings
      const decoded = decodeURIComponent(url);
      const httpIndex = decoded.indexOf('http');
      if (httpIndex !== -1) {
        let candidate = decoded.substring(httpIndex);
        // fix single slash occurrences like https:/ -> https://
        candidate = candidate.replace(/^(https?:)\/+/, (m, p1) => p1 + '//');
        return candidate;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  const PLACEHOLDER_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='450'><rect fill='%23f6f6f6' width='100%25' height='100%25'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-family='Arial' font-size='20'>No Image</text></svg>";

  const posterUrl = normalizeImageUrl(movie.poster_url) || PLACEHOLDER_SVG;

  // Helper: get genre names from movie.genres (array of objects or IDs)
  let genreNames = [];
  if (movie.genres && movie.genres.length > 0) {
    genreNames = movie.genres.map(g => {
      if (typeof g === 'object' && g.name) return g.name;
      if (typeof g === 'object' && g.genre_id && GENRE_ID_MAP[g.genre_id]) return GENRE_ID_MAP[g.genre_id];
      if (typeof g === 'number' && GENRE_ID_MAP[g]) return GENRE_ID_MAP[g];
      if (typeof g === 'string' && GENRE_ID_MAP[parseInt(g)]) return GENRE_ID_MAP[parseInt(g)];
      return g.name || g.genre_id || g;
    });
  }
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={posterUrl}
          alt={movie.title}
          onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_SVG; }}
          style={movie.adult ? { filter: 'blur(12px) grayscale(0.7)' } : {}}
        />
        <div className="movie-overlay">
          <button
            className="details-btn"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
        </div>
        {movie.adult && (
          <div style={{position:'absolute',top:8,right:8,background:'#e74c3c',color:'#fff',padding:'2px 8px',borderRadius:'4px',fontWeight:600,fontSize:'0.9rem'}}>18+</div>
        )}
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{releaseYear}</p>

        <div className="movie-rating">
          <span className="rating-value">⭐ {rating}/10</span>
          <span className="vote-count">({movie.vote_count})</span>
        </div>

        {genreNames.length > 0 && (
          <div className="movie-genres">
            {genreNames.slice(0, 2).map((name, idx) => (
              <span key={name + idx} className="genre-tag">
                {name}
              </span>
            ))}
            {genreNames.length > 2 && (
              <span className="genre-tag">+{genreNames.length - 2}</span>
            )}
          </div>
        )}
      </div>

      {showDetails && (
        <div className="movie-details improved-details">
          {/* Primary */}
          <div className="details-block details-primary">
            <span className="details-title">🎬 {movie.title}</span>
            {movie.release_date && (
              <span className="details-year">({new Date(movie.release_date).getFullYear()})</span>
            )}
          </div>
          {/* Quick Stats */}
          <div className="details-block details-stats">
            <span>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10</span>
            {movie.vote_count && <span> ({movie.vote_count} votes)</span>}
            {movie.popularity && <span> | 🔥 Popularity: {movie.popularity.toFixed(1)}</span>}
          </div>
          {/* Metadata */}
          <div className="details-block details-meta">
            {genreNames.length > 0 && (
              <span>🎭 Genre: {genreNames.join(', ')}</span>
            )}
            {movie.original_language && (
              <span>  🌐 Language: {movie.original_language.toUpperCase()}</span>
            )}
          </div>
          {/* Description */}
          {movie.overview && (
            <div className="details-block details-overview">
              <span>📝 Overview:</span>
              <p>{movie.overview}</p>
            </div>
          )}
          {movie.adult && (
            <div className="adult-warning">⚠️ Adult Content</div>
          )}
        </div>
      )}
    </div>
  );
}

export default MovieCard;
