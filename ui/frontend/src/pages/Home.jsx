import React, { useState, useEffect } from "react";
import Category from "../components/category.jsx";
import NewsCard from "../components/NewsCard.jsx";

export default function Home({ searchQuery }) {
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

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

  return (
    <div>
      <Category activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <div className="grid mt-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {articles.map((a) => (
          <NewsCard key={a.article_id} {...a} />
        ))}
      </div>
    </div>
  );
}
