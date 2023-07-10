export class Token {
  static PgNotifyClient = Symbol('PgNotifyClient');

  static DiscussionCreated = 'discussionCreated';
  static PostCreated = 'postCreated';
  static PostUpdated = 'postUpdated';
  static PostDeleted = 'postDeleted';
  static ReactionCreated = 'reactionCreated';
  static ReactionDeleted = 'reactionDeleted';
}
