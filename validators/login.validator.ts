export const loginValidator = {
  email: {
    isEmail: { errorMessage: "Incorrect email" },
    optional: false,
    errorMessage: "email is required",
  },
  password: {
    isString: true,
    optional: false,
    errorMessage: "password is required",
  },
};
