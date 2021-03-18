import { database } from "../../../firebase/db.js";

export async function getNextProductPage(productsPerPage, startAt, orderBy) {
    const productsRef = database.collection("products");

    const productsDocs = await productsRef.orderBy(orderBy).startAt(startAt).limit(productsPerPage).get();

    let products = [];
    productsDocs.forEach(productDoc => {
        const data = productDoc.data();
        const product = {
            ...data,
            id: productDoc.id,
            manufacturingLoc: {
                lat: data.manufacturingLoc.latitude,
                lng: data.manufacturingLoc.longitude
            },
            packagingLoc: {
                lat: data.packagingLoc.latitude,
                lng: data.packagingLoc.longitude
            },
            dateCreated: data.dateCreated.toString()
        }

        products.push(product);
    });

    return products
}

export default async function handleProducts(req, res) {
    const { productsPerPage, startAt, orderBy } = req.body;

    const nextProductPage = await getNextProductPage(productsPerPage, startAt, orderBy);

    res.status(200).json(nextProductPage);
}