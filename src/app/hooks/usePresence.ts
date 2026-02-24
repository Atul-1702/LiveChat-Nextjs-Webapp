"use client";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function usePresence(currentUser: any) {
  const heartbeat = useMutation(api.users.heartBeat);
  const setOffline = useMutation(api.users.setOffline);

  useEffect(() => {
    if (!currentUser) return;

    heartbeat({ userId: currentUser._id });

    const interval = setInterval(() => {
      heartbeat({ userId: currentUser._id });
    }, 4000);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const handleUnload = () => {
      setOffline({ userId: currentUser._id });
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        heartbeat({ userId: currentUser._id });
      } else {
        setOffline({ userId: currentUser._id });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [currentUser]);
}
