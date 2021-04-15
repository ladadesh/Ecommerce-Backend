const ErrorHandler = require("../utlis/errorHandler")


module.exports = (err , req , res , next) => {

    err.statusCode = err.statusCode || 500
    
    // handling error in the development mode
    if(process.env.NODE_ENV === "DEVELOPMENT"){

        res.status(err.statusCode).json({
            success : false,
            error : err ,
            errMessage : err.message ,
            stack : err.stack
        })
    }

    // handling error in the production mode
    if(process.env.NODE_ENV === "PRODUCTION"){
        let error = {...err}
        error.message = err.message

        // wrong mongoose object ID Error
        if(err.name === "CastError"){
            const message = `Resourse not found.Invalid : ${err.path}`
            error = new ErrorHandler(message,400)

        }


        // handling mongoose validation error
        if (err.name === "ValidatorError"){
            const message = Object.values(err.errors).map(value => value.message)
            error = new ErrorHandler(message,400)

        }


        // handling mongoose error for duplicate key
        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered.`
            error = new ErrorHandler(message,400)
        }

        // handling wrong JWT error
        if(err.name === "JsonWebTokenError"){
            const message = "JSON Web Token is invalid.Try Again"
            error = new ErrorHandler(message,400)
        }

        // handling Expired Jwt error
        if(err.name === "TokenExpiredError"){
            const message = "JSON Web Token is expired.Try Again"
            error = new ErrorHandler(message,400)
        }
        
        res.status(err.statusCode).json({
            success: false ,
            errMessage : error.message || "Internal Server Error"
        })

    }


}


    

