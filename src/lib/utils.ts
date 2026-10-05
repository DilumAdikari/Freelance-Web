export function isUserOnline(lastActiveAt?: string | Date): boolean {
  if (!lastActiveAt) return false;
  const lastActive = new Date(lastActiveAt).getTime();
  const now = new Date().getTime();
  const diffInMinutes = (now - lastActive) / (1000 * 60);

  return diffInMinutes <= 4;
}