// for registering the user
const User = require('../models/user')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ErrorHandler = require('../utlis/errorHandler')
const sendToken = require('../utlis/jwtToken')
const sendEmail = require('../utlis/sendEmail')

const bcrypt = require("bcryptjs")

const crypto = require('crypto')
const cloudinary = require('cloudinary')


// find all 
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.find()

    res.status(200).json({
        success: true,
        user
    })
})

// register user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "Avatar",
        width: 150,
        crop: "scale"
        // this crop : scale will maintain the aspect ratio of the image
    })

    const { name, email, password } = req.body

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    sendToken(user, 201, res)

})

// login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email or password"), 400)
    }

    // here we're using select because in user model we have given select = false in password
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return next(new ErrorHandler("Email is not registered."), 401)
    }

    // check password is correct or not
    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Password is incorrect."), 401)
    }

    sendToken(user, 201, res)


})

// forget password
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("Email not found"), 404)
    }

    // get resetTOkeen

    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    // create reset password url

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/reset/password/${resetToken}`

    // this is the message we will get it in a recovery email
    const message = `Your password reset token is as follows \n\n ${resetUrl} \n\n If you have not requested this email , then ignore it`

    try {
        // send email is function in which nodemailer is used
        await sendEmail({
            email: user.email,
            subject: "Amazon Clone Password Recovery",
            message
        })

        res.status(200).json({
            success: true,
            message: `Recover email send to ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })
        // 500 is the internal server error
        return next(new ErrorHandler(error.message), 500)
    }


})

// reset Password 
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    // Hash URL TOken
    // this will create a hash reset password token url
    // const resetPasswordToken = crypto.createHash('sha256').update("q1w2e3r4t5y").digest("hex")

    const resetPasswordToken = "q1w2e3r4t5y6"

    console.log("comparing the resetPasswordToken", resetPasswordToken);

    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler("Password rest token is invalid or has been expired."), 404)
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match"), 404)
    }

    // setup new Password

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 201, res)


})

// getting logged in user  
exports.loggedInUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);
    // console.log(req.user);
    res.status(200).json({
        success: true,
        user
    })
})


// update password of currently logged in user
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password')

    // here we'll compare the old password
    const isMatch = await user.comparePassword(req.body.oldPassword)

    if (!isMatch) {
        return next(new ErrorHandler("Your old password is incorrect"), 404)
    }

    user.password = req.body.password

    user.save()

    sendToken(user, 200, res)

})


// update profile info of the User

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    // here we'll  take the new user profile data
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })


    res.status(200).json({
        success: true,
    })
})

// logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        msg: "User logged out."
    })

})


// get specific user only for admin only

exports.getUserByAdmin = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`User not found  ${req.params.id}`), 404)
    }

    res.status(200).json({
        success: true,
        user
    })

})


// delete a user by admin only

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)

    user.save()

    res.status(200).json({
        success: true,
        msg: "User deleted."
    })
})


// update a user by admin 


exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    let user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler("USer not found"), 400)
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: user,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })

})