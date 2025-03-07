import { useEffect, useState } from "react";
import { Container, Dropdown } from "react-bootstrap";
import { useParams } from "react-router-dom";
import './pages-css/AnimeDetails.css'

interface Character {
  id: number;
  name: string;
  image: string;
}

interface AnimeDetails {
  id: number;
  title: string;
  image: string;
  synopsis: string;
  rating: string;
  episodes: number;
  type: string;
  duration: string;
  studios: string;
  genres: string[];
  malUrl: string;
  trailerUrl: string | null;
  characters: Character[];
  screenshots: string[];
}

function AnimeDetails() {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("Add to the list"); // Состояние для отслеживания статуса

  // Загрузка данных аниме
  useEffect(() => {
    async function fetchAnime() {
      try {
        const animeResponse = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        const animeData = await animeResponse.json();
        if (!animeData.data) {
          console.error("Данные аниме отсутствуют.");
          setLoading(false);
          return;
        }
        const charactersResponse = await fetch(
          `https://api.jikan.moe/v4/anime/${id}/characters`
        );
        const charactersData = await charactersResponse.json();
        const screenshotsResponse = await fetch(
          `https://api.jikan.moe/v4/anime/${id}/pictures`
        );
        const screenshotsData = await screenshotsResponse.json();

        const newAnime: AnimeDetails = {
          id: animeData.data.mal_id,
          title: animeData.data.title,
          image: animeData.data.images.jpg.image_url,
          synopsis: animeData.data.synopsis,
          rating: animeData.data.rating,
          episodes: animeData.data.episodes,
          type: animeData.data.type,
          duration: animeData.data.duration,
          studios: animeData.data.studios
            .map((studio: { name: string }) => studio.name)
            .join(", "),
          genres: animeData.data.genres.map((genre: { name: string }) => genre.name),
          malUrl: animeData.data.url,
          trailerUrl: animeData.data.trailer?.youtube_id
            ? `https://www.youtube.com/watch?v=${animeData.data.trailer.youtube_id}`
            : null,
          characters: charactersData.data
            .slice(0, 6)
            .map((char: any) => ({
              id: char.character.mal_id,
              name: char.character.name,
              image: char.character.images.jpg.image_url,
            })),
          screenshots: screenshotsData.data
            .map((pic: any) => pic.jpg.image_url)
            .slice(0, 6),
        };

        checkStatus(newAnime);

        setAnime(newAnime);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchAnime();
    }
  }, [id]);

  const storageKeys = {
    planned: "plannedAnime",
    watching: "watchingAnime",
    completed: "completedAnime",
    dropped: "droppedAnime",
  };

  // Функция добавления в список и обновления статуса
  const addToList = (category: keyof typeof storageKeys) => {
    if (!anime) return;
    const storageKey = storageKeys[category];
    if (!storageKey) return;

    let savedAnime: AnimeDetails[] =
      JSON.parse(localStorage.getItem(storageKey) || "[]") || [];

    if (!savedAnime.some((item) => item.id === anime.id)) {
      savedAnime.push({
        id: anime.id,
        title: anime.title,
        image: anime.image,
        synopsis: "",
        rating: "",
        episodes: 0,
        type: "",
        duration: "",
        studios: "",
        genres: [],
        malUrl: "",
        trailerUrl: null,
        characters: [],
        screenshots: [],
      });
      localStorage.setItem(storageKey, JSON.stringify(savedAnime));
    }

    // Удаляем аниме из других категорий
    for (const key in storageKeys) {
      if (key !== category) {
        let otherList: AnimeDetails[] =
          JSON.parse(localStorage.getItem(storageKeys[key as keyof typeof storageKeys]) || "[]") ||
          [];
        localStorage.setItem(
          storageKeys[key as keyof typeof storageKeys],
          JSON.stringify(otherList.filter((item) => item.id !== anime.id))
        );
      }
    }

    switch (category) {
      case "planned":
        setStatus("📌 Planned");
        break;
      case "watching":
        setStatus("📺 Watching");
        break;
      case "completed":
        setStatus("✅ Completed");
        break;
      case "dropped":
        setStatus("❌ Dropped");
        break;
      default:
        setStatus("Add to list");
        break;
    }
  };

  const checkStatus = (anime: AnimeDetails) => {
    for (const key in storageKeys) {
      const savedList: AnimeDetails[] =
        JSON.parse(localStorage.getItem(storageKeys[key as keyof typeof storageKeys]) || "[]") || [];
      if (savedList.some((item) => item.id === anime.id)) {
        switch (key) {
          case "planned":
            setStatus("📌 Planned");
            break;
          case "watching":
            setStatus("📺 Watching");
            break;
          case "completed":
            setStatus("✅ Completed");
            break;
          case "dropped":
            setStatus("❌ Dropped");
            break;
          default:
            setStatus("Add to list");
            break;
        }
        return;
      }
    }
    setStatus("Add to the list");
  };

  if (loading) return <p>Загрузка...</p>;
  if (!anime) return <p>Аниме не найдено.</p>;

  return (
    <Container className="anime-container">
      <div className="anime-header">
        <h1>{anime.title}</h1>
      </div>
      <div className="row-cont">
        <img src={anime.image} alt={anime.title} className="anime-image" />
        <div className="anime-description">
          <p>{anime.synopsis || "Описание отсутствует."}</p>
        </div>
      </div>
      <div className="anime-info">
        <p>
          <strong>Type:</strong> {anime.type}
        </p>
        <p>
          <strong>Rating:</strong> {anime.rating}
        </p>
        <p>
          <strong>Episodes:</strong> {anime.episodes}
        </p>
        <p>
          <strong>Duration:</strong> {anime.duration}
        </p>
        <p>
          <strong>Studio:</strong>{" "}
          {anime.studios || "Неизвестно"}
        </p>
        <p>
          <strong>Genre:</strong>{" "}
          {anime.genres.length > 0
            ? anime.genres.join(", ")
            : "Не указаны"}
        </p>
      </div>

      {/* Dropdown */}
      <Dropdown className="mt-3">
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          {status} 
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => addToList("planned")}>
            📌 Planned
          </Dropdown.Item>
          <Dropdown.Item onClick={() => addToList("watching")}>
            📺 Watching
          </Dropdown.Item>
          <Dropdown.Item onClick={() => addToList("completed")}>
            ✅ Completed
          </Dropdown.Item>
          <Dropdown.Item onClick={() => addToList("dropped")}>
            ❌ Dropped
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {anime.characters.length > 0 && (
        <div>
          <h2 className="anime-header">Main characters</h2>
          <div className="character-grid">
            {anime.characters.map((char) => (
              <div key={char.id} className="character-item">
                <img src={char.image} alt={char.name} />
                <p>{char.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}

export default AnimeDetails;