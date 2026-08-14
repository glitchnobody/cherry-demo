import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
} from "@/lib/admin-session";
import { getDatabase } from "@/lib/db";

type AccessRole = "guest" | "admin";

function matchesPassword(submitted: string, expected: string) {
  const submittedBuffer = Buffer.from(submitted);
  const expectedBuffer = Buffer.from(expected);

  return (
    submittedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(submittedBuffer, expectedBuffer)
  );
}

export async function POST(request: Request) {
  let body: { password?: unknown; role?: unknown };

  try {
    body = await request.json();
  } catch {
    return Response.json({ valid: false }, { status: 400 });
  }

  const role: AccessRole = body.role === "admin" ? "admin" : "guest";
  const password = typeof body.password === "string" ? body.password : "";

  if (process.env.LOCAL_DEV === "true") {
    return Response.json({ valid: true });
  }

  let valid = false;

  if (role === "admin") {
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      console.error("Missing ADMIN_PASSWORD environment variable.");
      return Response.json({ valid: false }, { status: 500 });
    }

    valid = matchesPassword(password, expected);
  } else {
    try {
      const sql = getDatabase();
      const rows = await sql`
        SELECT
          COALESCE((data->>'guestAccessEnabled')::boolean, true) AS enabled,
          data->>'guestPassword' AS guest_password
        FROM app_settings
        WHERE id = 'global'
      ` as { enabled: boolean; guest_password: string | null }[];
      const settings = rows[0];

      valid = settings
        ? !settings.enabled ||
          Boolean(
            settings.guest_password &&
              matchesPassword(password, settings.guest_password),
          )
        : false;
    } catch (error) {
      console.error("Failed to validate guest access.", error);
      return Response.json({ valid: false }, { status: 500 });
    }
  }

  if (valid && role === "admin") {
    (await cookies()).set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return Response.json({ valid });
}
