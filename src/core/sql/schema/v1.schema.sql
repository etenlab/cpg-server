-- schema.sql
-- can only be run after the bootstrap.sql file is run manually to setup the db

create schema admin;
SET search_path TO admin;

---------------------------------------------------------------------
---------------------------------------------------------------------
---------------------------------------------------------------------
-- GENERAL ----------------------------------------------------------
---------------------------------------------------------------------
---------------------------------------------------------------------
---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION random_between(low INT ,high INT)
   RETURNS INT AS
$$
BEGIN
   RETURN floor(random()* (high-low + 1) + low);
END;
$$ language 'plpgsql' STRICT;

-- VERSION CONTROL ---------------------------------------------------

CREATE TABLE typeorm_metadata (
  "type" varchar(255) NOT NULL,
  "database" varchar(255) DEFAULT NULL,
  "schema" varchar(255) DEFAULT NULL,
  "table" varchar(255) DEFAULT NULL,
  "name" varchar(255) DEFAULT NULL,
  "value" text
);

-- reference table
create table database_version_control (
  id bigserial primary key,
  version bigint not null,
  completed timestamp default current_timestamp
);

-- AUTHENTICATION ---------------------------------------------------

create table admin.users_internal (
  user_id bigserial primary key,
  active bool not null default true,
  email varchar(255) unique not null,
  username varchar(255) unique not null,
  is_email_verified bool not null default false,
  password varchar(128) not null,
  created_at timestamp not null default current_timestamp
);

-- make room for manually created service accounts
alter sequence admin.users_internal_user_id_seq restart with 100; 

create table admin.avatars(
  user_id bigint not null references admin.users_internal(user_id),
  avatar varchar(64) unique not null,
  url varchar(128),
  created_at timestamp not null default current_timestamp,
  primary key (user_id, avatar)
);

create table admin.avatars_history(
  avatar_history_id bigserial primary key,
  user_id bigint not null references admin.users_internal(user_id),
  avatar varchar(64) not null,
  url varchar(128),
  created_at timestamp not null,
  changed_at timestamp not null default current_timestamp
);

create type admin.token_type as enum (
  'Confirm',
  'Deny'
);

create table admin.tokens (
  token_id bigserial primary key,
  user_id bigint references admin.users_internal(user_id),
  created_at timestamp not null default current_timestamp,
  token text
);

create index on admin.tokens(token);
create index on admin.tokens(user_id, token);

create table admin.email_tokens(
  token varchar(64) primary key,
  user_id bigint not null references admin.users_internal(user_id),
  type admin.token_type not null,
  created_at timestamp not null default current_timestamp
);

create table admin.reset_tokens(
  token varchar(250) primary key,
  user_id varchar(100) not null,
  created_at timestamp not null default current_timestamp
);

create table admin.websocket_sessions (
  websocket_session_id varchar(64) not null primary key,
  user_id bigint references admin.users_internal(user_id),
  created_at timestamp not null default current_timestamp,
  token text not null -- one to many
);

create index on admin.websocket_sessions (user_id);

create type admin.email_sent_type as enum (
  'Register',
  'PasswordReset'
);

create type admin.email_response_type as enum (
  'Bounce',
  'Complaint',
  'Delivery'
);

create table admin.emails_sent (
  email_sent_id bigserial primary key,
  email varchar(255) not null,
  message_id varchar(64) not null,
  type admin.email_sent_type not null,
  response admin.email_response_type,
  created_at timestamp not null default current_timestamp
);

create index on admin.emails_sent (message_id);

create table admin.emails_blocked (
  email varchar(255) primary key,
  created_at timestamp not null default current_timestamp
);

-- Organizations, Roles, Authorization -----------------------------------------------

create table admin.site_admins(
  id bigserial primary key,
  name varchar(64) not null unique
);

create table admin.organizations (
  id bigserial primary key,
  name varchar(128) not null unique
);

create table admin.roles (
  id bigserial primary key,
  organization bigint not null references admin.organizations(id),
  name varchar(64) not null,
  unique (organization, name)
);

-- language skill ---------------------------------------------------
create type admin.language_skill_enum as enum (
  '1',
  '2',
  '3',
  '4',
  '5'
);

create table admin.language_skills (
  id bigserial primary key,
  user_id varchar(512) not null, -- prolly will change, not sure how we will reference users yet
  language_table varchar(64) not null,
  language_id bigint not null,
  skill_level admin.language_skill_enum not null,
  unique (user_id, language_table, language_id)
);

-- site text ---------------------------------------------------
create table admin.app_list (
  id bigserial primary key,
  app_name varchar(128)
);

create table admin.site_text_keys (
  id bigserial primary key,
  app bigint not null references admin.app_list(id),
  language_table varchar(64) not null,
  language_id bigint not null,
  site_text_key varchar(512) not null,
  description varchar(512),
  unique (app, site_text_key)
);

-- site text translation ---------------------------------------------------
create table admin.site_text_translations(
  id bigserial primary key,
  site_text bigint not null references admin.site_text_keys(id),
  language_table varchar(64) not null,
  language_id bigint not null,
  user_id varchar(512) not null, -- prolly will change, not sure how we will reference users yet
  site_text_translation varchar(512) not null,
  description_translation varchar(512) not null,
  unique (site_text, site_text_translation)
);

-- NOTIFICATIONS ----------------------------------------------------
create table admin.notifications (
  id bigserial primary key,
  user_id bigint not null references admin.users_internal(user_id),
  table_name varchar(64) not null,
  row bigint not null,
  acknowledged bool not null default false,
  content text,
  created_at timestamp default current_timestamp
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
  "type_name" varchar PRIMARY KEY NOT NULL
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
  "user_id" bigserial PRIMARY KEY NOT NULL, 
  "username" varchar(255) NOT NULL, 
  "first_name" varchar, 
  "last_name" varchar, 
CONSTRAINT "UQ_users_username" UNIQUE ("username")
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
  CONSTRAINT "FK_election_type__election_types" 
    FOREIGN KEY ("election_type") REFERENCES "election_types" ("type_name") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "candidates" (
  "sync_layer" bigint NOT NULL DEFAULT (0), 
  "candidate_id" varchar(21) PRIMARY KEY NOT NULL, 
  "election_id" varchar NOT NULL, 
  "candidate_ref" varchar NOT NULL, 
  CONSTRAINT "FK_election_id__elections" 
    FOREIGN KEY ("election_id") REFERENCES "elections" ("election_id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "votes" (
  "sync_layer" bigint NOT NULL DEFAULT (0), 
  "vote_id" varchar(21) PRIMARY KEY NOT NULL, 
  "candidate_id" varchar NOT NULL, 
  "user_id" varchar NOT NULL, 
  "vote" boolean NOT NULL, 
  CONSTRAINT "FK_candidate_id__candidates" 
    FOREIGN KEY ("candidate_id") REFERENCES "candidates" ("candidate_id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "discussions" (
  "discussion_id" varchar(21) PRIMARY KEY NOT NULL, 
  "table_name" varchar NOT NULL, 
  "row" varchar, 
  "app" integer NOT NULL DEFAULT (0), 
  "org" integer NOT NULL DEFAULT (0), 
  "sync_layer" bigint NOT NULL DEFAULT (0)
);

CREATE TABLE "posts" (
  "post_id" varchar(21) PRIMARY KEY NOT NULL,
  "discussion_id" varchar NOT NULL,
  "user_id" integer NOT NULL,
  "quill_text" varchar NOT NULL,
  "plain_text" varchar NOT NULL,
  "isEdited" boolean NOT NULL DEFAULT false,
  "replyId" bigint,
  "created_at" timestamp,
  "postgres_language" varchar NOT NULL,
  "reply_id" integer,
  "sync_layer" bigint NOT NULL DEFAULT (0),
  CONSTRAINT "FK_discussion_id__discussions" FOREIGN KEY ("discussion_id") REFERENCES "discussions" ("discussion_id") ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT "FK_user_id__users" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "reactions" (
  "reaction_id" bigserial PRIMARY KEY NOT NULL, 
  "post_id" varchar NOT NULL,
  "user_id" integer NOT NULL,
  "content" varchar NOT NULL,
  CONSTRAINT "FK_user_id__users" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT "FK_post_id__posts" FOREIGN KEY ("post_id") REFERENCES "posts" ("post_id") ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE "relationship_post_files" (
  "relationship_post_file_id" bigserial PRIMARY KEY NOT NULL, 
  "post_id" varchar NOT NULL,
  "file_id" integer NOT NULL, 
  CONSTRAINT "REL_relationship_post_files_file_id" UNIQUE ("file_id"),
  CONSTRAINT "FK_post_id__posts" 
    FOREIGN KEY ("post_id") REFERENCES "posts" ("post_id") ON DELETE CASCADE ON UPDATE NO ACTION, 
  CONSTRAINT "FK_file_id__files" 
    FOREIGN KEY ("file_id") REFERENCES "files" ("file_id") ON DELETE CASCADE ON UPDATE NO ACTION
);

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