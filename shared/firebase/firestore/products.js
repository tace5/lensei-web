import {database} from "main/firebase/db.js";
import * as firebaseAdmin from "firebase-admin";
import {getIngredients} from "./ingredients.js";
import * as yup from 'yup';
import {getCompany} from "./companies.js";

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
    format: yup.string().required(),
    code: yup.string().required()
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
    producedAt: yup.object()
        .typeError("Please specify the product's packaging location")
        .required()
        .shape({
            lat: yup.number().required().min(-90).max(90),
            lng: yup.number().required().min(-180).max(180)
        }),
    summary: yup.string().max(500),
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
        const { name, code, format, producer, createdOn, summary } = productDoc.data();
        const isRated = summary !== undefined;

        const product = {
            id: productDoc.id,
            name,
            code,
            format,
            producer,
            isRated,
            dateCreated: new Date(createdOn._seconds * 1000).toUTCString(),
        }

        products.push(product);
    });

    for (const [idx, { producer }] of products.entries()) {
        products[idx].producer = await getCompany(producer);
    }

    return products;
}

export async function getProduct(id) {
    const productDoc = await productsRef.doc(id).get();
    const {
        name,
        format,
        code,
        createdOn,
        producedAt = {
            latitude: null,
            longitude: null
        },
        ingredients = [],
        packaging = [],
        tags = [],
        summary = ""
    } = productDoc.data();

    const ingredientsList = await getIngredients(ingredients);

    return {
        id: productDoc.id,
        name,
        format,
        code,
        ingredientsList,
        packaging,
        tags,
        summary,
        dateCreated: new Date(createdOn._seconds * 1000).toUTCString(),
        producedAt: {
            lat: producedAt.latitude,
            lng: producedAt.longitude
        }
    };
}

export function saveProduct(id, product) {
    const {
        name,
        format,
        code,
        summary,
        ingredientsList,
        producedAt,
        producer,
        tags,
        packagings,
    } = product;

    const productDoc = productsRef.doc(id);

    const ingredientsIds = ingredientsList.map(ingredient => ingredient.id);
    const tagIds = tags.map(tag => tag.id);
    const packagingIds = packagings.map(packaging => packaging.id);

    return productDoc.update({
        name,
        format,
        code,
        summary,
        producedAt: new firebaseAdmin.firestore.GeoPoint(producedAt.lat, producedAt.lng),
        ingredients: ingredientsIds,
        producer,
        tags: tagIds,
        packagings: packagingIds,
        modifiedOn: firebaseAdmin.firestore.FieldValue.serverTimestamp()
    });
}

export function deleteProduct(id) {
    const productDoc = productsRef.doc(id);
    return productDoc.delete();
}

export async function createProduct(product) {
    const {
        name,
        format,
        code,
        summary,
        ingredientsList,
        producedAt,
        producer,
        tags,
        packagings
    } = product;

    const newProductId = format + "-" + code;
    const newProductRef = productsRef.doc(newProductId);

    const ingredientsIds = ingredientsList.map(ingredient => ingredient.id);
    const tagIds = tags.map(tag => tag.id);
    const packagingIds = packagings.map(packaging => packaging.id);

    return newProductRef.set({
        name,
        format,
        code,
        summary,
        producer,
        producedAt: new firebaseAdmin.firestore.GeoPoint(producedAt.lat, producedAt.lng),
        ingredients: ingredientsIds,
        tags: tagIds,
        packagings: packagingIds,
        createdOn: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
        modifiedOn: firebaseAdmin.firestore.FieldValue.serverTimestamp()
    });
}