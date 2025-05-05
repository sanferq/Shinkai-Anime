import { useEffect, useState } from "react";
import { Container, Dropdown } from "react-bootstrap";

type Character = {
  id: number;
  name: string;
  image: string;
};

type Studio = {
  name: string;
};

type Genre = {
  name: string;
};

type AnimeData = {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  synopsis: string;
  rating: string;
  episodes: number;
  type: string;
  duration: string;
  studios: Studio[];
  genres: Genre[];
  url: string;
};

type RandomAnime = {
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
  characters: Character[];
  screenshots: string[];
};

function RandomAnime() {
  const [anime, setAnime] = useState<RandomAnime | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("Добавить в список");

  const storageKeys = {
    planned: "plannedAnime",
    watching: "watchingAnime",
    completed: "completedAnime",
    dropped: "droppedAnime",
  };

  async function fetchRandomAnime(): Promise<RandomAnime | null> {
    try {
      const animeResponse = await fetch(
        "https://api.jikan.moe/v4/random/anime"
      );
      const animeData: { data: AnimeData } = await animeResponse.json();

      if (!animeData.data || !animeData.data.mal_id) {
        console.error("Неверный формат данных аниме.");
        return null;
      }

      const charactersResponse = await fetch(
        `https://api.jikan.moe/v4/anime/${animeData.data.mal_id}/characters`
      );
      const charactersData = await charactersResponse.json();

      const screenshotsResponse = await fetch(
        `https://api.jikan.moe/v4/anime/${animeData.data.mal_id}/pictures`
      );
      const screenshotsData = await screenshotsResponse.json();

      return {
        id: animeData.data.mal_id,
        title: animeData.data.title,
        image: animeData.data.images.jpg.image_url,
        synopsis: animeData.data.synopsis,
        rating: animeData.data.rating,
        episodes: animeData.data.episodes,
        type: animeData.data.type,
        duration: animeData.data.duration,
        studios: animeData.data.studios
          .map((studio: Studio) => studio.name)
          .join(", "),
        genres: animeData.data.genres.map((genre: Genre) => genre.name),
        malUrl: animeData.data.url,

        characters: charactersData.data
          ? charactersData.data.slice(0, 6).map((char: any) => ({
              id: char.character.mal_id,
              name: char.character.name,
              image:
                char.character.images?.jpg?.image_url ||
                "/default-character.jpg",
            }))
          : [],
        screenshots: screenshotsData.data
          ? screenshotsData.data
              .map((pic: any) => pic.jpg.image_url)
              .slice(0, 6)
          : [],
      };
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      return null;
    }
  }

  useEffect(() => {
    async function loadAnime() {
      const anime = await fetchRandomAnime();
      setAnime(anime);
      setLoading(false);
    }
    loadAnime();
  }, []);

  const addToList = (category: keyof typeof storageKeys) => {
    if (!anime) return;
    const storageKey = storageKeys[category];

    let savedAnime: RandomAnime[] =
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
        characters: [],
        screenshots: [],
      });
      localStorage.setItem(storageKey, JSON.stringify(savedAnime));
    }

    // Удаляем аниме из других категорий
    for (const key in storageKeys) {
      if (key !== category) {
        let otherList: RandomAnime[] =
          JSON.parse(
            localStorage.getItem(
              storageKeys[key as keyof typeof storageKeys]
            ) || "[]"
          ) || [];
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
        setStatus("Add to the list");
        break;
    }
  };

  if (loading) {
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    );
  }

  if (!anime) {
    return (
      <div>
        <p>Аниме не найдено.</p>
        <button onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
      </div>
    );
  }

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
          <strong>Тип:</strong> {anime.type}
        </p>
        <p>
          <strong>Рейтинг:</strong> {anime.rating}
        </p>
        <p>
          <strong>Серии:</strong> {anime.episodes}
        </p>
        <p>
          <strong>Продолжительность:</strong> {anime.duration}
        </p>
        <p>
          <strong>Студия:</strong> {anime.studios || "Неизвестно"}
        </p>
        <p>
          <strong>Жанры:</strong>{" "}
          {anime.genres.length > 0 ? anime.genres.join(", ") : "Не указаны"}
        </p>
      </div>

      <Dropdown className="mt-3">
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          {status}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => addToList("planned")}>
            📌 В планах
          </Dropdown.Item>
          <Dropdown.Item onClick={() => addToList("watching")}>
            📺 Смотрю
          </Dropdown.Item>
          <Dropdown.Item onClick={() => addToList("completed")}>
            ✅ Просмотрено
          </Dropdown.Item>
          <Dropdown.Item onClick={() => addToList("dropped")}>
            ❌ Брошено
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {anime.characters.length > 0 && (
        <div>
          <h2 className="anime-header">Главные персонажи</h2>
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

export default RandomAnime;
