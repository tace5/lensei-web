
import {database} from "main/firebase/db.js";

const tagsRef = database.collection("packagings");

export async function getPackagings() {
    const packagingsDocs = await tagsRef.get();

    let packagings = [];
    packagingsDocs.forEach(packagingDoc => {
        const {name} = packagingDoc.data();

        packagings.push({
            id: packagingDoc.id,
            name
        })
    })

    return packagings;
}