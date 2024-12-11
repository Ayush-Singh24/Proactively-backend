import { eq } from "drizzle-orm";
import { saltRounds } from "..";
import { db } from "../db/db";
import { speakers, users } from "../db/schema";
import { ApiError } from "../utils/CustomErrors";
import { ISignup } from "../utils/types";
import bcrypt from "bcrypt";

export const signup = async ({
  firstName,
  lastName,
  email,
  password,
  userType,
}: ISignup) => {
  //check if user already exists
  const user = await db.query.users.findFirst({
    where: eq(users?.email, email),
  });
  if (user) throw new ApiError(409, "User already exists");
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = await db
    .insert(users)
    .values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
    })
    .returning();
  if (userType === "speaker") {
    await db.insert(speakers).values({ userId: newUser[0].id });
  }
  return newUser;
};
