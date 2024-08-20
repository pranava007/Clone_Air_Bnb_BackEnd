import express from "express";
import {  forgetPassword, logingUser, registerUser, restPassword } from "../Controllers/authController.js";

const authRoute = express.Router();

authRoute.post('/registerUser',registerUser);
authRoute.post('/logingUser',logingUser);
authRoute.post('/forget-password',forgetPassword);
authRoute.post('/reset-password/:id/:token',restPassword)


export default authRoute;