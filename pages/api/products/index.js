import { database } from "../../../firebase/db.js";

export default async function productsHandler(req, res) {
    const productsRef = database.collection("products");
    const snapshot = await productsRef.get();

    let products = [];
    snapshot.forEach(productDoc => {
        const product = {
            id: productDoc.id,
            ...productDoc.data()
        }
        products.push(product);
    });

    res.status(200).json(products);
}