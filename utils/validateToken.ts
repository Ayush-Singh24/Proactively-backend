import { NextFunction, Request, Response } from "express";
import { ApiError } from "./CustomErrors";
import { handleError } from "./handleError";
import jwt, { JwtPayload } from "jsonwebtoken";

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
  userType?: "speaker" | "user"
) => {
  try {
    const token = req.get("authorization");
    if (token?.startsWith("Bearer")) {
      const splittedTokenArr = token.split(" ");
      const authToken = splittedTokenArr[splittedTokenArr.length - 1];
      const result = jwt.verify(authToken, process.env.SECRET!) as JwtPayload;
      if (result) {
        if (userType) {
          if (result.userType === userType) {
            req.body["userId"] = result.userId;
            next();
          } else {
            throw new ApiError(
              401,
              `You need to be a ${userType} to access this`
            );
          }
        } else {
          req.body["userId"] = result.userId;
          next();
        }
      } else {
        throw new ApiError(401, "Unauthorized");
      }
    } else {
      throw new ApiError(400, "Auth Token missing");
    }
  } catch (e) {
    handleError(e, res);
  }
};
