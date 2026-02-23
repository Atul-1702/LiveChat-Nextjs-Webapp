"use client";
import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClerkLoginPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/"); // better than push
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="flex justify-center mt-16">
      <SignIn fallbackRedirectUrl="/" />
    </div>
  );
}
