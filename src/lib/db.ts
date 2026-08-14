import { neon } from "@neondatabase/serverless";

const DATABASE_REQUEST_TIMEOUT_MS = 5_000;

export function getDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Missing DATABASE_URL environment variable.");
  }

  return neon(connectionString, {
    fetchOptions: {
      signal: AbortSignal.timeout(DATABASE_REQUEST_TIMEOUT_MS),
    },
  });
}
