import express, { Request, Response } from "express";
import { signup } from "../service/signup.service";
import { handleError } from "../utils/handleError";
import { login } from "../service/login.service";
import jwt from "jsonwebtoken";
import { checkSchema, validationResult } from "express-validator";
import { ValidationError } from "../utils/CustomErrors";
import { loginValidator } from "../validators/login.validator";
import { signupValidator } from "../validators/signup.validator";
import { sendOtpEmail } from "../service/mail.service";
import { sendOtp } from "../service/otp.service";

const router = express.Router();

router.post(
  "/signup",
  checkSchema(signupValidator),
  async (req: Request, res: Response) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) throw new ValidationError(result.array());
      const user = await signup(req.body);
      sendOtp({ userId: user[0].id, email: user[0].email });
      res.status(201).send({ message: "Success", user: user[0].id });
      console.log(
        `User added of type ${user[0].userType} with id: ${user[0].id}`
      );
    } catch (e) {
      handleError(e, res);
    }
  }
);

router.post(
  "/login",
  checkSchema(loginValidator),
  async (req: Request, res: Response) => {
    try {
      const [userId, userType] = await login(req.body);
      const token = jwt.sign({ userId, userType }, process.env.SECRET!);
      res
        .status(200)
        .send({ message: "Logged in Successfully!", token, userId });
    } catch (e) {
      handleError(e, res);
    }
  }
);

export default router;
