import React from 'react';
import './MovieGrid.css';
import MovieCard from './MovieCard';


function MovieGrid({ movies }) {
  // Only render movies with a valid poster_url
  const filteredMovies = movies.filter(
    (movie) => movie.poster_url && typeof movie.poster_url === 'string' && movie.poster_url.trim() !== ''
  );
  return (
    <div className="movie-grid">
      {filteredMovies.length === 0 ? (
        <div className="no-results">No movies found.</div>
      ) : (
        filteredMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))
      )}
    </div>
  );
}

export default MovieGrid;
