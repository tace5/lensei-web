import React, {useState} from "react";
import nookies from "nookies";
import {firebaseAdmin} from "../../firebase/firebaseAdmin.js";
import {getProduct} from "../api/products/[id].js";
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

    const { id } = ctx.query;
    const product = await getProduct(id);
    return { props: { user: { email: token.email }, product } };
}

export default function ViewProduct({ user, product }) {
    const [updateProductErrors, setUpdateProductErrors] = useState({ name: null });

    const onProductUpdate = data => {

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
    ]

    console.log(product)

    return (
        <Layout title={product.label} user={user} breadcrumbs={breadCrumbs}>
            <ProductForm
                onSubmit={onProductUpdate}
                errors={updateProductErrors}
                type="update"
                formData={{
                    ingredients: product.ingredientsList,
                    ...product
                }}
            />
        </Layout>
    )
}