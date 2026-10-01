import express from 'express'
import * as payment from './payment.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { validation } from '../../../middleware/validation.js'
import { createPaymentSchema, paymentIdSchema } from './payment.validation.js'

const paymentRouter = express.Router()

paymentRouter.post('/checkout', protectedRoutes, allowedTo('customer'), validation(createPaymentSchema), payment.createPayment)
paymentRouter.post('/webhook', payment.paymentWebhook)
paymentRouter.get('/success', payment.paymentSuccess)
paymentRouter.get('/cancel', payment.paymentCancel)

paymentRouter.get('/:id', protectedRoutes, allowedTo('customer', 'owner', 'admin'), validation(paymentIdSchema), payment.getPayment)

export default paymentRouter
