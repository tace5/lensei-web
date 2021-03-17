import { database } from "../../../firebase/db.js";

export default async function productsHandler(req, res) {
    const productsRef = database.collection("products");
    const productsDocs = await productsRef.get();

    let products = [];
    productsDocs.forEach(productDoc => {
        const product = {
            id: productDoc.id,
            ...productDoc.data()
        }
        products.push(product);
    });

    res.status(200).json(products);
}