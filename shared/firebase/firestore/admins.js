import {database} from "main/firebase/db.js";
import {firebaseAdmin} from "main/firebase/firebaseAdmin.js";

const adminsRef = database.collection("admins");
export const ACCESS_DENIED_ERROR = "AccessDeniedError";

export async function authenticate(idToken) {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const adminDoc = await adminsRef.doc(uid).get();

    if (adminDoc.exists) {
        return firebaseAdmin
            .auth()
            .setCustomUserClaims(uid, { admin: true })
    } else {
        const error = new Error("You don't have permission to view this page")
        error.name = ACCESS_DENIED_ERROR;
        throw error;
    }
}