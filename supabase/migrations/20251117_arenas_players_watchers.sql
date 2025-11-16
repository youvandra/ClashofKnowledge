ALTER TABLE arenas ADD COLUMN IF NOT EXISTS player1_account_id text;
ALTER TABLE arenas ADD COLUMN IF NOT EXISTS player2_account_id text;
ALTER TABLE arenas ADD COLUMN IF NOT EXISTS watcher_account_ids text[] DEFAULT '{}'::text[];

UPDATE arenas SET player1_account_id = creator_account_id WHERE player1_account_id IS NULL AND creator_account_id IS NOT NULL;
UPDATE arenas SET player2_account_id = joiner_account_id WHERE player2_account_id IS NULL AND joiner_account_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS arenas_player1_idx ON arenas (player1_account_id);
CREATE INDEX IF NOT EXISTS arenas_player2_idx ON arenas (player2_account_id);
CREATE INDEX IF NOT EXISTS arenas_watchers_idx ON arenas USING GIN (watcher_account_ids);
