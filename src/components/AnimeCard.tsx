import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer"; 
import { useEffect, useState } from "react";
import '../index.css'
import './components-css/animeCard.css'


interface Anime {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
  aired?: { from: string | null }; 
  type?: string; 
}

interface AnimeCardProps {
  animeList: Anime[];
  loading: boolean;
}

function AnimeCard({ animeList, loading }: AnimeCardProps) {
  return (
    <div className="row">
      {loading ? (
        <div className="spinner-border mx-auto my-5" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      ) : (
        animeList.map((anime) => (
          <div key={anime.mal_id} className="col-md-4 mb-4">
            <Link to={`/anime/${anime.mal_id}`} className="text-decoration-none">
              <div className="card card-visual">
                <LazyImage src={anime.images.jpg.image_url || "/default-anime.jpg"} alt={anime.title} />
                <div className="card-body">
                  <h5 className="card-title text-truncate">{anime.title}</h5>
                  {anime.aired?.from && (
                    <p className="card-text">
                      Release date:{" "}
                      {new Date(anime.aired.from).toLocaleDateString() || "Неизвестно"}
                    </p>
                  )}
                  {anime.type && <p className="card-text">Type: {anime.type}</p>}
                </div>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}


function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [ref, inView] = useInView({ threshold: 0.1 }); 
  const [showImage, setShowImage] = useState(false); 

  useEffect(() => {
    if (inView) {
      setShowImage(true); 
    }
  }, [inView]);

  return (
    <div ref={ref}>

      {!showImage && (
        <div className="card-img">
          <span className="spinner-border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </span>
        </div>
      )}
      {showImage && (
        <img 
          src={src}
          alt={alt}
          className="card-img-top card-img"
        />
      )}
    </div>
  );
}

export default AnimeCard;