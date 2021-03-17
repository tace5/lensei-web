import React, { useState } from "react";
import nookies from "nookies";
import { useRouter } from 'next/router'
import { firebaseAdmin } from "../firebase/firebaseAdmin";
import axios from "axios";
import Layout from "../components/layout/Layout.js";

import ProductForm from "../components/productForm/ProductForm.js";

export const getServerSideProps = async (ctx) => {
    try {
        const cookies = nookies.get(ctx);
        const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
        const { uid, email, admin } = token;

        if (!admin) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/",
                },
                props: {},
            };
        }

        return {
            props: { message: `Your email is ${email} and your UID is ${uid}.` },
        };
    } catch (err) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
            props: {},
        };
    }
};

function AddProduct() {
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
            .then(res => {
                if (res.status === 200) {
                    // TODO
                }
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
            href: "/addproduct",
            name: "New Product"
        }
    ]

    return (
        <Layout title="New Product" breadcrumbs={breadCrumbs}>
            <div>
                <ProductForm
                    onSubmit={onProductSubmit}
                    errors={newProductErrors}
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
