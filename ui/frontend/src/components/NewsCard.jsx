import { useNavigate } from "react-router-dom";
import { FaClock, FaEye } from "react-icons/fa";
import { useState } from "react";

// Utility to format "time ago"
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

export default function NewsCard({
    article_id,
    image_url,
    title,
    summary,
    created_at,
    category,
    left_bias,
    center_bias,
    right_bias,
    views = 0,
    sources = [],
}) {
    const navigate = useNavigate();
    const [localViews, setLocalViews] = useState(views);

    // Handle card click: increment views in backend & update locally
    const handleCardClick = async () => {
        try {
            const res = await fetch(
                `http://localhost:8000/articles/${article_id}/increment_view`,
                { method: "POST" }
            );
            if (res.ok) {
                const data = await res.json();
                setLocalViews(data.views); // update frontend immediately
            }
        } catch (err) {
            console.error("Failed to increment views:", err);
        }

        navigate(`/article/${article_id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="max-w-sm rounded-2xl shadow-md border border-gray-300 bg-white overflow-hidden flex flex-col 
                       cursor-pointer transform transition-transform duration-200 hover:scale-105"
        >
            {/* Image with gradient overlay */}
            <div className="relative">
                {image_url && (
                    <img
                        src={image_url?.trim()}
                        alt={title}
                        className="w-full h-44 object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Overlay text */}
                <div className="absolute bottom-2 left-2 right-2 text-white">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-white text-black text-[10px] font-semibold px-2 py-0.5 rounded-md">
                            {category || "General"}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-200 ml-auto">
                            <FaEye className="h-3 w-3" /> {localViews}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-200">
                            <FaClock className="h-3 w-3" /> {timeAgo(created_at)}
                        </span>
                    </div>
                    <h2 className="text-sm md:text-base font-bold line-clamp-2">
                        {title}
                    </h2>
                </div>
            </div>

            {/* Body (flex column so bias stays at bottom) */}
            <div className="p-3 flex flex-col flex-1">
                <p className="text-sm text-gray-600 line-clamp-1">{summary}</p>

                {/* Bias + Sources pinned at bottom */}
                <div className="mt-auto">
                    {/* Bias bar */}
                    <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Bias:</p>
                        <div className="flex text-xs justify-between text-gray-600 mb-1">
                            <span className="text-red-600">Left Wing {left_bias || 0}%</span>
                            <span className="text-green-600">Centric {center_bias || 0}%</span>
                            <span className="text-blue-600">Right Wing {right_bias || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded flex overflow-hidden">
                            <div className="bg-red-500" style={{ width: `${left_bias || 0}%` }}></div>
                            <div className="bg-green-500" style={{ width: `${center_bias || 0}%` }}></div>
                            <div className="bg-blue-500" style={{ width: `${right_bias || 0}%` }}></div>
                        </div>
                    </div>

                    {/* Sources */}
                    <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Sources:</p>
                        {sources.length === 0 ? (
                            <span className="text-xs text-gray-400">(No sources added yet)</span>
                        ) : (
                            <p className="text-xs text-gray-700 truncate">
                                {sources
                                    .map((src, i) => (
                                        <a
                                            key={i}
                                            href={src.source_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()} // prevent card navigation
                                            className="text-gray-600 hover:underline"
                                        >
                                            {src.source_name}
                                        </a>
                                    ))
                                    .reduce((prev, curr) => [prev, ", ", curr])
                                }
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
