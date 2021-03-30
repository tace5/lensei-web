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

    const onProductSubmit = async (formData) => {
        const {
            price,
            locations,
            transportWeight,
            companyRating,
            packagingRating,
            overallRating,
            ...data
        } = formData;

        await axios.post("/api/products", {
            price: parseFloat(price),
            manufacturingLoc: locations.manufacturingLoc,
            packagingLoc: locations.packagingLoc,
            transportWeight: parseFloat(transportWeight),
            companyRating: parseInt(companyRating),
            packagingRating: parseInt(packagingRating),
            overallRating: parseInt(overallRating),
            ...data
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
                submitBtnText="ADD PRODUCT"
                type="add"
                formData={{
                    name: null,
                    price: null,
                    ingredients: [],
                    barcodeFormat: "",
                    barcode: null,
                    manufacturingLoc: null,
                    packagingLoc: null,
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
