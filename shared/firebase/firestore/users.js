import {database} from "main/firebase/db.js";

const usersRef = database.collection("users");

export async function getUser(userId) {
    const userDoc = await usersRef.doc(userId).get();

    return {
        ...userDoc.data(),
        id: userDoc.id
    }
}