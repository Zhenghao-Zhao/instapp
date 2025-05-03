/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="grow flex flex-col items-center justify-center">
      <p className="text-2xl">404</p>
      <p>Sorry, the page you are looking for isn't available</p>
      <Link href={"/"} className="p-2 bg-sky-500 rounded-md mt-2">
        Go back home
      </Link>
    </div>
  );
}
