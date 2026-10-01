import { serviceModel } from "../../../../databases/models/service.model.js";
import { vendorModel } from "../../../../databases/models/vendor.model.js";
import { catchAsyncError } from "../../../middleware/catchAsyncError.js";
import { AppError } from "../../../utils/AppError.js";
import { getAll } from "../handlers/factor.handler.js";

const createService = catchAsyncError(async (req, res, next) => {
    let vendor = await vendorModel.findOne({ _id: req.params.vendor, owner: req.user._id })
    if (!vendor) return next(new AppError('vendor not found or not authorized', 404))
    let service = await new serviceModel({ ...req.body, vendor: req.params.vendor }).save()
    res.status(201).json({ message: 'success Created', service })
})

const getAllSevices = getAll(serviceModel)

const getService = catchAsyncError(async (req, res, next) => {
    let service = await serviceModel.findById(req.params.id)
    if (!service) return next(new AppError('service not found', 404))
    res.json({ message: 'success', service })
})

const updateService = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let service = await serviceModel.findById(id)
    if (!service) return next(new AppError('service not found', 404))
    let vendor = await vendorModel.findOne({ _id: service.vendor, owner: req.user._id })
    if (!vendor) return next(new AppError('not authorized', 403))
    service = await serviceModel.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({ message: 'success Updated', service })
})

const deleteService = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let service = await serviceModel.findById(id)
    if (!service) return next(new AppError('service not found or not authorized', 404))
    let vendor = await vendorModel.findOne({ _id: service.vendor, owner: req.user._id })
    if (!vendor) return next(new AppError('not authorized', 403))
    service = await serviceModel.findByIdAndDelete(id)
    res.json({ message: 'success Deleted', service })
})

export {
    createService,
    getAllSevices,
    getService,
    updateService,
    deleteService
}
