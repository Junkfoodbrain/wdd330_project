import { getMoviesByGenre } from "./tmdb.js";

import {
    getCuisines,
    getRecipesByCuisine,
    getRecipeDetails
} from "./mealdb.js";

import { genreCuisinePairings } from "./pairings.js";
console.log("Comedy cuisine suggestion: ", genreCuisinePairings["35"]);



getCuisines()
    .then((cuisines) => {
        const preferredCuisines = [
            "Italian",
            "Mexican",
            "Thai",
            "Chinese",
            "Greek",
            "Japanese",
            "Thai",
            "Spanish"
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
let selectedMovie = null;

genreSelect.addEventListener("change", async () => {
    const genreId = genreSelect.value;
    selectedMovie = null;
    document.querySelector("#movie-details").replaceChildren();
    document.querySelector("#movie-options").replaceChildren();
    document.querySelector("#cuisine-select").value = "";
    loadRecipes("");

    if (!genreId) {
        return;
    }

    try {
        const movies = await getMoviesByGenre(genreId);
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
                selectedMovie = movie;
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

                // Suggest a cuisine based on the selected movie genre.
                const suggestedCuisine = genreCuisinePairings[genreId];
                const cuisineSelect = document.querySelector("#cuisine-select");
                cuisineSelect.value = suggestedCuisine;
                loadRecipes(suggestedCuisine);
            });

            movieCard.append(chooseButton); 1
            movieOptionsContainer.append(movieCard);
        });

    } catch (error) {
        console.error("Could not load movies:", error);
    }
    console.log("Selected genre ID:", genreId);
});

const cuisineSelect = document.querySelector("#cuisine-select");

async function loadRecipes(cuisine) {
    document.querySelector("#recipe-options").replaceChildren();
    document.querySelector("#recipe-details").replaceChildren();
    document.querySelector("#pairing-details").replaceChildren();

    if (!cuisine) {
        return;
    }

    try {
        const recipes = await getRecipesByCuisine(cuisine);

        if (!recipes || recipes.length === 0) {
            console.warn(`No recipes found for ${cuisine}.`);
            document.querySelector("#recipe-options").textContent =
                `No recipes found for ${cuisine}. Please choose another cuisine.`;
            return;
        }

        document.querySelector("#recipe-options").replaceChildren();

        console.log(`Recipes for ${cuisine}:`, recipes);

        const recipeOptionsContainer = document.querySelector("#recipe-options");
        const recipeOptions = recipes.slice(0, 3);


        recipeOptions.forEach((recipe) => {
            const recipeCard = document.createElement("article");
            recipeCard.className = "recipe-card";

            const recipeTitle = document.createElement("h3");
            recipeTitle.textContent = recipe.strMeal;
            recipeCard.append(recipeTitle);

            if (recipe.strMealThumb) {
                const recipeImage = document.createElement("img");
                recipeImage.src = recipe.strMealThumb;
                recipeImage.alt = recipe.strMeal;
                recipeImage.width = 150;
                recipeImage.loading = "lazy";
                recipeCard.append(recipeImage);
            }

            const chooseRecipeButton = document.createElement("button");
            chooseRecipeButton.type = "button";
            chooseRecipeButton.textContent = `Choose ${recipe.strMeal}`;

            chooseRecipeButton.addEventListener("click", async () => {
                try {
                    const selectedRecipe = await getRecipeDetails(recipe.idMeal);
                    console.log("Selected recipe details:", selectedRecipe);

                    const recipeDetails = document.querySelector("#recipe-details");
                    recipeDetails.replaceChildren();

                    const selectedRecipeTitle = document.createElement("h3");
                    selectedRecipeTitle.textContent = selectedRecipe.strMeal;

                    const instructions = document.createElement("p");
                    instructions.textContent = selectedRecipe.strInstructions || "No instructions available.";

                    recipeDetails.append(selectedRecipeTitle);

                    if (selectedRecipe.strMealThumb) {
                        const selectedRecipeImage = document.createElement("img");
                        selectedRecipeImage.src = selectedRecipe.strMealThumb;
                        selectedRecipeImage.alt = selectedRecipe.strMeal;
                        selectedRecipeImage.width = 150;

                        recipeDetails.append(selectedRecipeImage);
                    }

                    const ingredientsHeading = document.createElement("h4");
                    ingredientsHeading.textContent = "Ingredients:";

                    const ingredientsList = document.createElement("ul");

                    // Match each numbered ingredient with its quantity, skipping empty ingredients.
                    for (let i = 1; i <= 20; i++) {
                        const ingredient = selectedRecipe[`strIngredient${i}`];
                        const measure = selectedRecipe[`strMeasure${i}`];

                        if (ingredient && ingredient.trim()) {
                            const listItem = document.createElement("li");
                            listItem.textContent = `${measure ? measure.trim() : ""} ${ingredient.trim()}`.trim();
                            ingredientsList.append(listItem);
                        }
                    }

                    recipeDetails.append(ingredientsHeading, ingredientsList);

                    recipeDetails.append(instructions);
                    const pairingDetails = document.querySelector("#pairing-details");
                    pairingDetails.replaceChildren();

                    if (selectedMovie) {
                        const pairingTitle = document.createElement("h3");
                        pairingTitle.textContent = `${selectedMovie.title} + ${selectedRecipe.strMeal}`;

                        const closingMessage = document.createElement("p");
                        closingMessage.className = "pairing-message";
                        closingMessage.textContent = "Enjoy the show!";

                        pairingDetails.append(pairingTitle);
                        if (selectedMovie.poster_path) {
                            const pairingPoster = document.createElement("img");
                            pairingPoster.className = "pairing-poster";
                            pairingPoster.src = `https://image.tmdb.org/t/p/w342${selectedMovie.poster_path}`;
                            pairingPoster.alt = `${selectedMovie.title} poster`;
                            pairingPoster.width = 150;
                            pairingDetails.append(pairingPoster);
                        }

                        if (selectedRecipe.strMealThumb) {
                            const pairingFoodImage = document.createElement("img");
                            pairingFoodImage.className = "pairing-food";
                            pairingFoodImage.src = selectedRecipe.strMealThumb;
                            pairingFoodImage.alt = selectedRecipe.strMeal;
                            pairingFoodImage.width = 150;
                            pairingDetails.append(pairingFoodImage);
                        }

                        pairingDetails.append(closingMessage);
                    } else {
                        pairingDetails.textContent = "Choose a movie, then select a recipe to complete your pairing.";
                    }

                } catch (error) {
                    console.error("Could not load recipe details:", error);
                }
            });

            recipeCard.append(chooseRecipeButton);
            recipeOptionsContainer.append(recipeCard);
        });

    } catch (error) {
        console.error("Could not load recipes:", error);
    }
}

cuisineSelect.addEventListener("change", () => {
    loadRecipes(cuisineSelect.value);
});

// Wiring the start over button
const startOverButton = document.querySelector("#start-over");

startOverButton.addEventListener("click", () => {
    genreSelect.value = "";
    genreSelect.dispatchEvent(new Event("change"));
});