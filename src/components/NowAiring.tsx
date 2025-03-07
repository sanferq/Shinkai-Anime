import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer"; 
import './components-css/nowAiring.css'

interface Anime {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
}

// Функция для задержки между запросами
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function NowAiring() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchNowAiring() {
      const cachedData = localStorage.getItem("animeList");
      if (cachedData) {
        setAnimeList(JSON.parse(cachedData)); 
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let response = await fetch("https://api.jikan.moe/v4/seasons/now");

        if (response.status === 429) {
          console.error("Слишком много запросов, пробуем снова...");
          await delay(1000); 
          response = await fetch("https://api.jikan.moe/v4/seasons/now"); // Повторяем запрос
        }

        if (!response.ok) {
          throw new Error(`Ошибка сети ${response.status}`);
        }

        const data = await response.json();
        console.log(data); 
        setAnimeList(data.data || []);
        localStorage.setItem("animeList", JSON.stringify(data.data));
      } catch (error) {
        console.error("Ошибка загрузки аниме:", error);
        setAnimeList([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNowAiring();
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 2,
    arrows: true,
    swipe: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
      { breakpoint: 335, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="container mt-3 mb-3">
      <h2>Now Anime</h2>
      {loading ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      ) : (
        <Slider {...settings}>
          {animeList.map((anime) => (
            <div
              key={anime.mal_id}
              className="card ml-2" 
            >
              <Link to={`/anime/${anime.mal_id}`} className="text-decoration-none text-reset">
                {/* Ленивая загрузка изображения */}
                <LazyImage src={anime.images.jpg.image_url} alt={anime.title} />
                <div className="card-body">
                  <h5
                    className="card-title text-truncate card-text text-title"
                  >
                    {anime.title}
                  </h5>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}


function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [ref, inView] = useInView({ threshold: 0.5 }); 
  const [showImage, setShowImage] = useState(false); 

  useEffect(() => {
    if (inView) {
      setShowImage(true); 
    }
  }, [inView]);

  return (
    <div ref={ref} >
      {!showImage && (
        <div

        >
          <span className="spinner-border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </span>
        </div>
      )}
      {showImage && (
        <img
          src={src}
          alt={alt}
          className="card-img-top nows-anime-img"
        />
      )}
    </div>
  );
}

export default NowAiring;
