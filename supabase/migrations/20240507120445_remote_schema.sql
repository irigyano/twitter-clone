
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."user_action" AS ENUM (
    'follow',
    'comment',
    'retweet',
    'like'
);

ALTER TYPE "public"."user_action" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."combined_query"() RETURNS "json"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    result JSON;
BEGIN
    -- Construct a JSON object with the results of both queries
    SELECT json_build_object(
        'posts', (select
  json_agg(p)
from
  posts as p
WHERE p."userId" IN (
    SELECT followee
    FROM follows
    WHERE follower = '6422395d-3a35-44f2-8fa6-939e59765786'
) or p."userId" = '6422395d-3a35-44f2-8fa6-939e59765786'),
        'retweets', (SELECT json_agg(retweets) FROM retweets)
    ) INTO result;
    
    RETURN result;
END;
$$;

ALTER FUNCTION "public"."combined_query"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_unfollow_by_user_id"("user_uuid" "uuid") RETURNS TABLE("id" "uuid", "avatar" "text", "name" "text", "tag" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id, u.avatar, u.name, u.tag
    FROM
        users AS u
    WHERE 
        u.id NOT IN (
            SELECT f.followee
            FROM follows AS f
            WHERE f.follower = user_uuid
        ) 
        AND u.id != user_uuid 
    ORDER BY RANDOM();
END;
$$;

ALTER FUNCTION "public"."get_unfollow_by_user_id"("user_uuid" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."insert auth to users"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into public.users (id, name, tag)
  values (new.id, 
  new.raw_user_meta_data ->> 'username', 
  new.raw_user_meta_data ->> 'tag');
  return new;
end;$$;

ALTER FUNCTION "public"."insert auth to users"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."word_frequencies"() RETURNS TABLE("word" "text", "ndoc" integer, "nentry" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM ts_stat(
        'SELECT to_tsvector(''simple_english'', content) AS document FROM posts'
    ) AS stats
    ORDER BY nentry DESC;
END;
$$;

ALTER FUNCTION "public"."word_frequencies"() OWNER TO "postgres";

CREATE TEXT SEARCH DICTIONARY "public"."simple_english" (
    TEMPLATE = "pg_catalog"."simple",
    stopwords = 'english' );

ALTER TEXT SEARCH DICTIONARY "public"."simple_english" OWNER TO "postgres";

CREATE TEXT SEARCH CONFIGURATION "public"."english_custom" (
    PARSER = "pg_catalog"."default" );

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "asciiword" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "word" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "numword" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "email" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "url" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "host" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "sfloat" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "version" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "hword_numpart" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "hword_part" WITH "english_stem";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "hword_asciipart" WITH "english_stem";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "numhword" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "asciihword" WITH "english_stem";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "hword" WITH "english_stem";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "url_path" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "file" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "float" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "int" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom"
    ADD MAPPING FOR "uint" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."english_custom" OWNER TO "postgres";

CREATE TEXT SEARCH CONFIGURATION "public"."simple_english" (
    PARSER = "pg_catalog"."default" );

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "asciiword" WITH "public"."simple_english";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "word" WITH "public"."simple_english";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "numword" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "email" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "url" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "host" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "sfloat" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "version" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "hword_numpart" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "hword_part" WITH "public"."simple_english";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "hword_asciipart" WITH "public"."simple_english";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "numhword" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "asciihword" WITH "public"."simple_english";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "hword" WITH "public"."simple_english";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "url_path" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "file" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "float" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "int" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english"
    ADD MAPPING FOR "uint" WITH "simple";

ALTER TEXT SEARCH CONFIGURATION "public"."simple_english" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "comment" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "userId" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "postId" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."comments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."follows" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "followee" "uuid" NOT NULL,
    "follower" "uuid" NOT NULL
);

ALTER TABLE "public"."follows" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "userId" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "postId" "uuid" NOT NULL
);

ALTER TABLE "public"."likes" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "action" "public"."user_action" NOT NULL,
    "actioner_id" "uuid" NOT NULL,
    "receiver_id" "uuid" NOT NULL,
    "is_read" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "follow_id" "uuid",
    "post_id" "uuid"
);

ALTER TABLE "public"."notifications" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."posts" (
    "content" "text",
    "imageSrc" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "userId" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."posts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."retweets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "post_id" "uuid" NOT NULL
);

ALTER TABLE "public"."retweets" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "avatar" "text",
    "name" "text" NOT NULL,
    "tag" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "bio" "text",
    "background_cover" "text",
    "is_vip" boolean DEFAULT false
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."retweets"
    ADD CONSTRAINT "retweets_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "relationship" ON "public"."follows" USING "btree" ("followee", "follower");

CREATE UNIQUE INDEX "userliked" ON "public"."likes" USING "btree" ("userId", "postId");

CREATE UNIQUE INDEX "users_tag_case_insensitive" ON "public"."users" USING "btree" ("lower"("tag") COLLATE "C" "text_pattern_ops");

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_actioner_id_fkey" FOREIGN KEY ("actioner_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_follow_id_fkey" FOREIGN KEY ("follow_id") REFERENCES "public"."follows"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "public_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "public_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "public_follows_followee_fkey" FOREIGN KEY ("followee") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "public_follows_follower_fkey" FOREIGN KEY ("follower") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "public_likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "public_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "public_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."retweets"
    ADD CONSTRAINT "retweets_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."retweets"
    ADD CONSTRAINT "retweets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE POLICY "allow authenticated user perform CRUD" ON "public"."posts" TO "authenticated" USING (true);

CREATE POLICY "auth user can crud their follow" ON "public"."follows" TO "authenticated" USING (("auth"."uid"() = "follower"));

ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crud comments" ON "public"."comments" TO "authenticated" USING (true);

CREATE POLICY "crud likes" ON "public"."likes" TO "authenticated" USING (true);

ALTER TABLE "public"."follows" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."likes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read users" ON "public"."users" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "user can manage their own data" ON "public"."users" TO "authenticated" USING (("auth"."uid"() = "id"));

CREATE POLICY "user can read follows" ON "public"."follows" FOR SELECT TO "authenticated" USING (true);

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."combined_query"() TO "anon";
GRANT ALL ON FUNCTION "public"."combined_query"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."combined_query"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_unfollow_by_user_id"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_unfollow_by_user_id"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_unfollow_by_user_id"("user_uuid" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."insert auth to users"() TO "anon";
GRANT ALL ON FUNCTION "public"."insert auth to users"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert auth to users"() TO "service_role";

GRANT ALL ON FUNCTION "public"."word_frequencies"() TO "anon";
GRANT ALL ON FUNCTION "public"."word_frequencies"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."word_frequencies"() TO "service_role";

GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";

GRANT ALL ON TABLE "public"."follows" TO "anon";
GRANT ALL ON TABLE "public"."follows" TO "authenticated";
GRANT ALL ON TABLE "public"."follows" TO "service_role";

GRANT ALL ON TABLE "public"."likes" TO "anon";
GRANT ALL ON TABLE "public"."likes" TO "authenticated";
GRANT ALL ON TABLE "public"."likes" TO "service_role";

GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";

GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";

GRANT ALL ON TABLE "public"."retweets" TO "anon";
GRANT ALL ON TABLE "public"."retweets" TO "authenticated";
GRANT ALL ON TABLE "public"."retweets" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
