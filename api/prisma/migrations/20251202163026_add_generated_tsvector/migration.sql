-- Based on https://medium.com/@chauhananubhav16/bulletproof-full-text-search-fts-in-prisma-with-postgresql-tsvector-without-migration-drift-c421f63aaab3

-- AlterTable
ALTER TABLE "public"."Transcript" ADD COLUMN     "search_vector" tsvector;

-- CreateIndex
CREATE INDEX "Transcript_search_vector_idx" ON "public"."Transcript" USING GIN ("search_vector");


-- Trigger
CREATE OR REPLACE FUNCTION transcript_search_vector_fts_trigger() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := to_tsvector('simple', NEW.text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER portfolio_data_fts_update
BEFORE INSERT OR UPDATE ON "Transcript"
FOR EACH ROW
EXECUTE FUNCTION transcript_search_vector_fts_trigger();
