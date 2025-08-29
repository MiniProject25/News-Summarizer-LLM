import React from "react";
import { useParams } from "react-router-dom";

export default function Article() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Article {id}</h1>
      <p className="mt-4">Here you can load the full article content for ID {id}.</p>
    </div>
  );
}
