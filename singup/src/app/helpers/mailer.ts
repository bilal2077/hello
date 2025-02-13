import  User from '../models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from "bcryptjs"


export const sendEmail = async({email, emailType, userId}:any) =>{
    try {

      const hashedToken = await bcryptjs.hash(userId.toString(), 10)

      if (emailType === "VERIFY") {
        await User.findByIdAndUpdate
        (userId, {verifyToken : hashedToken, verifyTokenExpiry: Date.now() + 3600000}
      )

      }else if (emailType === "RESET") {
        await User.forgotPasswordToken
        (userId, {verifyToken : hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000}
      )
      }
    
        // Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "201a7bceb2be69",
    pass: "5e4b05817914cc"
  }
});

         const maliOptions = {
            from: 'chentomy33@.gmail.com',
            to: email, 
            subject: emailType === "VERIFY" ? "Verify your email " : "Reset your password", 
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`,
          }
          const mailResponse = await transport.sendMail(maliOptions)
          return mailResponse
    } catch (error: any) {
        throw new Error(error.message)  
    }
}                                                                                                           