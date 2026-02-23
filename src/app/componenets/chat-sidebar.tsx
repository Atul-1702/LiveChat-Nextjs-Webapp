"use client";
import { useState } from "react";

const contacts = [
  { id: 1, name: "Priti", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: 2, name: "Papa Je", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: 3, name: "Ankit", avatar: "https://i.pravatar.cc/40?img=3" },
  { id: 4, name: "Kunal", avatar: "https://i.pravatar.cc/40?img=4" },
  {
    id: 5,
    name: "Reserve Bank of India",
    avatar: "https://i.pravatar.cc/40?img=5",
  },
];

type ChatSidebarProps = {
  onSelectChat: () => {};
};

function ChatSidebar({ onSelectChat }: ChatSidebarProps) {
  const [query, setQuery] = useState("");

  const filtered =
    query.trim() === ""
      ? []
      : contacts.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase()),
        );

  return (
    <div
      className="w-screen md:w-90 flex-1 border-r flex flex-col"
      style={{
        backgroundColor: "var(--bg-sidebar)",
        color: "var(--text-primary)",
        borderColor: "var(--border-default)",
      }}
    >
      {/* Header */}
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
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer transition"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--bg-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                  onClick={() => {
                    setQuery(c.name); // fill input
                    alert(`Open chat with ${c.name}`);
                  }}
                >
                  <img src={c.avatar} className="w-10 h-10 rounded-full" />

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

      {/* Example Chat Item */}
      <div className="flex items-center gap-3 px-4 py-3" onClick={onSelectChat}>
        <img
          src="https://i.pravatar.cc/40"
          className="w-10 h-10 rounded-full"
        />

        <div className="flex-1">
          <div className="flex justify-between">
            <h2 className="font-medium">Priti</h2>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              8:05 am
            </span>
          </div>

          <p
            className="text-sm truncate"
            style={{ color: "var(--text-secondary)" }}
          >
            Ticket 23rd April 2025.pdf
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatSidebar;
