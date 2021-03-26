import { database } from "../db.js";

const ingredientsRef = database.collection("ingredients");
export const NAME_EXISTS_ERROR = "NameExistsError";

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

    const existingIngredientDoc = await ingredientsRef.where("name", "==", newIngredient.name).get();

    if (existingIngredientDoc.empty) {
        const newIngredientRef = await ingredientsRef.add(newIngredient);
        return {
            id: newIngredientRef.id,
            ...newIngredient
        };
    } else {
        const error = new Error("An ingredient with that name already exists");
        error.name = NAME_EXISTS_ERROR;
        throw error;
    }
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