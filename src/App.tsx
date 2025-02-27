import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import AnimeDetails from "./pages/AnimeDetails";
import Planned from "./pages/Planned";
import AppNavbar from "./components/Navbar";
import RandomAnime from './pages/RandomAnime'
import ThemeToggle from "./components/ThemeToggle";
import NowAiring from "./components/NowAiring";

function App() {
  return (
    <>
      {" "}
      <AppNavbar/>
      <ThemeToggle />
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route path="/" element={<NowAiring />} />
        <Route path="/random" element={<RandomAnime />} />
        <Route path="/search" element={<Search />} />
        <Route path="/Planned" element={<Planned />} />
        <Route path="/Anime/:id" element={<AnimeDetails />} />
      </Routes>

    </>
  );
}

export default App;
