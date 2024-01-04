// NOTE: this file can be auto-generated/updated later

import { router } from "../trpc"

import createComment from './createComment'
import createPost from './createPost'
import createUser from './createUser'
import deleteComment from './deleteComment'
import getAllUsers from './getAllUsers'
import getComment from './getComment'
import getPost from './getPost'
import getPostAndComments from './getPostAndComments'
import getRepliedComments from './getRepliedComments'
import removeCommentEntirely from './removeCommentEntirely'
import getAllPosts from "./getAllPosts"

export default router({
  createComment,
  createPost,
  createUser,
  deleteComment,
  getAllUsers,
  getComment,
  getPost,
  getPostAndComments,
  getRepliedComments,
  removeCommentEntirely,
  getAllPosts,
})
