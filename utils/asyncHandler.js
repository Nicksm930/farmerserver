/// create a method and export it
//Since async is a higher order function which can take fun as an argument and return fun
//
// const asyncHandler=(fn)=>()=>{

// }
// const asyncHandler=()=>{
//     async(error,req,res,next)=>{
//         try {
            
//         } catch (error) {
//             res.status(error.code || 500).json({
//                 success:false,
//                 message:error.message
//             })
//         }
//     }
// }

//Create using promise
const asyncHandler=(requestHandler) =>
    {
        return (req, res, next) => {
            Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
        }
    }
    export {asyncHandler}