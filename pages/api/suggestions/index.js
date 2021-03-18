import {database} from "../../../firebase/db.js";

export async function getNextSuggestionsPage(suggestionsPerPage, lastDocId) {
    const productsRef = database.collection("suggestions");

    let suggestionsDocs;
    if (lastDocId === null) {
        suggestionsDocs = await productsRef
            .orderBy("dateCreated")
            .limit(suggestionsPerPage)
            .get()
    } else {
        const lastDoc = await productsRef.doc(lastDocId).get();
        suggestionsDocs = await productsRef
            .orderBy("dateCreated")
            .startAfter(lastDoc)
            .limit(suggestionsPerPage)
            .get();
    }

    let suggestions = [];
    suggestionsDocs.forEach(suggestionDoc => {
        const { dateCreated, ...data } = suggestionDoc.data();

        const product = {
            ...data,
            id: suggestionDoc.id,
            dateCreated: new Date(dateCreated._seconds * 1000).toUTCString()
        }

        suggestions.push(product);
    });

    return Promise.all(suggestions.map(async suggestion => {
        const usersRef = database.collection("users");
        const userDoc = await usersRef.doc(suggestion.author).get();

        return {
            ...suggestion,
            author: {
                id: suggestion.author,
                ...userDoc.data()
            }
        }
    }));
}

export default async function SuggestionsList(req, res) {
    const { suggestionsPerPage, lastDocId } = req.body;
    const nextSuggestionsPage = await getNextSuggestionsPage(suggestionsPerPage, lastDocId);

    res.status(200).json(nextSuggestionsPage);
}