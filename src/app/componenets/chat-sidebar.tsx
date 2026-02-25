"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { UserModel } from "../models/models";
import { DateFormatter } from "./../utils/date-formatter";
import { getUserStatus } from "../utils/user-status";
import { useTheme } from "next-themes";

type ChatSidebarProps = {
  onSelectChat: () => {};
  setSelectedUser: Dispatch<SetStateAction<UserModel | undefined>>;
};

function ChatSidebar({ onSelectChat, setSelectedUser }: ChatSidebarProps) {
  const [query, setQuery] = useState("");
  const allUsers: UserModel[] | undefined = useQuery(api.users.getAllUsers);
  const [filteredUser, setFilteredUser] = useState<UserModel[]>([]);
  const { user } = useUser();

  const getCurrentUser = useQuery(api.users.getUserByClerkId, {
    clerkId: (user && user.id) ?? "skip",
  });

  const getUserConversations = useQuery(
    api.conversations.getUserConversations,
    getCurrentUser ? { userId: getCurrentUser._id } : "skip",
  );

  const tickAllmessagesRead = useMutation(
    api.messages.markMessagesAsSeenByUsers,
  );

  const [selectedUserBackground, setSelectedUserBackground] = useState("");

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const filtered =
      query.trim() === ""
        ? []
        : allUsers?.filter((c: UserModel) => {
            if (user?.id != c.clerkId) {
              return c.name.toLowerCase().includes(query.toLowerCase());
            }
            return false;
          });
    if (filtered) setFilteredUser(filtered);
  }, [query]);

  async function onUserSelected(user: UserModel) {
    setSelectedUserBackground(user.clerkId);

    if (getUserConversations && getCurrentUser) {
      await tickAllmessagesRead({
        user2: user._id,
        user1: getCurrentUser._id,
      });
    }

    setSelectedUser(user);
  }

  return (
    <div
      className="w-screen md:w-90 flex-1 border-r flex flex-col"
      style={{
        backgroundColor: "var(--bg-sidebar)",
        color: "var(--text-primary)",
        borderColor: "var(--border-default)",
      }}
    >
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <h1 style={{ color: "var(--title)" }} className="text-xl font-semibold">
          Chats
        </h1>
      </div>

      <div className="p-3 relative">
        <input
          type="text"
          placeholder="Search or start a new chat"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-full outline-none"
          style={{
            background: "var(--bg-search)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-input)",
          }}
        />

        {query && (
          <div
            className="absolute left-0 right-0 mt-2 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50"
            style={{
              background: "var(--bg-sidebar)",
              border: "1px solid var(--border-default)",
            }}
          >
            {filteredUser.length > 0 ? (
              filteredUser.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer transition"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--bg-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                  onClick={() => {
                    setQuery("");
                    onUserSelected(c);
                    setFilteredUser([]);
                  }}
                >
                  <img src={c.imageUrl} className="w-10 h-10 rounded-full" />
                  <span className="font-medium">{c.name}</span>
                </div>
              ))
            ) : (
              <div
                className="px-4 py-3 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      {getUserConversations?.map((conv) => (
        <div
          key={conv.conversationId}
          className="flex items-center gap-3 px-4 py-3 cursor-pointer"
          style={
            selectedUserBackground === conv.otherUser?.clerkId
              ? {
                  backgroundColor:
                    resolvedTheme === "light" ? "whitesmoke" : "black",
                }
              : undefined
          }
          onClick={() => {
            onSelectChat();
            conv && onUserSelected(conv.otherUser as UserModel);
          }}
        >
          <img
            src={
              conv?.otherUser?.imageUrl
                ? conv.otherUser.imageUrl
                : "/images/avtaar.avif"
            }
            className="w-10 h-10 rounded-full"
          />

          <div className="flex-1">
            <div className="flex justify-between">
              <h2 className="font-medium">{conv?.otherUser?.name}</h2>

              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {DateFormatter(conv?.lastMessageTime)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <p
                className="text-sm truncate w-55"
                style={{
                  color:
                    conv?.otherUser?.typingInConversation ===
                    conv.conversationId
                      ? "blue" // 🔵 blue when typing
                      : "var(--text-secondary)",
                }}
              >
                {conv.otherUser &&
                conv.conversationId &&
                conv?.otherUser?.typingInConversation === conv.conversationId
                  ? conv?.otherUser?.name + " is Typing..."
                  : conv?.lastMessage?.text}
              </p>

              {conv.unreadCount > 0 && (
                <span className="font-bold w-6 h-6 rounded-full bg-pink-700 text-white flex justify-center text-[13px] align-middle">
                  {conv.unreadCount}
                </span>
              )}

              {conv.otherUser && getUserStatus(conv.otherUser.lastSeen) && (
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatSidebar;
