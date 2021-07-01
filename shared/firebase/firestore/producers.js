import {database} from "main/firebase/db.js";
import {getCompany} from "./companies.js";

const producersRef = database.collection("producers");

export async function getProducers() {
    const producersDocs = await producersRef.get();

    let producers = [];
    producersDocs.forEach(producerDoc => {
        const {rating, rationale} = producerDoc.data();

        producers.push({
            id: producerDoc.id,
            rating,
            rationale
        })
    })

    for (const [idx, {id}] of producers.entries()) {
        const company = await getCompany(id);
        producers[idx].name = company.name;
    }

    return producers;
}