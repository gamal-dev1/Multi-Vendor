import express from 'express'
import *as booking from "./booking.controller.js";
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { validation } from '../../../middleware/validation.js';
import { bookingIdSchema, cancelBookingSchema, createBookingSchema } from './booking.validation.js';
const bookingRouter = express.Router()


bookingRouter.route('/')
    .post(protectedRoutes, validation(createBookingSchema), booking.createBooking)
    .get(protectedRoutes, allowedTo('admin', 'owner'), booking.getAllBooking)

bookingRouter.route('/MyBooked')
    .get(protectedRoutes, allowedTo('customer'), booking.getMyBooked)

bookingRouter.get('/:id', protectedRoutes, allowedTo('admin', 'owner'), validation(bookingIdSchema), booking.getBooking)

bookingRouter.patch('/:id/cancel', protectedRoutes, allowedTo('customer'), validation(cancelBookingSchema), booking.cancelBooking)

export default bookingRouter

