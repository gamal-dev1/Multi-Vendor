import { globalErrorMiddleware } from "../middleware/globalErrorMiddleware.js";
import { AppError } from "../utils/AppError.js";
import authRouter from "./src/auth/auth.router.js";
import bookingRouter from "./src/booking/booking.router.js";
import paymentRouter from "./src/payment/payment.router.js";
import reviewRouter from "./src/review/review.router.js";
import serviceRouter from "./src/service/service.router.js";
import slotRouter from "./src/slot/slot.router.js";
import userRouter from "./src/user/user.router.js";
import vendorRouter from "./src/vendor/vendor.router.js";

export function init(app) {

    app.use('/api/auth', authRouter)
    app.use('/api/users', userRouter)
    app.use('/api/vendors', vendorRouter)
    app.use('/api/services', serviceRouter)
    app.use('/api/slots', slotRouter)
    app.use('/api/bookings', bookingRouter)
    app.use('/api/payment', paymentRouter)
    app.use('/api/reviews', reviewRouter)

    
    app.get('/', (req, res) => res.json('Welcome User in the platform Bookings'))

    app.use((req, res, next) => next(new AppError(`Can't find this route ${req.originalUrl}`, 404)))

    app.use(globalErrorMiddleware)
}