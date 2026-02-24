"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClerkLoaded, useClerk, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import ProfileModal from "./profile-modal";
import { usePresence } from "../hooks/usePresence";
import { useTheme } from "next-themes";

export default function Header() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getUserByClerkId = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : "skip",
  );
  const dropdownRef = useRef(null);

  usePresence(getUserByClerkId);
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  const { resolvedTheme, setTheme } = useTheme();

  function toggleTheme() {
    if (resolvedTheme == "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  return (
    <div>
      <header
        className="h-18 px-6 flex items-center justify-between border-b relative z-1"
        style={{
          background: "var(--bg-header-main)",
          color: "var(--header-text)",
          borderColor: "var(--border-default)",
        }}
      >
        <div className="flex items-center gap-3 font-semibold text-lg">
          <Link href={"/"}>
            <Image
              src="/images/chat-logo-1.png"
              width={120}
              height={"35"}
              alt="chat-logo"
            />
          </Link>
        </div>
        <div className="flex gap-5 align-middle">
          {!isSignedIn ? (
            <Link href={"/clerk-login"}>
              <button className="common-button w-27">
                <Image
                  className="relative z-10"
                  src={"/images/login-header-icon.svg"}
                  width={24}
                  height={24}
                  alt="right-arrow-icon"
                />
                <span className="relative z-10">Login</span>
              </button>
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <img
                src={
                  getUserByClerkId
                    ? getUserByClerkId.imageUrl
                      ? getUserByClerkId.imageUrl
                      : "/images/avtaar.avif"
                    : "/images/avtaar.avif"
                }
                alt="avatar"
                onClick={() => setOpen(!open)}
                className="w-12 h-12 rounded-full cursor-pointer border"
                style={{ borderColor: "var(--border-default)" }}
              />

              {open && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden"
                  style={{
                    background: "var(--dropdown-bg)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <p className="w-full flex items-center gap-3 px-6 py-3 pb-1 font-semibold text-[17px]">
                    Hi, {getUserByClerkId?.name}
                  </p>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    onClick={() => {
                      setIsModalOpen(true);
                      setOpen(false);
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "var(--dropdown-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    👤 Edit Profile
                  </button>

                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    onClick={() => {
                      signOut();
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "var(--dropdown-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="mr-4 flex items-center justify-center w-12 h-12 rounded-full border shadow-sm transition hover:scale-105"
            style={{
              background: "var(--bg-search)", // visible on both themes
              borderColor: "var(--border-default)",
              color: "var(--text-primary)", // ensures icon visible
            }}
            title="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21.75 15.5A9 9 0 1 1 8.5 2.25 7 7 0 1 0 21.75 15.5z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-16v3m0 14v3m8-8h-3M7 12H4m12.95 6.95-2.12-2.12M9.17 9.17 7.05 7.05m0 9.9 2.12-2.12m7.78-7.78-2.12 2.12" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {getUserByClerkId && (
        <ProfileModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          initialName={getUserByClerkId?.name}
          initialImage={getUserByClerkId?.imageUrl}
        />
      )}
    </div>
  );
}
