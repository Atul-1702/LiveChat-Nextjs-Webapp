export function getUserStatus(lastSeen: number) {
  const diff = Date.now() - lastSeen;

  if (diff < 4000) return true;
  return false;
}
