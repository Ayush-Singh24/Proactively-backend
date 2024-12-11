import { Response } from "express";
import { ApiError, ValidationError } from "./CustomErrors";

export const handleError = (e: any, res: Response) => {
  if (e instanceof ApiError) {
    res.status(e.status).send({ error: e.message });
  } else if (e instanceof ValidationError) {
    res.status(400).send({ error: e.error });
  } else {
    console.log(e);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
