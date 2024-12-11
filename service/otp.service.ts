import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { otps, users } from "../db/schema";
import { generateOtp } from "../utils/generateOtp";
import { sendOtpEmail } from "./mail.service";
import { ApiError } from "../utils/CustomErrors";

export const sendOtp = async ({
  userId,
  email,
}: {
  userId: number;
  email: string;
}) => {
  const otp = generateOtp();
  console.log({ userId, email });
  await db.insert(otps).values({ otp, userId });
  sendOtpEmail(otp, email);
};

export const verifyOtp = async ({
  userId,
  otp,
}: {
  userId: number;
  otp: number;
}) => {
  const otpEntry = await db.query.otps.findFirst({
    where: and(eq(otps.userId, userId), eq(otps.otp, otp)),
  });

  if (!otpEntry) throw new ApiError(400, "Wrong OTP, try again");

  await db
    .update(users)
    .set({ status: "verified" })
    .where(eq(users.id, userId));

  await db.delete(otps).where(eq(otps.id, otpEntry.id));
};
