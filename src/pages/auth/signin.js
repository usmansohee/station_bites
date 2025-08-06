import { getProviders, signIn, getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";

export default function SignIn({ providers }) {
  const router = useRouter();
  const { callbackUrl } = router.query;

  useEffect(() => {
    // Check if already signed in
    getSession().then((session) => {
      if (session) {
        router.push(callbackUrl || "/");
      }
    });
  }, [router, callbackUrl]);

  return (
    <>
      <Head>
        <title>Sign In | 3 in 1 Tandoori Chicken</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <img
              src="/img/station-bite-logo.svg"
              alt="3 in 1 Tandoori Chicken"
              className="mx-auto h-16 w-auto mb-6"
            />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back!
            </h2>
            <p className="text-gray-600">
              Sign in to your account to continue ordering delicious tandoori chicken
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button
                  onClick={() => signIn(provider.id, { callbackUrl: callbackUrl || "/" })}
                  className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-500" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </span>
                  Continue with {provider.name}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              New to 3 in 1 Tandoori Chicken?{" "}
              <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                Create your account instantly with Google
              </span>
            </p>
          </div>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
              <span>🍗 Authentic Tandoori</span>
              <span>•</span>
              <span>🔥 Fresh & Hot</span>
              <span>•</span>
              <span>⚡ Quick Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}