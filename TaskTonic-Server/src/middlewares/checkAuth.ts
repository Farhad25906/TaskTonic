import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import httpStatus from "http-status-codes"
import { envVars } from "../config";
import { User } from "../modules/user/user.model";



export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization || req.cookies.accessToken;

    if (!accessToken) {
      throw new AppError(403, "No Token Received")
    }

    const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload
    // console.log(verifiedToken);
    

    const isUserExist = await User.findOne({ email: verifiedToken.email })
    // console.log(isUserExist);
    

    if (!isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }

    req.user = verifiedToken
    next()

  } catch (error) {
    console.log("JWT error", error);
    next(error)
  }
}