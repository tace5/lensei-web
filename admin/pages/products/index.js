import React, {useEffect} from "react";
import { useState } from "react";
import nookies from "nookies";
import {firebaseAdmin} from "../../../main/firebase/firebaseAdmin.js";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { InputGroup, FormControl, Spinner } from "react-bootstrap";
import { getNextProductPage } from "shared/firebase/firestore/products.js";
import Layout from "../../components/layout/Layout.js";
import ProductListItem from "../../components/productListItem/ProductListItem.js";
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

    const searchInput = ctx.query.searchInput;
    if (searchInput) {
        const products = await getNextProductPage(10, null, "createdOn", searchInput);
        ctx.query = {};
        return { props: { products, initialSearchInput: searchInput } };
    } else {
        const products = await getNextProductPage(10, null, "createdOn");
        return { props: { products } };
    }
};

export default function ProductsList({ products, initialSearchInput }) {
    const [allProducts, setAllProducts] = useState(products);
    const [hasMoreProducts, setHasMoreProducts] = useState(products.length !== 0);
    const [searchInput, setSearchInput] = useState(initialSearchInput);

    const router = useRouter();

    const loadProducts = () => {
        const lastProduct = allProducts[allProducts.length - 1];

        const params = {
            productsPerPage: 10,
            lastDocId: lastProduct.id,
            orderBy: "createdOn",
            searchInput
        }

        axios.get("/api/products", { params })
            .then(res => {
                const nextProducts = res.data;

                if (nextProducts.length === 0) {
                    setHasMoreProducts(false);
                } else {
                    setAllProducts(allProducts.concat(nextProducts));
                }
            })
    }

    const onProductDelete = productId => {
        axios.delete("/api/products/" + productId)
            .then(() => {
                const newProductsList = allProducts.filter(prod => {
                    return prod.id !== productId
                })

                setAllProducts(newProductsList);
            })
    }

    const onProductView = productId => {
        router.push("/products/" + productId);
    }

    const handleSearch = e => {
        setSearchInput(e.target.value);

        const params = {
            productsPerPage: 10,
            orderBy: "createdOn",
            searchInput: e.target.value
        }

        axios.get("/api/products", { params })
            .then(res => {
                if (res.data.length === 0) {
                    setHasMoreProducts(false);
                }
                setAllProducts(res.data);
            })
    }

    const breadCrumbs = [
        {
            href: "/products",
            name: "Products "
        }
    ]

    return (
        <Layout title="Product List" breadcrumbs={breadCrumbs}>
            <InputGroup className="mb-3">
                <FormControl defaultValue={initialSearchInput} onChange={handleSearch} type="text" placeholder="Search" />
            </InputGroup>
            <InfiniteScroll
                className={allProducts.length !== 0 ? "border border-bottom" : ""}
                dataLength={allProducts.length}
                next={loadProducts}
                hasMore={hasMoreProducts}
                loader={<Spinner animation="border" />}
            >
                { allProducts.length === 0 ? <span>No matching products</span> : "" }
                { allProducts.map(product =>
                    <ProductListItem
                        key={product.id}
                        product={product}
                        onView={onProductView}
                        onDelete={onProductDelete}
                    />)
                }
            </InfiniteScroll>
        </Layout>
    )
}