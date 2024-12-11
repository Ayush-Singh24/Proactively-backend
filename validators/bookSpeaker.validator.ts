import { allSlots } from "../utils/constants";

export const bookSpeakerValidator = {
  speakerEmail: {
    isEmail: {
      errorMessage: "Not a valid email",
    },
    optional: false,
    errorMessage: "speakerEmail is required",
  },
  date: {
    isString: true,
    errorMessage: "date is required",
    matches: {
      errorMessage: "date should be in format of dd-mm-yyyy",
      options: /[0-9]{2}-[0-9]{2}-[0-9]{4}/,
    },
  },
  slot: {
    isString: true,
    isIn: {
      options: [allSlots],
      errorMessage:
        "slot should be of format A AM - B PM with 1 hour interval, ex - 9 AM - 10 AM , 3 PM - 4 PM",
    },
    errorMessage: "slot is required",
  },
};
