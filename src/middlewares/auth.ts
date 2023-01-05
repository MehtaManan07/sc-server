// @ts-nocheck
import jwt from "jsonwebtoken";
import { asyncHandler } from "./async";
import ErrorResponse from "./ErrorResponse";
import { Student } from "../models/Student";
import { keys } from "../config/keys";

// Protected routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwtVerse) {
    token = req.cookies.jwtVerse;
  }
  // Make sure token is send;
  if (!token) {
    return next(
      new ErrorResponse("Not authorized to access the resource", 401)
    );
  }

  try {
    // verify token
    const decoded = jwt.verify(token, keys.JWT_SECRET);
    const user = await Student.findById(decoded.id);
    if(!user){
      return next(
        new ErrorResponse("Not authorized to access the resource", 401)
      );
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(`reached errorr`);
    console.log({ error });
    return next(
      new ErrorResponse("Not authorized to access the resource", 401)
    );
  }
});

// Grant access to specific roles...
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is unauthorized to access this route`,
          401
        )
      );
    }
    next();
  };
};
