import {database} from "../../../firebase/db.js";

export default function handleProductDelete(req, res) {
    const { id } = req.body;

    const productsRef = database.collection("products");
    const productDoc = productsRef.doc(id);
    productDoc.delete().then(r => res.status(200).json(r));
}