import {database} from "main/firebase/db.js";
import {firebaseAdmin} from "main/firebase/firebaseAdmin.js";

const companiesRef = database.collection("companies");
export const ACCESS_DENIED_ERROR = "AccessDeniedError";

export async function authenticate(idToken) {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const companyDoc = await companiesRef.doc(uid).get();

    if (companyDoc.exists) {
        return firebaseAdmin
            .auth()
            .setCustomUserClaims(uid, { company: true })
    } else {
        const error = new Error("You don't have permission to view this page")
        error.name = ACCESS_DENIED_ERROR;
        throw error;
    }
}

export async function getCompany(companyId) {
    const companyDoc = await companiesRef.doc(companyId).get();
    const {name, email} = companyDoc.data();

    return {
        id: companyDoc.id,
        name,
        email
    };
}
