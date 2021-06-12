import {searchIngredients, createIngredient, ingredientSchema} from "../../firebase/firestore/ingredients.js";

export default function handle(req, res) {
    switch (req.method) {
        case "GET":
            const { searchInput } = req.query;

            searchIngredients(searchInput)
                .then(matchingIngredients => res.status(200).json(matchingIngredients))
                .catch(err => {
                    console.log(err);
                    res.status(500).end()
                });

            break;
        case "POST":
            const newIngredient = req.body;

            ingredientSchema.validate(newIngredient, { abortEarly: false })
                .then(() => createIngredient(newIngredient.name, newIngredient.rating, newIngredient.description))
                .then(newIngredient => res.status(200).json(newIngredient))
                .catch(err => {
                    if (err.name === "ValidationError") {
                        res.status(400).json(err.inner);
                    } else {
                        console.log(err);
                        res.status(500).end();
                    }
                })

            break;
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
            break;
    }
}