import { database } from "../../../firebase/db";

export default async function handleNewIngredient(req, res) {
    const { name, rating, description } = req.body;
    const newIngredient = {
        name: name.toLowerCase(),
        label: name,
        rating,
        description
    }

    const ingredientsRef = database.collection("ingredients");
    const existingIngredientSnapshot = await ingredientsRef.where("name", "==", newIngredient.name).get();

    if (existingIngredientSnapshot.empty) {
        const newIngredientRef = await ingredientsRef.add(newIngredient)

        res.status(200).json({
            id: newIngredientRef.id,
            ...newIngredient
        });
    } else {
        const errors = { name: "An ingredient with that name already exists" };
        res.status(409).json(errors);
    }
}