import React from "react";
import { useState } from "react";
import nookies from "nookies";
import {firebaseAdmin} from "../firebase/firebaseAdmin.js";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { InputGroup, FormControl, Spinner } from "react-bootstrap";
import { getNextProductPage } from "./api/products";
import Layout from "../components/layout/Layout.js";
import {useRouter} from "next/router.js";
import ProductListItem from "../components/productListItem/ProductListItem.js";

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

    const products = await getNextProductPage(10, null, "dateCreated");

    return { props: { user: { email: token.email }, products } };
};

export default function Products({ user, products }) {
    const [allProducts, setAllProducts] = useState(products);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const router = useRouter();

    const loadMoreProducts = () => {
        const lastProduct = allProducts[allProducts.length - 1];

        axios.post("/api/products", { productsPerPage: 20, lastDocId: lastProduct.id, orderBy: "dateCreated" })
            .then(res => {
                const nextProducts = res.data;

                if (nextProducts.length === 0) {
                    setHasMoreProducts(false);
                } else {
                    setAllProducts(allProducts.concat(nextProducts));
                }
            })
    }

    const onProductRemove = productId => {
        // TODO
    }

    const onProductEdit = productId => {
        // TODO
    }

    return (
        <Layout title="Product List" user={user}>
            <InputGroup className="mb-3">
                <FormControl type="text" placeholder="Search" />
            </InputGroup>
            <InfiniteScroll
                className="border"
                dataLength={allProducts.length}
                next={loadMoreProducts}
                hasMore={hasMoreProducts}
                loader={<Spinner animation="border" />}
            >
                { allProducts.map(product =>
                    <ProductListItem
                        key={product.id}
                        product={product}
                        onEdit={onProductEdit}
                        onRemove={onProductRemove}
                    >
                        { product.name }
                    </ProductListItem>)
                }
            </InfiniteScroll>
        </Layout>
    )
}