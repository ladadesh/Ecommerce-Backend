module.exports = func => (req,res,next) => 
        Promise.resolve(func(req,res,next))
        .catch(next)

//this will catch all the async errors like if a post body field is missing , etc. 