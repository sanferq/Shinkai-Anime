import { useEffect, useState, useCallback } from "react";
import Filter from "../components/Filter";
import NowAiring from "../components/NowAiring";
import AnimeCard from "../components/AnimeCard";
import { saveFilters, getSavedFilters, savePage, getSavedPage } from "../utils/localStorage";


interface Anime {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
  aired: { from: string | null };
  type: string;
}

function Home() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [page, setPage] = useState<number>(1);


  useEffect(() => {
    const savedFilters = getSavedFilters();
    if (savedFilters) {
      setSelectedGenres(savedFilters.genres);
      setSelectedType(savedFilters.type);
    }
    const savedPage = getSavedPage();
    setPage(savedPage);
  }, []);

  // Функция для загрузки аниме
  const fetchAnime = useCallback(async () => {
    setLoading(true);
    try {
      let url = `https://api.jikan.moe/v4/anime?order_by=popularity&page=${page}`;
      if (selectedGenres.length > 0) {
        url += `&genres=${selectedGenres.join(",")}`;
      }
      if (selectedType) {
        url += `&type=${selectedType}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ошибка сети: ${response.status}`);
      }
      const data = await response.json();
      setAnimeList(data.data || []);
    } catch (error) {
      console.error("Ошибка загрузки аниме:", error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedGenres, selectedType]);

  useEffect(() => {
    fetchAnime();
  }, [fetchAnime]);

  // Обработчики для пагинации
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  // Сохраняем текущую страницу в localStorage при изменении
  useEffect(() => {
    savePage(page);
  }, [page]);

  // Сохраняем фильтры в localStorage при их изменении
  const handleFilterChange = (genres: number[], type: string) => {
    setSelectedGenres(genres);
    setSelectedType(type);
    setAnimeList([]); 
    setPage(1); 
    saveFilters({ genres, type }); 
  };

  return (
<div className="container mt-4">
  <NowAiring />
  <h2>Popular</h2>

  {/* Контейнер для фильтра и списка аниме */}
  <div className="row d-flex flex-column-reverse flex-md-row">
    {/* Список аниме (будет сверху на узких экранах) */}
    <div className="col-md-9">
      <AnimeCard animeList={animeList} loading={loading} />
    </div>
    
    {/* Фильтр аниме (будет сверху на мобильных) */}
    <div className="col-md-3 mb-3">
      <Filter onFilterChange={handleFilterChange} />
    </div>
  </div>

  {/* Пагинация */}
  <div className="d-flex justify-content-center mt-4 col-md-9">
    <button
      className="btn mb-3"
      onClick={handlePreviousPage}
      disabled={loading || page === 1}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#555555"
      >
        <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
      </svg>
    </button>
    <span className="mx-3 align-self-center" style={{ marginBottom: "10px" }}>
      {page}
    </span>
    <button
      className="btn  mb-3"
      onClick={handleNextPage}
      disabled={loading}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#555555"
      >
        <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
      </svg>
    </button>
  </div>
</div>
  );
}

export default Home;