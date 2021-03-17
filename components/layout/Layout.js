import React from "react";
import Head from 'next/head';
import Navigation from "./Navigation.js";

import styles from "./Layout.module.css";
import { Breadcrumb, BreadcrumbItem} from "react-bootstrap";

export default function Layout({ title, children, breadcrumbs }) {
    return (
        <div>
            <Head>
                <title>Snapshop - { title }</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navigation />

            <div className={styles["content-wrapper"]}>
                { title ? <h2 className="mb-4">{ title }</h2> : ""}
                { breadcrumbs
                    ? <Breadcrumb className="mb-4">
                        { breadcrumbs.map((crumb, idx) => {
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