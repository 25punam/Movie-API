
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import SidebarFilters from './components/SidebarFilters';
import MovieGrid from './components/MovieGrid';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Pagination from './components/Pagination';
import SearchBar from './components/SearchBar';

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

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const PAGE_SIZE = 12;

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [filters, setFilters] = useState({
    q: '',
    language: 'en',
    genres: [],
    min_rating: '',
    release_year: ''
  });
  const [genresList, setGenresList] = useState([]);
  const [genreNameToId, setGenreNameToId] = useState({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(window && window.innerWidth > 800);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 800) {
        setIsSidebarVisible(true);
      } else {
        setIsSidebarVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchMovies = useCallback(async (params = {}, pageNum = 1) => {
    setLoading(true);
    setError(null);
    setWarning(null);
    try {
      const requestParams = { ...params, page: pageNum, limit: PAGE_SIZE };
      const response = await axios.get(`${API_BASE_URL}/search/`, { params: requestParams, timeout: 10000 });
      const all = (response && response.data && response.data.movies) ? response.data.movies : [];
      const returnedCount = response.data.returned_count || all.length;
      const total = response.data.total_count || all.length;
      setTotalCount(total);

      if (returnedCount < total) {
        setWarning(`Showing ${returnedCount} of ${total} results. Use more specific filters to narrow down results.`);
      }


      // Build genre name set from all movies, mapping IDs to names if needed
      const gMap = new Map();
      all.forEach(m => {
        if (m.genres) {
          m.genres.forEach(g => {
            // g can be {name, genre_id}, a number, or a string
            let name = null;
            if (typeof g === 'object' && g.name) name = g.name;
            else if (typeof g === 'object' && g.genre_id && GENRE_ID_MAP[g.genre_id]) name = GENRE_ID_MAP[g.genre_id];
            else if (typeof g === 'number' && GENRE_ID_MAP[g]) name = GENRE_ID_MAP[g];
            else if (typeof g === 'string' && GENRE_ID_MAP[parseInt(g)]) name = GENRE_ID_MAP[parseInt(g)];
            if (name) gMap.set(name, true);
          });
        }
      });
      const extracted = Array.from(gMap.keys()).sort();
      // Build nameToId for filtering
      const nameToId = {};
      all.forEach(m => {
        if (m.genres) {
          m.genres.forEach(g => {
            let name = null, id = null;
            if (typeof g === 'object' && g.name && g.genre_id) { name = g.name; id = g.genre_id; }
            else if (typeof g === 'object' && g.genre_id && GENRE_ID_MAP[g.genre_id]) { name = GENRE_ID_MAP[g.genre_id]; id = g.genre_id; }
            else if (typeof g === 'number' && GENRE_ID_MAP[g]) { name = GENRE_ID_MAP[g]; id = g; }
            else if (typeof g === 'string' && GENRE_ID_MAP[parseInt(g)]) { name = GENRE_ID_MAP[parseInt(g)]; id = parseInt(g); }
            if (name && id) nameToId[name] = id;
          });
        }
      });

      setGenreNameToId(nameToId);
      setGenresList(extracted.length ? extracted : [
        'Action','Adventure','Animation','Comedy','Crime','Documentary','Drama','Family','Fantasy','Horror','Music','Mystery','Romance','Science Fiction','Thriller'
      ]);

      const sorted = all.sort((a,b) => (b.popularity || 0) - (a.popularity || 0) || (new Date(b.release_date || 0) - new Date(a.release_date || 0)));
      setMovies(sorted);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please refresh the page.');
      } else if (err.message === 'Network Error') {
        setError('Network Error: could not reach API. Check server.');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out.');
      } else if (err.response) {
        const apiError = err.response.data;
        setError(apiError?.detail || apiError?.non_field_errors?.[0] || `API Error: ${err.response.status}`);
      } else {
        setError(err.message || 'Failed to fetch movies');
      }
      setWarning(null);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = {};
    if (filters.q) params.q = filters.q;
    if (filters.language) params.language = filters.language;
    if (filters.min_rating) params.min_rating = filters.min_rating;
    if (filters.release_year) params.release_year = filters.release_year;

    if (filters.genres && filters.genres.length) {
      const ids = filters.genres.map(name => genreNameToId[name]).filter(Boolean);
      if (ids.length) params.genre = ids.join(',');
    }
    fetchMovies(params, page);
  }, [fetchMovies, page, filters]);

  const onSearch = (newFilters) => {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    setPage(1);
    if (window.innerWidth <= 800) {
      setIsSidebarVisible(false);
    }
  };

  const onReset = () => {
    setFilters({ q: '', language: 'en', genres: [], min_rating: '', release_year: '' });
    setPage(1);
    fetchMovies();
    if (window.innerWidth <= 800) {
      setIsSidebarVisible(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="app clean">
      <header className="app-header clean-header">
        <div className="brand">
          <h1>Movie Search</h1>
          <p>Discover popular and latest movies</p>
        </div>
      </header>

      <main className="app-main clean-main">
        {/* Removed sidebar toggle button as per requirements */}
        <aside className={`sidebar ${isSidebarVisible ? '' : 'hidden'}`}>
          <SidebarFilters
            onSearch={onSearch}
            onReset={onReset}
            initialFilters={filters}
            genres={genresList}
          />
        </aside>

        <section className="content">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <>
              {warning && (
                <div className="warning-banner" style={{background:'#fff4e5',padding:'8px',borderRadius:'6px',marginBottom:'12px',color:'#8a6d3b',textAlign:'center'}}>{warning}</div>
              )}

              {movies.length === 0 && totalCount > 0 && (
                <div className="info-banner" style={{background:'#eef6ff',padding:'8px',borderRadius:'6px',marginBottom:'12px',color:'#1b4f8f',textAlign:'center'}}>
                  No movies on this page — this usually means you've navigated past available results. Try a lower page number or refine your filters.
                </div>
              )}

              <div className="results-header">
                <p>Showing {movies.length} of {totalCount} movies</p>
              </div>

              <MovieGrid movies={movies} />

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(p) => setPage(p)}
              />
            </>
          )}
        </section>
      </main>

      {/* Footer removed as per requirements */}
    </div>
  );
}

export default App;

