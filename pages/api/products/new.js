import { database } from "../../../firebase/db";
import * as firebaseAdmin from "firebase-admin";
import {calculateIngredientsRating} from "../../../helpers/rating.js";
import {getDistance} from "../../../helpers/distance.js";

export async function createProduct(name, price, barcodeFormat, barcode, ingredientsList, manufacturingLocation, packagingLocation, transportWeight, companyRating, packagingRating, overallRating) {
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

        return {};

    } else {
        return { error: { status: 409, msg: { name: "A product with that name already exists" } } };
    }
}

export default function handleNewProduct(req, res) {
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

    createProduct(name, price, barcodeFormat, barcode, ingredientsList, manufacturingLocation, packagingLocation, transportWeight, companyRating, packagingRating, overallRating)
        .then(r => {
            if (!r.error) {
                res.status(200).json()
            } else {
                res.status(r.error.status).json(r.error.msg);
            }
        })
}