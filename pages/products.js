import React from "react";
import { useState } from "react";
import nookies from "nookies";
import {firebaseAdmin} from "../firebase/firebaseAdmin.js";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "react-bootstrap";

export const getServerSideProps = async (ctx) => {
    try {
        const currentUser = firebase.auth().currentUser;
        const token = await currentUser.getIdToken();
        const verifiedToken = await firebaseAdmin.auth().verifyIdToken(token);

        if (!verifiedToken.admin) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/",
                },
                props: {},
            };
        }

        const data = {
            productsPerPage: 20,
            startAt: 0,
            orderBy: "name"
        }
        const products = await axios.post("/api/products", data);

        return { props: { products} };
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

export default function Products({ products }) {
    const { allProducts, setAllProducts } = useState([]);
    const { hasMoreProducts, setHasMoreProducts } = useState(true);

    const loadMoreProducts = () => {
        axios.post("/api/products", { productsPerPage: 20, startAt: allProducts.length, orderBy: "name" })
            .then(res => {
                const nextProducts = res.data;

                if (nextProducts.empty) {
                    setHasMoreProducts(false);
                } else {
                    setAllProducts(allProducts.concat(nextProducts));
                }
            });
    }

    return (
        <div>
            <InfiniteScroll
                dataLength={allProducts.length}
                next={loadMoreProducts}
                hasMore={hasMoreProducts}
                loader={<Spinner animation="border" />}
            >
                { allProducts.map(product => <div>{ product.name }</div>) }
            </InfiniteScroll>
        </div>
    )
}