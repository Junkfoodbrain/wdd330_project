const TMDB_API_KEY = "792bc8c1aab2ba75ef26a5aaa4c8cf38";

export async function getMoviesByGenre(genreId) {
    const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${encodeURIComponent(TMDB_API_KEY)}&with_genres=${encodeURIComponent(genreId)}&include_adult=false`
    );

    if (!response.ok) {
        throw new Error(`Movie request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
}