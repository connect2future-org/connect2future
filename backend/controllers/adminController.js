const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Admin = require("../models/Admin");


const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



const loginAdmin=async(req,res)=>{
try{

const{email,password}=req.body;
console.log("Email:", email);
console.log("Password:", password);

if(!email||!password){
return res.status(400).json({
success:false,
message:"Please provide email and password."
});
}

const admin=await Admin.findOne({email});
console.log("Admin Found:", admin);

if(!admin){
return res.status(401).json({
success:false,
message:"Invalid credentials."
});
}

const isMatch=await admin.comparePassword(password);
console.log("Password Match:",isMatch);


if(!isMatch){
return res.status(401).json({
success:false,
message:"Invalid credentials."
});
}

const token=jwt.sign(
{
id:admin._id
},
process.env.JWT_SECRET,
{
expiresIn:"7d"
}
);

res.status(200).json({
success:true,
token,
admin:{
id:admin._id,
name:admin.name,
email:admin.email
}
});

}
catch(error){

console.error(error);

res.status(500).json({
success:false,
message:"Server Error"
});

}
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Always return the same response to avoid revealing
    // whether an admin account exists.
    const successMessage =
      "If the admin account is eligible for password reset, a reset link has been sent to HR.";

    if (!email) {
      return res.status(200).json({
        success: true,
        message: successMessage,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Only this admin email is allowed to initiate the reset.
    if (normalizedEmail !== "admin@connect2future.com")  {
      return res.status(200).json({
        success: true,
        message: successMessage,
      });
    }

    const admin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (!admin) {
      return res.status(200).json({
        success: true,
        message: successMessage,
      });
    }

    // Generate a secure random token.
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only the hash of the token in MongoDB.
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    admin.resetPasswordToken = hashedToken;

    // Token expires in 30 minutes.
    admin.resetPasswordExpires = Date.now() + 30 * 60 * 1000;

    await admin.save();

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const resetUrl =
      `${frontendUrl}/admin/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"Connect2Future" <${process.env.EMAIL_USER}>`,
      to: "hr@connect2future.com",
      subject: "Connect2Future Admin Password Reset",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          color: #333;
        ">

          <h2 style="color: #db2777;">
            Connect2Future Admin Password Reset
          </h2>

          <p>
            A password reset was requested for the
            Connect2Future administrator account.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background: #db2777;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
            "
          >
            Reset Admin Password
          </a>

          <p style="margin-top: 25px;">
            This password reset link will expire in
            <strong>30 minutes</strong>.
          </p>

          <p>
            If you did not request this password reset,
            you can safely ignore this email.
          </p>

          <p style="margin-top: 30px;">
            Connect2Future Team
          </p>

        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: successMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process password reset request.",
    });
  }
};



const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired.",
      });
    }

    // Changing password triggers your existing bcrypt pre-save hook.
    admin.password = password;

    // Invalidate the reset token immediately.
    admin.resetPasswordToken = null;
    admin.resetPasswordExpires = null;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password.",
    });
  }
};



module.exports = {
  loginAdmin,
  forgotPassword,
  resetPassword
};