import jwt from 'jsonwebtoken';
import { errorHandle } from '../Utils/Error.js';
import dotenv from "dotenv";

dotenv.config();
export const verfiyToken = (req,res,next)=>{
  
    const token = req.headers.token;
    console.log(token);
    if (!token) {
      return next(errorHandle(401, 'Unauthorized Access'));
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return next(errorHandle(401, 'Unauthorized access' ));
      }
      req.user = user;
      next();
    });

}