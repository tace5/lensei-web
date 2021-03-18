import {database} from "../../../firebase/db.js";

export async function getSuggestion(suggestionId) {
    const suggestionsRef = database.collection("suggestions");
    const suggestionDoc = await suggestionsRef.doc(suggestionId).get();

    const data = suggestionDoc.data();

    const usersRef = database.collection("users");
    const authorDoc = usersRef.doc(data.author);
    const author = await authorDoc.get();

    return {
        ...data,
        id: suggestionDoc.id,
        author: {
            ...author.data(),
            id: authorDoc.id
        },
        dateCreated: new Date(data.dateCreated._seconds * 1000).toUTCString()
    }
}

export default async function handleSuggestion(req, res) {
    const { id } = req.body;

    const product = await getSuggestion(id);

    res.status(200).json(product);
}