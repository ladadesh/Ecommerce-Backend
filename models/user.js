const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Your name cannot exceed more than 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Your password must be at least 6 characters"],
        select: false
        // this select is used when we need to show a user at that case no password field gets should
    },
    avatar: {
        public_id: {
            type: String,
            required: false
        },
        url: {
            type: String,
            required: false
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // resetTOken is used when user reset password is clicked at that time resetToken is send via mail
    resetPasswordToken: String,
    // resetExpire is used when expire time of the resettoken is send 
    resetPasswordExpire: Date,

})


// encrypting the password before saving user
// below we cannot use arrow function because 'this' keyword cannot be used in arrow function
userSchema.pre('save', async function (next) {
    // if password is already encrypted
    if (!this.isModified('password')) {
        next()
    }

    // if password is not encrypted
    // here 10 is the salt value which is used for the length of bcrypt
    this.password = await bcrypt.hash(this.password, 10)

})

// compare password 
userSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password)
}


// return JWT token

userSchema.methods.getJwtToken = function () {
    // here we're saving id in payload
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

// generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    // generate resetTOken
    // this will create random 20 bytes and convert it into hex form
    // const resetToken = crypto.randomBytes(20).toString('hex')
    const resetToken = "q1w2e3r4t5y6"

    // this resetPasswordToken is coming from user model body which is in string form
    // now we will hash the resetToken
    // this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordToken = "q1w2e3r4t5y6"

    console.log("resetToken set in model", this.resetPasswordToken);

    // token expiry time = 30 minutes
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000
    console.log(this.resetPasswordExpire);
    return resetToken;
}


module.exports = mongoose.model("User", userSchema)