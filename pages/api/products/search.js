import {getNextProductPage} from "./index.js";

export default function handleProductSearch(req, res) {
    const { productsPerPage, searchInput, orderBy } = req.body;

    getNextProductPage(productsPerPage, null, orderBy, searchInput)
        .then(matchingProducts => res.status(200).json(matchingProducts));
}