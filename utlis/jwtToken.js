// create and send token and save in the cookie

const sendToken = (user, statusCode, res) => {

    // create jwt token
    const token = user.getJwtToken();
    // console.log(token);
    // options for cookie

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
        // here httpOnly : true is very imp as this token cannot be accessed with javascript code
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })


}

module.exports = sendToken