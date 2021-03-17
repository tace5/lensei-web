import { database } from "../../../firebase/db";

function calculateIngredientsRating(ingredientsList) {
    const ratingSum = ingredientsList.reduce(((sum, ingredient) => sum + parseInt(ingredient.rating)), 0);

    if (ratingSum === 0 && ingredientsList.length === 0) {
        return 5;
    } else {
        return Math.round(ratingSum / ingredientsList.length);
    }
}

export default async function handleNewProduct(req, res) {
    const {
        name,
        barcodeFormat,
        barcode,
        ingredientsList,
        manufacturingLocation,
        packagingLocation,
        transportWeight,
        companyRating,
        packagingRating,
        overallRating
    } = req.body;

    const productsRef = database.collection("products");
    const productExistsSnapShot = await productsRef.where("name", "==", name.toLowerCase()).get();

    if (productExistsSnapShot.empty) {
        const newProductId = barcodeFormat + "-" + barcode;
        const newProductRef = productsRef.doc(newProductId);

        await productsRef.set({
            name: name.toLowerCase(),
            label: name,
            format: barcodeFormat,
            code: barcode,
            manufacturingLoc: new GeoPoint(manufacturingLocation.lat, manufacturingLocation.lng),
            packagingLocation: new GeoPoint(packagingLocation.lat, packagingLocation.lng),

            transportWeight,
            ingredientsRating: calculateIngredientsRating(ingredientsList),
            companyRating,
            packagingRating,
            overallRating
        })
    } else {
        const errors = { name: "A product with that name already exists" }
        res.status(409).json(errors);
    }
}