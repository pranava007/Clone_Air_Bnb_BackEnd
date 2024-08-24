import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
import connectDB from "./Database/config.js";
import authRoute from "./Routers/authRouter.js";
import propertrouter from "./Routers/propertyRoutes.js";
import bookingRouter from "./Routers/bookingRoutes.js";



dotenv.config()

const app = express();

app.use(cors({
  origin:'*',
  credentials:true,
}))

app.use(express.json())


// Error handling middleware

app.use((err ,req,res,next)=>{
    const statusCode = err.statusCode || 500
    res.statusCode(statusCode).json({success:false,message:err.message || "Internal Server Error"})
})



connectDB();

app.get('/',(req,res)=>{
    res.status(200).send('App Run Successfully')
})

//API Router

//Auth Router
app.use("/api/auth",authRoute);
app.use("/api/property",propertrouter);
app.use("/api/bookings",bookingRouter)



app.listen(process.env.PORT,()=>{
    console.log("Server is running on port");
})