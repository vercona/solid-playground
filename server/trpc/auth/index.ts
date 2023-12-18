// NOTE: this file can be auto-generated/updated later

import { router } from "../trpc"

import getUser from './getUser'
import passwordlessLogin from './passwordlessLogin'
import refreshSession from './refreshSession'
import testAuth from './testAuth'


export default router({
  getUser,
  passwordlessLogin,
  refreshSession,
  testAuth
})