import { deleteProduct, saveProduct, productSchema } from "../../../firebase/firestore/products.js";

export default function handle(req, res) {
    const { id } = req.query;

    switch (req.method) {
        case "PUT":
            const updatedProduct = req.body;

            productSchema.validate(updatedProduct, { abortEarly: false, updateProduct: true, id })
                .then(() => saveProduct(id, updatedProduct))
                .then(() => res.status(200).end())
                .catch(err => {
                    if (err.name === "ValidationError") {
                        res.status(400).json(err.inner);
                    } else {
                        res.status(500).end();
                    }
                });

            break;
        case "DELETE":
            deleteProduct(id)
                .then(() => res.status(200).end())
                .catch(() => res.status(500).end());

            break;
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
            break;
    }
}