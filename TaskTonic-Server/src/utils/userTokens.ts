import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";


import { generateToken, verifyToken } from "./jwt";
import { envVars } from "../config";
import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";

export const createUserTokens = (user:any) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        name: user.name
    }
    
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

    return {
        accessToken,
        refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload

    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }


    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        name: isUserExist.name
    }
    
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return accessToken
}