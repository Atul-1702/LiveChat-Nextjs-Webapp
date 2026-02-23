"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function NotFoundPage() {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (pathname.includes("factor-one")) {
      router.push("/");
    }
  }, [pathname]);
  return (
    <h1 className="font-bold text-3xl flex justify-center align-middle">
      Page not found.
    </h1>
  );
}

export default NotFoundPage;
