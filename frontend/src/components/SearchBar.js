import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [params, setParams] = useState({
    q: '',
    language: '',
    genre: '',
    min_rating: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(params);
  };

  const handleReset = () => {
    setParams({
      q: '',
      language: '',
      genre: '',
      min_rating: ''
    });
    onSearch({
      q: '',
      language: '',
      genre: '',
      min_rating: ''
    });
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-field search-field-main">
          <input
            type="text"
            name="q"
            value={params.q}
            onChange={handleInputChange}
            placeholder="Search by movie title..."
            className="search-input"
          />
        </div>

        <div className="filter-grid">
          <div className="search-field">
            <label htmlFor="language">Language</label>
            <input
              type="text"
              id="language"
              name="language"
              value={params.language}
              onChange={handleInputChange}
              placeholder="e.g., en, es, fr"
              className="filter-input"
            />
          </div>

          <div className="search-field">
            <label htmlFor="genre">Genre IDs</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={params.genre}
              onChange={handleInputChange}
              placeholder="e.g., 28,12,16"
              className="filter-input"
            />
          </div>

          <div className="search-field">
            <label htmlFor="min_rating">Min Rating</label>
            <input
              type="number"
              id="min_rating"
              name="min_rating"
              value={params.min_rating}
              onChange={handleInputChange}
              placeholder="0-10"
              min="0"
              max="10"
              step="0.1"
              className="filter-input"
            />
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-search">
            🔍 Search
          </button>
          <button type="button" onClick={handleReset} className="btn btn-reset">
            ↺ Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
