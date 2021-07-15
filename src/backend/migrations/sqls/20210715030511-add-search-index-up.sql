CREATE EXTENSION IF NOT EXISTS  "pg_trgm";

CREATE INDEX acronym_trgm_idx ON "acronym" USING GIST(acronym gist_trgm_ops);
CREATE INDEX meaning_trgm_idx ON "acronym" USING GIST(meaning gist_trgm_ops);

CREATE INDEX acronym_idx ON "acronym" (acronym);
CREATE INDEX meaning_idx ON "acronym" (meaning);
