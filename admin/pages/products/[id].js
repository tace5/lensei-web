import React, { useState } from "react";
import nookies from "nookies";
import { firebaseAdmin } from "../../../main/firebase/firebaseAdmin.js";
import { getProduct } from "shared/firebase/firestore/products.js";
import Layout from "../../components/layout/Layout.js";
import ProductForm from "../../components/productForm/ProductForm.js";
import axios from "axios";
import { useRouter } from "next/router.js";
import {getProducers} from "shared/firebase/firestore/producers.js";
import {getTags} from "shared/firebase/firestore/tags.js";
import {getPackagings} from "shared/firebase/firestore/packagings.js";

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
    const producers = await getProducers();
    const tags = await getTags();
    const packagings = await getPackagings();
    return { props: { product, producers, tags, packagings } };
}

export default function ViewProduct({ product, producers, tags, packagings }) {
    const router = useRouter();

    const onProductUpdate = async (formData) => {
        await axios.put("/api/products/" + product.id, formData)
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
                producers={producers}
                tags={tags}
                packagings={packagings}
            />
        </Layout>
    )
}