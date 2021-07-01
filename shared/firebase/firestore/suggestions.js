import { database } from "main/firebase/db.js";
import { getUser } from "./users.js";

const suggestionsRef = database.collection("suggestions");

export async function getNextSuggestionsPage(suggestionsPerPage, lastDocId) {
    let suggestionsDocs;
    if (lastDocId === null) {
        suggestionsDocs = await suggestionsRef
            .orderBy("createdAt")
            .limit(suggestionsPerPage)
            .get()
    } else {
        const lastDoc = await suggestionsRef.doc(lastDocId).get();
        suggestionsDocs = await suggestionsRef
            .orderBy("createdAt")
            .startAfter(lastDoc)
            .limit(suggestionsPerPage)
            .get();
    }

    let suggestions = [];
    suggestionsDocs.forEach(suggestionDoc => {
        const { createdAt, author, format, code } = suggestionDoc.data();

        const suggestion = {
            id: suggestionDoc.id,
            author,
            format,
            code,
            createdAt: new Date(createdAt._seconds * 1000).toUTCString()
        }

        suggestions.push(suggestion);
    });

    return Promise.all(suggestions.map(async suggestion => {
        const author = await getUser(suggestion.author);

        return {
            ...suggestion,
            author
        }
    }));
}

export async function getSuggestion(suggestionId) {
    const suggestionDoc = await suggestionsRef.doc(suggestionId).get();
    const data = suggestionDoc.data();

    const author = await getUser(data.author);

    return {
        ...data,
        id: suggestionDoc.id,
        author,
        createdAt: new Date(data.createdAt._seconds * 1000).toUTCString()
    }
}

export function deleteSuggestion(suggestionId) {
    const suggestionDoc = suggestionsRef.doc(suggestionId);
    return suggestionDoc.delete();
}
