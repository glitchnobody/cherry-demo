import 'server-only';

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  DEFAULT_APP_EXAMPLES,
  normalizeAppExamples,
  type AppExamples,
} from '@/lib/app-examples';

export type LocalAppSettings = {
  appName: string;
  guestAccessEnabled: boolean;
  guestPassword: string;
  appExamples: AppExamples;
};

const localSettingsDirectory = join(process.cwd(), '.local');
const localSettingsPath = join(localSettingsDirectory, 'app-settings.json');

const defaultLocalSettings: LocalAppSettings = {
  appName: 'ads agent',
  guestAccessEnabled: false,
  guestPassword: '',
  appExamples: { ...DEFAULT_APP_EXAMPLES },
};

export async function readLocalSettings(): Promise<LocalAppSettings> {
  try {
    const stored = JSON.parse(
      await readFile(localSettingsPath, 'utf8'),
    ) as Partial<LocalAppSettings>;

    return {
      appName:
        typeof stored.appName === 'string' && stored.appName.trim()
          ? stored.appName.trim()
          : defaultLocalSettings.appName,
      guestAccessEnabled:
        typeof stored.guestAccessEnabled === 'boolean'
          ? stored.guestAccessEnabled
          : defaultLocalSettings.guestAccessEnabled,
      guestPassword:
        typeof stored.guestPassword === 'string'
          ? stored.guestPassword
          : defaultLocalSettings.guestPassword,
      appExamples: normalizeAppExamples(stored.appExamples),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn('Unable to read local app settings; using defaults.', error);
    }

    return {
      ...defaultLocalSettings,
      appExamples: { ...defaultLocalSettings.appExamples },
    };
  }
}

export async function writeLocalSettings(settings: LocalAppSettings) {
  await mkdir(localSettingsDirectory, { recursive: true });
  await writeFile(
    localSettingsPath,
    `${JSON.stringify(settings, null, 2)}\n`,
    'utf8',
  );
}
