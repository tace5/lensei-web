import {ACCESS_DENIED_ERROR, authenticate} from "../../../firebase/firestore/admins.js";

export default async function handler(req, res) {
    const { idToken } = req.body;

    authenticate(idToken)
        .then(() => res.status(200).end())
        .catch(err => {
            console.log(err);
            if (err.name === ACCESS_DENIED_ERROR) {
                res.status(401).end();
            } else {
                res.status(500).end();
            }
        })
}