import React from "react";
import Head from 'next/head';
import Navigation from "./Navigation.js";

import styles from "./Layout.module.scss";
import { Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import { useAuth } from "shared/firebase/auth.js";

export default function Layout({ title, header, breadcrumbs, children }) {
    const { user } = useAuth();

    return (
        <div className="bg-secondary">
            <Head>
                <title>Lensei - { title }</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navigation user={user} />

            <div className={styles["content-wrapper"]}>
                { header ? header : (<h2 className="mb-4">{ title }</h2>) }
                { breadcrumbs
                    ? <Breadcrumb className="mb-4">
                        { breadcrumbs.map(crumb => {
                            return <BreadcrumbItem key={crumb.name} href={ crumb.href }>{ crumb.name }</BreadcrumbItem>
                        }) }
                    </Breadcrumb> : ""}
                <div>
                    { children }
                </div>
            </div>
        </div>
    )
}