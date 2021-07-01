import React, { useState } from "react";
import nookies from "nookies";
import { useRouter } from 'next/router'
import { firebaseAdmin } from "../../../main/firebase/firebaseAdmin.js";
import axios from "axios";
import Layout from "../../components/layout/Layout.js";

import ProductForm from "../../components/productForm/ProductForm.js";
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

    const producers = await getProducers();
    const tags = await getTags();
    const packagings = await getPackagings();

    return { props: { producers, tags, packagings } };
};

function AddProduct({ producers, tags, packagings }) {
    const router = useRouter();

    const onProductSubmit = async (formData) => {
        const {
            producedAt,
            ...data
        } = formData;

        await axios.post("/api/products", {
            producedAt,
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
                producers={ producers }
                tags={tags}
                packagings={packagings}
                formData={{
                    name: null,
                    ingredients: [],
                    format: "",
                    code: null,
                    producedAt: {
                        latitude: null,
                        longitude: null
                    },
                    producer: null
                }}
            />
        </Layout>
    );
}

export default AddProduct;
