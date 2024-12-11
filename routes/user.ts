import express, { Request, Response } from "express";
import { handleError } from "../utils/handleError";
import { bookSpeaker, getAllSpeakers } from "../service/speaker.service";
import { checkSchema, validationResult } from "express-validator";
import { ValidationError } from "../utils/CustomErrors";
import { getAllSpeakersValidator } from "../validators/getAllSpeakers.validator";
import { bookSpeakerValidator } from "../validators/bookSpeaker.validator";

const router = express.Router();

router.get(
  "/allSpeakers",
  checkSchema(getAllSpeakersValidator),
  async (req: Request, res: Response) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) throw new ValidationError(result.array());
      const allSpeakers = await getAllSpeakers({
        date: req.query.date as string,
      });
      res.status(200).send({ message: "Success", data: allSpeakers });
    } catch (e) {
      handleError(e, res);
    }
  }
);

router.post(
  "/book",
  checkSchema(bookSpeakerValidator),
  async (req: Request, res: Response) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) throw new ValidationError(result.array());
      const newBooking = await bookSpeaker(req.body);
      res.status(201).send({
        message: "Slot booked successfully",
        bookingId: newBooking[0].id,
      });
    } catch (e) {
      handleError(e, res);
    }
  }
);

export default router;
