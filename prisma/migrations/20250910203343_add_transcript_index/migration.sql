CREATE INDEX IF NOT EXISTS youtubevideo_transcript_fts_idx
ON "YoutubeVideo"
USING GIN (to_tsvector('spanish', "transcript"));
