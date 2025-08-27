import { NavLink, Link } from 'react-router-dom'
import SearchBox from './SearchBox'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' }
]

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-gray-900 px-4 py-2 rounded-lg transition-colors duration-300 
                hover:bg-gray-200">
          News-Summarizer
        </Link>

        {/* Nav Links */}
        <nav className="flex space-x-7">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-colors duration-300 
                hover:bg-gray-200 ${isActive ? "font-bold" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Search Bar */}
        <SearchBox />
      </div>
    </header>
  )
}
