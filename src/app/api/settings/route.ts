import { hasAdminAccess } from "@/lib/admin-session";
import {
  APP_EXAMPLE_KEYS,
  normalizeAppExamples,
  type AppExamples,
} from "@/lib/app-examples";
import { getDatabase } from "@/lib/db";

type SettingsRow = {
  app_name: string | null;
  guest_access_enabled: boolean;
  guest_password: string | null;
  app_examples: unknown;
};

function formatSettings(row: SettingsRow | undefined) {
  return {
    appName: row?.app_name ?? "Cherry",
    guestAccessEnabled: row?.guest_access_enabled ?? true,
    guestPassword: row?.guest_password ?? "",
    appExamples: normalizeAppExamples(row?.app_examples),
  };
}

export async function GET() {
  if (!(await hasAdminAccess())) {
    return Response.json({ error: "Admin access required." }, { status: 401 });
  }

  try {
    const sql = getDatabase();
    const rows = await sql`
      SELECT
        data->>'appName' AS app_name,
        COALESCE((data->>'guestAccessEnabled')::boolean, true) AS guest_access_enabled,
        data->>'guestPassword' AS guest_password,
        data->'appExamples' AS app_examples
      FROM app_settings
      WHERE id = 'global'
    ` as SettingsRow[];
    const row = rows[0];

    return Response.json(formatSettings(row));
  } catch (error) {
    console.error("Failed to read app settings.", error);
    return Response.json({ error: "Unable to load settings." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await hasAdminAccess())) {
    return Response.json({ error: "Admin access required." }, { status: 401 });
  }

  let body: {
    appName?: unknown;
    guestAccessEnabled?: unknown;
    guestPassword?: unknown;
    appExamples?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body.guestAccessEnabled !== "boolean") {
    return Response.json(
      { error: "guestAccessEnabled must be a boolean." },
      { status: 400 },
    );
  }

  const appName = typeof body.appName === "string" ? body.appName.trim() : "";

  if (appName.length < 1 || appName.length > 60) {
    return Response.json(
      { error: "App name must be between 1 and 60 characters." },
      { status: 400 },
    );
  }

  const guestPassword =
    typeof body.guestPassword === "string" ? body.guestPassword : "";

  if (guestPassword && (guestPassword.length < 4 || guestPassword.length > 128)) {
    return Response.json(
      { error: "Guest password must be between 4 and 128 characters." },
      { status: 400 },
    );
  }

  if (
    !body.appExamples ||
    typeof body.appExamples !== "object" ||
    Array.isArray(body.appExamples) ||
    APP_EXAMPLE_KEYS.some(
      (key) => typeof (body.appExamples as Record<string, unknown>)[key] !== "boolean",
    )
  ) {
    return Response.json({ error: "Invalid app example settings." }, { status: 400 });
  }

  const appExamples = normalizeAppExamples(body.appExamples) as AppExamples;

  try {
    const sql = getDatabase();
    if (body.guestAccessEnabled && !guestPassword) {
      return Response.json(
        { error: "Set a guest password before enabling guest protection." },
        { status: 400 },
      );
    }

    const settings = {
      appName,
      guestAccessEnabled: body.guestAccessEnabled,
      guestPassword,
      appExamples,
    };
    const serialized = JSON.stringify(settings);
    const rows = await sql`
      UPDATE app_settings
      SET data = ${serialized}::jsonb,
          updated_at = now()
      WHERE id = 'global'
      RETURNING
        data->>'appName' AS app_name,
        COALESCE((data->>'guestAccessEnabled')::boolean, true) AS guest_access_enabled,
        data->>'guestPassword' AS guest_password,
        data->'appExamples' AS app_examples
    ` as SettingsRow[];
    const row = rows[0];

    return Response.json(formatSettings(row));
  } catch (error) {
    console.error("Failed to update app settings.", error);
    return Response.json({ error: "Unable to save settings." }, { status: 500 });
  }
}
