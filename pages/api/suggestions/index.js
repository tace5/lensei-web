import { getNextSuggestionsPage } from "../../../firebase/firestore/suggestions.js";

export default function handle(req, res) {
    const { suggestionsPerPage, lastDocId } = req.body;
    getNextSuggestionsPage(suggestionsPerPage, lastDocId)
        .then(nextSuggestionsPage => res.status(200).json(nextSuggestionsPage))
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
}