import { userModel } from "../../../../databases/models/user.model.js";
import { catchAsyncError } from "../../../middleware/catchAsyncError.js";
import { AppError } from "../../../utils/AppError.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const signUp = catchAsyncError(async (req, res, next) => {
    if (await userModel.findOne({ email: req.body.email }))
        return next(new AppError('email Already Exist', 409))
    let user = await new userModel(req.body).save()
    user.password = undefined
    res.status(201).json({ message: "success signUp", user })
})

export const signIn = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    let user = await userModel.findOne({ email }).select('+password')
    if (!user || !(await bcrypt.compare(password, user.password)))
        return next(new AppError('incorrct email or password', 401))
    let token = jwt.sign({ name: user.name, userId: user._id, role: user.role }, process.env.JWT_KEY)
    res.json({ message: 'success SignIn', token })
})

export const protectedRoutes = catchAsyncError(async (req, res, next) => {
    let { token } = req.headers
    if (!token) return next(new AppError('token not provided', 401))

    let decoded = jwt.verify(token, process.env.JWT_KEY)

    let user = await userModel.findById(decoded.userId)
    if (!user || !user.isActive) return next(new AppError('invalid user', 401))

    if (user.passwordChangedAt && parseInt(user.passwordChangedAt.getTime() / 1000) > decoded.iat)
        return next(new AppError('password changed', 401))

    req.user = user
    next()
})

export const allowedTo = (...roles) => {
    return catchAsyncError(async (req, res, next) => {
        if (!roles.includes(req.user.role)) return next(new AppError("not authorized you are " + req.user.role, 403))

        next()
    })
}
