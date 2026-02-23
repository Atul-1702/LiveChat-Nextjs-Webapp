"use client";

import DateSeparator from "./date-separator";
import MessageBubble from "./message-bubble";
import Image from "next/image";

const messages = [
  { id: 1, text: "Hello 👋", sender: "other", time: "10:01 AM", date: "Today" },
  {
    id: 2,
    text: "Hi! How are you?",
    sender: "me",
    time: "10:02 AM",
    date: "Today",
    status: "read",
  },
  {
    id: 3,
    text: "All good 👍",
    sender: "other",
    time: "10:05 AM",
    date: "Today",
  },
];

type ChatMessageAreaProp = {
  onBack: () => {};
};

function ChatMessageArea({ onBack }: ChatMessageAreaProp) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--bg-chat)" }}
    >
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
            alt={"arrow-back"}
          />
        </button>
        <img
          src="https://i.pravatar.cc/40"
          className="w-10 h-10 rounded-full"
        />
        <div className="font-semibold">Priti</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <DateSeparator label="Today" />
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
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
          style={{
            background: "var(--input-bg)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-input)",
          }}
        />
        <button className="text-2xl">➤</button>
      </div>
    </div>
  );
}

export default ChatMessageArea;
