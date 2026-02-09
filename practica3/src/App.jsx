import { useState, useEffect } from "react";
import { Logo, Nav, NumResults, Search } from "./components/Nav";
import { Box } from "./components/Box";
import { MovieList } from "./components/Movie";
import { WatchedMoviesContainer, WatchedMoviesList, WatchedSummary } from "./components/WatchedMovie";
import { useFetchMovies } from "./hooks/useFetchMovies";
import { MovieDetails } from "./components/MovieDetails";

/**
 * Componente principal de la aplicación.
 */
export default function App() {
    // Estado para la búsqueda de películas
    const [query, setQuery] = useState("");

    // Obtiene películas basadas en la consulta (Custom Hook)
    const { movies, isLoading, error } = useFetchMovies(query);

    // Estado para la película seleccionada (para ver detalles)
    const [selectedId, setSelectedId] = useState(null);

    // --- EJERCICIO 2: PERSISTENCIA CON LOCALSTORAGE ---
    const [watched, setWatched] = useState(() => {
        const storedValue = localStorage.getItem("watched");
        return storedValue ? JSON.parse(storedValue) : [];
    });

    // Efecto para guardar en localStorage cada vez que la lista de vistas cambia.
    useEffect(() => {
        localStorage.setItem("watched", JSON.stringify(watched));
    }, [watched]);

    /**
     * Maneja la selección de una película.
     * Si se selecciona la misma que ya está abierta, la cierra.
     * @param {string} id ID de la película seleccionada.
     */
    function handleSelectMovie(id) {
        setSelectedId((selectedId) => (id === selectedId ? null : id));
    }

    /**
     * Cierra los detalles de la película.
     */
    function handleCloseMovie() {
        setSelectedId(null);
    }

    /**
     * Agrega una película a la lista de vistas.
     * @param {Object} movie 
     */
    function handleAddWatched(movie) {
        setWatched((watched) => [...watched, movie]);
    }

    /**
     * @param {string} id 
     */
    function handleDeleteWatched(id) {
        setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    }

    return (
        <>
            <Nav>
                <Logo />
                <Search query={query} setQuery={setQuery} />
                <NumResults movies={movies} />
            </Nav>

            <main className="main">
                <Box>
                    {isLoading && <p className="loader">Cargando...</p>}
                    {!isLoading && !error && (
                        <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
                    )}
                    {error && <p className="error">{error}</p>}
                </Box>

                <Box>
                    <WatchedMoviesContainer>
                        {selectedId ? (
                            <MovieDetails
                                selectedId={selectedId}
                                onCloseMovie={handleCloseMovie}
                                onAddWatched={handleAddWatched}
                                watched={watched}
                            />
                        ) : (
                            <>
                                <WatchedSummary watched={watched} />
                                <WatchedMoviesList 
                                    watched={watched} 
                                    onDeleteWatched={handleDeleteWatched} 
                                />
                            </>
                        )}
                    </WatchedMoviesContainer>
                </Box>
            </main>
        </>
    );
}