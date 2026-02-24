import { DateFormatter } from "../utils/date-formatter";

function MessageBubble({ msg, userId }) {
  const isMe = msg.senderId === userId;

  const ticks = () => {
    if (msg.isSeen === true)
      return (
        <span
          style={{
            color: "var(--tick-read)",
            fontWeight: "bold",
            marginLeft: 4,
          }}
        >
          ✓✓
        </span>
      );
  };

  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} flex-1 flex-wrap`}
    >
      <div
        className="max-w-xs px-4 py-2 rounded-lg wrap-break-word"
        style={{
          background: isMe ? "var(--bubble-sent)" : "var(--bubble-received)",
          color: "var(--text-primary)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        {msg.text}

        <div
          className="text-w-s mt-1 flex justify-end gap-1"
          style={{ color: "var(--text-muted)" }}
        >
          {DateFormatter(msg.createdAt)} {msg.senderId == userId && ticks()}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
