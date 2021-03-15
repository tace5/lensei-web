import {database} from "../../firebase/db.js";

export default async function suggestionsHandler(req, res) {
    const suggestionsRef = database.collection("suggestions");
    const snapshot = await suggestionsRef.get();

    let suggestions = [];
    snapshot.forEach(suggestionDoc => {
        const suggestion = {
            id: suggestionDoc.id,
            ...suggestionDoc.data()
        }
        suggestions.push(suggestion);
    });

    res.status(200).json(suggestions);
}