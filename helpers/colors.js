

export function calcRatingColor(rating) {
    const percent = rating / 10;
    const start = 0; // red
    const end = 120;
    const a = (end - start) * percent;
    const b = a + start;

    // Return a CSS HSL string
    return 'hsl('+b+', 100%, 45%)';
}