import { database } from "../db.js";
import { getUser } from "./users.js";

const suggestionsRef = database.collection("suggestions");

export async function getNextSuggestionsPage(suggestionsPerPage, lastDocId) {
    let suggestionsDocs;
    if (lastDocId === null) {
        suggestionsDocs = await suggestionsRef
            .orderBy("dateCreated")
            .limit(suggestionsPerPage)
            .get()
    } else {
        const lastDoc = await suggestionsRef.doc(lastDocId).get();
        suggestionsDocs = await suggestionsRef
            .orderBy("dateCreated")
            .startAfter(lastDoc)
            .limit(suggestionsPerPage)
            .get();
    }

    let suggestions = [];
    suggestionsDocs.forEach(suggestionDoc => {
        const { dateCreated, author, format, code } = suggestionDoc.data();

        const suggestion = {
            id: suggestionDoc.id,
            author,
            format,
            code,
            dateCreated: new Date(dateCreated._seconds * 1000).toUTCString()
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
        dateCreated: new Date(data.dateCreated._seconds * 1000).toUTCString()
    }
}

export function deleteSuggestion(suggestionId) {
    const suggestionDoc = suggestionsRef.doc(suggestionId);
    return suggestionDoc.delete();
}
