import React from "react";
import { useState } from "react";
import nookies from "nookies";
import {firebaseAdmin} from "../firebase/firebaseAdmin.js";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, InputGroup, FormControl, Spinner } from "react-bootstrap";
import { getNextProductPage } from "./api/products";
import Layout from "../components/layout/Layout.js";
import {useRouter} from "next/router.js";

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

    const products = await getNextProductPage(10, 0, "dateCreated");

    return { props: { user: { email: token.email }, products } };
};

export default function Products({ user, products }) {
    const [allProducts, setAllProducts] = useState(products);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);

    const loadMoreProducts = () => {
        axios.post("/api/products", { productsPerPage: 10, startAt: allProducts.length, orderBy: "name" })
            .then(res => {
                const nextProducts = res.data;

                if (nextProducts.empty) {
                    setHasMoreProducts(false);
                } else {
                    setAllProducts(allProducts.concat(nextProducts));
                }
            })
    }

    return (
        <Layout title="Product List" user={user}>
            <InputGroup>
                <FormControl type="text" placeholder="Search" className="mr-4" />
                <Button>Search</Button>
            </InputGroup>
            <InfiniteScroll
                dataLength={allProducts.length}
                next={loadMoreProducts}
                hasMore={hasMoreProducts}
                loader={<Spinner animation="border" />}
            >
                { allProducts.map(product => <div>{ product.name }</div>) }
            </InfiniteScroll>
        </Layout>
    )
}