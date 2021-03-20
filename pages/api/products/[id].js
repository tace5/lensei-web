import { deleteProduct, getProduct, saveProduct } from "../../../firebase/firestore/products.js";

export default function handle(req, res) {
    const { id } = req.query;

    switch (req.method) {
        case "GET":
            getProduct(id)
                .then(product => res.status(200).json(product))
                .catch(err => {
                    console.log(err);
                    res.status(500).end("Failed to fetch product wi");
                })

            break;
        case "PUT":
            saveProduct(id, req.body)
                .then(() => res.status(200).end())
                .catch(err => {
                    console.log(err);
                    res.status(500).end();
                })

            break;
        case "DELETE":
            deleteProduct(id)
                .then(() => res.status(200).end())
                .catch(err => {
                    console.log(err);
                    res.status(500).end();
                })

            break;
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
            break;
    }
}