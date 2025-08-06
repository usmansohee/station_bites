import { useEffect, useState } from "react";
import StorageService from "../../util/StorageService";
import { store } from "../../app/store";
import { hydrate } from "../../slices/cartSlice";
import Footer from "../Footer/Footer";
import Head from "next/head";
import Header from "../Header/Header";
import { signIn, useSession } from "next-auth/client";
import Loader from "react-loader-spinner";
import HeaderMobile from "../Header/HeaderMobile";
import HeaderDashboard from "../Header/HeaderDashboard";
import { useRouter } from "next/router";

function Layout({ children, admin, auth }) {
    const [session, loading] = useSession();
    const [adminSession, setAdminSession] = useState(null);
    const [adminLoading, setAdminLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        store.subscribe(() => {
            StorageService.set("cart", JSON.stringify(store.getState().cart));
        });
        let cart = StorageService.get("cart");
        cart = cart ? JSON.parse(cart) : { items: [] };
        store.dispatch(hydrate(cart));
    }, []);

    useEffect(() => {
        if (admin) {
            // Check for admin session
            const storedSession = localStorage.getItem("adminSession");
            if (storedSession) {
                try {
                    const sessionData = JSON.parse(storedSession);
                    if (new Date(sessionData.expires) > new Date()) {
                        setAdminSession(sessionData);
                    } else {
                        localStorage.removeItem("adminSession");
                        localStorage.removeItem("adminSessionId");
                        router.push("/admin-login");
                    }
                } catch (err) {
                    localStorage.removeItem("adminSession");
                    localStorage.removeItem("adminSessionId");
                    router.push("/admin-login");
                }
            } else {
                router.push("/admin-login");
            }
            setAdminLoading(false);
        }
    }, [admin, router]);

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1.0,minimum-scale=1.0"
                />
                <title>3 in 1 Tandoori Chicken</title>
                <meta
                    name="description"
                    content="Authentic Tandoori Chicken restaurant - 3 in 1 Tandoori Chicken"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/img/favicons/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/img/favicons/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/img/favicons/favicon-16x16.png"
                />
                <link rel="manifest" href="/img/favicons/site.webmanifest" />
                <link
                    rel="mask-icon"
                    href="/img/favicons/safari-pinned-tab.svg"
                    color="#5bbad5"
                />
                <link rel="shortcut icon" href="/img/favicons/favicon.ico" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta
                    name="msapplication-config"
                    content="/img/favicons/browserconfig.xml"
                />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <div className="layout">
                {loading || (admin && adminLoading) ? (
                    <div className="fixed inset-0 flex items-center justify-center bg-white z-50 loader">
                        <Loader type="TailSpin" color="#ab3c2a" />
                    </div>
                ) : admin ? (
                    adminSession ? (
                        <>
                            <HeaderDashboard />
                            {children}
                            <Footer admin />
                        </>
                    ) : (
                        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                            <div className="text-center">
                                <Loader type="TailSpin" color="#ab3c2a" />
                                <p className="mt-4">Redirecting to admin login...</p>
                            </div>
                        </div>
                    )
                ) : auth ? (
                    session ? (
                        <>
                            <Header />
                            <HeaderMobile />
                            {children}
                            <Footer />
                        </>
                    ) : (
                        signIn()
                    )
                ) : (
                    <>
                        <Header />
                        <HeaderMobile />
                        {children}
                        <Footer />
                    </>
                )}
            </div>
        </>
    );
}

export default Layout;
