CREATE INDEX IF NOT EXISTS transcript_text_fts_idx
ON "Transcript"
USING GIN (to_tsvector('spanish', "text"));
