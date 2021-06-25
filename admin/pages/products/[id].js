import React, { useState } from "react";
import nookies from "nookies";
import { firebaseAdmin } from "../../../main/firebase/firebaseAdmin.js";
import { getProduct } from "../../../main/firebase/firestore/products.js";
import Layout from "../../components/layout/Layout.js";
import ProductForm from "../../components/productForm/ProductForm.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/router.js";

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

    const { id } = ctx.query;
    const product = await getProduct(id);
    return { props: { product } };
}

export default function ViewProduct({ product }) {
    const router = useRouter();

    const onProductUpdate = async (formData) => {
        const {
            price,
            locations,
            transportWeight,
            companyRating,
            packagingRating,
            overallRating,
            ...data
        } = formData;

        await axios.put("/api/products/" + product.id, {
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
            })
    }

    const breadCrumbs = [
        {
            href: "/products",
            name: "Products"
        },
        {
            href: "/products/" + product.id,
            name: "View Product"
        }
    ];

    const header = (
        <h2 className="mb-4">
            <div>
                { product.name }
                <div style={{float: "right"}}>
                    <span className="font-weight-bold me-3 color-good" style={{fontSize: "24px"}}>{ product.likes }</span>
                    <FontAwesomeIcon
                        className="me-4 color-good"
                        size="xs"
                        icon={faThumbsUp}
                        flip="horizontal" />
                    <FontAwesomeIcon
                        className="color-poor"
                        size="xs"
                        icon={faThumbsDown}
                    />
                    <span className="font-weight-bold ms-3 color-poor" style={{fontSize: "24px"}}>{ product.dislikes }</span>
                </div>
            </div>
        </h2>
    )

    return (
        <Layout title={product.name} header={header} breadcrumbs={breadCrumbs}>
            <ProductForm
                onSubmit={onProductUpdate}
                submitBtnText="SAVE PRODUCT"
                type="update"
                formData={{
                    ingredients: product.ingredientsList,
                    ...product
                }}
            />
        </Layout>
    )
}