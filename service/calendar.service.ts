import * as ics from "ics";
import { TSlot } from "../utils/types";
import { writeFile } from "fs/promises";

export const createCalendarInvite = async (
  date: string,
  slot: TSlot,
  user: any,
  speaker: any,
  bookingId: number
) => {
  const [dd, month, year] = date.split("-").map((item) => parseInt(item));
  const [startTime, meredieum] = slot.split(" ");
  let start = parseInt(startTime);
  if (meredieum === "PM") {
    start = start + 12;
  }

  const event = {
    start: [year, month, dd, start, 0],
    duration: { hours: 1 },
    title: "Speaker session",
    status: "CONFIRMED",
    organizer: { name: "Support Voice", email: "asayushsingh80@proton.me" },
    attendees: [
      {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
      {
        name: `${speaker.firstName} ${speaker.lastName}`,
        email: speaker.email,
      },
    ],
  };

  //@ts-ignore
  const value = ics.createEvent(event).value;
  if (value) {
    await writeFile(`./ics/${bookingId}.ics`, value);
  }
};
