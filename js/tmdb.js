export async function getMoviesByGenre(genreId, apiKey) {
    const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${encodeURIComponent(apiKey)}&with_genres=${encodeURIComponent(genreId)}&include_adult=false`
    );

    if (!response.ok) {
        throw new Error(`Movie request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
}