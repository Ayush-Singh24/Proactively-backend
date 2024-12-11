import sgMail from "@sendgrid/mail";
import { createCalendarInvite } from "./calendar.service";
import { TSlot } from "../utils/types";
import { readFileSync, unlinkSync } from "fs";
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendOtpEmail = (otp: number, email: string) => {
  const msg = {
    to: email, // Change to your recipient
    from: "asayushsingh80@proton.me", // Change to your verified sender
    subject: "OTP to verify your account",
    html: `<p>Your OTP is ${otp}</p><br><p>Use route '/verify' to enter OTP and verify your email address</p>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

export const sendBookingConfirmationEmail = async (
  user: any,
  speaker: any,
  date: string,
  slot: TSlot,
  bookingId: number
) => {
  await createCalendarInvite(date, slot, user, speaker, bookingId);
  const pathToAttachment = `./ics/${bookingId}.ics`;
  const attachment = readFileSync(pathToAttachment).toString("base64");
  const userMsg = {
    to: user.email, // Change to your recipient
    from: "asayushsingh80@proton.me", // Change to your verified sender
    subject: "Booking confirmation",
    html: `<p>Your booking is confirmed on ${date} at ${slot}</p>`,
    attachments: [
      {
        content: attachment,
        filename: "attachment.ics",
        type: "text/calendar",
        disposition: "attachment",
      },
    ],
  };
  sgMail
    .send(userMsg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });

  const speakerMsg = {
    to: speaker.email, // Change to your recipient
    from: "asayushsingh80@proton.me", // Change to your verified sender
    subject: "Booking confirmation",
    html: `<p>You have been booked on ${date} at ${slot}</p>`,
    attachments: [
      {
        content: attachment,
        filename: "attachment.ics",
        type: "text/calendar",
        disposition: "attachment",
      },
    ],
  };
  sgMail
    .send(speakerMsg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
  setTimeout(() => {
    unlinkSync(pathToAttachment);
  }, 5000);
};
