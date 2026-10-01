import express from 'express'
import * as user from './user.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { validation } from '../../../middleware/validation.js'
import * as valid from './user.validation.js'
const userRouter = express.Router()

userRouter.route('/')
    .post(protectedRoutes, allowedTo('admin'), validation(valid.createUserSchema), user.createUser)
    .get(protectedRoutes, allowedTo('admin'), user.getAllUsers)
    .put(protectedRoutes, allowedTo('customer', 'owner', 'admin'), validation(valid.updateUserSchema), user.updateUser)

userRouter.route('/me')
    .get(protectedRoutes, allowedTo('customer', 'owner', 'admin'), user.getUser)
    .delete(protectedRoutes, allowedTo('customer', 'owner'), user.deleteMe);

userRouter.delete('/:id', protectedRoutes, allowedTo('admin'), validation(valid.deleteUserByIdSchema), user.deleteUser)

userRouter.patch('/changePassword', protectedRoutes, allowedTo('customer', 'owner', 'admin'), validation(valid.changePasswordSchema), user.changePassword)
userRouter.patch('/changeRole/:id', protectedRoutes, allowedTo('admin'), validation(valid.changeRoleSchema), user.changeRole)

export default userRouter
