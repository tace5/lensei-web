import {createProduct, getNextProductPage, NAME_EXISTS_ERROR} from "../../../firebase/firestore/products.js";

export default function handle(req, res) {
    switch (req.method) {
        case "GET":
            const { productsPerPage, lastDocId, orderBy, searchInput } = req.query;

            getNextProductPage(parseInt(productsPerPage), lastDocId, orderBy, searchInput)
                .then(nextProductPage => res.status(200).json(nextProductPage))
                .catch(err => {
                    console.log(err);
                    res.status(500).end();
                })

            break;
        case "POST":
            createProduct(req.body)
                .then(() => res.status(200).end())
                .catch(err => {
                    console.log(err);
                    if (err.name === NAME_EXISTS_ERROR) {
                        res.status(409).json({ name: err.message })
                    } else {
                        res.status(500).end();
                    }
                })

            break;
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
            break;
    }
}