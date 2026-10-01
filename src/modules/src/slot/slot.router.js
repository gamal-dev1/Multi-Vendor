import express from 'express'
import * as slot from './slot.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { generateSlotSchema, getSlotsSchema, slotIdSchema } from './slot.validation.js'
import { validation } from '../../../middleware/validation.js'

const slotRouter = express.Router()

slotRouter.route('/')
    .get(validation(getSlotsSchema),slot.getAllSlots)

slotRouter.route('/generate')
    .post(protectedRoutes, allowedTo('owner'), validation(generateSlotSchema), slot.generateServiceSlots)

slotRouter.route('/:id')
    .get(validation(slotIdSchema), slot.getSlot)
    .delete(protectedRoutes, allowedTo('owner'), validation(slotIdSchema), slot.deleteSlot)

export default slotRouter
