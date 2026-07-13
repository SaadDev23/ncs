import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./hackernews.css";

const API_KEY = "1e5058feb8854454a2ced3805459110f";

export const HackerNews = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=technology&pageSize=5&sortBy=publishedAt&language=en&apiKey=${API_KEY}`
        );
        const data = await res.json();
        if (data.status === "ok") {
          setArticles(data.articles);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setIsLoading(false);
      }
    }

    fetchNews();
  }, []);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="hackernews-sidebar">
      <div className="hackernews-header">
        <div className="hackernews-title">Tech News</div>
        <div className="hackernews-live">
          <span className="hackernews-live-dot" />
          LIVE
        </div>
      </div>
      {isLoading ? (
        <div className="hackernews-loading">Loading...</div>
      ) : (
        <>
          <div className="hackernews-list">
            {articles.map((article, index) => (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hackernews-item"
              >
                {article.urlToImage && (
                  <img
                    className="hackernews-thumb"
                    src={article.urlToImage}
                    alt={article.title}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                <div className="hackernews-item-content">
                  <div className="hackernews-item-title">{article.title}</div>
                  <div className="hackernews-item-meta">
                    <span className="hackernews-source">
                      {article.source.name}
                    </span>
                    <span className="hackernews-time">
                      {formatTime(article.publishedAt)}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <Link to="/news" className="hackernews-explore">
            Explore More
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
        </>
      )}
    </div>
  );
};
