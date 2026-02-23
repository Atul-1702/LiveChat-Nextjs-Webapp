type DateSeparatorProps = {
  label: "Today" | "Yesterday" | string;
};

function DateSeparator({ label }: DateSeparatorProps) {
  return (
    <div className="flex justify-center my-4">
      <div
        className="px-3 py-1 rounded-full text-xs"
        style={{ background: "var(--date-bg)", color: "var(--date-text)" }}
      >
        {label}
      </div>
    </div>
  );
}

export default DateSeparator;
