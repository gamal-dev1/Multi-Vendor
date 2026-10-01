import express from 'express'
import { signIn, signUp } from './auth.controller.js'
import { validation } from '../../../middleware/validation.js'
import { signInSchema, signUpSchema } from './auth.validation.js'
const authRouter = express.Router()

authRouter.post('/signUp', validation(signUpSchema), signUp)
authRouter.post('/signIn', validation(signInSchema), signIn)

export default authRouter