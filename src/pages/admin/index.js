import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";

function Admin() {
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const adminSession = localStorage.getItem("adminSession");
    if (adminSession) {
      try {
        const sessionData = JSON.parse(adminSession);
        if (new Date(sessionData.expires) > new Date()) {
          window.location.href = "/admin/dashboard";
        } else {
          localStorage.removeItem("adminSession");
          localStorage.removeItem("adminSessionId");
          window.location.href = "/admin-login";
        }
      } catch (err) {
        localStorage.removeItem("adminSession");
        localStorage.removeItem("adminSessionId");
        window.location.href = "/admin-login";
      }
    } else {
      window.location.href = "/admin-login";
    }
  }, []);

  return (
    <>
      <Head>
        <title>3 in 1 Tandoori Chicken | Admin Panel</title>
      </Head>
      <div className="heightFixAdmin px-6 flex items-center justify-center">
        <div className="max-w-screen-xs mx-auto lg:text-lg xs:text-base text-sm text-center font-medium text-primary-light">
          Welcome to Admin Panel
          <br />
          Wait while redirecting to Dashboard
        </div>
      </div>
    </>
  );
}

Admin.admin = true;
export default Admin;
