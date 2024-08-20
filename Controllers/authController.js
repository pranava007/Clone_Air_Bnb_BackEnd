import User from "../Models/userModle.js";
import { errorHandle } from "../Utils/errorHandling.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodeMailers from "../Services/nodeMailers.js";
dotenv.config();


export const registerUser = async (req, res, next) => {
    const { username, firstname, lastname, email, password, role } = req.body;
    console.log( req.body);
       
    

    // Check if all fields are provided and not empty
    if (!username || !firstname || !lastname || !email || !password || !role) {
        return next(errorHandle(400, "All fields are required."));
    }

    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return next(errorHandle(409, "Username or email already taken."));
        }

        // Hash the password
        const hashPassword = bcryptjs.hashSync(password, 10);

        // Create a new user instance
        const newUser = new User({
            username,
            firstname,
            lastname,
            email,
            password: hashPassword,
            role,
        });

        // Save the new user to the database
        await newUser.save();

        // Send a successful response
        return res.status(201).json({
            message: "User registered successfully.",
            result: newUser,
        });
    } catch (error) {
        return next(errorHandle(500, "An error occurred during registration."));
    }
};


// login
export const logingUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(errorHandle(4000, "All the Fields Are Required"));
  }

  try {
    const userDetails = await User.findOne({ email });

    const userPassword = bcryptjs.compareSync(password, userDetails.password);

    if (!userDetails || !userPassword) {
      return next(errorHandle(400, "Invalid Credentials"));
    }
    const token = jwt.sign(
      {
        id: userDetails._id,
        role: userDetails.role,
        isAdmin: userDetails.isAdmin,
      },
      process.env.JWT_SECRET_KEY
    );

    // password hidden not store db
    const { password: passkey, ...rest } = userDetails._doc;

    res
      .status(200)
      .json({
        message: "User LoggedIn Successfully",
        rest,
        token,
        role: userDetails.role,
      });
  } catch (error) {
    next(error);
  }
};

export const forgetPassword = async (req,res,next)=>{
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user)   return res.status(404).json({ message: 'User not found' });

        // const resetToken = crypto.randomBytes(20).toString('hex');
        const token = jwt.sign({id:user._id,role:user.role,isAdmin:user.isAdmin},process.env.JWT_SECRET_KEY)
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetUrl = `http://localhost:3000/resetpassword/${user._id}/${token}`;

        await nodeMailers.sendResetEmail(user.email,resetUrl);

        res.status(200).json({message:"Password reset email sent"})

    } catch (error) {
        next(error)
    }
}





export const restPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
  
   
    
    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
        // Hash the new password
        const hashedPassword = await bcryptjs.hash(password, 10);
  
        // Update the user's password
        const user = await User.findByIdAndUpdate(
            {_id:id},
            { password: hashedPassword },
            { new: true } // Return the updated user document
        );
  
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        res.json({ status: 'Success', message: 'Password has been reset' });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
  

