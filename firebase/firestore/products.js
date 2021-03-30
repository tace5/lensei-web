import {database} from "../db.js";
import * as firebaseAdmin from "firebase-admin";
import { getDistance } from "../../helpers/distance.js";
import { calculateIngredientsRating } from "../../helpers/rating.js";
import { getIngredients } from "./ingredients.js";
import * as yup from 'yup';

const productsRef = database.collection("products");

export const productSchema = yup.object().shape({
    name: yup.string().required().min(2).max(50)
        .test("name-taken", "There's already a product with that name", async (name, testCtx) => {
            const productSnapshot = await productsRef
                .where("name", "==", name.toLowerCase())
                .limit(1)
                .get();

            if (testCtx.options.updateProduct && productSnapshot.docs[0]) {
                return testCtx.options.id === productSnapshot.docs[0].id;
            }
            return productSnapshot.empty;
        }),
    price: yup.number().min(0),
    barcodeFormat: yup.string().required(),
    barcode: yup.string().required()
        .test("barcode-taken", "There's already a product with that barcode", async (barcode, testCtx) => {
            const productSnapshot = await productsRef
                .where("code", "==", barcode)
                .where("format", "==", testCtx.parent.barcodeFormat)
                .limit(1)
                .get();

            if (testCtx.options.updateProduct && productSnapshot.docs[0]) {
                return testCtx.options.id === productSnapshot.docs[0].id;
            }
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
    const {
        label,
        format,
        code,
        dateCreated,
        packagingLoc,
        manufacturingLoc,
        ingredients,
        ...data
    } = productDoc.data();

    const ingredientsList = await getIngredients(ingredients);

    return {
        id: productDoc.id,
        name: label,
        barcodeFormat: format,
        barcode: code,
        ingredientsList,
        dateCreated: new Date(dateCreated._seconds * 1000).toUTCString(),
        packagingLoc: {
            lat: packagingLoc.latitude,
            lng: packagingLoc.longitude
        },
        manufacturingLoc: {
            lat: manufacturingLoc.latitude,
            lng: manufacturingLoc.longitude
        },
        ...data
    };
}

export function saveProduct(id, product) {
    const {
        name,
        barcodeFormat,
        barcode, ingredientsList,
        manufacturingLoc,
        packagingLoc,
        ...date
    } = product;

    const productDoc = productsRef.doc(id);

    const ingredientsIds = ingredientsList.map(ingredient => ingredient.id);

    return productDoc.update({
        name: name.toLowerCase(),
        label: name,
        format: barcodeFormat,
        code: barcode,
        manufacturingLoc: new firebaseAdmin.firestore.GeoPoint(manufacturingLoc.lat, manufacturingLoc.lng),
        packagingLoc: new firebaseAdmin.firestore.GeoPoint(packagingLoc.lat, packagingLoc.lng),
        manufacturingDistance: Math.round(getDistance(manufacturingLoc, packagingLoc) * 100) / 100,
        ingredients: ingredientsIds,
        ingredientsRating: calculateIngredientsRating(ingredientsList),
        ...date
    });
}

export function deleteProduct(id) {
    const productDoc = productsRef.doc(id);
    return productDoc.delete();
}

export async function createProduct(product) {
    const {
        name,
        barcodeFormat,
        barcode,
        ingredientsList,
        manufacturingLoc,
        packagingLoc,
        ...data
    } = product;

    const newProductId = barcodeFormat + "-" + barcode;
    const newProductRef = productsRef.doc(newProductId);

    const ingredientsIds = ingredientsList.map(ingredient => ingredient.id);

    return newProductRef.set({
        name: name.toLowerCase(),
        likes: 0,
        dislikes: 0,
        label: name,
        format: barcodeFormat,
        code: barcode,
        manufacturingLoc: new firebaseAdmin.firestore.GeoPoint(manufacturingLoc.lat, manufacturingLoc.lng),
        packagingLoc: new firebaseAdmin.firestore.GeoPoint(packagingLoc.lat, packagingLoc.lng),
        manufacturingDistance: Math.round(getDistance(manufacturingLoc, packagingLoc) * 100) / 100,
        ingredients: ingredientsIds,
        ingredientsRating: calculateIngredientsRating(ingredientsList),
        dateCreated: firebaseAdmin.firestore.Timestamp.now(),
        ...data
    });
}