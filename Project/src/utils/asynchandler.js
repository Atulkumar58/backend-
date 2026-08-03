const asynchandler = (fn) =>  async(req, res, next) =>{
    try {
        await fn(req, res, next)
    }
    catch(error){
        res.status(error.code || 500).json({
            success : false,
            message : error.message || "Internal Server Error"
        })
    }
}

export default asynchandler;


// higher order function
// const asyncHandler = (fn) => () => {}
// const asyncHandler = (fn) => {() => {}}
// const asynchandler = (fn) => async() => {}