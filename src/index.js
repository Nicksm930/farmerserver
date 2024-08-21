import app from '../app/app.js'
import dotenv from 'dotenv'
import dbConnection from '../database/dbConnect.js'
dotenv.config({
    path:"./.env.dev"
})
const port=3000
console.log("In index.js")
try {
    if (await dbConnection()) {
        app.listen(port,()=>{
            console.log(`Server Running On Port:${port}`)
            
        })       
        // console.log(abc.path.config())
    }
    else{
        throw new Error("Server Not Started ")
    }
} catch (error) {
    console.log(error);
}
