import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Post {
  readonly id: string;
  readonly postOwnerId: string;
  readonly postOwnerUsername: string;
  readonly postTitle: string;
  readonly postBody: string;
  readonly createdAt?: string;
  readonly comments?: (Comment | null)[];
  readonly likes?: (Like | null)[];
  constructor(init: ModelInit<Post>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post>) => MutableModel<Post> | void): Post;
}

export declare class Comment {
  readonly id: string;
  readonly commentOwnerId: string;
  readonly commentOwnerUsername: string;
  readonly post?: Post;
  readonly content: string;
  readonly createdAt: string;
  constructor(init: ModelInit<Comment>);
  static copyOf(source: Comment, mutator: (draft: MutableModel<Comment>) => MutableModel<Comment> | void): Comment;
}

export declare class Like {
  readonly id: string;
  readonly numberLikes: number;
  readonly likeOwnerId: string;
  readonly likeOwnerUsername: string;
  readonly post?: Post;
  constructor(init: ModelInit<Like>);
  static copyOf(source: Like, mutator: (draft: MutableModel<Like>) => MutableModel<Like> | void): Like;
}