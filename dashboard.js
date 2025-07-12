import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [keyword, setKeyword] = useState('#AI');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResults(null);
        try {
            const response = await axios.post('http://localhost:5001/api/scrape', { keyword });
            setResults(response.data);
        } catch (err) {
            setError('Failed to scrape data. The scraper might be blocked or the website structure may have changed.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>X Scraper Dashboard</h1>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Enter keyword or hashtag (e.g., #AI)"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Scraping...' : 'Search & Scrape'}
                </button>
            </form>

            {loading && <div className="loader"></div>}
            
            {error && <p className="error-message">{error}</p>}

            {results && (
                <div className="results-container">
                    <h2>Results for "{keyword}"</h2>
                    <div className="results-summary">
                        <strong>{results.postCount}</strong> posts found in the last 24 hours.
                    </div>
                    <div className="usernames-list">
                        <h3>Usernames who posted:</h3>
                        {results.usernames.length > 0 ? (
                            <ul>
                                {results.usernames.map((user, index) => (
                                    <li key={index}>{user}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No users found for this keyword in the last 24 hours.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;