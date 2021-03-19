import {createProduct} from "../products/new.js";
import {deleteSuggestion} from "./delete.js";

export default async function handleApproveSuggestion(req, res) {
    const {
        id,
        name,
        price,
        barcodeFormat,
        barcode,
        ingredientsList,
        manufacturingLocation,
        packagingLocation,
        transportWeight,
        companyRating,
        packagingRating,
        overallRating
    } = req.body;

    const r = await createProduct(name, price, barcodeFormat, barcode, ingredientsList, manufacturingLocation, packagingLocation, transportWeight, companyRating, packagingRating, overallRating)

    if (!r.error) {
        deleteSuggestion(id)
            .then(r2 => {
                res.status(200).json(r2)
            })
    } else {
        res.status(r.error.status).json(r.error.msg);
    }
}