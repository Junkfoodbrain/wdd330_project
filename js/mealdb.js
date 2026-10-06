export async function getCuisines() {
    const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );

    if (!response.ok) {
        throw new Error(`Cuisine request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.meals;
}

export async function getRecipesByCuisine(cuisine) {
    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(cuisine)}`
    );

    if (!response.ok) {
        throw new Error(`Recipe request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.meals;
}

// this uses lookup.php?i to request the recipe by it's ID. [0] gives the first recipe object.
export async function getRecipeDetails(recipeId) {
    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(recipeId)}`
    );

    if (!response.ok) {
        throw new Error(`Recipe details request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.meals || data.meals.length === 0) {
        throw new Error(`No recipe found for ID: ${recipeId}`);
    }

    return data.meals[0];
}