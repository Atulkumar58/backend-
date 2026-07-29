const asynchandler = ()=>{

}

export default asynchandler


// higher order function
// const asyncHandler = (fn) => () => {}
// const asyncHandler = (fn) => {() => {}}
// const asynchandler = (fn) => async() => {}

const asynchandler = (fn) => async(req, res, next) =>{
    try {
        await fn(req, res, next)
    }catch(error){
        res.status(err.code || 500).json({
            success : false,
            message : error.message || "Internal Server Error"
        })
    }
}