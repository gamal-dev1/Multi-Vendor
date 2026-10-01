import { catchAsyncError } from "../../../middleware/catchAsyncError.js"
import { ApiFeatures } from "../../../utils/ApiFeatures.js"



export const getAll = (model) => {
    return catchAsyncError(async (req, res, next) => {

        let apiFeatures = new ApiFeatures(model.find(), req.query)
            .paginate().filter().sort().search().fields()
        //excute query
        let result = await apiFeatures.mongooseQuery
        res.status(200).json({ message: 'success', page: apiFeatures.page, result })
    })
}
