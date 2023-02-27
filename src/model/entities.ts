/**
 * All entitites are exported from here for the next reasons:
 * - to make it easier to synchronize them across different repos
 * - to make it easier to generate entities from the database
 *
 * Use this command to pull new entities from the database:
 * npx typeorm-model-generator -h postgres -d eil -u postgres -x example -e postgres -o ./src/model
 */

import { Discussions } from './entities/Discussions';
import { Reactions } from './entities/Reactions';
import { BallotEntries } from './entities/BallotEntries';
import { Elections } from './entities/Elections';
import { NodePropertyKey } from './entities/NodePropertyKeys';
import { NodePropertyValue } from './entities/NodePropertyValues';
import { NodeType } from './entities/NodeTypes';
import { Node } from './entities/Nodes';
import { Posts } from './entities/Posts';
import { RelationshipPropertyKey } from './entities/RelationshipPropertyKeys';
import { RelationshipPropertyValue } from './entities/RelationshipPropertyValues';
import { RelationshipType } from './entities/RelationshipTypes';
import { Relationship } from './entities/Relationships';
import { Votables } from './entities/Votables';
import { Votes } from './entities/Votes';
import { Users } from './entities/Users';
import { Avatars } from './entities/Avatars';
import { AvatarsHistory } from './entities/AvatarsHistory';
import { EmailTokens } from './entities/EmailTokens';
import { ResetTokens } from './entities/ResetTokens';
import { Tokens } from './entities/Tokens';
import { WebsocketSessions } from './entities/WebsocketSessions';
import { RelationshipPostFile } from './entities/RelationshipPostFile';
import { Files } from './entities/Files';

export const entities = [
  Discussions,
  Reactions,
  BallotEntries,
  Elections,
  NodePropertyKey,
  NodePropertyValue,
  NodeType,
  Node,
  Posts,
  RelationshipPropertyKey,
  RelationshipPropertyValue,
  RelationshipType,
  Relationship,
  Votables,
  Votes,
  Users,
  Avatars,
  AvatarsHistory,
  EmailTokens,
  ResetTokens,
  Tokens,
  WebsocketSessions,
  RelationshipPostFile,
  Files,
];

export {
  Discussions,
  Reactions,
  BallotEntries,
  Elections,
  NodePropertyKey,
  NodePropertyValue,
  NodeType,
  Node,
  Posts,
  RelationshipPropertyKey,
  RelationshipPropertyValue,
  RelationshipType,
  Relationship,
  Votes,
  Users,
  Avatars,
  AvatarsHistory,
  EmailTokens,
  ResetTokens,
  Tokens,
  WebsocketSessions,
  RelationshipPostFile,
  Files,
  Votables,
};

export default entities;
