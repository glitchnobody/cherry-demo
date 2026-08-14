CREATE TABLE IF NOT EXISTS app_settings (
  id text PRIMARY KEY DEFAULT 'global' CHECK (id = 'global'),
  data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(data) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO app_settings (id, data)
VALUES (
  'global',
  jsonb_build_object(
    'appName', 'Cherry',
    'guestAccessEnabled', true,
    'guestPassword', '2@444@66666',
    'appExamples', jsonb_build_object(
      'terminal', true,
      'whatsapp', true,
      'discord', true,
      'miro', true,
      'ollama', true,
      'cursor', true,
      'scribble', true
    )
  )
)
ON CONFLICT (id) DO NOTHING;
