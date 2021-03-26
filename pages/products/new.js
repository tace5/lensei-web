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

    return { props: {} };
};

function AddProduct() {
    const router = useRouter();

    const onProductSubmit = async ({ name, price, ingredientsList, locations, barcodeFormat, barcode, transportWeight, companyRating, packagingRating, overallRating }) => {
        await axios.post("/api/products", {
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
            });
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
        <Layout title="New Product" breadcrumbs={breadCrumbs}>
            <ProductForm
                onSubmit={onProductSubmit}
                submitBtnText="Add Product"
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
        </Layout>
    );
}

export default AddProduct;
