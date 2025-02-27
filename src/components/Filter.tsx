import { useState } from "react";
import './components-css/filter.css'

interface FilterProps {
    onFilterChange: (genres: number[], type: string) => void; // Функция принимает массив ID жанров и выбранный тип аниме
}

// Список всех жанров 
const genresList = [
    { id: 1, name: "Action" },
    { id: 2, name: "Adventure" },
    { id: 5, name: "Avant Garde" },
    { id: 46, name: "Award Winning" },
    { id: 28, name: "Boys Love" },
    { id: 4, name: "Comedy" },
    { id: 8, name: "Drama" },
    { id: 10, name: "Fantasy" },
    { id: 26, name: "Girls Love" },
    { id: 47, name: "Gourmet" },
    { id: 14, name: "Horror" },
    { id: 7, name: "Mystery" },
    { id: 22, name: "Romance" },
    { id: 24, name: "Sci-Fi" },
    { id: 36, name: "Slice of Life" },
    { id: 30, name: "Sports" },
    { id: 37, name: "Supernatural" },
    { id: 41, name: "Suspense" },
    { id: 9, name: "Ecchi" },
    { id: 49, name: "Erotica" },
    { id: 12, name: "Hentai" },
    { id: 50, name: "Adult Cast" },
    { id: 51, name: "Anthropomorphic" },
    { id: 52, name: "CGDCT" },
    { id: 53, name: "Childcare" },
    { id: 54, name: "Combat Sports" },
    { id: 55, name: "Crossdressing" },
    { id: 39, name: "Detective" },
    { id: 56, name: "Educational" },
    { id: 57, name: "Gag Humor" },
    { id: 58, name: "Gore" },
    { id: 35, name: "Harem" },
    { id: 59, name: "High Stakes Game" },
    { id: 13, name: "Historical" },
    { id: 60, name: "Idols (Female)" },
    { id: 61, name: "Idols (Male)" },
    { id: 62, name: "Isekai" },
    { id: 63, name: "Iyashikei" },
    { id: 64, name: "Love Polygon" },
    { id: 65, name: "Magical Sex Shift" },
    { id: 66, name: "Mahou Shoujo" },
    { id: 17, name: "Martial Arts" },
    { id: 67, name: "Mecha" },
    { id: 18, name: "Military" },
    { id: 38, name: "Music" },
    { id: 19, name: "Parody" },
    { id: 6, name: "Psychological" },
    { id: 20, name: "School" },
    { id: 68, name: "Space" },
    { id: 69, name: "Strategy Game" },
    { id: 70, name: "Super Power" },
    { id: 71, name: "Survival" },
    { id: 72, name: "Team Sports" },
    { id: 73, name: "Time Travel" },
    { id: 74, name: "Vampire" },
    { id: 21, name: "Visual Arts" },
    { id: 3, name: "Cars" },
    { id: 40, name: "Workplace" }
];

const animeTypes = ["TV", "Movie", "OVA", "ONA", "Special", "Music"];

function Filter({ onFilterChange }: FilterProps) {
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [selectedType, setSelectedType] = useState<string>("");
    const [showGenres, setShowGenres] = useState(false);

    const handleGenreChange = (id: number) => {
        let updatedGenres = selectedGenres.includes(id)
            ? selectedGenres.filter((genre) => genre !== id)
            : [...selectedGenres, id];
        setSelectedGenres(updatedGenres);
        onFilterChange(updatedGenres, selectedType);
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedType(event.target.value);
        onFilterChange(selectedGenres, event.target.value);
    };

    return (
        <div className="card p-3 mt-3">
            <h4 className="card-title">Filter</h4>

            <select
                className="form-select mb-2"
                value={selectedType}
                onChange={handleTypeChange}
            >
                <option value="">All types</option>
                {animeTypes.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>

            <button
                className="btn w-100 mb-2"
                onClick={() => setShowGenres(!showGenres)}
            >
                {showGenres ? "Hide genres" : "Show genres"}
            </button>
            <div
                className={`row genres-list ${showGenres ? "open" : "closed"}`}
            >
                {genresList.map((genre) => (
                    <div key={genre.id} className="col-12">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedGenres.includes(genre.id)}
                                onChange={() => handleGenreChange(genre.id)}
                                id={`genre-${genre.id}`}
                            />
                            <label
                                className="form-check-label"
                                htmlFor={`genre-${genre.id}`}
                            >
                                {genre.name}
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Filter;