export const APP_EXAMPLE_KEYS = [
  "terminal",
  "whatsapp",
  "discord",
  "miro",
  "chatgpt",
  "cursor",
  "scribble",
] as const;

export type AppExampleKey = (typeof APP_EXAMPLE_KEYS)[number];
export type AppExamples = Record<AppExampleKey, boolean>;

export const APP_EXAMPLE_LABELS: Record<AppExampleKey, string> = {
  terminal: "Terminal",
  whatsapp: "WhatsApp",
  discord: "Discord",
  miro: "Miro",
  chatgpt: "ChatGPT",
  cursor: "Cursor",
  scribble: "Scribble",
};

export const DEFAULT_APP_EXAMPLES: AppExamples = {
  terminal: true,
  whatsapp: true,
  discord: true,
  miro: true,
  chatgpt: true,
  cursor: true,
  scribble: true,
};

export function normalizeAppExamples(value: unknown): AppExamples {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...DEFAULT_APP_EXAMPLES };
  }

  const source = value as Record<string, unknown>;
  return Object.fromEntries(
    APP_EXAMPLE_KEYS.map((key) => [
      key,
      typeof source[key] === "boolean" ? source[key] : true,
    ]),
  ) as AppExamples;
}
