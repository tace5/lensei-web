import {database} from "../db.js";
import * as firebaseAdmin from "firebase-admin";
import { getDistance } from "../../helpers/distance.js";
import { calculateIngredientsRating } from "../../helpers/rating.js";
import { getIngredients } from "./ingredients.js";
import * as yup from 'yup';

const productsRef = database.collection("products");

export const productSchema = yup.object().shape({
    name: yup.string().required().min(2).max(50)
        .test("name-taken", "There's already a product with that name", async name => {
            const productSnapshot = await productsRef
                .where("name", "==", name.toLowerCase())
                .get()

            return productSnapshot.empty;
        }),
    price: yup.number().min(0),
    barcodeFormat: yup.string().required(),
    barcode: yup.string().required()
        .test("barcode-taken", "There's already a product with that barcode", async (barcode, testCtx) => {
            const productSnapshot = await productsRef
                .where("code", "==", barcode)
                .where("format", "==", testCtx.parent.barcodeFormat)
                .get()

            return productSnapshot.empty;
        }),
    manufacturingLoc: yup.object()
        .typeError("Please specify the product's manufacturing location")
        .required()
        .shape({
            lat: yup.number().required().min(-90).max(90),
            lng: yup.number().required().min(-180).max(180)
        }),
    packagingLoc: yup.object()
        .typeError("Please specify the product's packaging location")
        .required()
        .shape({
            lat: yup.number().required().min(-90).max(90),
            lng: yup.number().required().min(-180).max(180)
        }),
    transportWeight: yup.number().required().min(1).max(10),
    companyRating: yup.number().required().min(1).max(10),
    companyName: yup.string().min(2).max(50),
    companyRatingRationale: yup.string().max(500),
    packagingRating: yup.number().required().min(1).max(10),
    packagingRatingRationale: yup.string().max(500),
    overallRating: yup.number().required().min(1).max(10),
    overallRatingRationale: yup.string().max(500),
});

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

    return products;
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
        packagingLoc: {
            lat: data.packagingLoc.latitude,
            lng: data.packagingLoc.longitude
        },
        manufacturingLoc: {
            lat: data.manufacturingLoc.latitude,
            lng: data.manufacturingLoc.longitude
        },
        ingredientsRating: data.ingredientsRating,
        packagingRating: data.packagingRating,
        packagingRatingRationale: data.packagingRatingRationale,
        transportWeight: data.transportWeight,
        overallRating: data.overallRating,
        overallRatingRationale: data.overallRatingRationale,
        companyRating: data.companyRating,
        companyName: data.companyName,
        companyRatingRationale: data.companyRatingRationale,
    };
}

export function saveProduct(id, product) {
    const {
        name,
        price,
        barcodeFormat,
        barcode, ingredientsList,
        manufacturingLoc,
        packagingLoc,
        transportWeight,
        companyRating,
        companyName,
        companyRatingRationale,
        packagingRating,
        packagingRatingRationale,
        overallRating,
        overallRatingRationale
    } = product;

    const productDoc = productsRef.doc(id);

    const ingredientsIds = ingredientsList.map(ingredient => ingredient.id);

    return productDoc.update({
        name: name.toLowerCase(),
        price,
        label: name,
        format: barcodeFormat,
        code: barcode,
        manufacturingLoc: new firebaseAdmin.firestore.GeoPoint(manufacturingLoc.lat, manufacturingLoc.lng),
        packagingLoc: new firebaseAdmin.firestore.GeoPoint(packagingLoc.lat, packagingLoc.lng),
        manufacturingDistance: Math.round(getDistance(manufacturingLoc, packagingLoc) * 100) / 100,
        transportWeight,
        ingredients: ingredientsIds,
        ingredientsRating: calculateIngredientsRating(ingredientsList),
        companyRating,
        companyName,
        companyRatingRationale,
        packagingRating,
        packagingRatingRationale,
        overallRating,
        overallRatingRationale
    });
}

export function deleteProduct(id) {
    const productDoc = productsRef.doc(id);
    return productDoc.delete();
}

export async function createProduct(product) {
    const {
        name,
        price,
        barcodeFormat,
        barcode,
        ingredientsList,
        manufacturingLoc,
        packagingLoc,
        transportWeight,
        companyRating,
        companyName,
        companyRatingRationale,
        packagingRating,
        packagingRatingRationale,
        overallRating,
        overallRatingRationale
    } = product;
console.log(product)
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
        manufacturingLoc: new firebaseAdmin.firestore.GeoPoint(manufacturingLoc.lat, manufacturingLoc.lng),
        packagingLoc: new firebaseAdmin.firestore.GeoPoint(packagingLoc.lat, packagingLoc.lng),
        manufacturingDistance: Math.round(getDistance(manufacturingLoc, packagingLoc) * 100) / 100,
        transportWeight,
        ingredients: ingredientsIds,
        ingredientsRating: calculateIngredientsRating(ingredientsList),
        companyRating,
        companyName,
        companyRatingRationale,
        packagingRating,
        packagingRatingRationale,
        overallRating,
        overallRatingRationale,
        dateCreated: firebaseAdmin.firestore.Timestamp.now()
    });
}