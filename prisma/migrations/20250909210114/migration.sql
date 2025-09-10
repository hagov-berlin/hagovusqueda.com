CREATE INDEX IF NOT EXISTS subtitle_text_fts_idx
ON "Subtitle"
USING GIN (to_tsvector('spanish', "text"));
