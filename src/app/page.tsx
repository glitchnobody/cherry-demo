import { getDatabase } from "@/lib/db";
import { normalizeAppExamples } from "@/lib/app-examples";
import { GuestDesktop } from "./guest-desktop";

export const dynamic = "force-dynamic";

type DesktopSettingsRow = {
  app_name: string | null;
  app_examples: unknown;
};

export default async function Home() {
  const sql = getDatabase();
  const rows = await sql`
    SELECT
      data->>'appName' AS app_name,
      data->'appExamples' AS app_examples
    FROM app_settings
    WHERE id = 'global'
  ` as DesktopSettingsRow[];
  const settings = rows[0];

  return (
    <GuestDesktop
      appName={settings?.app_name ?? "Cherry"}
      appExamples={normalizeAppExamples(settings?.app_examples)}
    />
  );
}
