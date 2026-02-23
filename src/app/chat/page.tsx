"use client";
import { useUser } from "@clerk/nextjs";
import ChatMessageArea from "../componenets/chat-message-area";
import ChatSidebar from "../componenets/chat-sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ProfileModal from "../componenets/profile-modal";

function ChatPage() {
  const [showChat, setShowChat] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const dbUser = useQuery(
    api.users.getUserByClerkId,
    isLoaded && user ? { clerkId: user.id } : "skip",
  );

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/clerk-login");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!dbUser) {
      setOpenModal(false);
    } else {
      setOpenModal(true);
    }
    console.log(dbUser);
  }, [user, dbUser]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }
  return (
    <>
      {dbUser && !(dbUser.imageUrl && dbUser.name) && (
        <ProfileModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
          onSave={() => {}}
          initialName={dbUser?.name}
          initialImage={dbUser?.imageUrl}
        />
      )}
      <div className="flex md:h-[90vh] h-[85vh]">
        <div className={`${showChat ? "hidden md:block" : "block"}`}>
          <ChatSidebar onSelectChat={() => setShowChat(true)} />
        </div>
        <div className={`${showChat ? "block" : "hidden md:block"} flex-1`}>
          <ChatMessageArea onBack={() => setShowChat((prev) => !prev)} />
        </div>
      </div>
    </>
  );
}

export default ChatPage;
