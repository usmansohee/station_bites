import Link from "next/link";
import { useRouter } from "next/router";

function Footer({ admin }) {
  const router = useRouter();

  return (
    <div className="bg-gray-800 py-4 px-6 text-gray-200 lg:text-base text-sm fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-screen-xl w-full mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center lg:space-x-8 space-x-4">
            <Link href="/">
              <span className="cursor-pointer hover:text-white">Home</span>
            </Link>
            <Link href="/about">
              <span className="cursor-pointer hover:text-white">About</span>
            </Link>
          </div>
          <div className="text-gray-400 text-xs">
            © 2025 Station Bites. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
