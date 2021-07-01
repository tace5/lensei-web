import { deleteSuggestion } from "../../../../shared/firebase/firestore/suggestions.js";

export default function handle(req, res) {
    const { id } = req.query;

    switch (req.method) {
        case "DELETE":
            deleteSuggestion(id)
                .then(() => res.status(200).end())
                .catch(err => {
                    console.log(err);
                    res.status(500).end();
                })

            break;
    }
}