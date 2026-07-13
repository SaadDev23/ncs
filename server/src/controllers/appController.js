import UserModel from "../model/User.model.js";
import UpCompModel from "../model/UpComp.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pastpaperModel from "../model/Pastpaper.model.js";
import onSiteCompetitionsModel from "../model/onSiteCompetitions.model.js";
import registrationsModel from "../model/registrations.model.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  generateVerificationCode,
} from "../utils/emailService.js";
let existUsername, sessionUser;

/** POST: http://localhost:8080/api/register
 * @param: {
  "username" : "example123", 
  "password" : "admin123",
  "confirmPass" : "admin123",
  "email" : "example@gmail.com",
  "profile" : ""
}
 */
export async function register(req, res) {
  try {
    const {
      username,
      password,
      confirmPass,
      profile,
      email,
      picturePath,
      phoneNumber,
    } = req.body;

    // Check existing user
    const existUsername = await UserModel.findOne({ username }).exec();

    // Check existing email
    const existEmail = await UserModel.findOne({ email }).exec();

    if (existUsername) {
      return res.status(400).send({ error: "username already exist" });
    }

    if (existEmail) {
      return res.status(400).send({ error: "Email already exist" });
    }

    if (password !== confirmPass) {
      return res.status(500).send({ error: "Passwords do not match" });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationCode = generateVerificationCode();
      const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      const user = new UserModel({
        username,
        password: hashedPassword,
        profile: profile || "",
        email,
        role: "student",
        picturePath,
        likedPosts: [],
        isVerified: false,
        verificationCode,
        verificationCodeExpiry,
      });

      // Save user to the database
      const savedUser = await user.save();

      // Send verification email
      try {
        await sendVerificationEmail(email, verificationCode, username);
        res.status(201).send({
          msg: "User registered successfully. Please check your email for verification code.",
          email: email,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Delete the user if email fails
        await UserModel.deleteOne({ _id: savedUser._id });
        return res.status(500).send({
          error: "Failed to send verification email. Please try again.",
        });
      }
    }
  } catch (error) {
    // Handle the error
    console.error(error);
    res.status(500).send({ error: "Unable to register user" });
  }
}

/** POST: http://localhost:8080/api/login
 * @param: {
  "username" : "example123", 
  "password" : "admin123"
}
 */
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Check if a user with the given username exists in the database.
    const existUsername = await UserModel.findOne({ username }).exec();

    if (!existUsername) {
      return res.status(400).send({ error: "Incorrect username" });
    }

    // Check if email is verified
    if (!existUsername.isVerified) {
      return res.status(403).send({
        error: "Please verify your email before logging in",
        needsVerification: true,
        email: existUsername.email,
      });
    }

    // Compare the provided password with the hashed password stored in the database.
    const passwordMatch = await bcrypt.compare(
      password,
      existUsername.password,
    );

    if (!passwordMatch) {
      return res.status(400).send({ error: "Incorrect Password" });
    }

    // Fetch the role from the MongoDB value named "role"
    const role = existUsername.role;

    // Generate a JWT token
    const token = jwt.sign({ id: existUsername._id }, "programmingforlife");

    // Omit the password from the response
    delete existUsername.password;
    const userInfo = {
      id: existUsername._id,
      username: existUsername.username,
      email: existUsername.email,
      role: existUsername.role,
      aboutme: existUsername.aboutme,
      likedPosts: existUsername.likedPosts,
      profilepicture: existUsername.profilePicture,
    };
    sessionUser = userInfo;
    req.session.user = userInfo;
    await req.session.save();

    // console.log('Session user:', req.session.user); // Add this line

    // Send a response object containing token, username, and role
    res.status(200).json({
      username: existUsername.username,
      role,
      access: token,
      userInfo,
    });
  } catch (error) {
    // Handle the error properly, e.g., log it
    console.error(error);
    res.status(500).send({ error: "Unable to login" });
  }
}

export async function adminLogin(req, res) {
  try {
    const { username, password } = req.body;

    // Check if a user with the given username exists in the database.
    const existUsername = await UserModel.findOne({ username }).exec();

    if (!existUsername) {
      return res.status(400).send({ error: "Incorrect username" });
    }
    // console.log(existUsername.role)
    if (existUsername.role != "admin") {
      return res.status(403).send({ error: "Forbidden" });
    }

    // Compare the provided password with the hashed password stored in the database.
    const passwordMatch = await bcrypt.compare(
      password,
      existUsername.password,
    );

    if (!passwordMatch) {
      return res.status(400).send({ error: "Incorrect Password" });
    }

    // Fetch the role from the MongoDB value named "role"
    const role = existUsername.role;

    // Generate a JWT token
    const token = jwt.sign({ id: existUsername._id }, "programmingforlife");

    // Omit the password from the response
    delete existUsername.password;

    const userInfo = {
      id: existUsername._id,
      username: existUsername.username,
      email: existUsername.email,
      role: existUsername.role,
      aboutme: existUsername.aboutme,
      profilepicture: existUsername.profilePicture,
    };
    sessionUser = userInfo;
    req.session.user = userInfo;
    await req.session.save();

    // console.log('Session user:', req.session.user); // Add this line

    // Send a response object containing token, username, and role
    res.status(200).json({
      username: existUsername.username,
      role,
      access: token,
      userInfo,
    });
  } catch (error) {
    // Handle the error properly, e.g., log it
    console.error(error);
    res.status(500).send({ error: "Unable to login" });
  }
}

//  GET: http://localhost:8080/api/me

export async function userSessionInfo(req, res) {
  try {
    // console.log('helo')
    // console.log(sessionUser)
    res.status(200).json({ sessionUser });
  } catch (error) {
    // Handle the error properly, e.g., log it
    console.error(error);
    res.status(500).send({ error: `Can't fetch user SessionInfo ` });
  }
}

//  POST: http://localhost:8080/api/logout

export async function logout(req, res) {
  try {
    req.session.destroy();
    sessionUser = null;
    res.send("logged Out successfully");
  } catch (error) {
    // Handle the error properly, e.g., log it
    console.error(error);
    res.status(500).send({ error: "Unable to Logout" });
  }
}

/** POST: http://localhost:8080/api/verify-email
 * @param: {
  "email" : "example@gmail.com",
  "verificationCode" : "123456"
}
 */
export async function verifyEmail(req, res) {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res
        .status(400)
        .send({ error: "Email and verification code are required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).send({ error: "Email is already verified" });
    }

    // Check if verification code is correct
    if (user.verificationCode !== verificationCode) {
      return res.status(400).send({ error: "Invalid verification code" });
    }

    // Check if verification code has expired
    if (new Date() > user.verificationCodeExpiry) {
      return res.status(400).send({ error: "Verification code has expired" });
    }

    // Update user to verified
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    res
      .status(200)
      .send({ msg: "Email verified successfully. You can now login." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Unable to verify email" });
  }
}

/** POST: http://localhost:8080/api/resend-verification-code
 * @param: {
  "email" : "example@gmail.com"
}
 */
export async function resendVerificationCode(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ error: "Email is required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).send({ error: "Email is already verified" });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = verificationCodeExpiry;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode, user.username);
      res.status(200).send({ msg: "Verification code sent to your email" });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res
        .status(500)
        .send({ error: "Failed to send verification email" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Unable to resend verification code" });
  }
}

/** POST: http://localhost:8080/api/forgot-password
 * @param: {
  "email" : "example@gmail.com"
}
 */
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ error: "Email is required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Generate reset code
    const resetCode = generateVerificationCode();
    const resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetCode;
    user.resetPasswordExpiry = resetPasswordExpiry;
    await user.save();

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, resetCode, user.username);
      res
        .status(200)
        .send({ msg: "Password reset code sent to your email", email: email });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res
        .status(500)
        .send({ error: "Failed to send password reset email" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "Unable to process forgot password request" });
  }
}

/** POST: http://localhost:8080/api/verify-reset-code
 * @param: {
  "email" : "example@gmail.com",
  "resetCode" : "123456"
}
 */
export async function verifyResetCode(req, res) {
  try {
    const { email, resetCode } = req.body;

    if (!email || !resetCode) {
      return res
        .status(400)
        .send({ error: "Email and reset code are required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Check if reset code is correct
    if (user.resetPasswordToken !== resetCode) {
      return res.status(400).send({ error: "Invalid reset code" });
    }

    // Check if reset code has expired
    if (new Date() > user.resetPasswordExpiry) {
      return res.status(400).send({ error: "Reset code has expired" });
    }

    res.status(200).send({ msg: "Reset code verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Unable to verify reset code" });
  }
}

/** POST: http://localhost:8080/api/reset-password
 * @param: {
  "email" : "example@gmail.com",
  "resetCode" : "123456",
  "newPassword" : "newPassword123",
  "confirmPassword" : "newPassword123"
}
 */
export async function resetPassword(req, res) {
  try {
    const { email, resetCode, newPassword, confirmPassword } = req.body;

    if (!email || !resetCode || !newPassword || !confirmPassword) {
      return res.status(400).send({ error: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).send({ error: "Passwords do not match" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Check if reset code is correct
    if (user.resetPasswordToken !== resetCode) {
      return res.status(400).send({ error: "Invalid reset code" });
    }

    // Check if reset code has expired
    if (new Date() > user.resetPasswordExpiry) {
      return res.status(400).send({ error: "Reset code has expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    res.status(200).send({
      msg: "Password reset successfully. Please login with your new password.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Unable to reset password" });
  }
}

/**GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
  const { username } = req.params;
  // console.log(username)

  try {
    //Check if any username entered
    if (!username) return res.status(400).send({ error: "No user entered" });

    //Check whether the user exists or not
    existUsername = await UserModel.findOne({ username }).exec();
    if (!existUsername) {
      res.status(404).send({ error: "No such user Exists" });
    }
    //Filter out Password
    const { password, ...rest } = Object.assign({}, existUsername.toJSON());

    //Send success response with user data
    res.status(200).send(rest);
  } catch (error) {
    // Handle the error
    console.error(error);
    res.status(500).send({ error: "Unable to Find User" });
  }
}

/** PUT: http://localhost:8080/api/update-profile
 * @body: {
  "id" : "<userid>"
  "aboutme" 
}
*/
export async function updateUser(req, res) {
  const { aboutMe, userId } = req.body;
  const user = await UserModel.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ error: "No user" });
  }
  if (!aboutMe) {
    return res.status(400).json({ error: "About Me is required" });
  }

  // Update the user data (this might involve a database operation in a real-world scenario)
  user.aboutme = aboutMe;
  await user.save();
  sessionUser.aboutme = aboutMe;
  // console.log(`about is ${user.aboutme}`)
  // Respond with the updated user data
  res.status(200).json({ success: true, aboutMe: aboutMe });
}

export async function updateUserProfile(req, res) {
  const { userId, profilePicture } = req.body;
  console.log("🚀 ~ updateUserProfile ~ profilePicture :", profilePicture);
  // console.log(profilePicture)
  // console.log('inside user profile controller')
  try {
    // Update the user's profile picture in MongoDB
    await UserModel.findByIdAndUpdate(userId, { profilePicture });

    res.status(200).json({ message: "Profile picture updated successfully" });
    sessionUser.profilepicture = profilePicture;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**GET : http://localhost:8080/api/get-onsite-competitions */
export async function getOnsiteCompetitions(req, res) {
  try {
    console.log("inside get onsite controller");
    // Update the user's profile picture in MongoDB
    const registerations = await onSiteCompetitionsModel
      .find()
      .sort({ createdAt: -1 });
    console.log(registerations);
    res.status(200).json(registerations);
  } catch (error) {
    console.error("Error fetching registerations", error);
    res.status(500).json({ error: "Error fetching registerations" });
  }
}
/**POST : http://localhost:8080/api/onsite-competitions */
export async function onSiteCompetition(req, res) {
  const { title, date, max_registerations, location } = req.body;
  console.log(req.body);

  try {
    // Update the user's profile picture in MongoDB
    await onSiteCompetitionsModel.create({
      title,
      date,
      max_registerations,
      location,
    });

    res.status(201).json({ message: "On Site Competition Created" });
  } catch (error) {
    console.error("Error Creating On Site Competition:", error);
    res.status(500).json({ error: "Error Creating On Site Competition" });
  }
}

/**POST : http://localhost:8080/api/delete-onsite-competitions */
export async function deleteOnSiteCompetition(req, res) {
  const { id } = req.body;
  console.log(req.body);

  try {
    // Update the user's profile picture in MongoDB
    await onSiteCompetitionsModel.deleteOne({
      _id: id,
    });

    res.status(201).json({ message: "On Site Competition Deleted" });
  } catch (error) {
    console.error("Error Deleting On Site Competition:", error);
    res.status(409).json({ error: "Error Deleting On Site Competition" });
  }
}

/**POST : http://localhost:8080/api/register-onsite */
export async function registerForOnsiteCompetition(req, res) {
  const { title, member1, member2, member3, phoneNumber, teamName } = req.body;
  if (!title || !member1 || !member2 || !member3 || !phoneNumber || !teamName) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  console.log(req.body);
  const onsiteComp = await onSiteCompetitionsModel.findOne({ title: title });
  if (!onsiteComp)
    return res.status(400).json({ error: "Title Does not Exist" });

  console.log(onsiteComp);
  onsiteComp.registerations_completed = onsiteComp.registerations_completed + 1;
  onsiteComp.save();

  try {
    // Update the user's profile picture in MongoDB
    await registrationsModel.create({
      title,
      member1,
      member2,
      member3,
      phone_number: phoneNumber,
      team_name: teamName,
    });

    res.status(201).json({ message: "Registeration Successful" });
  } catch (error) {
    console.error("Registeration Failed:", error);
    res.status(500).json({ error: "Error Registering for Competition" });
  }
}

/**GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
  res.json("generateOTP route");
}

/**GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
  res.json("verifyOTP route");
}

// successfuly redirect user when OTP is valid
/**GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
  res.json("createResetSession route");
}

//update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword
 * @param: {
  "id" : "<userid>"
}
body: {
  "firstName" : '', 
  "address" : '',
  "profile" : ''
}
 */
export async function resetPasswordOld(req, res) {
  res.json("resetPassword route");
}

//********* ADMIN  **********/

/** Upcoming competitions */
/** POST: http://localhost:8080/api/admin-uc */
export async function upcomingComp(req, res) {
  try {
    const { title, date, location, link, kind } = req.body;

    // Check existing competition
    const existTitle = await UserModel.findOne({ title }).exec();

    // Check existing link
    const existLink = await UserModel.findOne({ link }).exec();

    if (existTitle) {
      return res.status(400).send({ error: "Competition Already Posted" });
    }

    if (existLink) {
      return res.status(400).send({ error: "Link Already Posted" });
    }

    const comp = new UpCompModel({
      title,
      link,
      date,
      location,
      kind,
    });

    // Save user to the database
    await comp.save();

    res.status(201).send({ msg: "Upcoming Competition Uploaded Successfully" });
  } catch (error) {
    // Handle the error
    console.error(error);
    res.status(500).send({ error: "Unable to Upload Competition" });
  }
}

/** GET: http://localhost:8080/api/competitions */
export async function getComp(req, res) {
  try {
    //Check whether the user exists or not
    const data = await UpCompModel.find().exec();
    if (!data) {
      res.status(404).send({ error: "No such Title Exists" });
    }
    //Send success response with user data
    res.status(200).send(data);
  } catch (error) {
    // Handle the error
    console.error(error);
    res.status(500).send({ error: "Unable to Find Competition" });
  }
}
//**DELETE 52.200.18.237:8080/api/pastpapers/
export async function deletePastPaper(req, res) {
  try {
    const id = req.body.id;
    // console.log(req.body)
    // console.log(`params is ${req.params}`)
    await pastpaperModel.deleteOne({ _id: id });
    res.sendStatus(204);
  } catch (error) {
    throw new Error("could not delete the past paper");
  }
}

/** GET: http://localhost:8080/api/pastpapers */
export async function getPastPapers(req, res) {
  try {
    //Check whether the user exists or not
    const data = await pastpaperModel.find().exec();
    if (!data) {
      res.status(404).send({ error: "data not found" });
    }
    //Send success response with user data
    res.status(200).send(data);
  } catch (error) {
    // Handle the error
    console.error(error);
    res.status(500).send({ error: "Unable to Find Competition" });
  }
}

/** POST: http://localhost:8080/api/pastpapers */
export async function postPastPapers(req, res) {
  try {
    const { name, link, kind, date } = req.body;

    //Check whether the user exists or not

    const paper = new pastpaperModel({
      name,
      link,
      kind,
      date,
    });

    // Save user to the database
    await paper.save();

    res.status(201).send({ msg: "Past Paper Uploaded Successfully" });
  } catch (error) {
    // Handle the error
    console.error(error);
    res.status(500).send({ error: "Unable to upload Past Paper" });
  }
}

/** user - profile - traits */
// export const fetchUser = async (req,res) => {
//   try{
//     const {id} = req.params;
//     const user = await UserModel.findById(id);
//     res.status(200).json(user);
//   } catch(err){
//     res.status(404).json({message: err.message});
//   }
// }

// export const getUserFriends = async (req,res) => {
//   try{
//     const {id} = req.params;
//     const user = await UserModel.findById(id);

//     const friends = await Promise.all(
//     user.friends.map((id)=> UserModel.findById(id))
//     );
//     const formattedFriends = friends.map(
//       ({ _id, username, password, confirmPass, profile, email, picturePath, friends }) => {
//         return{ _id, username, password, confirmPass, profile, email, picturePath, friends};
//       }
//     );
//   } catch(err){
//     res.status(404).json({message: err.message});
//   }
// }

// export const addRemoveFriend = async (req,res) => {
//   try{
//     const {id, friendId} = req.params;
//     const user = await UserModel.findById(id);
//     const friend = await UserModel.findById(friendId);
//     if(user.friends.includes(friendId)) {
//       user.friends = user.friends.filter((id)=> id !== friendId);
//       friend.friends = friend.friends.filter((id)=> id!== id);
//     }
//     else{
//       user.friends.push(friendId);
//       friend.friends.push(id);
//     }

//     await user.save();
//     await friend.save();

//     const friends = await Promise.all(
//       user.friends.map((id)=> UserModel.findById(id))
//       );
//       const formattedFriends = friends.map(
//         ({ _id, username, password, confirmPass, profile, email, picturePath, friends }) => {
//           return{ _id, username, password, confirmPass, profile, email, picturePath, friends};
//         }
//       );

//       res.status(200).json(formattedFriends);

//   } catch (err){
//     res.status(404).json({message: err.message})
//   }
// }
