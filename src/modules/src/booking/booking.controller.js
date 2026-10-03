import { bookingModel } from "../../../../databases/models/booking.model.js";
import { serviceModel } from "../../../../databases/models/service.model.js";
import { slotModel } from "../../../../databases/models/slot.model.js";
import { vendorModel } from "../../../../databases/models/vendor.model.js";
import { catchAsyncError } from "../../../middleware/catchAsyncError.js";
import { ApiFeatures } from "../../../utils/ApiFeatures.js";
import { AppError } from "../../../utils/AppError.js";

const createBooking = catchAsyncError(async (req, res, next) => {
    const { serviceId, slotId } = req.body
    let service = await serviceModel.findById(serviceId)
    if (!service) return next(new AppError('service not found', 404))

    let slot = await slotModel.findById(slotId)
    if (!slot) return next(new AppError('slot not found', 404))

    if (!slot.service._id.equals(service._id))
        return next(new AppError('slot does not belong to this service', 400))

    if (await bookingModel.findOne({ slot: slot._id, status: { $ne: 'cancelled' } }))
        return next(new AppError('slot aleady booked', 409))

    let booking = await new bookingModel({
        user: req.user._id,
        vendor: service.vendor,
        service: service._id,
        slot: slot._id,
        totalPrice: service.price
    }).save()
    res.status(201).json({ message: 'success Booking', booking })
})

const getAllBooking = catchAsyncError(async (req, res, next) => {
    let mongooseQuery = req.user.role === 'admin'
        ? bookingModel.find()
        : bookingModel.find({
            vendor: {
                $in: await vendorModel.find({ owner: req.user._id }).distinct('_id')
            }
        })
    let apiFeatures = new ApiFeatures(mongooseQuery, req.query)
        .paginate().filter().sort().fields()
    let booking = await apiFeatures.mongooseQuery
    res.json({ message: 'success', page: apiFeatures.page, booking })
})

const getBooking = catchAsyncError(async (req, res, next) => {
    let booking = await bookingModel.findById(req.params.id)
    if (!booking) return next(new AppError('booking not found', 404))

    if (req.user.role === 'owner') {
        let vendor = await vendorModel.findOne({ _id: booking.vendor, owner: req.user._id })
        if (!vendor) return next(new AppError('booking not found', 404))
    }
    res.json({ message: 'success', booking })
})

const getMyBooked = catchAsyncError(async (req, res, next) => {
    let booking = await bookingModel.find({ user: req.user._id })
    res.json({ message: 'success', booking })
})

const cancelBooking = catchAsyncError(async (req, res, next) => {
    let booking = await bookingModel.findOneAndUpdate({ _id: req.params.id, user: req.user._id, status: { $ne: 'cancelled' } },
        {
            status: 'cancelled',
            cancellationReason: req.body.cancellationReason
        }, { new: true })
    if (!booking) return next(new AppError('booking not found or already cancelled', 404))
    res.json({ message: 'booking cancelled successfully', booking })
})

export {
    createBooking,
    getAllBooking,
    getBooking,
    getMyBooked,
    cancelBooking
}