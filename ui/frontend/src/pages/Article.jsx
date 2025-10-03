import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaClock, FaEye } from "react-icons/fa";
import NewsCard from "../components/NewsCard";

// ✅ Utility for "time ago"
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
}

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  // for RAG
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // ✅ Increment views
    fetch(`http://localhost:8000/articles/${id}/increment-views`, {
      method: "POST",
    });

    // ✅ Fetch article content
    fetch(`http://localhost:8000/articles/${id}`)
      .then((res) => res.json())
      .then((data) => setArticle(data));

    // ✅ Reset scroll on open
    window.scrollTo(0, 0);
  }, [id]);

  // dummy for RAG
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`http://localhost:8000/articles/`);
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      }
    };
    fetchArticles();
  }, []); // empty dependency array → runs once


  if (!article) return <p className="p-6">Loading...</p>;

  // ✅ Group references safely
  const references = article.sources || [];
  const leftSources = references.filter((r) => r.bias && r.bias.toLowerCase().includes("left"));
  const centerSources = references.filter((r) => r.bias && r.bias.toLowerCase().includes("center"));
  const rightSources = references.filter((r) => r.bias && r.bias.toLowerCase().includes("right"));

  return (
    <div className="p-6 max-w-6xl mx-auto flex gap-8">
      {/* Left Column (60%) */}
      <div className="w-3/5">
        {/* Title */}
        <h1 className="text-3xl font-bold mt-2">{article.title}</h1>

        {/* Category + time */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mt-3">
          <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md text-xs">
            {article.category || "General"}
          </span>
          <span className="flex items-center gap-1">
            <FaClock className="h-3 w-3" /> {timeAgo(article.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <FaEye className="h-3 w-3" /> {article.views}
          </span>
        </div>

        {/* Summary */}
        <p className="mt-4 text-gray-700 leading-relaxed">{article.summary}</p>

        {/* dummy RAG */}
        <h2 className="text-xl font-bold flex items-center mt-15">Related News</h2>
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto hide-scrollbar px-2 py-2">
            {articles.map((a) => (
              <div key={a.article_id} className="flex-shrink-0 w-72">
                <NewsCard {...a} />
              </div>
            ))}
          </div>

          {/* Fade left */}
          {/* <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent" /> */}

          {/* Fade right */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>

      {/* Right Column (40%) */}
      <div className="w-2/5">
        {/* Image if available */}
        {article.image_url && (
          <img
            src={article.image_url.trim()}
            alt={article.title}
            className="w-full h-44 object-cover rounded-lg mt-4"
          />
        )}
        {/* Bias section */}
        <div className="mb-6 mt-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Bias Breakdown
          </h2>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-600">
              Left {article.left_bias || 0}%
            </span>
            <span className="text-green-600">
              Center {article.center_bias || 0}%
            </span>
            <span className="text-blue-600">
              Right {article.right_bias || 0}%
            </span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded flex overflow-hidden">
            <div
              className="bg-red-500"
              style={{ width: `${article.left_bias || 0}%` }}
            ></div>
            <div
              className="bg-green-500"
              style={{ width: `${article.center_bias || 0}%` }}
            ></div>
            <div
              className="bg-blue-500"
              style={{ width: `${article.right_bias || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Sources */}
        <div className="p-4 rounded-xl border shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Sources</h2>

          <details className="mb-3">
            <summary className="cursor-pointer text-red-600 font-semibold">
              Left-wing Sources
            </summary>
            <ul className="ml-4 mt-2 list-disc text-sm">
              {leftSources.length === 0 && <li>No sources available</li>}
              {leftSources.map((src) => (
                 <li key={src.reference_id}>
                  <div className="flex justify-between items-center py-2">
                  <a
                    href={src.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {src.source_name}
                  </a>
                  <span className="text-gray-500 text-sm">
                    {src.published_date}
                  </span>
                  </div>
                </li>
              ))}
            </ul>
          </details>

          <details className="mb-3">
            <summary className="cursor-pointer text-green-600 font-semibold">
              Centric Sources
            </summary>
            <ul className="ml-4 mt-2 list-disc text-sm">
              {centerSources.length === 0 && <li>No sources available</li>}
              {centerSources.map((src) => (
                 <li key={src.reference_id}>
                  <div className="flex justify-between items-center py-2">
                  <a
                    href={src.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {src.source_name}
                  </a>
                  <span className="text-gray-500 text-sm">
                    {src.published_date}
                  </span>
                  </div>
                </li>
              ))}
            </ul>
          </details>

          <details>
            <summary className="cursor-pointer text-blue-600 font-semibold">
              Right-wing Sources
            </summary>
            <ul className="ml-4 mt-2 list-disc text-sm">
              {rightSources.length === 0 && <li>No sources available</li>}
              {rightSources.map((src) => (
                <li key={src.reference_id}>
                  <div className="flex justify-between items-center py-2">
                  <a
                    href={src.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {src.source_name}
                  </a>
                  <span className="text-gray-500 text-sm">
                    {src.published_date}
                  </span>
                  </div>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}