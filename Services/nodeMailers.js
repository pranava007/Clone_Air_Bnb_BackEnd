import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.PASSMAIL,
        pass:process.env.PASSKEY,
    }
})

export const sendResetEmail = (email,url)=>{
    const mailOptions={
        from:process.env.PASSMAIL,
        to:email,
        subject:'Reset Your Password',
        html:`<h2>Click the link below to reset your password</h2><a a herf="${url}">${url}</a>`
    };
    return transporter.sendMail(mailOptions)
}


export default {
  
    sendResetEmail,
}
