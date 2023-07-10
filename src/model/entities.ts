/**
 * All entitites are exported from here for the next reasons:
 * - to make it easier to synchronize them across different repos
 * - to make it easier to generate entities from the database
 *
 * Use this command to pull new entities from the database:
 * npx typeorm-model-generator -h postgres -d eil -u postgres -x example -e postgres -o ./src/model
 */

import {
  ElectionType,
  Election,
  Candidate,
  Vote,
  NodeType,
  Node,
  NodePropertyKey,
  NodePropertyValue,
  RelationshipType,
  Relationship,
  RelationshipPropertyKey,
  RelationshipPropertyValue,
  File,
  Discussion,
  Post,
  Reaction,
  RelationshipPostFile,
  User,
} from '@eten-lab/models';

import { ResetTokens } from './entities/ResetTokens';

export const entities = [
  Discussion,
  Post,
  Reaction,
  Election,
  ElectionType,
  NodePropertyKey,
  NodePropertyValue,
  NodeType,
  Node,
  RelationshipPropertyKey,
  RelationshipPropertyValue,
  RelationshipType,
  Relationship,
  Candidate,
  Vote,
  User,
  ResetTokens,
  RelationshipPostFile,
  File,
];

export {
  Discussion,
  Reaction,
  Election,
  ElectionType,
  NodePropertyKey,
  NodePropertyValue,
  NodeType,
  Node,
  Post,
  RelationshipPropertyKey,
  RelationshipPropertyValue,
  RelationshipType,
  Relationship,
  Candidate,
  Vote,
  User,
  ResetTokens,
  RelationshipPostFile,
  File,
};

export default entities;
