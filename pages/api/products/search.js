import {getNextProductPage} from "./index.js";

export default async function handleProductSearch(req, res) {
    const { productsPerPage, searchInput, orderBy } = req.body;

    const matchingProducts = await getNextProductPage(productsPerPage, null, orderBy, searchInput);

    res.status(200).json(matchingProducts);
}