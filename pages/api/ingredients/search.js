import { database } from "../../../firebase/db";

export default async function handleIngredientsSearch(req, res) {
    const { searchInput } = req.body;

    const ingredientsRef = database.collection("ingredients");
    const snapshot =
        await ingredientsRef
            .orderBy("name")
            .startAt(searchInput)
            .endAt(searchInput + "\uf8ff")
            .get()

    let matchingIngredients = [];
    snapshot.forEach(ingredientDoc => {
        const ingredient = {
            id: ingredientDoc.id,
            ...ingredientDoc.data()
        }

        matchingIngredients.push(ingredient);
    });

    res.status(200).json(matchingIngredients);
}