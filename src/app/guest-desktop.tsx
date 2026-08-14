"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import type { AppExamples, AppExampleKey } from "@/lib/app-examples";
import { FIXED_DESKTOP_BACKGROUND_URL } from "@/lib/brand-assets";
import { AppWalkthrough } from "./app-walkthroughs";

const clockFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const dockApps = [
  { key: "terminal", name: "Terminal", icon: "/assets/terminal.png" },
  { key: "whatsapp", name: "WhatsApp", icon: "/assets/whatsapp.png" },
  { key: "discord", name: "Discord", icon: "/assets/discord.png" },
  { key: "miro", name: "Miro", icon: "/assets/miro.png" },
  { key: "ollama", name: "Ollama", icon: "/assets/ollama.png" },
  { key: "cursor", name: "Cursor", icon: "/assets/cursor.png" },
  { key: "scribble", name: "Scribble", icon: "/assets/scribble.png" },
] satisfies Array<{ key: AppExampleKey; name: string; icon: string }>;

type GuestDesktopProps = {
  appName: string;
  appExamples: AppExamples;
};

export function GuestDesktop({
  appName,
  appExamples,
}: GuestDesktopProps) {
  const [now, setNow] = useState(() => new Date());
  const [activeApp, setActiveApp] = useState<AppExampleKey | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main
      className="guest-desktop"
      style={{
        backgroundImage: `url(${FIXED_DESKTOP_BACKGROUND_URL})`,
      } as CSSProperties}
    >
      <div className="mobile-construction">
        <p>Mobile under construction</p>
      </div>

      <div className="desktop-shade" aria-hidden="true" />

      <header className="desktop-menu-bar">
        <div className="desktop-project">
          <span>Project {appName}</span>
        </div>
        <time dateTime={now.toISOString()} suppressHydrationWarning>
          {clockFormatter.format(now)}
        </time>
      </header>

      {activeApp && (
        <AppWalkthrough app={activeApp} appName={appName} onClose={() => setActiveApp(null)} />
      )}

      <div className="desktop-dock" aria-label="Applications">
        {dockApps.filter((app) => appExamples[app.key]).map((app) => (
          <button
            key={app.name}
            type="button"
            className="dock-app"
            aria-label={app.name}
            title={app.name}
            onClick={() => setActiveApp(app.key)}
          >
            <Image src={app.icon} alt="" width={56} height={56} />
          </button>
        ))}
      </div>
    </main>
  );
}
