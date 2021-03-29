import { database } from "../db.js";
import * as yup from 'yup';

const ingredientsRef = database.collection("ingredients");

export const ingredientSchema = yup.object().shape({
    name: yup.string().required().min(2).max(50)
        .test("name-taken", "There's already an ingredient with that name", async name => {
            const existingIngredientSnapshot = await ingredientsRef.where("name", "==", name.toLowerCase()).get();

            return existingIngredientSnapshot.empty;
        }),
    rating: yup.number().required().min(1).max(10),
    description: yup.string().max(500)
});

async function getIngredient(ingredientId) {
    const ingredientDoc = await ingredientsRef.doc(ingredientId).get();

    return {
        ...ingredientDoc.data(),
        id: ingredientDoc.id
    };
}

export async function getIngredients(ingredientsIds) {
    return Promise.all(ingredientsIds.map(ingredientId => getIngredient(ingredientId)));
}

export async function createIngredient(name, rating, description) {
    const newIngredient = {
        name: name.toLowerCase(),
        label: name,
        rating,
        description
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
        const ingredient = {
            id: ingredientDoc.id,
            ...ingredientDoc.data()
        }

        matchingIngredients.push(ingredient);
    });

    return matchingIngredients;
}