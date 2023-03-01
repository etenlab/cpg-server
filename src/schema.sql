CREATE TABLE IF NOT EXISTS node_types (type_name varchar(32) PRIMARY KEY);

CREATE TABLE IF NOT EXISTS nodes (
    node_id bigserial PRIMARY KEY,
    uuid varchar(21),
    node_type varchar(32) REFERENCES node_types(type_name)
);

CREATE TABLE IF NOT EXISTS node_property_keys (
    node_property_key_id bigserial PRIMARY KEY,
    uuid varchar(21),
    node_id bigint REFERENCES nodes(node_id) NOT NULL,
    property_key varchar(64)
);

CREATE INDEX IF NOT EXISTS idx_node_property_keys_node_id_key ON node_property_keys (node_id);

CREATE TABLE IF NOT EXISTS node_property_values (
    node_property_value_id bigserial PRIMARY KEY,
    uuid varchar(21),
    node_property_key_id bigint REFERENCES node_property_keys(node_property_key_id) NOT NULL,
    property_value jsonb
);

CREATE INDEX IF NOT EXISTS idx_node_property_values_key_id ON node_property_values (node_property_key_id);

CREATE TABLE IF NOT EXISTS relationship_types (type_name varchar(32) PRIMARY KEY);

CREATE TABLE IF NOT EXISTS relationships (
    relationship_id bigserial PRIMARY KEY,
    uuid varchar(21),
    relationship_type varchar(32) REFERENCES relationship_types(type_name),
    from_node_id bigint REFERENCES nodes(node_id),
    to_node_id bigint REFERENCES nodes(node_id)
);

CREATE INDEX IF NOT EXISTS idx_relationships_from_node_id ON relationships (from_node_id);

CREATE INDEX IF NOT EXISTS idx_relationships_to_node_id ON relationships (to_node_id);

CREATE TABLE IF NOT EXISTS relationship_property_keys (
    relationship_property_key_id bigserial PRIMARY KEY,
    uuid varchar(21),
    relationship_id bigint REFERENCES relationships(relationship_id) NOT NULL,
    property_key varchar(64)
);

CREATE INDEX IF NOT EXISTS idx_relationship_property_keys_relationship_id ON relationship_property_keys (relationship_id);

CREATE TABLE IF NOT EXISTS relationship_property_values (
    relationship_property_value_id bigserial PRIMARY KEY,
    uuid varchar(21),
    relationship_property_key_id bigint REFERENCES relationship_property_keys(relationship_property_key_id) NOT NULL,
    property_value jsonb
);

CREATE INDEX IF NOT EXISTS idx_relationship_property_values_key_id ON relationship_property_values (relationship_property_key_id);

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