// Checks if user is authenticated or not

const ErrorHandler = require("../utlis/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isUserAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return next(new ErrorHandler('Login first to access this resource.', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);

    next()
    // const { token } = req.cookies

    // if (!token) {
    //     return next(new ErrorHandler("Token is invalid, Login first to access the resource"), 401)
    // }


    // const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // // here we're getting the decode.id from the payload which we saved in getJwtToken() in user model
    // req.user = await User.findById(decoded.id)


    // next()
})


// handle user roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource.`), 403)
        }
        next()
    }
}


