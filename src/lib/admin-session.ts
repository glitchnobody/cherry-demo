import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "ad-agent-admin-session";

export function createAdminSessionToken() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("Missing ADMIN_PASSWORD environment variable.");
  }

  return createHmac("sha256", password)
    .update("ad-agent-admin-session:v1")
    .digest("base64url");
}

export async function hasAdminAccess() {
  if (process.env.LOCAL_DEV === "true") return true;

  const actual = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!actual || !process.env.ADMIN_PASSWORD) return false;

  const expected = createAdminSessionToken();
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}
