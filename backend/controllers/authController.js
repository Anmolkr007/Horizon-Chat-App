import {sql} from "../config/DB.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import validator from "validator";
import transporter from "../config/nodemailer.js"
import { log } from "console";
import cloudinary from "../config/cloudinary.js";

export const verifyEmail = async(req, res) => {
    const {verificationToken} = req.body;
    // console.log("Verification token received:", verificationToken);
    if(!verificationToken){
        return res.status(400).json({success:false,message:"Verification token is required"});
    }
    try{
        const hashedVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
        console.log("Hashed verification token :", hashedVerificationToken);
        const user = await sql ` select * from users where verificationToken = ${hashedVerificationToken} and verificationTokenExpiresAt > now()`;
        if(user.length === 0){
            return res.status(400).json({success:false,message:"Invalid or expired verification token"});
        }
        await sql`
            update users
            set isVerified = true,
            verificationToken = null,
            verificationTokenExpiresAt = null
            where id = ${user[0].id}
        `;
        console.log("Email verified for user with email:", user[0].email);
        res.status(200).json({success:true,message:"Email verified successfully, Try logging in now."});
    }
    catch(error){
        console.log("Error in verifyEmail",error);
        res.status(500).json({success:false,message:"Internal server error"});
    }
};

export const login = async(req, res) => {
  let {email,password} = req.body;
  try{
    if(!email || !password){
        return res.status(400).json({message:"Email and password are required"});
    }

    email = email.trim();
    email = email.toLowerCase();
    // Email Validation
    if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
    }

    //checking if user exists with the given email
    const user = await sql`select * from users where email = ${email}`;
    if(user.length === 0){
        return res.status(400).json({success:false,message:"Invalid email or password"});
    }

    // verify password
    const isPasswordValid = await bcryptjs.compare(password,user[0].password);
    if(!isPasswordValid){
        return res.status(400).json({success:false,message:"Invalid email or password"});
    }
    //check if email is verified
    if(user[0].isverified === false){
        return res.status(400).json({success:false,message:"Email not verified. Please verify your email before logging in."});
    }
    //if you are here, it means email and password are correct and email is verified, generating tokens and sending to client
    const accessToken = jwt.sign({id:user[0].id},process.env.JWT_SECRET,{expiresIn:"10m"});
    const refreshToken = jwt.sign({id:user[0].id},process.env.JWT_SECRET,{expiresIn:"7d"});
    
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:process.env.NODE_ENV === "production"?"none":"lax",
        maxAge:7*24*60*60*1000 // 7 days
      })
    res.status(200).json({success:true,message:"Login successful",accessToken,user:user[0]});


  }
  catch(error){
    console.log("Error in login",error);
    res.status(500).json({success:false,message:"Internal server error"});
  }
}

export const logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(400).json({success:false,message:"Refresh token not found"});
    }
    try{// Clear the refresh token cookie
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"none",
            maxAge:7*24*60*60*1000 // 7 days
        });
        res.status(200).json({success:true,message:"Logout successful"});
        //frontend will delete the access token on logout, so no need to handle that here as access token is stored in memory on client side and will be lost on page refresh or when user closes the browser.
    }
    catch(error){
        console.log("Error in logout",error);
        res.status(500).json({success:false,message:"Internal server error"});
    }   
}

export const signup = async(req, res) => {
    let {name,email,password} = req.body;
    // console.log("Signup request received:", { name, email, password });
    try{
        if(!name || !email || !password){
            return res.status(400).json({success:false,message:"All fields are required"});
        }

        //Trim
        email = email.trim();
        name = name.trim();
        email = email.toLowerCase();

        // Email Validation
        if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        //password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters, include one uppercase letter and one number"
            });
        }
        const hashedPassword = await bcryptjs.hash(password,10);
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const hashedVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
        const verificationTokenExpiresAt = new Date(Date.now() +  60 * 60 * 1000); // 1 hours from now
        console.log("Verification token generated:", verificationToken);
        console.log("Hashed verification token :", hashedVerificationToken);

        // Check if user with the same email already exists
        const existingUser = await sql `select * from users where email = ${email}`;
        if(existingUser.length > 0){
            if(existingUser[0].isverified){
                return res.status(400).json({success:false,message:"User with this email already exists,Please try logging in."});
            }
            else{
                //if user exists but not verified,put the verification token in db and hasedpassword and  send verification email again
                await sql`
                update users
                set verificationToken = ${hashedVerificationToken},
                verificationTokenExpiresAt = ${verificationTokenExpiresAt},
                password = ${hashedPassword}
                where email = ${email}
                `;

                const maileOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: "Email Verification",
                html: `
                <!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f9f9f9;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9; padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); padding:30px;">
            <tr>
              <td style="text-align:center; padding-bottom:20px;">
                <h2 style="color:#333; margin:0;">Welcome, ${name} 👋</h2>
              </td>
            </tr>
            <tr>
              <td style="color:#555; font-size:16px; line-height:1.6; padding-bottom:20px;">
                <p style="margin:0;">Thanks for signing up! Please verify your email address by clicking the button below. This helps us keep your account secure.</p>
              </td>
            </tr>
            <tr>
              <td style="text-align:center; padding:20px 0;">
                <a href="${process.env.CLIENT_URL}/email-verification/?token=${verificationToken}"
                   style="background-color:#4CAF50; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; font-size:16px; font-weight:bold; display:inline-block;">
                  Verify Email
                </a>
              </td>
            </tr>
            <tr>
              <td style="color:#888; font-size:14px; line-height:1.6; padding-top:20px; text-align:center;">
                <p style="margin:0;">If you didn't create this account, you can safely ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

                `
                }
                await transporter.sendMail(maileOptions); 
                return res.status(200).json({success:true,message:"Verification email sent"});
            }
        }
        //if user does not exist, create new user

        
        const maileOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Email Verification",
            html: `
            <!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f9f9f9;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9; padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); padding:30px;">
            <tr>
              <td style="text-align:center; padding-bottom:20px;">
                <h2 style="color:#333; margin:0;">Welcome, ${name} 👋</h2>
              </td>
            </tr>
            <tr>
              <td style="color:#555; font-size:16px; line-height:1.6; padding-bottom:20px;">
                <p style="margin:0;">Thanks for signing up! Please verify your email address by clicking the button below. This helps us keep your account secure.</p>
              </td>
            </tr>
            <tr>
              <td style="text-align:center; padding:20px 0;">
                <a href="${process.env.CLIENT_URL}/email-verification/?token=${verificationToken}"
                   style="background-color:#4CAF50; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; font-size:16px; font-weight:bold; display:inline-block;">
                  Verify Email
                </a>
              </td>
            </tr>
            <tr>
              <td style="color:#888; font-size:14px; line-height:1.6; padding-top:20px; text-align:center;">
                <p style="margin:0;">If you didn't create this account, you can safely ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
        }
        
        // Insert new user into database
        await sql`
        insert into users (email, password, name, verificationToken,verificationTokenExpiresAt)
        values (${email}, ${hashedPassword}, ${name}, ${hashedVerificationToken}, ${verificationTokenExpiresAt} )
        `;
        await transporter.sendMail(maileOptions);

        return res.status(201).json({success:true,message:"User registered successfully.Verification email sent. Please verify your email."});

    }
    catch(error){
        console.log("Error in signup",error);
        res.status(500).json({success:false,message:"Internal server error"});
    }
 
}

export const refreshToken = async(req,res) => {
    const refreshToken = req.cookies.refreshToken;
    
    if(!refreshToken){
        return res.status(401).json({success:false,message:"Refresh token not found, Please login again"});
    }
    
    try{
        const decoded =  jwt.verify(refreshToken,process.env.JWT_SECRET);
        const user = await sql`select * from users where id = ${decoded.id}`;
        if(user.length === 0){
            return res.status(401).json({success:false,message:"Invalid refresh token, user not found"});
        }
        //if you are here, it means refresh token is valid and user exists, generate new access token and refresh token and send to client
        const newAccessToken = jwt.sign({id:user[0].id},process.env.JWT_SECRET,{expiresIn:"10m"});
        const newRefreshToken = jwt.sign({id:user[0].id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.cookie("refreshToken",newRefreshToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"none",
            maxAge:7*24*60*60*1000 // 7 days
        });
        res.status(200).json({success:true,message:"Tokens refreshed successfully",accessToken:newAccessToken,user:user[0]});    
    }
    catch(error){
        console.log("Error in refreshToken",error);
        res.status(500).json({success:false,message:"Internal server error"});
    }
}

export const forgotPassword = async(req, res) => {
    const {email} = req.body;
    
    try{
        if(!email){
            return res.status(400).json({success:false,message:"Email is required"});
        }
        const user = await sql`
            select * from users where email = ${email}
        `; 
        if(user.length === 0){
            return res.status(400).json({success:false,message:"If an account exists with this email, you'll receive a password reset link shortly."});
        }
        //if you are here, it means user with the given email exists, generate reset password token and send email to user
        const resetPasswordToken = crypto.randomBytes(32).toString("hex");
        const hasedResetPasswordToken = await crypto.createHash("sha256").update(resetPasswordToken).digest("hex");
        const resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
        await sql`
            update users
            set resetpasswordtoken = ${hasedResetPasswordToken},
            resetpasswordexpiresat = ${resetPasswordExpiresAt}
            where id = ${user[0].id}
        `;
        const maileOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Reset Password",
            html: `
                <!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f7;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); padding:30px;">
            
            <!-- Header -->
            <tr>
              <td style="text-align:center; padding-bottom:20px;">
                <h2 style="color:#333; margin:0;">Password Reset Request 🔒</h2>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="color:#555; font-size:16px; line-height:1.6; padding-bottom:20px;">
                <p style="margin:0;">Hello <strong>${user[0].name}</strong>,</p>
                <p style="margin:0;">You requested to reset your password. Please click the button below to continue.</p>
              </td>
            </tr>

            <!-- Reset Button -->
            <tr>
              <td style="text-align:center; padding:20px 0;">
                <a href="${process.env.CLIENT_URL}/reset-password?resetPasswordToken=${resetPasswordToken}"
                   target="_blank"
                   style="background-color:#4CAF50; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; font-size:16px; font-weight:bold; display:inline-block;">
                  Reset Password
                </a>
              </td>
            </tr>

            <!-- Expiry Note -->
            <tr>
              <td style="color:#888; font-size:14px; line-height:1.6; padding-top:20px; text-align:center;">
                <p style="margin:0;">This link will expire in <strong>1 hour</strong>.</p>
                <p style="margin:0;">If you didn’t request this, you can safely ignore this email.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

            `
        };
        await transporter.sendMail(maileOptions);
        res.status(200).json({success:true,message:"Reset password email sent. Please check your inbox."});

    }
    catch(error){
        console.log("Error in forgotPassword",error);
        res.status(500).json({success:false,message:"Internal server error"});
    }
}

export const resetPassword = async(req, res) => {
   const {newPassword,resetPasswordToken} = req.body;
   try{
    if(!newPassword || !resetPasswordToken){
        return res.status(400).json({success:false,message:"New password and reset password token are required"});
    }
    const hashedResetPasswordToken = crypto.createHash("sha256").update(resetPasswordToken).digest("hex");
    const user = await sql`
        select * from users where resetPasswordToken = ${hashedResetPasswordToken} and resetPasswordExpiresAt > now()
    `;
    if(user.length === 0){
        return res.status(400).json({success:false,message:"Invalid or expired reset password token"});
    }
    //if you are here, it means reset password token is valid and user exists, hash the new password and update the user's password in database and also remove the reset password token and its expiry time from database
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
         return res.status(400).json({
        error: "Password must be at least 8 characters, include one uppercase letter and one number"
        });
    }
    const hashedNewPassword = await bcryptjs.hash(newPassword,10);
    await sql`
        update users
        set password = ${hashedNewPassword},
        resetPasswordToken = null,
        resetPasswordExpiresAt = null
        where id = ${user[0].id}
    `;
    res.status(200).json({success:true,message:"Password reset successful. Try logging in with your new password."});   


   }
   catch(error){
    console.log("Error in resetPassword",error);
    res.status(500).json({success:false,message:"Internal server error"});
   }
}

export const updateProfile = async (req, res) => {
  try {
    //if evrything is null, means no value provided
    if(!req.body.name && !req.body.bio && !req.body.profilePic)
      return res.status(400).json({success:"false",message:"No fields provided to update"});

    let uploadResponse = null;

    if (req.body.profilePic)
      uploadResponse = await cloudinary.uploader.upload(req.body.profilePic);
    

    const result = await sql`
      UPDATE users
      SET
        name = COALESCE(${req.body.name}, name),
        bio = COALESCE(${req.body.bio}, bio),
        profilePic_url = COALESCE(${uploadResponse ? uploadResponse.secure_url : null}, profilePic_url)
      WHERE id = ${req.user.id}
      RETURNING id, name, bio, profilePic_url;
    `;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: result[0]
    });
  } catch (error) {
    console.error("error in updateProfile", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
