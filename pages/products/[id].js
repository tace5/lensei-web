import React, {useState} from "react";
import nookies from "nookies";
import {firebaseAdmin} from "../../firebase/firebaseAdmin.js";
import {getProduct} from "../api/products/[id].js";
import Layout from "../../components/layout/Layout.js";
import ProductForm from "../../components/productForm/ProductForm.js";
import { Row } from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbsDown, faThumbsUp} from "@fortawesome/free-solid-svg-icons";

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

    const header = (
        <h2 className="mb-4">
            <div>
                { product.label }
                <div style={{float: "right"}}>
                    <span className="font-weight-bold mr-3" style={{color: "green", fontSize: "24px"}}>{ product.likes }</span>
                    <FontAwesomeIcon
                        className="mr-4"
                        style={{color: "green"}}
                        size="1x"
                        icon={faThumbsUp}
                        flip="horizontal" />
                    <FontAwesomeIcon
                        style={{color: "red"}}
                        size="1x"
                        icon={faThumbsDown}
                    />
                    <span className="font-weight-bold ml-3" style={{color: "red", fontSize: "24px"}}>{ product.dislikes }</span>
                </div>
            </div>
        </h2>
    )

    return (
        <Layout title={product.label} header={header} user={user} breadcrumbs={breadCrumbs}>
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