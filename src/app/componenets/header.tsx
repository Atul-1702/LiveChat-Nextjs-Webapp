"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClerkLoaded, useClerk, useUser } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <ClerkLoaded>
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

        {/* ===== RIGHT SIDE ===== */}

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
          // 🔹 AFTER LOGIN → Avatar + Dropdown
          <div className="relative" ref={dropdownRef}>
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              onClick={() => setOpen(!open)}
              className="w-12 h-12 rounded-full cursor-pointer border"
              style={{ borderColor: "var(--border-default)" }}
            />

            {/* ===== DROPDOWN ===== */}
            {open && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden"
                style={{
                  background: "var(--dropdown-bg)",
                  border: "1px solid var(--border-default)",
                }}
              >
                {/* Edit Profile */}
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                  onClick={() => alert("Edit Profile")}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--dropdown-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  👤 Edit Profile
                </button>

                {/* Logout */}
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                  onClick={() => {
                    signOut();
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--dropdown-hover)")
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
      </header>
    </ClerkLoaded>
  );
}
