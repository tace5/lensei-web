import {database} from "../../../firebase/db.js";
import * as firebaseAdmin from "firebase-admin";
import {calculateIngredientsRating} from "../../../helpers/rating.js";
import {getDistance} from "../../../helpers/distance.js";

export default async function handleSaveProduct(req, res) {
    const {
        id,
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
    const productDoc = productsRef.doc(id)

    const ingredientsIds = ingredientsList.map(ingredient => ingredient.id);

    productDoc.update({
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
        .then(r => {
            res.status(200).json(r);
        })
        .catch(err => {
            res.status(500).json({ errors: err })
        })
}