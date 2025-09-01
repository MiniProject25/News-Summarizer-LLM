import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    // ✅ Increment views
    fetch(`http://localhost:8000/articles/${id}/increment-views`, {
      method: "POST",
    });

    // ✅ Fetch article content
    fetch(`http://localhost:8000/articles/${id}`)
      .then((res) => res.json())
      .then((data) => setArticle(data));
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{article.title}</h1>
      <p className="mt-2 text-sm text-gray-500">Views: {article.views}</p>
      <p className="mt-4">{article.summary}</p>
    </div>
  );
}
