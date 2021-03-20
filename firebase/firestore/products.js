import {database} from "../db.js";
import * as firebaseAdmin from "firebase-admin";
import { getDistance } from "../../helpers/distance.js";
import { calculateIngredientsRating } from "../../helpers/rating.js";
import { getIngredients } from "./ingredients.js";

const productsRef = database.collection("products");
export const NAME_EXISTS_ERROR = "NameExistsError";

export async function getNextProductPage(productsPerPage, lastDocId, orderBy, searchInput = "") {
    let productDocs;
    if (!lastDocId) {
        productDocs = await productsRef
            .orderBy("name")
            .orderBy(orderBy)
            .startAt(searchInput)
            .endAt(searchInput + "\uf8ff")
            .limit(productsPerPage)
            .get()
    } else {
        const lastDoc = await productsRef.doc(lastDocId).get();
        productDocs = await productsRef
            .orderBy("name")
            .orderBy(orderBy)
            .startAt(searchInput)
            .endAt(searchInput + "\uf8ff")
            .startAfter(lastDoc)
            .limit(productsPerPage)
            .get();
    }

    let products = [];
    productDocs.forEach(productDoc => {
        const { label, name, ingredientsRating, companyRating, packagingRating, overallRating, price, likes, dislikes, dateCreated } = productDoc.data();
        const product = {
            id: productDoc.id,
            name,
            label,
            ingredientsRating,
            companyRating,
            packagingRating,
            overallRating,
            price,
            likes,
            dislikes,
            dateCreated: new Date(dateCreated._seconds * 1000).toUTCString()
        }

        products.push(product);
    });

    return products
}

export async function getProduct(id) {
    const productDoc = await productsRef.doc(id).get();
    const data = productDoc.data();

    const ingredientsList = await getIngredients(data.ingredients);

    return {
        id: productDoc.id,
        name: data.label,
        barcodeFormat: data.format,
        barcode: data.code,
        price: data.price,
        label: data.label,
        dislikes: data.dislikes,
        likes: data.likes,
        ingredientsList,
        dateCreated: new Date(data.dateCreated._seconds * 1000).toUTCString(),
        packagingLocation: {
            lat: data.packagingLoc.latitude,
            lng: data.packagingLoc.longitude
        },
        manufacturingLocation: {
            lat: data.manufacturingLoc.latitude,
            lng: data.manufacturingLoc.longitude
        },
        ingredientsRating: data.ingredientsRating,
        packagingRating: data.packagingRating,
        transportWeight: data.transportWeight,
        overallRating: data.overallRating,
        companyRating: data.companyRating
    };
}

export function saveProduct(id, { name, price, barcodeFormat, barcode, ingredientsList, manufacturingLocation, packagingLocation, transportWeight, companyRating, packagingRating, overallRating }) {
    const productDoc = productsRef.doc(id)

    const ingredientsIds = ingredientsList.map(ingredient => ingredient.id);

    return productDoc.update({
        name: name.toLowerCase(),
        price,
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
        overallRating
    });
}

export function deleteProduct(id) {
    const productDoc = productsRef.doc(id);
    return productDoc.delete();
}

export async function createProduct({ name, price, barcodeFormat, barcode, ingredientsList, manufacturingLocation, packagingLocation, transportWeight, companyRating, packagingRating, overallRating }) {
    const productExistsSnapShot = await productsRef.where("name", "==", name.toLowerCase()).get();

    if (productExistsSnapShot.empty) {
        const newProductId = barcodeFormat + "-" + barcode;
        const newProductRef = productsRef.doc(newProductId);

        const ingredientsIds = ingredientsList.map(ingredient => ingredient.id);

        return newProductRef.set({
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
    } else {
        const error = new Error("A product with that name already exists")
        error.name = NAME_EXISTS_ERROR;
        throw error;
    }
}