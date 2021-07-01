
export function calculateIngredientsRating(ingredientsList) {
    const ratingSum = ingredientsList.reduce(((sum, ingredient) => sum + parseInt(ingredient.rating)), 0);

    if (ratingSum === 0 && ingredientsList.length === 0) {
        return 5;
    } else {
        return Math.round(ratingSum / ingredientsList.length);
    }
}

export function calcRatingColor(rating) {
    if (rating < 4) {
        return "poor";
    } else if (rating >=4 && rating < 8) {
        return "average";
    } else {
        return "good";
    }
}