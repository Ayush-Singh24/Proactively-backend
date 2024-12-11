import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { ILogin } from "../utils/types";
import { users } from "../db/schema";
import { ApiError } from "../utils/CustomErrors";
import bcrypt from "bcrypt";

export const login = async ({ email, password }: ILogin) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) throw new ApiError(404, "User doesn't exist, please sign up!");
  const result = await bcrypt.compare(password, user.password);
  if (result) {
    return [user.id, user.userType];
  } else {
    throw new ApiError(401, "Either email or password is wrong!");
  }
};
