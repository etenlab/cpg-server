/**
 * All entitites are exported from here for the next reasons:
 * - to make it easier to synchronize them across different repos
 * - to make it easier to generate entities from the database
 *
 * Use this command to pull new entities from the database:
 * npx typeorm-model-generator -h postgres -d eil -u postgres -x example -e postgres -o ./src/model
 */

import { Discussion } from '@eten-lab/models';
import { Post } from '@eten-lab/models';
import { User } from '@eten-lab/models';
import { Reaction } from '@eten-lab/models';
import { RelationshipPostFile } from '@eten-lab/models';
import { File } from '@eten-lab/models';

import { Node } from '@eten-lab/models';
import { NodePropertyKey } from '@eten-lab/models';

import { NodePropertyValue } from '@eten-lab/models';
import { NodeType } from '@eten-lab/models';
import { RelationshipPropertyKey } from '@eten-lab/models';
import { RelationshipPropertyValue } from '@eten-lab/models';
import { RelationshipType } from '@eten-lab/models';
import { Relationship } from '@eten-lab/models';

import { BallotEntries } from './entities/BallotEntries';
import { Elections } from './entities/Elections';
import { Votables } from './entities/Votables';
import { Votes } from './entities/Votes';
import { Avatars } from './entities/Avatars';
import { AvatarsHistory } from './entities/AvatarsHistory';
import { EmailTokens } from './entities/EmailTokens';
import { ResetTokens } from './entities/ResetTokens';
import { Tokens } from './entities/Tokens';
import { WebsocketSessions } from './entities/WebsocketSessions';

export const entities = [
  Discussion,
  Post,
  Reaction,
  BallotEntries,
  Elections,
  NodePropertyKey,
  NodePropertyValue,
  NodeType,
  Node,
  RelationshipPropertyKey,
  RelationshipPropertyValue,
  RelationshipType,
  Relationship,
  Votables,
  Votes,
  User,
  Avatars,
  AvatarsHistory,
  EmailTokens,
  ResetTokens,
  Tokens,
  WebsocketSessions,
  RelationshipPostFile,
  File,
];

export {
  Discussion,
  Reaction,
  BallotEntries,
  Elections,
  NodePropertyKey,
  NodePropertyValue,
  NodeType,
  Node,
  Post,
  RelationshipPropertyKey,
  RelationshipPropertyValue,
  RelationshipType,
  Relationship,
  Votes,
  User,
  Avatars,
  AvatarsHistory,
  EmailTokens,
  ResetTokens,
  Tokens,
  WebsocketSessions,
  RelationshipPostFile,
  File,
  Votables,
};

export default entities;
