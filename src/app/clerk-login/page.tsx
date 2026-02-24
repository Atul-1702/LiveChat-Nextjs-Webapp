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
    <div
      className="flex justify-center pt-16  h-[90vh]"
      style={{
        backgroundImage: "url('/images/quick-chat-app-background.jpg')",
        opacity: 0.8,
        backgroundPosition: "cover",
      }}
    >
      <SignIn fallbackRedirectUrl="/" />
    </div>
  );
}
