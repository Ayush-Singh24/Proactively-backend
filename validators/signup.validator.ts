import { loginValidator } from "./login.validator";

export const signupValidator = {
  firstName: {
    optional: false,
    isString: true,
    errorMessage: "firstName is required",
  },
  lastName: {
    optional: false,
    isString: true,
    errorMessage: "lastName is required",
  },
  ...loginValidator,
};
