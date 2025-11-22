import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "./user.model";
import { envVars } from "../../config";
import bcryptjs from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";

const register = async (payload: { name: string; email: string; password: string }) => {
  const { email, password, name } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcryptjs.hash(password, Number(envVars.BCRYPT_SALT_ROUND));
  
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const { password: _, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

const login = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid email or password");
  }

  // Generate tokens
  const jwtPayload = {
    userId: user._id,
    email: user.email,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  const { password: _, ...userWithoutPassword } = user.toObject();

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};

const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const refreshToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};

export const UserServices = {
  register,
  login,
  getProfile,
  refreshToken,
};