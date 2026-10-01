import { userModel } from "../../../../databases/models/user.model.js"
import { catchAsyncError } from "../../../middleware/catchAsyncError.js"
import { AppError } from "../../../utils/AppError.js"
import { getAll } from "../handlers/factor.handler.js"

const createUser = catchAsyncError(async (req, res, next) => {
    if (await userModel.findOne({ email: req.body.email }))
        return next(new AppError('email Already Exist', 409))
    let user = await new userModel(req.body).save()
    user.password = undefined
    res.status(201).json({ message: "success created", user })
})

const getAllUsers = getAll(userModel)

const getUser = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    if (!user) return next(new AppError('user not found', 404))
    res.json({ message: "success", user })
})

const updateUser = catchAsyncError(async (req, res, next) => {
    let user = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true })
    if (!user) return next(new AppError('user not found', 404))
    res.status(200).json({ message: 'success Updated ', user })
})

const deleteMe = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findByIdAndDelete(req.user._id)
    if (!user) return next(new AppError('User not found', 404))
    res.json({ message: 'Success deleted' })
})

const deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findByIdAndDelete(req.params.id)
    if (!user) return next(new AppError('User not found', 404))
    res.json({ message: 'Success deleted', user })
})

const changePassword = catchAsyncError(async (req, res, next) => {
    let user = await userModel.findByIdAndUpdate(req.user._id, {
        password: req.body.password,
        passwordChangedAt: Date.now()
    })
    if (!user) return next(new AppError('user not found', 404))
    res.json({ message: 'Success password changed' })
})

const changeRole = catchAsyncError(async (req, res, next) => {
    let user = await userModel.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true })
    if (!user) return next(new AppError('user not found', 404))
    res.json({ message: 'Success change role', user })
})



export {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteMe,
    deleteUser,
    changePassword,

    changeRole
}
