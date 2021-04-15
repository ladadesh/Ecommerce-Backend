// Error Handler CLass

class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        // this will create the stack object
        Error.captureStackTrace(this,this.constructor)
    }
}

module.exports = ErrorHandler;