import React, { useState, useMemo } from 'react';
import './SidebarFilters.css';

function SidebarFilters({ onSearch, onReset, initialFilters, genres }) {
  const [q, setQ] = useState(initialFilters.q || '');
  const [language, setLanguage] = useState(initialFilters.language || 'en');
  const [selectedGenres, setSelectedGenres] = useState(initialFilters.genres || []);
  const [genreQuery, setGenreQuery] = useState('');
  const [minRating, setMinRating] = useState(initialFilters.min_rating || '');
  const [releaseYear, setReleaseYear] = useState(initialFilters.release_year || '');

  const filteredGenres = useMemo(() => {
    if (!genreQuery) return genres;
    return genres.filter(g => g.toLowerCase().includes(genreQuery.toLowerCase()));
  }, [genres, genreQuery]);

  const toggleGenre = (name) => {
    const next = selectedGenres.includes(name) ? selectedGenres.filter(x => x !== name) : [...selectedGenres, name];
    setSelectedGenres(next);
    // trigger filtering immediately when a genre chip is clicked
    onSearch({ genres: next });
  };

  const submit = (e) => {
    e && e.preventDefault();
    onSearch({ q, language, genres: selectedGenres, min_rating: minRating, release_year: releaseYear });
  };

  const resetAll = () => {
    setQ(''); setLanguage('en'); setSelectedGenres([]); setMinRating(''); setReleaseYear(''); setGenreQuery('');
    onReset();
  };

  return (
    <div className="sidebar-card">
      <form onSubmit={submit} className="sidebar-form">
        <div className="field">
          <label>Keyword Search</label>
          <input placeholder="Search title..." value={q} onChange={e => setQ(e.target.value)} />
        </div>

        <div className="field">
          <label>Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="hi">Hindi</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
          </select>
        </div>

        <div className="field">
          <label>Genres</label>
          <input placeholder="Filter genres..." value={genreQuery} onChange={e => setGenreQuery(e.target.value)} />
          <div className="genres-list">
            {filteredGenres.map(g => (
              <button
                key={g}
                type="button"
                className={`genre-chip ${selectedGenres.includes(g) ? 'selected' : ''}`}
                onClick={() => toggleGenre(g)}
              >
                {g}
              </button>
            ))}
            {filteredGenres.length === 0 && <div className="empty">No genres</div>}
          </div>
        </div>

        <div className="field small">
          <label>Minimum Rating</label>
          <input placeholder="e.g. 7.0" type="number" step="0.1" min="0" max="10" value={minRating} onChange={e => setMinRating(e.target.value)} />
        </div>

        <div className="field small">
          <label>Release Year</label>
          <input placeholder="e.g. 2021" type="number" inputMode="numeric" value={releaseYear} onChange={e => setReleaseYear(e.target.value)} />
        </div>

        <div className="button-area">
          <button type="submit" className="btn primary">Search</button>
          <button type="button" className="btn ghost" onClick={resetAll}>Reset</button>
        </div>
      </form>
    </div>
  );
}

export default SidebarFilters;
