import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./components-css/navbar.css";

function AppNavbar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      isSidebarOpen &&
      !target.closest("#sidebar") &&
      !target.closest("#menu")
    ) {
      setIsSidebarOpen(false);
    }
  };

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape" && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isSidebarOpen]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg px-3 header">
        <Link className="navbar-brand" to="/">
          Shinkai
        </Link>

        <div className="navbar-nav d-none d-lg-flex">
          <Link className="nav-link" to="/random">
            Random
          </Link>
          <Link className="nav-link" to="/planned">
            Tabs
          </Link>
        </div>

        <input
          type="text"
          className="form-control ms-3 d-none d-lg-block"
          placeholder="Anime search..."
          value={query}
          onChange={handleSearch}
          onKeyPress={handleKeyPress}
          style={{ marginBottom: "10px" }}
        />

        <button id="menu" className="btn d-lg-none" onClick={toggleSidebar}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#555555"
          >
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        </button>
      </nav>

      <div id="sidebar" className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          &times;
        </button>
        <ul>
          <li>
            <Link to="/random" onClick={toggleSidebar}>
              Random
            </Link>
          </li>
          <li>
            <Link to="/planned" onClick={toggleSidebar}>
              Tabs
            </Link>
          </li>
        </ul>
        <input
          type="text"
          className="form-control mt-3"
          placeholder="Anime search..."
          value={query}
          onChange={handleSearch}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}

export default AppNavbar;
