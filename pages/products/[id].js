import React from "react";
import nookies from "nookies";
import {firebaseAdmin} from "../../firebase/firebaseAdmin.js";
import {getProduct} from "../api/products/[id].js";
import Layout from "../../components/layout/Layout.js";

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

    return (
        <Layout title={product.label} user={user} breadcrumbs={breadCrumbs}>
            <div>{product.id}</div>
        </Layout>
    )
}