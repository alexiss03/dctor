export function isNextRedirect(e: unknown): boolean {
  return !!(
    e &&
    typeof e === "object" &&
    "message" in e &&
    e.message === "NEXT_REDIRECT"
  );
}
