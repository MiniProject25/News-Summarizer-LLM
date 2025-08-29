import { useState } from "react";
import { Search } from "lucide-react"; 
import { useLocation } from "react-router-dom";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const location = useLocation();

  // Pages where search should be hidden
  const hiddenRoutes = ["/about", "/contact"];
  const isHidden = hiddenRoutes.includes(location.pathname);

  return (
    <div className="relative w-64 h-10">
      {!isHidden && (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      )}

      {/* Input box */}
      {!isHidden && (
        <input
          type="text"
          placeholder="Search news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-500 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
        />
      )}

      {/* Clear button (only if text and not hidden) */}
      {query && !isHidden && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      )}
    </div>
  );
}
