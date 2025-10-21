import { useState, useEffect } from "react";
import Category from "../components/category.jsx";
import NewsCard from "../components/NewsCard.jsx";

export default function Home({ searchQuery }) {
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  // fetch today’s articles
  useEffect(() => {
    const fetchArticles = async () => {
      const params = new URLSearchParams();
      if (activeCategory !== "All") params.append("category", activeCategory);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`http://localhost:8000/articles/?${params.toString()}`);
      const data = await res.json();
      setArticles(data);
    };
    fetchArticles();
  }, [activeCategory, searchQuery]);

  // fetch trending
  useEffect(() => {
    const fetchTrending = async () => {
      const params = new URLSearchParams();
      if (activeCategory !== "All") params.append("category", activeCategory);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`http://localhost:8000/articles/trending/?${params.toString()}`);
      const data = await res.json();
      setTrending(data);
    };
    fetchTrending();
  }, [activeCategory, searchQuery]);

  return (
    <div>
      {/* <Category activeCategory={activeCategory} setActiveCategory={setActiveCategory} /> */}
      {/* Trending Section */}
      <h2 className="text-xl font-bold flex items-center">
        <span className="text-red-500 mr-2">🔥</span> Trending Now
      </h2>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-2 py-2">
          {trending.map((a) => (
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

      {/* Today Section */}
      <h2 className="text-xl font-bold mt-8 mb-4">Latest News Summaries</h2>
      <div className="grid mt-4 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {articles.map((a) => (
          <NewsCard key={a.article_id} {...a} />
        ))}
      </div>
    </div>
  );
}
