import { getMoviesByGenre } from "./tmdb.js";

import {
    getCuisines,
    getRecipesByCuisine,
    getRecipeDetails
} from "./mealdb.js";



getCuisines()
    .then((cuisines) => {
        const preferredCuisines = [
            "Italian",
            "Mexican",
            "American",
            "Chinese",
            "Indian",
            "Greek"
        ];

        const filteredCuisines = cuisines.filter((cuisine) =>
            preferredCuisines.includes(cuisine.strArea)
        );

        console.log("Selected cuisines:", filteredCuisines);

        const cuisineSelect = document.querySelector("#cuisine-select");

        filteredCuisines.forEach((cuisine) => {
            const option = document.createElement("option");
            option.value = cuisine.strArea;
            option.textContent = cuisine.strArea;
            cuisineSelect.append(option);
        });
    })

    .catch((error) => {
        console.error("TheMealDB test", error);
    });

getRecipesByCuisine("Italian")
    .then((recipes) => {
        console.log("Italian recipes:", recipes);
    })
    .catch((error) => {
        console.error("Recipe test failed:", error);
    });

getRecipeDetails("52961")
    .then((recipe) => {
        console.log("Recipe details:", recipe);
    })
    .catch((error) => {
        console.error("Recipe detials test failed:", error);
    });

const genreSelect = document.querySelector("#genre-select");

genreSelect.addEventListener("change", async () => {
    const genreId = genreSelect.value;
    document.querySelector("#movie-details").replaceChildren();
    document.querySelector("#movie-options").replaceChildren();

    if (!genreId) {
        return;
    }

    const apiKey = window.prompt("Enter your TMDB API Key for this test:");

    if (!apiKey || !apiKey.trim()) {
        console.info("Movie request canceled: no API key entered.");
        return;
    }

    try {
        const movies = await getMoviesByGenre(genreId, apiKey.trim());
        const movieOptions = movies.slice(0, 3);
        console.log("Three movie options:", movieOptions);

        const movieOptionsContainer = document.querySelector("#movie-options");
        movieOptionsContainer.replaceChildren();

        movieOptions.forEach((movie) => {
            const movieCard = document.createElement("article");
            movieCard.className = "movie-card";

            const title = document.createElement("h3");
            title.textContent = movie.title;
            movieCard.append(title);

            // Add image, only if TMDB provides a poster path
            if (movie.poster_path) {
                const poster = document.createElement("img");
                poster.src = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
                poster.alt = `${movie.title} poster`;
                poster.width = 150;
                poster.loading = "lazy";
                movieCard.append(poster);
            }

            const summary = document.createElement("p");
            summary.textContent = movie.overview || "No summary available";
            movieCard.append(summary);

            const chooseButton = document.createElement("button");
            chooseButton.type = "button";
            chooseButton.textContent = `Choose ${movie.title}`;

            chooseButton.addEventListener("click", () => {
                console.log("Selected movie:", movie);

                const movieDetails = document.querySelector("#movie-details");
                movieDetails.replaceChildren();

                const selectedTitle = document.createElement("h3");
                selectedTitle.textContent = `Selected movie: ${movie.title}`;

                const selectedSummary = document.createElement("p");
                selectedSummary.textContent = movie.overview || "No summary available";

                movieDetails.append(selectedTitle);

                if (movie.poster_path) {
                    const selectedPoster = document.createElement("img");
                    selectedPoster.src = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
                    selectedPoster.alt = `${movie.title} poster`;
                    selectedPoster.width = 150;
                    movieDetails.append(selectedPoster);
                }

                movieDetails.append(selectedSummary);
            });

            movieCard.append(chooseButton);
            movieOptionsContainer.append(movieCard);
        });

    } catch (error) {
        console.error("Could not load movies:", error);
    }
    console.log("Selected genre ID:", genreId);
});