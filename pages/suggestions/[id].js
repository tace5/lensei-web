import nookies from "nookies";
import {firebaseAdmin} from "../../firebase/firebaseAdmin.js";
import {getSuggestion} from "../api/suggestions/[id].js";
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
    const suggestion = await getSuggestion(id);
    return { props: { user: { email: token.email }, suggestion } }
}

export default function ViewSuggestion({ user, suggestion }) {
    const { author } = suggestion;

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

    return (
        <Layout title={title} breadcrumbs={breadCrumbs}>
            
        </Layout>
    )
}