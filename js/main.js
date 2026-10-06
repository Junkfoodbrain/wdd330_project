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