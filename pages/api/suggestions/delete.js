import { database } from "../../../firebase/db.js";

export async function deleteSuggestion(suggestionId) {
    const suggestionsRef = database.collection("suggestions");
    const suggestionDoc = await suggestionsRef.doc(suggestionId);
    return await suggestionDoc.delete();
}

export default function handleSuggestionDelete(req, res) {
    const { id } = req.body;

    deleteSuggestion(id).then(r => res.status(200).json(r));
}