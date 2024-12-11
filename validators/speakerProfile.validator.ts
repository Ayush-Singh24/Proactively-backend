export const speakerProfileValidator = {
  expertise: {
    isString: true,
    optional: false,
    errorMessage: "expertise is required",
  },
  pricePerSession: {
    isNumeric: {
      errorMessage: "pricePerSession should be a number",
    },
    optional: false,
    errorMessage: "pricePerSession is required",
  },
};
