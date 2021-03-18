import { database } from "../../../firebase/db.js";

export async function getNextProductPage(productsPerPage, lastDocId, orderBy, searchInput = "") {
    const productsRef = database.collection("products");

    let productDocs;
    if (lastDocId === null) {
        productDocs = await productsRef
            .orderBy("name")
            .orderBy(orderBy)
            .startAt(searchInput)
            .endAt(searchInput + "\uf8ff")
            .limit(productsPerPage)
            .get()
    } else {
        const lastDoc = await productsRef.doc(lastDocId).get();
        productDocs = await productsRef
            .orderBy("name")
            .orderBy(orderBy)
            .startAfter(lastDoc)
            .limit(productsPerPage)
            .get();
    }

    let products = [];
    productDocs.forEach(productDoc => {
        const { label, name, ingredientsRating, companyRating, packagingRating, overallRating, price, likes, dislikes, dateCreated } = productDoc.data();
        const product = {
            id: productDoc.id,
            name,
            label,
            ingredientsRating,
            companyRating,
            packagingRating,
            overallRating,
            price,
            likes,
            dislikes,
            dateCreated: new Date(dateCreated._seconds * 1000).toUTCString()
        }

        products.push(product);
    });

    return products
}

export default async function handleProducts(req, res) {
    const { productsPerPage, lastDocId, orderBy } = req.body;
    const nextProductPage = await getNextProductPage(productsPerPage, lastDocId, orderBy);

    res.status(200).json(nextProductPage);
}