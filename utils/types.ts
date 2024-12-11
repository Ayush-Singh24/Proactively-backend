export type UserType = "user" | "speaker";

export interface ISignup {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: UserType;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ISpeakerProfile {
  userId: number;
  expertise: string;
  pricePerSession: number;
}

export interface IGetAllSpeakers {
  date: string;
}

export interface IBookSpeaker {
  userId: number;
  speakerEmail: string;
  slot: TSlot;
  date: string;
}

export type TSlot =
  | "9 AM - 10 AM"
  | "10 AM - 11 AM"
  | "11 AM - 12 PM"
  | "12 PM - 1 PM"
  | "1 PM - 2 PM"
  | "2 PM - 3 PM"
  | "3 PM - 4 PM";
