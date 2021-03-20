import { searchIngredients, createIngredient, NAME_EXISTS_ERROR } from "../../firebase/firestore/ingredients.js";

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
            const { ingredientName, rating, description } = req.body;

            createIngredient(ingredientName, rating, description)
                .then(newIngredient => res.status(200).json(newIngredient))
                .catch(err => {
                    console.log(err);
                    if (err.name === NAME_EXISTS_ERROR) {
                        res.status(409).json({ name: err.message });
                    } else {
                        res.status(500).end()
                    }
                })

            break;
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
            break;
    }
}