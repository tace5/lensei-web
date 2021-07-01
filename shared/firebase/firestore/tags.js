import {database} from "main/firebase/db.js";

const tagsRef = database.collection("tags");

export async function getTags() {
    const tagsDocs = await tagsRef.get();

    let tags = [];
    tagsDocs.forEach(tagDoc => {
        const {name} = tagDoc.data();

        tags.push({
            id: tagDoc.id,
            name
        })
    })

    return tags;
}