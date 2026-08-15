import { getDatabase } from '@/lib/db';
import { normalizeAppExamples } from '@/lib/app-examples';
import { readLocalSettings } from '@/lib/local-settings';
import { GuestDesktop } from './guest-desktop';

export const dynamic = 'force-dynamic';

type DesktopSettingsRow = {
  app_name: string | null;
  app_examples: unknown;
};

export default async function Home() {
  let settings: DesktopSettingsRow | undefined;

  if (process.env.LOCAL_DEV === 'true') {
    const localSettings = await readLocalSettings();
    settings = {
      app_name: localSettings.appName,
      app_examples: localSettings.appExamples,
    };
  } else {
    try {
      const sql = getDatabase();
      const rows = (await sql`
        SELECT
          data->>'appName' AS app_name,
          data->'appExamples' AS app_examples
        FROM app_settings
        WHERE id = 'global'
      `) as DesktopSettingsRow[];

      settings = rows[0];
    } catch (error) {
      console.warn(
        'Neon is unavailable; loading default desktop settings.',
        error,
      );
    }
  }

  return (
    <GuestDesktop
      appName={settings?.app_name ?? 'ads agent'}
      appExamples={normalizeAppExamples(settings?.app_examples)}
    />
  );
}
