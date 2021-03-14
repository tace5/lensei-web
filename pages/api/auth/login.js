import { database } from "../../../firebase/db.js";
import { firebaseAdmin } from "../../../firebase/firebaseAdmin.js";

export default async function loginHandler(req, res) {
    const { idToken } = req.body;
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const adminsRef = database.collection("admins").doc(uid);
    const adminDoc = await adminsRef.get();

    if (adminDoc.exists) {
        firebaseAdmin
            .auth()
            .setCustomUserClaims(uid, { admin: true })
            .then(() => {
                res.status(200).json({ authenticated: true })
            })
            .catch(error => {
                res.status(500).json({ error });
            });
    } else {
        res.status(401).json({ authenticated: false });
    }
}