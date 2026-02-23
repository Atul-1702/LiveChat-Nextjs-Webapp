function MessageBubble({ msg }) {
  const isMe = msg.sender === "me";

  const ticks = () => {
    if (!isMe) return null;
    if (msg.status === "sent")
      return <span style={{ color: "var(--tick-sent)" }}>✓</span>;
    if (msg.status === "delivered")
      return <span style={{ color: "var(--tick-delivered)" }}>✓✓</span>;
    if (msg.status === "read")
      return <span style={{ color: "var(--tick-read)" }}>✓✓</span>;
  };

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-xs px-4 py-2 rounded-lg"
        style={{
          background: isMe ? "var(--bubble-sent)" : "var(--bubble-received)",
          color: "var(--text-primary)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        {msg.text}

        <div
          className="text-xs mt-1 flex justify-end gap-1"
          style={{ color: "var(--text-muted)" }}
        >
          {msg.time} {ticks()}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
