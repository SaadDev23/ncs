import React, { useEffect, useState } from "react";
import { Header } from "../../Header";
import { Link } from "react-router-dom";
import "./news.css";

const API_KEY = "1e5058feb8854454a2ced3805459110f";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=technology&pageSize=30&sortBy=publishedAt&language=en&apiKey=${API_KEY}`
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
    <>
      <Header page="home" />
      <div className="news-page">
        <div className="news-header">
          <Link to="/home" className="news-back">
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
          <h1 className="news-title">Tech News</h1>
          <p className="news-subtitle">
            Latest technology stories from around the web
          </p>
        </div>

        {isLoading ? (
          <div className="news-loading">
            <div className="news-spinner" />
            <p>Loading stories...</p>
          </div>
        ) : (
          <div className="news-grid">
            {articles.map((article, index) => (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-card-item"
              >
                <div className="news-image-wrap">
                  {article.urlToImage ? (
                    <img
                      className="news-image"
                      src={article.urlToImage}
                      alt={article.title}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div className="news-image-placeholder">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="news-card-body">
                  <div className="news-card-title">{article.title}</div>
                  <div className="news-card-desc">{article.description}</div>
                  <div className="news-card-meta">
                    <span className="news-card-source">
                      {article.source.name}
                    </span>
                    <span className="news-card-dot" />
                    <span className="news-card-time">
                      {formatTime(article.publishedAt)}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
