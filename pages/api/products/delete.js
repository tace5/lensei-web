import {database} from "../../../firebase/db.js";

export default async function handleProductDelete(req, res) {
    const { id } = req.body;

    const productsRef = database.collection("products");
    const productDoc = productsRef.doc(id);
    const r = await productDoc.delete();

    res.status(200).json(r);
}