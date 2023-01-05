import { Response } from 'express'
import { Student } from "../models/Student";
import { asyncHandler } from "../middlewares/async";
import { keys } from "../config/keys";
import { getUrl } from "../utils/cloudinary";
// const client = require("twilio")(keys.ACCOUNT_SID, keys.AUTH_TOKEN);

// @ts-ignore
async function generateUniqueUsername(firstname: String) {
  let username = `${firstname}${Math.floor(Math.random() * 1000)}`;
  try {
    const user = await Student.findOne({ username });
    if (user) {
      return await generateUniqueUsername(firstname);
    } else {
      return username;
    }
  } catch (error) {
    console.log({ error });
    return null;
  }
}

// @ts-ignore
export const signup = asyncHandler(async (req, res, next) => {
  const { isNew, firstName, lastName, gender, phoneNum, uri, email } = req.body;
  if (req.file) {
    req.body.avatar = await getUrl(req.file.path);
  } else {
    req.body.avatar = uri;
  }
  let user;
  if (isNew === "true") {
    let username = await generateUniqueUsername(firstName);
    user = await Student.create({
      firstName,
      lastName,
      username,
      gender,
      email,
      avatar: req.body.avatar,
    });
  } else {
    user = await Student.findOne({ email });
  }
  sendTokenResponse(req.body.isNew ? 201 : 200, user, res);
});

// @ts-ignore
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("jwtVerse");
  res.status(200).json({ success: true });
});

const sendTokenResponse = (statusCode: Number, user: any, res: any) => {
  const token = user.getSignedJwtToken();
  // if (keys.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie("jwtVerse", token);

  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    token,
    data: user,
  });
};
