import React from "react";
import { useState } from "react";
import nookies from "nookies";
import {firebaseAdmin} from "../../firebase/firebaseAdmin.js";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { InputGroup, FormControl, Spinner } from "react-bootstrap";
import { getNextProductPage } from "../api/products";
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

    let products;
    if (ctx.query.searchInput) {
        products = await getNextProductPage(10, null, "dateCreated", ctx.query.searchInput);
        return { props: { products, initialSearchInput: ctx.query.searchInput } };
    } else {
        products = await getNextProductPage(10, null, "dateCreated");
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

        axios.post("/api/products", { productsPerPage: 10, lastDocId: lastProduct.id, orderBy: "dateCreated", searchInput })
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
        axios.post("/api/products/delete", { id: productId })
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
        axios.post("/api/products/search", { productsPerPage: 10, searchInput: e.target.value, orderBy: "dateCreated" })
            .then(res => {
                if (res.data.length === 0) {
                    setHasMoreProducts(false);
                } else {
                    setHasMoreProducts(true);
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
                <FormControl value={searchInput} onChange={handleSearch} type="text" placeholder="Search" />
            </InputGroup>
            <InfiniteScroll
                className={allProducts.length !== 0 ? "border-top border-left border-right" : ""}
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