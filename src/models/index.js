// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Post, Comment, Like } = initSchema(schema);

export {
  Post,
  Comment,
  Like
};