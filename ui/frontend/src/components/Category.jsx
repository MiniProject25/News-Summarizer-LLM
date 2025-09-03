import React, { useEffect, useState } from "react";

const Categories = ({ activeCategory, setActiveCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollDir, setScrollDir] = useState("up");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/categories/");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Detect scroll direction
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        setScrollDir(currentScrollY > lastScrollY ? "down" : "up");
        lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
      }
    };

    window.addEventListener("scroll", updateScrollDir);
    return () => window.removeEventListener("scroll", updateScrollDir);
  }, []);

  if (loading) return <p>Loading categories...</p>;

  return (
    <div
      className={`sticky top-[64px] z-40 transition-transform duration-300 ${
        scrollDir === "down" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="relative">
        {/* Scrollable category bar */}
        <div className="flex gap-4 px-5 py-2 border-b border-gray-300 bg-white overflow-x-auto whitespace-nowrap hide-scrollbar">
          <button
            className={`px-4 py-1.5 rounded-[15px] text-sm font-medium transition
            ${
              activeCategory === "All"
                ? "bg-black text-white font-bold"
                : "bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setActiveCategory("All")}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-[15px] text-sm font-medium transition
              ${
                activeCategory === cat
                  ? "bg-black text-white font-bold"
                  : "bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Left fade */}
        <div className="absolute top-0 left-0 h-full w-5 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>

        {/* Right fade */}
        <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Categories;
