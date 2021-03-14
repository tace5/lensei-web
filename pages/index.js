import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Snapshop - Admin</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <form>
                <label htmlFor="email">Email:</label>
                <input type="text" id="email" name="email" />
                <label htmlFor="password">Password:</label>
                <input type="text" id="password" name="password"/>
            </form>
        </div>
    )
}
