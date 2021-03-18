import {database} from "../../../firebase/db.js";

export async function getProduct(id) {
    const productsRef = database.collection("products");
    const productDoc = await productsRef.doc(id).get();

    const data = productDoc.data();

    const getIngredient = async (ingredientRef) => {
        const ingredientDoc = await ingredientRef.get();
        const ingredientData = ingredientDoc.data();
        return {
            id: ingredientDoc.id,
            name: ingredientData.name,
            label: ingredientData.label,
            description: ingredientData.description,
            rating: ingredientData.rating
        }
    }
    const getIngredients = async () => {
        return Promise.all(data.ingredients.map(ingredientRef => getIngredient(ingredientRef)))
    }
    const ingredientsList = await getIngredients();

    return {
        id: productDoc.id,
        name: data.name,
        barcodeFormat: data.format,
        barcode: data.format,
        price: data.price,
        label: data.label,
        dislikes: data.dislikes,
        likes: data.likes,
        ingredientsList,
        dateCreated: new Date(data.dateCreated._seconds * 1000).toUTCString(),
        packagingLoc: {
            lat: data.packagingLoc.latitude,
            lng: data.packagingLoc.longitude
        },
        manufacturingLoc: {
            lat: data.manufacturingLoc.latitude,
            lng: data.manufacturingLoc.longitude
        },
        ingredientsRating: data.ingredientsRating,
        packagingRating: data.packagingRating,
        transportWeight: data.transportWeight,
        overallRating: data.overallRating
    };
}

export default async function handleProduct(req, res) {
    const { id } = req.query;

    const product = await getProduct(id);

    console.log(product);

    res.status(200).json(product);
}