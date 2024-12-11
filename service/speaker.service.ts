import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { IBookSpeaker, IGetAllSpeakers, ISpeakerProfile } from "../utils/types";
import { bookings, speakers, users } from "../db/schema";
import { ApiError } from "../utils/CustomErrors";
import { allSlots } from "../utils/constants";
import { sendBookingConfirmationEmail } from "./mail.service";
import { createCalendarInvite } from "./calendar.service";

export const SpeakerProfile = async ({
  userId,
  expertise,
  pricePerSession,
}: ISpeakerProfile) => {
  const speaker = await db.query.speakers.findFirst({
    where: eq(speakers?.userId, userId),
  });

  if (!speaker)
    throw new ApiError(400, "User doesn't exist as Speaker with given ID");

  await db
    .update(speakers)
    .set({
      expertise,
      pricePerSession: parseFloat(pricePerSession.toFixed(2)),
    })
    .where(eq(speakers.userId, userId));
  return userId;
};

export const getAllSpeakers = async ({ date }: IGetAllSpeakers) => {
  const allSpeakers = await db.query.users.findMany({
    where: eq(users.userType, "speaker"),
    with: { speaker: true },
  });

  const bookedSlotsSet = new Set();
  for (const speaker of allSpeakers) {
    const speakerEntry = await db.query.speakers.findFirst({
      where: eq(speakers.userId, speaker.id),
      with: { bookings: true },
    });
    if (speakerEntry?.bookings) {
      for (const booking of speakerEntry?.bookings) {
        if (booking.date === date) {
          bookedSlotsSet.add(booking.slot);
        }
      }
    }
  }

  console.log("Vals", Array.from(bookedSlotsSet.values()));

  const result = allSpeakers.map((item) => ({
    email: item.email,
    firstName: item.firstName,
    lastName: item.lastName,
    expertise: item.speaker!.expertise,
    pricePerSession: item.speaker!.pricePerSession,
    status: item.status,
    availableSlots: allSlots.filter((slot) => !bookedSlotsSet.has(slot)),
  }));

  return result;
};

export const bookSpeaker = async ({
  userId,
  speakerEmail,
  slot,
  date,
}: IBookSpeaker) => {
  const user = await db.query.users.findFirst({
    where: and(eq(users.id, userId), eq(users.userType, "user")),
  });

  if (!user) throw new ApiError(400, "User doesn't exist");
  const speaker = await db.query.users.findFirst({
    where: and(eq(users.email, speakerEmail), eq(users.userType, "speaker")),
    with: {
      speaker: true,
    },
  });

  if (!speaker)
    throw new ApiError(400, "Speaker with given email doesn't exist");

  const booking = await db.query.bookings.findFirst({
    where: and(
      eq(bookings.speakerId, speaker.speaker!.id),
      eq(bookings.date, date),
      eq(bookings.slot, slot)
    ),
  });

  if (booking)
    throw new ApiError(
      409,
      "Speaker is not available for that slot, please try with some other slot"
    );

  const newBooking = await db
    .insert(bookings)
    .values({
      userId: user.id,
      speakerId: speaker.speaker!.id,
      date,
      slot,
    })
    .returning();

  //send email notification with calendar invite
  sendBookingConfirmationEmail(user, speaker, date, slot, newBooking[0].id);
  return newBooking;
};
