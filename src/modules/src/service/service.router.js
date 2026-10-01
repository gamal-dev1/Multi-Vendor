import express from 'express'
import * as service from './service.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { validation } from '../../../middleware/validation.js'
import { createServiceSchema, serviceIdSchema, updateServiceSchema } from './service.validation.js'
// import slotRouter from '../slot/slot.router.js'


const serviceRouter = express.Router()

// serviceRouter.use('/:serviceId/slots',slotRouter)

serviceRouter.route('/')
    .get(service.getAllSevices)

serviceRouter.route('/:vendor')
    .post(protectedRoutes, allowedTo('owner'), validation(createServiceSchema), service.createService)

serviceRouter.route('/:id')
    .get(validation(serviceIdSchema), service.getService)
    .put(protectedRoutes, allowedTo('owner'), validation(updateServiceSchema), service.updateService)
    .delete(protectedRoutes, allowedTo('owner'), validation(serviceIdSchema), service.deleteService)

export default serviceRouter