import Link from "next/link";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import Order from "../../components/Order/Order";
import Head from "next/head";
import { ArchiveIcon, PlusIcon, UsersIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function Dashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for admin session
    const adminSession = localStorage.getItem("adminSession");
    if (adminSession) {
      try {
        const sessionData = JSON.parse(adminSession);
        // Check if session is still valid
        if (new Date(sessionData.expires) > new Date()) {
          setSession(sessionData);
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
    setLoading(false);
  }, []);

  const handleLogout = () => {
    // Clear all admin session data
    localStorage.removeItem("adminSession");
    localStorage.removeItem("adminSessionId");
    
    // Force redirect to login page
    window.location.href = "/admin-login";
  };

  if (loading) {
    return (
      <div className="heightFixAdmin bg-gray-100 py-4 md:px-6">
        <div className="max-w-screen-xl mx-auto bg-white shadow rounded-md my-3">
          <div className="flex flex-col md:p-6 p-4 bg-white gap-4">
            <Skeleton height={32} />
            <Skeleton height={24} count={4} />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4">Redirecting to admin login...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>3 in 1 Hot Tandoori Chicken | Dashboard</title>
      </Head>
      <div className="heightFixAdmin bg-gray-100 py-4 md:px-6">
        <div className="max-w-screen-xl mx-auto bg-white shadow rounded-md my-3">
          <div className="flex flex-col md:p-6 p-4 bg-white gap-4">
            <div className="flex justify-between items-center border-b-2 border-gray-200 pb-3">
              <h1 className="sm:text-2xl text-xl font-semibold text-gray-700">
                Dashboard
              </h1>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
            <div className="flex gap-4 sm:gap-6 lg:gap-8 text-primary-light font-medium flex-wrap sm:text-base text-sm">
              <Link href="/admin/dishes">
                <div className="dashboard-link flex items-center gap-1">
                  <ArchiveIcon className="w-4" />
                  <span>Dishes</span>
                </div>
              </Link>
              {/* <Link href="/admin/users">
                <div className="dashboard-link flex items-center gap-1">
                  <UsersIcon className="w-4" />
                  <span>Users</span>
                </div>
              </Link> */}
              <Link href="/admin/add-dish">
                <div className="dashboard-link flex items-center gap-1">
                  <PlusIcon className="w-4" />
                  <span>Dish</span>
                </div>
              </Link>
              <Link href="/admin/add-category">
                <div className="dashboard-link flex items-center gap-1">
                  <PlusIcon className="w-4" />
                  <span>Category</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.admin = true;
export default Dashboard;
