-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";

-- CreateTable
CREATE TABLE "embeddings" (
    "id" BIGSERIAL NOT NULL,
    "content_title" TEXT,
    "content_url" TEXT,
    "content" TEXT,
    "content_tokens" BIGINT,
    "project_id" TEXT NOT NULL,
    "embedding" vector,
    "meta" TEXT,
    CONSTRAINT "embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "project_id" TEXT NOT NULL,
    "project_name" TEXT,
    "created_by" TEXT,
    "status" TEXT,
    "meta" TEXT,
    CONSTRAINT "projects_pkey" PRIMARY KEY ("id","project_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "meta" TEXT,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id","email")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "project_id" TEXT,
    "query" TEXT,
    "response" TEXT,
    "meta" TEXT,
    "session_id" TEXT,
    "rating" TEXT,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taskqueue" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT,
    "meta" TEXT,
    "project_id" TEXT,

    CONSTRAINT "taskqueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_project_id_key" ON "projects"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "taskqueue_project_id_key" ON "taskqueue"("project_id");

-- AddForeignKey
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "taskqueue" ADD CONSTRAINT "taskqueue_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

CREATE OR REPLACE FUNCTION public.embeddings_search(project_id text, query_embedding vector, similarity_threshold double precision, match_count integer)
 RETURNS TABLE(id bigint, content_title text, content_url text, content text, content_tokens bigint, similarity double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    embeddings.id,
    embeddings.content_title,
    embeddings.content_url,
    embeddings.content,
    embeddings.content_tokens,
    1-(embeddings.embedding <=> query_embedding) as similarity
  FROM
    embeddings
  WHERE
    embeddings.project_id = embeddings_search.project_id -- specify table name for project_id
    AND 1 - (embeddings.embedding <=> query_embedding) > similarity_threshold
  ORDER BY
    embeddings.embedding <=> query_embedding
  LIMIT
    match_count;
END;
$function$