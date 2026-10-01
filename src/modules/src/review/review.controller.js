import { bookingModel } from "../../../../databases/models/booking.model.js";
import { reviewModel } from "../../../../databases/models/review.model.js";
import { serviceModel } from "../../../../databases/models/service.model.js";
import { catchAsyncError } from "../../../middleware/catchAsyncError.js";
import { ApiFeatures } from "../../../utils/ApiFeatures.js";
import { AppError } from "../../../utils/AppError.js";

const createReview = catchAsyncError(async (req, res, next) => {
    if (!await serviceModel.findById(req.body.service))
        return next(new AppError('service not found', 404))

    let booking = await bookingModel.findOne({ user: req.user._id, service: req.body.service, status: 'completed' })
    if (!booking) return next(new AppError('you must book this service first', 400))

    req.body.customer = req.user._id
    if (await reviewModel.findOne({ customer: req.user._id, service: req.body.service }))
        return next(new AppError('you are already add comment before', 409))

    let review = await new reviewModel(req.body).save()
    res.status(201).json({ message: 'Success Review', review })
})

const getAllServiceReviews = catchAsyncError(async (req, res, next) => {
    let mongooseQuery = reviewModel.find({ service: req.params.serviceId })
    let apiFeatures = new ApiFeatures(mongooseQuery, req.query)
        .paginate().filter().sort().search().fields()
    let reviews = await apiFeatures.mongooseQuery
    res.json({ message: 'Success', page: apiFeatures.page,reviews})
})

const getMyReviews = catchAsyncError(async (req, res, next) => {
    let mongooseQuery = reviewModel.find({customer: req.user._id})
    let apiFeatures = new ApiFeatures(mongooseQuery, req.query)
        .paginate().filter().sort().search().fields()
    let reviews = await apiFeatures.mongooseQuery
    res.json({ message: 'success', page: apiFeatures.page, reviews })
})

const updateReview = catchAsyncError(async (req, res, next) => {
    let review = await reviewModel.findOneAndUpdate({ _id: req.params.id, customer: req.user._id },
        req.body, { new: true })
    if (!review) return next(new AppError('review not found', 404))
    res.json({ message: 'Success Update', review })
})

const deleteReview = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    let review;

    if (req.user.role === 'admin') {
        review = await reviewModel.findOneAndDelete({ _id: id });
    } else {
        review = await reviewModel.findOneAndDelete({ _id: id, customer: req.user._id });
    }
    if (!review) return next(new AppError('Review not found or your Not Authorized', 404))
    res.json({ message: 'success', review })
})

export {
    createReview,
    getAllServiceReviews,
    getMyReviews,
    updateReview,
    deleteReview
}