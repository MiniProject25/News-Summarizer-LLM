import React, { useState, useEffect } from "react";
import Category from "../components/category.jsx";
import NewsCard from "../components/NewsCard.jsx";

export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/articles/")
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  return (
    <div >
      <Category />
      <div className="grid mt-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {articles.map((a) => (
          <NewsCard key={a.article_id} {...a} />
        ))}
      </div>
    </div>
  );
}
