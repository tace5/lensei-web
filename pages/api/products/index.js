import { createProduct, getNextProductPage, productSchema } from "../../../firebase/firestore/products.js";

export default async function handle(req, res) {
    switch (req.method) {
        case "GET":
            const {productsPerPage, lastDocId, orderBy, searchInput} = req.query;

            getNextProductPage(parseInt(productsPerPage), lastDocId, orderBy, searchInput)
                .then(nextProductPage => res.status(200).json(nextProductPage))
                .catch(err => {
                    console.log(err);
                    res.status(500).end();
                })

            break;
        case "POST":
            const newProduct = req.body;

            productSchema.validate(newProduct, { abortEarly: false })
                .then(() => createProduct(newProduct))
                .then(() => res.status(200).end())
                .catch(err => {
                    if (err.name === "ValidationError") {
                        res.status(400).json(err.inner);
                    } else {
                        console.log(err);
                        res.status(500).end();
                    }
                })

            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
            break;
    }
}