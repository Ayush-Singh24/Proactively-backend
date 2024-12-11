export const getAllSpeakersValidator = {
  date: {
    isString: true,
    errorMessage: "date is required",
    matches: {
      errorMessage: "date should be in format of dd-mm-yyyy",
      options: /[0-9]{2}-[0-9]{2}-[0-9]{4}/,
    },
  },
};
