import { database } from "main/firebase/db.js";
import * as yup from 'yup';
import {firebaseAdmin} from "../firebaseAdmin.js";

const ingredientsRef = database.collection("ingredients");

export const ingredientSchema = yup.object().shape({
    name: yup.string().required().min(2).max(50)
        .test("name-taken", "There's already an ingredient with that name", async name => {
            console.log(name)
            const existingIngredientSnapshot = await ingredientsRef.where("name", "==", name.toLowerCase()).get();

            return existingIngredientSnapshot.empty;
        }),
    alias: yup.string().required().min(2).max(25),
    rating: yup.number().required().min(1).max(10),
    rationale: yup.string().max(500)
});

async function getIngredient(ingredientId) {
    const ingredientDoc = await ingredientsRef.doc(ingredientId).get();

    const { modifiedOn, createdOn, ...ingredientData } = ingredientDoc.data();

    return {
        ...ingredientData,
        id: ingredientDoc.id
    };
}

export async function getIngredients(ingredientsIds) {
    return Promise.all(ingredientsIds.map(ingredientId => getIngredient(ingredientId)));
}

export async function createIngredient(name, alias, rating, rationale) {
    const newIngredient = {
        name,
        alias,
        rating,
        rationale,
        createdOn: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
        modifiedOn: firebaseAdmin.firestore.FieldValue.serverTimestamp()
    }

    const newIngredientRef = await ingredientsRef.add(newIngredient);

    return {
        id: newIngredientRef.id,
        ...newIngredient
    };
}

export async function searchIngredients(searchInput) {
    const matchingDocs =
        await ingredientsRef
            .orderBy("name")
            .startAt(searchInput)
            .endAt(searchInput + "\uf8ff")
            .limit(20)
            .get()

    let matchingIngredients = [];
    matchingDocs.forEach(ingredientDoc => {
        const { modifiedOn, createdOn, ...ingredientData } = ingredientDoc.data();

        const ingredient = {
            id: ingredientDoc.id,
            ...ingredientData
        }

        matchingIngredients.push(ingredient);
    });

    return matchingIngredients;
}