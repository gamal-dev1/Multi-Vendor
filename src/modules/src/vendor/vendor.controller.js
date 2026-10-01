import { vendorModel } from "../../../../databases/models/vendor.model.js";
import { catchAsyncError } from "../../../middleware/catchAsyncError.js";
import { AppError } from "../../../utils/AppError.js";
import { getAll } from "../handlers/factor.handler.js";

const createVendor = catchAsyncError(async (req, res, next) => {
    let vendor = await new vendorModel({ ...req.body, owner: req.user._id }).save()
    res.status(201).json({ message: 'success Created', vendor })
})

const getAllVendors = getAll(vendorModel)

const getVendor = catchAsyncError(async (req, res, next) => {
    let vendor = await vendorModel.findById(req.params.id)
    if (!vendor) return next(new AppError('vendor not found', 404))
    res.json({ message: 'success', vendor })
})

const getMyVendors = catchAsyncError(async (req, res, next) => {
    let vendors = await vendorModel.find({ owner: req.user._id })
    res.json({ message: 'success', vendors })
})

const updateVendor = catchAsyncError(async (req, res, next) => {
    let filter = { _id: req.params.id, owner: req.user._id }
    let vendor = await vendorModel.findOneAndUpdate(filter, req.body, { new: true })
    if (!vendor) return next(new AppError('vendor not found or not authorized', 404))
    res.status(200).json({ message: 'success Updated', vendor })
})

const deleteVendor = catchAsyncError(async (req, res, next) => {
    let filter = req.user.role === 'admin' ? { _id: req.params.id }
        : { _id: req.params.id, owner: req.user._id }
    let vendor = await vendorModel.findOneAndDelete(filter)
    if (!vendor) return next(new AppError('vendor not found or not authorized', 404))
    res.json({ message: 'success Deleted', vendor })
})


export {
    createVendor,
    getAllVendors,
    getVendor,
    getMyVendors,
    updateVendor,
    deleteVendor
}