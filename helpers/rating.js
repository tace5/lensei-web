
export function calculateIngredientsRating(ingredientsList) {
    const ratingSum = ingredientsList.reduce(((sum, ingredient) => sum + parseInt(ingredient.rating)), 0);

    if (ratingSum === 0 && ingredientsList.length === 0) {
        return 5;
    } else {
        return Math.round(ratingSum / ingredientsList.length);
    }
}

export function calcRatingColor(rating) {
    const percent = rating / 10;
    const start = 0; // red
    const end = 120;
    const a = (end - start) * percent;
    const b = a + start;

    // Return a CSS HSL string
    return 'hsl('+b+', 100%, 45%)';
}