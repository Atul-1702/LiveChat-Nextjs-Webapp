"use client";
import { useUser } from "@clerk/nextjs";
import { UserModel } from "../models/models";
import MessageBubble from "./message-bubble";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useRef } from "react";

type ChatMessageAreaProp = {
  onBack: () => {};
  selectedUser: UserModel | undefined;
};

function ChatMessageArea({ onBack, selectedUser }: ChatMessageAreaProp) {
  const { user } = useUser();

  const getOrCreateConversation = useMutation(
    api.conversations.getOrCreateConversation,
  );

  const loggedInUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user ? user.id : "",
  });

  const sendMessage = useMutation(api.messages.sendMessage);

  const allMessages = useQuery(
    api.messages.getMessagesByUsers,
    loggedInUser && selectedUser
      ? {
          user1: loggedInUser._id,
          user2: selectedUser._id,
        }
      : "skip",
  );

  const messageSeen = useMutation(api.messages.markMessagesAsSeenByUsers);

  const setTyping = useMutation(api.users.setTyping);
  const clearTyping = useMutation(api.users.clearTyping);

  const otherUser = useQuery(
    api.users.getUserByClerkId,
    selectedUser ? { clerkId: selectedUser.clerkId } : "skip",
  );

  const messageRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<any>(null);
  const lastSeenMessageId = useRef<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleTyping = (conversationId?: string) => {
    if (!loggedInUser || !conversationId) return;

    setTyping({
      userId: loggedInUser._id,
      conversationId,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      clearTyping({ userId: loggedInUser._id });
    }, 1500);
  };

  useEffect(() => {
    if (!allMessages || !loggedInUser || !selectedUser) return;
    if (allMessages.length === 0) return;

    const lastMessage = allMessages[allMessages.length - 1];

    if (lastMessage.senderId === loggedInUser._id) return;
    if (lastSeenMessageId.current === lastMessage._id) return;

    lastSeenMessageId.current = lastMessage._id;

    messageSeen({
      user1: loggedInUser._id,
      user2: selectedUser._id,
    });
  }, [allMessages, loggedInUser?._id, selectedUser?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [selectedUser?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [allMessages]);

  async function onMessageSendButtonClicked() {
    if (selectedUser && loggedInUser && messageRef.current?.value) {
      const conversationId = await getOrCreateConversation({
        user1: loggedInUser._id,
        user2: selectedUser._id,
      });

      sendMessage({
        conversationId,
        senderId: loggedInUser._id,
        text: messageRef.current.value,
      });

      clearTyping({ userId: loggedInUser._id });

      messageRef.current.value = "";
    }
  }

  if (!selectedUser) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full text-center px-6"
        style={{ background: "var(--bg-chat)", color: "var(--text-secondary)" }}
      >
        <Image
          src="/images/chat-logo-1.png"
          width={160}
          height={60}
          alt="chat-logo"
          className="opacity-80 mb-6"
        />

        <h2
          className="text-2xl font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Select a chat to start messaging
        </h2>

        <p className="max-w-md text-sm leading-relaxed">
          Choose a conversation from the sidebar or search for a user to begin a
          new chat. Your messages will appear here.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--bg-chat)" }}
    >
      {/* HEADER */}
      <div
        className="flex items-center gap-3 p-3 border-b"
        style={{
          background: "var(--bg-header)",
          borderColor: "var(--border-default)",
        }}
      >
        <button className="md:hidden cursor-pointer" onClick={onBack}>
          <Image
            src="/images/arrow-back.png"
            width={20}
            height={16}
            alt="arrow-back"
          />
        </button>

        <img src={selectedUser.imageUrl} className="w-12 h-12 rounded-full" />

        <div className="flex flex-col">
          <div className="font-semibold">{selectedUser.name}</div>

          {otherUser &&
            allMessages.length > 0 &&
            otherUser?.typingInConversation ===
              allMessages?.[0]?.conversationId && (
              <div className="text-sm text-gray-500">
                {otherUser?.name} is Typing...
              </div>
            )}
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-scroll p-4 space-y-3"
      >
        {allMessages?.map((msg) => (
          <MessageBubble key={msg._id} msg={msg} userId={loggedInUser?._id} />
        ))}

        <div ref={bottomRef} />
      </div>

      <div
        className="p-3 flex gap-2 border-t"
        style={{
          background: "var(--bg-input)",
          borderColor: "var(--border-default)",
        }}
      >
        <input
          placeholder="Type a message"
          className="flex-1 px-4 py-2 rounded-full outline-none"
          ref={messageRef}
          style={{
            background: "var(--input-bg)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-input)",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") onMessageSendButtonClicked();
          }}
          onChange={() => handleTyping(allMessages?.[0]?.conversationId)}
          onBlur={() =>
            loggedInUser && clearTyping({ userId: loggedInUser._id })
          }
        />

        <button
          className="text-2xl cursor-pointer"
          onClick={onMessageSendButtonClicked}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default ChatMessageArea;
