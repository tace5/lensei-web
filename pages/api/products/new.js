import { database } from "../../../firebase/db";
import * as firebaseAdmin from "firebase-admin";

function calculateIngredientsRating(ingredientsList) {
    const ratingSum = ingredientsList.reduce(((sum, ingredient) => sum + parseInt(ingredient.rating)), 0);

    if (ratingSum === 0 && ingredientsList.length === 0) {
        return 5;
    } else {
        return Math.round(ratingSum / ingredientsList.length);
    }
}

function rad(x) {
    return x * Math.PI / 180;
}

export function getDistance(p1, p2) {
    const R = 6378137;
    const dLat = rad(p2.lat - p1.lat);
    const dLong = rad(p2.lng - p1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c) / 1000;
};

export default async function handleNewProduct(req, res) {
    const {
        name,
        price,
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

    const ingredientsIds = ingredientsList.map(ingredient => ingredient.id);

    if (productExistsSnapShot.empty) {
        const newProductId = barcodeFormat + "-" + barcode;
        const newProductRef = productsRef.doc(newProductId);

        await newProductRef.set({
            name: name.toLowerCase(),
            price,
            likes: 0,
            dislikes: 0,
            label: name,
            format: barcodeFormat,
            code: barcode,
            manufacturingLoc: new firebaseAdmin.firestore.GeoPoint(manufacturingLocation.lat, manufacturingLocation.lng),
            packagingLoc: new firebaseAdmin.firestore.GeoPoint(packagingLocation.lat, packagingLocation.lng),
            manufacturingDistance: Math.round(getDistance(manufacturingLocation, packagingLocation) * 100) / 100,
            transportWeight,
            ingredients: ingredientsIds,
            ingredientsRating: calculateIngredientsRating(ingredientsList),
            companyRating,
            packagingRating,
            overallRating,
            dateCreated: firebaseAdmin.firestore.Timestamp.now()
        })

        res.status(200).json();
    } else {
        const errors = { name: "A product with that name already exists" }
        res.status(409).json(errors);
    }
}