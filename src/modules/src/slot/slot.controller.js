import { serviceModel } from "../../../../databases/models/service.model.js";
import { slotModel } from "../../../../databases/models/slot.model.js";
import { vendorModel } from "../../../../databases/models/vendor.model.js";
import { catchAsyncError } from "../../../middleware/catchAsyncError.js";
import { AppError } from "../../../utils/AppError.js";
import { formatDate, generateSlots } from "../../../utils/generateSlots.js";


const generateServiceSlots = catchAsyncError(async (req, res, next) => {
    const { service, date } = req.body
    let serviceData = await serviceModel.findById(service)
    if (!serviceData) return next(new AppError('service not found', 404))
    let vendor = await vendorModel.findOne({ _id: serviceData.vendor, owner: req.user._id })
    if (!vendor) return next(new AppError('not authorized', 403))
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const workingDay = vendor.workingHours[dayName]
    if (!workingDay || !workingDay.isOpen) return next(new AppError('vendor is closed on this day', 400))
    if (!workingDay.start || !workingDay.end) return next(new AppError('working hours are not set for this day', 400))
    let slots = generateSlots(date, workingDay.start, workingDay.end, serviceData.duration)
    if (!slots.length) return next(new AppError('no slots can be generated for this working hours', 400))
    let existingSlots = await slotModel.find({ service, startAt: { $gte: new Date(`${date}T00:00:00`) }, endAt: { $lte: new Date(`${date}T23:59:59`) } })
    if (existingSlots.length) return next(new AppError('slots already generated for this service on this date', 409))
    slots = slots.map(slot => ({ service, startAt: slot.startAt, endAt: slot.endAt }))
    let createdSlots = await slotModel.insertMany(slots)
    createdSlots = createdSlots.map(slot => ({
        ...slot.toObject(),
        startAt: formatDate(slot.startAt),
        endAt: formatDate(slot.endAt)
    }))
    res.status(201).json({ message: 'slots generated successfully', slots: createdSlots })
})

const getAllSlots = catchAsyncError(async (req, res, next) => {
    const { service, date } = req.body
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)
    let slots = await slotModel.find({
        service,
        startAt: { $gte: startOfDay }, endAt: { $lte: endOfDay }
    })
    slots = slots.map(slot => ({
        ...slot.toObject(),
        startAt: formatDate(slot.startAt),
        endAt: formatDate(slot.endAt)
    }))
    res.json({ message: 'success', slots })
})

const getSlot = catchAsyncError(async (req, res, next) => {
    let slot = await slotModel.findById(req.params.id)
    if (!slot) return next(new AppError('slot not found', 404))

    slot = slot.toObject()
    slot.startAt = formatDate(slot.startAt)
    slot.endAt = formatDate(slot.endAt)

    res.json({ message: 'success', slot })
})

const deleteSlot = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    let slot = await slotModel.findById(id)
    if (!slot) return next(new AppError('slot not found or not authorized', 404))
    let service = await serviceModel.findById(slot.service)
    if (!service) return next(new AppError('service not found', 404))
    let vendor = await vendorModel.findOne({ _id: service.vendor, owner: req.user._id })
    if (!vendor) return next(new AppError('not authorized', 403))
    slot = await slotModel.findByIdAndDelete(id)
    res.json({ message: 'success Deleted', slot })
})

export {
    generateServiceSlots,
    getAllSlots,
    getSlot,
    deleteSlot
}
