import express, { Request, Response } from "express";
import { SpeakerProfile } from "../service/speaker.service";
import { handleError } from "../utils/handleError";
import { checkSchema, validationResult } from "express-validator";
import { speakerProfileValidator } from "../validators/speakerProfile.validator";
import { ValidationError } from "../utils/CustomErrors";

const router = express.Router();

router.patch(
  "/profile",
  checkSchema(speakerProfileValidator),
  async (req: Request, res: Response) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) throw new ValidationError(result.array());
      const userId = await SpeakerProfile(req.body);
      res
        .status(200)
        .send({ message: "Added expertise and price per session", userId });
    } catch (e) {
      handleError(e, res);
    }
  }
);

export default router;
