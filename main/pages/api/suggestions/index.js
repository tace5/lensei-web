import { getNextSuggestionsPage } from "../../../../shared/firebase/firestore/suggestions.js";

export default function handle(req, res) {
    if (req.method === "POST") {
        const { suggestionsPerPage, lastDocId } = req.body;

        getNextSuggestionsPage(suggestionsPerPage, lastDocId)
            .then(nextSuggestionsPage => res.status(200).json(nextSuggestionsPage))
            .catch(err => {
                console.log(err);
                res.status(500).end();
            })
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}