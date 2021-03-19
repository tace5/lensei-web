import React, {useEffect, useState} from "react";
import nookies from "nookies";
import { firebaseAdmin } from "../../firebase/firebaseAdmin.js";
import { firebase } from "../../firebase/firebaseClient.js";
import {getSuggestion} from "../api/suggestions/[id].js";
import Layout from "../../components/layout/Layout.js";
import ImageGallery from "../../components/imageGallery/ImageGallery.js";

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
    return { props: { user: { email: token.email }, suggestion } }
}

export default function ViewSuggestion({ user, suggestion }) {
    const { author } = suggestion;

    const [suggestionImageUrls, setSuggestionImageUrls] = useState([]);
    const [fetchingImgs, setFetchingImgs] = useState(true);

    const title = author.fullName + ": " + suggestion.format + "-" + suggestion.code;
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

    useEffect(() => {
        const storageRef = firebase.storage().ref();

        const getImgRef = async path => {
            return await storageRef.child(path).getDownloadURL();
        }
        const getAllImgUrls = async () => {
            Promise.all(suggestion.photos.map(path => getImgRef(path)))
                .then(urls => {
                    setSuggestionImageUrls(urls);
                    setFetchingImgs(false);
                });
        }

        getAllImgUrls();
    }, [])

    return (
        <Layout title={title} breadcrumbs={breadCrumbs}>
            <ImageGallery imageUrls={suggestionImageUrls} />
        </Layout>
    )
}