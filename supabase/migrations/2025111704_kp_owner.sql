ALTER TABLE knowledge_packs ADD COLUMN IF NOT EXISTS owner_account_id text;
CREATE INDEX IF NOT EXISTS knowledge_packs_owner_idx ON knowledge_packs (owner_account_id);
