import React, { useEffect, useState } from "react";
import nookies from "nookies";
import { firebaseAdmin } from "../../../main/firebase/firebaseAdmin.js";
import { firebase } from "shared/firebase/firebaseClient.js";
import { getSuggestion } from "shared/firebase/firestore/suggestions.js";
import Layout from "../../components/layout/Layout.js";
import ImageGallery from "../../components/imageGallery/ImageGallery.js";
import ProductForm from "../../components/productForm/ProductForm.js";
import { useRouter } from "next/router.js";
import axios from "axios";
import { Button } from "react-bootstrap";
import {getTags} from "shared/firebase/firestore/tags.js";
import {getProducers} from "shared/firebase/firestore/producers.js";
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
    const suggestion = await getSuggestion(id);
    const tags = await getTags();
    const producers = await getProducers();
    const packagings = await getPackagings();
    return { props: { suggestion, tags, producers, packagings } }
}

export default function ViewSuggestion({ suggestion, tags, producers, packagings }) {
    const { author } = suggestion;

    const [suggestionImageUrls, setSuggestionImageUrls] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const storageRef = firebase.storage().ref();

        const getImgRef = async path =>
            await storageRef.child(path).getDownloadURL();

        const getAllImgUrls = async () => {
            Promise.all(suggestion.photos.map(path => getImgRef(path)))
                .then(urls => setSuggestionImageUrls(urls));
        }

        getAllImgUrls();
    }, [])

    const onSuggestionApprove = async data => {
        await axios.post("/api/products", data)
            .then(() => axios.delete("/api/suggestions/" + suggestion.id))
            .then(() => {
                router.push("/suggestions");
            });
    }

    const onSuggestionReject = () => {
        axios.delete("/api/suggestions/" + suggestion.id)
            .then(() => {
                router.push("/suggestions");
            })
    }

    const title = suggestion.format + "-" + suggestion.code;
    const breadCrumbs = [
        {
            href: "/suggestions",
            name: "Suggestions"
        },
        {
            href: "/suggestions" + suggestion.id,
            name: "View Suggestion"
        }
    ]

    const header = (
        <h3 className="mb-4">
            <div>
                { title }
                <div style={{float: "right"}}>
                    <Button onClick={onSuggestionReject} variant="danger" size="lg">REJECT</Button>
                </div>
            </div>
        </h3>
    )

    return (
        <Layout title={title} breadcrumbs={breadCrumbs} header={header}>
            <div className="mb-4">
                <ImageGallery imageUrls={suggestionImageUrls} />
            </div>
            <ProductForm
                onSubmit={onSuggestionApprove}
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
    )
}