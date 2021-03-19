import { database } from "../../../firebase/db.js";

export async function getProduct(id) {
    const productsRef = database.collection("products");
    const productDoc = await productsRef.doc(id).get();

    const data = productDoc.data();

    const ingredientsRef = database.collection("ingredients");
    const getIngredient = async ingredientId => {
        const ingredientDoc = await ingredientsRef.doc(ingredientId).get();
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
        name: data.label,
        barcodeFormat: data.format,
        barcode: data.code,
        price: data.price,
        label: data.label,
        dislikes: data.dislikes,
        likes: data.likes,
        ingredientsList,
        dateCreated: new Date(data.dateCreated._seconds * 1000).toUTCString(),
        packagingLocation: {
            lat: data.packagingLoc.latitude,
            lng: data.packagingLoc.longitude
        },
        manufacturingLocation: {
            lat: data.manufacturingLoc.latitude,
            lng: data.manufacturingLoc.longitude
        },
        ingredientsRating: data.ingredientsRating,
        packagingRating: data.packagingRating,
        transportWeight: data.transportWeight,
        overallRating: data.overallRating,
        companyRating: data.companyRating
    };
}

export default function handleProduct(req, res) {
    const { id } = req.query;

    getProduct(id).then(product => res.status(200).json(product));
}