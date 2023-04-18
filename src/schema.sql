SET search_path TO admin;
CREATE TABLE IF NOT EXISTS node_types (
    type_name varchar(32) PRIMARY KEY,
    updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    sync_layer bigint
);

CREATE TABLE IF NOT EXISTS nodes (
    id varchar(21) PRIMARY KEY,
    node_type varchar(32) REFERENCES node_types(type_name),
    updated_at timestamp NULL,
    sync_layer bigint
);

CREATE TABLE IF NOT EXISTS node_property_keys (
    id varchar(21) PRIMARY KEY,
    node_id varchar(21) REFERENCES nodes(id) NOT NULL,
    property_key varchar(64),
    updated_at timestamp NULL,
    sync_layer bigint
);

CREATE INDEX IF NOT EXISTS idx_node_property_key_node_id_key ON node_property_keys (id);

CREATE TABLE IF NOT EXISTS node_property_values (
    id varchar(21) PRIMARY KEY,
    node_property_key_id varchar(21) REFERENCES node_property_keys(id) NOT NULL,
    property_value jsonb,
    updated_at timestamp NULL,
    sync_layer bigint
);

CREATE INDEX IF NOT EXISTS idx_node_property_value_key_id ON node_property_values (id);

CREATE TABLE IF NOT EXISTS relationship_types (
    type_name varchar(32) PRIMARY KEY,
    updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    sync_layer bigint
);

CREATE TABLE IF NOT EXISTS relationships (
    id varchar(21) PRIMARY KEY,
    relationship_type varchar(32) REFERENCES relationship_types(type_name),
    from_node_id varchar(21) REFERENCES nodes(id),
    to_node_id varchar(21) REFERENCES nodes(id),
    updated_at timestamp NULL,
    sync_layer bigint
);

CREATE INDEX IF NOT EXISTS idx_relationship_from_node_id ON relationships (id);

CREATE INDEX IF NOT EXISTS idx_relationship_to_node_id ON relationships (id);

CREATE TABLE IF NOT EXISTS relationship_property_keys (
    id varchar(21) PRIMARY KEY,
    relationship_id varchar(21) REFERENCES relationships(id) NOT NULL,
    property_key varchar(64),
    updated_at timestamp NULL,
    sync_layer bigint
);

CREATE INDEX IF NOT EXISTS idx_relationship_property_key_relationship_id ON relationship_property_keys (id);

CREATE TABLE IF NOT EXISTS relationship_property_values (
    id varchar(21) PRIMARY KEY,
    relationship_property_key_id varchar(21) REFERENCES relationship_property_keys(id) NOT NULL,
    property_value jsonb,
    updated_at timestamp NULL,
    sync_layer bigint
);

CREATE INDEX IF NOT EXISTS idx_relationship_property_value_key_id ON relationship_property_values (id);

INSERT INTO
    node_types (type_name)
VALUES
    ('word'),
    ('addition'),
    ('word-sequence'),
    ('sentence'),
    ('verse'),
    ('paragraph'),
    ('chapter'),
    ('section'),
    ('book'),
    ('bible'),
    ('definition'),
    ('article'),
    ('lexical-entry'),
    ('strongs-entry') ON CONFLICT DO NOTHING;

INSERT INTO
    relationship_types (type_name)
VALUES
    ('word-sequence-to-word'),
    ('verse-to-word-sequence'),
    ('sentence-to-word-sequence'),
    ('chapter-to-verse'),
    ('book-to-chapter'),
    ('chapter-to-section'),
    ('chapter-to-paragraph'),
    ('bible-to-book'),
    ('word-to-article'),
    ('word-to-strongs-entry'),
    ('word-to-addition'),
    ('section-to-paragraph'),
    ('section-to-section'),
    ('article-to-section'),
    ('article-to-paragraph'),
    ('article-to-sentence'),
    ('paragraph-to-sentence'),
    ('paragraph-to-verse'),
    ('verse-to-sentence'),
    ('sentence-to-word') ON CONFLICT DO NOTHING;