import express, { json, NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import AuthRouter from "./routes/auth";
import SpeakerRouter from "./routes/speaker";
import UserRouter from "./routes/user";
import { validateToken } from "./utils/validateToken";
import { checkSchema, validationResult } from "express-validator";
import { ValidationError } from "./utils/CustomErrors";
import { handleError } from "./utils/handleError";
import { verifyOtp } from "./service/otp.service";
config();
export const saltRounds = 10;

const PORT = 3000;

const app = express();
app.use(json());
app.use("/auth", AuthRouter);
app.use(
  "/speaker",
  (req, res, next) => validateToken(req, res, next, "speaker"),
  SpeakerRouter
);

app.use(
  "/user",
  (req, res, next) => validateToken(req, res, next, "user"),
  UserRouter
);

app.post(
  "/verify",
  (req: Request, res: Response, next: NextFunction) =>
    validateToken(req, res, next),
  checkSchema({
    otp: {
      isNumeric: true,
      errorMessage: "otp is required",
    },
  }),
  async (req: Request, res: Response) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) throw new ValidationError(result.array());
      await verifyOtp(req.body);
      res.status(200).send({ message: "User verified successfully" });
    } catch (e) {
      handleError(e, res);
    }
  }
);

app.listen(PORT, () => console.log(`App started on PORT: ${PORT}⚡`));
