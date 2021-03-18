import React, { useState } from "react";
import nookies from "nookies";
import { useRouter } from 'next/router'
import { firebaseAdmin } from "../../firebase/firebaseAdmin.js";
import axios from "axios";
import Layout from "../../components/layout/Layout.js";

import ProductForm from "../../components/productForm/ProductForm.js";

export const getServerSideProps = async (ctx) => {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token).catch(() => null);

    if (token === null || !token.admin) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
            props: {},
        };
    }

    return { props: { user: { email: token.email } } };
};

function AddProduct({ user }) {
    const [newProductErrors, setNewProductErrors] = useState({ name: null });

    const router = useRouter();

    const onProductSubmit = ({ name, price, ingredientsList, locations, barcodeFormat, barcode, transportWeight, companyRating, packagingRating, overallRating }) => {
        axios.post("/api/products/new", {
            name,
            price: parseFloat(price),
            barcodeFormat,
            barcode,
            ingredientsList,
            manufacturingLocation: locations.manufacturingLocation,
            packagingLocation: locations.packagingLocation,
            transportWeight: parseFloat(transportWeight),
            companyRating: parseInt(companyRating),
            packagingRating: parseInt(packagingRating),
            overallRating: parseInt(overallRating)
        })
            .then(() => {
                router.push("/products")
            })
            .catch(errors => {
                setNewProductErrors(errors.response.data);
            })
    }

    const breadCrumbs = [
        {
            href: "/products",
            name: "Products"
        },
        {
            href: "/products/new",
            name: "New Product"
        }
    ]

    return (
        <Layout title="New Product" breadcrumbs={breadCrumbs} user={user}>
            <div>
                <ProductForm
                    onSubmit={onProductSubmit}
                    errors={newProductErrors}
                    type="add"
                    formData={{
                        name: null,
                        price: null,
                        ingredients: [],
                        barcodeFormat: "",
                        barcode: null,
                        manufacturingLocation: null,
                        packagingLocation: null,
                        transportWeight: 5,
                        companyRating: 5,
                        packagingRating: 5,
                        overallRating: 5
                    }}
                />
            </div>
        </Layout>
    );
}

export default AddProduct;
