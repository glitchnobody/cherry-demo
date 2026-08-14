"use client";

import { FormEvent, useEffect, useState } from "react";
import { EyeIcon } from "@phosphor-icons/react/dist/csr/Eye";
import { EyeSlashIcon } from "@phosphor-icons/react/dist/csr/EyeSlash";
import {
  APP_EXAMPLE_KEYS,
  APP_EXAMPLE_LABELS,
  type AppExamples,
  type AppExampleKey,
} from "@/lib/app-examples";

type Settings = {
  appName: string;
  guestAccessEnabled: boolean;
  guestPassword: string;
  appExamples: AppExamples;
};

export default function AdminPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [savedSettings, setSavedSettings] = useState<Settings | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/settings", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load settings.");
        return (await response.json()) as Settings;
      })
      .then((data) => {
        if (active) {
          setSettings(data);
          setSavedSettings(data);
        }
      })
      .catch(() => {
        if (active) setMessage("Unable to load settings.");
      });

    return () => {
      active = false;
    };
  }, []);

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings || saving) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const result = (await response.json()) as Settings & { error?: string };

      if (!response.ok) throw new Error(result.error || "Unable to save settings.");

      setSettings(result);
      setSavedSettings(result);
      setMessage("Settings saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  const appNameHasUnsavedChanges = Boolean(
    settings && savedSettings && settings.appName !== savedSettings.appName,
  );
  const guestHasUnsavedChanges = Boolean(
    settings &&
      savedSettings &&
      (settings.guestAccessEnabled !== savedSettings.guestAccessEnabled ||
        settings.guestPassword !== savedSettings.guestPassword),
  );
  const examplesHaveUnsavedChanges = Boolean(
    settings &&
      savedSettings &&
      APP_EXAMPLE_KEYS.some(
        (key) => settings.appExamples[key] !== savedSettings.appExamples[key],
      ),
  );
  const hasUnsavedChanges =
    appNameHasUnsavedChanges ||
    guestHasUnsavedChanges ||
    examplesHaveUnsavedChanges;

  function setExampleVisibility(key: AppExampleKey, visible: boolean) {
    setMessage("");
    setSettings((current) =>
      current
        ? {
            ...current,
            appExamples: { ...current.appExamples, [key]: visible },
          }
        : current,
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <p className="access-eyebrow">Ad Agent</p>
        <h1>Admin settings</h1>
        <p>Manage access for every non-admin route.</p>
      </header>

      <form className="settings-card" onSubmit={saveSettings}>
        <div className="setting-row">
          <div>
            <h2>
              App name
              {appNameHasUnsavedChanges && (
                <span className="unsaved-dot" title="Unsaved changes">
                  <span className="sr-only">Unsaved changes</span>
                </span>
              )}
            </h2>
            <p>Set the name displayed throughout the app.</p>
          </div>
        </div>

        <div className="setting-field setting-field-divider">
          <label htmlFor="app-name">App name</label>
          <input
            id="app-name"
            type="text"
            minLength={1}
            maxLength={60}
            value={settings?.appName ?? ""}
            onChange={(event) => {
              setMessage("");
              setSettings((current) =>
                current ? { ...current, appName: event.target.value } : current,
              );
            }}
            placeholder="App name"
            autoComplete="off"
          />
        </div>

        <div className="setting-row">
          <div>
            <h2>
              Guest password
              {guestHasUnsavedChanges && (
                <span className="unsaved-dot" title="Unsaved changes">
                  <span className="sr-only">Unsaved changes</span>
                </span>
              )}
            </h2>
            <p>Require visitors to enter the shared guest password.</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings?.guestAccessEnabled ?? false}
              disabled={!settings}
              onChange={(event) => {
                setMessage("");
                setSettings((current) =>
                  current
                    ? { ...current, guestAccessEnabled: event.target.checked }
                    : current,
                );
              }}
            />
            <span aria-hidden="true" />
            <span className="sr-only">Enable guest password</span>
          </label>
        </div>

        <div className="setting-field">
          <label htmlFor="guest-password">Guest password</label>
          <div className="password-input-wrap">
            <input
              id="guest-password"
              type={showPassword ? "text" : "password"}
              minLength={4}
              maxLength={128}
              value={settings?.guestPassword ?? ""}
              onChange={(event) => {
                setMessage("");
                setSettings((current) =>
                  current
                    ? { ...current, guestPassword: event.target.value }
                    : current,
                );
              }}
              placeholder="Minimum 4 characters"
              autoComplete="new-password"
            />
            <button
              className="password-visibility"
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide guest password" : "Show guest password"}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeSlashIcon size={18} weight="regular" aria-hidden="true" />
              ) : (
                <EyeIcon size={18} weight="regular" aria-hidden="true" />
              )}
            </button>
          </div>
          <p>The current password is stored with the rest of the app settings.</p>
        </div>

        <section className="examples-settings">
          <div className="setting-row examples-heading">
            <div>
              <h2>
                Show examples
                {examplesHaveUnsavedChanges && (
                  <span className="unsaved-dot" title="Unsaved changes">
                    <span className="sr-only">Unsaved changes</span>
                  </span>
                )}
              </h2>
              <p>Choose which app walkthroughs appear in the guest dock.</p>
            </div>
          </div>

          <div className="example-toggle-list">
            {APP_EXAMPLE_KEYS.map((key) => (
              <div className="example-toggle-row" key={key}>
                <div>
                  <strong>{APP_EXAMPLE_LABELS[key]}</strong>
                  <span>Show in guest dock</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings?.appExamples[key] ?? true}
                    disabled={!settings}
                    onChange={(event) =>
                      setExampleVisibility(key, event.target.checked)
                    }
                  />
                  <span aria-hidden="true" />
                  <span className="sr-only">
                    Show {APP_EXAMPLE_LABELS[key]} example
                  </span>
                </label>
              </div>
            ))}
          </div>
        </section>

        <div className="settings-footer">
          <p aria-live="polite">{message}</p>
          <button
            type="submit"
            disabled={!settings || !hasUnsavedChanges || saving}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </main>
  );
}
