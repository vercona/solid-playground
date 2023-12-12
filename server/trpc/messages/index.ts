// NOTE: this file can be auto-generated/updated later

import { router } from "../trpc";

export default router({
  createComment: require('./createComment').default,
  createPost: require('./createPost').default,
  createUser: require('./createUser').default,
  deleteComment: require('./deleteComment').default,
  getAllUsers: require('./getAllUsers').default,
  getComment: require('./getComment').default,
  getPost: require('./getPost').default,
  getPostAndComments: require('./getPostAndComments').default,
  getRepliedComments: require('./getRepliedComments').default,
  removeCommentEntirely: require('./removeCommentEntirely').default
});
