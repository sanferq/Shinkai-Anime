import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AnimeCard from "../components/AnimeCard"; 

interface Anime {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
}

function Search() {
  const [searchParams] = useSearchParams();
  const query = decodeURIComponent(searchParams.get("query") || "").trim();
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!query) return;

    const fetchAnime = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
        const data = await response.json();
        setAnimeList(data.data || []);
      } catch (error) {
        console.error("Ошибка поиска:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [query]);

  return (
    <div className="container mt-4">
      <h2>Search result: {query}</h2>
      {loading && <p>loading...</p>}
      {animeList.length > 0 ? (
        // Передаем данные в AnimeCard
        <AnimeCard animeList={animeList} loading={loading} />
      ) : (
        <p>Ничего не найдено</p>
      )}
    </div>
  );
}

export default Search;