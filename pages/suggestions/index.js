import React, {useState} from "react";
import Layout from "../../components/layout/Layout.js";
import {Spinner} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import SuggestionsListItem from "../../components/suggestionsListItem/SuggestionsListItem.js";
import nookies from "nookies";
import { firebaseAdmin } from "../../firebase/firebaseAdmin.js";
import { getNextSuggestionsPage } from "../api/suggestions";
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

    const suggestions = await getNextSuggestionsPage(10, null);
    return { props: { suggestions } }
}

export default function SuggestionsList({ suggestions }) {
    const [allSuggestions, setAllSuggestions] = useState(suggestions);
    const [hasMoreSuggestions, setHasMoreSuggestions] = useState(suggestions.length !== 0);

    const router = useRouter();

    const loadSuggestions = () => {
        const lastSuggestion = allSuggestions[allSuggestions.length - 1];

        axios.post("/api/suggestions", { suggestionsPerPage: 10, lastDocId: lastSuggestion.id, orderBy: "dateCreated" })
            .then(res => {
                const nextSuggestions = res.data;

                if (nextSuggestions.length === 0) {
                    setHasMoreSuggestions(false);
                } else {
                    setAllSuggestions(allSuggestions.concat(nextSuggestions));
                }
            })
    }

    const onOpenClick = suggestionId => {
        router.push("/suggestions/" + suggestionId);
    }

    const breadCrumbs = [
        {
            href: "/suggestions",
            name: "Suggestions"
        }
    ]

    return (
        <Layout title="Product Suggestions" breadcrumbs={breadCrumbs}>
            <InfiniteScroll
                dataLength={allSuggestions.length}
                next={loadSuggestions}
                hasMore={hasMoreSuggestions}
                loader={<Spinner animation="border" />}
            >
                { allSuggestions.length === 0 ? <span>No suggestions in the database</span> : "" }
                { allSuggestions.map(suggestion =>
                    <SuggestionsListItem
                        key={suggestion.code}
                        suggestion={suggestion}
                        onViewClick={onOpenClick}
                    />)
                }
            </InfiniteScroll>
        </Layout>
    )
}