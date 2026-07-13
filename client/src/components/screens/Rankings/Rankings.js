import React, { useEffect, useState } from "react";
import { Header } from "../../Header";
import { Link } from "react-router-dom";
import "./rankings.css";

export default function Rankings() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRankings() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/codeforces-rankings"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        if (result.status === "OK") {
          const top10 = result.result.slice(0, 10);
          setUsers(top10);
        } else {
          setError(result.comment || "Failed to fetch rankings");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRankings();
  }, []);

  const getRankColor = (rating) => {
    if (rating >= 3000) return "#FF0000";
    if (rating >= 2600) return "#FF0000";
    if (rating >= 2400) return "#FF0000";
    if (rating >= 2300) return "#FF8C00";
    if (rating >= 2100) return "#FF8C00";
    if (rating >= 1900) return "#AA00AA";
    if (rating >= 1600) return "#0000FF";
    if (rating >= 1400) return "#03A89E";
    if (rating >= 1200) return "#008000";
    return "#808080";
  };

  const getRankTitle = (rating) => {
    if (rating >= 3000) return "Legendary Grandmaster";
    if (rating >= 2600) return "International Grandmaster";
    if (rating >= 2400) return "Grandmaster";
    if (rating >= 2300) return "International Master";
    if (rating >= 2100) return "Master";
    if (rating >= 1900) return "Candidate Master";
    if (rating >= 1600) return "Expert";
    if (rating >= 1400) return "Specialist";
    if (rating >= 1200) return "Pupil";
    return "Newbie";
  };

  return (
    <>
      <Header page="home" />
      <div className="rankings-page">
        <div className="rankings-header">
          <Link to="/home" className="rankings-back">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="rankings-title">Codeforces Karachi Rankings</h1>
          <p className="rankings-subtitle">Top 10 rated programmers from Karachi, Pakistan</p>
        </div>

        <div className="rankings-card">
          {isLoading ? (
            <div className="rankings-loading">
              <div className="rankings-spinner" />
              <p>Loading rankings...</p>
            </div>
          ) : error ? (
            <div className="rankings-error">
              <p>Failed to load rankings</p>
              <span>{error}</span>
            </div>
          ) : (
            <div className="rankings-list">
              {users.map((user, index) => (
                <a
                  key={user.handle}
                  href={`https://codeforces.com/profile/${user.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rankings-row"
                >
                  <div className="rankings-rank">{index + 1}</div>
                  <img
                    className="rankings-avatar"
                    src={user.titlePhoto}
                    alt={user.handle}
                  />
                  <div className="rankings-info">
                    <div className="rankings-handle">{user.handle}</div>
                    <div
                      className="rankings-title"
                      style={{ color: getRankColor(user.rating) }}
                    >
                      {getRankTitle(user.rating)}
                    </div>
                  </div>
                  <div className="rankings-stats">
                    <div
                      className="rankings-rating"
                      style={{ color: getRankColor(user.rating) }}
                    >
                      {user.rating}
                    </div>
                    <div className="rankings-max">
                      max: {user.maxRating}
                    </div>
                  </div>
                  <svg
                    className="rankings-arrow"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
