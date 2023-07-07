-- schema.sql
-- can only be run after the bootstrap.sql file is run manually to setup the db

create schema IF NOT EXISTS $1;
SET search_path TO $1;

---------------------------------------------------------------------
---------------------------------------------------------------------
---------------------------------------------------------------------
-- GENERAL ----------------------------------------------------------
---------------------------------------------------------------------
---------------------------------------------------------------------
---------------------------------------------------------------------

-- -- VERSION CONTROL ---------------------------------------------------

create table database_version_control (
  id bigserial primary key,
  version bigint not null,
  completed timestamp default current_timestamp
);

---------------------------------------------------------------------
---------------------------------------------------------------------
---------------------------------------------------------------------
-- Tables for entities from common library 'MODELS'   ---------------
---------------------------------------------------------------------
---------------------------------------------------------------------
---------------------------------------------------------------------


CREATE TABLE "relationship_types" (
  "sync_layer" bigint NOT NULL DEFAULT (0), 
  "type_name" varchar PRIMARY KEY NOT NULL, 
  "updated_at" timestamp);

CREATE TABLE "node_types" (
  "sync_layer" bigint NOT NULL DEFAULT (0), 
  "type_name" varchar PRIMARY KEY NOT NULL, 
  "updated_at" timestamp);

CREATE TABLE "election_types" (
  "sync_layer" bigint NOT NULL DEFAULT (0), 
  "type_name" varchar PRIMARY KEY NOT NULL,
  "updated_at" timestamp
);

CREATE TABLE "files" (
  "file_id" bigserial PRIMARY KEY NOT NULL, 
  "file_name" varchar NOT NULL, 
  "file_size" bigint NOT NULL, 
  "file_type" varchar NOT NULL, 
  "file_url" varchar NOT NULL,
  "file_hash" varchar(255) NOT NULL
);

CREATE TABLE "users" (
  "user_id"  varchar(21) PRIMARY KEY NOT NULL,
  "kid" varchar NOT NULL,
  "username" varchar(255) NOT NULL, 
  "email" varchar(255) NOT NULL,
  "first_name" varchar NOT NULL, 
  "last_name" varchar NOT NULL,
  "avatar_url" varchar,
  "active" boolean NOT NULL DEFAULT (true),
  "is_email_verified" boolean NOT NULL DEFAULT (false),
  "created_at" timestamp NOT NULL,
  CONSTRAINT "UQ_users_username" UNIQUE ("username")
  CONSTRAINT "UQ_users_email" UNIQUE ("email")
);

CREATE TABLE "sync_sessions" (
  "sync_session" bigserial PRIMARY KEY NOT NULL, 
  "syncFrom" integer NOT NULL, 
  "syncTo" integer NOT NULL, 
  "createdAt" timestamp NOT NULL, 
  "completed" boolean NOT NULL, 
  "error" text
);

CREATE TABLE "nodes" (
  "sync_layer" bigint NOT NULL DEFAULT (0), 
  "node_id" varchar(21) PRIMARY KEY NOT NULL, 
  "node_type" varchar NOT NULL, 
  "updated_at" timestamp, 
  CONSTRAINT "FK_node_type__node_types" 
    FOREIGN KEY ("node_type") REFERENCES "node_types" ("type_name") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "node_property_keys" (
  "sync_layer" bigint NOT NULL DEFAULT (0), 
  "node_property_key_id" varchar(21) PRIMARY KEY NOT NULL, 
  "property_key" varchar NOT NULL, 
  "node_id" varchar NOT NULL, 
  "updated_at" timestamp, 
  CONSTRAINT "FK_node_id__nodes" 
    FOREIGN KEY ("node_id") REFERENCES "nodes" ("node_id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "node_property_values" (
  "sync_layer" bigint NOT NULL DEFAULT (0), 
  "node_property_value_id" varchar(21) PRIMARY KEY NOT NULL, 
  "property_value" varchar NOT NULL, 
  "node_property_key_id" varchar NOT NULL, 
  "updated_at" timestamp, 
  CONSTRAINT "REL_node_property_key_id" UNIQUE ("node_property_key_id"), 
  CONSTRAINT "FK_node_property_key_id__node_property_keys" 
    FOREIGN KEY ("node_property_key_id") REFERENCES "node_property_keys" ("node_property_key_id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "relationships" (
  "sync_layer" bigint NOT NULL DEFAULT (0), 
  "relationship_id" varchar(21) PRIMARY KEY NOT NULL, 
  "relationship_type" varchar NOT NULL, 
  "from_node_id" varchar NOT NULL, 
  "to_node_id" varchar NOT NULL, 
  "updated_at" timestamp, 
  CONSTRAINT "FK_relationship_type__relationship_types" 
    FOREIGN KEY ("relationship_type") REFERENCES "relationship_types" ("type_name") ON DELETE CASCADE ON UPDATE NO ACTION, 
  CONSTRAINT "FK_from_node_id__nodes" 
    FOREIGN KEY ("from_node_id") REFERENCES "nodes" ("node_id") ON DELETE CASCADE ON UPDATE NO ACTION, 
  CONSTRAINT "FK_to_node_id__nodes" 
    FOREIGN KEY ("to_node_id") REFERENCES "nodes" ("node_id") ON DELETE CASCADE ON UPDATE NO ACTION
);


CREATE TABLE "relationship_property_keys" (
  "sync_layer" bigint NOT NULL DEFAULT (0), 
  "relationship_property_key_id" varchar(21) PRIMARY KEY NOT NULL, 
  "property_key" varchar NOT NULL, "relationship_id" varchar NOT NULL, 
  "updated_at" timestamp, 
  CONSTRAINT "FK_relationship_id__relationships" 
    FOREIGN KEY ("relationship_id") REFERENCES "relationships" ("relationship_id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "relationship_property_values" (
  "sync_layer" bigint NOT NULL DEFAULT (0), 
  "relationship_property_value_id" varchar(21) PRIMARY KEY NOT NULL, 
  "property_value" varchar NOT NULL, 
  "relationship_property_key_id" varchar NOT NULL, 
  "updated_at" timestamp, 
  CONSTRAINT "REL_relationship_property_key_id" UNIQUE ("relationship_property_key_id"), 
  CONSTRAINT "FK_relationship_property_key_id__relationship_property_keys" 
    FOREIGN KEY ("relationship_property_key_id") REFERENCES "relationship_property_keys" ("relationship_property_key_id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "elections" (
  "sync_layer" bigint NOT NULL DEFAULT (0), 
  "election_id" varchar(21) PRIMARY KEY NOT NULL, 
  "election_type" varchar NOT NULL, 
  "election_ref" varchar NOT NULL,
  "ref_table_name" varchar NOT NULL, 
  "candidate_ref_table_name" varchar NOT NULL,
  "site_text" boolean, 
  "site_text_translation" boolean, 
  "app" varchar,
  "updated_at" timestamp,
  CONSTRAINT "FK_election_type__election_types" 
    FOREIGN KEY ("election_type") REFERENCES "election_types" ("type_name") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "candidates" (
  "sync_layer" bigint NOT NULL DEFAULT (0), 
  "candidate_id" varchar(21) PRIMARY KEY NOT NULL, 
  "election_id" varchar NOT NULL, 
  "candidate_ref" varchar NOT NULL, 
  "updated_at" timestamp,
  CONSTRAINT "FK_election_id__elections" 
    FOREIGN KEY ("election_id") REFERENCES "elections" ("election_id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "votes" (
  "sync_layer" bigint NOT NULL DEFAULT (0), 
  "vote_id" varchar(21) PRIMARY KEY NOT NULL, 
  "candidate_id" varchar NOT NULL, 
  "user_id" varchar NOT NULL, 
  "vote" boolean NOT NULL, 
  "updated_at" timestamp,
  CONSTRAINT "FK_candidate_id__candidates" 
    FOREIGN KEY ("candidate_id") REFERENCES "candidates" ("candidate_id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "discussions" (
  "discussion_id" varchar(21) PRIMARY KEY NOT NULL, 
  "table_name" varchar NOT NULL, 
  "row_id" varchar
);

create or replace function fn_discussion_created() 
	returns trigger as $discussion_created$
	begin
		perform pg_notify(
    		'discussion_created',
			json_build_object(
			    'operation', TG_OP,
			    'record', row_to_json(NEW)
    		)::text);
  		return NEW;
	end;
	$discussion_created$ language plpgsql;

drop trigger if exists discussion_created
  on discussions;
 
create trigger discussion_created
  after insert 
  on discussions
  for each row execute function fn_discussion_created();

CREATE TABLE "posts" (
  "post_id" varchar(21) PRIMARY KEY NOT NULL,
  "discussion_id" varchar(21) NOT NULL,
  "reply_id" varchar(21),
  "user_id" varchar(21) NOT NULL,
  "quill_text" varchar NOT NULL,
  "plain_text" varchar NOT NULL,
  "postgres_language" varchar NOT NULL DEFAULT ('simple'),
  "is_edited" boolean NOT NULL DEFAULT (false),
  "created_at" timestamp,
  CONSTRAINT "FK_discussion_id__discussions" FOREIGN KEY ("discussion_id") REFERENCES "discussions" ("discussion_id") ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT "FK_user_id__users" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE NO ACTION
);

create or replace function fn_post_changed() 
	returns trigger as $post_changed$
  declare
    row RECORD;
	begin
    IF (TG_OP = 'DELETE') THEN
      row = OLD;
    ELSE 
      row = NEW;
    END IF;
		
    perform pg_notify(
    		'post_changed',
			json_build_object(
			    'operation', TG_OP,
			    'record', row_to_json(row)
    		)::text);
  		return row;
	end;
	$post_changed$ language plpgsql;

drop trigger if exists post_changed
  on posts;
 
create trigger post_changed
  after insert or update or delete
  on posts
  for each row execute function fn_post_changed();

CREATE TABLE "reactions" (
  "reaction_id" varchar(21) PRIMARY KEY NOT NULL, 
  "post_id" varchar(21) NOT NULL,
  "user_id" varchar(21) NOT NULL,
  "content" varchar NOT NULL,
  CONSTRAINT "FK_user_id__users" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT "FK_post_id__posts" FOREIGN KEY ("post_id") REFERENCES "posts" ("post_id") ON DELETE CASCADE ON UPDATE NO ACTION
);

create or replace function fn_reaction_changed() 
	returns trigger as $reaction_changed$
	declare
    row RECORD;
	begin
    IF (TG_OP = 'DELETE') THEN
      row = OLD;
    ELSE 
      row = NEW;
    END IF;

		perform pg_notify(
    		'reaction_changed',
			json_build_object(
			    'operation', TG_OP,
			    'record', row_to_json(row)
    		)::text);
  		return row;
	end;
	$reaction_changed$ language plpgsql;

drop trigger if exists reaction_changed
  on reactions;
 
create trigger reaction_changed
  after insert or update or delete
  on reactions
  for each row execute function fn_reaction_changed();

CREATE TABLE "relationship_post_files" (
  "relationship_post_file_id" varchar(21) PRIMARY KEY NOT NULL, 
  "post_id" varchar(21) NOT NULL,
  "file_id" integer NOT NULL, 
  CONSTRAINT "REL_relationship_post_files_file_id" UNIQUE ("file_id"),
  CONSTRAINT "FK_post_id__posts" 
    FOREIGN KEY ("post_id") REFERENCES "posts" ("post_id") ON DELETE CASCADE ON UPDATE NO ACTION, 
  CONSTRAINT "FK_file_id__files" 
    FOREIGN KEY ("file_id") REFERENCES "files" ("file_id") ON DELETE CASCADE ON UPDATE NO ACTION
);
 
create or replace function fn_relationship_post_file_deleted() 
	returns trigger as $relationship_post_file_deleted$
	declare
    row RECORD;
	begin
    IF (TG_OP = 'DELETE') THEN
      row = OLD;
    ELSE 
      row = NEW;
    END IF;

		perform pg_notify(
    		'relationship_post_file_deleted',
			json_build_object(
			    'operation', TG_OP,
			    'record', row_to_json(row)
    		)::text);
  		return row;
	end;
	$relationship_post_file_deleted$ language plpgsql;

drop trigger if exists relationship_post_file_deleted
  on relationship_post_file;
 
create trigger relationship_post_file_deleted
  after delete
  on relationship_post_file
  for each row execute function fn_relationship_post_file_deleted();

create index idx_node_property_keys_node_id_key on node_property_keys (node_id);
create index idx_node_property_values_key_id on node_property_values (node_property_key_id);
create index idx_relationships_from_node_id on relationships (from_node_id);
create index idx_relationships_to_node_id on relationships (to_node_id);
create index idx_relationship_property_keys_relationship_id on relationship_property_keys (relationship_id);
create index idx_relationship_property_values_key_id on relationship_property_values (relationship_property_key_id);

insert into node_types (type_name, updated_at) values
('table', NOW()),
('table-column', NOW()),
('table-row', NOW()),
('table-cell', NOW()),
('table-cell-pseudo', NOW()),
('election', NOW()),
('entry', NOW()),
('lexicon', NOW()),
('lexical_category', NOW()),
('grammatical_category', NOW()),
('grammeme', NOW()),
('lexeme', NOW()),
('word_form', NOW()),
('document', NOW()),
('map', NOW()),
('word', NOW()),
('word-sequence', NOW()),
('language', NOW()),
('map-language', NOW()),
('user', NOW()),
('definition', NOW()),
('phrase', NOW());

insert into relationship_types (type_name, updated_at) values
('table-to-column', NOW()),
('table-to-row', NOW()),
('table-column-to-cell', NOW()),
('table-row-to-cell', NOW()),
('election-to-ballot-entry', NOW()),
('word-to-language-entry', NOW()),
('word-map', NOW()),
('word-to-translation', NOW()),
('word-sequence-to-word', NOW()),
('word-sequence-to-language-entry', NOW()),
('word-sequence-to-document', NOW()),
('word-sequence-to-creator', NOW()),
('word-sequence-to-word-sequence', NOW()),
('word-sequence-to-translation', NOW()),
('word-sequence-to-sub-word-sequence', NOW()),
('word-to-definition', NOW()),
('phrase-to-definition', NOW()),
('phrase-to-language-entry', NOW());
