"use client";
import { ClerkLoading, useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/shared/index-X6_DF-iN";
import { useMutation } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  const createUser = useMutation(api.users.createUser);
  useEffect(() => {
    console.log("data");
    if (!isLoaded || !isSignedIn || !user) return;

    const data = createUser({
      clerkId: user.id,
      name: user.fullName ?? "",
      email: user.primaryEmailAddress?.emailAddress ?? "",
    });
  }, [isLoaded, isSignedIn, user, createUser]);
  return (
    <div className="relative">
      <Image
        src={"/images/quick-chat-app-background.jpg"}
        width={800}
        height={500}
        className="w-full h-[90vh] object-cover"
        alt="chat-app-background-image"
      />
      <Link href={"/chat"}>
        <button
          className="common-button w-45"
          style={{
            position: "absolute",
            left: "50%",
            top: "45%",
            transform: "translateX(-50%) translateY(-45%)",
            height: "56px",
          }}
        >
          <Image
            className="relative z-10"
            src={"/images/right-arrow-icon.svg"}
            width={24}
            height={24}
            alt="right-arrow-icon"
          />
          <span className="relative z-10">Start Chat</span>
        </button>
      </Link>
    </div>
  );
}
